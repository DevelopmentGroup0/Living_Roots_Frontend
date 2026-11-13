import { JWT } from 'next-auth/jwt'
import { jwtDecode } from 'jwt-decode'

export async function refreshAccessToken(token: JWT) {
  if (!token.refreshToken) {
    throw new Error('Refresh token no disponible')
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.refreshToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Refresh token rechazado (${response.status})`)
  }

  const refreshedTokens: unknown = await response.json()
  if (
    typeof refreshedTokens !== 'object' ||
    refreshedTokens === null ||
    !('access_token' in refreshedTokens) ||
    typeof refreshedTokens.access_token !== 'string' ||
    !('refresh_token' in refreshedTokens) ||
    typeof refreshedTokens.refresh_token !== 'string'
  ) {
    throw new Error('Respuesta inválida al renovar los tokens')
  }

  const { exp } = jwtDecode<{ exp?: number }>(refreshedTokens.access_token)
  if (typeof exp !== 'number') {
    throw new Error('El nuevo access token no contiene expiración')
  }

  return {
    ...token,
    accessToken: refreshedTokens.access_token,
    refreshToken: refreshedTokens.refresh_token,
    accessTokenExpires: exp * 1000,
    error: undefined,
  }
}
