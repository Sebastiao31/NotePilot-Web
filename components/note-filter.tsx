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
import { IconEdit, IconFolder, IconListDetails, IconPlus } from '@tabler/icons-react'
import { CreateFolderBtn } from './create-folder-btn'

export function NoteFilter() {

    return (
        <Select>
      <SelectTrigger className="border-none shadow-none bg-background">
        <SelectValue placeholder="Select a folder" defaultValue="all" />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup className="max-h-[200px] overflow-y-auto">
            <ScrollArea>
          <SelectLabel>Folders</SelectLabel>
          <SelectItem value="all">
            <IconListDetails className="size-4" />
            All</SelectItem>

          <SelectItem value="folder1">
            <IconFolder className="size-4" />
            Folder 1</SelectItem>
          <SelectItem value="folder2">
            <IconFolder className="size-4" />   
            Folder 2</SelectItem>
          <SelectItem value="folder3">
            <IconFolder className="size-4" />
            Folder 3</SelectItem>
          <SelectItem value="folder4">
            <IconFolder className="size-4" />
            Folder 4</SelectItem>
          <SelectItem value="folder5">
            <IconFolder className="size-4" />
            Folder 5</SelectItem>
          <SelectItem value="folder6">
            <IconFolder className="size-4" />
            Folder 6</SelectItem>
          <SelectItem value="folder7">
            <IconFolder className="size-4" />
            Folder 7</SelectItem>
         
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