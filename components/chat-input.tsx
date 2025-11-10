import * as React from "react"
import { IconBrain, IconCards, IconCheck, IconCheckbox, IconInfoCircle, IconPlus } from "@tabler/icons-react"
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

export function ChatInput({ value, onChange, onSend, loading, onGenerateQuiz }: { value: string; onChange: (v: string) => void; onSend: () => void; loading?: boolean; onGenerateQuiz?: () => void }) {
    const [toolsOpen, setToolsOpen] = React.useState(false)
    return (
      <div className="grid w-full ">
          <div
            className={`rounded-t-xl  py-2 transition-all duration-300 overflow-hidden ${toolsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
          aria-hidden={!toolsOpen}
        >
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline"  onClick={() => { onGenerateQuiz?.(); setToolsOpen(false) }}>
              <IconCheckbox className="size-4 text-badge-blue" />
              Quiz
            </Button>
            <Button variant="outline" >
              <IconCards className="size-4 text-badge-green" />
              Flashcards
            </Button>
            <Button variant="outline" >
              <IconBrain className="size-4 text-badge-purple" />
              Mindmap
            </Button>
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
                if (!loading && value.trim()) onSend()
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
              Scope:
              <Switch
              
              />
            </span>
            </div>
            
            <InputGroupButton
              variant="default"
              className="rounded-full"
              size="icon-xs"
              disabled={loading || !value.trim()}
              onClick={onSend}
            >
              <ArrowUpIcon className="text-white"/>
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        
      </div>
    )
  }