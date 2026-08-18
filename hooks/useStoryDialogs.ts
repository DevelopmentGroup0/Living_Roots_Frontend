/**
 * useStoryDialogs Hook
 * Gestiona estado de diálogos para operaciones CRUD de relatos
 * Patrón: Similar a usePlantDialogs
 */

import { useState } from 'react'
import type { Story } from '@/components/stories/interfaces'

export interface StoryDialogState {
  // Create dialog
  createOpen: boolean
  setCreateOpen: (open: boolean) => void

  // Edit dialog
  editOpen: boolean
  selectedStory: Story | null
  setEditOpen: (open: boolean) => void
  setSelectedStory: (story: Story | null) => void

  // Delete confirmation dialog
  deleteOpen: boolean
  storyToDelete: Story | null
  setDeleteOpen: (open: boolean) => void
  setStoryToDelete: (story: Story | null) => void

  // View detail dialog
  viewOpen: boolean
  viewStory: Story | null
  setViewOpen: (open: boolean) => void
  setViewStory: (story: Story | null) => void

  // Utilitarios
  openCreateDialog: () => void
  openEditDialog: (story: Story) => void
  openDeleteDialog: (story: Story) => void
  openViewDialog: (story: Story) => void
  closeAllDialogs: () => void
}

/**
 * Hook: Gestiona estado de diálogos de relatos
 * Evita prop drilling y centraliza lógica de dialogs
 */
export function useStoryDialogs(): StoryDialogState {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewStory, setViewStory] = useState<Story | null>(null)

  const openCreateDialog = () => {
    setCreateOpen(true)
  }

  const openEditDialog = (story: Story) => {
    setSelectedStory(story)
    setEditOpen(true)
  }

  const openDeleteDialog = (story: Story) => {
    setStoryToDelete(story)
    setDeleteOpen(true)
  }

  const openViewDialog = (story: Story) => {
    setViewStory(story)
    setViewOpen(true)
  }

  const closeAllDialogs = () => {
    setCreateOpen(false)
    setEditOpen(false)
    setSelectedStory(null)
    setDeleteOpen(false)
    setStoryToDelete(null)
    setViewOpen(false)
    setViewStory(null)
  }

  return {
    createOpen,
    setCreateOpen,
    editOpen,
    selectedStory,
    setEditOpen,
    setSelectedStory,
    deleteOpen,
    storyToDelete,
    setDeleteOpen,
    setStoryToDelete,
    viewOpen,
    viewStory,
    setViewOpen,
    setViewStory,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDialog,
    closeAllDialogs,
  }
}
