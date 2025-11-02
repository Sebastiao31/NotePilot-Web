import React from 'react'
import { FloatingBar } from '@/components/floating-bar'
import { EditorBridgeProvider } from '@/components/richTextEditor/editor-context'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EditorBridgeProvider>
      <div className="h-full ">
        {children}
        <FloatingBar />
      </div>
    </EditorBridgeProvider>
  )
}

export default Layout