'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogIn, LogOut, UserCircle, ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  client: 'Comunitario',
}

// Menú de usuario. Se abre con clic/toque y con teclado (antes dependía de
// :hover, por lo que en móvil no se podía llegar a "Cerrar sesión").
export function UserAvatarButton() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const role = session?.user?.role
  const label = isLoading
    ? 'Cargando...'
    : session
      ? (ROLE_LABELS[role ?? ''] ?? role)
      : 'Mi Cuenta'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        aria-label={`Menú de usuario${session?.user?.email ? `: ${session.user.email}` : ''}`}
        className='hover:bg-muted data-popup-open:bg-muted flex items-center gap-1 rounded-full p-1 pr-2 transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:gap-2.5 md:pr-3'
      >
        <span className='border-border bg-secondary text-secondary-foreground flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2'>
          <User className='h-5 w-5' />
        </span>
        <span className='text-foreground hidden text-sm leading-tight font-semibold md:inline'>
          {label}
        </span>
        <ChevronDown className='text-muted-foreground h-4 w-4' />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-60 max-w-[calc(100vw-1.5rem)] p-1.5'>
        {session ? (
          <>
            <div className='mb-1 px-2 py-2'>
              <p className='text-muted-foreground truncate text-xs italic'>
                {session.user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className='gap-3 px-3 py-2.5'
              render={<Link href='/profile' />}
            >
              <UserCircle className='text-muted-foreground' />
              <span>Mi Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant='destructive'
              className='gap-3 px-3 py-2.5'
              onClick={handleLogout}
            >
              <LogOut />
              <span className='font-medium'>Cerrar Sesión</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className='bg-primary text-primary-foreground justify-between px-4 py-2.5 font-bold focus:bg-primary/90'
              render={<Link href='/auth/login' />}
            >
              <span>Identificarse</span>
              <LogIn />
            </DropdownMenuItem>
            <p className='text-muted-foreground px-2 pt-2 text-center text-[10px]'>
              Accede para ver tus plantas favoritas
            </p>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
