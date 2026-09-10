import { herbService, ListHerbsParams } from '@/services/herbs-service'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export function useHerbs(params: ListHerbsParams) {
  const { data: session, status } = useSession()
  const token = session?.accessToken as string | undefined

  return useQuery({
    queryKey: ['herbs', 'admin', params], // ⚠️ distinta de ['herbs', query, symptomId] del catálogo
    queryFn: () => herbService.getAll(params, token as string),
    enabled: status === 'authenticated' && !!token,
    placeholderData: keepPreviousData, // evita el parpadeo de loading al cambiar de página
  })
}
