import { useMutation, useQueryClient } from '@tanstack/react-query'
import { backupService } from '@/services/backup-service'
import { QUERY_KEYS } from '@/constants/query-keys'

export function useBackupMutations() {
  const queryClient = useQueryClient()

  const exportBackup = useMutation({
    mutationFn: () => backupService.exportBackup(),
    onSuccess: ({ blob, filename }) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
  })

  const restoreBackup = useMutation({
    mutationFn: (file: File) => backupService.restoreBackup(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.herbs.all })
      queryClient.invalidateQueries({ queryKey: ['symptoms'] })
    },
  })

  return { exportBackup, restoreBackup }
}
