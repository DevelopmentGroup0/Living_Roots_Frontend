import { Badge } from '@/components/ui/badge'
import {
  getTreatmentCategory,
  treatmentCategoryLabels,
  treatmentCategoryStyles,
} from '@/constants/treatment-categories'
import type { HerbTreatment } from './interfaces'

interface TreatmentCategoryBadgesProps {
  treatment: Pick<HerbTreatment, 'category'>
  className?: string
}

export function TreatmentCategoryBadges({
  treatment,
  className = '',
}: TreatmentCategoryBadgesProps) {
  const category = getTreatmentCategory(treatment)
  if (!category) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      <Badge
        variant='outline'
        className={treatmentCategoryStyles[category]}
      >
        {treatmentCategoryLabels[category]}
      </Badge>
    </div>
  )
}
