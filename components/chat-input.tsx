
import * as React from "react"
import { IconBrain, IconCheck, IconInfoCircle, IconPlus } from "@tabler/icons-react"
import { ArrowUpIcon, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AiTools } from "./ai-tools"
import { Button } from "@/components/ui/button"
import { Switch } from "./ui/switch"
import { QuizBtn } from "@/components/quiz-btn"
import { FlashcardsBtn } from "@/components/flashcards-btn"



export  function ChatInput({ value, onChange, onSend, loading, onGenerateQuiz, onGenerateFlashcards }: { value: string; onChange: (v: string) => void; onSend: (scope: boolean) => void; loading?: boolean; onGenerateQuiz?: () => void; onGenerateFlashcards?: () => void }) {
    const [toolsOpen, setToolsOpen] = React.useState(false)
    const [scoped, setScoped] = React.useState(true)

    return (
      <div className="grid w-full ">
          <div
            className={`rounded-t-xl  py-2 transition-all duration-300 overflow-hidden ${toolsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
          aria-hidden={!toolsOpen}
        >
            <div className="grid grid-cols-2 gap-2">
              <QuizBtn onClick={() => { onGenerateQuiz?.(); setToolsOpen(false) }} />
              <FlashcardsBtn onClick={() => { onGenerateFlashcards?.(); setToolsOpen(false) }} />
            </div>
        </div>
        
        <InputGroup>
          <InputGroupTextarea
            placeholder="Ask about this note..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (!loading && value.trim()) onSend(scoped)
              }
            }}
            disabled={loading}
          />
          <InputGroupAddon align="block-end" className="justify-between">
            <div className="flex items-center gap-2">
            <Button
              
              variant="outline"
              className={`rounded-full text-primary ${toolsOpen ? "text-action border-action hover:bg-action/10 hover:text-action dark:text-action dark:border-action dark:hover:bg-action/10 " : "text-primary border-none dark:bg-transparent dark:border-transparent dark:hover:bg-accent dark:hover:text-primary"}`}
              onClick={() => setToolsOpen((v) => !v)}
              aria-expanded={toolsOpen}
              aria-controls="ai-tools-drawer"
            >
              <IconPlus className={`size-4  transition-transform ${toolsOpen ? "rotate-45" : ""}`} />
              AI Tools
            </Button>

            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <span className="text-sm font-medium flex items-center gap-2 ">
              <span className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle className="size-3" />
                  </TooltipTrigger>
                  <TooltipContent className="text-center">
                    <p>When the scope is ON its will use only <br /> the current note as context, otherwise it the <br /> answer won't be limited to the current note.</p>
                  </TooltipContent>
                </Tooltip>
              Scope:
              </span>
              <Switch 
              checked={scoped}
              onCheckedChange={setScoped}
              />
            </span>
            </div>
            
            <InputGroupButton
              variant="default"
              className="rounded-full"
              size="icon-xs"
              disabled={loading || !value.trim()}
              onClick={() => onSend(scoped)}
            >
              <ArrowUpIcon className="text-white"/>
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        
      </div>
    )
  }