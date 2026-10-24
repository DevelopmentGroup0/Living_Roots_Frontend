import { Badge } from '@/components/ui/badge'
import {
  getTreatmentCategories,
  treatmentCategoryLabels,
  treatmentCategoryStyles,
} from '@/constants/treatment-categories'
import type { HerbTreatment } from './interfaces'

interface TreatmentCategoryBadgesProps {
  treatment: Pick<HerbTreatment, 'category' | 'categories'>
  className?: string
}

export function TreatmentCategoryBadges({
  treatment,
  className = '',
}: TreatmentCategoryBadgesProps) {
  const categories = getTreatmentCategories(treatment)
  if (categories.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {categories.map((category) => (
        <Badge
          key={category}
          variant='outline'
          className={treatmentCategoryStyles[category]}
        >
          {treatmentCategoryLabels[category]}
        </Badge>
      ))}
    </div>
  )
}
