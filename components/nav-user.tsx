"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CircleUserRound,
  CreditCard,
  Info,
  Link,
  LogOut,
  Megaphone,
  Settings,
  Sparkles,
} from "lucide-react"

import React, { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SignedIn, UserButton, useClerk, useUser } from "@clerk/nextjs"
import { IconBolt } from "@tabler/icons-react"
import { UpgradeDialog } from "./dialogs/upgrade"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { signOut, openUserProfile } = useClerk()
  const { user: signedInUser } = useUser()
  const displayEmail =
    signedInUser?.primaryEmailAddress?.emailAddress ||
    signedInUser?.emailAddresses?.[0]?.emailAddress ||
    user.email

  const displayName = signedInUser?.fullName || displayEmail

  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const router = useRouter()
  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
      
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
            >
              <SignedIn >
                <UserButton userProfileMode="modal" />
              </SignedIn>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-md font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">FREE</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
           
           <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <CircleUserRound className="size-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">{displayEmail}</span>
                </div>
              </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              
              
              <DropdownMenuItem onClick={() => router.push("/pricing")}>
                  <IconBolt />
                  Upgrade to Pro
                </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Megaphone />
                Feedback
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info />
                Help
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => openUserProfile?.()}>
                <Settings />
                Manage Account
              </DropdownMenuItem>
              
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                void signOut({ redirectUrl: "/" })
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>

    <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />

    </>
  )
}
