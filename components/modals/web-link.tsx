"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconBrandYoutube, IconChevronLeft, IconTextScan2, IconUpload, IconWorldWww } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadFileContainer from '../upload-file-container'
import PasteTextContainer from '../paste-text-container'
import YoutubeContainer from '../youtube-container'
import WebsiteContainer from '../website-container'

export default function WebLinkModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
        
          <DialogTitle className="text-2xl flex items-center gap-2">
            <IconChevronLeft className="size-6" onClick={() => onOpenChange(false)} />
            Web Link
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2 w-full">
        <Tabs defaultValue="upload-file" className="w-full">
            <TabsList className="w-full">
                <TabsTrigger value="upload-file">
                    <IconBrandYoutube className="size-4" />
                    Youtube</TabsTrigger>
                <TabsTrigger value="paste-text">
                    <IconWorldWww className="size-4" />
                    Website</TabsTrigger>
            </TabsList>
            <TabsContent value="upload-file">
                <YoutubeContainer />
            </TabsContent>
                  <TabsContent value="paste-text">
                      <WebsiteContainer />
                  </TabsContent>
        </Tabs>


        </div>
      </DialogContent>
    </Dialog>
  )
}
