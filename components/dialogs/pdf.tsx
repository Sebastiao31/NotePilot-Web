import React, { useState } from 'react'
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
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { IconFileUploadFilled } from '@tabler/icons-react'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { emitNotesInsert, emitNotesUpdate } from '@/lib/events'

export function PdfDialog({ open, onOpenChange, onParsed }: { open?: boolean; onOpenChange?: (open: boolean) => void, onParsed?: (text: string) => void }) {
  const controlledProps = open === undefined ? {} : { open, onOpenChange }
  const [error, setError] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [completed, setCompleted] = React.useState(false)
  const [parsedText, setParsedText] = React.useState<string>("")
  const [submitting, setSubmitting] = React.useState(false)
  const [parsing, setParsing] = React.useState(false)
  const router = useRouter()


  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setError('Only PDF files are supported')
      return
    }

    // Enforce max size: 10 MB
    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      setError('PDF exceeds 10 MB limit')
      e.target.value = ''
      return
    }

    try {
      setError(null)
      setParsing(true)
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/notes/parse-pdf', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed to parse PDF')
        return
      }

      // Log parsed text and number of pages to verify parsing works
      console.log('Parsed PDF pages:', data?.numpages)
      console.log('Parsed PDF text:', data?.text)
      setParsedText(data?.text || '')
      onParsed?.(data?.text || '')
      setFileName(file.name)
      setCompleted(true)
    } catch (err) {
      setError('Unexpected error parsing PDF')
    } finally {
      setParsing(false)
    }
  }

  const clearSelection = () => {
    setFileName(null)
    setCompleted(false)
    setError(null)
    setParsedText("")
  }

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
    if (!parsedText.trim()) {
      setError('Please upload a valid PDF first')
      return
    }
    try {
      setSubmitting(true)
      toast("Generating note...")
      onOpenChange?.(false)

      const res = await fetch("/api/notes/create-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: parsedText, fileName }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Failed to create note")
      }
      const { id, title } = await res.json()
      const now = new Date().toISOString()
      const fallbackTitle = (fileName ? fileName.replace(/\.[^.]+$/, '') : (parsedText.split('\n').map(s => s.trim()).find(Boolean) || 'Untitled'))
      emitNotesInsert({ id, title: (title || fallbackTitle).slice(0, 80), status: 'generating', created_at: now, updated_at: now })

      const summaryResult = await summarize(id)
      const resolvedTitle = (summaryResult && summaryResult.title) ? String(summaryResult.title) : (title || fallbackTitle)
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
    <Dialog {...controlledProps}>
    
    <DialogContent >
    <DialogHeader>
        <DialogTitle>Upload PDF</DialogTitle>
        <DialogDescription>
          Upload a PDF file to create a note from.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 ">
        <div className="grid gap-3">
          <Label htmlFor="pdf-file">PDF File</Label>
          <Input type="file" id="pdf-file" accept="application/pdf" onChange={onFileChange}/>
        </div>
        
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" className="rounded-full">Cancel</Button>
        </DialogClose>
        <Button type="button" onClick={onCreate} disabled={!completed || !parsedText || submitting || parsing}>
          {parsing ? 'Parsing...' : submitting ? 'Creating...' : 'Create note'}
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}