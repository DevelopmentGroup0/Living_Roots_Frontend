import Link from 'next/link'
import { Home, UserRoundPlus } from 'lucide-react'
import { hasPermission, Permission, Role } from './auth/helpers/has-permission'
import LeafLogo from './Logo'
import { Button } from './ui/button'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

// 1. Estructura de navegación declarativa con su respectivo permiso
interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission: Permission
  label: string
}

const navigationItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: LeafLogo,
    permission: 'view:dashboard',
    label: 'Dashboard',
  },
  {
    href: '/auth/register',
    icon: UserRoundPlus,
    permission: 'view:register-users',
    label: 'Registrar Usuario',
  },
  {
    href: '/',
    icon: Home,
    permission: 'view:home',
    label: 'Inicio',
  },
]

export async function Sidebar() {
  // 2. Extraemos la sesión en el servidor de forma segura
  const session = await getServerSession(authOptions)

  // 3. Si no hay sesión, asumimos un rol por defecto (ej. GUEST)
  const userRole: Role = session?.user?.role ?? 'GUEST'

  return (
    <aside className='w-16 h-screen bg-gray-900 border-r border-gray-700 flex flex-col items-center py-6 gap-8'>
      <nav className='flex flex-col gap-6'>
        {navigationItems.map((item) => {
          // 4. Validación RBAC centralizada antes de renderizar
          if (!hasPermission(userRole, item.permission)) {
            return null // No renderiza absolutamente nada en el HTML final enviado al cliente
          }

          const Icon = item.icon

          return (
            <Button
              key={item.href}
              variant='link'
              size='lg'
              className='text-gray-400 hover:text-white hover:bg-gray-800'
            >
              <Link href={item.href} title={item.label}>
                <Icon className='w-6 h-6' />{' '}
              </Link>
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
