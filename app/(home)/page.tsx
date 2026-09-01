import { Main } from '@/components/Main'
import { Plant } from '@/components/herbs/interfaces'
import { HerbService } from '@/services/herbs-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface PageProps {
  // En Next.js 15+ searchParams es una Promise
  searchParams: Promise<{ query?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { query } = await searchParams
  const session = await getServerSession(authOptions)
  const allHerbs = (await HerbService.getAll(
    session?.accessToken as string,
    query || '',
  )) as Plant[]

  return <Main herbs={allHerbs} />
}
