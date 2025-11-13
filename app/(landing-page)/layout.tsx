import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      </div>
  )
}

export default Layout