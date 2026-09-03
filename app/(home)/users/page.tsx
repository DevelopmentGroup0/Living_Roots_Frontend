import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { UsersManagement } from '@/components/dashboard/users/UsersManagement'

export default function UsersManagementPage() {
  const dashboardItems = [
    {
      href: '/users',
      label: 'Gestión de usuarios',
    },
    {
      href: '/auth/register',
      label: 'Crear Usuario',
    },
  ]
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <DashboardNav dashboardItems={dashboardItems} />
        <UsersManagement />
      </div>
    </main>
  )
}
