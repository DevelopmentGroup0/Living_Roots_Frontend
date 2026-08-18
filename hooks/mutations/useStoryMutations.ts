/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Story Mutation Hooks
 * React Query mutations para crear, editar, cambiar estado y eliminar relatos
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { storyService } from '@/services/story-service'
import { QUERY_KEYS } from '@/constants/query-keys'
import type {
  Story,
  CreateStoryFormValues,
  UpdateStoryFormValues,
  StoryStatus,
} from '@/components/stories/interfaces'

interface UseMutationOptions {
  onSuccess?: (data: Story) => void
  onError?: (error: Error) => void
}

interface UseDeleteMutationOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook: Crear relato
 * RF-001: Crear Relato
 * Invalidar: useMyStories (lista propia con cualquier filtro)
 */
export function useCreateStory(options?: UseMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoryFormValues) => storyService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.mine(),
      })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

/**
 * Hook: Actualizar relato
 * RF-002: Editar Relato
 * Invalidar: stories.detail + stories.mine (todas las variaciones)
 */
export function useUpdateStory(storyId: string, options?: UseMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateStoryFormValues) =>
      storyService.update(storyId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.detail(storyId),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.mine(),
      })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

/**
 * Hook: Cambiar estado del relato
 * RF-003: Cambiar Estado de Relato
 * Invalida: stories.detail + listas propias + listas públicas (todas las variaciones)
 */
export function useChangeStoryStatus(
  storyId: string,
  options?: UseMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: StoryStatus) =>
      storyService.changeStatus(storyId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.detail(storyId),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.mine(),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.published(),
      })
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

/**
 * Hook: Eliminar relato
 * RF-007: Eliminar Relato
 * Invalidar: stories.detail + stories.mine (todas las variaciones)
 */
export function useDeleteStory(
  storyId: string,
  options?: UseDeleteMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => storyService.delete(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.detail(storyId),
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.stories.mine(),
      })
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

/**
 * Hook: Todas las mutaciones en uno (patrón alternativo)
 */
export function useStoryMutations() {
  return {
    create: useCreateStory(),
    update: (storyId: string) => useUpdateStory(storyId),
    changeStatus: (storyId: string) => useChangeStoryStatus(storyId),
    delete: (storyId: string) => useDeleteStory(storyId),
  }
}