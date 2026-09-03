'use client'

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  userService,
  type UpdateUserPayload,
  type UserRole,
  type UsersFilters,
} from '@/services/users-service'

export const USERS_QUERY_KEY = 'users'

export function useUsersQuery(filters: UsersFilters) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: () => userService.getAll(filters),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: UpdateUserPayload
    }) => userService.update(userId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      })
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      userService.updateRole(userId, { role }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userService.delete(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [USERS_QUERY_KEY],
      })
    },
  })
}
