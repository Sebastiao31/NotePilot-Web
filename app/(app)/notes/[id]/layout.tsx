import React from 'react'
import { FloatingBar } from '@/components/floating-bar'
import { EditorBridgeProvider } from '@/components/richTextEditor/editor-context'
import { ScrollArea } from "@/components/ui/scroll-area"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EditorBridgeProvider>
      <div className="h-full ">
        <ScrollArea className="h-svh">
          {children}
        </ScrollArea>
        <FloatingBar />
      </div>
    </EditorBridgeProvider>
  )
}

export default Layout