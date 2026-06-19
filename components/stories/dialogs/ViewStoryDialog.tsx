/* eslint-disable @next/next/no-img-element */
'use client'

import { Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  categoriesLabels,
  statusLabels,
  statusColors,
} from '@/schemas/story.schema'
import type { Story } from '../interfaces'

interface ViewStoryDialogProps {
  story: Story | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewStoryDialog({
  story,
  open,
  onOpenChange,
}: ViewStoryDialogProps) {
  if (!story) return null
console.log(story)
  const publishDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const categoryLabel =
    categoriesLabels[story.category as keyof typeof categoriesLabels] ||
    story.category

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-2xl max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-amber-700 text-xl font-bold'>
            <Eye className='w-5 h-5' />
            {story.title}
          </DialogTitle>
          <div className='flex items-center gap-2 mt-2 flex-wrap'>
            <DialogDescription>
              <Badge className={statusColors[story.status]}>
                {statusLabels[story.status]}
              </Badge>
              <Badge variant='outline'>{categoryLabel}</Badge>
              {story.readingTime && (
                <span className='text-xs text-gray-600'>
                  ⏱️ {story.readingTime} min de lectura
                </span>
              )}
              {publishDate && (
                <span className='text-xs text-gray-600'>📅 {publishDate}</span>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <ScrollArea className='max-h-[60vh] p-4 border rounded-lg'>
          <div className='space-y-4'>
            {/* Imagen de portada */}
            {story.coverImage && (
              <div className='mb-4'>
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className='w-full h-48 object-cover rounded-lg'
                />
              </div>
            )}

            {/* Metadata */}
            <div className='bg-gray-50 p-3 rounded-lg text-sm'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <span className='font-semibold text-gray-700'>Autor:</span>
                  <p className='text-gray-600'>
                    {story.author?.name} {story.author?.lastName || ''}
                  </p>
                </div>
                <div>
                  <span className='font-semibold text-gray-700'>Creado:</span>
                  <p className='text-gray-600'>
                    {new Date(story.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del relato */}
            <div className='prose prose-sm max-w-none'>
              <p className='whitespace-pre-wrap text-gray-700 leading-relaxed'>
                {story.body}
              </p>
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className='space-y-2'>
                <h4 className='font-semibold text-gray-700 text-sm'>
                  Etiquetas:
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {story.tags.map((tag) => (
                    <Badge key={tag.tag.name} variant='secondary'>
                      {tag.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Footer con timestamps */}
            <div className='text-xs text-gray-500 border-t pt-2 mt-4'>
              <p>ID: {story.story_id}</p>
              <p>
                Último actualizado:{' '}
                {new Date(story.updatedAt).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
