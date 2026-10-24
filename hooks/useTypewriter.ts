'use client'

import { useEffect, useRef, useState } from 'react'

const MIN_CHARS_PER_SECOND = 45
const MAX_CHARS_PER_SECOND = 400

/**
 * Revela `text` letra por letra.
 *
 * - Si `enabled` es false devuelve el texto completo de inmediato (p. ej. al
 *   abrir mensajes del historial).
 * - La velocidad se adapta al "atraso": si el backend envía el texto en
 *   bloques grandes, se acelera para no hacer esperar al usuario; si llega
 *   token a token, se mantiene un ritmo de escritura natural.
 * - Respeta `prefers-reduced-motion`.
 */
export function useTypewriter(text: string, enabled = true): string {
  const [length, setLength] = useState(enabled ? 0 : text.length)
  const lengthRef = useRef(length)
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  )

  const active = enabled && !reducedMotion

  useEffect(() => {
    if (!active) return

    let frame = 0
    let last = performance.now()
    let carry = 0

    const tick = (now: number) => {
      const total = text.length
      const current = lengthRef.current

      // Ya alcanzó el texto; el efecto se reinicia cuando `text` crece.
      if (current >= total) return

      const backlog = total - current
      const charsPerSecond = Math.min(
        MAX_CHARS_PER_SECOND,
        Math.max(MIN_CHARS_PER_SECOND, backlog * 2),
      )

      carry += ((now - last) / 1000) * charsPerSecond
      last = now

      const step = Math.floor(carry)
      if (step > 0) {
        carry -= step
        let next = Math.min(total, current + step)

        // Evita cortar un par sustituto (emojis) por la mitad.
        const code = text.charCodeAt(next - 1)
        if (next < total && code >= 0xd800 && code <= 0xdbff) next += 1

        lengthRef.current = next
        setLength(next)
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, active])

  return active ? text.slice(0, length) : text
}
