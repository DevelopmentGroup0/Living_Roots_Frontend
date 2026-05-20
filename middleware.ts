import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import {
  hasPermission,
  ROUTE_PERMISSIONS,
  Role,
} from '@/components/auth/helpers/has-permission'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const currentPath = req.nextUrl.pathname

    // 1. Verificar si la ruta actual requiere un permiso específico
    const requiredPermission = ROUTE_PERMISSIONS[currentPath]

    if (requiredPermission) {
      // Si no hay token (no está autenticado), 'withAuth' lo mandará automáticamente al login.
      // Si hay token, validamos su rol contra la política RBAC
      const userRole = (token?.role as Role) || 'GUEST'

      if (!hasPermission(userRole, requiredPermission)) {
        // Redirección segura si no tiene los permisos requeridos
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // Este callback valida si el middleware debe ejecutarse.
      // Retornar 'true' hace que la función 'middleware' de arriba se ejecute siempre que el usuario tenga un JWT válido.
      authorized: ({ token }) => !!token,
    },
  },
)

// Configuración del Matcher: Define qué rutas activarán este middleware.
// Protegemos explícitamente el dashboard y cualquier subruta del mismo.
export const config = {
  matcher: ['/dashboard/:path*', '/auth/register'],
}
