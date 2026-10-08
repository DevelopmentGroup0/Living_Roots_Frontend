'use client'

import { useSession } from 'next-auth/react'
import { useProfile } from '@/hooks/mutations/useProfile'
import { useTrustedDevices } from '@/hooks/mutations/useTrustedDevices'
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard'
import { SecurityCard } from '@/components/profile/SecurityCard'
import { DangerZoneCard } from '@/components/profile/DangerZoneCard'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const userId = session?.user?.id ?? ''

  const { user, isLoading, error, updateProfile, isUpdating } =
    useProfile(userId)

  const {
    devices,
    isLoading: isLoadingDevices,
    error: devicesError,
    revokeDevice,
    revokingId,
    revokeError,
  } = useTrustedDevices(userId)

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-100'>
        <p className='text-sm text-gray-500 animate-pulse'>
          Cargando perfil...
        </p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className='p-6 bg-red-50 border border-red-200 rounded-2xl text-red-600'>
        <p className='font-semibold'>Error al cargar el perfil</p>
        <p className='text-sm'>
          No se pudo recuperar la información del usuario. Intenta recargar la
          página.
        </p>
      </div>
    )
  }

  return (
    <div className='w-full mx-auto space-y-6 overflow-y-auto px-8 py-6'>
      <ProfileHeaderCard
        user={user}
        onSave={async (formData) => {
          await updateProfile(formData)
        }}
        isSaving={isUpdating}
      />

      <SecurityCard
        devices={devices}
        isLoadingDevices={isLoadingDevices}
        devicesError={devicesError}
        revokingId={revokingId}
        revokeError={revokeError}
        onRevokeDevice={(id) => revokeDevice(id).catch(() => undefined)}
      />

      <DangerZoneCard
        onLogoutAll={() => {
          console.log('Cerrando todas las sesiones activas...')
        }}
        onDeleteAccount={() => {
          console.log('Eliminando cuenta...')
        }}
      />
    </div>
  )
}
