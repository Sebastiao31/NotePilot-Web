"use client"

import React from "react"
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { useNoteSidebar } from "./note-provider"
import { useSidebar } from "./ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { NoteFilter } from "./note-filter"
import { SearchNotes } from "./search-notes"
import NoteList from "./note-list"

export function NoteDrawer() {
  return <ControlledNoteDrawer />
}

function ControlledNoteDrawer() {
  const { drawerOpen, setDrawerOpen } = useNoteSidebar()
  const { setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()

  React.useEffect(() => {
    // When opening drawer on mobile, make sure app sidebar is closed
    if (drawerOpen && isMobile) {
      setOpenMobile(false)
    }
  }, [drawerOpen, isMobile, setOpenMobile])

  React.useEffect(() => {
    // Close drawer automatically when screen becomes non-mobile
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false)
    }
  }, [isMobile, drawerOpen, setDrawerOpen])

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="p-0 h-[85vh]">
        <div className="h-full flex flex-col">
          <div className="p-3 px-4 flex items-center gap-4 justify-between">
            <NoteFilter />
          </div>
          <div className="px-4">
            <SearchNotes />
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="h-full">
              <NoteList />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

