"use client"

import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useChatSidebar } from './chat-provider'
import { useSidebar } from './ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { ChatPanel } from './chat-sidebar'


export function ChatDrawer() {
    return (
        <ControlledChatDrawer />
    )
}

function ControlledChatDrawer() {
    const { drawerOpen, setDrawerOpen } = useChatSidebar()
    const { setOpenMobile } = useSidebar()
    const isMobile = useIsMobile()

    React.useEffect(() => {
        if (drawerOpen && isMobile) {
            setOpenMobile(false)
        }
    }, [drawerOpen, isMobile, setOpenMobile])

    React.useEffect(() => {
        if (!isMobile && drawerOpen) {
            setDrawerOpen(false)
        }
    }, [isMobile, drawerOpen, setDrawerOpen])

    return (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="p-0 h-[85vh]">
                <div className="h-full">
                    <ChatPanel />
                </div>
            </DrawerContent>
        </Drawer>
    )
}