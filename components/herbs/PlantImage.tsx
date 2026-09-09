/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import Image from 'next/image'

export function PlantImage({ src, alt }: { src?: string | null; alt: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error',
  )

  return (
    <div className='relative aspect-square w-full overflow-hidden rounded-lg bg-[#E8EFE6]'>
      {status === 'loading' && (
        <div className='absolute inset-0 animate-pulse bg-[#DCE5D8]' />
      )}
      {status === 'error' ? (
        <Image
          src='/plant-placeholder.svg'
          alt='Imagen no disponible'
          fill
          className='object-contain p-6 opacity-70'
        />
      ) : (
        <img
          src={src || '/plant-placeholder.svg'}
          alt={alt}
          className={`object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          
        />
      )}
    </div>
  )
}
