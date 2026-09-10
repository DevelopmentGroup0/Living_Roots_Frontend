/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'
import { SymptomCombobox } from '@/components/syptoms/SymptomCombobox'
import { useRouter, useSearchParams } from 'next/navigation'
export function SearchSymptom() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handleSymptomChange = (newSymptomId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    newSymptomId
      ? params.set('symptomId', newSymptomId)
      : params.delete('symptomId')
    router.push(`?${params.toString()}`)
  }

  const symptomId = searchParams.get('symptomId') ?? ''
  return (

      <div className='flex justify-end'>
        <SymptomCombobox value={symptomId} onChange={handleSymptomChange} />
      </div>
  )
}
