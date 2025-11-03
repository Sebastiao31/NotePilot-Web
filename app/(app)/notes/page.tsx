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
import { YoutubeDialog } from "@/components/dialogs/youtube"
import { WebsiteDialog } from "@/components/dialogs/website"
import { TextDialog } from "@/components/dialogs/text"



export default function NotesPage() {
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

      <Menubar className="hover:bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="w-full gap-2" >
          <div className="flex gap-2">
            <Button>Create Note</Button>
          </div>
          </MenubarTrigger>
        <MenubarContent align="center">
          <MenubarItem>
            <YoutubeDialog />
          </MenubarItem>
          <MenubarItem>
            <WebsiteDialog />
          </MenubarItem>
          <MenubarItem>
            <TextDialog />
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
    </main>
  )
}
