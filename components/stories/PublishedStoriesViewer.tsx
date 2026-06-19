'use client'

import { useStoryDialogs } from '@/hooks/useStoryDialogs'
import { ViewStoryDialog } from './dialogs'
import { PublishedStoriesList } from './PublishedStoriesList'

/**
 * PublishedStoriesViewer
 * Componente para visualizar relatos publicados (público)
 * Sin capacidad de edición, solo lectura
 */
export function PublishedStoriesViewer() {
  const dialogs = useStoryDialogs()

  return (
    <div className='space-y-4'>
      {/* Dialog para ver detalle */}
      <ViewStoryDialog
        story={dialogs.viewStory}
        open={dialogs.viewOpen}
        onOpenChange={dialogs.setViewOpen}
      />

      {/* Lista de relatos publicados */}
      <PublishedStoriesList
        onViewStory={dialogs.openViewDialog}
        showFilters={true}
      />
    </div>
  )
}
