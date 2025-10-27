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

export function ChatInput() {
    return (
      <div className="grid w-full gap-6">
        
        <InputGroup >
          <InputGroupTextarea placeholder="Ask about this note..."  />
          <InputGroupAddon align="block-end" className="justify-between">
            <InputGroupButton
              variant="outline"
              className="rounded-full"
              size="icon-xs"
            >
              <IconPlus />
            </InputGroupButton>
            
            <InputGroupButton
              variant="default"
              className="rounded-full"
              size="icon-xs"
            >
              <ArrowUpIcon className="text-white"/>
              <span className="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        
      </div>
    )
  }