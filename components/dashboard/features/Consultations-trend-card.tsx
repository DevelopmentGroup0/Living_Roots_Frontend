'use client'

import { useState } from 'react'
import type { DashboardDays, TrendGranularity } from '../types'
import { DashboardCard } from './dashboard-card'
import { CardSkeleton } from './card-states'
import { useConsultationsTrend } from '@/hooks/mutations/useDashboard'
import { ConsultationsTrendChart } from '../ConsultationsTrendChart'

const GRANULARITY_OPTIONS: Array<{ value: TrendGranularity; label: string }> = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
]

export function ConsultationsTrendCard({ days }: { days: DashboardDays }) {
  const [granularity, setGranularity] = useState<TrendGranularity>('day')
  const trend = useConsultationsTrend(days, granularity)

  const toggle = (
    <div
      role='group'
      aria-label='Agrupar por'
      className='inline-flex rounded-md border border-[#0E3321]/15 p-0.5 text-xs'
    >
      {GRANULARITY_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type='button'
          aria-pressed={granularity === value}
          onClick={() => setGranularity(value)}
          className={`rounded px-2.5 py-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E3321]/40 ${
            granularity === value
              ? 'bg-[#0E3321] text-white'
              : 'text-stone-600 hover:bg-[#0E3321]/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <DashboardCard
      title='Consultas guardadas'
      description={`Chats guardados en los últimos ${days} días`}
      action={toggle}
    >
      <div aria-busy={trend.isFetching}>
        {trend.data ? (
          <div
            className={
              trend.isPlaceholderData ? 'opacity-60 transition-opacity' : ''
            }
          >
            <ConsultationsTrendChart
              points={trend.data}
              granularity={granularity}
            />
          </div>
        ) : trend.isError ? (
          <div>Recarga la página por favor</div>
        ) : (
          <CardSkeleton className='h-52' />
        )}
      </div>
    </DashboardCard>
  )
}
