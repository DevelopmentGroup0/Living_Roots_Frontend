'use client'

import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FlaskConical, Loader2, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSymptomSearch } from '@/hooks/useSymptomSearch'
import {
  addSymptomSchema,
  type AddSymptomFormValues,
} from '@/schemas/symptom.schema'
import { Plant, Symptom } from '../interfaces'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

interface AddSymptomDialogProps {
  plant: Plant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (herbId: string, data: AddSymptomFormValues) => Promise<void>
  isLoading?: boolean
}

const defaultValues: AddSymptomFormValues = {
  name: '',
  description: '',
  parts_plant: '',
  prepare: '',
  apply: '',
}

export function AddSymptomDialog({
  plant,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: AddSymptomDialogProps) {
  const form = useForm<AddSymptomFormValues>({
    resolver: zodResolver(addSymptomSchema),
    defaultValues,
  })

  const nameValue = form.watch('name')
  const {
    results,
    isLoading: isSearching,
    notFound,
  } = useSymptomSearch(nameValue)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedExisting, setSelectedExisting] = useState<Symptom | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Abre dropdown cuando hay resultados o el texto es suficiente
  useEffect(() => {
    setDropdownOpen(nameValue.length >= 2)
  }, [nameValue, results])

  const handleSelectSymptom = (symptom: Symptom) => {
    setSelectedExisting(symptom)
    setDropdownOpen(false)
    form.setValue('name', symptom.symptom.name, { shouldValidate: true })
    form.setValue('description', symptom.description ?? '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si el usuario modifica el nombre, ya no aplica el síntoma preseleccionado
    setSelectedExisting(null)
    form.setValue('name', e.target.value, { shouldValidate: true })
  }

  const handleSubmit = async (values: AddSymptomFormValues) => {
    if (!plant) return
    await onSubmit(plant.herb_id, values)
    form.reset(defaultValues)
    setSelectedExisting(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-green-800'>
            <FlaskConical className='w-5 h-5' />
            Agregar Síntoma
          </DialogTitle>
          <DialogDescription>
            Planta: <strong>{plant?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form
          id='form-symptom'
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-4 py-2'
        >
          {/* Nombre con autocomplete */}
          <FieldGroup>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-symptom-name'>
                    Nombre del síntoma <span className='text-red-500'>*</span>
                  </FieldLabel>
                  <div className='relative' ref={dropdownRef}>
                    <div className='relative'>
                      <Input
                        {...field}
                        id='form-symptom-name'
                        aria-invalid={fieldState.invalid}
                        placeholder='Ej: Náuseas'
                        autoComplete='off'
                        onChange={handleNameChange}
                        className={fieldState.error ? 'border-red-300' : ''}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      {isSearching && (
                        <Loader2 className='absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400' />
                      )}
                      {selectedExisting && (
                        <CheckCircle2 className='absolute right-3 top-2.5 h-4 w-4 text-green-500' />
                      )}
                    </div>

                    {/* Dropdown de resultados */}
                    {dropdownOpen && (results.length > 0 || notFound) && (
                      <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                        {results.length > 0 ? (
                          <>
                            <p className='text-xs text-gray-400 px-3 py-2 border-b'>
                              Síntomas existentes — selecciona uno o continúa
                              escribiendo
                            </p>
                            {results.map((symptom) => (
                              <button
                                key={symptom.symptom_id}
                                type='button'
                                className='w-full text-left px-3 py-2.5 hover:bg-green-50 transition-colors'
                                onClick={() => handleSelectSymptom(symptom)}
                              >
                                <p className='text-sm font-medium text-gray-900'>
                                  {symptom.symptom.name}
                                </p>
                                {symptom.description && (
                                  <p className='text-xs text-gray-500 mt-0.5 truncate'>
                                    {symptom.description}
                                  </p>
                                )}
                              </button>
                            ))}
                          </>
                        ) : (
                          <div className='px-3 py-3 text-center'>
                            <p className='text-sm text-gray-500'>
                              No encontrado — se creará un síntoma nuevo
                            </p>
                            <Badge className='mt-1 bg-green-100 text-green-700 text-xs'>
                              Nuevo: {nameValue}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
          {/* <FormField
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <FormItem>
                <div className='relative' ref={dropdownRef}></div>
                <FormDescription className='text-xs'>
                  {selectedExisting
                    ? '✓ Síntoma existente seleccionado'
                    : 'Escribe para buscar síntomas registrados'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del síntoma</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ej: Sensación de malestar estomacal'
                    {...field}
                    disabled={!!selectedExisting} // bloqueado si es síntoma existente
                  />
                </FormControl>
                <FormDescription className='text-xs'>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='parts_plant'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Parte de la planta <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Ej: Raíz, Hojas, Tallo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='prepare'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Preparación <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Ej: Té de jengibre' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='apply'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modo de aplicación</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Ej: Tomar en ayunas, 3 veces al día...'
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-xs'>Opcional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.reset(defaultValues)
                onOpenChange(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-green-600 hover:bg-green-700'
            >
              {isLoading ? 'Guardando...' : 'Agregar Síntoma'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
