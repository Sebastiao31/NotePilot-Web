"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconChevronLeft, IconTextScan2, IconUpload } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadFileContainer from '../upload-file-container'
import PasteTextContainer from '../paste-text-container'

export default function UploadFileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
        
          <DialogTitle className="text-2xl flex items-center gap-2">
            Upload File/Text
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2 w-full">
        <Tabs defaultValue="upload-file" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="upload-file">
                    <IconUpload className="size-4" />
                    Upload File</TabsTrigger>
                <TabsTrigger value="paste-text">
                    <IconTextScan2 className="size-4" />
                    Paste Text</TabsTrigger>
            </TabsList>
            <TabsContent value="upload-file">
                <UploadFileContainer />
            </TabsContent>
                  <TabsContent value="paste-text">
                      <PasteTextContainer />
                  </TabsContent>
        </Tabs>


        </div>
      </DialogContent>
    </Dialog>
  )
}
