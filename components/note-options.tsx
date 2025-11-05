"use client"
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
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
import { IconDots, IconDotsVertical, IconEdit, IconFolderUp, IconForms, IconTrash } from '@tabler/icons-react'
import {DeleteDialog} from "./dialogs/delete"



export function NoteOptions({ noteId }: { noteId: string }) {
    const [deleteOpen, setDeleteOpen] = useState(false)

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
                <DropdownMenuItem>
                    <IconForms className="size-4" />
                    Change name
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <IconFolderUp className="size-4" />
                        Move To
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>
                            Folder 1
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Folder 2
                        </DropdownMenuItem>
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