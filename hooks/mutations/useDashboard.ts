import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type {
  DashboardDays,
  TrendGranularity,
} from '@/components/dashboard/types'
import { dashboardApi } from '@/services/dashboard-service'

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  summary: (days: DashboardDays) => ['dashboard', 'summary', days] as const,
  trend: (days: DashboardDays, granularity: TrendGranularity) =>
    ['dashboard', 'trend', days, granularity] as const,
  catalogHealth: () => ['dashboard', 'catalog-health'] as const,
}

// Opciones comunes. `refetchOnMount: 'always'` + `staleTime` corto: al volver al panel
// se piden datos frescos (E3); el servidor ya responde rápido desde su caché.
const LIVE = {
  staleTime: 10_000,
  refetchOnMount: 'always' as const,
}

export function useDashboardSummary(days: DashboardDays) {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(days),
    queryFn: () => dashboardApi.summary(days),
    placeholderData: keepPreviousData, // al cambiar de período no parpadea (E4)
    ...LIVE,
  })
}

export function useConsultationsTrend(
  days: DashboardDays,
  granularity: TrendGranularity,
) {
  return useQuery({
    queryKey: dashboardQueryKeys.trend(days, granularity),
    queryFn: () => dashboardApi.trend(days, granularity),
    placeholderData: keepPreviousData,
    ...LIVE,
  })
}

export function useCatalogHealth() {
  return useQuery({
    queryKey: dashboardQueryKeys.catalogHealth(),
    queryFn: () => dashboardApi.catalogHealth(),
    ...LIVE,
  })
}
