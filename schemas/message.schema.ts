import { z } from 'zod'

export const createMessageSchema = z.object({
  message: z
    .string()
    .min(100, 'Tu mensaje debe tener al menos 100 caracteres')
    .max(400, 'Máximo 400 caracteres'),
  type: z.enum(['recommendation', 'testimony']),
})

export type CreateMessageFormValues = z.infer<typeof createMessageSchema>
