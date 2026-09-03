'use client'

import { useEffect, useState } from 'react'

import {
  useDeleteUser,
  useUpdateUser,
  useUpdateUserRole,
  useUsersQuery,
} from '@/hooks/useUsers'

import type { UserSortField, SortDirection } from '@/services/users-service'

const PAGE_SIZE = 10

export function useUsersManagement() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<UserSortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      setSearch(searchInput.trim())
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const filters = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    sortBy,
    sortDir,
  }

  const query = useUsersQuery(filters)
  const updateUserMutation = useUpdateUser()
  const updateRoleMutation = useUpdateUserRole()
  const deleteUserMutation = useDeleteUser()

  const toggleSort = (column: UserSortField) => {
    if (sortBy === column) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
    setPage(1)
  }

  return {
    users: query.data?.data ?? [],
    meta: query.data?.meta,
    page,
    setPage,
    searchInput,
    setSearchInput,
    sortBy,
    sortDir,
    toggleSort,
    updateUser: updateUserMutation.mutateAsync,
    updateRole: updateRoleMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    updateRoleMutation,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  }
}
