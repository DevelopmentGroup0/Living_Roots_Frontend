import type { UserRole } from '@/interfaces/auth'

// Rutas públicas que NO requieren autenticación (Solo login, todo lo demás requiere token)
const PUBLIC_ROUTES = ['/auth/login', '/forbidden']


// Valores del enum Role del backend ('USER' | 'ADMIN'), derivados del tipo
// para no depender de los nombres de los miembros del enum.
export type RoleValue = `${UserRole}`

// Si el enum cambia, TypeScript marcará error aquí.
const ADMIN: RoleValue = 'admin'
const USER: RoleValue = 'client'


export function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}

function isRole(value?: string): value is RoleValue {
  return value === ADMIN || value === USER
}

function matches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// export function getNavForRole(role?: string): NavItem[] {
//   if (!isRole(role)) return []
//   return NAV_ITEMS.filter((item) => item.roles.includes(role))
// }

// export function canAccess(pathname: string, role?: string): boolean {
//   if (!isRole(role)) return false
//   const item = NAV_ITEMS.find((i) => matches(pathname, i.href))
//   return !!item && item.roles.includes(role)
// }

export function isActivePath(pathname: string, href: string) {
  return matches(pathname, href)
}