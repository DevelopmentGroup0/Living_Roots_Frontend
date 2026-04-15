/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

// Definimos las opciones fuera del handler para que sea más limpio (SOLID)
const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`

export const authOptions = {
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

        console.log('Url', url)

        console.log('Datos enviados desde el front:', payload)
        // Llamada a tu backend en RENDER
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
          }
        )

          console.log('Status del Backend en Render:', res.status)

          const user = await res.json()

          console.log('Respuesta del Backend como:', user)

          // Si Render dice que todo ok, devolvemos el objeto user a NextAuth
          if (res.ok && user) {
            return user
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
        token.accessToken = (user as any).access_token
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Inyectar el token directamente en la raíz de la sesión
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
