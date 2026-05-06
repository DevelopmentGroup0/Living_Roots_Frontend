import { HerbForm } from '@/components/herbs/herb-form'

export default function Home() {
  return (
    // Aquí llamamos al fondo bonito que creaste en globals.css
    <main className='ancestral-pattern-bg min-h-screen flex items-center justify-center'>
      <div className='w-full px-4 py-12'>
          <HerbForm />
      </div>
    </main>
  )
}