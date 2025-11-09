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
import * as React from "react"
import { emitNotesSearchChange } from "@/lib/events"

export function SearchNotes() {
  const [query, setQuery] = React.useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    emitNotesSearchChange(q)
  }

  return (
    <div className="grid gap-6">
      <InputGroup className="rounded-lg">
        <InputGroupInput placeholder="Search note" value={query} onChange={handleChange} />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      
    </div>
  )
}
