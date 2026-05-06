import { Symptom } from '@/components/syptoms/interfaces'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export const symptomService = {
  async search(query: string): Promise<Symptom[]> {
    if (query.length < 2) return []
    const res = await fetch(
      `${BASE_URL}/symptoms?search=${encodeURIComponent(query)}`,
    )
    if (!res.ok) return []
    return res.json()
  },
}
