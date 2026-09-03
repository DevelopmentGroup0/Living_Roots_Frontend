'use client'

import { useState } from 'react'
import type { User } from '@/services/users-service'

interface EditUserFormProps {
  user: User
  isSaving: boolean
  onConfirm: (data: { name: string; lastName: string; email: string }) => void
}

export function EditUserForm({ user, isSaving, onConfirm }: EditUserFormProps) {
  const [name, setName] = useState(user.name)
  const [lastName, setLastName] = useState(user.lastName)
  const [email, setEmail] = useState(user.email)

  const handleSubmit = () => {
    onConfirm({
      name: name.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    })
  }

  const hasChanges =
    name.trim() !== user.name ||
    lastName.trim() !== user.lastName ||
    email.trim() !== user.email

  return (
    <>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isSaving}
        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
      />

      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        disabled={isSaving}
        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
      />

      <input
        type='email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isSaving}
        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
      />

      <button
        type='button'
        onClick={handleSubmit}
        disabled={!hasChanges || isSaving}
        className='inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {isSaving ? 'Guardando...' : 'Confirmar'}
      </button>
    </>
  )
}
