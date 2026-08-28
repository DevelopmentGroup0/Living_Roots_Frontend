import NextAuth, { NextAuthOptions } from 'next-auth'
import { jwtDecode } from 'jwt-decode'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Role } from '@/components/auth/interfaces/interfaces'

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
    // 1. Persiste el token de Render en el JWT de NextAuth
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000)

      // 1. Comprobar si el token base de NextAuth expiró (exp está en segundos)
      if (token.exp && now > (token.exp as number)) {
        return { ...token, error: 'TokenExpiredError' }
      }

      // 2. Si es el momento del login, 'user' estará disponible
      if (user) {
        const { accessToken, id, role, accessTokenExpires } = user

        // Retornamos un nuevo objeto combinando el token existente y los datos del usuario
        return {
          ...token,
          accessToken,
          sub: id,
          role,
          accessTokenExpires,
        }
      }
      return token
    },

    async session({ session, token }) {
      // Inyectar el token directamente en la raíz de la sesión
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
        session.user.email = token.email
      }
      return {
        ...session,
        accessToken: token.accessToken,
      }
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}

const handler = NextAuth(authOptions)

// Exportamos los métodos HTTP que NextAuth necesita
export { handler as GET, handler as POST }
