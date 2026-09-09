'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { symptomService } from '@/services/symptom-service'

export function SymptomCombobox({
  value,
  onChange,
}: {
  value?: string
  onChange: (id?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const { data: symptoms = [] } = useQuery({
    queryKey: ['symptoms'],
    queryFn: symptomService.getAll,
  })
  const selected = symptoms.find((s) => s.symptom_id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        {selected ? selected.name : 'Filtrar por síntoma...'}
        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
      </PopoverTrigger>
      <PopoverContent className='w-60 p-0'>
        <Command>
          <CommandInput placeholder='Buscar síntoma...' />
          <CommandList>
            <CommandEmpty>No se encontró el síntoma.</CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  onSelect={() => {
                    onChange(undefined)
                    setOpen(false)
                  }}
                  className='text-muted-foreground'
                >
                  Limpiar filtro
                </CommandItem>
              )}
              {symptoms.map((symptom) => (
                <CommandItem
                  key={symptom.symptom_id}
                  value={symptom.name}
                  onSelect={() => {
                    onChange(
                      symptom.symptom_id === value
                        ? undefined
                        : symptom.symptom_id,
                    )
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === symptom.symptom_id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {symptom.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
