"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { IconLoader2 } from "@tabler/icons-react"

type NoteListItem = {
  id: string
  title: string
  status?: "generating" | "completed"
  updated_at: string
}

export function NoteItem({ note, className }: { note: NoteListItem; className?: string }) {
  return (

    <div>
    

    {note.status === "generating" ? (
      <span className="flex items-center px-3 py-2 rounded-md hover:bg-accent cursor-not-allowed transition-colors">
        <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-xs text-muted-foreground animate-pulse">Generating…</span>
      </span>
    ) : (
      <Link 
      href={`/notes/${note.id}`}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/70 transition-colors",
        className
      )}
      >
      <span className="truncate text-sm text-foreground">{note.title || "Untitled"}</span>
      </Link>
    )}

    </div>

    
  )
}

export default NoteItem


