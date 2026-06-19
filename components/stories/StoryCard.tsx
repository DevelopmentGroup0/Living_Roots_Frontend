/* eslint-disable @next/next/no-img-element */
'use client'

import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  categoriesLabels,
  statusLabels,
  statusColors,
} from '@/schemas/story.schema'
import type { Story } from './interfaces'

interface StoryCardProps {
  story: Story
  onEdit?: (story: Story) => void
  onDelete?: (story: Story) => void
  onView?: (story: Story) => void
  isAuthor?: boolean
}

export function StoryCard({
  story,
  onEdit,
  onDelete,
  onView,
  isAuthor = false,
}: StoryCardProps) {
  const categoryLabel =
    categoriesLabels[story.category as keyof typeof categoriesLabels] ||
    story.category

  const excerpt =
    story.body.length > 150 ? story.body.substring(0, 150) + '...' : story.body

  const publishDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString('es-ES')
    : null

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 space-y-3'>
      {/* Header con imagen y metadata */}
      <div className='flex gap-4'>
        {story.coverImage && (
          <img
            src={story.coverImage}
            alt={story.title}
            className='w-24 h-24 object-cover rounded-lg shrink-0'
          />
        )}

        <div className='flex-1 min-w-0'>
          {/* Título y badges */}
          <div className='flex items-start justify-between gap-2 mb-2'>
            <h3 className='font-semibold text-gray-900 line-clamp-2 flex-1'>
              {story.title}
            </h3>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(story)}>
                      <Eye className='w-4 h-4 mr-2' />
                      Ver Detalle
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(story)}>
                      <Edit className='w-4 h-4 mr-2' />
                      Editar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(story)}
                      className='text-red-600'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Badges de estado y categoría */}
          <div className='flex items-center gap-2 flex-wrap mb-2'>
            <Badge className={statusColors[story.status]}>
              {statusLabels[story.status]}
            </Badge>
            <Badge variant='outline'>{categoryLabel}</Badge>
          </div>

          {/* Autor y fecha */}
          <div className='text-xs text-gray-600 space-y-1'>
            {story.author && (
              <p>
                Por <strong>{story.author.name}</strong>
              </p>
            )}
            {publishDate && <p>📅 Publicado: {publishDate}</p>}
            {story.readingTime && <p>⏱️ {story.readingTime} min de lectura</p>}
          </div>
        </div>
      </div>

      {/* Extracto de contenido */}
      <p className='text-sm text-gray-700 line-clamp-2'>{excerpt}</p>

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {story.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.tag_id} variant='secondary' className='text-xs'>
              #{tag.name}
            </Badge>
          ))}
          {story.tags.length > 3 && (
            <Badge variant='secondary' className='text-xs'>
              +{story.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer con acciones rápidas */}
      {!isAuthor && onView && (
        <Button
          onClick={() => onView(story)}
          variant='outline'
          size='sm'
          className='w-full'
        >
          <Eye className='w-4 h-4 mr-2' />
          Leer Completo
        </Button>
      )}
    </div>
  )
}
