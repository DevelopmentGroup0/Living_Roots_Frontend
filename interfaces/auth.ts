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
}

export interface RecognizedDevice {
  id: string
  userAgent: string
  browser?: string
  os?: string
  lastActive: string
  current: boolean
}

export interface TrustedDevice {
  id: string
  browser: string
  os: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  expiresAt: string
  lastUsedAt: string | null
  isCurrent: boolean
}

// Actualizamos el payload de actualización para incluir el avatar
export interface UpdateUserPayload {
  name?: string
  lastName?: string
  email?: string
  phone?: string | null
  avatar?: string | null
}

export type UserRole = 'admin' | 'client'

export type UserSortField = 'name' | 'lastName' | 'email' | 'role' | 'createdAt'

export type SortDirection = 'asc' | 'desc'

export interface User {
  user_id: string
  name: string
  lastName: string
  phone: string | null
  email: string
  role: UserRole
  avatar?: string | null
  createdAt: string
  updateAt: string
}

export interface UpdateUserRolePayload {
  role: UserRole
}

export interface UsersFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: UserSortField
  sortDir?: SortDirection
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedUsersResponse {
  data: User[]
  meta: PaginationMeta
}
