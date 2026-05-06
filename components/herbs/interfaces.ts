export interface Plant {
  herb_id: string
  name: string
  description: string
  img: string
  symptoms: Symptom[]
}

export interface Symptom {
  symptom_id?: string
  symptom: {
    name: string
  }
  description: string
  prepare: string
  apply: string
}
