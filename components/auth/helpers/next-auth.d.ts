import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { Role } from '@/config/rbac' // Ajusta la ruta si tu archivo rbac.ts está en otro lado

declare module 'next-auth' {
  // Extiende la estructura del objeto 'user' que viene dentro de 'session'
  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession['user']
  }

  // Extiende la estructura del objeto 'user' que devuelve el proveedor de credenciales
  interface User {
    id: string
    role: Role
    access_token?: string
  }
}

declare module 'next-auth/jwt' {
  // Extiende la estructura del JWT para que reconozca los datos que guardamos en el callback jwt()
  interface JWT {
    id?: string
    role?: Role
    accessToken?: string
  }
}
