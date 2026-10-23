// Categorías de un tratamiento (tbl_treatment.tre_categories).
// Son un subconjunto del enum CulturalCategory del backend.
export const TREATMENT_CATEGORIES = [
  'THERAPEUTIC',
  'PREVENTIVE',
  'SPIRITUAL',
] as const

export type TreatmentCategory = (typeof TREATMENT_CATEGORIES)[number]

export const DEFAULT_TREATMENT_CATEGORIES: TreatmentCategory[] = ['THERAPEUTIC']

export const treatmentCategoryLabels: Record<TreatmentCategory, string> = {
  THERAPEUTIC: 'Terapéutico',
  PREVENTIVE: 'Preventivo',
  SPIRITUAL: 'Espiritual',
}

export const treatmentCategoryHints: Record<TreatmentCategory, string> = {
  THERAPEUTIC: 'Para aliviar o tratar un síntoma',
  PREVENTIVE: 'Para prevenir o mantener el bienestar',
  SPIRITUAL: 'Uso ritual, ceremonial o de armonización',
}

export const treatmentCategoryStyles: Record<TreatmentCategory, string> = {
  THERAPEUTIC: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PREVENTIVE: 'bg-sky-100 text-sky-800 border-sky-200',
  SPIRITUAL: 'bg-violet-100 text-violet-800 border-violet-200',
}

export function isTreatmentCategory(value: unknown): value is TreatmentCategory {
  return (
    typeof value === 'string' &&
    (TREATMENT_CATEGORIES as readonly string[]).includes(value)
  )
}

// El backend devuelve `category` en el listado (GET /herbs) y `categories` en
// el detalle (GET /herbs/:id). Este helper acepta ambas formas y solo conserva
// las categorías propias de un tratamiento.
export function getTreatmentCategories(treatment: {
  category?: readonly string[] | null
  categories?: readonly string[] | null
}): TreatmentCategory[] {
  const raw = treatment.categories ?? treatment.category ?? []
  return raw.filter(isTreatmentCategory)
}
