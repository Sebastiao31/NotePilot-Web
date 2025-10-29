"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNoteSidebar } from "./note-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { IconDotsVertical, IconFolder, IconChevronsLeft } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { SearchNotes } from "./search-notes"


export function NoteSidebar() {
  const { open, width, toggle } = useNoteSidebar()
  const { state, isMobile } = useSidebar()


  const transform = open ? "translateX(0)" : "translateX(-100%)"
  const leftOffset: string | number = isMobile ? 0 : (state === "expanded" ? "var(--sidebar-width)" : "var(--sidebar-width-icon)")

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-40 border-r bg-background transition-[transform,left] duration-300 ease-in-out left-0"
      )}
      style={{ width, transform, pointerEvents: open ? "auto" : "none", left: leftOffset }}
      hidden={!open}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div className="p-3 px-4 flex items-center gap-4 justify-between">

            <span className="text-sm font-regular">Notes</span>
          
          <Button variant="ghost" size="icon" onClick={toggle} className="size-7 ">
            <IconChevronsLeft className="text-accent-foreground" />
          </Button>
        </div>

        <div className="px-4">
          <SearchNotes />
        </div>
        <div className="flex-1 overflow-y-auto p-3 ">
          
          <div>
        </div>
        </div>

        
      </div>
    </div>
  )
}


