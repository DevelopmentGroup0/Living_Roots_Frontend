'use client'

import { useState } from 'react'
import { Edit, Trash2, X, PlusCircle, CirclePlus } from 'lucide-react'
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
import { EditPlantDialog } from './dialogs/EditPlantDialog'
import { DeletePlantDialog } from './dialogs/DeletePlantDialog'
import {
  EditSymptomDialog,
  EditTreatmentFormValues,
} from './dialogs/EditSymptomDialog'
import { usePlantDialogs } from '@/hooks/usePlantDialogs'
import { Plant, HerbTreatment } from './interfaces'
import type {
  CreateHerbFormValues,
  EditPlantFormInput,
} from '@/schemas/herbs.schema'
import {
  PaginationControls,
  PaginationControlsProps,
} from './PaginationControls'
import { AddSymptomDialog } from '../syptoms/AddSymptomDialog'
import { CreateHerbDialog } from './dialogs/CreateHerbDialog'
import { AddSymptomFormValues } from '@/schemas/symptom.schema'
import { ExpandableDescription } from '../ui/table-cell-dinamic-h'
import { HerbIdCell } from '../ui/HerbIdCell'

interface PlantTableProps {
  herbs: Plant[]
  onCreate: (data: CreateHerbFormValues) => Promise<Plant>
  onEdit: (id: string, data: EditPlantFormInput) => Promise<Plant>
  onDelete: (id: string) => Promise<void>
  onAddSymptom: (herbId: string, data: AddSymptomFormValues) => Promise<void>
  onEditSymptom: (
    herbId: string,
    symptomId: string,
    data: EditTreatmentFormValues,
  ) => Promise<void>
  onRemoveSymptom: (herbId: string, symptomId: string) => Promise<void>
  isCreating?: boolean
  isEditing?: boolean
  isDeleting?: boolean
  isAddingSymptom?: boolean
  isEditingSymptom?: boolean
  isRemovingSymptom?: boolean
  pagination?: PaginationControlsProps
}

type SelectedSymptom = { plantId: string; symptomIndex: number } | null

export function PlantTable({
  herbs,
  onEdit,
  onDelete,
  onAddSymptom,
  onEditSymptom,
  onRemoveSymptom,
  onCreate,
  isAddingSymptom = false,
  isCreating = false,
  isEditing = false,
  isDeleting = false,
  isEditingSymptom = false,
  isRemovingSymptom = false,
  pagination,
}: PlantTableProps) {
  const [selectedSymptom, setSelectedSymptom] = useState<SelectedSymptom>(null)
  const [editSymptomOpen, setEditSymptomOpen] = useState(false)
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

  const handleRemoveSymptom = (
    e: React.MouseEvent,
    herbId: string,
    symptomId: string,
  ) => {
    e.stopPropagation()
    onRemoveSymptom(herbId, symptomId)
    setSelectedSymptom((prev) => (prev?.plantId === herbId ? null : prev))
  }

  const activeTreatment: HerbTreatment | null = selectedSymptom
    ? (herbs.find((h) => h.herb_id === selectedSymptom.plantId)?.symptoms[
        selectedSymptom.symptomIndex
      ] ?? null)
    : null

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
              <TableHead className='w-20 text-right text-gray-600'>
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {herbs.map((plant) => (
              <TableRow key={plant.herb_id}>
                <TableCell className='font-mono text-sm align-top'>
                  <HerbIdCell id={plant.herb_id} />
                </TableCell>
                <TableCell className='font-medium text-gray-900 align-top'>
                  {plant.name}
                </TableCell>
                <TableCell className='text-gray-600 text-sm align-top max-w-58'>
                  <ExpandableDescription description={plant.description} />
                </TableCell>
                <TableCell className='align-top'>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-wrap gap-1.5 items-center'>
                      {plant.symptoms.map((treatment, index) => {
                        const isSelected =
                          selectedSymptom?.plantId === plant.herb_id &&
                          selectedSymptom?.symptomIndex === index
                        return (
                          <Badge
                            key={treatment.symptomId}
                            variant='secondary'
                            className={`group relative text-xs cursor-pointer transition-all pr-1 ${
                              isSelected
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                            onClick={() =>
                              handleSymptomClick(plant.herb_id, index)
                            }
                            title='Click para ver detalles'
                          >
                            {treatment.symptom.name}
                            <button
                              onClick={(e) =>
                                handleRemoveSymptom(
                                  e,
                                  plant.herb_id,
                                  treatment.symptomId,
                                )
                              }
                              disabled={isRemovingSymptom}
                              className='ml-1 hidden group-hover:inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 disabled:opacity-40'
                              title='Eliminar síntoma'
                            >
                              <X className='h-3 w-3' />
                            </button>
                          </Badge>
                        )
                      })}
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-4 w-4 cursor-pointer'
                        onClick={() => openAddSymptom(plant)}
                        title='Agregar síntoma'
                      >
                        <PlusCircle className='h-4 w-4 text-green-600' />
                      </Button>
                    </div>

                    {selectedSymptom?.plantId === plant.herb_id && (
                      <div className='bg-green-50 rounded-lg p-3 border border-green-200 text-sm space-y-2'>
                        <div className='flex items-center justify-between gap-2'>
                          <Badge
                            variant='secondary'
                            className='bg-green-600 text-white'
                          >
                            {
                              plant.symptoms[selectedSymptom.symptomIndex]
                                .symptom.name
                            }
                          </Badge>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6'
                            onClick={() => setEditSymptomOpen(true)}
                            title='Editar tratamiento'
                          >
                            <Edit className='h-3.5 w-3.5 text-green-700' />
                          </Button>
                        </div>
                        <p>
                          <span className='font-medium'>
                            Partes de la planta:{' '}
                          </span>
                          {
                            plant.symptoms[selectedSymptom.symptomIndex]
                              .partsplant
                          }
                        </p>
                        <p>
                          <span className='font-medium'>Preparación: </span>
                          {plant.symptoms[selectedSymptom.symptomIndex].prepare}
                        </p>
                        {plant.symptoms[selectedSymptom.symptomIndex].apply && (
                          <p>
                            <span className='font-medium'>Aplicación: </span>
                            {plant.symptoms[selectedSymptom.symptomIndex].apply}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-right align-top'>
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
        {pagination && <PaginationControls {...pagination} />}
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
      <EditSymptomDialog
        treatment={activeTreatment}
        open={editSymptomOpen}
        onOpenChange={setEditSymptomOpen}
        onSubmit={onEditSymptom}
        isLoading={isEditingSymptom}
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
