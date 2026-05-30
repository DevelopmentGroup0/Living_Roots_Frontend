// 1. Definir los roles del sistema como tipos estrictos
export type Role = 'admin' | 'client'

// 2. Definir las acciones o vistas permitidas (Permisos)
export type Permission =
  | 'view:dashboard'
  | 'view:register-users'
  | 'view:home'
  | 'view:details-herbs'

// 3. Centralizar la matriz de accesos (Roles -> Permisos)
export const RBAC_POLICIES: Record<Role, Permission[]> = {
  admin: [
    'view:dashboard',
    'view:register-users',
    'view:home',
    'view:details-herbs',
  ],
  client: ['view:home', 'view:details-herbs'],
}

// Función auxiliar para verificar si un rol tiene un permiso específico.
export function hasPermission(role: Role, permission: Permission): boolean {
  return RBAC_POLICIES[role]?.includes(permission) ?? false
}

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  '/dashboard': 'view:dashboard',
  '/auth/register': 'view:register-users',
  '/herb': 'view:details-herbs',
}

// En tu archivo de helpers (donde definiste hasPermission)
export function getPermissionForPath(pathname: string): Permission | undefined {
  // 1. Coincidencia exacta
  if (ROUTE_PERMISSIONS[pathname]) return ROUTE_PERMISSIONS[pathname]

  // 2. Coincidencia de prefijo para rutas dinámicas
  // Buscamos si la ruta actual empieza con alguna de las rutas definidas
  const routeKey = Object.keys(ROUTE_PERMISSIONS).find(
    (key) => pathname.startsWith(key) && key !== '/',
  )
  console.log(
    'Checking permissions for path:',
    pathname,
    'matched route:',
    routeKey,
  )
  return routeKey ? ROUTE_PERMISSIONS[routeKey] : undefined
}
