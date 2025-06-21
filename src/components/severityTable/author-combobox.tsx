"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { trpc } from "@/app/_trpc/client"
import { useProject } from "@/hooks/use-project"


export function AuthorCombobox() {
  const { projectId } = useProject()
  const {data: commits} = trpc.getCommitSecurityScans.useQuery({projectId})

  const authorOptions = Array.from(
    new Set(commits?.map(c => c.commit.commitAuthorName))
    ).map(author => ({
    value: author,
    label: author
  }))


  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? authorOptions.find((author) => author.value === value)?.label
            : "Select authors..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Filter authors..." className="h-9" />
          <CommandList>
            <CommandEmpty>Not a contributor.</CommandEmpty>
            <CommandGroup>
              {authorOptions.map((author) => (
                <CommandItem
                  key={author.value}
                  value={author.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {author.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === author.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
