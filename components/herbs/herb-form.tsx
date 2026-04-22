'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Leaf, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client' // Ajusta la ruta
// Importaciones de UI (Shadcn)
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
      await apiClient.post('/herbs/', data, session?.accessToken)

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error al guardar:', error)
      setSubmitStatus('error')
    }
  }

  return (
    <Card className='w-full max-w-lg border-2 border-primary/20 shadow-lg'>
      <CardHeader className='space-y-1 pb-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
            <Leaf className='h-6 w-6 text-primary' />
          </div>
          <div>
            <CardTitle className='text-2xl font-bold'>
              Registrar Planta
            </CardTitle>
            <CardDescription>
              Agrega una nueva hierba a tu herbario
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* Nombre */}
          <div className='space-y-2'>
            <Label htmlFor='nombre'>Nombre de la planta</Label>
            <Input
              id='nombre'
              placeholder='Ej: Manzanilla...'
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className='space-y-2'>
            <Label htmlFor='descripcion'>Descripción</Label>
            <Textarea
              id='descripcion'
              placeholder='Propiedades y beneficios...'
              {...register('description')}
              className={`min-h-24 ${errors.description ? 'border-destructive' : ''}`}
            />
            {errors.description && (
              <p className='text-sm text-destructive'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className='space-y-2'>
            <Label htmlFor='usageMethod'>
              Liste los síntomas separados con comas
            </Label>
            <Textarea
              id='usageMethod'
              placeholder='Síntomas...'
              {...register('usageMethod')}
              className={`min-h-24 ${errors.usageMethod ? 'border-destructive' : ''}`}
            />
            {errors.usageMethod && (
              <p className='text-sm text-destructive'>
                {errors.usageMethod.message}
              </p>
            )}
          </div>

          {/* URL Imagen */}
          <div className='space-y-2'>
            <Label htmlFor='urlImagen'>URL de la imagen</Label>
            <Input
              id='urlImagen'
              {...register('img')}
              className={errors.img ? 'border-destructive' : ''}
            />
            {errors.img && (
              <p className='text-sm text-destructive'>{errors.img.message}</p>
            )}
          </div>

          {/* Mensajes de Estado */}
          {submitStatus === 'success' && (
            <div className='p-3 text-sm rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium'>
              ¡Planta registrada con éxito!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className='p-3 text-sm rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-medium'>
              Error al conectar con el servidor.
            </div>
          )}

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full gap-2'
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
