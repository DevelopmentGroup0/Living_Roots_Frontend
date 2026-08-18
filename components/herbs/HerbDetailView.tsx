/* eslint-disable @next/next/no-img-element */
'use client'
import { useFavorites } from '@/hooks/useFavorites'
import { ArrowLeft, Heart, Info } from 'lucide-react'
import { MedicinalHerb } from './interfaces'

export function HerbDetailView({
  plantDetails,
}: {
  plantDetails: MedicinalHerb
}) {
  console.log('para el componente client', plantDetails)
  const { toggleFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(plantDetails.herb_id)
  return (
    <div className='max-w-4xl mx-auto bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/50 overflow-y-auto no-scrollbar overflow-x-hidden animate-in zoom-in-95 duration-300'>
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
          className='absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full transition-all'
          // onClick={() => toggleFavorite(plantDetails)}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              favorite ? 'fill-red-500 text-red-500' : 'text-lr-green-dark'
            }`}
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
        <div className='md:col-span-3 border-t border-slate-200 pt-10 w-full'>
          <h2 className='text-xl font-serif font-semibold text-stone-800 flex items-center gap-2 px-2'>
            Usos y preparaciones tradicionales
          </h2>

          <div className='grid gap-6 md:grid-cols-2'>
            {plantDetails.symptoms.map((item) => (
              <div
                key={item.symptomId}
                className='bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100/70 hover:shadow-sm transition-shadow flex flex-col justify-between'
              >
                {/* Encabezado del Síntoma */}
                <div>
                  <div className='flex items-start justify-between mb-4'>
                    <h3 className='text-lg font-bold text-emerald-900 font-serif'>
                      Para el alivio de:{' '}
                      <span className='underline decoration-emerald-300 underline-offset-4'>
                        {item.symptom.name}
                      </span>
                    </h3>
                  </div>

                  <hr className='border-emerald-100 mb-4' />

                  {/* Proceso y Preparación */}
                  <div className='space-y-4'>
                    <div>
                      <h4 className='text-xs uppercase tracking-wider text-emerald-800 font-bold mb-1 flex items-center gap-1'>
                        Parte de la planta que necesitarás:
                      </h4>
                      <p className='bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium mb-1'>
                        {item.partsplant}
                      </p>
                      <h4 className='text-xs uppercase tracking-wider text-emerald-800 font-bold mb-1 flex items-center gap-1'>
                        ¿Cómo se prepara?
                      </h4>
                      <p className='text-stone-700 text-sm leading-relaxed bg-white/60 p-3 rounded-xl border border-stone-100'>
                        {item.prepare}
                      </p>
                    </div>

                    {/* Aplicación / Tratamiento */}
                    <div>
                      <h4 className='text-xs uppercase tracking-wider text-amber-800 font-bold mb-1 flex items-center gap-1'>
                        ¿Cómo se aplica o consume?
                      </h4>
                      <p className='text-stone-700 text-sm leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100/50'>
                        {item.apply}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nota de respeto al saber (Opcional/Estético) */}
                <div className='mt-4 pt-3 border-t border-emerald-100/50 text-[11px] text-stone-400 italic text-right'>
                  Uso comunitario tradicional
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
