'use client'

import { Toggle } from '@/components/ui/toggle'
import { IconBan, IconBold, IconCircle, IconCircleFilled, IconCode, IconItalic, IconLetterT, IconStrikethrough, IconUnderline } from '@tabler/icons-react'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronDown, ChevronsDownIcon, ChevronsUpDownIcon, Heading1, Heading2, Heading3 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button'
import Highlight from '@tiptap/extension-highlight'
import { useEditorBridge } from './editor-context'
import { TableKit } from '@tiptap/extension-table'
import { useEditMode } from '@/components/edit-mode-provider'
import Math, { migrateMathStrings } from '@tiptap/extension-mathematics'
import 'katex/dist/katex.min.css'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'

export default function Editor({ noteId, initialContent = "" }: { noteId: string; initialContent?: string }) {
  const [updateCounter, setUpdateCounter] = useState(0)
  const { setEditor } = useEditorBridge()
  const { editMode } = useEditMode()
  const [lastSavedHtml, setLastSavedHtml] = useState<string>(initialContent || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  
  
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      TableKit.configure({ table: { resizable: true } }),
      Math,
      Subscript,
      Superscript
    ],
    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor)
    },
    editable: editMode,
    immediatelyRender: false,
    content: initialContent || "<p></p>",
    onUpdate: () => {
      setUpdateCounter(prev => prev + 1)
    },
    onSelectionUpdate: () => {
      setUpdateCounter(prev => prev + 1)
    },
  })
  
  // Keep editor readonly state in sync with the header switch
  useEffect(() => {
    if (editor) {
      editor.setEditable(editMode)
    }
  }, [editor, editMode])
  
  useEffect(() => {
    setEditor(editor ?? null)
    return () => setEditor(null)
  }, [editor, setEditor])

  // Autosave (debounced) while in edit mode
  useEffect(() => {
    if (!editor || !editMode) return

    // clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer)

    const timer = setTimeout(async () => {
      try {
        const html = editor.getHTML()
        if (html === lastSavedHtml) return
        setIsSaving(true)
        setSaveError(null)
        const res = await fetch('/api/notes/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: noteId, summary: html }),
        })
        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg || 'Failed to save note')
        }
        setLastSavedHtml(html)
      } catch (e: any) {
        setSaveError(e?.message || 'Save failed')
      } finally {
        setIsSaving(false)
      }
    }, 100)
    setDebounceTimer(timer)

    return () => {
      clearTimeout(timer)
    }
  }, [editor, editMode, updateCounter, noteId, lastSavedHtml])

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

        <Popover>
          <PopoverTrigger className="flex items-center gap-2 h-8 px-2 rounded-md hover:bg-accent hover:cursor-pointer">
            <IconCircleFilled className="size-4" />
            <ChevronDown className="size-4" />
          </PopoverTrigger>
          <PopoverContent className="w-fit mt-3 p-1 flex flex-row gap-1 items-center">
            <Button variant="ghost" size="icon-sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'var(--color-highlight-yellow)' }).run()}
            className={editor.isActive('highlight', { color: 'var(--color-highlight-yellow)' }) ? 'is-active' : ''}
            >
              <IconCircleFilled className="size-4 text-highlight-yellow" />
            </Button>
            <Button variant="ghost" size="icon-sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'var(--color-highlight-red)' }).run()}
            className={editor.isActive('highlight', { color: 'var(--color-highlight-red)' }) ? 'is-active' : ''}
            >
              <IconCircleFilled className="size-4 text-highlight-red" />
            </Button>
            <Button variant="ghost" size="icon-sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'var(--color-highlight-blue)' }).run()}
            className={editor.isActive('highlight', { color: 'var(--color-highlight-blue)' }) ? 'is-active' : ''}
            >
              <IconCircleFilled className="size-4 text-highlight-blue" />
            </Button>
            <Button variant="ghost" size="icon-sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'var(--color-highlight-purple)' }).run()}
            className={editor.isActive('highlight', { color: 'var(--color-highlight-purple)' }) ? 'is-active' : ''}
            >
              <IconCircleFilled className="size-4 text-highlight-purple" />
            </Button>
            <Button variant="ghost" size="icon-sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'var(--color-highlight-green)' }).run()}
            className={editor.isActive('highlight', { color: 'var(--color-highlight-green)' }) ? 'is-active' : ''}
            >
              <IconCircleFilled className="size-4 text-highlight-green" />
            </Button>
            <Button variant="ghost" size="icon-sm"
            onClick={() => editor.chain().focus().toggleHighlight({ color: 'var(--color-background)' }).run()}
            className={editor.isActive('highlight', { color: 'var(--color-background)' }) ? 'is-active' : ''}
            >
              <IconBan className="size-4 text-foreground" />
            </Button>
          </PopoverContent>
        </Popover>
        
        
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