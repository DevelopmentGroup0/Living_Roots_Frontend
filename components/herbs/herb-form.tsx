'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Leaf, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// Importamos el esquema y el tipo
import { herbSchema, HerbValues } from './validation-sh'
import { HerbService } from '@/services/herbs-service'

export function HerbForm() {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HerbValues>({
    resolver: zodResolver(herbSchema),
    defaultValues: {
      name: '',
      description: '',
      img: '',
      usageMethod: '',
    },
  })

  // ... dentro de tu componente
  const { data: session, status } = useSession()

  const onSubmit = async (data: HerbValues) => {
    console.log(data)
    console.log('🔍 Estado actual de la sesión:', { status, session })

    try {
      if (!session?.accessToken) {
        console.log('Debes iniciar sesión para realizar el pedido')
        return
      }
      await HerbService.post(data, session?.accessToken)

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error al guardar:', error)
      setSubmitStatus('error')
    }
  }

  return (
    // 1. Aplicamos tarjeta-ancestral y bordes curvos a la Card principal
    <Card className='w-full max-w-lg mx-auto border border-stone-300/50 shadow-2xl tarjeta-ancestral rounded-[2rem] overflow-hidden'>
      <CardHeader className='space-y-1 pb-6'>
        <div className='flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800/10'>
            <Leaf className='h-6 w-6 text-emerald-800' />
          </div>
          <div>
            <CardTitle className='text-2xl font-serif font-bold text-slate-800'>
              Registrar Planta
            </CardTitle>
            <CardDescription className="text-stone-600 font-sans italic text-xs">
              Agrega una nueva hierba a tu herbario
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* Nombre */}
          <div className='space-y-1.5'>
            <Label htmlFor='nombre' className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 ml-1">
              Nombre de la planta
            </Label>
            <Input
              id='nombre'
              placeholder='Ej: Manzanilla...'
              {...register('name')}
              // 2. Estilos verdes claro para los inputs
              className={`bg-[#DBE4D4] border-0 focus-visible:ring-2 focus-visible:ring-emerald-700 text-slate-800 placeholder:text-emerald-900/40 shadow-inner rounded-xl h-12 ${errors.name ? 'ring-2 ring-destructive' : ''}`}
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className='space-y-1.5'>
            <Label htmlFor='descripcion' className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 ml-1">
              Descripción
            </Label>
            <Textarea
              id='descripcion'
              placeholder='Propiedades y beneficios...'
              {...register('description')}
              className={`bg-[#DBE4D4] border-0 focus-visible:ring-2 focus-visible:ring-emerald-700 text-slate-800 placeholder:text-emerald-900/40 shadow-inner rounded-xl min-h-24 resize-none ${errors.description ? 'ring-2 ring-destructive' : ''}`}
            />
            {errors.description && (
              <p className='text-sm text-destructive'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Síntomas */}
          <div className='space-y-1.5'>
            <Label htmlFor='usageMethod' className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 ml-1">
              Liste los síntomas separados con comas
            </Label>
            <Textarea
              id='usageMethod'
              placeholder='Síntomas...'
              {...register('usageMethod')}
              className={`bg-[#DBE4D4] border-0 focus-visible:ring-2 focus-visible:ring-emerald-700 text-slate-800 placeholder:text-emerald-900/40 shadow-inner rounded-xl min-h-20 resize-none ${errors.usageMethod ? 'ring-2 ring-destructive' : ''}`}
            />
            {errors.usageMethod && (
              <p className='text-sm text-destructive'>
                {errors.usageMethod.message}
              </p>
            )}
          </div>

          {/* URL Imagen */}
          <div className='space-y-1.5'>
            <Label htmlFor='urlImagen' className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 ml-1">
              URL de la imagen
            </Label>
            <Input
              id='urlImagen'
              {...register('img')}
              className={`bg-[#DBE4D4] border-0 focus-visible:ring-2 focus-visible:ring-emerald-700 text-slate-800 placeholder:text-emerald-900/40 shadow-inner rounded-xl h-12 ${errors.img ? 'ring-2 ring-destructive' : ''}`}
            />
            {errors.img && (
              <p className='text-sm text-destructive'>{errors.img.message}</p>
            )}
          </div>

          {/* Mensajes de Estado */}
          {submitStatus === 'success' && (
            <div className='p-3 text-sm rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-medium'>
              ¡Planta registrada con éxito!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className='p-3 text-sm rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-medium'>
              Error al conectar con el servidor.
            </div>
          )}

          {/* 3. Botón con el color verde oscuro y esquinas redondeadas */}
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full gap-2 bg-[#0E422C] text-white hover:bg-emerald-900 rounded-full h-14 text-sm font-bold shadow-lg transition-all hover:scale-[1.02]'
          >
            {isSubmitting ? (
              <>
                Verificando... <Loader2 className='h-4 w-4 animate-spin' />
              </>
            ) : (
              <>
                <Leaf className='h-4 w-4' /> Registrar Planta
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}