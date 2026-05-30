import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoriteApiService } from '@/services/favorite-service'
import { Plant } from '@/components/herbs/interfaces'
import { useEffect } from 'react'

export function useFavorites() {
  const queryClient = useQueryClient()
  const queryKey = ['favorites']

  // 1. Query para leer favoritos
  const { data: favorites = [], isLoading } = useQuery({
    queryKey,
    queryFn: favoriteApiService.getFavorites,
  })

  // 2. Mutación dinámica para agregar o quitar
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      plant,
      isFavorite,
    }: {
      plant: Plant
      isFavorite: boolean
    }) => {
      if (isFavorite) {
        return favoriteApiService.removeFavorite(plant.herb_id)
      } else {
        return favoriteApiService.addFavorite(plant.herb_id)
      }
    },
    // Mutación optimista
    onMutate: async ({ plant, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousFavorites = queryClient.getQueryData<Plant[]>(queryKey)

      queryClient.setQueryData<Plant[]>(queryKey, (old) => {
        if (!old) return []
        return isFavorite
          ? old.filter((p) => p.herb_id !== plant.herb_id)
          : [...old, plant]
      })

      return { previousFavorites }
    },
    // Si hay error en el servidor, revertimos los cambios en la UI
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites)
      }
    },
    // Al terminar (con éxito o error), refreca los datos reales en segundo plano
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  useEffect(() => {
    console.log('Datos actuales en caché:', favorites)
  }, [favorites])

  const toggleFavorite = (plant: Plant) => {
    const isFavorite = favorites.some((p) => p.herb_id === plant.herb_id)
    toggleFavoriteMutation.mutate({ plant, isFavorite })
  }

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite: (plantId: string) =>
      favorites.some((p) => p.herb_id === plantId),
  }
}
