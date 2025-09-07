"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconArrowRight } from '@tabler/icons-react'

type WelcomeModalProps = {
  open: boolean
  onContinue: () => void
}

export default function WelcomeModal({ open, onContinue }: WelcomeModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-[520px]">
        <DialogHeader>
            <div className="flex justify-center">
                <h1 className="text-[64px]">👋🏼</h1>
            </div>
          <DialogTitle className="text-center text-2xl mb-2">Welcome to NotePilot</DialogTitle>
          <DialogDescription className="text-center max-w-md mx-auto">
          Before getting started, help us improve your experience by answering a few questions.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-2 mt-12">
          <Button onClick={onContinue} className="w-full h-14">
            <span className="text-lg px-2">
            Continue
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
