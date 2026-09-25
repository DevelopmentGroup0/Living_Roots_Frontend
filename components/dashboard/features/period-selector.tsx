import { DASHBOARD_DAYS, type DashboardDays } from '../types'

interface PeriodSelectorProps {
  value: DashboardDays
  onChange: (days: DashboardDays) => void
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div
      role='group'
      aria-label='Período'
      className='inline-flex rounded-lg border border-[#0E3321]/15 bg-white p-0.5'
    >
      {DASHBOARD_DAYS.map((days) => {
        const active = days === value
        return (
          <button
            key={days}
            type='button'
            aria-pressed={active}
            onClick={() => onChange(days)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E3321]/40 ${
              active
                ? 'bg-[#0E3321] text-white'
                : 'text-stone-600 hover:bg-[#0E3321]/5'
            }`}
          >
            {days} días
          </button>
        )
      })}
    </div>
  )
}
