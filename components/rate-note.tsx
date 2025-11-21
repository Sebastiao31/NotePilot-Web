import { IconThumbDownFilled, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { FeedbackDialog } from './dialogs/feedback'
import { toast } from 'sonner'

export default function RateNote({ noteId }: { noteId: string }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [liking, setLiking] = useState(false)
  const [hasFeedback, setHasFeedback] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/notes/meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: noteId }),
        })
        if (!res.ok) {
          if (!cancelled) setHasFeedback(false)
          return
        }
        const data = await res.json()
        const liked = Boolean(data?.like)
        const disliked = Boolean(data?.dislike)
        if (!cancelled) setHasFeedback(liked || disliked)
      } catch {
        if (!cancelled) setHasFeedback(false)
      }
    })()
    return () => { cancelled = true }
  }, [noteId])

  async function onLike() {
    if (!noteId || liking) return
    setLiking(true)
    try {
      const res = await fetch("/api/notes/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId, like: true }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to like note")
      }
      toast.success("Thanks for the feedback!")
      setHasFeedback(true)
    } catch (e) {
      toast.error("Could not save your like. Try again.")
    } finally {
      setLiking(false)
    }
  }

  if (hasFeedback) return null

  return (
    <>
      <div className='flex  items-center justify-between gap-2 bg-accent px-6 py-4 rounded-md'>
        <h1 className='text-base font-medium'>Happy with this note?</h1>
        <div>
          <Button variant="like" size="icon" onClick={onLike} disabled={liking}>
            <IconThumbUpFilled className='size-4' />
          </Button>
          <Button variant="dislike" size="icon" onClick={() => setFeedbackOpen(true)}>
            <IconThumbDownFilled className='size-4' />
          </Button>
        </div>
      </div>
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        noteId={noteId}
        onSubmitted={() => setHasFeedback(true)}
      />
    </>
  )
}