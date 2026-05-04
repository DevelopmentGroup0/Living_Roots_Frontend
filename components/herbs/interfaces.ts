export interface Plant {
  herb_id: string
  name: string
  description: string
  img: string
  symptoms: Symptom[]
}

export interface Symptom {
  symptom: {
    name: string
  }
  prepare: string
  apply: string
}
