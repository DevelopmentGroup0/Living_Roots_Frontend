// app/favoritos/page.tsx
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { favoriteApiService } from '@/services/favorite-service'
import { FavoriteList } from '@/components/favorites/FavoritesList' // Tu componente que renderiza las cards

export default async function FavoritosPage() {
  const queryClient = new QueryClient()

  // Precargamos los datos en el servidor
  await queryClient.prefetchQuery({
    queryKey: ['favorites'],
    queryFn: favoriteApiService.getFavorites,
  })

  return (
    // HydrationBoundary pasa los datos del servidor al cliente
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className='p-8'>
        <h1 className='text-2xl font-bold mb-6'>Mis Plantas Favoritas</h1>
        <FavoriteList />
      </main>
    </HydrationBoundary>
  )
}
