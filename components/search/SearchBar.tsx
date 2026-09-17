/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/components/hooks/use-debounce'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 1. Estado local para que el input sea fluido
  const [text, setText] = useState(searchParams.get('query')?.toString() || '')
  const [isOpen, setIsOpen] = useState(false)

  // 2. Valor que solo cambia después de 400ms de inactividad
  const debouncedSearch = useDebounce(text, 400)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (debouncedSearch) {
      params.set('query', debouncedSearch)
    } else {
      params.delete('query')
    }

    // 3. Solo se navega (y se pide al servidor) cuando el debounce termina
    router.replace(`/?${params.toString()}`)
  }, [debouncedSearch, router])

  return (
    <div className='w-full md:w-2xl md:relative flex gap-5 items-center justify-end md:justify-start'>
      <div
        className={`relative flex items-center transition-all duration-300 ease-in-out ${
          isOpen ? 'w-full' : 'w-10 md:w-full'
        }`}
      >
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='absolute left-3 z-10 md:pointer-events-none focus:outline-none'
          aria-label='Buscar'
        >
          <Search className='w-5 h-5 text-gray-400' />
        </button>

        <Input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Buscar planta medicinal...'
          // En móvil, si no está abierto, ocultamos el texto y hacemos el fondo transparente/compacto
          className={`border p-2 rounded-md w-full transition-all duration-300 pl-10 ${
            isOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible md:opacity-100 md:visible'
          }`}
        />
      </div>
    </div>
  )
}
