import { PlantManagement } from '@/components/herbs/PlantManagement'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default function Dashboard() {
  const dashboardItems = [
    {
      href: '/dashboard',
      label: 'Plantas',
    },
    {
      href: '/dashboard/stories',
      label: 'Relatos',
    },
  ]
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <DashboardNav dashboardItems={dashboardItems} />
        <PlantManagement />
      </div>
    </main>
  )
}
