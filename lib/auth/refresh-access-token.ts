import { JWT } from 'next-auth/jwt'

export async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        // Envías el refreshToken guardado en el JWT de NextAuth
        Authorization: `Bearer ${token.refreshToken}`,
        'Content-Type': 'application/json',
      },
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token, // Si rotas el refresh token
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // Convierte a ms
    }
  } catch (error) {
    return {
      ...token,
      error: `${error} `,
    }
  }
}
