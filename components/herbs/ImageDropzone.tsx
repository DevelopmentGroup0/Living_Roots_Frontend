'use client'

import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ImageIcon, X, UploadCloud } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ImageDropzoneProps {
  value: string
  onChange: (url: string) => void
  error?: string
}

export function ImageDropzone({ value, onChange, error }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Configuramos la mutación para subir la imagen al backend
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error uploading image')
      }

      return response.json()
    },

    // Cuando la subida es exitosa, actualizamos el estado con la URL devuelta por el API
    onSuccess: (data) => {
      onChange(data.url.secure_url)
    },

    onError: (error) => {
      console.error(error)
    },
  })

  // Función para procesar el archivo seleccionado o arrastrado
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return

    // Preview local
    const reader = new FileReader()

    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setPreview(result)
    }

    reader.readAsDataURL(file)

    // Upload al backend
    uploadMutation.mutate(file)
  }

  // Manejadores de eventos para drag & drop y cambio de URL
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]

    if (!file) return

    processFile(file)
  }

  // Permitir ingresar una URL directamente
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    setPreview(url)
  }

  // Limpiar la imagen seleccionada
  const handleClear = () => {
    setPreview(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className='space-y-3'>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
          isDragging
            ? 'border-green-500 bg-green-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50'
        }`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt='Preview'
              className='max-h-40 rounded-lg object-cover'
              onError={() => setPreview(null)}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='absolute top-2 right-2 h-6 w-6 bg-white/80 hover:bg-white'
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            >
              <X className='h-3 w-3' />
            </Button>
          </>
        ) : (
          <>
            <UploadCloud className='h-8 w-8 text-gray-400' />
            <p className='text-sm text-gray-500 text-center'>
              Arrastra una imagen aquí
              <br />
              <span className='text-xs text-gray-400'>
                o pega una URL abajo
              </span>
            </p>
          </>
        )}
        {/* Input file hidden */}
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            processFile(file)
          }}
        />
        {uploadMutation.isPending && (
          <p className='text-sm text-gray-500'>Subiendo imagen...</p>
        )}
      </div>

      {/* URL input como alternativa */}
      <div className='flex items-center gap-2'>
        <ImageIcon className='h-4 w-4 text-gray-400 shrink-0' />
        <Input
          placeholder='https://ejemplo.com/imagen.jpg'
          value={value.startsWith('http') ? value : ''}
          onChange={handleUrlChange}
          className={error ? 'border-red-300' : ''}
        />
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  )
}
