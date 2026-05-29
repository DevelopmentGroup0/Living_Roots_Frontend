import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

import {
  hasPermission,
  getPermissionForPath,
  Role,
} from '@/components/auth/helpers/has-permission'

const PUBLIC_ROUTES = ['/auth/login']

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const currentPath = req.nextUrl.pathname

    // Permitir rutas públicas
    if (PUBLIC_ROUTES.includes(currentPath)) {
      return NextResponse.next()
    }

    // Si no hay sesión -> login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Validar permisos RBAC
    const requiredPermission = getPermissionForPath(currentPath)

    if (requiredPermission) {
      const userRole = token.role as Role

      if (!hasPermission(userRole, requiredPermission)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }
    console.log('TOKEN', token)
    console.log('TOKEeeeeN', requiredPermission)

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },

    pages: {
      signIn: '/auth/login',
    },
  },
)

export const config = {
  matcher: [
    /*
     * Protege TODO excepto:
     * - api interna next
     * - static files
     * - favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
