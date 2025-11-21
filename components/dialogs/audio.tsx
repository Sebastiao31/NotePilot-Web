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
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { emitNotesInsert, emitNotesUpdate } from "@/lib/events"

export function AudioDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [transcribing, setTranscribing] = useState(false)
    const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(false)
    const controlledProps = open === undefined ? {} : { open, onOpenChange }
    const router = useRouter()

    const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
      const f = e.target.files?.[0] || null
      setError(null)
      setFile(null)
      if (!f) return

      const isAudio =
        (f.type && f.type.startsWith("audio/")) ||
        (f.name && /\.(mp3|wav|m4a|flac|ogg|webm|aac|mp4)$/i.test(f.name))

      if (!isAudio) {
        setError("Only audio files are supported")
        e.currentTarget.value = ""
        return
      }

      const maxBytes = 25 * 1024 * 1024 // 25 MB
      if (f.size > maxBytes) {
        setError("Audio exceeds 25 MB limit")
        e.currentTarget.value = ""
        return
      }

      setFile(f)
    }

    async function transcribeSelectedFile() {
      if (!file) return ""
      setTranscribing(true)
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/notes/parse-audio", {
        method: "POST",
        body: form,
      })
      const data = await res.json()
      setTranscribing(false)
      if (!res.ok) {
        throw new Error(data?.error || "Failed to transcribe audio")
      }
      return String(data?.text || "")
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
      if (!file) {
        setError("Please select an audio file")
        return
      }
      // Gate: allow creation only if under limit or on Pro
      setChecking(true)
      try {
        const gateRes = await fetch("/api/billing/can-create-note", { method: "GET", cache: "no-store" })
        const gateData = await gateRes.json()
        if (!gateData?.allowed) {
          setChecking(false)
          onOpenChange?.(false)
          router.push("/pricing")
          return
        }
      } catch {
        setChecking(false)
      }
      setChecking(false)
      try {
        setSubmitting(true)
        toast("Generating note...")
        onOpenChange?.(false)

        // 1) Create the note immediately (empty transcript) so it shows in the sidebar
        const createRes = await fetch("/api/notes/create-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "", fileName: file?.name || "" }),
        })
        if (!createRes.ok) {
          const msg = await createRes.text()
          throw new Error(msg || "Failed to create note")
        }
        const { id, title } = await createRes.json()
        const now = new Date().toISOString()
        const fallbackTitle = (file?.name ? file.name.replace(/\.[^.]+$/, '') : 'Untitled')
        emitNotesInsert({ id, title: (title || fallbackTitle).slice(0, 80), status: 'generating', created_at: now, updated_at: now })

        // 2) Transcribe the audio
        const transcript = await transcribeSelectedFile()
        console.log("Audio transcription:", transcript)

        // 3) Update the note with transcript
        await fetch("/api/notes/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, transcript }),
        })

        // 4) Summarize
        const summaryResult = await summarize(id)
        const resolvedTitle = (summaryResult && summaryResult.title) ? String(summaryResult.title) : (title || (file?.name ? file.name.replace(/\.[^.]+$/, '') : 'Untitled'))
        emitNotesUpdate({ id, title: resolvedTitle, status: 'completed', updated_at: new Date().toISOString() })
        toast.success("Note created successfully")
        router.push(`/notes/${id}`)
      } catch (err: any) {
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
            <DialogTitle>Upload Audio</DialogTitle>
            <DialogDescription>
              Upload an audio file to create a note from.
            </DialogDescription>
          </DialogHeader>
            <div className="grid gap-4 ">
                <div className="grid gap-3">
                <Label htmlFor="pdf-file">Audio File</Label>
                <Input type="file" id="audio-file" accept="audio/*" onChange={onFileChange}/>
                {error ? <span className="text-sm text-destructive">{error}</span> : null}
                </div>
                
            </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={onCreate} disabled={!file || transcribing || submitting || checking}>
              {checking ? "Loading..." : transcribing || submitting ? "Creating..." : "Create note"}
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
    )

}