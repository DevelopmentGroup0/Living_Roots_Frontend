'use client'

import { Loader2, AlertCircle, Plus } from 'lucide-react'
import { useMyStories } from '@/hooks/queries/useStories'
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
import type {
  Story,
  CulturalCategory,
  StoryStatus,
  StoryFilterQuery,
} from './interfaces'

interface MyStoriesListProps {
  onCreateNew?: () => void
  onEditStory?: (story: Story) => void
  onDeleteStory?: (story: Story) => void
  onViewStory?: (story: Story) => void
}

export function MyStoriesList({
  onCreateNew,
  onEditStory,
  onDeleteStory,
  onViewStory,
}: MyStoriesListProps) {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<CulturalCategory | undefined>()
  const [status, setStatus] = useState<StoryStatus | undefined>()
  const [search, setSearch] = useState('')

  const filters: StoryFilterQuery = {
    page,
    limit: 10,
    category,
    status,
    search: search || undefined,
  }

  const { data, isLoading, error } = useMyStories(filters)

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
          <p className='font-semibold text-red-900'>Error al cargar tus relatos</p>
          <p className='text-sm text-red-700'>
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      </div>
    )
  }

  const stories = data?.data || []
  const totalPages = data?.lastPage || 1
  const total = data?.total || 0

  return (
    <div className='space-y-4'>
      {/* Header con botón de crear */}
      <div className='flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>Mis Relatos</h2>
          <p className='text-sm text-gray-600'>
            Tienes <strong>{total}</strong> relato{total !== 1 ? 's' : ''}
          </p>
        </div>
        {onCreateNew && (
          <Button
            onClick={onCreateNew}
            className='bg-amber-600 hover:bg-amber-700 gap-2'
          >
            <Plus className='w-4 h-4' />
            Nuevo Relato
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className='bg-white p-4 rounded-lg border border-gray-200 space-y-3'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
          {/* Búsqueda */}
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Buscar por título
            </label>
            <Input
              type='text'
              placeholder='Ej: medicina...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
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
                setCategory(
                  value === 'all' ? undefined : (value as CulturalCategory)
                )
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas</SelectItem>
                {Object.entries(categoriesLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div>
            <label className='text-sm font-medium text-gray-700 block mb-1'>
              Estado
            </label>
            <Select
              value={status || 'all'}
              onValueChange={(value) => {
                setStatus(value === 'all' ? undefined : (value as StoryStatus))
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos</SelectItem>
                <SelectItem value='DRAFT'>Borradores</SelectItem>
                <SelectItem value='PUBLISHED'>Publicados</SelectItem>
                <SelectItem value='ARCHIVED'>Archivados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limpiar filtros */}
          <div className='flex items-end'>
            <Button
              onClick={() => {
                setSearch('')
                setCategory(undefined)
                setStatus(undefined)
                setPage(1)
              }}
              variant='outline'
              className='w-full'
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center py-8'>
          <Loader2 className='w-6 h-6 text-amber-600 animate-spin' />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && stories.length === 0 && (
        <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-gray-600 mb-4'>
            {total === 0
              ? 'Aún no tienes relatos. ¡Comienza creando uno!'
              : 'No hay relatos que coincidan con tu búsqueda.'}
          </p>
          {total === 0 && onCreateNew && (
            <Button
              onClick={onCreateNew}
              className='bg-amber-600 hover:bg-amber-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              Crear Primer Relato
            </Button>
          )}
        </div>
      )}

      {/* Stories list */}
      {!isLoading && stories.length > 0 && (
        <>
          <div className='space-y-3'>
            {stories.map((story) => (
              <div key={story.story_id} className='flex gap-2'>
                <div className='flex-1'>
                  <StoryCard
                    story={story}
                    onEdit={onEditStory}
                    onDelete={onDeleteStory}
                    onView={onViewStory}
                    isAuthor={true}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-lg'>
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
