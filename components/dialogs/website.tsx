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
import { IconBrandYoutubeFilled, IconWorld } from '@tabler/icons-react'
import { useState } from 'react'


export function WebsiteDialog( ) {
  const [websiteUrl, setWebsiteUrl] = useState("")
  return (

        <Dialog>
        <DialogTrigger asChild >
            
            <div className="flex items-center gap-3">
                <div className="p-2 bg-badge-purple-foreground rounded-md">
                <IconWorld className="size-4 text-badge-purple" />
                </div>
                <div className="flex flex-col pr-2">
                <span>Website</span>
                <span className="text-xs text-muted-foreground">Create note from website link</span>
                </div>
            </div>

        </DialogTrigger>
        <DialogContent >
        <DialogHeader>
            <DialogTitle>Website</DialogTitle>
            <DialogDescription>
              Enter the URL of the website you want to create a note from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="grid gap-3">
              <Label htmlFor="website-url">URL</Label>
              <Input id="website-url" name="website-url" placeholder="www.website.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
            </div>
            
          </div>
          <DialogDescription>
          *It’ll be imported only the visible text of the website. <br />
          *Paid articles may not be compatible.
            </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!websiteUrl}>Create note</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}
