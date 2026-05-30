import { HerbService } from '@/services/herbs-service'
import { HerbDetailView } from '@/components/herbs/HerbDetailView'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface Props {
  params: Promise<{ slug: string }>
}
export default async function HerbPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession(authOptions)
  const herb = await HerbService.getById(slug, session?.accessToken as string)

  return <HerbDetailView plantDetails={herb} />
}
