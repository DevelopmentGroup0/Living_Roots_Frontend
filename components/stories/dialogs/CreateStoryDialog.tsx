'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { ImageDropzone } from '@/components/herbs/ImageDropzone'
import { Badge } from '@/components/ui/badge'
import { Command } from '@/components/ui/command'
import {
  createStorySchema,
  type CreateStoryFormValues,
  categoriesLabels,
} from '@/schemas/story.schema'
import { useSearchTags } from '@/hooks/queries/useStories'
import type { Story, CulturalCategory } from './interfaces'

interface CreateStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateStoryFormValues) => Promise<Story>
  isLoading?: boolean
}

const defaultValues: CreateStoryFormValues = {
  title: '',
  body: '',
  category: 'OTHER' as CulturalCategory,
  tags: [],
  coverImage: '',
}

export function CreateStoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateStoryDialogProps) {
  const form = useForm<CreateStoryFormValues>({
    resolver: zodResolver(createStorySchema),
    defaultValues,
  })

  const [tagInput, setTagInput] = useState('')
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const { data: tagSuggestions = [] } = useSearchTags(tagInput)

  const tags = form.watch('tags') || []

  const handleAddTag = (tag: string) => {
    const normalized = tag.toLowerCase().trim().replace(/\s+/g, '-')
    if (!tags.includes(normalized) && tags.length < 10) {
      form.setValue('tags', [...tags, normalized])
      setTagInput('')
      setShowTagSuggestions(false)
    }
  }

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      'tags',
      tags.filter((t) => t !== tag)
    )
  }

  const handleSubmit = async (values: CreateStoryFormValues) => {
    await onSubmit(values)
    form.reset(defaultValues)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-4xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-amber-700 text-xl font-bold'>
            <Plus className='w-5 h-5' />
            Crear Nuevo Relato
          </DialogTitle>
          <DialogDescription>
            Comparte tu historia cultural en DRAFT. Puedes publicarla después.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[70vh] p-4'>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-5 py-2'
          >
            {/* Título */}
            <FieldGroup>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-story-title'>
                      Título <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id='form-create-story-title'
                      aria-invalid={fieldState.invalid}
                      placeholder='Ej: La medicina ancestral de mi abuela'
                      maxLength={200}
                    />
                    <div className='text-xs text-gray-500 mt-1'>
                      {field.value.length}/200 caracteres
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Categoría */}
            <FieldGroup>
              <Controller
                name='category'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-story-category'>
                      Categoría <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <select
                      {...field}
                      id='form-create-story-category'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500'
                    >
                      {Object.entries(categoriesLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Contenido */}
            <FieldGroup>
              <Controller
                name='body'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-story-body'>
                      Contenido del Relato{' '}
                      <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id='form-create-story-body'
                        placeholder='Cuéntanos tu historia... Mínimo 50 caracteres.'
                        rows={8}
                        className='min-h-32 resize-none'
                        aria-invalid={fieldState.invalid}
                        maxLength={50000}
                      />
                      <InputGroupAddon align='block-end'>
                        <InputGroupText className='tabular-nums'>
                          {field.value.length}/50000 caracteres
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Tags */}
            <FieldGroup>
              <FieldLabel htmlFor='form-create-story-tags'>
                Etiquetas (máx 10)
              </FieldLabel>
              <div className='space-y-2'>
                {/* Input y sugerencias */}
                <div className='relative'>
                  <Input
                    id='form-create-story-tags'
                    type='text'
                    placeholder='Agrega una etiqueta y presiona Enter...'
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value)
                      setShowTagSuggestions(true)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (tagInput.trim()) {
                          handleAddTag(tagInput)
                        }
                      }
                    }}
                    disabled={tags.length >= 10}
                    maxLength={50}
                  />

                  {/* Sugerencias de tags */}
                  {showTagSuggestions && tagInput.trim() && tagSuggestions.length > 0 && (
                    <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg'>
                      {tagSuggestions.slice(0, 5).map((suggestion) => (
                        <button
                          key={suggestion.tag_id}
                          type='button'
                          onClick={() => handleAddTag(suggestion.name)}
                          className='w-full px-3 py-2 text-left hover:bg-gray-100 border-b last:border-b-0'
                        >
                          {suggestion.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags agregadas */}
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='gap-1 cursor-pointer hover:bg-gray-300'
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <span>×</span>
                    </Badge>
                  ))}
                </div>

                {tags.length >= 10 && (
                  <p className='text-xs text-amber-600'>
                    Límite de 10 etiquetas alcanzado
                  </p>
                )}
              </div>
            </FieldGroup>

            {/* Imagen de portada */}
            <FieldGroup>
              <Controller
                name='coverImage'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-create-story-cover'>
                      Imagen de Portada (Opcional)
                    </FieldLabel>
                    <ImageDropzone
                      value={field.value || ''}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </ScrollArea>

        <DialogFooter className='gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
            className='bg-amber-600 hover:bg-amber-700'
          >
            {isLoading ? 'Guardando...' : 'Guardar como Borrador'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
