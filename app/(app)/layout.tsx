import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/site-header'
import { NoteProvider } from '@/components/note-provider'
import { NoteInset } from '@/components/note-inset'
import { NoteSidebar } from '@/components/note-sidebar'
import { ChatProvider } from '@/components/chat-provider'
import { ChatInset } from '@/components/chat-inset'
import { ChatSidebar } from '@/components/chat-sidebar'
import { EditModeProvider } from '@/components/edit-mode-provider'


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider open={false} >
      <EditModeProvider>
        <ChatProvider>
       
          <NoteProvider>
          <AppSidebar />
          <SidebarInset>
          <ChatInset>
          <NoteInset>
          
              {children}
          
          </NoteInset>
          </ChatInset>
          </SidebarInset>
          <ChatSidebar />
          <NoteSidebar />
      
          </NoteProvider>
      
        </ChatProvider>
      </EditModeProvider>
    </SidebarProvider>
  )
}

export default Layout