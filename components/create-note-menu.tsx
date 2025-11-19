import React, { useState } from 'react'
import { YoutubeDialog } from "./dialogs/youtube"
import { WebsiteDialog } from "./dialogs/website"
import { TextDialog } from "./dialogs/text"
import { PdfDialog } from './dialogs/pdf'
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
import { Button } from './ui/button'
import { AudioDialog } from './dialogs/audio'

export const CreateNoteMenu = () => {
  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const [websiteOpen, setWebsiteOpen] = useState(false)
  const [textOpen, setTextOpen] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [audioOpen, setAudioOpen] = useState(false)

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex justify-start p-2">
        <Button variant="ghost" className="w-full gap-2">
          <span>
            <IconCirclePlus className="size-4" />
          </span>
          <span className="group-data-[state=collapsed]:hidden">Create Note</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-2">
        <DropdownMenuItem disabled onClick={() => setYoutubeOpen(true)}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-badge-red-foreground rounded-md">
              <IconBrandYoutubeFilled className="size-4 text-badge-red" />
            </div>
            <div className="flex flex-col pr-2">
              <span>Youtube</span>
              <span className="text-xs text-muted-foreground">Coming soon</span>
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
            <DropdownMenuItem onClick={() => setAudioOpen(true)}>
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
    <AudioDialog open={audioOpen} onOpenChange={setAudioOpen} />
    </>
  )
}