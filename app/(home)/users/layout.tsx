import { DashboardNav } from '@/components/dashboard/DashboardNav'

// Layout compartido de la sección /users: las pestañas (dashboardItems) viven
// aquí y cada page.tsx solo renderiza su contenido.
const dashboardItems = [
  {
    href: '/users',
    label: 'Gestión de usuarios',
  },
  {
    href: '/users/register',
    label: 'Crear usuario',
  },
]

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex-1 overflow-auto p-6 transition-all duration-300'>
      <div className='max-w-7xl mx-auto'>
        <DashboardNav dashboardItems={dashboardItems} />
        {children}
      </div>
    </main>
  )
}
