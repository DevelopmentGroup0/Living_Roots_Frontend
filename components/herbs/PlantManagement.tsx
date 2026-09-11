'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useHerbs } from '@/hooks/queries/useHerbs'
import { useHerbMutations } from '@/hooks/mutations/useHerbMutations'
import { Input } from '@/components/ui/input'
import { PlantTable } from './PlantTable'
import { BackupRestorePanel } from './BackupRestorePanel'

const LIMIT = 10

export function PlantManagement() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isError } = useHerbs({ page, limit: LIMIT, search })
  const { create, update, remove, addSymptom, updateSymptom, removeSymptom } =
    useHerbMutations()

  const herbs = data?.data ?? []
  const meta = data?.meta

  if (isLoading && !data) return <p>Cargando plantas...</p>
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
        onEditSymptom={(herbId, symptomId, data) =>
          updateSymptom.mutateAsync({ herbId, symptomId, data })
        }
        onRemoveSymptom={(herbId, symptomId) =>
          removeSymptom.mutateAsync({ herbId, symptomId })
        }
        isCreating={create.isPending}
        isEditing={update.isPending}
        isDeleting={remove.isPending}
        isAddingSymptom={addSymptom.isPending}
        isEditingSymptom={updateSymptom.isPending}
        isRemovingSymptom={removeSymptom.isPending}
        pagination={
          meta && {
            page: meta.page,
            totalPages: meta.totalPages,
            total: meta.total,
            limit: meta.limit,
            onPageChange: setPage,
          }
        }
      />
      <BackupRestorePanel />
    </div>
  )
}
