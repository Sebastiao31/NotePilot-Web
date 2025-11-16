'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { SquareSigma, Eraser, Pencil, Undo2, Redo2, Trash2 } from 'lucide-react'
import { ReactSketchCanvas } from 'react-sketch-canvas'
import type { ReactSketchCanvasRef } from 'react-sketch-canvas'
import { useEditorBridge } from '@/components/richTextEditor/editor-context'

export function BlockMathBoard() {
  const canvasRef = React.useRef<ReactSketchCanvasRef | null>(null)
  const [isEraser, setIsEraser] = React.useState(false)
  const [strokeWidth] = React.useState(4)
  const [strokeColor] = React.useState<string>('black')
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { editor } = useEditorBridge()

  React.useEffect(() => {
    try { canvasRef.current?.eraseMode(isEraser) } catch {}
  }, [isEraser])

  const handleUndo = () => { try { canvasRef.current?.undo() } catch {} }
  const handleRedo = () => { try { canvasRef.current?.redo() } catch {} }
  const handleClear = () => { try { canvasRef.current?.clearCanvas() } catch {} }

  const onDone = async () => {
    if (!canvasRef.current || !editor) return
    setSubmitting(true)
    setError(null)
    try {
      const dataUrl = await canvasRef.current.exportImage('png')
      const res = await fetch('/api/create-block-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Failed to recognize equation')
      }
      const data = await res.json()
      let latex = String(data?.latex || '').trim()
      if (!latex) throw new Error('Empty result')

      // Normalize wrappers ($$, $$, \[ \], fences) and extract data-latex if returned as a div/span
      const extractFromDataLatex = () => {
        const m = latex.match(/data-latex="([^"]+)"/)
        if (m) {
          try { return decodeURIComponent(m[1]) } catch { return m[1] }
        }
        return null
      }
      const fromAttr = extractFromDataLatex()
      if (fromAttr) {
        latex = fromAttr
      } else {
        latex = latex.replace(/^```(?:latex)?/i, '').replace(/```$/i, '').trim()
        latex = latex.replace(/^\$+/, '').replace(/\$+$/, '').trim()
        latex = latex.replace(/^\\\[\s*([\s\S]*?)\s*\\\]$/, '$1').trim()
        latex = latex.replace(/^\\\(\s*([\s\S]*?)\s*\\\)$/, '$1').trim()
      }

      const escapeAttr = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const html = `<div data-type="block-math" data-latex="${escapeAttr(latex)}"></div>`
      editor.chain().focus().insertContent(html).run()
      setOpen(false)
    } catch (e: any) {
      setError(e?.message || 'Error processing drawing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={(o) => { if (!submitting) setOpen(o) }}>
      <PopoverTrigger asChild onClick={() => setOpen(true)}>
        <Button variant="ghost" size="icon">
          <SquareSigma />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-120 mb-2 p-3 rounded-xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="leading-none font-medium">Draw Block Equation</h4>
            <div className="flex items-center gap-1">
              <Toggle
                pressed={!isEraser}
                onPressedChange={() => setIsEraser(false)}
                aria-label="Pen"
                className="h-8 w-8"
                type="button"
              >
                <Pencil className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={isEraser}
                onPressedChange={() => setIsEraser(true)}
                aria-label="Eraser"
                className="h-8 w-8"
                type="button"
              >
                <Eraser className="h-4 w-4" />
              </Toggle>
              <div className="mx-2 h-6 w-px bg-border" />
              <Button variant="ghost" size="icon" onClick={handleUndo} aria-label="Undo" className="h-8 w-8">
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} aria-label="Redo" className="h-8 w-8">
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Clear" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border bg-background">
            <ReactSketchCanvas
              ref={canvasRef}
              width="600"
              height="360"
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              className="rounded-md"
              canvasColor="#ffffff"
              style={{ borderRadius: 6 }}
            />
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <div className="flex justify-between gap-2">
            <Button variant="ghost" size="sm" className="rounded-full" disabled={submitting} onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button size="sm" className="rounded-full" disabled={submitting || !editor} onClick={onDone}>
              {submitting ? 'Processing…' : 'Done'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}


