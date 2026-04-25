import { Main } from '@/components/Main'
import { Plant } from '@/components/herbs/interfaces'
import { HerbService } from '@/services/herbs-service'
interface PageProps {
  // En Next.js 15+ searchParams es una Promise
  searchParams: Promise<{ query?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { query } = await searchParams
  const allHerbs = (await HerbService.getAll(query || '')) as Plant[]

  return <Main herbs={allHerbs} />
}
