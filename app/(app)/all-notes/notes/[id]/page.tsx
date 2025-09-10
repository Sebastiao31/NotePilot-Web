import React from 'react'
import { getMockNoteById } from "@/constants/mock-notes"

type PageProps = {
  params: { id: string }
}

export default function Page({ params }: PageProps) {
  const note = getMockNoteById(params.id)

  if (!note) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">Note not found</h1>
        <p className="text-muted-foreground">The note you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-xl bg-white">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{note.title}</h1>
        <div className="text-sm text-muted-foreground mt-1">
          <span>{note.folder}</span>
          <span className="mx-2">•</span>
          <span>{new Date(note.date).toLocaleString()}</span>
        </div>
      </div>
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap text-2xl">{note.note}</p>
      </div>
    </div>
  )
}