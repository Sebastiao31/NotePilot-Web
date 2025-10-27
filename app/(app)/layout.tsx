import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/site-header'
import { NoteProvider } from '@/components/note-provider'
import { NoteInset } from '@/components/note-inset'
import { NoteSidebar } from '@/components/note-sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <NoteProvider>
        <AppSidebar />
        <SidebarInset>
        <NoteInset>
          <SiteHeader />
          {children}
        </NoteInset>
        </SidebarInset>
        <NoteSidebar />
      </NoteProvider>
    </SidebarProvider>
  )
}

export default Layout