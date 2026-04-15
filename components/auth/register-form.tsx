'use client'

import { Mail, Lock, User, Loader2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { signIn } from 'next-auth/react'
// import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AuthField, AuthFieldConfig } from './auth-field'
import { AuthLayout } from './auth-layout'
import { PasswordToggle } from './password-toggle'
import { registerSchema, RegisterValues } from './validation-sh'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordStrength } from './password-strength'
import { authService } from '@/services/auth-service'
import { useRouter } from 'next/navigation'

// Step 1: Personal data fields
const PASSWORD_FIELD_IDS = new Set(['password', 'confirmPassword'])

function buildPersonalFields(
  passwordToggle: React.ReactNode,
): AuthFieldConfig[] {
  return [
    {
      id: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Steven',
      icon: <User className='h-4 w-4' />,
      autoComplete: 'given-name',
    },
    {
      id: 'lastName',
      label: 'Apellido',
      type: 'text',
      placeholder: 'Spielberg',
      icon: <User className='h-4 w-4' />,
      autoComplete: 'family-name',
    },
    {
      id: 'email',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'director@cinestudio.com',
      icon: <Mail className='h-4 w-4' />,
      autoComplete: 'email',
    },
    {
      id: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Mínimo 8 caracteres',
      icon: <Lock className='h-4 w-4' />,
      autoComplete: 'new-password',
      suffix: passwordToggle,
    },
    {
      id: 'confirmPassword',
      label: 'Confirmar contraseña',
      type: 'password',
      placeholder: 'Repite tu contraseña',
      icon: <Lock className='h-4 w-4' />,
      autoComplete: 'new-password',
      suffix: passwordToggle,
    },
  ]
}

// Main Form
export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const passwordToggleNode = useMemo(
    () => (
      <PasswordToggle
        visible={showPassword}
        onToggle={() => setShowPassword((prev) => !prev)}
      />
    ),
    [showPassword],
  )

  const personalFields = useMemo(() => {
    const fields = buildPersonalFields(passwordToggleNode)
    return fields.map((f) =>
      PASSWORD_FIELD_IDS.has(f.id)
        ? { ...f, type: showPassword ? 'text' : 'password' }
        : f,
    )
  }, [showPassword, passwordToggleNode])

  // Obtener el valor en tiempo real dentro de tu componente RegisterForm
  const passwordValue = watch('password')

  const onSubmit = async (
    data: RegisterValues,
    e?: React.BaseSyntheticEvent,
  ) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    try {
      const payload = {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        // terms: data.terms
      }
      // 1. Llamada a tu API en Render para crear el usuario
      console.log(
        '🚀 Payload listo para POST:',
        JSON.stringify(payload, null, 2),
      )
      await authService.register(payload)
      // toast.success("Cuenta creada con éxito. Iniciando sesión...");

      // 2. Login automático tras registro exitoso
      // Esto hace que NextAuth guarde la cookie y el token de Render
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        router.push('/auth/login') // Si falla el auto-login, al menos ya está registrado
      } else {
        console.log('¡Éxito! Redirigiendo...')
        router.push('/') // O la ruta de tu home
        router.refresh()
      }
    } catch (error) {
      // El error ya viene formateado desde nuestro apiClient
      console.log(error)
      // toast.error(error.message || "Error al registrarse");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title='Registrándote'
      subtitle='Crea tu cuenta y consulta tus plantas medicinales favoritas'
      footerText='¿Ya tienes una cuenta?'
      footerLinkText='Inicia sesión'
      footerLinkHref='/auth/login'
    >
      <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
        {/* Step content */}
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-3'>
            <AuthField
              field={personalFields[0]}
              {...register('name')}
              error={errors.name?.message}
            />
            <AuthField
              field={personalFields[1]}
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          <AuthField
            field={personalFields[2]}
            {...register('email')}
            error={errors.email?.message}
          />

          <AuthField
            field={personalFields[3]}
            {...register('password')}
            error={errors.password?.message}
          />

          {/* El componente de fuerza */}
          <PasswordStrength value={passwordValue} />

          <AuthField
            field={personalFields[4]}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>
        <div className='flex gap-3'>
          <Button
            type='submit'
            className='flex-1'
            disabled={!isValid && !isLoading}
          >
            {isLoading ? (
              <>
                Verificando credenciales...
                <Loader2 className='ml-2 h-4 w-4 animate-spin' />
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
