/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from 'next-auth'
import { jwtDecode } from 'jwt-decode'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
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
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // if (!credentials?.email || !credentials?.password) return null
        // Extraer solo lo que el Backend de Render necesita
        const payload = {
          email: credentials?.email,
          password: credentials?.password,
        }

        console.log('Payload enviado desde el front:', payload)
        // Llamada a tu backend en RENDER
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
          },
        )

        const user = await res.json()

        console.log('Respuesta del Backend como:', user)

        // Si Render dice que todo ok, devolvemos el objeto user a NextAuth
        if (res.ok && user) {
          const decoded: sessionInterface = jwtDecode(user.access_token)
          return {
            ...user,
            sub: decoded.sub,
            email: decoded.email,
            role: decoded.role as Role,
            accessTokenExpires: decoded.exp * 1000,
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    // 1. Persiste el token de Render en el JWT de NextAuth
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        // Asumiendo que tu backend devuelve el token en la propiedad 'token' o 'accessToken'
        // Aquí 'user' es el JSON de Render.
        // Accedemos a la propiedad con el nombre real del backend.
        token.accessToken = user.access_token
        token.sub = user.sub
        token.role = user.role
        token.email = user.email
        token.accessTokenExpires = user.exp * 1000
        return token
      }
      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() > token.accessTokenExpires
      ) {
        return {}
      }

      return token
    },

    async session({ session, token }: { session: any; token: JWT }) {
      // Inyectar el token directamente en la raíz de la sesión
      if (token && session.user) {
        session.user.sub = token.sub
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
