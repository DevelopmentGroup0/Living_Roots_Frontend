'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  User,
  LogIn,
  Settings,
  LogOut,
  UserCircle,
  ChevronDown,
} from 'lucide-react'

export function UserAvatarButton() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  // Funciones de acción
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className='flex items-center gap-4'>
      <div className='group relative inline-block'>
        <button
          className='hover:bg-muted flex items-center gap-2.5 rounded-full p-1 pr-3 transition-colors duration-200 focus:outline-none'
          disabled={isLoading}
        >
          {/*Avatar*/}
          <div className='border-border group-hover:border-primary/50 relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 transition-colors'>
            {/* {isLoading ? (
              <div className='bg-muted flex h-full w-full items-center justify-center'>
                <Loader2 className='text-muted-foreground h-5 w-5 animate-spin' />
              </div>
            ) : session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'Avatar'}
                className='aspect-square h-full w-full object-cover'
              />
            ) : (
            )} */}
            <div className='bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center'>
              <User className='h-5 w-5' />
            </div>
          </div>

          {/* Info de usuario */}
          <div className='flex flex-col text-left'>
            <span className='text-foreground text-sm leading-tight font-semibold'>
              {isLoading
                ? 'Cargando...'
                : session
                  ? session.user?.name
                  : 'Mi Cuenta'}
            </span>
            <span className='text-muted-foreground text-[11px] tracking-wider uppercase'>
              {session ? 'Nombre de usuario' : ''}
            </span>
          </div>
          <ChevronDown className='text-muted-foreground group-hover:text-foreground h-4 w-4 transition-transform duration-200 group-hover:rotate-180' />
        </button>

        {/*DDL */}
        <div className='border-border bg-popover pointer-events-none absolute top-full right-0 z-50 w-60 origin-top-right scale-95 rounded-xl border p-1.5 opacity-0 shadow-xl transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100'>
          {session ? (
            // Vista con sesión
            <>
              <div className='border-border mb-1.5 border-b px-3 py-2.5'>
                <p className='text-foreground truncate text-sm font-semibold'>
                  {session.user?.name}
                </p>
                <p className='text-muted-foreground truncate text-xs italic'>
                  {session.user?.email}
                </p>
              </div>

              <Link
                href='#/profile'
                className='hover:bg-accent flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors'
              >
                <UserCircle className='text-muted-foreground h-4 w-4' />
                <span>Mi Perfil</span>
              </Link>

              <Link
                href='#/config'
                className='hover:bg-accent flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors'
              >
                <Settings className='text-muted-foreground h-4 w-4' />
                <span>Configuración</span>
              </Link>

              <button
                onClick={handleLogout}
                className='text-destructive hover:bg-destructive/10 mt-1.5 flex w-full items-center gap-3 rounded-lg border-t px-3 py-2 pt-2 text-sm'
              >
                <LogOut className='h-4 w-4' />
                <span className='font-medium'>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            // Vista sin sesión
            <div className='p-1'>
              <Link
                href='/auth/login' // Asegúrate de que esta ruta sea la de tu login
                className='bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-bold transition-all'
              >
                <span>Identificarse</span>
                <LogIn className='h-4 w-4' />
              </Link>
              <p className='text-muted-foreground px-2 pt-2 text-center text-[10px]'>
                Accede para ver tus películas favoritas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
