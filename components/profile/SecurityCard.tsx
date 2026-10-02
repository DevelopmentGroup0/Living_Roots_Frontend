'use client'

import { Button } from '@/components/ui/button'
import { RecognizedDevice } from '@/interfaces/auth'
import { Shield, Laptop } from 'lucide-react'

interface SecurityCardProps {
  devices: RecognizedDevice[]
  onRevokeDevice: (deviceId: string) => void
}

export function SecurityCard({ devices, onRevokeDevice }: SecurityCardProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>Security</h3>
          <p className='text-sm text-gray-500'>
            Gestiona tu contraseña y dispositivos con acceso activo.
          </p>
        </div>
        <Shield className='h-5 w-5 text-gray-400' />
      </div>

      {/* Sección Cambio de contraseña */}
      <div className='flex items-center justify-between py-2'>
        <div>
          <h4 className='text-sm font-semibold text-gray-800'>
            Change Password
          </h4>
          <p className='text-xs text-gray-500'>
            Receive real-time notifications and security alerts.
          </p>
        </div>
        <Button variant='outline' size='sm'>
          Change Password
        </Button>
      </div>

      {/* Dispositivos Reconocidos */}
      <div className='pt-4 border-t border-gray-100 space-y-4'>
        <h4 className='text-sm font-semibold text-gray-800'>
          Recognized Devices
        </h4>
        <div className='space-y-3'>
          {devices.map((device) => (
            <div
              key={device.id}
              className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'
            >
              <div className='flex items-start gap-3'>
                <Laptop className='h-5 w-5 text-gray-500 mt-0.5' />
                <div>
                  <p className='text-xs font-medium text-gray-700 break-all max-w-md'>
                    {device.userAgent}
                  </p>
                  <p className='text-[10px] text-gray-400 mt-0.5'>
                    Última actividad: {device.lastActive}{' '}
                    {device.current && '• (Este dispositivo)'}
                  </p>
                </div>
              </div>
              {!device.current && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-red-600 hover:text-red-700 hover:bg-red-50 text-xs'
                  onClick={() => onRevokeDevice(device.id)}
                >
                  Revocar
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
