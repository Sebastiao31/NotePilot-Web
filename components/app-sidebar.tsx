"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

// import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { IconInnerShadowTop, IconListDetails, IconFolders, IconPlus, IconMicrophoneFilled, IconDotsCircleHorizontal, IconDots, IconLogout, IconSettings, IconHelp } from "@tabler/icons-react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useAuth } from "./auth-provider"
import { useUserData } from "@/hooks/use-user-data"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    
    
  ],
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const isFoldersActive = pathname?.startsWith("/all-notes/folders")
  const isAllNotesActive = pathname?.startsWith("/all-notes") && !isFoldersActive
  const isSettingsActive = pathname === "/settings"
  const isHelpActive = pathname === "/help"
  const { signOutUser } = useAuth()
  const { userData } = useUserData()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
              className="p-2 data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-xl font-semibold text-black">NotePilot</span>
              </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarGroup>
        <SidebarMenu className="flex flex-row items-center justify-center py-4">
          <SidebarMenuItem>
              <SidebarMenuButton variant="record" size="record">
                <IconMicrophoneFilled className="!size-5 text-white" />
                <span className="text-white font-medium text-lg">Record Audio</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
              <SidebarMenuButton variant="dots" size="dots">
                <IconDots className="!size-6 " />
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>


      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" isActive={!!isAllNotesActive}>
                <Link href="/all-notes">
                  <IconListDetails className="!size-5" />
                  <span className="text-black font-medium text-lg">All Notes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible asChild className="group/collapsible" defaultOpen={!!isFoldersActive}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton size="lg" isActive={!!isFoldersActive}>
                    <IconFolders className="!size-5" />
                    <span className="text-black font-medium text-lg">Folders</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {/* Add folder links here */}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="mb-3">
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="default" variant="default" isActive={isSettingsActive}>
              <Link href="/settings">
                <IconSettings className="!size-5" />
                <span className="text-black font-medium text-lg">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="default" variant="default" isActive={isHelpActive}>
              <Link href="/help">
                <IconHelp className="!size-5" />
                <span className="text-black font-medium text-lg">Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem className=" data-[slot=sidebar-menu-button]:!p-1.5">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-full bg-gray-200">
                <AvatarImage className="rounded-full" src={userData?.photoURL ?? undefined} alt={userData?.displayName ?? "User"} />
              </Avatar>
              <div className="grid flex-1 mb-1 text-left leading-tight">
                <span className="truncate text-black text-lg font-medium">{userData?.displayName ?? "User"}</span>
                <span className="truncate text-sm">FREE</span>
              </div>
              <Button variant="logOut" size="icon" onClick={signOutUser}>
                <IconLogout className="!size-5" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
