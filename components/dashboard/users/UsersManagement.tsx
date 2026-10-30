'use client'

import { ArrowDownUp, Edit, Loader2, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { PaginationControls } from '@/components/herbs/PaginationControls'

import { useUsersManagement } from '@/hooks/useUsersManagement'
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
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const limit = meta?.limit ?? 10

  const startEditing = (user: User) => {
    setEditingUserId(user.user_id)
    setEditValues({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    })
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
      toast.error('Nombre, apellido y correo son obligatorios.')
      return
    }

    try {
      await updateUser({
        userId: user.user_id,
        data,
      })
      setEditingUserId(null)
      toast.success(`Usuario ${user.name} ${user.lastName} actualizado correctamente.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el usuario.')
    }
  }

  const handleRoleChange = async (user: User, role: UserRole) => {
    if (role === user.role) {
      return
    }

    try {
      await updateRoleMutation.mutateAsync({
        userId: user.user_id,
        role,
      })
      setSelectedRoles((current) => {
        const next = { ...current }
        delete next[user.user_id]
        return next
      })
      toast.success(`Rol de ${user.name} ${user.lastName} actualizado correctamente.`)
    } catch (error) {
      setSelectedRoles((current) => ({
        ...current,
        [user.user_id]: user.role,
      }))

      toast.error(error instanceof Error ? error.message : 'No se pudo actualizar el rol.')
    }
  }

  const handleDelete = async () => {
    if (!deletingUser) {
      return
    }

    try {
      await deleteUser(deletingUser.user_id)
      setDeletingUser(null)
      toast.success(`Usuario ${deletingUser.name} ${deletingUser.lastName} eliminado correctamente.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el usuario.')
    }
  }

  const dateFormatter = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' })

  const editInput = (
    field: 'name' | 'lastName' | 'email',
    label: string,
    isSaving: boolean,
    type = 'text',
  ) => (
    <input
      type={type}
      aria-label={label}
      value={editValues[field]}
      onChange={(event) =>
        setEditValues((current) => ({ ...current, [field]: event.target.value }))
      }
      disabled={isSaving}
      className='h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-green-600 disabled:opacity-60'
    />
  )

  const renderRole = (user: User, isEditing: boolean) => (
    <select
      aria-label={`Rol de ${user.name} ${user.lastName}`}
      value={selectedRoles[user.user_id] ?? user.role}
      onChange={(event) =>
        handleRoleChange(user, event.target.value as UserRole)
      }
      disabled={isEditing || updateRoleMutation.isPending}
      className='h-10 rounded-md border border-gray-300 bg-white px-3 text-sm disabled:opacity-60'
    >
      <option value='client'>{ROLE_LABELS.client}</option>
      <option value='admin'>{ROLE_LABELS.admin}</option>
    </select>
  )

  const renderActions = (
    user: User,
    isEditing: boolean,
    isSaving: boolean,
    compact = false,
  ) => (
    <>
      {isEditing ? (
        <>
          <button
            type='button'
            onClick={() => handleConfirmEdit(user)}
            disabled={isSaving}
            className='inline-flex h-10 items-center gap-2 rounded-lg border border-green-200 px-3 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSaving ? 'Guardando...' : 'Confirmar'}
          </button>
          <button
            type='button'
            onClick={cancelEditing}
            disabled={isSaving}
            className='h-10 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50'
          >
            Cancelar
          </button>
        </>
      ) : (
        <button
          type='button'
          onClick={() => startEditing(user)}
          className={`inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 ${compact ? 'w-10 justify-center' : 'px-3'}`}
          title='Editar'
        >
          <Edit className='size-4' />
          <span className={compact ? 'sr-only' : undefined}>Editar</span>
        </button>
      )}

      <button
        type='button'
        onClick={() => setDeletingUser(user)}
        disabled={isEditing || isDeleting}
        className={`inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 ${compact ? 'w-10 justify-center' : 'px-3'}`}
        title='Eliminar'
      >
        <Trash2 className='size-4' />
        <span className={compact ? 'sr-only' : undefined}>Eliminar</span>
      </button>
    </>
  )

  // Estados vacío / error / carga compartidos por la tabla y las tarjetas
  const statusContent = isLoading ? (
    <Loader2 className='mx-auto size-5 animate-spin' aria-label='Cargando' />
  ) : error ? (
    <span role='alert' className='text-red-500'>
      No se pudieron cargar los usuarios.
    </span>
  ) : users.length === 0 ? (
    <span className='text-gray-400'>No se encontraron usuarios.</span>
  ) : null

  return (
    <>
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm'>
        {/* Header */}
        <div className='flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-6'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Gestión de usuarios
            </h2>

            <p className='text-sm text-gray-500'>
              Administra los usuarios y sus roles.
            </p>
          </div>

          <div className='relative w-full sm:w-64'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400' />

            <input
              type='search'
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder='Buscar usuario...'
              aria-label='Buscar usuario'
              className='h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-base outline-none focus:border-gray-400 md:text-sm'
            />
          </div>
        </div>

        {/* Ordenar (solo móvil: en escritorio se ordena desde los encabezados) */}
        <div className='flex items-center gap-2 border-b border-gray-100 px-4 py-3 lg:hidden'>
          <label htmlFor='users-sort' className='text-sm text-gray-500'>
            Ordenar por
          </label>
          <select
            id='users-sort'
            value={sortBy}
            onChange={(event) => toggleSort(event.target.value as UserSortField)}
            className='h-10 min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm'
          >
            {SORTABLE_COLUMNS.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label}
              </option>
            ))}
          </select>
          <button
            type='button'
            onClick={() => toggleSort(sortBy)}
            aria-label={
              sortDir === 'asc'
                ? 'Orden ascendente, cambiar a descendente'
                : 'Orden descendente, cambiar a ascendente'
            }
            className='inline-flex h-10 items-center gap-1 rounded-md border border-gray-300 px-3 text-sm text-gray-700'
          >
            <ArrowDownUp className='size-4' />
            {sortDir === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>

        {/* Tarjetas (móvil) */}
        <ul className='divide-y divide-gray-100 lg:hidden' aria-busy={isLoading}>
          {statusContent && (
            <li className='px-4 py-8 text-center text-sm'>{statusContent}</li>
          )}

          {!error &&
            users.map((user) => {
              const isEditing = editingUserId === user.user_id
              const isSaving = isUpdatingUser && isEditing

              return (
                <li key={user.user_id} className='space-y-3 p-4'>
                  {isEditing ? (
                    <div className='grid gap-2'>
                      {editInput('name', 'Nombre', isSaving)}
                      {editInput('lastName', 'Apellido', isSaving)}
                      {editInput('email', 'Correo', isSaving, 'email')}
                    </div>
                  ) : (
                    <div>
                      <p className='font-medium text-gray-900'>
                        {user.name} {user.lastName}
                      </p>
                      <p className='break-all text-sm text-gray-600'>
                        {user.email}
                      </p>
                    </div>
                  )}

                  <div className='flex items-center justify-between gap-3'>
                    {renderRole(user, isEditing)}
                    <span className='text-xs text-gray-500'>
                      {dateFormatter.format(new Date(user.createdAt))}
                    </span>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {renderActions(user, isEditing, isSaving)}
                  </div>
                </li>
              )
            })}
        </ul>

        {/* Tabla (md en adelante) */}
        {/* relative: contiene el th sr-only (absolute) y evita que desborde el documento */}
        <div className='relative hidden overflow-x-auto lg:block'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-100 text-gray-500'>
                {SORTABLE_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    scope='col'
                    aria-sort={
                      sortBy === column.key
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    className='px-4 py-3 font-medium xl:px-6'
                  >
                    <button
                      type='button'
                      onClick={() => toggleSort(column.key)}
                      className='flex items-center gap-1 whitespace-nowrap hover:text-gray-700'
                    >
                      {column.label}
                      <span aria-hidden='true' className='text-[10px]'>
                        {sortBy === column.key
                          ? sortDir === 'asc'
                            ? '▲'
                            : '▼'
                          : '↕'}
                      </span>
                    </button>
                  </th>
                ))}
                <th scope='col' className='px-4 py-3 xl:px-6'>
                  <span className='sr-only'>Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {statusContent && (
                <tr>
                  <td colSpan={6} className='px-6 py-8 text-center'>
                    {statusContent}
                  </td>
                </tr>
              )}

              {!error &&
                users.map((user) => {
                  const isEditing = editingUserId === user.user_id
                  const isSaving = isUpdatingUser && isEditing

                  return (
                    <tr
                      key={user.user_id}
                      className='border-b border-gray-50 hover:bg-gray-50'
                    >
                      <td className='px-4 py-4 font-medium text-gray-900 xl:px-6'>
                        {isEditing
                          ? editInput('name', 'Nombre', isSaving)
                          : user.name}
                      </td>

                      <td className='px-4 py-4 xl:px-6'>
                        {isEditing
                          ? editInput('lastName', 'Apellido', isSaving)
                          : user.lastName}
                      </td>

                      <td className='max-w-56 px-4 py-4 xl:px-6'>
                        {isEditing ? (
                          editInput('email', 'Correo', isSaving, 'email')
                        ) : (
                          <span
                            className='block truncate text-gray-600'
                            title={user.email}
                          >
                            {user.email}
                          </span>
                        )}
                      </td>

                      <td className='px-4 py-4 xl:px-6'>
                        {renderRole(user, isEditing)}
                      </td>

                      <td className='whitespace-nowrap px-4 py-4 text-gray-500 lg:px-6'>
                        {dateFormatter.format(new Date(user.createdAt))}
                      </td>

                      <td className='px-4 py-4 xl:px-6'>
                        <div className='flex flex-wrap justify-end gap-2'>
                          {renderActions(user, isEditing, isSaving, true)}
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <PaginationControls
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
        />
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
