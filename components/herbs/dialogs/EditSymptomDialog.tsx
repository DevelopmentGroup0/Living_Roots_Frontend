'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HerbTreatment } from '../interfaces'

const editTreatmentSchema = z.object({
  partsplant: z.string().min(1, 'Requerido'),
  prepare: z.string().min(1, 'Requerido'),
  apply: z.string().optional(),
})

export type EditTreatmentFormValues = z.infer<typeof editTreatmentSchema>

interface EditSymptomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  herbId: string | null
  treatment: HerbTreatment | null
  onSubmit: (
    herbId: string,
    symptomId: string,
    data: EditTreatmentFormValues,
  ) => Promise<void>
  isLoading?: boolean
}

export function EditSymptomDialog({
  open,
  onOpenChange,
  herbId,
  treatment,
  onSubmit,
  isLoading,
}: EditSymptomDialogProps) {
  const form = useForm<EditTreatmentFormValues>({
    resolver: zodResolver(editTreatmentSchema),
    values: treatment
      ? {
          partsplant: treatment.partsplant,
          prepare: treatment.prepare,
          apply: treatment.apply ?? '',
        }
      : undefined,
  })

  if (!treatment || !herbId) return null
  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(herbId, treatment.symptomId, data)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar tratamiento — {treatment.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='partsplant'>Partes de la planta</Label>
            <Input id='partsplant' {...form.register('partsplant')} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='prepare'>Preparación</Label>
            <Textarea id='prepare' {...form.register('prepare')} />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='apply'>Aplicación</Label>
            <Textarea id='apply' {...form.register('apply')} />
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
