"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'

export function FeedbackDialog({ open, onOpenChange, noteId, onSubmitted }: { open?: boolean; onOpenChange?: (open: boolean) => void, noteId: string, onSubmitted?: () => void }) {
    const [feedback, setFeedback] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const controlledProps = open === undefined ? {} : { open, onOpenChange }

    async function onSubmit() {
        const text = feedback.trim()
        if (!text || submitting) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/notes/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: noteId, dislike: true, feedback: text }),
            })
            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg || 'Failed to submit feedback')
            }
            toast.success('Thanks for your feedback!')
            onSubmitted?.()
            onOpenChange?.(false)
            setFeedback("")
        } catch (e) {
            toast.error('Could not submit feedback. Try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return(
        <Dialog {...controlledProps}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Help us improve</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Label htmlFor="feedback">Do you have any thoughts you'd like to share?</Label>
                    <Textarea
                        id="feedback"
                        name="feedback"
                        placeholder="Enter your feedback here"
                        value={feedback}
                        className="max-h-80 min-h-40"
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" className="rounded-full">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={onSubmit} disabled={!feedback.trim() || submitting}>
                        {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}