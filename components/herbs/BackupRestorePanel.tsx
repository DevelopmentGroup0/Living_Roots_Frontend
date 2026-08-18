'use client'

import { useState } from 'react'
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog'
import { useBackupMutations } from '@/hooks/mutations/useBackupMutations'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { type RestoreResult } from '@/services/backup-service'

export function BackupRestorePanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [restoreSuccess, setRestoreSuccess] = useState<RestoreResult | null>(null)

  const { exportBackup, restoreBackup } = useBackupMutations()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx')) {
      setFileError('El archivo debe ser un archivo Excel (.xlsx).')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setFileError(null)
    setRestoreSuccess(null)
  }

  return (
    <div className='space-y-6'>
      {/* Sección 1: Exportación de Backup */}
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-gray-900'>Exportación de Backup</h2>
        <p className='mt-1 text-sm text-gray-500'>
          Descarga un archivo Excel con todos los datos actuales de plantas, síntomas y relaciones.
        </p>

        <div className='mt-4'>
          <Button
            onClick={() => exportBackup.mutate()}
            disabled={exportBackup.isPending}
          >
            {exportBackup.isPending ? 'Exportando...' : 'Exportar Backup'}
          </Button>
        </div>

        {exportBackup.isError && (
          <p className='mt-3 text-sm text-red-600'>
            {exportBackup.error instanceof Error
              ? exportBackup.error.message
              : 'Ocurrió un error al exportar el backup.'}
          </p>
        )}
      </div>

      {/* Sección 2: Restaurar desde Backup */}
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold text-gray-900'>Restaurar desde Backup</h2>
        <p className='mt-1 text-sm text-gray-500'>
          Sube un archivo Excel de backup para restaurar los datos. Esta operación reemplazará todos los registros actuales.
        </p>

        <div className='mt-4 space-y-3'>
          <input
            type='file'
            accept='.xlsx'
            onChange={handleFileChange}
            className='block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200'
          />

          {fileError && (
            <p className='text-sm text-red-600'>{fileError}</p>
          )}

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant='destructive'
                  disabled={!selectedFile || restoreBackup.isPending}
                />
              }
            >
              {restoreBackup.isPending ? 'Restaurando...' : 'Restaurar'}
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Confirmar restauración?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta operación reemplazará todos los datos actuales, incluyendo los favoritos de los usuarios.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogPrimitive.Close
                  render={<Button />}
                  onClick={() => {
                    restoreBackup.mutate(selectedFile!, {
                      onSuccess: (data) => {
                        setRestoreSuccess(data)
                        setSelectedFile(null)
                      },
                    })
                  }}
                >
                  Confirmar
                </AlertDialogPrimitive.Close>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {restoreBackup.isPending && (
          <p className='mt-3 text-sm text-gray-500'>Restaurando...</p>
        )}

        {restoreBackup.isError && (
          <p className='mt-3 text-sm text-red-600'>
            {restoreBackup.error instanceof Error
              ? restoreBackup.error.message
              : 'Ocurrió un error al restaurar el backup.'}
          </p>
        )}

        {restoreSuccess && (
          <div className='mt-4 rounded-lg border border-green-200 bg-green-50 p-4'>
            <p className='font-semibold text-green-800'>Restauración exitosa</p>
            <ul className='mt-2 space-y-1 text-sm text-green-700'>
              <li>
                <span className='font-medium'>Plantas restauradas:</span>{' '}
                {restoreSuccess.stats.plantas_restauradas} plantas
              </li>
              <li>
                <span className='font-medium'>Síntomas restaurados:</span>{' '}
                {restoreSuccess.stats.sintomas_restaurados} síntomas
              </li>
              <li>
                <span className='font-medium'>Relaciones restauradas:</span>{' '}
                {restoreSuccess.stats.relaciones_restauradas} relaciones
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
