import { useMutation, useQueryClient } from '@tanstack/react-query'
import { herbService } from '@/services/herbs-service'
import { QUERY_KEYS } from '@/constants/query-keys'
import type { CreateHerbFormValues } from '@/schemas/herbs.schema'
import type { AddSymptomFormValues } from '@/schemas/symptom.schema'

export function useHerbMutations() { 
  const queryClient = useQueryClient()

  // Función reutilizable — todas las mutations invalidan el mismo cache
  const invalidateHerbs = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.herbs.all })

  const create = useMutation({
    mutationFn: (data: CreateHerbFormValues) => herbService.create(data),
    onSuccess: invalidateHerbs,
    // onSuccess corre después de que la promesa resuelve con éxito.
    // invalidateHerbs marca el cache como stale, lo que dispara un
    // refetch automático en cualquier componente que tenga useHerbs activo.
  })

  const update = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateHerbFormValues>
    }) => herbService.update(id, data),
    onSuccess: invalidateHerbs,
  })

  const remove = useMutation({
    mutationFn: (id: string) => herbService.delete(id),
    onSuccess: invalidateHerbs,
  })

  const addSymptom = useMutation({
    mutationFn: ({
      herbId,
      data,
    }: {
      herbId: string
      data: AddSymptomFormValues
    }) => herbService.addSymptom(herbId, data),
    onSuccess: invalidateHerbs,
  })

  return { create, update, remove, addSymptom }
}
