export interface Plant {
  herb_id: string
  name: string
  description: string
  img: string
  important?: string
  cultivator?: string
  symptoms: Symptom[]
}

export interface Symptom {
  symptomId?: string
  symptom: {
    name: string
  }
  partsplant: string
  description: string
  prepare: string
  apply: string
}
