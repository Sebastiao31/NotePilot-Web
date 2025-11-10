"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Info, Loader2, Megaphone, Plus } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

interface Note {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export function NavSecondary() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  

  return (
    <SidebarGroup className="mt-auto">
      
        <SidebarMenu>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Help">
              <Info className="size-4" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Feedback">
              <Megaphone className="size-4" />
              <span>Feedback</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
         
        </SidebarMenu>
    </SidebarGroup>
  )
}
