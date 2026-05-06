// hooks/useSymptomSearch.ts
import { useEffect, useState } from 'react'
import { useDebounce } from './useDebounce'
import { symptomService } from '@/services/symptom-service'
import { Symptom } from '@/components/herbs/interfaces'

interface UseSymptomSearchReturn {
  results: Symptom[]
  isLoading: boolean
  notFound: boolean
}

export function useSymptomSearch(query: string): UseSymptomSearchReturn {
  const debouncedQuery = useDebounce(query, 400)
  const [results, setResults] = useState<Symptom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      setNotFound(false)
      return
    }

    let cancelled = false // bandera para evitar setState en componente desmontado

    const search = async () => {
      setIsLoading(true)
      setNotFound(false)
      try {
        const data = await symptomService.search(debouncedQuery)
        if (!cancelled) {
          setResults(data)
          setNotFound(data.length === 0)
        }
      } catch {
        if (!cancelled) {
          setResults([])
          setNotFound(true)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    search()

    return () => {
      cancelled = true // cleanup: si el query cambia antes de resolver, ignora la respuesta
    }
  }, [debouncedQuery])

  return { results, isLoading, notFound }
}
