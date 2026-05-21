import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { herbService } from '@/services/herbs-service'
import { herbKeys } from '@/lib/query-keys'
import { HerbDetailView } from '@/components/herbs/herb-detail-view'

interface Props {
  params: Promise<{ slug: string }>
}
export default async function HerbPage({ params }: Props) {
  const { slug } = await params
  console.log('Params', slug)

  const queryClient = new QueryClient()

  try {
    // Si esta línea se queda bloqueada, es que el fetch no está llegando al puerto correcto
    await queryClient.prefetchQuery({
      queryKey: herbKeys.detail(slug),
      queryFn: () => herbService.getById(slug),
    })
  } catch (error) {
    console.error('Error en prefetch:', error)
    // No lanzamos el error para permitir que el componente cliente
    // intente recuperarse o muestre un estado de error manejable.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HerbDetailView
        id={slug}
        initialData={queryClient.getQueryData(herbKeys.detail(slug))}
      />
    </HydrationBoundary>
  )
}
