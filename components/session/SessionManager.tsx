'use client'

import { useSession, signOut } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SessionTimeoutModal } from './SessionTimeoutModal'

export default function SessionManager({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  const [showWarning, setShowWarning] = useState(false)

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const INACTIVITY_LIMIT = 10 * 60 * 1000
  const LOGOUT_COUNTDOWN = 5 * 60 * 1000

  // Limpia todos los temporizadores.
  const clearTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }
  }, [])

  // Inicia el temporizador de inactividad.
  const startInactivityTimer = useCallback(() => {
    if (status !== 'authenticated') return

    // Limpiamos solamente el timer de inactividad.
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(() => {
      console.log('⚠️ Inactividad detectada')
      setShowWarning(true)
      console.log('⏱️ Iniciando countdown de logout')
      warningTimerRef.current = setTimeout(() => {
        console.log('🚪 Cerrando sesión por inactividad')
        signOut({
          callbackUrl: '/login',
        })
      }, LOGOUT_COUNTDOWN)
    }, INACTIVITY_LIMIT)
  }, [INACTIVITY_LIMIT, LOGOUT_COUNTDOWN, status])

  // Eventos de actividad del usuario.
  useEffect(() => {
    if (status !== 'authenticated') return
    const events = ['mousemove', 'keydown', 'click', 'scroll']
    const handleActivity = () => {
      // Si el warning está visible, la actividad no reinicia el timer.
      if (showWarning) return

      startInactivityTimer()
    }

    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Iniciar timer al autenticarse.
    startInactivityTimer()

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [status, showWarning, startInactivityTimer])

  // Continuar sesión.
  const handleContinueSession = useCallback(() => {
    console.log('▶️ Continuando sesión')

    // Cancelamos el countdown de logout.
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }

    setShowWarning(false)

    // Volvemos a iniciar el timer de inactividad.
    startInactivityTimer()
  }, [startInactivityTimer])

  // Logout manual.
  const handleManualLogout = useCallback(() => {
    clearTimers()

    signOut({
      callbackUrl: '/login',
    })
  }, [clearTimers])

  // Errores del refresh del token.
  useEffect(() => {
    if (
      session?.error === 'RefreshAccessTokenError' ||
      session?.error === 'TokenExpiredError'
    ) {
      signOut({
        callbackUrl: '/login',
      })
    }
  }, [session])

  return (
    <>
      <SessionTimeoutModal
        open={showWarning}
        initialSeconds={LOGOUT_COUNTDOWN / 1000}
        onContinue={handleContinueSession}
        onLogout={handleManualLogout}
      />

      {children}
    </>
  )
}
