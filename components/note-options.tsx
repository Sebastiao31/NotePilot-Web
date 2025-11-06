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



export function NoteOptions({ noteId }: { noteId: string }) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const router = useRouter()
    const { folders } = useFolders()

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
                              <DropdownMenuItem key={f.id}>
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