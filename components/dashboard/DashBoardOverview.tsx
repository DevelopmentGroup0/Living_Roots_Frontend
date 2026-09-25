'use client'

import { useState } from 'react'
import { formatNumber } from './format'
import { DEFAULT_DAYS, type DashboardDays } from './types'
import { useDashboardSummary } from '@/hooks/mutations/useDashboard'
import { CardSkeleton } from './features/card-states'
import { CatalogHealthCard } from './features/Catalog-health-card'
import { KpiCard } from './features/kpi'
import { PeriodSelector } from './features/period-selector'
import { ConsultationsTrendCard } from './features/Consultations-trend-card'

function SummarySection({ days }: { days: DashboardDays }) {
  const summary = useDashboardSummary(days)

  if (summary.data) {
    const { herbs, families, consultations } = summary.data
    return (
      <div
        aria-busy={summary.isFetching}
        className={`grid gap-4 sm:grid-cols-3 ${summary.isPlaceholderData ? 'opacity-60 transition-opacity' : ''}`}
      >
        <KpiCard label='Plantas registradas' value={herbs} />
        <KpiCard label='Familias cultivadoras' value={families} />
        <KpiCard
          label='Consultas guardadas'
          value={consultations.inRange}
          hint={`en los últimos ${days} días · ${formatNumber(consultations.total)} en total`}
        />
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-3'>
      <CardSkeleton className='h-28' />
      <CardSkeleton className='h-28' />
      <CardSkeleton className='h-28' />
    </div>
  )
}

/**
 * Panel principal del administrador (HU-11). Cada bloque carga y falla por separado (E9).
 * Requiere un `QueryClientProvider` por encima (el proyecto ya lo usa para React Query).
 */
export function DashboardOverview() {
  const [days, setDays] = useState<DashboardDays>(DEFAULT_DAYS)

  return (
    <section aria-labelledby='dashboard-title' className='space-y-6'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1
            id='dashboard-title'
            className='text-2xl font-semibold text-[#0E3321]'
          >
            Panel principal
          </h1>
          <p className='mt-1 text-sm text-stone-500'>
            Visión rápida del estado del sistema.
          </p>
        </div>
        <PeriodSelector value={days} onChange={setDays} />
      </header>

      <SummarySection days={days} />

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <ConsultationsTrendCard days={days} />
        </div>
        <CatalogHealthCard />
      </div>
    </section>
  )
}
