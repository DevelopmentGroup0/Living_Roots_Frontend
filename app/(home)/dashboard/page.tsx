// import { HerbForm } from "@/components/herbs/herb-form"
import { HerbForm } from '@/components/herbs/herb-form'
import { Leaf } from 'lucide-react'

export default function Home() {
  return (
    <main className='bg-background'>
      <div className='mx-auto max-w-4xl px-4 py-12'>
        {/* <header className='mb-10 text-center'>
          <div className='mb-4 flex items-center justify-center gap-3'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary/15'>
              <Leaf className='h-8 w-8 text-primary' />
            </div>
          </div>
          <h1 className='text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            Herbario Natural
          </h1>
          <p className='mx-auto mt-3 max-w-md text-pretty text-muted-foreground'>
            Registra y organiza tu colección de plantas medicinales para
            medicina natural y remedios caseros
          </p>
        </header> */}

        {/* <div className='flex justify-center'>
        </div> */}
          <HerbForm />
      </div>
    </main>
  )
}
