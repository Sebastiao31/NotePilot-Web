import React from 'react'
import { Breadcrumb } from './ui/breadcrumb'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb'

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-2 border-b bg-background w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
            />
            <span className="text-sm font-medium">Note name</span>
          </div>
        </header>
        
    )
}