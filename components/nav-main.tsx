"use client"

import { ChevronRight, ChevronsRight, CirclePlus, Folder, MoreHorizontal, MoreVertical, Share, Trash2, type LucideIcon } from "lucide-react"
import { IconBrandYoutubeFilled, IconMicrophoneFilled, IconPlus, IconSquareRoundedPlusFilled, IconUpload, IconWorld } from "@tabler/icons-react"
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
        <MenubarMenu >
          <MenubarTrigger className="hover:cursor-pointer w-full">
            <div className="flex items-center gap-2">
                <span>
                  <CirclePlus className="size-4" />
                </span>
                <span className="text-sm group-data-[state=collapsed]:hidden">Create Note</span>
              </div>
              <ChevronRight className="ml-auto size-4" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-md bg-badge-blue-foreground p-2">
                  <IconPlus className="size-4 text-badge-blue" />
                </div>
              <div className="flex flex-col gap-0 items-start">
                Blank Note
                <span className="text-xs text-muted-foreground">
                  Create a new blank note
                </span>
              </div>
              </div>
            </MenubarItem>

            <MenubarItem>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-md bg-badge-red-foreground p-2">
                  <IconBrandYoutubeFilled className="size-4 text-badge-red" />
                </div>
              <div className="flex flex-col gap-0 items-start">
                Youtube
                <span className="text-xs text-muted-foreground">
                  Summarize a Youtube video
                </span>
              </div>
              </div>
            </MenubarItem>

            <MenubarItem>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-md bg-badge-purple-foreground p-2">
                  <IconWorld className="size-4 text-badge-purple" />
                </div>
                <div className="flex flex-col gap-0 items-start">
                  Website
                  <span className="text-xs text-muted-foreground">
                    Summarize a website
                  </span>
                </div>
              </div>
            </MenubarItem>
            
            <MenubarSub>
              <MenubarSubTrigger>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-md bg-badge-green-foreground p-2">
                    <IconUpload className="size-4 text-badge-green" />
                  </div>
                  <div className="flex flex-col gap-0 items-start">
                    Upload
                    <span className="text-xs text-muted-foreground">
                      Upload a file 
                    </span>
                  </div>
                </div>
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>PDF</MenubarItem>
                <MenubarItem>MP4/MP3</MenubarItem>
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
