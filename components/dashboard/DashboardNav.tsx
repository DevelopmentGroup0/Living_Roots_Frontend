'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardNavItem {
  href: string
  label: string
}

export function DashboardNav({
  dashboardItems,
}: {
  dashboardItems: DashboardNavItem[]
}) {
  const pathname = usePathname()

  return (
    <div className='w-full border-b border-slate-200 mb-6'>
      {/* 'grid-cols-2' hace que cada pestaña ocupe exactamente el 50% del ancho. */}
      <div className='grid grid-cols-2 w-full text-center'>
        {dashboardItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative pb-3 text-sm font-medium transition-colors duration-200 -mb-px block w-full ${
                isActive
                  ? 'text-amber-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.label}

              {/* Indicador de pestaña activa */}
              {isActive && (
                <div className='absolute bottom-0 left-0 right-0 h-0.75 bg-amber-700 rounded-t-sm' />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
