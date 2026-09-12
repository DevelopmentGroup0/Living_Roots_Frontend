import { hasPermission, Permission, Role } from './auth/helpers/has-permission'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import SidebarClient from './session/Sidebar'

export interface NavItem {
  href: string
  icon: 'dashboard' | 'stories' | 'users' | 'home'
  permission: Permission
  label: string
}

const navigationItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: 'dashboard',
    permission: 'view:dashboard',
    label: 'Dashboard',
  },
  {
    href: '/stories',
    icon: 'stories',
    permission: 'view:home',
    label: 'Relatos',
  },
  {
    href: '/users',
    icon: 'users',
    permission: 'view:register-users',
    label: 'Gestión de usuarios',
  },
  {
    href: '/',
    icon: 'home',
    permission: 'view:home',
    label: 'Inicio',
  },
]

export async function Sidebar() {
  // 2. Extraemos la sesión en el servidor de forma segura
  const session = await getServerSession(authOptions)

  // 3. Si no hay sesión, asumimos un rol por defecto (ej. GUEST)
  const userRole: Role = session?.user?.role

  const authorizedItems = navigationItems.filter((item) =>
    hasPermission(userRole, item.permission),
  )
  console.log('authorizedItems', authorizedItems)
  return <SidebarClient navigationItems={authorizedItems} />
}
