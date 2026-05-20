// 1. Definimos los roles del sistema como tipos estrictos
export type Role = 'admin' | 'client'

// 2. Definimos las acciones o vistas permitidas (Permisos)
export type Permission = 'view:dashboard' | 'view:register-users' | 'view:home'

// 3. Centralizamos la matriz de accesos (Roles -> Permisos)
export const RBAC_POLICIES: Record<Role, Permission[]> = {
  admin: ['view:dashboard', 'view:register-users', 'view:home'],
  client: ['view:home'],
}

/**
 * Función auxiliar para verificar si un rol tiene un permiso específico.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return RBAC_POLICIES[role]?.includes(permission) ?? false
}
