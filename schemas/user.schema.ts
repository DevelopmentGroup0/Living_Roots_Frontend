import * as z from 'zod'

// Extensiones telefónicas disponibles en el formulario. `digits` es la
// cantidad de dígitos del número nacional (el backend valida el número
// completo con @IsPhoneNumber, en formato internacional +<ext><número>).
export const PHONE_PREFIXES = [
  { value: '+57', label: 'Colombia (+57)', digits: 10 },
  { value: '+1', label: 'EE. UU. / Canadá (+1)', digits: 10 },
  { value: '+52', label: 'México (+52)', digits: 10 },
  { value: '+593', label: 'Ecuador (+593)', digits: 9 },
  { value: '+51', label: 'Perú (+51)', digits: 9 },
  { value: '+58', label: 'Venezuela (+58)', digits: 10 },
  { value: '+34', label: 'España (+34)', digits: 9 },
] as const

export const DEFAULT_PHONE_PREFIX = '+57'

// Mismos valores que el enum UserRole del backend ('admin' | 'client').
export const CREATE_USER_ROLES = ['admin', 'client'] as const

export const ROLE_LABELS: Record<(typeof CREATE_USER_ROLES)[number], string> = {
  admin: 'Administrador',
  client: 'Comunitario',
}

const normalizePhone = (value: string) => value.replace(/[\s-]/g, '')

export const createUserSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre es muy corto').max(80),
    lastName: z.string().trim().min(2, 'El apellido es muy corto').max(80),
    email: z.string().trim().pipe(z.email('Email inválido')),
    role: z.enum(CREATE_USER_ROLES, { message: 'Selecciona un rol' }),
    phoneCode: z.string(),
    // Opcional: '' significa "sin teléfono".
    phoneNumber: z.string(),
  })
  .superRefine(({ phoneCode, phoneNumber }, ctx) => {
    const digits = normalizePhone(phoneNumber)
    if (!digits) return

    if (!/^\d+$/.test(digits)) {
      ctx.addIssue({
        code: 'custom',
        path: ['phoneNumber'],
        message: 'Solo números, sin signos ni letras',
      })
      return
    }

    const prefix = PHONE_PREFIXES.find((p) => p.value === phoneCode)
    if (prefix && digits.length !== prefix.digits) {
      ctx.addIssue({
        code: 'custom',
        path: ['phoneNumber'],
        message: `Debe tener ${prefix.digits} dígitos para ${prefix.value}`,
      })
    }
  })

export type CreateUserValues = z.infer<typeof createUserSchema>

// Lo que viaja al proxy /api/users (coincide con CreateUserDto del backend).
// No incluye contraseña: el backend genera una temporal y la envía por correo.
export interface CreateUserPayload {
  name: string
  lastName: string
  email: string
  role: (typeof CREATE_USER_ROLES)[number]
  phone?: string
}

export function toCreateUserPayload(values: CreateUserValues): CreateUserPayload {
  const digits = normalizePhone(values.phoneNumber)

  return {
    name: values.name.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    role: values.role,
    ...(digits && { phone: `${values.phoneCode}${digits}` }),
  }
}
