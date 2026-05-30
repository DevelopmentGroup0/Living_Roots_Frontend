/* eslint-disable @next/next/no-img-element */
'use client'
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
import { Plant } from './interfaces'
import { useFavorites } from '@/hooks/useFavorites'

export function HerbCard({ plant }: { plant: Plant }) {
  const { toggleFavorite, isFavorite } = useFavorites()

  const favorite = isFavorite(plant.herb_id)

  return (
    <Card className='bg-card-crema overflow-hidden hover:shadow-xl transition-all duration-300 py-0 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)]'>
      <div className='relative h-80 bg-lr-green-dark/10'>
        <img
          src={plant.img}
          alt={plant.name}
          className='w-full h-full object-cover'
        />

        <Button
          variant='ghost'
          size='icon'
          onClick={() => toggleFavorite(plant)}
          className='absolute py-0 top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-md'
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorite
                ? 'fill-red-500 text-red-500'
                : 'text-lr-green-dark'
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
              {symptom.symptom.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
