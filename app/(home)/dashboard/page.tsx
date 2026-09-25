import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { DashboardOverview } from '@/components/dashboard/DashBoardOverview'

export default function Dashboard() {
  const dashboardItems = [
    {
      href: '/dashboard',
      label: 'dashboard',
    },
    {
      href: '/dashboard/herbs',
      label: 'Plantas',
    },
    {
      href: '/dashboard/stories',
      label: 'Relatos',
    },
  ]
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
        <DashboardNav dashboardItems={dashboardItems} />
        <DashboardOverview />
    </main>
  )
}
