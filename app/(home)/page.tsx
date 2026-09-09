import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { herbService } from '@/services/herbs-service'
import { HerbsList } from '@/components/herbs/HerbsList'

interface PageProps {
  searchParams: Promise<{ query?: string; symptomId?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { query = '', symptomId } = await searchParams
  const session = await getServerSession(authOptions)
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['herbs', query, symptomId],
    queryFn: () =>
      herbService.getAll(
        {
          page: 1,
          limit: 12,
          search: query,
          symptomId,
        },
        session?.accessToken,
      ),
    initialPageParam: 1,
  })

  return (
    <div className='min-h-screen flex flex-col transition-all duration-500 overflow-x-hidden relative'>
      <div className='flex-1 flex flex-col min-h-screen pb-32'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HerbsList initialQuery={query} initialSymptomId={symptomId} />
        </HydrationBoundary>
      </div>
    </div>
  )
}
