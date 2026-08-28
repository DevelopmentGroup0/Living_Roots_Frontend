'use client'

import { useSession, signOut } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
// Ajusta la ruta si SessionTimeoutModal vive en otra carpeta
// (p. ej. '@/components/session/SessionTimeoutModal').
import { SessionTimeoutModal } from './SessionTimeoutModal'

export default function SessionManager({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [showWarning, setShowWarning] = useState(false)

  // Referencias para limpiar los temporizadores
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  // Tiempos configurables (mientras las pruebas: 1 minuto + 1 minuto)
  const INACTIVITY_LIMIT = 1 * 60 * 1000 // tiempo de inactividad antes de mostrar el aviso
  const LOGOUT_COUNTDOWN = 1 * 60 * 1000 // cuenta regresiva del aviso antes de cerrar sesión

  // 1. Controlar la expiración del token enviada desde los callbacks
  useEffect(() => {
    if (
      session?.error === 'RefreshAccessTokenError' ||
      session?.error === 'TokenExpiredError'
    ) {
      signOut({ callbackUrl: '/login' })
    }
    if (session?.error === 'TokenExpiredError') {
      signOut({ callbackUrl: '/login' }) // Limpia cookies y redirige
    }
  }, [session])

  const clearTimers = useCallback(() => {
    clearTimeout(inactivityTimerRef.current)
    clearTimeout(warningTimerRef.current)
  }, [])

  // 2. Controlar la inactividad del usuario
  const resetTimers = useCallback(() => {
    // Mientras se muestra el aviso, ningún evento de actividad lo reinicia:
    // el usuario debe decidir explícitamente "Continuar" o "Cerrar sesión".
    if (showWarning || status !== 'authenticated') return

    clearTimers()

    inactivityTimerRef.current = setTimeout(() => {
      setShowWarning(true)

      // Si no hace nada tras mostrar el aviso, cerramos la sesión
      warningTimerRef.current = setTimeout(() => {
        signOut({ callbackUrl: '/login' })
      }, LOGOUT_COUNTDOWN)
    }, INACTIVITY_LIMIT)
  }, [showWarning, status, clearTimers])

  // Escuchar eventos de interacción del usuario. Este efecto también se
  // reencarga de reiniciar los contadores cuando showWarning vuelve a false
  // (resetTimers cambia de identidad y el efecto se vuelve a ejecutar).
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll']

    events.forEach((event) => {
      window.addEventListener(event, resetTimers)
    })

    // Iniciar contadores la primera vez (y cada vez que resetTimers cambia)
    resetTimers()

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers)
      })
      clearTimers()
    }
  }, [resetTimers, clearTimers])

  // Botón "Continuar sesión": cancela el cierre pendiente y oculta el aviso
  const handleContinueSession = useCallback(() => {
    clearTimers()
    setShowWarning(false)
  }, [clearTimers])

  // Botón "Cerrar sesión": cierre inmediato, sin esperar la cuenta regresiva
  const handleManualLogout = useCallback(() => {
    clearTimers()
    signOut({ callbackUrl: '/login' })
  }, [clearTimers])

  return (
    <>
      <SessionTimeoutModal
        open={showWarning}
        initialSeconds={LOGOUT_COUNTDOWN / 1000}
        onContinue={handleContinueSession}
        onLogout={handleManualLogout}
      />

      {/* Renderizamos el resto de la aplicación */}
      {children}
    </>
  )
}
