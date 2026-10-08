import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trustedDevicesService } from '@/services/trusted-devices-service'
import { TrustedDevice } from '@/interfaces/auth'
import { toast } from 'sonner'

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
      // 1. Lanzamos el toast de éxito
      toast.success('Dispositivo revocado correctamente')

      // 2. Actualizamos la caché local de forma optimista/inmediata
      queryClient.setQueryData<TrustedDevice[]>(queryKey, (prev) =>
        prev?.filter((d) => d.id !== deviceId),
      )
    },
    onError: (error: Error) => {
      // 3. Lanzamos el toast de error si realmente falló la petición
      toast.error(
        error.message || 'No se pudo revocar el dispositivo. Intenta de nuevo.',
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
