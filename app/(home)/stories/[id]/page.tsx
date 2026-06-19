'use client'

import { useStoryDetail } from '@/hooks/queries/useStories'
import { useStoryDialogs } from '@/hooks/useStoryDialogs'
import { ViewStoryDialog } from '@/components/stories/dialogs'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StoryDetailPageProps {
  params: {
    id: string
  }
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { data: story, isLoading, error } = useStoryDetail(params.id)
  const dialogs = useStoryDialogs()

  // Auto-open dialog cuando se carga el relato
  if (story && !dialogs.viewOpen && !dialogs.viewStory) {
    dialogs.openViewDialog(story)
  }

  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        {/* Back button */}
        <div className='mb-6'>
          <Link href='/stories'>
            <Button variant='outline' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Volver a Relatos
            </Button>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className='flex justify-center py-12'>
            <Loader2 className='w-8 h-8 text-amber-600 animate-spin' />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className='flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
            <div>
              <p className='font-semibold text-red-900'>
                Error al cargar el relato
              </p>
              <p className='text-sm text-red-700'>
                {error instanceof Error ? error.message : 'Error desconocido'}
              </p>
            </div>
          </div>
        )}

        {/* Dialog for viewing story */}
        <ViewStoryDialog
          story={dialogs.viewStory}
          open={dialogs.viewOpen}
          onOpenChange={dialogs.setViewOpen}
        />
      </div>
    </main>
  )
}
