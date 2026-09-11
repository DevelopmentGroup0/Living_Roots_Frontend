// export interface Plant {
//   herb_id: string
//   name: string
//   description: string
//   img: string
//   important?: string
//   cultivator?: string
//   symptoms: Symptom[]
// }

// export interface Symptom {
//   symptomId?: string
//   symptom: {
//     name: string
//   }
//   partsplant: string
//   description: string
//   prepare: string
//   apply: string
// }

export interface HerbTreatment {
  herbId: string
  symptomId: string
  partsplant: string
  prepare: string
  apply?: string | null
  symptom: {
    symptom_id: string
    name: string
    description?: string | null
  }
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

// Tipado para la vista de detalles de la planta, con información más completa
export interface SymptomDetail {
  herbId: string
  symptomId: string
  partsplant: string
  prepare: string
  apply: string
  symptom: {
    symptom_id: string
    name: string
    description: string | null
  }
}

export interface MedicinalHerb {
  herb_id: string
  name: string
  description: string
  img: string
  cultivator: string | null
  important: string | null
  symptoms: SymptomDetail[]
}
