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
 * Invalidar: useMyStories (lista propia)
 */
export function useCreateStory(options?: UseMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStoryFormValues) => storyService.create(data),
    onSuccess: (data) => {
      // Invalida la lista de mis relatos para refrescar
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
 * Invalidar: stories.detail + stories.mine
 */
export function useUpdateStory(storyId: string, options?: UseMutationOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateStoryFormValues) =>
      storyService.update(storyId, data),
    onSuccess: (data) => {
      // Invalida detalle y lista
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
 * Transiciones: DRAFT→PUBLISHED, PUBLISHED→ARCHIVED, etc.
 * Invalida: stories.detail + stories.mine + stories.published
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
      // Invalida detalle, lista propia y publicados
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
 * Invalidar: stories.detail + stories.mine
 */
export function useDeleteStory(
  storyId: string,
  options?: UseDeleteMutationOptions
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => storyService.delete(storyId),
    onSuccess: () => {
      // Invalida detalle y lista
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
 * Útil para componentes que usen múltiples operaciones
 */
export function useStoryMutations() {
  return {
    create: useCreateStory(),
    update: (storyId: string) => useUpdateStory(storyId),
    changeStatus: (storyId: string) => useChangeStoryStatus(storyId),
    delete: (storyId: string) => useDeleteStory(storyId),
  }
}
