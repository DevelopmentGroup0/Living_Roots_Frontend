import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react' // Cambiamos a useSession (Hook de cliente)
import { favoriteApiService } from '@/services/favorite-service'
import type { Plant } from '@/components/herbs/interfaces'

export function useFavorites() {
  const { data: session, status } = useSession()
  const token = session?.accessToken as string | undefined

  const queryClient = useQueryClient()
  const queryKey = ['favorites']

  // 1. Query para leer favoritos
  const {
    data: favorites = [],
    isLoading,
    isFetching,
  } = useQuery<Plant[]>({
    queryKey,
    queryFn: () => favoriteApiService.getFavorites(token!),
    enabled: !!token, // Solo corre si hay token
  })

  // 2. Mutación
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      plant,
      isFavorite,
    }: {
      plant: Plant
      isFavorite: boolean
    }) => {
      if (!token) throw new Error('No autenticado')

      if (isFavorite) {
        return favoriteApiService.removeFavorite(plant.herb_id, token)
      } else {
        return favoriteApiService.addFavorite(plant.herb_id, token)
      }
    },
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
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    // Si la sesión aún está cargando, la UI puede mostrar su respectivo loading
    favorites,
    isLoading:
      (status === 'authenticated' && isLoading) || status === 'loading',
    isUnauthenticated: status === 'unauthenticated',
    toggleFavorite: (plant: Plant) => {
      const isFavorite = favorites.some((p) => p.herb_id === plant.herb_id)
      toggleFavoriteMutation.mutate({ plant, isFavorite })
    },
    isFavorite: (plantId: string) =>
      favorites.some((p) => p.herb_id === plantId),
  }
}
