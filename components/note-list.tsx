"use client"

import * as React from "react"
import NoteItem from "./note-item"
import { useAuth } from "@clerk/nextjs"
import { createSupabaseClientBrowserAuthed } from "@/lib/supabase-browser"

type NoteListItem = {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export function NoteList() {
  const [notes, setNotes] = React.useState<NoteListItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { isSignedIn, userId, getToken } = useAuth()

  React.useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const res = await fetch("/api/notes/list", { cache: "no-store" })
        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg || "Failed to load notes")
        }
        const data = await res.json()
        if (mounted) setNotes(Array.isArray(data?.notes) ? data.notes : [])
      } catch (e: any) {
        if (mounted) setError(e?.message || "Error loading notes")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Realtime subscription for notes changes
  React.useEffect(() => {
    if (!isSignedIn || !userId) return

    let supabase: ReturnType<typeof createSupabaseClientBrowserAuthed> | null = null
    let channel: any = null

    let cancelled = false

    async function setupRealtime() {
      try {
        const token = await getToken({ template: "supabase" })
        if (!token) return
        if (cancelled) return

        supabase = createSupabaseClientBrowserAuthed(token)
        // Ensure Realtime websocket uses the Clerk JWT
        try { (supabase as any).realtime.setAuth(token) } catch {}

        channel = supabase
          .channel("realtime:notes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "notes", filter: `user_id=eq.${userId}` },
            (payload: any) => {
              const { eventType, new: newRow, old: oldRow } = payload
              setNotes((prev) => {
                if (eventType === "INSERT") {
                  const exists = prev.some((n) => n.id === newRow.id)
                  const next = exists ? prev.map((n) => (n.id === newRow.id ? { ...n, ...newRow } : n)) : [{
                    id: newRow.id,
                    title: newRow.title,
                    created_at: newRow.created_at,
                    updated_at: newRow.updated_at,
                  }, ...prev]
                  return next
                }
                if (eventType === "UPDATE") {
                  return prev.map((n) =>
                    n.id === newRow.id
                      ? { ...n, title: newRow.title, updated_at: newRow.updated_at }
                      : n
                  )
                }
                if (eventType === "DELETE") {
                  return prev.filter((n) => n.id !== oldRow.id)
                }
                return prev
              })
            }
          )
          .subscribe()
      } catch (e) {
        // ignore; errors will be surfaced via list fetch
      }
    }

    setupRealtime()

    return () => {
      cancelled = true
      if (supabase && channel) {
        try { supabase.removeChannel(channel) } catch {}
      }
    }
  }, [isSignedIn, userId, getToken])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 rounded-md bg-muted animate-pulse" />
        <div className="h-8 rounded-md bg-muted animate-pulse" />
        <div className="h-8 rounded-md bg-muted animate-pulse" />
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  if (!notes.length) {
    return <div className="text-sm text-muted-foreground">No notes yet</div>
  }

  return (
    <div className="space-y-1">
      {notes.map((n) => (
        <NoteItem key={n.id} note={n} />
      ))}
    </div>
  )
}

export default NoteList


