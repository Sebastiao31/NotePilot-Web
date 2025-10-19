"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  CirclePlus,
  Command,
  Files,
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Create Note",
      url: "#",
      icon: CirclePlus,

    },
    {
      title: "Notes",
      url: "#",
      icon: Files,

    },
    {
      title: "AI Chat",
      url: "#",
      icon: MessageCircle,

    },

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
          <NavUser user={data.user} />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
     
    </Sidebar>
  )
}
