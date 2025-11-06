"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Separator } from "./ui/separator"
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { IconEdit, IconFolder, IconListDetails } from '@tabler/icons-react'
import { CreateFolderBtn } from './create-folder-btn'
import { BrushCleaning } from 'lucide-react'
import { useFolders } from '@/hooks/use-folders'

export function NoteFilter() {
    const { folders } = useFolders()

    return (
        <Select>
      <SelectTrigger className="border-none shadow-none bg-background max-w-[200px]">
        <SelectValue className="truncate" placeholder="Select a folder" defaultValue="all" />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup className="max-h-[200px] overflow-y-auto">
            <ScrollArea>
          <SelectLabel>Folders</SelectLabel>
          <SelectItem value="all">
            <IconListDetails className="size-4" />
            All</SelectItem>
          {folders.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              <IconFolder className="size-4" style={{ color: f.color || undefined }} />
              {f.name}
            </SelectItem>
          ))}
         
          </ScrollArea>
        </SelectGroup>
        
        <Separator className="mb-1 px-4" />
        <SelectGroup>
            <CreateFolderBtn />

            <Button variant="ghost" size="sm" className="w-full justify-start">
                <IconEdit className="size-4" />
                Edit folders
            </Button>

            
        </SelectGroup>
        
        
      </SelectContent>
      
    </Select> 

    )

}