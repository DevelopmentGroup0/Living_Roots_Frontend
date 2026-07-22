'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import {
  getPermissionForPath,
  hasPermission,
  type Role,
} from './helpers/has-permission'

interface HasPermissionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HasPermission({
  children,
  fallback = null,
}: HasPermissionProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // 1. Obtener el permiso requerido para la ruta actual mediante tu helper
  const requiredPermission = getPermissionForPath(pathname)

  // 2. Si la ruta actual no está mapeada en ROUTE_PERMISSIONS, es pública.
  // Permitimos renderizar libremente (ej: la ruta '/stories')
  if (!requiredPermission) return <>{children}</>

  // 3. Mientras la sesión está cargando, no renderizamos nada para evitar parpadeos visuales
  if (status === 'loading') return null

  // 4. Extraer el rol de la sesión de Next Auth
  const userRole = session?.user?.role as Role

  // 5. Validar si el rol tiene acceso al permiso de la ruta
  if (userRole === 'client') {
    return <>{fallback}</>
  }

  // Si pasa todas las validaciones (es admin en /dashboard/stories), se muestra el botón
  return <>{children}</>
}
