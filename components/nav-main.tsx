"use client"

import { ChevronRight, ChevronsRight, CirclePlus, Folder, MoreHorizontal, MoreVertical, Share, Trash2, type LucideIcon } from "lucide-react"
import { IconBrandYoutubeFilled, IconCirclePlus, IconFile, IconFileMusicFilled, IconFiles, IconFileUploadFilled, IconLetterCase, IconLetterCaseUpper, IconMessageCircle, IconMicrophoneFilled, IconPlus, IconSquareRoundedPlusFilled, IconUpload, IconWorld } from "@tabler/icons-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DropdownMenu,
  DropdownMenuSeparator, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuGroup,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
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
import { useSidebar } from "@/components/ui/sidebar"
import { useNoteSidebar } from "./note-provider"
import { useChatSidebar } from "./chat-provider"
import { YoutubeDialog } from "./dialogs/youtube"
import { WebsiteDialog } from "./dialogs/website"
import { TextDialog } from "./dialogs/text"
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



export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {

  const { isMobile } = useSidebar()
  const { toggle } = useNoteSidebar()
  const { chatToggle } = useChatSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
      <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="w-full gap-2" >
          <span>
            <IconCirclePlus className="size-4" />
          </span>
          <span className="group-data-[state=collapsed]:hidden">
            Create Note
          </span>
          </MenubarTrigger>
        <MenubarContent>
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
      

      
        
        <SidebarMenuItem>
          <SidebarMenuButton onClick={toggle} tooltip="Notes">
            <IconFiles className="size-4" />
            <span>Notes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={chatToggle} tooltip="Ai Chat">
            <IconMessageCircle className="size-4" />
            <span>Ai Chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
      </SidebarMenu>
    </SidebarGroup>
  )
}
