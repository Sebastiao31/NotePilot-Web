"use client"
import React from 'react'
import { Breadcrumb } from './ui/breadcrumb'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb'
import { Button } from './ui/button'
import { Switch } from "@/components/ui/switch"
import { useEditMode } from '@/components/edit-mode-provider'
import { usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { createSupabaseClientBrowserAuthed } from '@/lib/supabase-browser'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconFileUploadFilled } from '@tabler/icons-react'

export function SiteHeader() {
    const { editMode, setEditMode } = useEditMode()
    const pathname = usePathname()
    const { getToken } = useAuth()
    const [noteTitle, setNoteTitle] = React.useState<string | null>(null)

    const noteId = React.useMemo(() => {
      if (!pathname) return null
      const parts = pathname.split('/').filter(Boolean)
      // Expecting /notes or /notes/[id] or /notes/[id]/section
      if (parts[0] !== 'notes') return null
      return parts[1] || null
    }, [pathname])

    const section = React.useMemo(() => {
      if (!pathname) return null
      const parts = pathname.split('/').filter(Boolean)
      if (parts[0] !== 'notes') return null
      return parts[2] || null
    }, [pathname])

    const sectionLabel = React.useMemo(() => {
      if (!section) return null
      switch (section) {
        case 'quiz':
          return 'Quiz'
        case 'flashcards':
          return 'Flashcards'
        case 'mindmap':
          return 'Mindmap'
        default:
          return null
      }
    }, [section])

    React.useEffect(() => {
      let cancelled = false
      async function loadTitle() {
        if (!noteId) {
          setNoteTitle(null)
          return
        }
        try {
          const token = await getToken({ template: "supabase" })
          if (!token) return
          const supabase = createSupabaseClientBrowserAuthed(token)
          const { data, error } = await supabase
            .from('notes')
            .select('title')
            .eq('id', noteId)
            .single()
          if (error) return
          if (!cancelled) setNoteTitle(data?.title ?? null)
        } catch {
          // ignore errors; breadcrumb will just show "Notes"
        }
      }
      loadTitle()
      return () => { cancelled = true }
    }, [noteId, getToken])

    return (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 justify-between pr-2 border-b bg-background w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
            />
            <span className="text-sm font-medium">
              {noteTitle}
            </span>
          </div>
          {noteId && !section ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Edit Mode:
              </span>
              <Switch checked={editMode} onCheckedChange={setEditMode} />
            </div>
            <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />
            <div className="flex items-center">
              <Button variant="ghost">
                Transcript
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2">
                  <DropdownMenuItem>
                    <IconFileUploadFilled className="size-4" />
                    <span>Export PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          ) : null}
        </header>
        
    )
}