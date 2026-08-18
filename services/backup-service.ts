import { getSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

export interface RestoreResult {
  message: string
  stats: {
    plantas_restauradas: number
    sintomas_restaurados: number
    relaciones_restauradas: number
  }
}

export interface ExportBackupResult {
  blob: Blob
  filename: string // formato: living-roots-backup-YYYY-MM-DD.xlsx
}

async function getToken(): Promise<string | undefined> {
  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('Sesión no encontrada. Por favor inicia sesión nuevamente.')
  }
  return session?.accessToken as string | undefined
}

async function exportBackup(): Promise<ExportBackupResult> {
  const token = await getToken()
  const blob = await apiClient.getBlob('/backup', token)
  const filename = `living-roots-backup-${new Date().toISOString().split('T')[0]}.xlsx`
  return { blob, filename }
}

async function restoreBackup(file: File): Promise<RestoreResult> {
  const token = await getToken()
  const formData = new FormData()
  formData.append('backup', file)
  return apiClient.postForm<RestoreResult>('/herbs/restore', formData, token)
}

export const backupService = { exportBackup, restoreBackup }
