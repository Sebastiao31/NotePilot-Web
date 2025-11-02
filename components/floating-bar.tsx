"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useChatSidebar } from "@/components/chat-provider"
import { useNoteSidebar } from "@/components/note-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { useEditMode } from "@/components/edit-mode-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { IconArrowBackUp, IconArrowForwardUp, IconMathFunctionY, IconSquareRoot2, IconTable, IconBold } from "@tabler/icons-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import { SquareCode, SquareSigma } from "lucide-react"
import { useEditorBridge } from "@/components/richTextEditor/editor-context"

// Constants mirrored from ui/sidebar.tsx for layout math
const APP_SIDEBAR_WIDTH_EXPANDED = 14 * 16 // 14rem
const APP_SIDEBAR_WIDTH_ICON = 3 * 16 // 3rem

export function FloatingBar() {
  const { editMode } = useEditMode()
  const { open: chatOpen, width: chatWidth } = useChatSidebar()
  const { open: noteOpen, width: noteWidth } = useNoteSidebar()
  const { state, isMobile } = useSidebar()
  const { editor } = useEditorBridge()

  if (!editMode) return null

  const leftOffset = isMobile
    ? 0
    : (state === "expanded" ? APP_SIDEBAR_WIDTH_EXPANDED : APP_SIDEBAR_WIDTH_ICON) + (noteOpen ? noteWidth : 0)
  const rightOffset = isMobile ? 0 : (chatOpen ? chatWidth : 0)

  return (
    <div
      className="fixed bottom-0 mb-4 mx-4 z-40 border w-fit p-1 rounded-lg"
      style={{ left: leftOffset, right: rightOffset }}
    >
      <div className="flex items-center gap-2">
         <Tooltip>
             <TooltipTrigger asChild>
                 <Button variant="ghost" size="icon" disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()}>
                     <IconBold />
                 </Button>
             </TooltipTrigger>
             <TooltipContent>
                 <p>Bold</p>
             </TooltipContent>
         </Tooltip>

        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a note" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="1">Note 1</SelectItem>
                <SelectItem value="2">Note 2</SelectItem>
                <SelectItem value="3">Note 3</SelectItem>
            </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />

        <div>
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
                <Button variant="ghost" size="icon">
                    <SquareCode />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert Code Block</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon">
                    <IconSquareRoot2 />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert Inline Equation</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon">
                    <SquareSigma />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Insert Math Block</p>
            </TooltipContent>
        </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:h-4" />
        
        <div>
        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon">
                    <IconArrowBackUp />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Undo</p>
            </TooltipContent>
        </Tooltip>

        <Tooltip>
            <TooltipTrigger>
                <Button variant="ghost" size="icon">
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
  )
}


