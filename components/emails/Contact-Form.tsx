'use client'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sparkles, MessageCircle, Send, CheckCircle2 } from 'lucide-react'
import {
  CreateMessageFormValues,
  createMessageSchema,
} from '@/schemas/message.schema'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '../ui/input-group'

// 1. Actualizamos los valores por defecto incluyendo el tipo
const defaultValues: CreateMessageFormValues = {
  message: '',
  type: 'recommendation',
}

export function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CreateMessageFormValues>({
    resolver: zodResolver(createMessageSchema),
    defaultValues,
  })

  const handleSubmit = async (values: CreateMessageFormValues) => {
    // Ya no necesitas validar manualmente si message tiene texto, Zod se encarga (.min(100))
    setIsLoading(true)

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values), // Enviamos todo el objeto validado por Zod directamente
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (response.ok) {
        alert('¡Enviado con éxito!')
        form.reset(defaultValues)
        setIsSubmitted(true) // Movido aquí adentro para que solo cambie si fue exitoso
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className='border-primary/20 bg-primary/5'>
        <CardContent className='p-8 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
            <CheckCircle2 className='h-8 w-8 text-primary' />
          </div>
          <h3 className='font-serif text-2xl font-semibold text-foreground mb-2'>
            ¡Gracias por tu mensaje!
          </h3>
          <p className='text-muted-foreground'>
            Tu experiencia es valiosa para nuestra comunidad. Nos pondremos en
            contacto contigo pronto.
          </p>
          <Button
            variant='outline'
            className='mt-6'
            onClick={() => setIsSubmitted(false)}
          >
            Enviar otro mensaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-border/50'>
      <CardHeader className='text-center pb-2'>
        <CardTitle className='font-serif text-2xl font-semibold text-foreground flex items-center justify-center gap-2'>
          <MessageCircle className='text-amber-700' /> Comparte tu experiencia
        </CardTitle>
        <CardDescription className='text-muted-foreground'>
          Tu voz fortalece nuestra comunidad y conocimientos
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6 pt-4'>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <FieldGroup>
            {/* 2. NUEVO: Controller para el RadioGroup del tipo de mensaje */}
            <div className='space-y-3'>
              <Label className='text-foreground'>Tipo de mensaje</Label>

              <Controller
                name='type'
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <RadioGroup
                      value={field.value} // Vinculado al estado de RHF
                      onValueChange={field.onChange} // Actualiza RHF al cambiar
                      className='grid grid-cols-1 sm:grid-cols-3 gap-3'
                    >
                      <Label
                        htmlFor='recommendation'
                        className='flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 cursor-pointer transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5'
                      >
                        <RadioGroupItem
                          value='recommendation'
                          id='recommendation'
                        />
                        <Sparkles className='h-4 w-4 text-green-900' />
                        <span className='text-sm text-green-900'>Recomendación</span>
                      </Label>
                      <Label
                        htmlFor='testimony'
                        className='flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 cursor-pointer transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5'
                      >
                        <RadioGroupItem value='testimony' id='testimony' />
                        <MessageCircle className='h-4 w-4 text-green-900' />
                        <span className='text-sm text-green-900'>Testimonio</span>
                      </Label>
                    </RadioGroup>

                    {fieldState.invalid && (
                      <p className='text-sm text-red-500 mt-1'>
                        {fieldState.error?.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className='space-y-2'>
              <Controller
                name='message'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor='form-create-message'
                      className='text-foreground'
                    >
                      Tu mensaje <span className='text-red-500'>*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id='form-create-message'
                        placeholder='Cuéntanos sobre tu experiencia...'
                        rows={6}
                        className='bg-input border-border focus:border-primary resize-none'
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align='block-end'>
                        <InputGroupText className='tabular-nums'>
                          {field.value.length}/400 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
              disabled={isLoading}
            >
              {isLoading ? (
                <span className='animate-pulse'>Enviando...</span>
              ) : (
                <>
                  <Send className='h-4 w-4 mr-2' />
                  Enviar mensaje
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
