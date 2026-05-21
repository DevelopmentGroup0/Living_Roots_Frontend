import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import {
  hasPermission,
  getPermissionForPath, // Usamos la nueva función helper
  Role,
} from '@/components/auth/helpers/has-permission'

const PUBLIC_ROUTES = ['/auth/login']

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const currentPath = req.nextUrl.pathname

    // Intentamos obtener el permiso necesario para la ruta actual o subruta
    const requiredPermission = getPermissionForPath(currentPath)

    if (requiredPermission) {
      const userRole = (token?.role as Role) || 'GUEST'

      if (!hasPermission(userRole, requiredPermission)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const currentPath = req.nextUrl.pathname

        // Si es ruta pública, permitimos siempre
        if (PUBLIC_ROUTES.includes(currentPath)) return true

        // Si es cualquier otra cosa, validamos que exista el token
        return !!token?.accessToken
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  },
)

// MATCHER: Protege todo EXCEPTO rutas públicas, assets y api interna
export const config = {
  matcher: ['/dashboard/:path*', '/auth/register', '/herb/:path*'],
}
