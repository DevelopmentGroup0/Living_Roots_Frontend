import { useState } from 'react'
import { Plant } from '../herbs/interfaces'

export function usePlantDialogs() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [addSymptomOpen, setAddSymptomOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const openEdit = (plant: Plant) => {
    setSelectedPlant(plant)
    setEditOpen(true)
  }
  const openDelete = (plant: Plant) => {
    setSelectedPlant(plant)
    setDeleteOpen(true)
  }
  const openAddSymptom = (plant: Plant) => {
    setSelectedPlant(plant)
    setAddSymptomOpen(true)
  }

  return {
    selectedPlant,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    addSymptomOpen,
    setAddSymptomOpen,
    createOpen,
    setCreateOpen,
    openEdit,
    openDelete,
    openAddSymptom,
  }
}
