import NextAuth, { NextAuthOptions } from 'next-auth'
import { jwtDecode } from 'jwt-decode'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from '@/components/auth/interfaces/interfaces'
import { refreshAccessToken } from '@/lib/auth/refresh-access-token'

// Definimos las opciones fuera del handler para que sea más limpio (SOLID)

interface sessionInterface {
  access_token: string
  email: string
  role: Role
  sub: string
  exp: number
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      // Ya no recibe email/password: el wizard de 2FA (login + verify-2fa)
      // ya resolvió el intercambio completo con el backend antes de llegar
      // acá, así que solo entra el access_token ya emitido para decodificar.
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null

        try {
          const decoded: sessionInterface = jwtDecode(credentials.accessToken)

          return {
            id: decoded.sub,
            accessToken: credentials.accessToken,
            sub: decoded.sub,
            email: decoded.email,
            role: decoded.role as Role,
            accessTokenExpires: decoded.exp,
          }
        } catch {
          // Token inválido o expirado
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // 1. Primer inicio de sesión
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          sub: user.id,
          accessTokenExpires: user.accessTokenExpires,
        }
      }
      // 2. El token aún no ha expirado
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // 3. El token expiró, intentamos refrescarlo en segundo plano
      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      // Si hubo un error al refrescar, lo pasamos al cliente
      if (token.error) {
        session.error = token.error as string
      }

      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
        session.accessToken = token.accessToken
      }

      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}

const handler = NextAuth(authOptions)

// Exportamos los métodos HTTP que NextAuth necesita
export { handler as GET, handler as POST }
