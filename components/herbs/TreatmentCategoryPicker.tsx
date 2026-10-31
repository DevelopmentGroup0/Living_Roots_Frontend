'use client'

import { Check } from 'lucide-react'
import {
  TREATMENT_CATEGORIES,
  treatmentCategoryHints,
  treatmentCategoryLabels,
  treatmentCategoryStyles,
  type TreatmentCategory,
} from '@/constants/treatment-categories'

interface TreatmentCategoryPickerProps {
  value: TreatmentCategory
  onChange: (value: TreatmentCategory) => void
  disabled?: boolean
  id?: string
}

export function TreatmentCategoryPicker({
  value,
  onChange,
  disabled = false,
  id,
}: TreatmentCategoryPickerProps) {
  return (
    <div
      id={id}
      role='radiogroup'
      aria-label='Categorías del tratamiento'
      className='grid gap-2 sm:grid-cols-3'
    >
      {TREATMENT_CATEGORIES.map((category) => {
        const selected = value === category
        return (
          <button
            key={category}
            type='button'
            role='radio'
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(category)}
            className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-colors disabled:opacity-50 ${
              selected
                ? treatmentCategoryStyles[category]
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span className='flex w-full items-center justify-between font-medium'>
              {treatmentCategoryLabels[category]}
              {selected && <Check className='h-4 w-4' />}
            </span>
            <span className='text-xs opacity-80'>
              {treatmentCategoryHints[category]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
