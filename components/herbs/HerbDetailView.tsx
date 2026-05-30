/* eslint-disable @next/next/no-img-element */
'use client'
import type { Plant } from '@/components/herbs/interfaces'
import { ArrowLeft, Heart, Info } from 'lucide-react'
import { useState } from 'react'
export function HerbDetailView({ plantDetails }: { plantDetails: Plant }) {
  console.log('para el componente client', plantDetails)
  // const [favoritos, setFavoritos] = useState<string[]>([])
  // const esFavorito = (id: string) => favoritos.includes(id)
  // const toggleFavorito = (e: React.MouseEvent, id: string) => {
  //   e.stopPropagation()
  //   setFavoritos((prev) =>
  //     prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
  //   )
  // }

  return (
    <div className='max-w-4xl mx-auto bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300'>
      <div className='relative h-72 md:h-96 w-full'>
        <img
          src={plantDetails.img}
          className='w-full h-full object-cover'
          alt={plantDetails.name}
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent'></div>
        <button className='absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-all'>
          <ArrowLeft size={24} />
        </button>
        <button
          // onClick={(e) => toggleFavorito(e, plantDetails.herb_id)}
          className='absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full transition-all'
        >
          <Heart
            size={24}
            // className={
            //   esFavorito(plantDetails.herb_id)
            //     ? 'fill-red-500 text-red-500'
            //     : 'text-white'
            // }
          />
        </button>
        <div className='absolute bottom-8 left-8'>
          <span className='bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block'>
            {/* {plantDetails.category || 'Medicina Ancestral'} */}
            {'Medicina Ancestral'}
          </span>
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-white'>
            {plantDetails.name}
          </h2>
        </div>
      </div>

      <div className='p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10'>
        <div className='md:col-span-2'>
          <h3 className='text-xl font-serif font-bold text-slate-800 mb-4 flex items-center gap-2'>
            <Info className='text-emerald-700' size={20} /> Propiedades y
            Saberes
          </h3>
          <p className='text-stone-600 leading-relaxed text-lg font-sans italic'>
            {plantDetails.description}
          </p>
        </div>

        <div className='bg-emerald-50 p-8 rounded-4xl border border-emerald-100 h-fit'>
          <h4 className='font-bold text-emerald-900 mb-4 text-sm uppercase'>
            Detalles técnicos
          </h4>
          <ul className='space-y-4'>
            <li className='flex flex-col'>
              <span className='text-[10px] text-emerald-700 font-bold uppercase'>
                Nombre Común
              </span>
              <span className='text-slate-700 font-medium'>
                {plantDetails.name}
              </span>
            </li>
            <li className='flex flex-col'>
              <span className='text-[10px] text-emerald-700 font-bold uppercase'>
                Clasificación
              </span>
              <span className='text-slate-700 font-medium capitalize'>
                {/* {plantDetails.category || 'Nativa'} */}
                {'Nativa'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
