import { StoryManagementPanel } from '@/components/stories'

export default function StoriesDashboard() {
  return (
    <>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Gestionar Relatos
        </h1>
        <p className='text-gray-600'>
          Crea, edita y publica tus historias culturales
        </p>
      </div>
      <StoryManagementPanel />
    </>
  )
}
