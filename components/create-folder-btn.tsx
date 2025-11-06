import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createSupabaseClientBrowserAuthed } from '@/lib/supabase-browser'
import { Button } from './ui/button'
import { IconCheck, IconFolderPlus } from '@tabler/icons-react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'
import { emitFoldersInsert } from '@/lib/events'

type ColorPickerProps = {
    value?: string
    onChange?: (hex: string) => void
    className?: string
    noteId?: string
  }

  const PRESET_COLORS: string[] = [
    // Top row
    '#0A7BFF', // blue
    '#05929A', // teal
    '#10B981', // green
    '#0F4C5C', // dark teal
    '#7C3AED', // purple
    // Bottom row
    '#F472B6', // pink
    '#E11D48', // red
    '#F97316', // orange
    '#F2C94C', // yellow
    '#8B5E3C', // brown
  ]

export function CreateFolderBtn({ value, onChange, className, noteId }: ColorPickerProps) {
    const [open, setOpen] = useState(false)
    const [folderName, setFolderName] = useState('')
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { getToken } = useAuth()
    const [internal, setInternal] = React.useState<string>(value ?? PRESET_COLORS[0])
    const selected = value ?? internal

    React.useEffect(() => {
        if (value !== undefined) return
        // Initialize uncontrolled state the first time
        setInternal((prev) => prev ?? PRESET_COLORS[0])
      }, [value])
    
      
      const handleSelect = (hex: string) => {
        if (value === undefined) setInternal(hex)
        onChange?.(hex)
      }
    
      async function handleCreate() {
        setError(null)
        setCreating(true)
        try {
          const token = await getToken({ template: 'supabase' })
          if (!token) throw new Error('Auth error')
          const supabase = createSupabaseClientBrowserAuthed(token)
          try { (supabase as any).realtime.setAuth(token) } catch {}

          const { data, error: insertError } = await supabase
            .from('folders')
            .insert({ name: folderName.trim(), color: selected })
            .select('id, name, color, created_at')
            .single()
          if (insertError) throw insertError

          if (data) {
            emitFoldersInsert({
              id: data.id,
              name: data.name,
              color: data.color,
              created_at: data.created_at,
            })
          }

          // Reset and close
          setFolderName('')
          setInternal(PRESET_COLORS[0])
          setOpen(false)
        } catch (e: any) {
          setError(e?.message || 'Failed to create folder')
        } finally {
          setCreating(false)
        }
      }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <IconFolderPlus className="size-4" />
                    Create folder
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create folder</DialogTitle>
                    <DialogDescription>
                        Create a new folder to organize your notes and workflow.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div className={cn('max-w-[90%] mx-auto grid pl-4  grid-cols-5 grid-rows-2   gap-4 justify-center mt-4 mb-8', className)}>
                    {PRESET_COLORS.map((hex) => {
                        const isSelected = selected?.toLowerCase() === hex.toLowerCase()
                        return (
                        <button
                            key={hex}
                            type="button"
                            onClick={() => handleSelect(hex)}
                            aria-label={`Choose color ${hex}`}
                            aria-pressed={isSelected}
                            className={cn(
                            'h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-[1.04] focus:outline-none hover:cursor-pointer'
                            )}
                            style={{ backgroundColor: hex }}
                        >
                            {isSelected && <IconCheck className="size-6 text-white" />}
                        </button>
                        )
                    })}
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="folder-name">Folder name</Label>
                        <Input type="text" placeholder="Folder name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                        {error ? <span className="text-xs text-destructive">{error}</span> : null}
                    </div>
                    
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" className="rounded-full">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleCreate} disabled={!folderName || creating}>
                        {creating ? 'Creating...' : 'Create folder'}
                    </Button>
                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}