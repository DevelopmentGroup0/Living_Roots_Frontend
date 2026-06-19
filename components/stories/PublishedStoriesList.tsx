'use client'

import { Loader2, AlertCircle } from 'lucide-react'
import { usePublishedStories } from '@/hooks/queries/useStories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { StoryCard } from './StoryCard'
import { categoriesLabels } from '@/schemas/story.schema'
import type { Story, CulturalCategory, StoryFilterQuery } from './interfaces'

interface PublishedStoriesListProps {
  onViewStory?: (story: Story) => void
  maxItems?: number
  showFilters?: boolean
}

export function PublishedStoriesList({
  onViewStory,
  maxItems,
  showFilters = true,
}: PublishedStoriesListProps) {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<CulturalCategory | undefined>()
  const [search, setSearch] = useState('')

  const filters: StoryFilterQuery = {
    page,
    limit: maxItems || 10,
    category,
    search: search || undefined,
  }

  const { data, isLoading, error } = usePublishedStories(filters)

  const handleNextPage = () => {
    if (data && page < data.lastPage) {
      setPage(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  if (error) {
    return (
      <div className='flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg'>
        <AlertCircle className='w-5 h-5 text-red-600 shrink-0' />
        <div>
          <p className='font-semibold text-red-900'>Error al cargar relatos</p>
          <p className='text-sm text-red-700'>
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      </div>
    )
  }

  const stories = data?.data || []
  const totalPages = data?.lastPage || 1

  return (
    <div className='space-y-4'>
      {/* Filtros */}
      {showFilters && (
        <div className='bg-white p-4 rounded-lg border border-gray-200 space-y-3'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {/* Búsqueda */}
            <div>
              <label className='text-sm font-medium text-gray-700 block mb-1'>
                Buscar por título
              </label>
              <Input
                type='text'
                placeholder='Ej: medicina ancestral...'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className='w-full'
              />
            </div>

            {/* Categoría */}
            <div>
              <label className='text-sm font-medium text-gray-700 block mb-1'>
                Categoría
              </label>
              <Select
                value={category || 'all'}
                onValueChange={(value) => {
                  setCategory(value === 'all' ? undefined : (value as CulturalCategory))
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas las categorías</SelectItem>
                  {Object.entries(categoriesLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className='flex items-end'>
              <div className='text-sm text-gray-600'>
                <strong>{data?.total || 0}</strong> relatos encontrados
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center py-8'>
          <Loader2 className='w-6 h-6 text-amber-600 animate-spin' />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && stories.length === 0 && (
        <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-gray-600'>
            No hay relatos publicados que coincidan con tu búsqueda.
          </p>
        </div>
      )}

      {/* Stories grid */}
      {!isLoading && stories.length > 0 && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {stories.map((story) => (
              <StoryCard
                key={story.story_id}
                story={story}
                onView={onViewStory}
                isAuthor={false}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-3 mt-6 p-4 bg-white border border-gray-200 rounded-lg'>
              <Button
                onClick={handlePrevPage}
                disabled={page === 1 || isLoading}
                variant='outline'
              >
                Anterior
              </Button>
              <span className='text-sm text-gray-600'>
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
              </span>
              <Button
                onClick={handleNextPage}
                disabled={page >= totalPages || isLoading}
                variant='outline'
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
