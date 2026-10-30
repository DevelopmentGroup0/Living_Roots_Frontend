'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, ListFilter } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
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
      <PopoverTrigger
        aria-label={
          selected ? `Filtrando por ${selected.name}` : 'Filtrar por síntoma'
        }
        className={cn(
          'relative flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border bg-white px-3 text-sm transition-colors hover:bg-gray-50 sm:w-52 lg:w-60',
          selected ? 'border-green-600 text-green-700' : 'border-input',
        )}
      >
        {/* En móvil solo se muestra el icono; el nombre aparece desde sm */}
        <ListFilter className='h-4 w-4 shrink-0 sm:hidden' />
        {selected && (
          <span
            aria-hidden='true'
            className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-600 sm:hidden'
          />
        )}
        <span className='hidden min-w-0 flex-1 truncate text-left sm:inline'>
          {selected ? selected.name : 'Filtrar por síntoma...'}
        </span>
        <ChevronsUpDown className='hidden h-4 w-4 shrink-0 opacity-50 sm:inline' />
      </PopoverTrigger>
      <PopoverContent align='end' className='w-60 max-w-[calc(100vw-1.5rem)] p-0'>
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
