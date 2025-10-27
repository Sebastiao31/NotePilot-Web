"use client"

import { ChevronRight, ChevronsRight, CirclePlus, Folder, MoreHorizontal, MoreVertical, Share, Trash2, type LucideIcon } from "lucide-react"
import { IconBrandYoutubeFilled, IconCirclePlus, IconFileMusicFilled, IconFileUploadFilled, IconLetterCase, IconLetterCaseUpper, IconMicrophoneFilled, IconPlus, IconSquareRoundedPlusFilled, IconUpload, IconWorld } from "@tabler/icons-react"
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
  return (
    <SidebarGroup>
      <SidebarMenu>
      <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="w-full gap-2">
          <span>
            <IconCirclePlus className="size-4" />
          </span>
          <span className="group-data-[state=collapsed]:hidden">
            Create Note
          </span>
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
      

      
        
        {items.map((item) => (
          <SidebarMenuItem key={item.title} >
            <SidebarMenuButton asChild tooltip={item.title} size="md">
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        ))}
        
      </SidebarMenu>
    </SidebarGroup>
  )
}
