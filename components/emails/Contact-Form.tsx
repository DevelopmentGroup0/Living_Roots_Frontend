'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function ContactForm() {
  const [text, setText] = useState('')

  const handleSend = async (type: 'sugerencia' | 'testimonio') => {
    if (!text.trim()) return alert('Escribe un mensaje primero')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          type: type, // 'sugerencia' o 'testimonio'
        }),
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (response.ok) {
        alert('¡Enviado con éxito!')
        setText('')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error)
    }
  }

  return (
    <div className='flex flex-col gap-3 p-4 max-w-md'>
      <h3 className='text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2'>
        <MessageCircle className='text-amber-700' /> Saberes Compartidos
      </h3>
      <textarea
        className='w-full p-5 border border-stone-200 rounded-3xl bg-white/80 focus:ring-2 focus:ring-emerald-800 outline-none text-sm'
        placeholder='Escribe tu sugerencia o testimonio aquí...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className='flex gap-2'>
        {/* Botón para enviar Sugerencias */}
        <button
          type='button'
          className='mt-3 bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow-md'
          onClick={() => handleSend('sugerencia')}
        >
          Enviar Sugerencia
        </button>

        {/* Botón para enviar Testimonios */}
        <button
          type='button'
          className='mt-3 bg-blue-800 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-md'
          onClick={() => handleSend('testimonio')}
        >
          Enviar Testimonio
        </button>
      </div>
    </div>
  )
}
