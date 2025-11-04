"use client"
import React from 'react'
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
  import { Button } from "@/components/ui/button"
  import { toast } from 'sonner'
  import { emitNotesDelete } from '@/lib/events'

export function DeleteDialog({ open, onOpenChange, noteId, onDeleted }: { open?: boolean; onOpenChange?: (open: boolean) => void, noteId: string, onDeleted?: (id: string) => void })  {
    const controlledProps = open === undefined ? {} : { open, onOpenChange }
    const [deleting, setDeleting] = React.useState(false)

    async function handleDelete() {
        if (deleting) return
        try {
            setDeleting(true)
            const res = await fetch('/api/notes/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: noteId })
            })
            if (!res.ok) {
                const msg = await res.text()
                throw new Error(msg || 'Failed to delete note')
            }
            onOpenChange?.(false)
            toast.success('Note deleted')
            emitNotesDelete(noteId)
            onDeleted?.(noteId)
        } catch (e) {
            toast.error('Unable to delete note')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <AlertDialog {...controlledProps}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        note and remove its data from our database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className='bg-none shadow-none border-none rounded-full'>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-destructive text-background hover:bg-destructive/90' onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Deleting…' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>
    )

}
