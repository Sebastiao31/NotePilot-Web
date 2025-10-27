"use client"

import { IconArrowUp, IconPaperclip, IconLoader2 } from "@tabler/icons-react"
import TextareaAutosize from "react-textarea-autosize"
import { useState, useTransition } from "react"
import { createNoteWithMessage } from "@/lib/actions/notes"
import { useRouter } from "next/navigation"

export function MainInput() {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!message.trim() || isPending) return

    const userMessage = message
    setMessage("") // Clear input immediately for smooth UX

    startTransition(async () => {
      try {
        const result = await createNoteWithMessage(userMessage)
        
        if (result.success && result.noteId) {
          // Smooth redirect to the new note
          router.push(`/notes/${result.noteId}`)
        } else {
          // Handle error - restore message
          setMessage(userMessage)
          console.error("Create note error:", result.error)
          alert(`Failed to create note:\n\n${result.error}\n\nCheck console for details.`)
        }
      } catch (error) {
        setMessage(userMessage)
        console.error("Unexpected error:", error)
        alert(`Unexpected error:\n\n${error instanceof Error ? error.message : String(error)}`)
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-lg gap-4 bg-accent border border-border/20 rounded-xl p-2 flex flex-col">
      <TextareaAutosize
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className="flex field-sizing-content w-full resize-none bg-transparent p-2 text-base transition-[color,box-shadow] outline-none md:text-sm disabled:opacity-50"
        placeholder={isPending ? "Creating note..." : "Ask a question"}
        maxRows={8}
      />
      <div className="flex items-center justify-between">
        <button 
          type="button"
          disabled={isPending}
          className="text rounded-full p-1.5 hover:bg-muted-foreground/10 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconPaperclip className="size-5" />
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim() || isPending}
          className="bg-action rounded-full p-1.5 hover:bg-action-accent hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? (
            <IconLoader2 className="size-5 text-white animate-spin" />
          ) : (
            <IconArrowUp className="size-5 text-white" />
          )}
        </button>
      </div>
    </div>
  )
}
