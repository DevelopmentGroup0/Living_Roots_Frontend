import { LoginCredentials } from '@/interfaces/auth'
import { signIn } from 'next-auth/react'

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    })
  },
}
