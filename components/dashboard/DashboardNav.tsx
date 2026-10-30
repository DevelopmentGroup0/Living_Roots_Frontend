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
    <nav
      aria-label='Secciones'
      className='mb-6 w-full overflow-x-auto border-b border-slate-200'
    >
      {/* Cada pestaña ocupa el mismo ancho; si no caben, la barra se desplaza. */}
      <div className='flex w-full min-w-max text-center'>
        {dashboardItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`relative -mb-px block w-full whitespace-nowrap px-4 pb-3 pt-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-amber-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
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
    </nav>
  )
}
