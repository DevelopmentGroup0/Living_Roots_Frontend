'use client'

import { ArrowLeft, ArrowRight, Loader2, Search } from 'lucide-react'
import { useState } from 'react'

import { useUsersManagement } from '@/components/hooks/useUsersManagement'

import type { User, UserRole, UserSortField } from '@/services/users-service'

const SORTABLE_COLUMNS: {
  key: UserSortField
  label: string
}[] = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'lastName',
    label: 'Apellido',
  },
  {
    key: 'email',
    label: 'Correo',
  },
  {
    key: 'role',
    label: 'Rol',
  },
  {
    key: 'createdAt',
    label: 'Fecha de registro',
  },
]

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  client: 'Comunitario',
}

export function UsersTable() {
  const {
    users,
    meta,

    page,
    setPage,

    searchInput,
    setSearchInput,

    sortBy,
    sortDir,
    toggleSort,

    updateRole,
    handleRoleChange,

    isLoading,
    error,
  } = useUsersManagement()

  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>(
    {},
  )

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const totalPages = meta?.totalPages ?? 1

  const total = meta?.total ?? 0

  const from = total === 0 ? 0 : (page - 1) * (meta?.limit ?? 10) + 1

  const to = total === 0 ? 0 : Math.min(page * (meta?.limit ?? 10), total)

  const getSelectedRole = (user: User) =>
    selectedRoles[user.user_id] ?? user.role

  const handleSave = async (user: User) => {
    const role = getSelectedRole(user)

    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      await handleRoleChange(user.user_id, role)

      setSelectedRoles((current) => {
        const next = {
          ...current,
        }

        delete next[user.user_id]

        return next
      })

      setSuccessMessage(
        `Rol de ${user.name} ${user.lastName} actualizado correctamente.`,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el rol.',
      )
    }
  }

  return (
    <div className='rounded-xl border bg-white shadow-sm'>
      <div className='flex flex-wrap items-center justify-between gap-4 border-b p-6'>
        <div>
          <h2 className='text-lg font-semibold'>Gestión de usuarios</h2>

          <p className='text-sm text-gray-500'>
            Administra los roles de los usuarios.
          </p>
        </div>

        <div className='relative'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />

          <input
            type='text'
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder='Buscar usuario...'
            className='w-64 rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400'
          />
        </div>
      </div>

      {(successMessage || errorMessage) && (
        <div className='border-b px-6 py-3 text-sm'>
          {successMessage && (
            <span className='text-green-600'>{successMessage}</span>
          )}

          {errorMessage && <span className='text-red-600'>{errorMessage}</span>}
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b text-gray-500'>
              {SORTABLE_COLUMNS.map((column) => (
                <th key={column.key} className='px-6 py-3 font-medium'>
                  <button
                    type='button'
                    onClick={() => toggleSort(column.key)}
                    className='flex items-center gap-1 hover:text-gray-700'
                  >
                    {column.label}

                    <span className='text-[10px]'>
                      {sortBy === column.key
                        ? sortDir === 'asc'
                          ? '▲'
                          : '▼'
                        : '↕'}
                    </span>
                  </button>
                </th>
              ))}

              <th className='px-6 py-3 text-right font-medium'>Acción</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center'>
                  <Loader2 className='mx-auto size-5 animate-spin' />
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center text-red-500'>
                  No se pudieron cargar los usuarios.
                </td>
              </tr>
            )}

            {!isLoading && !error && users.length === 0 && (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center text-gray-400'>
                  No se encontraron usuarios.
                </td>
              </tr>
            )}

            {!error &&
              users.map((user) => {
                const selectedRole = getSelectedRole(user)

                const hasChanges = selectedRole !== user.role

                const isSaving =
                  updateRole.isPending &&
                  updateRole.variables?.userId === user.user_id

                return (
                  <tr
                    key={user.user_id}
                    className='border-b last:border-0 hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 font-medium'>{user.name}</td>

                    <td className='px-6 py-4'>{user.lastName}</td>

                    <td className='px-6 py-4'>{user.email}</td>

                    <td className='px-6 py-4'>
                      <select
                        value={selectedRole}
                        onChange={(event) =>
                          setSelectedRoles((current) => ({
                            ...current,
                            [user.user_id]: event.target.value as UserRole,
                          }))
                        }
                        className='rounded-md border px-3 py-2'
                      >
                        <option value='client'>{ROLE_LABELS.client}</option>

                        <option value='admin'>{ROLE_LABELS.admin}</option>
                      </select>
                    </td>

                    <td className='px-6 py-4'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className='px-6 py-4 text-right'>
                      <button
                        type='button'
                        disabled={!hasChanges || updateRole.isPending}
                        onClick={() => handleSave(user)}
                        className='rounded-md border px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between px-6 py-4'>
        <p className='text-sm text-gray-500'>
          Mostrando <span className='font-medium'>{from}</span> a{' '}
          <span className='font-medium'>{to}</span> de{' '}
          <span className='font-medium'>{total}</span>
        </p>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            disabled={!meta?.hasPreviousPage}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className='flex size-8 items-center justify-center rounded-lg border disabled:opacity-40'
          >
            <ArrowLeft className='size-4' />
          </button>

          {Array.from(
            {
              length: Math.min(totalPages, 5),
            },
            (_, index) => index + 1,
          ).map((pageNumber) => (
            <button
              type='button'
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`flex size-8 items-center justify-center rounded-lg ${
                pageNumber === page
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type='button'
            disabled={!meta?.hasNextPage}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            className='flex size-8 items-center justify-center rounded-lg border disabled:opacity-40'
          >
            <ArrowRight className='size-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
