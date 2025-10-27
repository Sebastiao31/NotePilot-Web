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
import { getAllNotes } from "@/lib/actions/notes"
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

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true)
        const data = await getAllNotes()
        setNotes(data)
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [pathname]) // Refetch when route changes

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Notes</SidebarGroupLabel>
      <SidebarGroupAction asChild title="New Note">
        <Link href="/notes">
          <Plus />
          <span className="sr-only">New Note</span>
        </Link>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {loading ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Loader2 className="animate-spin" />
                <span>Loading...</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : notes.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/notes">
                  <Plus />
                  <span className="text-muted-foreground">Create your first note</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            notes.slice(0, 10).map((note) => (
              <SidebarMenuItem key={note.id}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === `/notes/${note.id}`}
                >
                  <Link href={`/notes/${note.id}`}>
                    <FileText />
                    <span className="truncate">{note.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
