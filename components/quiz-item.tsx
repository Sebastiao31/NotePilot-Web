import React from 'react'
import { IconCheckbox, IconDotsVertical, IconForms } from '@tabler/icons-react'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { IconTrash } from '@tabler/icons-react'
import Link from 'next/link'

export function QuizItem() {
    return (

        <div className="flex items-center justify-between hover:bg-accent/50 rounded-md p-2 hover:cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-badge-blue-foreground rounded-md flex items-center justify-center">
                <IconCheckbox
                    className="size-4 text-badge-blue"
                    />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium">Quiz Title</span>
                <span className="text-xs text-muted-foreground">Nov 9</span>
            </div>
        </div>
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <IconDotsVertical className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                        <IconForms className="size-4" />
                        Change name
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                        <IconTrash className="size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
        </div>
    </div>
    
    )
}