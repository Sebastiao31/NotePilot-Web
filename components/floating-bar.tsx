"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useChatSidebar } from "@/components/chat-provider"
import { useNoteSidebar } from "@/components/note-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { useEditMode } from "@/components/edit-mode-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { IconArrowBackUp, IconArrowForwardUp, IconMathFunctionY, IconSquareRoot2, IconTable, IconBold, IconQuote, IconList } from "@tabler/icons-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import { ListOrdered, SquareCode, SquareSigma } from "lucide-react"
import { useEditorBridge } from "@/components/richTextEditor/editor-context"
import { useEditorState } from "@tiptap/react"
import { InlineMathBoard } from "./inline-math-board"
import { BlockMathBoard } from "./block-math-board"



// Constants mirrored from ui/sidebar.tsx for layout math
const APP_SIDEBAR_WIDTH_EXPANDED = 14 * 16 // 14rem
const APP_SIDEBAR_WIDTH_ICON = 3 * 16 // 3rem

export function FloatingBar() {
  const { editMode } = useEditMode()
  const { open: chatOpen, width: chatWidth } = useChatSidebar()
  const { open: noteOpen, width: noteWidth } = useNoteSidebar()
  const { state, isMobile } = useSidebar()
  const { editor } = useEditorBridge()

  const leftOffset = isMobile
    ? 0
    : (state === "expanded" ? APP_SIDEBAR_WIDTH_EXPANDED : APP_SIDEBAR_WIDTH_ICON) + (noteOpen ? noteWidth : 0)
  const rightOffset = isMobile ? 0 : (chatOpen ? chatWidth : 0)

  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor?.isActive('bold') ?? false,
        canBold: ctx.editor?.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor?.isActive('italic') ?? false,
        canItalic: ctx.editor?.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor?.isActive('strike') ?? false,
        canStrike: ctx.editor?.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor?.isActive('code') ?? false,
        canCode: ctx.editor?.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor?.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor?.isActive('paragraph') ?? false,
        isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor?.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor?.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor?.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor?.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor?.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
        canUndo: ctx.editor?.can().chain().undo().run() ?? false,
        canRedo: ctx.editor?.can().chain().redo().run() ?? false,
      }
    },
  })

  const currentBlockLevel = editorState?.isHeading1
    ? 'h1'
    : editorState?.isHeading2
    ? 'h2'
    : editorState?.isHeading3
    ? 'h3'
    : 'p'

  const handleHeadingChange = (value: string) => {
    if (!editor) return
    switch (value) {
      case 'p':
        editor.chain().focus().setParagraph().run()
        break
      case 'h1':
        editor.chain().focus().setHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().setHeading({ level: 2 }).run()
        break
      case 'h3':
        editor.chain().focus().setHeading({ level: 3 }).run()
        break
      default:
        break
    }
  }

  return (
    <div
      className="fixed bottom-0 z-40"
      style={{ left: leftOffset, right: rightOffset }}
      aria-hidden={!editMode}
    >
      <div className={[
        "mb-4 px-4 transition-all duration-300 ease-out flex justify-center",
        editMode ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none",
      ].join(" ")}>
        <div className="border w-fit p-1 rounded-lg bg-background shadow-sm">
      <div className="flex items-center gap-2">
      

        <Select value={currentBlockLevel} onValueChange={handleHeadingChange} disabled={!editor}>
          <SelectTrigger className="border-none shadow-none hover:bg-accent hover:cursor-pointer">
            <SelectValue placeholder="Text" />
          </SelectTrigger>
          <SelectContent className="mb-2">
            <SelectItem value="p">Text</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />

        <div>
        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    <IconList />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert List</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert Ordered List</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                    <IconTable />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert Table</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                    <IconQuote />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert Blockquote</p>
            </TooltipContent>
        </Tooltip>

        <InlineMathBoard />

        <BlockMathBoard />
        </div>

        <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />
        
        <div>
        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().undo().run()} disabled={!editorState?.canUndo}>
                    <IconArrowBackUp />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Undo</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon" onClick={() => editor?.chain().focus().redo().run()} disabled={!editorState?.canRedo}>
                    <IconArrowForwardUp />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Redo</p>
            </TooltipContent>
        </Tooltip>

        </div>

       
      </div>
        </div>
      </div>
    </div>
  )
}


