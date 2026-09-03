import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { UsersTable } from '@/components/dashboard/users/UsersManagement'

export default function UsersManagementPage() {
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <DashboardNav />
        <UsersTable />
      </div>
    </main>
  )
}
