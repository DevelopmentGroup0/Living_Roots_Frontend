import { DashboardNav } from '@/components/dashboard/DashboardNav'

// Layout compartido de /dashboard: las pestañas viven aquí (antes se repetían
// en cada página, con dos pestañas llamadas "dashboard").
const dashboardItems = [
  { href: '/dashboard', label: 'Panel principal' },
  { href: '/dashboard/herbs', label: 'Plantas' },
  { href: '/dashboard/stories', label: 'Relatos' },
]

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex-1 overflow-auto p-4 transition-all duration-300 sm:p-6'>
      <div className='max-w-7xl mx-auto'>
        <DashboardNav dashboardItems={dashboardItems} />
        {children}
      </div>
    </main>
  )
}
