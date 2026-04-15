import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // Se extiende el objeto 'session' que devuelve useSession() y getSession()
  interface Session {
    accessToken: string // <-- Aquí agregas el tipo de tu backend
    user: {} & DefaultSession['user']
  }

  // Se extiende el objeto 'user' que devuelve el authorize del Provider
  interface User {
    accessToken: string // <-- Importante: debe coincidir con lo que devuelve Render
  }
}

declare module 'next-auth/jwt' {
  // Se extiende el token que se guarda en la cookie cifrada */
  interface JWT {
    accessToken: string
    id: string
  }
}
