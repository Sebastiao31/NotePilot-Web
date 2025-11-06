"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { IconDots, IconDotsVertical, IconEdit, IconFolder, IconFolderUp, IconForms, IconTrash } from '@tabler/icons-react'
import {DeleteDialog} from "./dialogs/delete"
import { CreateFolderBtn } from './create-folder-btn'
import { ScrollArea } from './ui/scroll-area'
import { useFolders } from '@/hooks/use-folders'
import { useAuth } from '@clerk/nextjs'
import { createSupabaseClientBrowserAuthed } from '@/lib/supabase-browser'
import { emitNotesUpdate } from '@/lib/events'
import { BrushCleaning } from 'lucide-react'



export function NoteOptions({ noteId, folderId }: { noteId: string; folderId?: string | null }) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const router = useRouter()
    const { folders } = useFolders()
    const { getToken } = useAuth()

    async function handleMoveTo(folderId: string) {
      try {
        const token = await getToken({ template: 'supabase' })
        if (!token) return
        const supabase = createSupabaseClientBrowserAuthed(token)
        try { (supabase as any).realtime.setAuth(token) } catch {}
        const { error } = await supabase.from('notes').update({ folder_id: folderId }).eq('id', noteId)
        if (!error) {
          emitNotesUpdate({ id: noteId, updated_at: new Date().toISOString() } as any)
          // also include folder_id to update list optimistically
          emitNotesUpdate({ id: noteId, folder_id: folderId, updated_at: new Date().toISOString() } as any)
        }
      } catch {
        // ignore for now
      }
    }

    async function handleClearFolder() {
      try {
        const token = await getToken({ template: 'supabase' })
        if (!token) return
        const supabase = createSupabaseClientBrowserAuthed(token)
        try { (supabase as any).realtime.setAuth(token) } catch {}
        const { error } = await supabase.from('notes').update({ folder_id: null }).eq('id', noteId)
        if (!error) {
          emitNotesUpdate({ id: noteId, folder_id: null, updated_at: new Date().toISOString() } as any)
        }
      } catch {
        // ignore for now
      }
    }

    return (
<>
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                    <IconDotsVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Options
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/notes/${noteId}?rename=1`)}>
                    <IconForms className="size-4" />
                    Change name
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <IconFolderUp className="size-4" />
                        Move To
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuGroup className="max-h-[180px] overflow-y-auto ">
                            <ScrollArea>
                              {folders.map((f) => (
                               <DropdownMenuItem key={f.id} onClick={() => handleMoveTo(f.id)}>
                                <IconFolder className="size-4" style={{ color: f.color || undefined }} />
                                {f.name}
                              </DropdownMenuItem>
                            ))}
                            </ScrollArea>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="mt-0"/>
                            <CreateFolderBtn noteId={noteId} />
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>
                {folderId ? (
                  <DropdownMenuItem onClick={handleClearFolder}>
                    <BrushCleaning />
                    Clear Folder
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                    <IconTrash className="size-4" />
                    Delete
                </DropdownMenuItem>


            </DropdownMenuContent>
        </DropdownMenu>

    <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} noteId={noteId} />
    </>
    )
}