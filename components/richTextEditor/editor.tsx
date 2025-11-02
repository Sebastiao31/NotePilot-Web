'use client'

import { Toggle } from '@/components/ui/toggle'
import { IconBold, IconCode, IconItalic, IconLetterT, IconStrikethrough, IconUnderline } from '@tabler/icons-react'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Heading1, Heading2, Heading3 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'

export default () => {
  const [updateCounter, setUpdateCounter] = useState(0)
  
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: `
      <p>
        Try to select <em>this text</em> to see what we call the bubble menu.
      </p>
      <p>
        Neat, isn't it? Add an empty paragraph to see the floating menu.
      </p>
    `,
    onUpdate: () => {
      setUpdateCounter(prev => prev + 1)
    },
    onSelectionUpdate: () => {
      setUpdateCounter(prev => prev + 1)
    },
  })

  const headingOptions = [
    {task: 'p', value: 'Text', icon: <IconLetterT className="size-3" />},
    {task: 'h1', value: 'Heading 1', icon: <Heading1 className="size-4" />},
    {task: 'h2', value: 'Heading 2', icon: <Heading2 className="size-4" />},
    {task: 'h3', value: 'Heading 3', icon: <Heading3 className="size-4" />},
    
  ] as const

  // Get current block level
  const currentBlockLevel =
    (editor && editor.isActive('heading', { level: 1 })) ? 'h1' :
    (editor && editor.isActive('heading', { level: 2 })) ? 'h2' :
    (editor && editor.isActive('heading', { level: 3 })) ? 'h3' :
    'p'

  const Options = [
    
    {
      icon: <IconBold className="size-4" />,
      onClick: () => editor?.chain().focus().toggleBold().run(),
      pressed: editor && editor.isActive('bold'),
      tooltip: 'Bold',
    },
    {
      icon: <IconItalic className="size-4" />,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
      pressed: editor && editor.isActive('italic'),
      tooltip: 'Italic',
    },
    {
      icon: <IconStrikethrough className="size-4" />,
      onClick: () => editor?.chain().focus().toggleStrike().run(),
      pressed: editor && editor.isActive('strike'),
      tooltip: 'Strikethrough',
    },
    {
      icon: <IconUnderline className="size-4" />,
      onClick: () => editor?.chain().focus().toggleUnderline().run(),
      pressed: editor && editor.isActive('underline'),
      tooltip: 'Underline',
    },
    {
      icon: <IconCode className="size-4" />,
      onClick: () => editor?.chain().focus().toggleCode().run(),
      pressed: editor && editor.isActive('code'),
      tooltip: 'Code',
    }

  ]

  const handleHeadingChange = (value: string) => {
    switch (value) {
      case 'p':
        editor?.chain().focus().setParagraph().run()
        break
      case 'h1':
        editor?.chain().focus().setHeading({ level: 1 }).run()
        break
      case 'h2':
        editor?.chain().focus().setHeading({ level: 2 }).run()
        break
      case 'h3':
        editor?.chain().focus().setHeading({ level: 3 }).run()
        break
      default:
        break
    }
  }


  return (
    <>
      {editor && (
        <BubbleMenu className="bubble-menu bg-background border border-border rounded-lg p-1 space-x-1 flex items-center" editor={editor}>
        <Select key={currentBlockLevel} value={currentBlockLevel} onValueChange={handleHeadingChange}>
          <SelectTrigger size="sm" onMouseDown={(e) => e.stopPropagation()} className="border-none shadow-none hover:bg-accent hover:cursor-pointer">
            {headingOptions.find(option => option.task === currentBlockLevel)?.icon}
            <SelectValue placeholder="Text">
              {headingOptions.find(option => option.task === currentBlockLevel)?.value || 'Text'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {headingOptions.map(items => (
              <SelectItem key={items.task} value={items.task}>
                {items.icon} {items.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />
        
        
        {Options.map((option, index) => (
          <Tooltip key={index}>
            <TooltipTrigger>
            <Toggle
              onClick={option.onClick}
              className={option.pressed ? 'is-active' : ''}
            >
              {option.icon}
            </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {option.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
        </BubbleMenu>
      )}

     

      <EditorContent editor={editor} />
    </>
  )
}