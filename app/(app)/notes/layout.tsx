import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">{children}</div>
  )
}

export default Layout