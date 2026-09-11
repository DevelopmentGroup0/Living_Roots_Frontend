'use client'
import { useRouter } from 'next/navigation'
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
import { Plant } from './interfaces'
import { useFavorites } from '@/hooks/useFavorites'
import { PlantImage } from './PlantImage';

export function HerbCard({ plant }: { plant: Plant }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(plant.herb_id)
  
  const router = useRouter()

  const handleCardClick = () => {
    // Aquí se puede pre-cargar datos en el caché de React Query si lo necesitara
    router.push(`/herb/${plant.herb_id}`)
  }

  return (
    <Card
      className='bg-card-crema overflow-hidden hover:shadow-xl transition-all duration-300 py-0 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)]'
      onClick={handleCardClick}
    >
      <div className='relative h-80 bg-lr-green-dark/10'>
        <PlantImage src={plant.img} alt={plant.name} />

        <Button
          variant='ghost'
          size='icon'
          onClick={() => toggleFavorite(plant)}
          className='absolute py-0 top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-md'
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorite ? 'fill-red-500 text-red-500' : 'text-lr-green-dark'
            }`}
          />
        </Button>
      </div>

      <CardHeader>
        <CardTitle className='text-2xl font-serif text-lr-green-dark flex justify-between items-center gap-4'>
          {plant.name}
        </CardTitle>
        <CardDescription className='line-clamp-2 text-lr-green-dark/80 font-medium'>
          {plant.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='pb-6'>
        <div className='flex flex-wrap gap-2'>
          {plant.symptoms.map((symptom, index) => (
            <Badge key={index} variant='default'>
              {symptom.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
