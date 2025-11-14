import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { IconBolt } from '@tabler/icons-react'
import {PricingTable} from '@clerk/nextjs'

export function UpgradeDialog({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
    const controlledProps = open === undefined ? {} : { open, onOpenChange }

    return (
        <Dialog {...controlledProps}>
            <DialogContent>
                <PricingTable/>
               
            </DialogContent>
        </Dialog>
    )
}