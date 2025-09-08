"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import WebLinkModal from "@/components/modals/web-link"
import UploadFileModal from "@/components/modals/upload-file"
import GoogleMeetModal from "@/components/modals/google-meet"

type ChooseNewNoteProps = {
  children: React.ReactNode
}

type Option = "web" | "upload" | "meet"

export default function ChooseNewNote({ children }: ChooseNewNoteProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Option | null>("web")
  const [openWeb, setOpenWeb] = React.useState(false)
  const [openUpload, setOpenUpload] = React.useState(false)
  const [openMeet, setOpenMeet] = React.useState(false)

  const handleContinue = () => {
    if (!selected) return
    setOpen(false)
    // Open the respective modal
    if (selected === "web") setOpenWeb(true)
    if (selected === "upload") setOpenUpload(true)
    if (selected === "meet") setOpenMeet(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>
      <DialogContent showCloseButton className="sm:max-w-[760px] p-8">
        <DialogHeader className="my-4">
          <DialogTitle className="text-2xl text-center">Create a new note</DialogTitle>
          <DialogDescription className="text-center">
            Select how you want to create your new note and we handle the rest.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-10 mb-4  grid grid-cols-1 gap-4 sm:grid-cols-3">
          <OptionCard
            title="Web Link"
            description="Paste the link you want to summarize."
            iconSrc="/Weblink.svg"
            selected={selected === "web"}
            onClick={() => setSelected("web")}
          />
          <OptionCard
            title="Upload File/Text"
            description="Upload the file or paste the text you want to summarize."
            iconSrc="/Upload.svg"
            selected={selected === "upload"}
            onClick={() => setSelected("upload")}
          />
          <OptionCard
            title="Join meetings"
            description="Enter the meet link or ID and NotePilot will join you."
            iconSrc="/GoogleMeet.svg"
            selected={selected === "meet"}
            onClick={() => setSelected("meet")}
          />
        </div>

        <div className="pt-6 items-center justify-center flex w-full">
          <Button onClick={handleContinue} className="w-[50%] h-14 text-lg">Continue</Button>
        </div>
      </DialogContent>

      {/* Follow-up modals */}
      <WebLinkModal open={openWeb} onOpenChange={setOpenWeb} />
      <UploadFileModal open={openUpload} onOpenChange={setOpenUpload} />
      <GoogleMeetModal open={openMeet} onOpenChange={setOpenMeet} />
    </Dialog>
  )
}

function OptionCard({
  title,
  description,
  iconSrc,
  selected,
  onClick,
}: {
  title: string
  description: string
  iconSrc: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "border rounded-xl  p-6 text-left hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  hover:cursor-pointer " +
        (selected ? "border-black bg-accent border-2" : "border-border")
      }
    >
      <div className="flex flex-col items-center gap-3">
        <img src={iconSrc} alt="icon" className="h-14 w-14" />
        <div className="text-center">
          <div className="text-lg font-medium mb-1">{title}</div>
          <div className="text-sm text-muted-foreground max-w-[200px] mx-auto">
            {description}
          </div>
        </div>
      </div>
    </button>
  )
}
