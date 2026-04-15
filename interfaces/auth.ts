// Lo que espero recibir del Backend tras un login/registro exitoso
export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role?: string
  }
}

// Lo que sale desde el login
export interface LoginCredentials {
  email: string
  password: string
}

// Lo que sale desde el registro
export interface RegisterData {
  name: string
  lastName: string
  email: string
  password: string
//   terms: boolean
}
