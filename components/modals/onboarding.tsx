"use client"

import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconArrowRight } from '@tabler/icons-react'

type OnboardingModalProps = {
  open: boolean
  onSkip: () => void
  onSubmit: (answers: { heardAbout: string | null; primaryUse: string | null; language: string }) => void
}

const HEARD_ABOUT = [
  "Instagram",
  "Facebook",
  "X/Twitter",
  "Linkedin",
  "Reddit",
  "Family & Friends",
  "Tiktok",
  "Other",
]

const PRIMARY_USE = [
  "Work Meetings",
  "Lectures & Study Notes",
  "Interviews & Reaserch",
  "Other",
]

// A concise curated language list; alphabetically sorted. Default is "Auto-Detect".
const LANGUAGES = [
  "Auto-Detect",
  "Arabic",
  "Chinese",
  "Dutch",
  "English",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Portuguese",
  "Russian",
  "Spanish",
  "Turkish",
]

export default function OnboardingModal({ open, onSkip, onSubmit }: OnboardingModalProps) {
  const [heardAbout, setHeardAbout] = React.useState<string | null>(null)
  const [primaryUse, setPrimaryUse] = React.useState<string | null>(null)
  const [languageOpen, setLanguageOpen] = React.useState(false)
  const [language, setLanguage] = React.useState<string>("Auto-Detect")

  const handleSubmit = () => {
    onSubmit({ heardAbout, primaryUse, language })
  }

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-[640px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Tell us about you</DialogTitle>
          <DialogDescription>
            This is used to personalize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-lg font-medium">How did you heard about us?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {HEARD_ABOUT.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setHeardAbout(opt)}
                  className={cn(
                    "border border-2 text-md rounded-md px-3 py-2 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    heardAbout === opt && "border-primary"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-medium">What will primarily use NotePilot for?</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRIMARY_USE.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPrimaryUse(opt)}
                  className={cn(
                    "border border-2 text-md rounded-md px-3 py-2 hover:cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    primaryUse === opt && "border-primary"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">What language do want your notes?</p>
            <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {language}
                  <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {LANGUAGES.map((lang) => (
                        <CommandItem
                          key={lang}
                          value={lang}
                          onSelect={(val) => {
                            setLanguage(val)
                            setLanguageOpen(false)
                          }}
                        >
                          <CheckIcon className={cn("mr-2 size-4", lang === language ? "opacity-100" : "opacity-0")} />
                          {lang}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button onClick={onSkip} className="text-md font-medium text-black underline underline-offset-4 hover:cursor-pointer">
            Skip
          </button>
          <Button onClick={handleSubmit} disabled={!language} className="text-lg">
            <span className="text-lg px-2">
            Continue
            </span>
            <IconArrowRight className="!size-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
