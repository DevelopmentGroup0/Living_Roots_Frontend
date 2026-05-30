'use client' // Necesario porque usa hooks

import { useFavorites } from '@/hooks/useFavorites'
import { HerbCard } from '@/components/herbs/HerbCard'

export function FavoriteList() {
  const { favorites, isLoading } = useFavorites()

  if (isLoading) return <div>Cargando plantas...</div>
  if (favorites.length === 0) return <div>No tienes favoritos aún.</div>

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {favorites.map((plant) => (
        <HerbCard key={plant.herb_id} plant={plant} />
      ))}
    </div>
  )
}
