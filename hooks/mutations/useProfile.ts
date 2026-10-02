import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/users-service'
import { UpdateUserPayload } from '@/interfaces/auth'

export function useProfile(userId: string) {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getProfile(),
    enabled: !!userId,
  })

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      userService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', userId], updatedUser)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    user,
    isLoading,
    error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  }
}
