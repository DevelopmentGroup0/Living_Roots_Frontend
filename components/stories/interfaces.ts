/**
 * Story Interfaces & Types
 * Tipado para relatos culturales (testimonios)
 */

export type StoryStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type CulturalCategory =
  | 'TRADITIONAL_MEDICINE'
  | 'ORAL_HISTORY'
  | 'RITUALS'
  | 'GASTRONOMY'
  | 'CRAFTS'
  | 'LANGUAGES'
  | 'OTHER'

/**
 * Story Response Model
 * Estructura retornada por la API
 */
export interface Story {
  story_id: string
  title: string
  body: string // texto plano
  status: StoryStatus
  category: CulturalCategory
  coverImage?: string
  readingTime?: number // minutos estimados de lectura
  authorId: string
  author?: StoryAuthor // relacionado, opcional
  tags: StoryTag[]
  publishedAt?: string // ISO 8601
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

/**
 * Author info en Story (mini profile)
 */
export interface StoryAuthor {
  user_id: string
  name: string
  lastName: string
  avatar?: string
  email: string
}

/**
 * Tag asociado a Story
 */
export interface StoryTag {
  storyId: string
  tagId: string
  tag: {
    tag_id: string
    name: string
  }
}

/**
 * Form Data para crear Story
 * Usado en CreateStoryDialog
 */
export interface CreateStoryFormValues {
  title: string
  body: string
  category: CulturalCategory
  tags?: string[]
  coverImage?: string
}

/**
 * Form Data para editar Story
 * Igual a Create pero parcial (PartialType)
 */
export type UpdateStoryFormValues = Partial<CreateStoryFormValues>

/**
 * Query Parameters para listar stories
 * Usado en StoriesList y MyStoriesTable
 */
export interface StoryFilterQuery {
  page?: number // default 1
  limit?: number // default 10, max 50
  category?: CulturalCategory
  status?: StoryStatus
  search?: string // búsqueda en título
}

/**
 * Respuesta paginada de API
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  lastPage: number
}

/**
 * Story para display en StoryCard (resumen)
 */
export interface StoryCardProps {
  story_id: string
  title: string
  excerpt: string // primeros 200 chars de body
  category: CulturalCategory
  authorName: string
  authorAvatar?: string
  readingTime?: number
  publishedAt: string // absolute time
  coverImage?: string
}

/**
 * Dialog Props comunes
 */
export interface DialogBaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
}

/**
 * Autocomplete tag item
 */
export interface TagSuggestion {
  tag_id: string
  name: string
}
