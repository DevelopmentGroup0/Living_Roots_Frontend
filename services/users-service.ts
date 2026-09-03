import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

export type UserRole = 'admin' | 'client'

export type UserSortField = 'name' | 'lastName' | 'email' | 'role' | 'createdAt'

export type SortDirection = 'asc' | 'desc'

export interface User {
  user_id: string
  name: string
  lastName: string
  phone: string | null
  email: string
  role: UserRole
  avatar?: string | null
  createdAt: string
  updateAt: string
}

export interface UpdateUserRolePayload {
  role: UserRole
}

export interface UsersFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: UserSortField
  sortDir?: SortDirection
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedUsersResponse {
  data: User[]
  meta: PaginationMeta
}

// Obtiene el token de NextAuth una sola vez y lo reutiliza en la llamada.
async function getToken(): Promise<string> {
  const session = await getSession()

  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }

  return session.accessToken
}

function buildUsersQuery(filters: UsersFilters): string {
  const params = new URLSearchParams()

  if (filters.page !== undefined) {
    params.set('page', String(filters.page))
  }

  if (filters.limit !== undefined) {
    params.set('limit', String(filters.limit))
  }

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.sortBy) {
    params.set('sortBy', filters.sortBy)
  }

  if (filters.sortDir) {
    params.set('sortDir', filters.sortDir)
  }

  const query = params.toString()

  return query ? `?${query}` : ''
}

export const userService = {
  async getAll(filters: UsersFilters = {}): Promise<PaginatedUsersResponse> {
    const token = await getToken()

    const query = buildUsersQuery(filters)

    return apiClient.get<PaginatedUsersResponse>(`/users${query}`, token)
  },

  async getById(id: string): Promise<User> {
    const token = await getToken()

    return apiClient.get<User>(`/users/${id}`, token)
  },

  async updateRole(id: string, data: UpdateUserRolePayload): Promise<User> {
    const token = await getToken()

    return apiClient.patch<User>(`/users/${id}/role`, data, token)
  },
}
