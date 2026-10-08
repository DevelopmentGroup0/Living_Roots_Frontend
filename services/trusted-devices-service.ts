import { TrustedDevice } from '@/interfaces/auth'
import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }
  return session?.accessToken as string | undefined
}

export const trustedDevicesService = {
  async list(): Promise<TrustedDevice[]> {
    const token = await getToken()
    return await apiClient.get<TrustedDevice[]>(
      '/auth/profile/trusted-devices',
      token,
    )
  },

  async revoke(deviceId: string): Promise<void> {
    const token = await getToken()
    await apiClient.delete(`/auth/profile/trusted-devices/${deviceId}`, token)
  },
}
