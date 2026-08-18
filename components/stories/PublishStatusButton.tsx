'use client'

import { useChangeStoryStatus } from '@/hooks/mutations/useStoryMutations'
import type { Story, StoryStatus } from '@/components/stories/interfaces'

interface PublishStatusButtonProps {
  storyId: string
  currentStatus: StoryStatus
  onSuccessAction?: (updatedStory: Story) => void
  onErrorAction?: (error: Error) => void
  className?: string
}

export function PublishStatusButton({
  storyId,
  currentStatus,
  onSuccessAction,
  onErrorAction,
  className = '',
}: PublishStatusButtonProps) {
  const { mutate: changeStatus, isPending } = useChangeStoryStatus(storyId, {
    onSuccess: (updatedStory) => {
      onSuccessAction?.(updatedStory)
    },
    onError: (error) => {
      onErrorAction?.(error)
    },
  })

  // Determinar la acción según el estado actual
  const isPublished = currentStatus === 'PUBLISHED'
  const targetStatus: StoryStatus = isPublished ? 'DRAFT' : 'PUBLISHED'

  const handleToggleStatus = () => {
    changeStatus(targetStatus)
  }

  return (
    <button
      onClick={handleToggleStatus}
      disabled={isPending}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        isPublished
          ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          : 'bg-emerald-600 text-white hover:bg-emerald-700'
      } ${className}`}
    >
      {isPending ? (
        <>
          <svg
            className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              path='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
          Procesando...
        </>
      ) : isPublished ? (
        'Revertir a Borrador'
      ) : (
        'Publicar Relato'
      )}
    </button>
  )
}
