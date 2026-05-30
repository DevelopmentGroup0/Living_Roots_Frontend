import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route' // Ajusta la ruta de tus authOptions
import { favoriteApiService } from '@/services/favorite-service'
import { FavoriteList } from '@/components/favorites/FavoritesList'

export default async function FavoritosPage() {
  const queryClient = new QueryClient()

  // Obtenemos la sesión nativamente en el servidor
  const session = await getServerSession(authOptions)
  const token = session?.accessToken as string | undefined

  if (token) {
    // Precargamos los datos usando el token del servidor
    await queryClient.prefetchQuery({
      queryKey: ['favorites'],
      queryFn: () => favoriteApiService.getFavorites(token),
    })
  }
  return (
    // HydrationBoundary pasa los datos del servidor al cliente
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className='p-4 overflow-auto'>
        <h1 className='text-2xl font-bold mb-2 '>Jigra, tus plantas favoritas aquí</h1>
        <FavoriteList />
      </main>
    </HydrationBoundary>
  )
}
