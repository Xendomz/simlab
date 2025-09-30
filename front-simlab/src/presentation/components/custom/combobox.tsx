"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/presentation/lib/utils"
import { Button } from "@/presentation/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/presentation/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover"

type ComboboxProps<T extends Record<string, any>> = {
  options: T[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  optionValueKey?: keyof T
  optionLabelKey?: keyof T,
  isFilter?: boolean
}

export function Combobox<T extends Record<string, any>>({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  optionValueKey = "value",
  optionLabelKey = "label",
  isFilter = false
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)

  const selectedLabel =
    options.find((opt) => opt[optionValueKey] == value)?.[optionLabelKey]

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between font-normal ${selectedLabel ? '' : 'text-muted-foreground'}`}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {isFilter && (
                <CommandItem
                  value={'0'}
                  onSelect={() => {
                    onChange('0')
                    setOpen(false)
                  }}
                  className="flex justify-between"
                >
                  Semua
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == '0' ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {options.map((option, i) => {
                const optionValue = option[optionValueKey] as string
                const optionLabel = option[optionLabelKey] as string
                return (
                  <CommandItem
                    key={i}
                    value={optionValue}
                    onSelect={() => {
                      onChange(optionValue)
                      setOpen(false)
                    }}
                    className="flex justify-between"
                  >
                    {optionLabel}
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value == optionValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
