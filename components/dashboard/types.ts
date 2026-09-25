// Contrato con el backend (HU-11). Espejo de los DTOs de `DashboardController`.

export const DASHBOARD_DAYS = [7, 30, 90] as const
export type DashboardDays = (typeof DASHBOARD_DAYS)[number]
export const DEFAULT_DAYS: DashboardDays = 30

export type TrendGranularity = 'day' | 'week'

export interface DashboardSummary {
  herbs: number
  families: number
  consultations: {
    total: number
    inRange: number
  }
}

export interface TrendPoint {
  /** 'YYYY-MM-DD': el día, o el lunes de la semana. */
  bucket: string
  count: number
}
export type ConsultationsTrend = TrendPoint[]

export interface NamedItem {
  id: string
  name: string
}

export interface CatalogHealth {
  herbsWithoutSymptoms: number
  symptomsWithoutHerbs: number
  samples: { herbs: NamedItem[]; symptoms: NamedItem[] }
}
