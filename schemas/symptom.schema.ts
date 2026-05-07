import { z } from 'zod'

export const addSymptomSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del síntoma es requerido')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
  parts_plant: z
    .string()
    .min(2, 'Indica qué parte de la planta se usa')
    .max(100, 'Máximo 100 caracteres'),
  prepare: z
    .string()
    .min(5, 'Describe cómo se prepara')
    .max(300, 'Máximo 300 caracteres'),
  apply: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
})

export type AddSymptomFormValues = z.infer<typeof addSymptomSchema>