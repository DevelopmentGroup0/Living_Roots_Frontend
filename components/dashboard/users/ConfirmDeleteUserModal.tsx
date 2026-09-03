import React from 'react'
import type { User } from '@/services/users-service'

interface ConfirmDeleteUserModalProps {
  user: User | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmDeleteUserModal: React.FC<ConfirmDeleteUserModalProps> = ({
  user,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!user) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-500/80 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
        <h3 className='mb-2 text-lg font-medium text-gray-900'>
          Confirmar eliminación
        </h3>

        <p className='mb-6 text-sm text-gray-500'>
          ¿Estás seguro de que deseas eliminar al usuario{' '}
          <strong className='text-gray-900'>
            &rdquo;{user.name} {user.lastName}&rdquo;
          </strong>{' '}
          ({user.email})?
        </p>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            disabled={isDeleting}
            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
          >
            Cancelar
          </button>

          <button
            type='button'
            onClick={onConfirm}
            disabled={isDeleting}
            className='rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
