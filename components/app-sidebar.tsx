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
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { IconInnerShadowTop, IconListDetails, IconFolders, IconSquareFilled, IconPlus, IconMicrophoneFilled, IconDotsCircleHorizontal, IconDots, IconLogout, IconSettings, IconHelp } from "@tabler/icons-react"
import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useAuth } from "./auth-provider"
import { useUserData } from "@/hooks/use-user-data"
import { useFolders } from "@/hooks/use-folders"
import CreateFolderDialog from "@/components/modals/create-folder"
import ChooseNewNote from "@/components/modals/choose-new-note"

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
  const isInFoldersSection = pathname?.startsWith("/all-notes/folders")
  const isFoldersActive = pathname === "/all-notes/folders"
  const isAllNotesActive = pathname?.startsWith("/all-notes") && !isInFoldersSection
  const isSettingsActive = pathname === "/settings"
  const isHelpActive = pathname === "/help"
  const { signOutUser } = useAuth()
  const { userData } = useUserData()
  const { folders } = useFolders()

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
              <ChooseNewNote>
                <SidebarMenuButton variant="dots" size="dots">
                  <IconDots className="!size-6 " />
                </SidebarMenuButton>
              </ChooseNewNote>
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
            <Collapsible asChild className="group/collapsible" defaultOpen={!!isInFoldersSection}>
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
                    {folders.map((f) => (
                      <SidebarMenuSubItem key={f.id} >
                        <SidebarMenuButton size="lg" asChild isActive={pathname === `/all-notes/folders/${f.id}`}>
                          <Link href={`/all-notes/folders/${f.id}`}>
                            <IconSquareFilled className="!size-3" style={{ color: f.color }} />
                            <span className="text-black text-lg">{f.name || "Folder"}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                    <SidebarMenuSubItem>
                      <CreateFolderDialog>
                        <SidebarMenuButton size="lg">
                          <IconPlus className="!size-4 text-muted-foreground" />
                          <span className="text-gray-500 text-md">Create Folder</span>
                        </SidebarMenuButton>
                      </CreateFolderDialog>
                    </SidebarMenuSubItem>
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
