// services/herbs-service.ts
import { apiClient } from '@/lib/api-client' // Tu nuevo cliente
// import { Herb } from '@/types' // Siempre es bueno tipar
import { AuthResponse } from '@/interfaces/auth'
import { HerbValues } from '@/components/herbs/validation-sh'

export const HerbService = {
  getAll: async (query?: string) => {
    // La lógica de negocio de "cómo construir la URL de búsqueda" queda aquí
    const endpoint = query ? `/herbs?search=${query}` : '/herbs'
    return apiClient.get(endpoint)
  },

  getById: async (id: string) => {
    return apiClient.get(`/herbs/${id}`)
  },

  post: async (body: HerbValues, token: string) => {
    // Delegamos la petición, el manejo de errores y el token al apiClient
    console.log('/herbs', body, token);
    
    return apiClient.post<AuthResponse>('/herbs', body, token)
  },
}
