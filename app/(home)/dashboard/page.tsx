import { PlantManagement } from '@/components/herbs/PlantManagement'
export default function Dashboard() {
  
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <PlantManagement />
      </div>
    </main>
  )
}
