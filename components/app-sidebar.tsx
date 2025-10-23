"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  CirclePlus,
  Command,
  Files,
  Search,
  Frame,
  Info,
  LifeBuoy,
  Map,
  Megaphone,
  MessageCircle,
  PieChart,
  Send,
  Settings,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [

    {
      title: "Notes",
      url: "#",
      icon: Files,

    },
    {
      title: "Search Notes",
      url: "#",
      icon: Search,
    }
  

  ],
  navSecondary: [
    {
      title: "Help",
      url: "#",
      icon: Info,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Megaphone,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="w-fit">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src="/Logo-light.svg" alt="logo" width={24} height={24} />
                </div>
                
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
     
    </Sidebar>
  )
}
