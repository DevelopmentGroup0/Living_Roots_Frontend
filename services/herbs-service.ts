import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import type { CreateHerbFormValues } from '@/schemas/herbs.schema'
import type { AddSymptomFormValues } from '@/schemas/symptom.schema'
import type { MedicinalHerb, Plant } from '@/components/herbs/interfaces'

export interface UpdateTreatmentPayload {
  partsplant?: string
  prepare?: string
  apply?: string
}

export interface ListHerbsParams {
  page?: number
  limit?: number
  search?: string
  symptomId?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
  }
}

export const HerbService = {
  getAll: async (token: string, query?: string) => {
    const endpoint = query ? `/herbs?search=${query}` : '/herbs'
    return apiClient.get(endpoint, token)
  },

  getById: async (id: string, token: string) => {
    return apiClient.get<MedicinalHerb>(`/herbs/${id}`, token)
  },
}

// Obtiene el token de NextAuth una sola vez y lo reutiliza en la llamada (Client side)
async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }
  return session?.accessToken as string | undefined
}

export const herbService = {
  async getAll(
    params: ListHerbsParams = {},
    token?: string,
  ): Promise<PaginatedResponse<Plant>> {
    const sp = new URLSearchParams()
    if (params.page) sp.set('page', String(params.page))
    if (params.limit) sp.set('limit', String(params.limit))
    if (params.search) sp.set('search', params.search)
    if (params.symptomId) sp.set('symptomId', params.symptomId)
    // const token = await getToken()
    return apiClient.get(`/herbs?${sp}`, token)
  },

  async getById(id: string): Promise<Plant> {
    const token = await getToken()
    console.log('Getting herb by ID:', id, 'and token:', token)
    return apiClient.get<Plant>(`/herbs/${id}`, token)
  },

  async create(data: CreateHerbFormValues): Promise<Plant> {
    const token = await getToken()
    console.log('Creating herb with data:', data, 'and token:', token)
    return apiClient.post<Plant>('/herbs', data, token)
  },

  async update(
    id: string,
    data: Partial<CreateHerbFormValues>,
  ): Promise<Plant> {
    const token = await getToken()
    return apiClient.patch<Plant>(`/herbs/${id}`, data, token)
  },

  async delete(id: string): Promise<void> {
    const token = await getToken()
    return apiClient.delete<void>(`/herbs/${id}`, token)
  },

  async addSymptom(herbId: string, data: AddSymptomFormValues): Promise<void> {
    const token = await getToken()
    return apiClient.post<void>(`/herbs/${herbId}/symptoms`, data, token)
  },

  async updateTreatment(
    herbId: string,
    symptomId: string,
    data: UpdateTreatmentPayload,
  ) {
    const token = await getToken()
    return apiClient.patch<void>(
      `/herbs/${herbId}/symptoms/${symptomId}`,
      data,
      token,
    )
  },

  async removeTreatment(herbId: string, symptomId: string) {
    const token = await getToken()
    return apiClient.delete<void>(
      `/herbs/${herbId}/symptoms/${symptomId}`,
      token,
    )
  },
}
