'use client'

import { useState, useEffect } from 'react'

import { useUsers as useUsersQuery, useUpdateUserRole } from '@/hooks/useUsers'

import type {
  UserRole,
  UserSortField,
  SortDirection,
} from '@/services/users-service'

const PAGE_SIZE = 10

export function useUsersManagement() {
  const [page, setPage] = useState(1)

  const [searchInput, setSearchInput] = useState('')

  const [search, setSearch] = useState('')

  const [sortBy, setSortBy] = useState<UserSortField>('createdAt')

  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      setSearch(searchInput.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const filters = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    sortBy,
    sortDir,
  }

  const query = useUsersQuery(filters)

  const updateRole = useUpdateUserRole()

  const toggleSort = (column: UserSortField) => {
    if (sortBy === column) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))

      setPage(1)
      return
    }

    setSortBy(column)
    setSortDir('asc')
    setPage(1)
  }

  const handleRoleChange = (userId: string, role: UserRole) =>
    updateRole.mutateAsync({
      userId,
      role,
    })

  return {
    users: query.data?.data ?? [],
    meta: query.data?.meta,

    page,
    setPage,

    PAGE_SIZE,

    searchInput,
    setSearchInput,

    sortBy,
    sortDir,
    toggleSort,

    handleRoleChange,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    updateRole,
  }
}
