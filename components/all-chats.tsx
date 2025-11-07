import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconBrandLine, IconHistory, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'


export function AllChats({ noteId, onSelect }: { noteId: string; onSelect: (chatId: string) => void }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [chats, setChats] = useState<{ id: string; created_at: string }[]>([])

    useEffect(() => {
      let ignore = false
      async function load() {
        if (!noteId) return
        setLoading(true)
        try {
          const res = await fetch(`/api/chat/list?noteId=${noteId}`, { cache: 'no-store' })
          if (!res.ok) return
          const data = await res.json()
          if (!ignore) setChats(Array.isArray(data?.chats) ? data.chats : [])
        } finally {
          if (!ignore) setLoading(false)
        }
      }
      load()
      return () => { ignore = true }
    }, [noteId])


  return (
<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
        variant="ghost"
        size="icon-sm"
          >
            <IconHistory className="size-4"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search chats..." className="h-9" />
          <CommandList>
            <CommandEmpty>No chats found.</CommandEmpty>
            <CommandGroup>
                {chats
                  .filter((c) => !value || c.id.toLowerCase().includes(value.toLowerCase()))
                  .map((c) => (
                    <CommandItem key={c.id} onSelect={() => { onSelect(c.id); setOpen(false) }}>
                      <IconBrandLine className="size-4"/>
                      <span className="ml-2">{new Date(c.created_at).toLocaleString()}</span>
                    </CommandItem>
                ))}
              
                
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}