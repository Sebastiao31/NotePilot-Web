"use client"
import React from 'react'
import { Button } from './ui/button'
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from './ui/input'
import { IconCheck, IconEdit, IconFolder, IconTrash } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useFolders } from '@/hooks/use-folders'
import { useAuth } from '@clerk/nextjs'
import { createSupabaseClientBrowserAuthed } from '@/lib/supabase-browser'
import { emitFoldersUpdate, emitFoldersDelete } from '@/lib/events'

type EditFoldersProps = {
  selectedFolderId?: string
  className?: string
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

export function EditFolders({ selectedFolderId = "all", className }: EditFoldersProps) {
    const { folders, reload } = useFolders()
    const { getToken } = useAuth()

    type Draft = { name: string; color: string | null; originalName: string; originalColor: string | null }
    const [drafts, setDrafts] = React.useState<Record<string, Draft>>({})
    const [saving, setSaving] = React.useState(false)
    const [deletingId, setDeletingId] = React.useState<string | null>(null)

    // initialize/refresh drafts when folders change
    React.useEffect(() => {
      const next: Record<string, Draft> = {}
      for (const f of folders) {
        next[f.id] = {
          name: f.name || "",
          color: f.color || null,
          originalName: f.name || "",
          originalColor: f.color || null,
        }
      }
      setDrafts(next)
    }, [folders])

    const isDirty = React.useMemo(() => {
      return Object.entries(drafts).some(([id, d]) => d && (d.name.trim() !== d.originalName || (d.color || null) !== (d.originalColor || null)))
    }, [drafts])

    function updateDraft(id: string, updates: Partial<Draft>) {
      setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] || { name: "", color: null, originalName: "", originalColor: null }), ...updates } }))
    }

    async function handleSaveAll() {
      if (!isDirty) return
      setSaving(true)
      try {
        const token = await getToken({ template: 'supabase' })
        if (!token) return
        const supabase = createSupabaseClientBrowserAuthed(token)
        try { (supabase as any).realtime.setAuth(token) } catch {}

        const updates = Object.entries(drafts)
          .filter(([id, d]) => d.name.trim() !== d.originalName || (d.color || null) !== (d.originalColor || null))
          .map(([id, d]) => ({ id, name: d.name.trim(), color: d.color }))

        // perform updates in parallel
        await Promise.all(
          updates.map((u) => {
            // optimistic
            emitFoldersUpdate({ id: u.id, name: u.name, color: u.color })
            return supabase.from('folders').update({ name: u.name, color: u.color }).eq('id', u.id)
          })
        )
        await reload()
      } finally {
        setSaving(false)
      }
    }

    async function handleDelete(id: string) {
      setDeletingId(id)
      try {
        const token = await getToken({ template: 'supabase' })
        if (!token) return
        const supabase = createSupabaseClientBrowserAuthed(token)
        try { (supabase as any).realtime.setAuth(token) } catch {}
        // optimistic
        emitFoldersDelete(id)
        await supabase.from('folders').delete().eq('id', id)
        await reload()
      } finally {
        setDeletingId(null)
      }
    }

    return(

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    <IconEdit className="size-4" />
                    Edit folders
                </Button>
            </DialogTrigger>
            <DialogContent>

                <DialogHeader>
                        <DialogTitle>Edit folders</DialogTitle>
                        <DialogDescription>
                            Edit or delete folders to organize your notes and workflow.
                        </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 ">
                  {folders.map((f) => {
                    const d = drafts[f.id]
                    const selected = d?.color || undefined
                    return (
                      <div key={f.id} className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                              <IconFolder className="size-4" style={{ color: selected || undefined }} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-0 py-4">
                            <div className={cn('max-w-[90%] mx-auto grid grid-cols-5 grid-rows-2 gap-4 justify-center', className)}>
                              {PRESET_COLORS.map((hex) => {
                                const isSelected = (d?.color || '').toLowerCase() === hex.toLowerCase()
                                return (
                                  <button
                                    key={hex}
                                    type="button"
                                    onClick={() => updateDraft(f.id, { color: hex })}
                                    aria-label={`Choose color ${hex}`}
                                    aria-pressed={isSelected}
                                    className={cn('h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-[1.04] focus:outline-none hover:cursor-pointer')}
                                    style={{ backgroundColor: hex }}
                                  >
                                    {isSelected && <IconCheck className="size-4 text-white" />}
                                  </button>
                                )
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>

                        <Input type="text" placeholder="Folder name" value={d?.name || ''} onChange={(e) => updateDraft(f.id, { name: e.target.value })} />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" disabled={deletingId === f.id}>
                              <IconTrash className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your folder. Any notes assigned to this folder won't be deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className='bg-none shadow-none border-none rounded-full'>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(f.id)} className='bg-destructive text-background hover:bg-destructive/90'>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )
                  })}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" className="rounded-full">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSaveAll} disabled={!isDirty || saving}>
                        {saving ? 'Saving...' : 'Save changes'}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>

    )
}