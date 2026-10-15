import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import {
  hasPermission,
  getPermissionForPath,
  Role,
} from '@/components/auth/helpers/has-permission'
import { authOptions } from './app/api/auth/[...nextauth]/route'
import { isPublicPath } from './config/navigation'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(
    'pathname que estoy extrayendo de la request (Proxy Current Path)',
    pathname,
  )
  const session = await getServerSession(authOptions)

  // Permitir rutas públicas (sin autenticación requerida)
  if (isPublicPath(pathname)) return NextResponse.next()

  // Si no hay sesión redirigir a login
  if (!session?.user || session.error) {
    const url = new URL('/auth/login', request.nextUrl)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Validar permisos RBAC para rutas protegidas
  const requiredPermission = getPermissionForPath(pathname)

  if (requiredPermission) {
    const userRole = session.user.role as Role

    if (!hasPermission(userRole, requiredPermission)) {
      return NextResponse.redirect(new URL('/unauthorized', request.nextUrl))
    }
  }

  console.log('requiredPermission', requiredPermission)

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Protege TODO excepto:
     * - api interna next
     * - static files
     * - favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.+\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
}
