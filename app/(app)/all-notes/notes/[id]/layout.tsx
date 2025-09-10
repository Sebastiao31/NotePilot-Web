import React from 'react'
import { SidebarRight } from "@/components/chat-panel"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 gap-6 p-8  bg-accent">
      <div className="flex-1 flex flex-col gap-4">
        {children}
      </div>
      

    </div>

  )
}

export default Layout