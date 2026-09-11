export interface HerbTreatment {
  symptomId: string
  name: string
  description?: string | null
  partsplant: string
  prepare: string
  apply?: string | null
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

