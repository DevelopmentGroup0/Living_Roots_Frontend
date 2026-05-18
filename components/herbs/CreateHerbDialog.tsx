'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Leaf } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageDropzone } from './ImageDropzone'
import { CreateHerbFormValues, createHerbSchema } from '@/schemas/herbs.schema'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '../ui/input-group'
import { Plant } from './interfaces'
import { ScrollArea } from '../ui/scroll-area'

interface CreateHerbDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateHerbFormValues) => Promise<Plant>
  isLoading?: boolean
}

const defaultValues = {
  name: '',
  description: '',
  img: '',
  cultivator: '',
  important: '',
}

export function CreateHerbDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateHerbDialogProps) {
  const form = useForm<CreateHerbFormValues>({
    resolver: zodResolver(createHerbSchema),
    defaultValues,
  })

  const handleSubmit = async (values: CreateHerbFormValues) => {
    await onSubmit(values)
    form.reset(defaultValues)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-4xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-green-800'>
            <Leaf className='w-5 h-5' />
            Registrar Planta Medicinal
          </DialogTitle>
          <DialogDescription>
            Completa los datos básicos. Los síntomas se agregan desde la tabla.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] p-4 '>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-5 py-2'
          >
            <FieldGroup>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-plant-name'>
                      Nombre de la Planta{' '}
                      <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id='form-create-plant-name'
                      aria-invalid={fieldState.invalid}
                      placeholder='Ej: Manzanilla'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-plant-description'>
                      Descripción <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id='form-create-plant-description'
                        placeholder='Describe las propiedades medicinales...'
                        rows={6}
                        className='min-h-24 resize-none'
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align='block-end'>
                        <InputGroupText className='tabular-nums'>
                          {field.value.length}/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='img'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-plant-img'>
                      Imagen <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <ImageDropzone
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  </Field>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <Controller
                  name='cultivator'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='form-create-plant-cultivator'>
                        Condiciones de cultivo
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id='form-create-plant-cultivator'
                          placeholder='Enseña cómo cultivar esta planta...'
                          rows={6}
                          className='min-h-24 resize-none'
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name='important'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='form-create-plant-important'>
                        Efectos colaterales / Advertencias
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id='form-create-plant-important'
                          placeholder='Describe los efectos colaterales o advertencias...'
                          rows={6}
                          className='min-h-24 resize-none'
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align='block-end'>
                          <InputGroupText className='tabular-nums'>
                            {field.value?.length}/100 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            <DialogFooter className='pt-2'>
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
                {isLoading ? 'Guardando...' : 'Registrar Planta'}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
