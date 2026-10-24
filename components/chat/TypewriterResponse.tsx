'use client'

import { useState } from 'react'
import { MessageResponse } from '@/components/ai-elements/message'
import { useTypewriter } from '@/hooks/useTypewriter'

interface TypewriterResponseProps {
  text: string
  /**
   * true mientras esta respuesta se está generando en esta sesión.
   * Solo se evalúa al montar: los mensajes que ya existían (historial)
   * se muestran completos, sin animación.
   */
  live: boolean
}

export function TypewriterResponse({ text, live }: TypewriterResponseProps) {
  const [animate] = useState(live)
  const displayed = useTypewriter(text, animate)
  const isTyping = animate && displayed.length < text.length

  return (
    <MessageResponse isAnimating={live || isTyping}>{displayed}</MessageResponse>
  )
}
