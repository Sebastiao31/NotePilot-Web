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
import { IconBrandYoutubeFilled, IconWorld } from '@tabler/icons-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { emitNotesInsert, emitNotesUpdate } from '@/lib/events'


export function WebsiteDialog({ open: controlledOpen, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined && typeof onOpenChange === 'function'
  const open = isControlled ? controlledOpen! : uncontrolledOpen
  const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

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
    if (!websiteUrl) return
    setSubmitting(true)
    try {
      toast("Generating note...")
      setOpen(false)
      const res = await fetch("/api/notes/create-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to create note")
      }
      const { id, title } = await res.json()
      const now = new Date().toISOString()
      emitNotesInsert({ id, title: title || websiteUrl, status: 'generating', created_at: now, updated_at: now })
      const summaryResult = await summarize(id)
      const resolvedTitle = (summaryResult && summaryResult.title) ? String(summaryResult.title) : (title || websiteUrl)
      emitNotesUpdate({ id, title: resolvedTitle, status: 'completed', updated_at: new Date().toISOString() })
      toast.success("Note created successfully")
      router.push(`/notes/${id}`)
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }
  return (

        <Dialog open={open} onOpenChange={setOpen}>
        
        <DialogContent >
        <DialogHeader>
            <DialogTitle>Website</DialogTitle>
            <DialogDescription>
              Enter the URL of the website you want to create a note from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="grid gap-3">
              <Label htmlFor="website-url">URL</Label>
              <Input id="website-url" name="website-url" placeholder="www.website.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
            </div>
            
          </div>
          <DialogDescription>
          *It’ll be imported only the visible text of the website. <br />
          *Paid articles may not be compatible.
            </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="button" disabled={!websiteUrl || submitting} onClick={onCreate}>{submitting ? 'Creating...' : 'Create note'}</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}
