import { IconFileText } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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
import { IconCirclePlus, IconBrandYoutubeFilled, IconWorld, IconLetterCase, IconUpload, IconFileUploadFilled, IconFileMusicFilled } from "@tabler/icons-react"

export default function NotesPage() {
  return (
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
      

      <Menubar className="hover:bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="w-full gap-2" >
          <div className="flex gap-2">
            <Button>Create Note</Button>
          </div>
          </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-badge-red-foreground rounded-md">
                <IconBrandYoutubeFilled className="size-4 text-badge-red" />
              </div>
              <div className="flex flex-col pr-2">
                <span>Youtube</span>
                <span className="text-xs text-muted-foreground">Create note from youtube video</span>
              </div>
            </div>
          </MenubarItem>
          <MenubarItem>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-badge-purple-foreground rounded-md">
                <IconWorld className="size-4 text-badge-purple" />
              </div>
              <div className="flex flex-col pr-2">
                <span>Website</span>
                <span className="text-xs text-muted-foreground">Create note from website link</span>
              </div>
            </div>
          </MenubarItem>
          <MenubarItem>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-badge-blue-foreground rounded-md">
                <IconLetterCase className="size-4 text-badge-blue" />
              </div>
              <div className="flex flex-col pr-2">
                <span>Text</span>
                <span className="text-xs text-muted-foreground">Create note from plain text</span>
              </div>
            </div>
          </MenubarItem>
          
          <MenubarSub>
            <MenubarSubTrigger>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-badge-green-foreground rounded-md">
                <IconUpload className="size-4 text-badge-green" />
              </div>
              <div className="flex flex-col pr-2">
                <span>Upload</span>
                <span className="text-xs text-muted-foreground">Create note from file</span>
              </div>
            </div>


            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <IconFileUploadFilled className="size-4" />
                Upload PDF</MenubarItem>
              <MenubarItem>
              <IconFileMusicFilled className="size-4" />
                Uplaod Audio</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          
        </MenubarContent>
      </MenubarMenu>
      
    </Menubar>
      
    </Empty>
  )
}
