import type { TrendGranularity } from './types'

const numberFormat = new Intl.NumberFormat('es-CO')
export const formatNumber = (n: number): string => numberFormat.format(n)

/** 'YYYY-MM-DD' → Date local (sin el desfase de zona horaria de `new Date('YYYY-MM-DD')`). */
export function parseBucket(bucket: string): Date {
  const [y, m, d] = bucket.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const dayMonth = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
})

export function formatBucketLabel(
  bucket: string,
  granularity: TrendGranularity,
): string {
  const label = dayMonth.format(parseBucket(bucket))
  return granularity === 'week' ? `Semana del ${label}` : label
}

export const pluralize = (
  n: number,
  singular: string,
  plural: string,
): string => (n === 1 ? singular : plural)
