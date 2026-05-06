import { z } from 'zod'

export const createHerbSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  img: z
    .string()
    .url('Debe ser una URL de imagen válida')
    .or(z.string().min(1, 'La imagen es requerida')), // permite base64 si hay upload
  cultivator: z
    .string()
    .max(200, 'Máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  important: z
    .string()
    .max(300, 'Máximo 300 caracteres')
    .optional()
    .or(z.literal('')),
})

export type CreateHerbFormValues = z.infer<typeof createHerbSchema>

export const editPlantSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar 500 caracteres'),
})

export type EditPlantFormInput = z.input<typeof editPlantSchema>
export type EditPlantFormOutput = z.output<typeof editPlantSchema>
