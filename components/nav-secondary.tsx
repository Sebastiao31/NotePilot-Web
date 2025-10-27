"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Loader2, Plus } from "lucide-react"

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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Notes</SidebarGroupLabel>
      <SidebarGroupAction asChild >
        
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
         
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
