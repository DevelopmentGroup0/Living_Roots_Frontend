export interface HerbTreatment {
  symptomId: string
  name: string
  description?: string | null
  partsplant: string
  prepare: string
  apply?: string | null
  // GET /herbs devuelve `category` y GET /herbs/:id devuelve `categories`
  // (mismo dato). Usar getTreatmentCategories() para leerlo.
  category?: string[]
  categories?: string[]
}

export interface Plant {
  herb_id: string
  name: string
  description: string
  img: string
  important?: string
  cultivator?: string
  symptoms: HerbTreatment[]
}

