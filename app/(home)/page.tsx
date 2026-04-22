import { Main } from '@/components/Main'
import { HerbService } from '@/services/herbs-service'

export default async function Home() {
  const allHerbs = await HerbService.getAll()
  return <Main herbs={allHerbs} />
}
