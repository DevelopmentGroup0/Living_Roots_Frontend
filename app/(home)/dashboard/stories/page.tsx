import { StoryManagementPanel } from '@/components/stories'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default function StoriesDashboard() {
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <DashboardNav />
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Gestionar Relatos
          </h1>
          <p className='text-gray-600'>
            Crea, edita y publica tus historias culturales
          </p>
        </div>
        <StoryManagementPanel />
      </div>
    </main>
  )
}
