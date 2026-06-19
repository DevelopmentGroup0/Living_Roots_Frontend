/**
 * Story Schema - Validaciones con Zod
 * Validaciones comunes para Create y Update
 * Sincronizado con DTO del backend
 */

import { z } from 'zod'

/**
 * Normalizador de tags
 * Convierte a lowercase y reemplaza espacios por guiones
 */
const normalizeTag = (tag: string): string =>
  tag.toLowerCase().trim().replace(/\s+/g, '-')

/**
 * Validador de tags
 * Solo acepta: letras, números, guiones, acentos (español)
 */
const tagRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s-]+$/

/**
 * Schema para crear Story
 * RF-001: Crear Relato
 */
export const createStorySchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),

  body: z
    .string()
    .min(50, 'El contenido debe tener al menos 50 caracteres')
    .max(50000, 'El contenido no puede exceder 50000 caracteres')
    .trim(),

  category: z.enum(
    ['TRADITIONAL_MEDICINE', 'ORAL_HISTORY', 'RITUALS', 'GASTRONOMY', 'CRAFTS', 'LANGUAGES', 'OTHER'],
    {
      errorMap: () => ({ message: 'Selecciona una categoría válida' }),
    }
  ),

  tags: z
    .array(z.string())
    .max(10, 'Máximo 10 etiquetas permitidas')
    .refine(
      (tags) =>
        tags.every((tag) =>
          tagRegex.test(tag) && tag.length >= 2 && tag.length <= 50
        ),
      {
        message:
          'Las etiquetas solo admiten letras, números, espacios y guiones (2-50 caracteres)',
      }
    )
    .transform((tags) => tags.map(normalizeTag).filter((tag, i, arr) => arr.indexOf(tag) === i))
    .optional()
    .or(z.literal(undefined)),

  coverImage: z
    .string()
    .url('La URL de la imagen debe ser válida')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export type CreateStoryFormValues = z.infer<typeof createStorySchema>

/**
 * Schema para actualizar Story (PartialType)
 * RF-002: Editar Relato
 * Todos los campos son opcionales
 */
export const updateStorySchema = createStorySchema.partial()

export type UpdateStoryFormValues = z.infer<typeof updateStorySchema>

/**
 * Schema para Query de búsqueda
 * RF-004, RF-005: Listar y filtrar
 */
export const storyQuerySchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page debe ser >= 1')
    .optional()
    .default(1),

  limit: z
    .number()
    .int()
    .min(1, 'Limit debe ser >= 1')
    .max(50, 'Limit no puede exceder 50')
    .optional()
    .default(10),

  category: z
    .enum([
      'TRADITIONAL_MEDICINE',
      'ORAL_HISTORY',
      'RITUALS',
      'GASTRONOMY',
      'CRAFTS',
      'LANGUAGES',
      'OTHER',
    ])
    .optional(),

  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),

  search: z
    .string()
    .max(100, 'Búsqueda máximo 100 caracteres')
    .trim()
    .optional(),
})

export type StoryQueryFormValues = z.infer<typeof storyQuerySchema>

/**
 * Schema para cambiar estado
 * RF-003: Cambiar Estado del Relato
 */
export const changeStoryStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
})

export type ChangeStoryStatusValues = z.infer<typeof changeStoryStatusSchema>

/**
 * Labels amigables para categorías
 * Usado en selects y displays
 */
export const categoriesLabels: Record<string, string> = {
  TRADITIONAL_MEDICINE: '🌿 Medicina Tradicional',
  ORAL_HISTORY: '📖 Historia Oral',
  RITUALS: '🪶 Rituales y Ceremonias',
  GASTRONOMY: '🍲 Gastronomía',
  CRAFTS: '🧵 Artesanía y Oficios',
  LANGUAGES: '🗣️ Lenguas y Dialectos',
  OTHER: '✨ Otro',
}

/**
 * Labels amigables para estados
 */
export const statusLabels: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Archivado',
}

/**
 * Colores para badges de estado
 */
export const statusColors: Record<string, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
}
