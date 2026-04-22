import { Main } from '@/components/Main'
import { fetchHerbs } from '@/lib/db'

const allHerbs = await fetchHerbs()
console.log(allHerbs);

export default function Home() {
  return <Main herbs={allHerbs} />
}
