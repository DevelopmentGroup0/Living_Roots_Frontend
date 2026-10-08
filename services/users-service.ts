import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import {
  PaginatedUsersResponse,
  UpdateUserPayload,
  UpdateUserRolePayload,
  User,
  UsersFilters,
} from '@/interfaces/auth'

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

  async getProfile(): Promise<User> {
    const token = await getToken()

    return apiClient.get<User>(`/auth/profile`, token)
  },

  async updateProfile(data: UpdateUserPayload): Promise<User> {
    const token = await getToken()

    return apiClient.patch<User>(`/auth/profile`, data, token)
  },

  async update(id: string, data: UpdateUserPayload): Promise<User> {
    const token = await getToken()

    return apiClient.patch<User>(`/users/${id}`, data, token)
  },

  async updateRole(id: string, data: UpdateUserRolePayload): Promise<User> {
    const token = await getToken()

    return apiClient.patch<User>(`/users/${id}/role`, data, token)
  },

  async delete(id: string): Promise<void> {
    const token = await getToken()

    return apiClient.delete(`/users/${id}`, token)
  },
}
