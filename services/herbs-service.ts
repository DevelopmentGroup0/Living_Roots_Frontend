import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import type { CreateHerbFormValues } from '@/schemas/herbs.schema'
import type { AddSymptomFormValues } from '@/schemas/symptom.schema'
import type { Plant } from '@/components/herbs/interfaces'

export const HerbService = {
  getAll: async (query?: string) => {
    const endpoint = query ? `/herbs?search=${query}` : '/herbs'
    return apiClient.get(endpoint)
  },

  getById: async (id: string) => {
    return apiClient.get(`/herbs/${id}`)
  },
}

// Obtiene el token de NextAuth una sola vez y lo reutiliza en la llamada
async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  return session?.accessToken as string | undefined
}

export const herbService = {
  async getAll(): Promise<Plant[]> {
    const token = await getToken()
    return apiClient.get<Plant[]>('/herbs', token)
  },

  async create(data: CreateHerbFormValues): Promise<Plant> {
    const token = await getToken()
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
}
