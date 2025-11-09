import React from 'react'
import { FloatingBar } from '@/components/floating-bar'
import { EditorBridgeProvider } from '@/components/richTextEditor/editor-context'
import { ScrollArea } from "@/components/ui/scroll-area"
import { SiteHeader } from '@/components/site-header'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EditorBridgeProvider>
      <div className="h-full ">
        <SiteHeader/>
        <ScrollArea className="h-svh">
          {children}
        </ScrollArea>
        <FloatingBar />
      </div>
    </EditorBridgeProvider>
  )
}

export default Layout