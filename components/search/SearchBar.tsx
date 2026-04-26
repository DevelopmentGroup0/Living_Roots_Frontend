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
  }, [debouncedSearch, router]) // Solo se ejecuta cuando cambia el valor debounced

  return (
    <div className='w-full max-w-2xl relative flex gap-5 items-center'>
      <Search className='left-4 w-5 h-5 text-gray-400 pointer-events-none' />
      <Input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Buscar planta medicinal...'
        className='border p-2 rounded-md w-full'
      />
    </div>
  )
}
