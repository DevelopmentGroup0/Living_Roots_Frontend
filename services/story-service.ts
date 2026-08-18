/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Story Service
 * API client para operaciones CRUD de relatos
 * Patrón: Reutiliza apiClient + NextAuth session
 */

import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import type {
  Story,
  CreateStoryFormValues,
  UpdateStoryFormValues,
  StoryFilterQuery,
  PaginatedResponse,
  StoryStatus,
} from '@/components/stories/interfaces'

/**
 * Obtiene el token JWT de la sesión NextAuth
 * Se reutiliza en todas las llamadas autenticadas
 */
async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }
  return session?.accessToken as string | undefined
}

/**
 * Construye query string desde filtros
 */
function buildQueryString(filters?: StoryFilterQuery): string {
  if (!filters) return ''

  const params = new URLSearchParams()
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())
  if (filters.category) params.append('category', filters.category)
  if (filters.status) params.append('status', filters.status)
  if (filters.search) params.append('search', filters.search)

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Story Service
 * Métodos CRUD para gestión de relatos
 */
export const storyService = {
  /**
   * RF-004: Listar relatos PUBLISHED (público)
   * Sin autenticación requerida
   */
  async getPublished(
    filters?: StoryFilterQuery,
  ): Promise<PaginatedResponse<Story>> {
    const token = await getToken()
    const queryString = buildQueryString(filters)
    return apiClient.get<PaginatedResponse<Story>>(
      `/stories/published${queryString}`, token
    )
  },

  /**
   * RF-005: Listar mis relatos (autenticado)
   * Retorna DRAFT, PUBLISHED, ARCHIVED del usuario
   */
  async getMine(filters?: StoryFilterQuery): Promise<PaginatedResponse<Story>> {
    const token = await getToken()
    const queryString = buildQueryString(filters)
    return apiClient.get<PaginatedResponse<Story>>(
      `/stories/mine${queryString}`,
      token,
    )
  },

  /**
   * RF-006: Obtener detalle de un relato
   * Autorización: PUBLIC si PUBLISHED, solo owner/admin si DRAFT/ARCHIVED
   */
  async getById(storyId: string, token?: string): Promise<Story> {
    try {
      return await apiClient.get<Story>(`/stories/${storyId}`, token)
    } catch (error) {
      throw new Error(`No se pudo obtener el relato: ${storyId}`)
    }
  },

  /**
   * RF-001: Crear relato en DRAFT
   * Autenticación requerida
   * Retorna: Story creado con UUID
   */
  async create(data: CreateStoryFormValues): Promise<Story> {
    const token = await getToken()
    return apiClient.post<Story>('/stories', data, token)
  },

  /**
   * RF-002: Editar relato existente
   * Autenticación requerida
   * Solo owner o admin pueden editar
   */
  async update(storyId: string, data: UpdateStoryFormValues): Promise<Story> {
    const token = await getToken()
    return apiClient.put<Story>(`/stories/${storyId}`, data, token)
  },

  /**
   * RF-003: Cambiar estado del relato
   * Transiciones: DRAFT→PUBLISHED, PUBLISHED→ARCHIVED, etc.
   * Establece publishedAt automáticamente si es PUBLISHED
   */
  async changeStatus(storyId: string, status: StoryStatus): Promise<Story> {
    const token = await getToken()
    return apiClient.patch<Story>(
      `/stories/${storyId}/status?status=${status}`,
      {},
      token,
    )
  },

  /**
   * RF-007: Eliminar relato
   * Autenticación requerida
   * Solo owner o admin pueden eliminar
   */
  async delete(storyId: string): Promise<void> {
    const token = await getToken()
    return apiClient.delete<void>(`/stories/${storyId}`, token)
  },

  /**
   * RF-008: Buscar tags existentes para autocomplete
   * Sin autenticación requerida
   * Parámetro: search=query
   */
  async searchTags(query: string): Promise<{ tag_id: string; name: string }[]> {
    if (query.length < 1) return []
    return apiClient.get(`/tags?search=${encodeURIComponent(query)}`)
  },
}

export default storyService
