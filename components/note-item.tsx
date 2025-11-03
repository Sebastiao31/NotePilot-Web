"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type NoteListItem = {
  id: string
  title: string
  updated_at: string
}

export function NoteItem({ note, className }: { note: NoteListItem; className?: string }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/70 transition-colors",
        className
      )}
    >
      <span className="truncate text-sm text-foreground">{note.title || "Untitled"}</span>
      {/* Optional: show recency later */}
    </Link>
  )
}

export default NoteItem


