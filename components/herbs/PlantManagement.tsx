import { Plus, Search } from 'lucide-react'
import { Plant } from '@/components/herbs/interfaces'
import { HerbService } from '@/services/herbs-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlantTable } from './PlantTable'

export async function PlantManagement() {
  const allHerbs = (await HerbService.getAll()) as Plant[]
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold text-gray-900'>
          Gestión de Plantas Medicinales
        </h1>
        <Button className='gap-2'>
          <Plus className='w-4 h-4' />
          Añadir Planta
        </Button>
      </div>

      <div className='w-full max-w-sm'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            type='text'
            placeholder='Buscar plantas...'
            className='pl-10'
          />
        </div>
      </div>

      <PlantTable herbs={allHerbs} />
    </div>
  )
}
