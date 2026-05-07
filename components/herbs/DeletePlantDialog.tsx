'use client'

import { AlertTriangle } from 'lucide-react'
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
import { Plant } from './interfaces'

// S: Solo maneja confirmación de borrado
interface DeletePlantDialogProps {
  plant: Plant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => Promise<void>
  isLoading?: boolean
}

export function DeletePlantDialog({
  plant,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeletePlantDialogProps) {
  const handleConfirm = async () => {
    if (!plant) return
    await onConfirm(plant.herb_id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
            <AlertTriangle className='w-5 h-5' />
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className='space-y-2'>
              Estás a punto de eliminar permanentemente:{' '}
              <strong className='text-gray-900'>{plant?.name}</strong> (ID:{' '}
              {plant?.herb_id})
            <p className='text-red-600 font-medium'>
              Esta acción no se puede deshacer. Se eliminarán todos los datos
              asociados, incluyendo síntomas y preparaciones.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className='bg-red-600 hover:bg-red-700'
          >
            {isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
