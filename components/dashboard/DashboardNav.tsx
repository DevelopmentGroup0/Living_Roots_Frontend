/**
 * DashboardNav Component
 * Navegación secundaria dentro del dashboard
 * Permite cambiar entre diferentes secciones (Plantas, Relatos, etc.)
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardNavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const dashboardItems: DashboardNavItem[] = [
  {
    href: '/dashboard',
    label: 'Plantas',
    icon: Leaf,
    description: 'Gestiona plantas medicinales',
  },
  {
    href: '/dashboard/stories',
    label: 'Relatos',
    icon: BookOpen,
    description: 'Crea y publica tus relatos culturales',
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className='flex gap-2 mb-6 border-b border-gray-200 pb-4'>
      {dashboardItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'outline'}
              className={`gap-2 ${
                isActive ? 'bg-amber-600 hover:bg-amber-700' : ''
              }`}
            >
              <Icon className='w-4 h-4' />
              {item.label}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}
