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
import { emitFolderFilterChange } from '@/lib/events'
import { EditFolders } from './edit-folders'

export function NoteFilter() {
    const { folders } = useFolders()
    const [selectedFolderId, setSelectedFolderId] = React.useState<string>("all")

    return (
        <Select defaultValue="all" onValueChange={(val) => { setSelectedFolderId(val); emitFolderFilterChange(val) }}>
      <SelectTrigger className="border-none shadow-none bg-background max-w-[200px]">
        <SelectValue className="truncate" placeholder="Select a folder" />
      </SelectTrigger>
      <SelectContent align="start" >
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

            <EditFolders selectedFolderId={selectedFolderId} />

            
        </SelectGroup>
        
        
      </SelectContent>
      
    </Select> 

    )

}