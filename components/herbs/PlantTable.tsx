'use client'

import { useState } from 'react'
import { Edit, Trash2, FlaskConical, CirclePlus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EditPlantDialog } from './EditPlantDialog'
import { DeletePlantDialog } from './DeletePlantDialog'
import { usePlantDialogs } from '@/hooks/usePlantDialogs'
import { Plant } from './interfaces'
// import type { Plant } from '@/types/plant'
import type {
  CreateHerbFormValues,
  EditPlantFormInput,
} from '@/schemas/herbs.schema'

import { PlusCircle } from 'lucide-react'
import { AddSymptomDialog } from '../syptoms/AddSymptomDialog'
import { CreateHerbDialog } from './CreateHerbDialog'
import { AddSymptomFormValues } from '@/schemas/symptom.schema'
import { ExpandableDescription } from '../ui/table-cell-dinamic-h'
import { HerbIdCell } from './HerbIdCell'

// PlantTable.tsx
interface PlantTableProps {
  herbs: Plant[]
  onCreate: (data: CreateHerbFormValues) => Promise<Plant> // ← era Promise<void>
  onEdit: (id: string, data: EditPlantFormInput) => Promise<Plant>
  onDelete: (id: string) => Promise<void> // delete sí retorna void
  onAddSymptom: (herbId: string, data: AddSymptomFormValues) => Promise<void>
  isCreating?: boolean
  isEditing?: boolean
  isDeleting?: boolean
  isAddingSymptom?: boolean
}

type SelectedSymptom = { plantId: string; symptomIndex: number } | null

export function PlantTable({
  herbs,
  onEdit,
  onDelete,
  onAddSymptom,
  onCreate,
  isAddingSymptom = false,
  isCreating = false,
  isEditing = false,
  isDeleting = false,
}: PlantTableProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<SelectedSymptom>(null)
  const {
    selectedPlant,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    addSymptomOpen,
    setAddSymptomOpen,
    createOpen,
    setCreateOpen,
    openEdit,
    openDelete,
    openAddSymptom,
  } = usePlantDialogs()

  const handleSymptomClick = (plantId: string, symptomIndex: number) => {
    setSelectedSymptom((prev) =>
      prev?.plantId === plantId && prev?.symptomIndex === symptomIndex
        ? null
        : { plantId, symptomIndex },
    )
  }

  return (
    <>
      <div className='bg-white rounded-b-sm rounded-t-xs border border-gray-200 overflow-hidden'>
        <Button
          onClick={() => setCreateOpen(true)}
          className='bg-green-600 hover:bg-green-700 gap-2 absolute right-0 -mt-10 mr-6'
        >
          <CirclePlus className='h-4 w-4' />
          Nueva Planta
        </Button>
        <Table>
          <TableHeader className='bg-gray-50'>
            <TableRow>
              <TableHead className='w-25 text-gray-600'>ID</TableHead>
              <TableHead className='w-50 text-gray-600'>NOMBRE</TableHead>
              <TableHead className='text-gray-600'>DESCRIPCIÓN</TableHead>
              <TableHead className='w-75 text-gray-600'>SÍNTOMAS</TableHead>
              {selectedSymptom && (
                <TableHead className='w-100 text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <FlaskConical className='w-4 h-4 text-green-600' />
                    PREPARACIÓN
                  </div>
                </TableHead>
              )}
              <TableHead className='w-20 text-right text-gray-600'>
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {herbs.map((plant) => (
              <TableRow key={plant.herb_id}>
                <TableCell className='font-mono text-sm'>
                  <HerbIdCell id={plant.herb_id} />
                </TableCell>
                <TableCell className='font-medium text-gray-900'>
                  {plant.name}
                </TableCell>
                <TableCell className='text-gray-600 text-sm align-top max-w-58'>
                  <ExpandableDescription description={plant.description} />
                </TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-1.5 items-center'>
                    {plant.symptoms.map((symptom, index) => {
                      const isSelected =
                        selectedSymptom?.plantId === plant.herb_id &&
                        selectedSymptom?.symptomIndex === index
                      return (
                        <Badge
                          key={index}
                          variant='secondary'
                          className={`text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                          onClick={() =>
                            handleSymptomClick(plant.herb_id, index)
                          }
                          title={`Click para ver preparación: ${symptom.prepare}`}
                        >
                          {symptom.symptom.name}
                        </Badge>
                      )
                    })}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-4 w-4'
                    onClick={() => openAddSymptom(plant)}
                    title='Agregar síntoma'
                  >
                    <PlusCircle className='h-4 w-4 text-green-600' />
                  </Button>
                  </div>
                </TableCell>
                {selectedSymptom && (
                  <TableCell className='align-top'>
                    {selectedSymptom.plantId === plant.herb_id ? (
                      <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                        <div className='flex items-center gap-2 mb-3'>
                          <Badge
                            variant='secondary'
                            className='bg-green-600 text-white'
                          >
                            {
                              plant.symptoms[selectedSymptom.symptomIndex]
                                .symptom.name
                            }
                          </Badge>
                          <span className='text-xs text-green-700 font-medium'>
                            →{' '}
                            {
                              plant.symptoms[selectedSymptom.symptomIndex]
                                .prepare
                            }
                          </span>
                        </div>
                        <ol className='space-y-2 text-sm'>
                          {plant.symptoms[selectedSymptom.symptomIndex].apply}
                        </ol>
                      </div>
                    ) : (
                      <div className='text-gray-400 text-sm italic text-center py-4'>
                        Selecciona un síntoma
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => openEdit(plant)}
                    >
                      <Edit className='h-4 w-4 text-gray-600' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => openDelete(plant)}
                    >
                      <Trash2 className='h-4 w-4 text-gray-600' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddSymptomDialog
        plant={selectedPlant}
        open={addSymptomOpen}
        onOpenChange={setAddSymptomOpen}
        onSubmit={onAddSymptom}
        isLoading={isAddingSymptom}
      />
      <CreateHerbDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={onCreate}
        isLoading={isCreating}
      />
      <EditPlantDialog
        plant={selectedPlant}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={onEdit}
        isLoading={isEditing}
      />

      <DeletePlantDialog
        plant={selectedPlant}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
