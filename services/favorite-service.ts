import type { Plant } from '@/components/herbs/interfaces'

export interface IFavoriteService {
  getFavorites(): Promise<Plant[]>
  addFavorite(plantId: string): Promise<void>
  removeFavorite(plantId: string): Promise<void>
}

export const favoriteApiService: IFavoriteService = {
  async getFavorites() {
    const res = await fetch('/api/favorites')
    if (!res.ok) throw new Error('Error al obtener favoritos')
    return res.json()
  },

  async addFavorite(plantId) {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantId, action: 'ADD' }),
    })
    if (!res.ok) throw new Error('Error al agregar a favoritos')
  },

  async removeFavorite(plantId) {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plantId, action: 'REMOVE' }),
    })
    if (!res.ok) throw new Error('Error al eliminar de favoritos')
  },
}
