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

const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const imageFileSchema = z
  .any()
  .refine((file) => file instanceof File, {
    message: 'Debes seleccionar un archivo válido.',
  })
  .refine((file) => file?.size <= MAX_FILE_SIZE, {
    message: 'El tamaño máximo de la imagen es 3MB.',
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
    message: 'Solo se aceptan formatos de imagen permitidos (.jpg, .jpeg, .png, .webp).',
  })

export type EditPlantFormInput = z.input<typeof editPlantSchema>
export type EditPlantFormOutput = z.output<typeof editPlantSchema>
