import type {
  CatalogHealth,
  ConsultationsTrend,
  DashboardDays,
  DashboardSummary,
  TrendGranularity,
} from '@/components/dashboard/types'
import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }
  return session?.accessToken as string | undefined
}

export const dashboardApi = {
  async summary(days: DashboardDays): Promise<DashboardSummary> {
    const token = await getToken()
    const sp = new URLSearchParams().set('days', String(days))
    return apiClient.get(`/admin/dashboard/summary?${sp}`, token)
  },

  async trend(
    days: DashboardDays,
    granularity: TrendGranularity,
  ): Promise<ConsultationsTrend> {
    const token = await getToken()
    const sp = new URLSearchParams()
    if (days) sp.set('days', String(days))
    if (granularity) sp.set('granularity', granularity)
    return apiClient.get(`/admin/dashboard/consultations-trend?${sp}`, token)
  },

  async catalogHealth(): Promise<CatalogHealth> {
    const token = await getToken()
    return apiClient.get(`/catalog-health`, token)
  },
}
