"use client"

import { ChevronRight, ChevronsRight, CirclePlus, Folder, MoreHorizontal, MoreVertical, Share, Trash2, type LucideIcon } from "lucide-react"
import { IconMicrophoneFilled } from "@tabler/icons-react"
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
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
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
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="md"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
            >
              
              <div className="flex items-center gap-2">
                <span>
                  <CirclePlus className="size-4" />
                </span>
                <span className="text-sm">Create Note</span>
              </div>
              <ChevronRight className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            
            <DropdownMenuSeparator />
            <DropdownMenuGroup> 
              <DropdownMenuItem>
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
           
          </DropdownMenuContent>
        </DropdownMenu>
        
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
