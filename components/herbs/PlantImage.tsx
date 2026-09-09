/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import Image from 'next/image'

export function PlantImage({ src, alt }: { src?: string | null; alt: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    src ? 'loading' : 'error',
  )

  return (
    <>
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
          src={src as string}
          alt={alt}
          className={`object-cover transition-opacity duration-300 ${status === 'loaded' ? 'w-full h-full object-cover' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </>
  )
}
