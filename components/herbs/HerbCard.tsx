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
    <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 py-0 bg-lr-green-light border-lr-green-dark/30 rounded-3xl'>
      <div className='relative h-80 bg-lr-green-dark/10'>
        <img
          src={plant.img}
          alt={plant.name}
          className='w-full h-full object-cover'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsFavorite(!isFavorite)}
          className='absolute py-0 top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-md'
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-lr-terracotta text-lr-terracotta' : 'text-lr-green-dark'
            }`}
          />
        </Button>
      </div>

      <CardHeader>
        <CardTitle className='text-2xl font-serif text-lr-green-dark'>{plant.name}</CardTitle>
        <CardDescription className='line-clamp-2 text-lr-green-dark/80 font-medium'>
          {plant.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='pb-6'>
        <div className='flex flex-wrap gap-2'>
          {plant.usageMethod.split(',').map((tag, index) => (
            <Badge 
              key={index} 
              variant='secondary'
              className='bg-lr-terracotta text-lr-text-light hover:bg-lr-terracotta/80 border-none px-3 py-1'
            >
              {tag.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}