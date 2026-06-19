/**
 * Story Query Hooks
 * React Query hooks para consultas de relatos
 */

import { useQuery } from '@tanstack/react-query'
import { storyService } from '@/services/story-service'
import { QUERY_KEYS } from '@/constants/query-keys'
import type {
  Story,
  StoryFilterQuery,
  PaginatedResponse,
} from '@/components/stories/interfaces'

/**
 * Hook: Listar relatos PUBLICADOS
 * RF-004: Listar Relatos Publicados
 */
export function usePublishedStories(filters?: StoryFilterQuery) {
  return useQuery<PaginatedResponse<Story>>({
    queryKey: QUERY_KEYS.stories.published(filters),
    queryFn: () => storyService.getPublished(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (antes: cacheTime)
  })
}

/**
 * Hook: Listar mis relatos (DRAFT + PUBLISHED + ARCHIVED)
 * RF-005: Listar Mis Relatos
 * Requiere autenticación
 */
export function useMyStories(filters?: StoryFilterQuery) {
  return useQuery<PaginatedResponse<Story>>({
    queryKey: QUERY_KEYS.stories.mine(filters),
    queryFn: () => storyService.getMine(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
  })
}

/**
 * Hook: Obtener detalle de un relato
 * RF-006: Ver Detalle de Relato
 */
export function useStoryDetail(storyId: string, token?: string) {
  return useQuery<Story>({
    queryKey: QUERY_KEYS.stories.detail(storyId),
    queryFn: () => storyService.getById(storyId, token),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    enabled: !!storyId, // Solo consulta si hay ID
  })
}

/**
 * Hook: Buscar tags para autocomplete
 * RF-008: Autocomplete de Etiquetas
 */
export function useSearchTags(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.stories.tags.search(query),
    queryFn: () => storyService.searchTags(query),
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 20, // 20 minutos
    enabled: query.length > 0, // Solo consulta si hay query
  })
}
