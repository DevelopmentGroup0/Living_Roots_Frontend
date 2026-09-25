import { formatNumber } from '../format'

interface KpiCardProps {
  label: string
  value: number
  hint?: string
}

/** Contador destacado. Un valor 0 se muestra como "0", nunca como vacío (E2). */
export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <dl className='rounded-xl border border-[#0E3321]/10 bg-white p-5 shadow-sm'>
      <dt className='text-xs font-medium uppercase tracking-wide text-stone-500'>
        {label}
      </dt>
      <dd className='mt-2 text-3xl font-semibold tabular-nums text-[#0E3321]'>
        {formatNumber(value)}
      </dd>
      {hint && <dd className='mt-1 text-xs text-stone-500'>{hint}</dd>}
    </dl>
  )
}
