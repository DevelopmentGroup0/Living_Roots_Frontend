import { PublishedStoriesViewer } from '@/components/stories'

export default function StoriesPage() {
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Relatos Culturales
          </h1>
          <p className='text-gray-600'>
            Descubre historias, tradiciones y sabidurías compartidas por nuestra comunidad
          </p>
        </div>
        <PublishedStoriesViewer />
      </div>
    </main>
  )
}
