"use client"
import React from 'react'
import { Breadcrumb } from './ui/breadcrumb'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb'
import { Button } from './ui/button'
import { Switch } from "@/components/ui/switch"
import { useEditMode } from '@/components/edit-mode-provider'
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
    return (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 justify-between pr-2 border-b bg-background w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
            />
            <span className="text-sm font-medium">Notes</span>
          </div>
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
        </header>
        
    )
}