"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { IconFolder, IconLoader2, IconPointFilled } from "@tabler/icons-react"
import {NoteOptions} from "./note-options"
import { useFolders } from "@/hooks/use-folders"

type NoteListItem = {
  id: string
  title: string
  status?: "generating" | "completed"
  created_at: string
  updated_at: string
}

export function NoteItem({ note, className }: { note: NoteListItem; className?: string }) {
  const created = new Date(note.created_at)
  const isValidDate = !isNaN(created.getTime())
  const month = isValidDate ? created.toLocaleString('en-US', { month: 'short' }) : ''
  const day = isValidDate ? created.getDate() : ''
  const { folders } = useFolders()
  const folder = folders.find((f) => f.id === (note as any).folder_id)
  return (

    <div>
    

    {note.status === "generating" ? (
      <span className="flex items-center px-3 py-2 rounded-md hover:bg-accent cursor-not-allowed transition-colors">
        <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-xs text-muted-foreground animate-pulse">Generating…</span>
      </span>
    ) : (
      <span className="flex items-center w-full justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted/70 transition-colors">
      <Link 
      href={`/notes/${note.id}`}
      className={cn(
        "flex flex-col gap-2 rounded-md hover:bg-muted/70 transition-colors flex-1 min-w-0",
        className
      )}
      >
      <span className="truncate text-sm text-foreground">{note.title || "Untitled"}</span>
      <div className="flex items-center gap-2" >
        <span className="flex items-center gap-1">
          <IconFolder className="size-4" style={{ color: folder?.color || 'var(--color-muted-foreground)' }} />
          <span className="text-xs text-muted-foreground font-medium">{folder ? folder.name : 'No folder'}</span>
        </span>
        <IconPointFilled className="size-2 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">
          {isValidDate ? `${month} ${day}` : ''}
        </span>
      </div>
      </Link>
      <div className="shrink-0">
        <NoteOptions noteId={note.id} folderId={(note as any).folder_id ?? null} />
      </div>
      </span>
    )}

    </div>

    
  )
}

export default NoteItem


