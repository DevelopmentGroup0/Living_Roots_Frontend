'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  EditPlantFormInput,
  EditPlantFormOutput,
  editPlantSchema,
} from '@/schemas/herbs.schema'
import { Plant } from '../interfaces'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '../../ui/input-group'
import { ScrollArea } from '../../ui/scroll-area'
import { ImageDropzone } from '../ImageDropzone'

// S: Solo maneja el formulario de edición
// D: Recibe callbacks, no sabe cómo se persiste
interface EditPlantDialogProps {
  plant: Plant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: string, data: EditPlantFormOutput) => Promise<Plant>
  isLoading?: boolean
}

export function EditPlantDialog({
  plant,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: EditPlantDialogProps) {
  const form = useForm<EditPlantFormInput>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      name: '',
      description: '',
      img: '',
      cultivator: '',
      important: '',
    },
  })

  // Sincroniza los campos del formulario con la info de la planta seleccionada
  useEffect(() => {
    if (plant) {
      form.reset({
        name: plant.name,
        description: plant.description,
        img: plant.img,
        cultivator: plant.cultivator || '',
        important: plant.important || '',
      })
    }
  }, [plant, form])

  const handleSubmit = async (values: EditPlantFormOutput) => {
    if (!plant) return
    console.log(
      'Submitting edit for plant ID:',
      plant.herb_id,
      'with values:',
      values,
    )
    await onSubmit(plant.herb_id, values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-4xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-green-800 text-xl font-bold'>
            <Edit className='w-5 h-5' />
            Editar Planta Medicinal
          </DialogTitle>
          <DialogDescription>
            Modifica la información de <strong>{plant?.name}</strong>. ID:{' '}
            {plant?.herb_id}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[70vh] p-4 '>
          <form
            id='form-create-plant'
            onSubmit={form.handleSubmit(handleSubmit)}
            className='grid gap-4 py-4'
          >
            <FieldGroup>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-plant-name'>
                      Nombre de la Planta
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
                      Descripción
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
                          {field.value.length}/300 characters
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
                            {field.value?.length}/300 characters
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
            <Field />

            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <p className='text-sm text-green-800'>
                <strong>Nota:</strong> Los cambios se aplicarán inmediatamente a
                todos los registros relacionados.
              </p>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className={`bg-green-600 hover:bg-green-700 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
