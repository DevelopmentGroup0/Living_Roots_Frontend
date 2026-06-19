'use client'

import { useCallback } from 'react'
import { useStoryDialogs } from '@/hooks/useStoryDialogs'
import { useCreateStory, useUpdateStory, useDeleteStory, useChangeStoryStatus } from '@/hooks/mutations/useStoryMutations'
import {
  CreateStoryDialog,
  EditStoryDialog,
  DeleteStoryDialog,
  ViewStoryDialog,
} from './dialogs'
import { MyStoriesList } from './MyStoriesList'
import type { CreateStoryFormValues, UpdateStoryFormValues } from '@/schemas/story.schema'

/**
 * StoryManagementPanel
 * Contenedor para gestionar relatos personales
 * Integra diálogos + lista + mutaciones
 */
export function StoryManagementPanel() {
  const dialogs = useStoryDialogs()

  // Mutaciones
  const createMutation = useCreateStory({
    onSuccess: () => {
      // Toast de éxito opcional
      console.log('Story created successfully')
    },
    onError: (error) => {
      console.error('Error creating story:', error)
    },
  })

  const updateMutation = useUpdateStory(dialogs.selectedStory?.story_id || '', {
    onSuccess: () => {
      dialogs.setSelectedStory(null)
      console.log('Story updated successfully')
    },
    onError: (error) => {
      console.error('Error updating story:', error)
    },
  })

  const deleteMutation = useDeleteStory(dialogs.storyToDelete?.story_id || '', {
    onSuccess: () => {
      dialogs.setStoryToDelete(null)
      console.log('Story deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting story:', error)
    },
  })

  // Handlers
  const handleCreateStory = useCallback(
    async (data: CreateStoryFormValues) => {
      await createMutation.mutateAsync(data)
    },
    [createMutation]
  )

  const handleUpdateStory = useCallback(
    async (id: string, data: UpdateStoryFormValues) => {
      await updateMutation.mutateAsync(data)
    },
    [updateMutation]
  )

  const handleDeleteStory = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync()
    },
    [deleteMutation]
  )

  return (
    <div className='space-y-4'>
      {/* Dialogs */}
      <CreateStoryDialog
        open={dialogs.createOpen}
        onOpenChange={dialogs.setCreateOpen}
        onSubmit={handleCreateStory}
        isLoading={createMutation.isPending}
      />

      <EditStoryDialog
        story={dialogs.selectedStory}
        open={dialogs.editOpen}
        onOpenChange={dialogs.setEditOpen}
        onSubmit={handleUpdateStory}
        isLoading={updateMutation.isPending}
      />

      <DeleteStoryDialog
        story={dialogs.storyToDelete}
        open={dialogs.deleteOpen}
        onOpenChange={dialogs.setDeleteOpen}
        onConfirm={handleDeleteStory}
        isLoading={deleteMutation.isPending}
      />

      <ViewStoryDialog
        story={dialogs.viewStory}
        open={dialogs.viewOpen}
        onOpenChange={dialogs.setViewOpen}
      />

      {/* List with callbacks */}
      <MyStoriesList
        onCreateNew={dialogs.openCreateDialog}
        onEditStory={dialogs.openEditDialog}
        onDeleteStory={dialogs.openDeleteDialog}
        onViewStory={dialogs.openViewDialog}
      />
    </div>
  )
}
