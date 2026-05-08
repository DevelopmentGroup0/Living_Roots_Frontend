'use client'
import { Search } from 'lucide-react'
import { useHerbs } from '@/hooks/queries/useHerbs'
import { useHerbMutations } from '@/hooks/mutations/useHerbMutations'
import { Input } from '@/components/ui/input'
import { PlantTable } from './PlantTable'

export function PlantManagement() {
  const { data: herbs = [], isLoading, isError } = useHerbs()
  const { create, update, remove, addSymptom } = useHerbMutations()

  if (isLoading) return <p>Cargando plantas...</p>
  if (isError) return <p>Error al cargar las plantas.</p>

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-semibold text-gray-900'>
          Gestión de Plantas Medicinales
        </h1>
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

      <PlantTable
        herbs={herbs}
        onCreate={(data) => create.mutateAsync(data)}
        onEdit={(id, data) => update.mutateAsync({ id, data })}
        onDelete={(id) => remove.mutateAsync(id)}
        onAddSymptom={(herbId, data) =>
          addSymptom.mutateAsync({ herbId, data })
        }
        isCreating={create.isPending}
        isEditing={update.isPending}
        isDeleting={remove.isPending}
        isAddingSymptom={addSymptom.isPending}
      />
    </div>
  )
}
