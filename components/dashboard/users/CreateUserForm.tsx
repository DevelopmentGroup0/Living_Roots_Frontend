'use client'

import { Loader2, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { AuthField, type AuthFieldConfig } from '@/components/auth/auth-field'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateUser } from '@/hooks/useUsers'
import {
  CREATE_USER_ROLES,
  DEFAULT_PHONE_PREFIX,
  PHONE_PREFIXES,
  ROLE_LABELS,
  createUserSchema,
  toCreateUserPayload,
  type CreateUserValues,
} from '@/schemas/user.schema'
import { CreateUserError } from '@/services/users-service'

const FIELDS: Record<
  'name' | 'lastName' | 'email' | 'phoneNumber',
  AuthFieldConfig
> = {
  name: {
    id: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Steven',
    icon: <User className='h-4 w-4' />,
    autoComplete: 'off',
  },
  lastName: {
    id: 'lastName',
    label: 'Apellido',
    type: 'text',
    placeholder: 'Spielberg',
    icon: <User className='h-4 w-4' />,
    autoComplete: 'off',
  },
  email: {
    id: 'email',
    label: 'Correo electrónico',
    type: 'email',
    placeholder: 'comunitario@gmail.com',
    icon: <Mail className='h-4 w-4' />,
    autoComplete: 'off',
  },
  phoneNumber: {
    id: 'phoneNumber',
    label: 'Teléfono (opcional)',
    type: 'tel',
    placeholder: '3001234567',
    icon: <Phone className='h-4 w-4' />,
    autoComplete: 'off',
    required: false,
  },
}

const DEFAULT_VALUES: CreateUserValues = {
  name: '',
  lastName: '',
  email: '',
  role: 'client',
  phoneCode: DEFAULT_PHONE_PREFIX,
  phoneNumber: '',
}

// Formulario para que un administrador cree usuarios. No pide contraseña: el
// backend genera una temporal y la envía al correo registrado.
export function CreateUserForm() {
  const createUser = useCreateUser()

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = async (values: CreateUserValues) => {
    try {
      await createUser.mutateAsync(toCreateUserPayload(values))

      toast.success('Usuario creado', {
        description: `Se envió una contraseña temporal a ${values.email.trim()}.`,
      })
      reset(DEFAULT_VALUES)
    } catch (error) {
      if (error instanceof CreateUserError) {
        if (error.status === 409) {
          setError('email', { message: 'Ya existe un usuario con ese correo' })
          return
        }
        if (error.status === 400 && /phone/i.test(error.message)) {
          setError('phoneNumber', { message: 'Número de teléfono no válido' })
          return
        }
        toast.error(error.message)
        return
      }
      toast.error('No se pudo crear el usuario. Inténtalo de nuevo.')
    }
  }

  return (
    <div className='mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8'>
      <div className='mb-6'>
        <h1 className='text-foreground text-2xl font-bold'>Crear usuario</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Se generará una contraseña temporal y se enviará al correo
          registrado.
        </p>
      </div>

      <form
        className='flex flex-col gap-5'
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <AuthField
            field={FIELDS.name}
            {...register('name')}
            error={errors.name?.message}
          />
          <AuthField
            field={FIELDS.lastName}
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <AuthField
          field={FIELDS.email}
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Rol */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='role' className='text-foreground/80'>
            Rol
          </Label>
          <Controller
            control={control}
            name='role'
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger id='role' className='h-11 w-full pl-3'>
                  <ShieldCheck className='text-muted-foreground h-4 w-4' />
                  <SelectValue>
                    {(value: CreateUserValues['role']) => ROLE_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CREATE_USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role?.message && (
            <span className='text-destructive text-xs'>
              {errors.role.message}
            </span>
          )}
        </div>

        {/* Teléfono: extensión + número */}
        <div className='flex flex-col gap-2 sm:flex-row sm:items-start'>
          <div className='flex flex-col gap-2 sm:w-52 sm:shrink-0'>
            <Label htmlFor='phoneCode' className='text-foreground/80'>
              Extensión
            </Label>
            <Controller
              control={control}
              name='phoneCode'
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id='phoneCode' className='h-11 w-full pl-3'>
                    <SelectValue>
                      {(value: string) =>
                        PHONE_PREFIXES.find((p) => p.value === value)?.label ??
                        value
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE_PREFIXES.map((prefix) => (
                      <SelectItem key={prefix.value} value={prefix.value}>
                        {prefix.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className='flex-1'>
            <AuthField
              field={FIELDS.phoneNumber}
              inputMode='numeric'
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button
            type='button'
            variant='outline'
            disabled={createUser.isPending}
            onClick={() => reset(DEFAULT_VALUES)}
          >
            Limpiar
          </Button>
          <Button type='submit' disabled={!isValid || createUser.isPending}>
            {createUser.isPending ? (
              <>
                Creando usuario...
                <Loader2 className='ml-2 h-4 w-4 animate-spin' />
              </>
            ) : (
              'Crear usuario'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
