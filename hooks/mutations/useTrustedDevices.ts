import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trustedDevicesService } from '@/services/trusted-devices-service'
import { TrustedDevice } from '@/interfaces/auth'

export function useTrustedDevices(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['trusted-devices', userId]

  const {
    data: devices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => trustedDevicesService.list(),
    enabled: !!userId,
  })

  const revokeMutation = useMutation({
    mutationFn: (deviceId: string) => trustedDevicesService.revoke(deviceId),
    onSuccess: (_, deviceId) => {
      queryClient.setQueryData<TrustedDevice[]>(queryKey, (prev) =>
        prev?.filter((d) => d.id !== deviceId),
      )
    },
  })

  return {
    devices,
    isLoading,
    error,
    revokeDevice: revokeMutation.mutateAsync,
    revokingId: revokeMutation.isPending ? revokeMutation.variables : null,
    revokeError: revokeMutation.error,
  }
}
