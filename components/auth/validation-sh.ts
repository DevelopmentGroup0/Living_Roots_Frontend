import * as z from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre es muy corto'),
    lastName: z.string().min(2, 'El apellido es muy corto'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
    phone: z.string().min(7, 'Teléfono inválido'),
    countrySelector: z.string().min(1, 'Selecciona un país'),
    language: z.string(),
    terms: z.literal(true, {
      message: 'Debes aceptar los términos',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // El error aparecerá en este campo
  })

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export type RegisterValues = z.infer<typeof registerSchema>
export type LoginValues = z.infer<typeof loginSchema>
