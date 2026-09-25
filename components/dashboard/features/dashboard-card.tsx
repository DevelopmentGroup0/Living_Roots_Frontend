import type { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function DashboardCard({
  title,
  description,
  action,
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <section
      className={`rounded-xl border border-[#0E3321]/10 bg-white p-5 shadow-sm ${className}`}
    >
      <header className='mb-4 flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-sm font-semibold text-[#0E3321]'>{title}</h2>
          {description && (
            <p className='mt-0.5 text-xs text-stone-500'>{description}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
