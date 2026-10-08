import { apiClient } from '@/lib/api-client'
import { LoginCredentials, AuthResponse, RegisterData } from '@/interfaces/auth'
import { signIn } from 'next-auth/react'

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    })
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data)
  },
}
