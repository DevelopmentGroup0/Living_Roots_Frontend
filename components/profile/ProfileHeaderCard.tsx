/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit2, X, Check, UserCheck } from 'lucide-react'
import { User } from '@/interfaces/auth'
import { ImageDropzone } from '../herbs/ImageDropzone'

interface ProfileHeaderCardProps {
  user: User
  onSave: (data: Partial<User>) => Promise<void>
  isSaving: boolean
}

export function ProfileHeaderCard({
  user,
  onSave,
  isSaving,
}: ProfileHeaderCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || '',
  })

  const handleSave = async () => {
    await onSave(formData)
    setIsEditing(false)
  }

  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>Tu Perfíl</h3>
          <p className='text-sm text-gray-500'>
            Administra la información de tu cuenta.
          </p>
        </div>
        <UserCheck className='h-5 w-5 text-gray-400' />
      </div>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-4'>
          {/* Avatar con soporte de subida si está en modo edición */}
          <div className='relative'>
            {isEditing ? (
              <div className='w-48'>
                <ImageDropzone
                  value={formData.avatar}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, avatar: url }))
                  }
                />
              </div>
            ) : (
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}+${user.lastName}&background=random`
                }
                alt={`${user.name} ${user.lastName}`}
                className='w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-inner'
              />
            )}
          </div>

          {!isEditing && (
            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                {user.name} {user.lastName}
              </h2>
              <p className='text-sm text-gray-500'>{user.email}</p>
            </div>
          )}
        </div>

        {/* Botón de Edición / Guardar */}
        <div>
          {isEditing ? (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                <X className='h-4 w-4 mr-1' /> Cancelar
              </Button>
              <Button
                size='sm'
                className='bg-green-600 hover:bg-green-700 text-white'
                onClick={handleSave}
                disabled={isSaving}
              >
                <Check className='h-4 w-4 mr-1' />{' '}
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          ) : (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsEditing(true)}
              className='flex items-center gap-1.5'
            >
              <Edit2 className='h-3.5 w-3.5' /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Campos en modo visualización o edición en línea */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100'>
        <div>
          <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            First Name
          </label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='mt-1'
            />
          ) : (
            <p className='text-sm font-medium text-gray-800 mt-1'>
              {user.name}
            </p>
          )}
        </div>

        <div>
          <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            Last Name
          </label>
          {isEditing ? (
            <Input
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className='mt-1'
            />
          ) : (
            <p className='text-sm font-medium text-gray-800 mt-1'>
              {user.lastName}
            </p>
          )}
        </div>

        <div>
          <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            Email Address
          </label>
          {isEditing ? (
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='mt-1'
            />
          ) : (
            <p className='text-sm font-medium text-gray-800 mt-1'>
              {user.email}
            </p>
          )}
        </div>

        <div>
          <label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
            Phone
          </label>
          {isEditing ? (
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder='+09 363 398 46'
              className='mt-1'
            />
          ) : (
            <p className='text-sm font-medium text-gray-800 mt-1'>
              {user.phone || 'No registrado'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
