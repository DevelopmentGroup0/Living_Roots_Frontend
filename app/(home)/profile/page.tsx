'use client'

import { useState } from 'react'
import { useProfile } from '@/hooks/mutations/useProfile'
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard'
import { SecurityCard } from '@/components/profile/SecurityCard'
import { DangerZoneCard } from '@/components/profile/DangerZoneCard'
import { RecognizedDevice } from '@/interfaces/auth'

export default function ProfilePage() {
  // ID de ejemplo proporcionado basado en tu backend y entorno
  const userId = 'bab4b013-affc-46cf-af85-2a77877bbd34'

  const { user, isLoading, error, updateProfile, isUpdating } =
    useProfile(userId)

  // Estado mock temporal para simular dispositivos reconocidos (como el UA que mencionaste)
  const [devices, setDevices] = useState<RecognizedDevice[]>([
    {
      id: 'a3020674f6b841b4523ffcac0af9baa2b790be025b0d8c1f08879fa15efccb8f',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36',
      lastActive: 'Hace un momento',
      current: true,
    },
    {
      id: 'dev-secondary-mobile-id',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      lastActive: 'Hace 2 días',
      current: false,
    },
  ])

  const handleRevokeDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId))
  }

  if (isLoading) {
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
    <div className='max-w-5xl mx-auto space-y-6 pb-12'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>My Profile</h1>
        <p className='text-sm text-gray-500'>
          Administra la información de tu cuenta y opciones de seguridad.
        </p>
      </div>

      {/* Tarjeta de Información General y Avatar */}
      <ProfileHeaderCard
        user={user}
        onSave={async (formData) => {
          await updateProfile(formData)
        }}
        isSaving={isUpdating}
      />

      {/* Tarjeta de Seguridad (Cambio de contraseña y dispositivos) */}
      <SecurityCard devices={devices} onRevokeDevice={handleRevokeDevice} />

      {/* Tarjeta de Zona de Peligro / Acciones Avanzadas */}
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
