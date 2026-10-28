import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import type { CreateUserPayload } from '@/schemas/user.schema'
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

// Error de la API con el status HTTP, para que el formulario pueda mapear
// casos como 409 (correo duplicado) a un campo concreto.
export class CreateUserError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'CreateUserError'
  }
}

export const userService = {
  // Pasa por el proxy /api/users (el token se toma de la sesión en el servidor).
  async create(data: CreateUserPayload): Promise<User> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const body = await res.json().catch(() => ({}))

    if (!res.ok) {
      // class-validator devuelve `message` como arreglo de strings.
      const message = Array.isArray(body?.message)
        ? body.message.join(', ')
        : (body?.message ?? 'No se pudo crear el usuario')
      throw new CreateUserError(message, res.status)
    }

    return body as User
  },

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
