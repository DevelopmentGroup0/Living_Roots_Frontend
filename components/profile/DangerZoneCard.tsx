'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react'

interface DangerZoneCardProps {
  onLogoutAll: () => void
  onDeleteAccount: () => void
}

export function DangerZoneCard({
  onLogoutAll,
  onDeleteAccount,
}: DangerZoneCardProps) {
  return (
    <div className='bg-white rounded-2xl border border-red-100 p-6 shadow-sm space-y-6'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div>
          <h3 className='text-lg font-bold text-red-600'>Danger Zone</h3>
          <p className='text-sm text-gray-500'>
            Acciones críticas relacionadas con el acceso y estado de tu cuenta.
          </p>
        </div>
        <AlertTriangle className='h-5 w-5 text-red-500' />
      </div>

      {/* Cerrar sesión en todos los dispositivos */}
      <div className='flex items-center justify-between py-2'>
        <div>
          <h4 className='text-sm font-semibold text-gray-800'>
            Logout all devices
          </h4>
          <p className='text-xs text-gray-500'>
            Sign out from every active session across all browsers.
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={onLogoutAll}
          className='gap-2'
        >
          <LogOut className='h-4 w-4' /> Logout All
        </Button>
      </div>

      {/* Eliminar cuenta */}
      <div className='flex items-center justify-between py-2 pt-4 border-t border-gray-100'>
        <div>
          <h4 className='text-sm font-semibold text-red-600'>Delete account</h4>
          <p className='text-xs text-gray-500'>
            Permanently delete your account and all associated data.
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={onDeleteAccount}
          className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2'
        >
          <Trash2 className='h-4 w-4' /> Delete account
        </Button>
      </div>
    </div>
  )
}
