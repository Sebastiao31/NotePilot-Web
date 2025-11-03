"use client"

import React from 'react'
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
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { IconBrandYoutubeFilled, IconLetterCase, IconWorld } from '@tabler/icons-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { emitNotesInsert, emitNotesUpdate } from '@/lib/events'


export function TextDialog( ) {
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  
  async function summarize(noteId: string) {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    })
    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || "Failed to summarize note")
    }
    return res.json()
  }

  async function onCreate() {
    if (!text) return
    setSubmitting(true)
    try {
      toast("Generating note...")
      setOpen(false)
      const res = await fetch("/api/notes/create-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to create note")
      }
      const { id } = await res.json()
      // Optimistically add note to list with generating status
      const firstLine = text.split('\n').map(s => s.trim()).find(Boolean) || 'Untitled'
      const now = new Date().toISOString()
      emitNotesInsert({ id, title: firstLine.slice(0, 80), status: 'generating', created_at: now, updated_at: now })
      const summaryResult = await summarize(id)
      const resolvedTitle = (summaryResult && summaryResult.title) ? String(summaryResult.title) : firstLine.slice(0, 80)
      emitNotesUpdate({ id, title: resolvedTitle, status: 'completed', updated_at: new Date().toISOString() })
      toast.success("Note created successfully")
      
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (

        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild >
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-badge-blue-foreground rounded-md">
                <IconLetterCase className="size-4 text-badge-blue" />
                </div>
                <div className="flex flex-col pr-2">
                <span>Text</span>
                <span className="text-xs text-muted-foreground">Create note from plain text</span>
                </div>
            </div>

        </DialogTrigger>
        <DialogContent >
        <DialogHeader>
            <DialogTitle>Text</DialogTitle>
            <DialogDescription>
              Enter the plain text you want to create a note from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="grid gap-3">
              <Label htmlFor="website-url">Plain Text</Label>
              <Textarea className="max-h-80 min-h-30" id="text" name="text" placeholder="Enter your plain text here" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              disabled={!text || submitting}
              onClick={onCreate}
            >
              {submitting ? "Creating..." : "Create note"}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}
