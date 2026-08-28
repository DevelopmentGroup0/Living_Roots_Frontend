'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

type SessionTimeoutModalProps = {
  open?: boolean
  initialSeconds?: number
  onContinue?: () => void
  onLogout?: () => void
}

/**
 * Tipografía: este componente busca las variables CSS `--font-display`
 * (una serif con carácter, p. ej. Fraunces) y `--font-body` (p. ej. Inter).
 * Si tu layout raíz ya las define vía next/font, el modal las hereda solo;
 * si no, cae en una pila serif/sans de sistema sin romper el diseño.
 *
 * Ejemplo en app/layout.tsx:
 *   import { Fraunces, Inter } from 'next/font/google'
 *   const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' })
 *   const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
 *   // <html className={`${fraunces.variable} ${inter.variable}`}>
 */
const FONT_DISPLAY = 'var(--font-display, Georgia, "Iowan Old Style", serif)'
const FONT_BODY = 'var(--font-body, ui-sans-serif, system-ui, sans-serif)'
const FONT_MONO =
  'var(--font-mono, ui-monospace, "SFMono-Regular", Menlo, monospace)'

const PALETTE = {
  ink: '#2E2417',
  parchment: '#F6ECD2',
  parchmentDeep: '#EFE0BC',
  parchmentEdge: '#D8C48F',
  forest: '#0E3321',
  forestLight: '#1F5138',
  bloom: '#A6487E',
  bloomDeep: '#7C3564',
  pond: '#1F4A4E',
  pondLight: '#4C8C86',
  amber: '#B5502A',
} as const

const RING_RADIUS = 42
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function interpolateColor(from: string, to: string, t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  const f = parseInt(from.slice(1), 16)
  const s = parseInt(to.slice(1), 16)
  const fr = (f >> 16) & 255
  const fg = (f >> 8) & 255
  const fb = f & 255
  const sr = (s >> 16) & 255
  const sg = (s >> 8) & 255
  const sb = s & 255
  const r = Math.round(fr + (sr - fr) * clamped)
  const g = Math.round(fg + (sg - fg) * clamped)
  const b = Math.round(fb + (sb - fb) * clamped)
  return `rgb(${r}, ${g}, ${b})`
}

/** Corona de equinácea (coneflower): pétalos generados radialmente. */
function Coneflower({ className }: { className?: string }) {
  const petals = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <svg viewBox='-40 -40 80 80' className={className} aria-hidden='true'>
      {petals.map((angle) => (
        <path
          key={angle}
          d='M0,-4 C4,-14 4,-26 0,-34 C-4,-26 -4,-14 0,-4 Z'
          fill={PALETTE.bloom}
          opacity={0.92}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r='7' fill={PALETTE.bloomDeep} />
      <circle
        r='7'
        fill='none'
        stroke={PALETTE.ink}
        strokeOpacity='0.15'
        strokeWidth='0.6'
      />
    </svg>
  )
}

/** Fronda de helecho: hojuelas alternadas a lo largo de un tallo curvo. */
function FernFrond({ className }: { className?: string }) {
  const leaflets = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg viewBox='0 0 60 140' className={className} aria-hidden='true'>
      <path
        d='M30,138 C28,100 26,60 30,4'
        fill='none'
        stroke={PALETTE.forestLight}
        strokeWidth='2'
        strokeLinecap='round'
      />
      {leaflets.map((i) => {
        const t = i / (leaflets.length - 1)
        const y = 130 - t * 120
        const len = 20 - t * 14
        const side = i % 2 === 0 ? 1 : -1
        return (
          <path
            key={i}
            d={`M30,${y} Q${30 + side * len * 0.6},${y - len * 0.3} ${30 + side * len},${y - len * 0.6}`}
            fill='none'
            stroke={PALETTE.forest}
            strokeWidth='1.6'
            strokeLinecap='round'
          />
        )
      })}
    </svg>
  )
}

/** Ramillete de milenrama (yarrow): pequeños racimos de flores blancas. */
function YarrowSprig({ className }: { className?: string }) {
  const clusters = [
    { x: 4, y: 12, s: 1 },
    { x: 18, y: -1, s: 0.85 },
    { x: -9, y: -5, s: 0.7 },
    { x: 3, y: -18, s: 0.6 },
  ]
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg viewBox='-30 -36 70 84' className={className} aria-hidden='true'>
      <path
        d='M0,40 C2,10 0,-10 4,-28'
        fill='none'
        stroke={PALETTE.forestLight}
        strokeWidth='1.6'
        strokeLinecap='round'
      />
      {clusters.map((c, ci) => (
        <g key={ci} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
          {petals.map((angle) => (
            <ellipse
              key={angle}
              cx='0'
              cy='-4'
              rx='2.1'
              ry='3'
              fill='#FBF6E8'
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r='1.4' fill={PALETTE.amber} />
        </g>
      ))}
    </svg>
  )
}

/** Franja de estanque al pie del pergamino: reflejos y hojas de nenúfar. */
function PondBand({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 400 44'
      preserveAspectRatio='none'
      className={className}
      aria-hidden='true'
    >
      <rect width='400' height='44' fill={PALETTE.pond} />
      <path
        d='M0,16 Q20,6 40,16 T80,16 T120,16 T160,16 T200,16 T240,16 T280,16 T320,16 T360,16 T400,16'
        fill='none'
        stroke={PALETTE.pondLight}
        strokeWidth='1.4'
        opacity='0.55'
      />
      <path
        d='M0,27 Q20,19 40,27 T80,27 T120,27 T160,27 T200,27 T240,27 T280,27 T320,27 T360,27 T400,27'
        fill='none'
        stroke={PALETTE.pondLight}
        strokeWidth='1'
        opacity='0.35'
      />
      <ellipse
        cx='66'
        cy='33'
        rx='14'
        ry='4'
        fill={PALETTE.forestLight}
        opacity='0.55'
      />
      <ellipse
        cx='226'
        cy='36'
        rx='10'
        ry='3'
        fill={PALETTE.forestLight}
        opacity='0.5'
      />
      <ellipse
        cx='332'
        cy='32'
        rx='12'
        ry='3.5'
        fill={PALETTE.forestLight}
        opacity='0.5'
      />
    </svg>
  )
}

/**
 * Modal presentacional para avisar de un cierre de sesión por inactividad.
 * Estilo manuscrito botánico (pergamino + flores + estanque) a juego con el
 * tema verde (#0E3321) del LoginForm. No se cierra al hacer clic afuera ni
 * con Escape a propósito: el cierre de sesión debe ser una acción explícita.
 * Conecta `onContinue` y `onLogout` con la lógica de autenticación de tu app
 * (ver SessionManager).
 */
export function SessionTimeoutModal({
  open = true,
  initialSeconds = 60,
  onContinue,
  onLogout,
}: SessionTimeoutModalProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initialSecondsRef = useRef(initialSeconds)
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const logoutButtonRef = useRef<HTMLButtonElement>(null)

  // Reinicia el contador cada vez que el modal se abre (o si cambia el total).
  // El componente original solo reaccionaba a cambios de `initialSeconds`,
  // así que si se reabría con el mismo valor el contador no se reiniciaba.
  useEffect(() => {
    if (open) {
      initialSecondsRef.current = initialSeconds
      setSeconds(initialSeconds)
    }
  }, [open, initialSeconds])

  useEffect(() => {
    if (!open || seconds <= 0) return

    intervalRef.current = setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [open, seconds])

  // Foco inicial en "Continuar sesión" al abrir, para navegación por teclado.
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => continueButtonRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  if (!open) return null

  const progress =
    initialSecondsRef.current > 0 ? seconds / initialSecondsRef.current : 0
  const ringColor = interpolateColor(
    PALETTE.forest,
    PALETTE.amber,
    1 - progress,
  )
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress)
  const isUrgent = progress <= 0.25

  // Atrapa el foco entre los dos botones mientras el aviso está abierto.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return
    const first = logoutButtonRef.current
    const last = continueButtonRef.current
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#0E3321]/55 p-4 backdrop-blur-sm'
      role='presentation'
    >
      <section
        aria-describedby='session-timeout-description'
        aria-labelledby='session-timeout-title'
        aria-modal='true'
        role='dialog'
        onKeyDown={handleKeyDown}
        className='relative w-full max-w-md'
      >
        {/* Tarjeta de pergamino */}
        <div
          className='relative overflow-hidden rounded-[28px] border border-[#D8C48F] shadow-2xl'
          style={{
            background: `linear-gradient(155deg, ${PALETTE.parchment} 0%, ${PALETTE.parchmentDeep} 100%)`,
          }}
        >
          {/* Textura de grano de papel */}
          <svg
            className='pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply'
            aria-hidden='true'
          >
            <filter id='session-paper-grain'>
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0.85'
                numOctaves='2'
                stitchTiles='stitch'
                result='noise'
              />
              <feColorMatrix
                in='noise'
                type='matrix'
                values='0 0 0 0 0.18  0 0 0 0 0.14  0 0 0 0 0.09  0 0 0 0.06 0'
              />
            </filter>
            <rect
              width='100%'
              height='100%'
              filter='url(#session-paper-grain)'
            />
          </svg>
          {/* Viñeta interior sutil para dar profundidad al papel */}
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(46,36,23,0.08), inset 0 0 40px rgba(46,36,23,0.12)',
            }}
          />

          <div className='relative px-6 pb-0 pt-8 sm:px-9 sm:pt-9'>
            <p
              className='text-center text-[11px] font-semibold uppercase tracking-[0.22em]'
              style={{ color: PALETTE.forest, fontFamily: FONT_BODY }}
            >
              Sesión en reposo
            </p>
            <h2
              id='session-timeout-title'
              className='mt-2 text-center text-[26px] font-semibold tracking-tight'
              style={{ color: PALETTE.ink, fontFamily: FONT_DISPLAY }}
            >
              ¿Sigues ahí?
            </h2>
            <p
              id='session-timeout-description'
              className='mx-auto mt-3 max-w-[34ch] text-center text-sm leading-6'
              style={{
                color: PALETTE.ink,
                opacity: 0.75,
                fontFamily: FONT_BODY,
              }}
            >
              Tu sesión entrará en reposo por inactividad. Continúa para
              mantenerla activa.
            </p>

            {/* Sello con la cuenta regresiva */}
            <div className='mt-6 flex flex-col items-center gap-2'>
              <div className='relative flex h-24 w-24 items-center justify-center'>
                <svg viewBox='0 0 96 96' className='h-24 w-24 -rotate-90'>
                  <circle
                    cx='48'
                    cy='48'
                    r={RING_RADIUS}
                    fill='none'
                    stroke={PALETTE.parchmentEdge}
                    strokeWidth='6'
                  />
                  <circle
                    cx='48'
                    cy='48'
                    r={RING_RADIUS}
                    fill='none'
                    stroke={ringColor}
                    strokeWidth='6'
                    strokeLinecap='round'
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    className={`transition-[stroke-dashoffset,stroke] duration-1000 ease-linear ${
                      isUrgent ? 'motion-safe:animate-pulse' : ''
                    }`}
                  />
                </svg>
                <span
                  className='absolute text-xl font-semibold tabular-nums'
                  style={{ color: PALETTE.ink, fontFamily: FONT_MONO }}
                  aria-live='polite'
                >
                  {String(Math.floor(seconds / 60)).padStart(2, '0')}:
                  {String(seconds % 60).padStart(2, '0')}
                </span>
              </div>
              <p
                className='text-[11px] uppercase tracking-[0.16em]'
                style={{
                  color: PALETTE.ink,
                  opacity: 0.55,
                  fontFamily: FONT_BODY,
                }}
              >
                Cierre automático
              </p>
            </div>

            <div className='mt-7 flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-center sm:pb-9'>
              <button
                ref={logoutButtonRef}
                type='button'
                onClick={onLogout}
                className='inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#0E3321]/5 focus-visible:outline-2 focus-visible:outline-offset-2'
                style={{
                  borderColor: PALETTE.forest,
                  color: PALETTE.forest,
                  outlineColor: PALETTE.forest,
                  fontFamily: FONT_BODY,
                }}
              >
                Cerrar sesión
              </button>
              <button
                ref={continueButtonRef}
                type='button'
                onClick={onContinue}
                className='min-h-11 rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2'
                style={{
                  backgroundColor: PALETTE.forest,
                  color: PALETTE.parchment,
                  outlineColor: PALETTE.forest,
                  fontFamily: FONT_BODY,
                }}
              >
                Continuar sesión
              </button>
            </div>
          </div>

          {/* Franja de estanque al pie del pergamino */}
          <PondBand className='relative block h-9 w-full sm:h-11' />
        </div>

        {/* Ramillete que se asoma por la esquina superior izquierda */}
        <FernFrond className='pointer-events-none absolute -left-5 -top-12 h-32 w-16 sm:-left-8 sm:-top-14 sm:h-36 sm:w-20' />
        <Coneflower className='pointer-events-none absolute -left-3 -top-9 h-14 w-14 -rotate-[18deg] sm:-left-5 sm:-top-10 sm:h-16 sm:w-16' />

        {/* Ramita que crece desde la esquina inferior derecha */}
        <YarrowSprig className='pointer-events-none absolute -bottom-8 -right-4 h-20 w-16 rotate-[8deg] sm:-bottom-9 sm:-right-6' />
      </section>
    </div>
  )
}

export default SessionTimeoutModal
