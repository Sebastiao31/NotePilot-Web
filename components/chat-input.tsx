import { IconCheck, IconInfoCircle, IconPlus } from "@tabler/icons-react"
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

export function ChatInput({ value, onChange, onSend, loading }: { value: string; onChange: (v: string) => void; onSend: () => void; loading?: boolean }) {
    return (
      <div className="grid w-full gap-6">
        
        <InputGroup >
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
            <AiTools />  
            
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