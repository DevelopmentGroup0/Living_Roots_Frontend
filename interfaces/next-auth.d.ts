import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // Se extiende el objeto 'session' que devuelve useSession() y getSession()
  interface Session {
    accessToken?: string
    error?: string
    // Unir propiedades personalizadas con los datos por defecto de Google (name, email, image)
    user: {
      id?: string
      role?: string
    } & DefaultSession['user']
  }

  // Se extiende el objeto 'user' que devuelve el authorize del Provider
  interface User extends DefaultUser {
    accessToken?: string
    role?: string
    accessTokenExpires?: number
  }
}

declare module 'next-auth/jwt' {
  // Se extiende el token que se guarda en la cookie cifrada */
  interface JWT {
    accessToken?: string
    role?: string
    accessTokenExpires?: number
    error?: string
  }
}
