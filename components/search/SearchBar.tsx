/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 1. Estado local para que el input sea fluido
  const [text, setText] = useState(searchParams.get('query')?.toString() || '')

  // 2. Valor que solo cambia después de 400ms de inactividad
  const debouncedSearch = useDebounce(text, 400)

  useEffect(() => {
    // Si el valor ya coincide con la URL no hay nada que hacer. Sin esta
    // guarda, el efecto se ejecutaba al montar (el Navbar vive en el layout de
    // todas las páginas) y mandaba a "/" al recargar cualquier otra ruta.
    if (debouncedSearch === (searchParams.get('query') ?? '')) return

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
    <div role='search' className='relative flex w-full items-center'>
      <Search
        aria-hidden='true'
        className='pointer-events-none absolute left-3 h-4 w-4 text-gray-400'
      />
      <Input
        type='search'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Buscar planta medicinal...'
        aria-label='Buscar planta medicinal'
        enterKeyHint='search'
        className='h-10 w-full rounded-full pl-9 text-base md:text-sm'
      />
    </div>
  )
}
