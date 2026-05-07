import { useQuery } from '@tanstack/react-query'
import { herbService } from '@/services/herbs-service'
import { QUERY_KEYS } from '@/constants/query-keys'

export function useHerbs() {
  return useQuery({
    queryKey: QUERY_KEYS.herbs.all,
    queryFn: () => herbService.getAll(),
  })
}
