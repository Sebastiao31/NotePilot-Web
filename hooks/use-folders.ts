"use client"

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { createSupabaseClientBrowserAuthed } from "@/lib/supabase-browser"
import { onFoldersInsert } from "@/lib/events"

export type Folder = {
  id: string
  name: string
  color: string | null
  note_id: string
  created_at: string
}

export function useFolders() {
  const { getToken, isSignedIn } = useAuth()
  const [folders, setFolders] = React.useState<Folder[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const reload = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/folders/list", { cache: "no-store" })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setFolders(Array.isArray(data?.folders) ? data.folders : [])
      setError(null)
    } catch (e: any) {
      setError(e?.message || "Failed to load folders")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      await reload()
    })()
    return () => {
      mounted = false
    }
  }, [reload])

  // Optimistic insert listener
  React.useEffect(() => {
    const off = onFoldersInsert((payload) => {
      setFolders((prev) => {
        if (prev.some((f) => f.id === payload.id)) return prev
        const next = [{
          id: payload.id,
          name: payload.name,
          color: payload.color,
          note_id: payload.note_id ?? "",
          created_at: payload.created_at || new Date().toISOString(),
        }, ...prev]
        return next
      })
    })
    return () => off()
  }, [])

  React.useEffect(() => {
    if (!isSignedIn) return

    let supabase: ReturnType<typeof createSupabaseClientBrowserAuthed> | null = null
    let channel: any = null
    let cancelled = false

    async function setupRealtime() {
      try {
        const token = await getToken({ template: "supabase" })
        if (!token) return
        if (cancelled) return

        supabase = createSupabaseClientBrowserAuthed(token)
        try { (supabase as any).realtime.setAuth(token) } catch {}

        channel = supabase
          .channel("realtime:folders")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "folders" },
            () => {
              // Simple approach: refresh list on any folder change
              reload()
            }
          )
          .subscribe()
      } catch {
        // ignore
      }
    }

    setupRealtime()

    return () => {
      cancelled = true
      if (supabase && channel) {
        try { supabase.removeChannel(channel) } catch {}
      }
    }
  }, [isSignedIn, getToken, reload])

  return { folders, loading, error, reload }
}


