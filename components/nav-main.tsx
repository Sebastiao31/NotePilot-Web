"use client"

import { ChevronRight, ChevronsRight, CirclePlus, Folder, MoreHorizontal, MoreVertical, Settings, Share, Trash2, WandSparkles, type LucideIcon } from "lucide-react"
import { IconBrandYoutubeFilled, IconCirclePlus, IconFile, IconFileMusicFilled, IconFiles, IconFileUploadFilled, IconHome, IconLetterCase, IconLetterCaseUpper, IconMessageCircle, IconMicrophoneFilled, IconPlus, IconSquareRoundedPlusFilled, IconUpload, IconWorld } from "@tabler/icons-react"
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
import { CreateNoteMenu } from "./create-note-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button"
import { House } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"




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

  const { isMobile, setOpenMobile } = useSidebar()
  const { toggle, setDrawerOpen: setNotesDrawerOpen } = useNoteSidebar()
  const { chatToggle, setDrawerOpen } = useChatSidebar()
  const pathname = usePathname()
  const inNoteContext = React.useMemo(() => {
    if (!pathname) return false
    // Match /notes/[id] and any deeper children
    return /^\/notes\/[^/]+(\/.*)?$/.test(pathname)
  }, [pathname])

  return (
    <SidebarGroup>
      <SidebarMenu>

        {/* 

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Home" >
              <House className="size-4" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        
        

        {inNoteContext && (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="AI Chat" onClick={chatToggle}>
              <IconMessageCircle className="size-4" />
              <span>AI Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {inNoteContext && (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="NotePilot Agent" onClick={toggle}>
              <WandSparkles className="size-4" />
              <span>NotePilot</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

    < SidebarMenuItem>
          <SidebarMenuButton tooltip="Settings">
            <Settings className="size-4" />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        */}
      

      
      

      
     
        <CreateNoteMenu />
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false)
                setNotesDrawerOpen(true)
              } else {
                toggle()
              }
            }}
            tooltip="Notes"
          >
            <IconFiles className="size-4" />
            <span>Notes</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {inNoteContext ? (
          <>
          <SidebarMenuItem className="hidden md:block">
            <SidebarMenuButton onClick={chatToggle} tooltip="Ai Chat">
              <IconMessageCircle className="size-4" />
              <span>Ai Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem className="block md:hidden">
            <SidebarMenuButton tooltip="Ai Chat" onClick={() => { if (isMobile) setOpenMobile(false); setDrawerOpen(true) }}>
              <IconMessageCircle className="size-4" />
              <span>Ai Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          </>
        ) : null}
      
        
      </SidebarMenu>
    </SidebarGroup>
  )
}
