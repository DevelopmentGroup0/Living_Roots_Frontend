'use client'

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  userService,
  type UserSortField,
  type SortDirection,
  type UsersFilters,
} from '@/services/users-service'

const USERS_QUERY_KEY = 'users'

export function useUsers(filters: UsersFilters) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: () => userService.getAll(filters),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string
      role: 'admin' | 'client'
    }) => userService.updateRole(userId, { role }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      })
    },
  })
}
