'use client'
import { useState } from 'react'
import { Edit, Trash2, FlaskConical, AlertTriangle } from 'lucide-react'
import { Plant } from '@/components/herbs/interfaces'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function PlantTable({ herbs }: { herbs: Plant[] }) {
  const [selectedSymptom, setSelectedSymptom] = useState<{
    plantId: string
    symptomIndex: number
  } | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    symptoms: '',
  })

  const handleSymptomClick = (plantId: string, symptomIndex: number) => {
    if (
      selectedSymptom?.plantId === plantId &&
      selectedSymptom?.symptomIndex === symptomIndex
    ) {
      setSelectedSymptom(null)
    } else {
      setSelectedSymptom({ plantId, symptomIndex })
    }
  }

  const handleEditClick = (plant: Plant) => {
    setSelectedPlant(plant)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (plant: Plant) => {
    setSelectedPlant(plant)
    setDeleteDialogOpen(true)
  }

  const handleSaveEdit = () => {
    console.log('Guardando cambios:', editForm)
    setEditDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    console.log('Eliminando planta:', selectedPlant?.name)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
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
                  {plant.herb_id}
                </TableCell>
                <TableCell className='font-medium text-gray-900'>
                  {plant.name}
                </TableCell>
                <TableCell className='text-gray-600 text-sm'>
                  {plant.description}
                </TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-1.5'>
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
                      onClick={() => handleEditClick(plant)}
                    >
                      <Edit className='h-4 w-4 text-gray-600' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => handleDeleteClick(plant)}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-green-800'>
              <Edit className='w-5 h-5' />
              Editar Planta Medicinal
            </DialogTitle>
            <DialogDescription>
              Modifica la información de la planta {selectedPlant?.name}. ID:{' '}
              {selectedPlant?.herb_id}
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Nombre de la Planta</Label>
              <Input
                id='name'
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder='Ej: Manzanilla'
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='description'>Descripción</Label>
              <Textarea
                id='description'
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder='Describe las propiedades medicinales...'
                rows={3}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='symptoms'>Síntomas (separados por coma)</Label>
              <Input
                id='symptoms'
                value={editForm.symptoms}
                onChange={(e) =>
                  setEditForm({ ...editForm, symptoms: e.target.value })
                }
                placeholder='Ej: Insomnio, Ansiedad, Dolor estomacal'
              />
            </div>

            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <p className='text-sm text-green-800'>
                <strong>Nota:</strong> Los cambios se guardarán en la base de
                datos y se aplicarán inmediatamente a todos los registros
                relacionados.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className='bg-green-600 hover:bg-green-700'
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
              <AlertTriangle className='w-5 h-5' />
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-2'>
              <p>
                Estás a punto de eliminar permanentemente la planta:{' '}
                <strong className='text-gray-900'>{selectedPlant?.name}</strong>{' '}
                (ID: {selectedPlant?.herb_id})
              </p>
              <p className='text-red-600 font-medium'>
                Esta acción no se puede deshacer. Se eliminarán todos los datos
                asociados, incluyendo síntomas y preparaciones.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
