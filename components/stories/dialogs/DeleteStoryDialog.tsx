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
import type { Story } from '../interfaces'

interface DeleteStoryDialogProps {
  story: Story | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => Promise<void>
  isLoading?: boolean
}

export function DeleteStoryDialog({
  story,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteStoryDialogProps) {
  const handleConfirm = async () => {
    if (!story) return
    await onConfirm(story.story_id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
            <AlertTriangle className='w-5 h-5' />
            <strong className='text-red-600 text-xl'>¿Estás seguro?</strong>
          </AlertDialogTitle>
          <AlertDialogDescription className='space-y-2 font-medium'>
            Estás a punto de{' '}
            <strong className='text-red-600'>eliminar permanentemente: </strong>
            <strong className='text-gray-900'>{story?.title}</strong> (ID:{' '}
            <strong className='text-gray-900'>{story?.story_id}</strong>) <br />
            <br />
            Esta acción no se puede deshacer. Se eliminará el relato y todos sus
            datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`bg-red-600 hover:bg-red-700 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Eliminando...' : 'Sí, Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
