'use client'

import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { IconLink, IconPointFilled } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { usePathname } from 'next/navigation'
import { ScrollArea } from './ui/scroll-area'

export function Transcript() {
    const pathname = usePathname()
    const [type, setType] = React.useState<string | null>(null)
    const [createdAt, setCreatedAt] = React.useState<string | null>(null)
    const [updatedAt, setUpdatedAt] = React.useState<string | null>(null)
    const [url, setUrl] = React.useState<string | null>(null)
    const [transcript, setTranscript] = React.useState<string | null>(null)

    React.useEffect(() => {
      // Extract note id from /notes/[id] path
      const m = typeof pathname === 'string' ? pathname.match(/^\/notes\/([^/]+)/) : null
      const noteId = m?.[1]
      if (!noteId) return
      let cancelled = false
      ;(async () => {
        try {
          const res = await fetch('/api/notes/meta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: noteId }),
          })
          if (!res.ok) return
          const data = await res.json()
          if (cancelled) return
          setType(data?.type ?? null)
          setCreatedAt(data?.created_at ?? null)
          setUpdatedAt(data?.updated_at ?? null)
          setUrl(data?.url ?? null)
          setTranscript(typeof data?.transcript === 'string' ? data.transcript : null)
        } catch {}
      })()
      return () => { cancelled = true }
    }, [pathname])

    const formatDateTime = (iso?: string | null) => {
      if (!iso) return null
      try {
        const d = new Date(iso)
        return d.toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      } catch { return null }
    }

    const typeLabel = (t?: string | null) => {
      if (!t) return 'Unknown'
      const map: Record<string, string> = {
        website: 'Website',
        text: 'Text',
        youtube: 'YouTube',
        pdf: 'PDF',
        audio: 'Audio',
      }
      return map[t.toLowerCase?.() || t] || t
    }

    return (
        <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="hidden md:block">Transcript</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Transcript</SheetTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={
                (type?.toLowerCase?.() === 'website' && 'website') ||
                (type?.toLowerCase?.() === 'text' && 'text') ||
                (type?.toLowerCase?.() === 'youtube' && 'youtube') ||
                (type?.toLowerCase?.() === 'pdf' && 'pdf') ||
                (type?.toLowerCase?.() === 'audio' && 'audio') ||
                'secondary'
              }>{typeLabel(type)}</Badge>
              <IconPointFilled className="size-2 text-muted-foreground"/>
              <div className="text-xs text-muted-foreground">
                {formatDateTime(updatedAt || createdAt) || null}
              </div>
            </div>
          </SheetHeader>

          <div>
            <ScrollArea className="h-[calc(100vh-200px)] px-4 text-muted-foreground mr-1">
              <div className="whitespace-pre-wrap text-sm leading-6">
                {transcript && transcript.trim().length
                  ? transcript
                  : <span className="text-muted-foreground">No transcript available.</span>}
              </div>
            </ScrollArea>
          </div>
          
          <SheetFooter>
            {(type?.toLowerCase?.() === 'website' && url) ? (
              <Button variant="outline" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <IconLink />
                  Open Link Source
                </a>
              </Button>
            ) : null}
          </SheetFooter>
        </SheetContent>
      </Sheet>

        
    )
}