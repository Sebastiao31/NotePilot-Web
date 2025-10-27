import React from 'react'
import { getNoteById, getNodesByNoteId, getMessagesByNodeId } from '@/lib/actions/notes'
import { FlowCanvas } from '@/components/flow-canvas'

interface NoteIdPageProps {
  params: Promise<{
    id: string
  }>
}

const NoteIdPage = async ({ params }: NoteIdPageProps) => {
  const { id } = await params
  
  try {
    const [note, nodes] = await Promise.all([
      getNoteById(id),
      getNodesByNoteId(id),
    ])

    // Get messages for all nodes
    const nodesWithMessages = await Promise.all(
      nodes.map(async (node) => {
        const messages = await getMessagesByNodeId(node.id)
        return { ...node, messages }
      })
    )

    return (
      <div className="h-screen w-full">
        <FlowCanvas 
          noteId={note.id}
          initialNodes={nodesWithMessages}
        />
      </div>
    )
  } catch (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Note not found</h1>
          <p className="text-muted-foreground">This note doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }
}

export default NoteIdPage