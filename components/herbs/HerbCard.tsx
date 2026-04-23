/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { Heart } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PlantCardProps {
  herb_Id: string
  name: string
  description: string
  img: string
  usageMethod: string
}

export function HerbCard({ plant }: { plant: PlantCardProps }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='relative h-48 bg-gray-100'>
        <img
          src={plant.img}
          alt={plant.name}
          className='w-full h-full object-cover'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsFavorite(!isFavorite)}
          className='absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md'
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>{plant.name}</CardTitle>
        <CardDescription className='line-clamp-2'>
          {plant.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {plant.usageMethod.split(',').map((tag, index) => (
            <Badge key={index} variant='default'>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
