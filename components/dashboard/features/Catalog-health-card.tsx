'use client'

import { useCatalogHealth } from '@/hooks/mutations/useDashboard'
import { formatNumber } from '../format'
import type { NamedItem } from '../types'
import { DashboardCard } from './dashboard-card'
import { CardSkeleton } from './card-states';

interface HealthRowProps {
  label: string
  count: number
  samples: NamedItem[]
}

function HealthRow({ label, count, samples }: HealthRowProps) {
  const ok = count === 0
  const remaining = count - samples.length

  return (
    <li className='py-3 first:pt-0 last:pb-0'>
      <div className='flex items-center justify-between gap-3'>
        <span className='text-sm text-stone-700'>{label}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
            ok ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
          }`}
        >
          {ok ? 'Sin pendientes' : formatNumber(count)}
        </span>
      </div>

      {!ok && samples.length > 0 && (
        <details className='mt-2 text-xs text-stone-600'>
          <summary className='cursor-pointer select-none text-[#0E3321] hover:underline'>
            Ver ejemplos
          </summary>
          <ul className='mt-1.5 list-disc space-y-0.5 pl-5'>
            {samples.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
          {remaining > 0 && (
            <p className='mt-1.5 pl-5 text-stone-500'>
              y {formatNumber(remaining)} más
            </p>
          )}
        </details>
      )}
    </li>
  )
}

export function CatalogHealthCard() {
  const health = useCatalogHealth()

  return (
    <DashboardCard
      title='Salud del catálogo'
      description='Registros que conviene completar'
    >
      <div aria-busy={health.isFetching}>
        {health.data ? (
          <ul className='divide-y divide-[#0E3321]/10'>
            <HealthRow
              label='Plantas sin síntomas asociados'
              count={health.data.herbsWithoutSymptoms}
              samples={health.data.samples.herbs}
            />
            <HealthRow
              label='Síntomas sin plantas'
              count={health.data.symptomsWithoutHerbs}
              samples={health.data.samples.symptoms}
            />
          </ul>
        ) : health.isError ? (
          <div>Recarga la página por favor</div>
        ) : (
          <CardSkeleton className='h-32' />
        )}
      </div>
    </DashboardCard>
  )
}
