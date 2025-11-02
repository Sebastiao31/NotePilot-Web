"use client"

import React from 'react'
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
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { IconBrandYoutubeFilled, IconLetterCase, IconWorld } from '@tabler/icons-react'
import { useState } from 'react'
import { Textarea } from '../ui/textarea'


export function TextDialog( ) {
  const [text, setText] = useState("")
  return (

        <Dialog>
        <DialogTrigger asChild >
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-badge-blue-foreground rounded-md">
                <IconLetterCase className="size-4 text-badge-blue" />
                </div>
                <div className="flex flex-col pr-2">
                <span>Text</span>
                <span className="text-xs text-muted-foreground">Create note from plain text</span>
                </div>
            </div>

        </DialogTrigger>
        <DialogContent >
        <DialogHeader>
            <DialogTitle>Text</DialogTitle>
            <DialogDescription>
              Enter the plain text you want to create a note from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="grid gap-3">
              <Label htmlFor="website-url">Plain Text</Label>
              <Textarea className="max-h-80 min-h-30" id="text" name="text" placeholder="Enter your plain text here" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!text}>Create note</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}
