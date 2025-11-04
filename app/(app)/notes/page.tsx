"use client"
import React, { useState } from 'react'
import { YoutubeDialog } from "@/components/dialogs/youtube"
import { WebsiteDialog } from "@/components/dialogs/website"
import { TextDialog } from "@/components/dialogs/text"
import { PdfDialog } from '@/components/dialogs/pdf'
import { IconBrandYoutubeFilled, IconCirclePlus, IconLetterCase, IconUpload, IconWorld, IconFileMusicFilled, IconFileUploadFilled } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { IconFileText } from '@tabler/icons-react'



export default function NotesPage() {

  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const [websiteOpen, setWebsiteOpen] = useState(false)
  const [textOpen, setTextOpen] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)

  return (
    <main className="flex items-center justify-center mt-24">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFileText />
        </EmptyMedia>
        <EmptyTitle>No Notes Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any notes yet. Get started by creating
          your first note.
        </EmptyDescription>
      </EmptyHeader>

      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button >
          Create note
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-2">
        <DropdownMenuItem onClick={() => setYoutubeOpen(true)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-badge-red-foreground rounded-md">
              <IconBrandYoutubeFilled className="size-4 text-badge-red" />
            </div>
            <div className="flex flex-col pr-2">
              <span>Youtube</span>
              <span className="text-xs text-muted-foreground">Create note from youtube video</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setWebsiteOpen(true)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-badge-purple-foreground rounded-md">
              <IconWorld className="size-4 text-badge-purple" />
            </div>
            <div className="flex flex-col pr-2">
              <span>Website</span>
              <span className="text-xs text-muted-foreground">Create note from website link</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTextOpen(true)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-badge-blue-foreground rounded-md">
              <IconLetterCase className="size-4 text-badge-blue" />
            </div>
            <div className="flex flex-col pr-2">
              <span>Text</span>
              <span className="text-xs text-muted-foreground">Create note from plain text</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-badge-green-foreground rounded-md">
                <IconUpload className="size-4 text-badge-green" />
              </div>
              <div className="flex flex-col pr-2">
                <span>Upload</span>
                <span className="text-xs text-muted-foreground">Create note from file</span>
              </div>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setPdfOpen(true)}>
              <div className="flex items-center gap-3">
                <IconFileUploadFilled className="size-4" />
                <span>Upload PDF</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconFileMusicFilled className="size-4" />
              <span className="ml-2">Upload Audio</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Controlled dialogs mounted outside the dropdown */}
    <YoutubeDialog open={youtubeOpen} onOpenChange={setYoutubeOpen} />
    <WebsiteDialog open={websiteOpen} onOpenChange={setWebsiteOpen} />
    <TextDialog open={textOpen} onOpenChange={setTextOpen} />
    <PdfDialog open={pdfOpen} onOpenChange={setPdfOpen} />

      

      
      

    
      
    </Empty>
    </main>
  )
}
