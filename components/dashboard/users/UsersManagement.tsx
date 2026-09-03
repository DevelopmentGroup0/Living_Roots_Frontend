// export function useUsersManagement() {
'use client'

import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Loader2,
  Search,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { useUsersManagement } from '@/components/hooks/useUsersManagement'
import type { User, UserRole, UserSortField } from '@/services/users-service'
import { ConfirmDeleteUserModal } from './ConfirmDeleteUserModal'

const SORTABLE_COLUMNS: {
  key: UserSortField
  label: string
}[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'lastName', label: 'Apellido' },
  { key: 'email', label: 'Correo' },
  { key: 'role', label: 'Rol' },
  { key: 'createdAt', label: 'Fecha de registro' },
]

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  client: 'Comunitario',
}

export function UsersManagement() {
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
    updateUser,
    updateRoleMutation,
    deleteUser,
    isUpdatingUser,
    isDeleting,
    isLoading,
    error,
  } = useUsersManagement()

  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({
    name: '',
    lastName: '',
    email: '',
  })

  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>(
    {},
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const limit = meta?.limit ?? 10
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = total === 0 ? 0 : Math.min(page * limit, total)

  const startEditing = (user: User) => {
    setEditingUserId(user.user_id)
    setEditValues({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    })
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const cancelEditing = () => {
    setEditingUserId(null)

    setEditValues({
      name: '',
      lastName: '',
      email: '',
    })
  }

  const handleConfirmEdit = async (user: User) => {
    const data = {
      name: editValues.name.trim(),
      lastName: editValues.lastName.trim(),
      email: editValues.email.trim(),
    }

    if (!data.name || !data.lastName || !data.email) {
      setErrorMessage('Nombre, apellido y correo son obligatorios.')
      return
    }

    try {
      setSuccessMessage(null)
      setErrorMessage(null)
      await updateUser({
        userId: user.user_id,
        data,
      })
      setEditingUserId(null)
      setSuccessMessage(
        `Usuario ${user.name} ${user.lastName} actualizado correctamente.`,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el usuario.',
      )
    }
  }

  const handleRoleChange = async (user: User, role: UserRole) => {
    if (role === user.role) {
      return
    }

    try {
      setSuccessMessage(null)
      setErrorMessage(null)
      await updateRoleMutation.mutateAsync({
        userId: user.user_id,
        role,
      })
      setSelectedRoles((current) => {
        const next = { ...current }
        delete next[user.user_id]
        return next
      })
      setSuccessMessage(
        `Rol de ${user.name} ${user.lastName} actualizado correctamente.`,
      )
    } catch (error) {
      setSelectedRoles((current) => ({
        ...current,
        [user.user_id]: user.role,
      }))

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el rol.',
      )
    }
  }

  const handleDelete = async () => {
    if (!deletingUser) {
      return
    }

    try {
      setSuccessMessage(null)
      setErrorMessage(null)
      await deleteUser(deletingUser.user_id)
      setDeletingUser(null)
      setSuccessMessage(
        `Usuario ${deletingUser.name} ${deletingUser.lastName} eliminado correctamente.`,
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el usuario.',
      )
    }
  }

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm'>
        {/* Header */}
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-6'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Gestión de usuarios
            </h2>

            <p className='text-sm text-gray-500'>
              Administra los usuarios y sus roles.
            </p>
          </div>

          <div className='relative'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />

            <input
              type='text'
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder='Buscar usuario...'
              className='w-64 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400'
            />
          </div>
        </div>

        {/* Messages */}
        {(successMessage || errorMessage) && (
          <div className='border-b border-gray-100 px-6 py-3 text-sm'>
            {successMessage && (
              <span className='text-green-600'>{successMessage}</span>
            )}

            {errorMessage && (
              <span className='text-red-600'>{errorMessage}</span>
            )}
          </div>
        )}

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-100 text-gray-500'>
                {SORTABLE_COLUMNS.map((column) => (
                  <th key={column.key} className='px-6 py-3 font-medium'>
                    <button
                      type='button'
                      onClick={() => toggleSort(column.key)}
                      className='flex items-center gap-1 hover:text-gray-700'
                    >
                      {' '}
                      {column.label}
                      <span className='text-[10px]'>
                        {sortBy === column.key
                          ? sortDir === 'asc'
                            ? '▲'
                            : '▼'
                          : '↕'}{' '}
                      </span>{' '}
                    </button>{' '}
                  </th>
                ))}
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
                  <td
                    colSpan={6}
                    className='px-6 py-8 text-center text-red-500'
                  >
                    No se pudieron cargar los usuarios.
                  </td>
                </tr>
              )}

              {!isLoading && !error && users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-8 text-center text-gray-400'
                  >
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}

              {!error &&
                users.map((user) => {
                  const isEditing = editingUserId === user.user_id
                  const currentRole = selectedRoles[user.user_id] ?? user.role
                  const isSaving =
                    isUpdatingUser && editingUserId === user.user_id
                  return (
                    <tr
                      key={user.user_id}
                      className='border-b border-gray-50 hover:bg-gray-50'
                    >
                      {/* Nombre */}
                      <td className='px-6 py-4 font-medium text-gray-900'>
                        {isEditing ? (
                          <input
                            value={editValues.name}
                            onChange={(event) =>
                              setEditValues((current) => ({
                                ...current,
                                name: event.target.value,
                              }))
                            }
                            disabled={isSaving}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
                          />
                        ) : (
                          user.name
                        )}
                      </td>

                      {/* Apellido */}
                      <td className='px-6 py-4'>
                        {isEditing ? (
                          <input
                            value={editValues.lastName}
                            onChange={(event) =>
                              setEditValues((current) => ({
                                ...current,
                                lastName: event.target.value,
                              }))
                            }
                            disabled={isSaving}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
                          />
                        ) : (
                          user.lastName
                        )}
                      </td>

                      {/* Correo */}
                      <td className='px-6 py-4'>
                        {isEditing ? (
                          <input
                            type='email'
                            value={editValues.email}
                            onChange={(event) =>
                              setEditValues((current) => ({
                                ...current,
                                email: event.target.value,
                              }))
                            }
                            disabled={isSaving}
                            className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500'
                          />
                        ) : (
                          <span className='text-blue-600'>{user.email}</span>
                        )}
                      </td>

                      {/* Rol */}
                      <td className='px-6 py-4'>
                        <select
                          value={currentRole}
                          onChange={(event) =>
                            handleRoleChange(
                              user,
                              event.target.value as UserRole,
                            )
                          }
                          disabled={isEditing || updateRoleMutation.isPending}
                          className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm'
                        >
                          <option value='client'>{ROLE_LABELS.client}</option>

                          <option value='admin'>{ROLE_LABELS.admin}</option>
                        </select>
                      </td>

                      {/* Fecha */}
                      <td className='px-6 py-4 text-gray-500'>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Acciones */}
                      <td className='px-6 py-4'>
                        <div className='flex justify-end gap-2'>
                          {isEditing ? (
                            <>
                              <button
                                type='button'
                                onClick={() => handleConfirmEdit(user)}
                                disabled={isSaving}
                                className='inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50'
                              >
                                {isSaving ? 'Guardando...' : 'Confirmar'}
                              </button>

                              <button
                                type='button'
                                onClick={cancelEditing}
                                disabled={isSaving}
                                className='rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50'
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              type='button'
                              onClick={() => startEditing(user)}
                              className='inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                            >
                              <Edit className='size-4' />
                              Editar
                            </button>
                          )}

                          <button
                            type='button'
                            onClick={() => setDeletingUser(user)}
                            disabled={isEditing || isDeleting}
                            className='inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            <Trash2 className='size-4' />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
              className='flex size-8 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40'
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
                className={`flex size-8 items-center justify-center rounded-lg text-sm font-medium ${
                  pageNumber === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
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
              className='flex size-8 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-40'
            >
              <ArrowRight className='size-4' />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteUserModal
        user={deletingUser}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setDeletingUser(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  )
}
