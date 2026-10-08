'use client'

import { Button } from '@/components/ui/button'
import { TrustedDevice } from '@/interfaces/auth'
import { Shield, Laptop, Smartphone, Tablet } from 'lucide-react'

interface SecurityCardProps {
  devices: TrustedDevice[]
  isLoadingDevices: boolean
  devicesError: unknown
  revokingId: string | null
  revokeError: unknown
  onRevokeDevice: (deviceId: string) => void
}

const DEVICE_ICONS = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
} as const

const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

function formatRelative(iso: string) {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60000)
  if (Math.abs(minutes) < 1) return 'hace un momento'
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return rtf.format(days, 'day')
  return rtf.format(Math.round(days / 30), 'month')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function SecurityCard({
  devices,
  isLoadingDevices,
  devicesError,
  revokingId,
  revokeError,
  onRevokeDevice,
}: SecurityCardProps) {
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

        {isLoadingDevices && (
          <p className='text-xs text-gray-500 animate-pulse'>
            Cargando dispositivos...
          </p>
        )}

        {!isLoadingDevices && !!devicesError && (
          <p className='text-xs text-red-600'>
            No se pudieron cargar tus dispositivos. Recarga la página para
            intentarlo de nuevo.
          </p>
        )}

        {!isLoadingDevices && !devicesError && devices.length === 0 && (
          <p className='text-xs text-gray-500'>
            No tienes dispositivos reconocidos. Aparecerán aquí cuando marques
            &quot;Recordar este dispositivo&quot; al iniciar sesión.
          </p>
        )}

        {!!revokeError && (
          <p className='text-xs text-red-600'>
            No se pudo revocar el dispositivo. Intenta de nuevo.
          </p>
        )}

        <div className='space-y-3'>
          {devices.map((device) => {
            const Icon = DEVICE_ICONS[device.deviceType]
            const isRevoking = revokingId === device.id

            return (
              <div
                key={device.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'
              >
                <div className='flex items-start gap-3'>
                  <Icon className='h-5 w-5 text-gray-500 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      {device.browser} en {device.os}
                      {device.isCurrent && (
                        <span className='ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700'>
                          Este dispositivo
                        </span>
                      )}
                    </p>
                    <p className='text-[11px] text-gray-400 mt-0.5'>
                      {device.lastUsedAt
                        ? `Última actividad: ${formatRelative(device.lastUsedAt)}`
                        : 'Sin actividad desde que se registró'}{' '}
                      • Válido hasta {formatDate(device.expiresAt)}
                    </p>
                  </div>
                </div>
                {!device.isCurrent && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50 text-xs'
                    onClick={() => onRevokeDevice(device.id)}
                    disabled={isRevoking}
                  >
                    {isRevoking ? 'Revocando...' : 'Revocar'}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
