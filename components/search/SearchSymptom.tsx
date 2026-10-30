'use client'

import { SymptomCombobox } from '@/components/symptoms/SymptomCombobox'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchSymptom() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSymptomChange = (newSymptomId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newSymptomId) {
      params.set('symptomId', newSymptomId)
    } else {
      params.delete('symptomId')
    }
    // El filtro se aplica en el inicio, incluso si se elige desde otra página.
    router.push(`/?${params.toString()}`)
  }

  const symptomId = searchParams.get('symptomId') ?? ''

  return <SymptomCombobox value={symptomId} onChange={handleSymptomChange} />
}
