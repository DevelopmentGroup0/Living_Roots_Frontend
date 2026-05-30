import type { Plant } from '@/components/herbs/interfaces'
import { apiClient } from '@/lib/api-client'

export interface IFavoriteService {
  getFavorites(token: string): Promise<Plant[]>
  addFavorite(plantId: string, token: string): Promise<void>
  removeFavorite(plantId: string, token: string): Promise<void>
}

export const favoriteApiService: IFavoriteService = {
  async getFavorites(token: string): Promise<Plant[]> {
    return apiClient.get<Plant[]>('/favorites', token)
  },

  async addFavorite(plantId: string, token: string): Promise<void> {
    return apiClient.post('/favorites', { plantId, action: 'ADD' }, token)
  },

  async removeFavorite(plantId: string, token: string): Promise<void> {
    return apiClient.post('/favorites', { plantId, action: 'REMOVE' }, token)
  },
}
