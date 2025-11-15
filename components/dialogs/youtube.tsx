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

import { useState } from 'react'


export function YoutubeDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const controlledProps = open === undefined ? {} : { open, onOpenChange }
  return (

        <Dialog {...controlledProps}>
        
        <DialogContent >
        <DialogHeader>
            <DialogTitle>Youtube video</DialogTitle>
            <DialogDescription>
              Enter the URL of the youtube video you want to create a note from.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="grid gap-3">
              <Label htmlFor="youtube-url">URL</Label>
              <Input id="youtube-url" name="youtube-url" placeholder="www.youtube.com/123" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
            </div>
            
          </div>
          <DialogDescription>
              * Only public videos are supported. <br />
              * Recent uploaded videos can not be available.
            </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!youtubeUrl}>Create note</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}
