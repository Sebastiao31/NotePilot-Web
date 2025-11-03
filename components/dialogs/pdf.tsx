import React, { useState } from 'react'
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
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { IconFileUploadFilled } from '@tabler/icons-react'
import { Input } from '../ui/input'

export function PdfDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const controlledProps = open === undefined ? {} : { open, onOpenChange }
  return (
    <Dialog {...controlledProps}>
    
    <DialogContent >
    <DialogHeader>
        <DialogTitle>Upload PDF</DialogTitle>
        <DialogDescription>
          Upload a PDF file to create a note from.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 ">
        <div className="grid gap-3">
          <Label htmlFor="pdf-file">PDF File</Label>
          <Input type="file" id="pdf-file"  />
        </div>
        
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" className="rounded-full">Cancel</Button>
        </DialogClose>
        <Button
        >
          Create note
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}