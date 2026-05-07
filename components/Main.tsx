/* eslint-disable @next/next/no-img-element */
'use client'
import { useState } from 'react'
import { HerbCard } from '@/components/herbs/HerbCard'
import { Chat } from '@/components/chat/Chat'
import {
  Leaf,
  ScanEye,
  MessageSquare,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Heart,
  Info,
} from 'lucide-react'
import { Plant } from './herbs/interfaces'

export function Main({ herbs }: { herbs: Plant[] }) {
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'catalogo' | 'jigra' | 'comentarios'
  >('catalogo')

  const [plantaDetalle, setPlantaDetalle] = useState<any | null>(null)
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [filtroActivo, setFiltroActivo] = useState<
    'todas' | 'amargas' | 'frutas' | 'aromaticas'
  >('todas')

  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      usuario: 'Mama Elena',
      mensaje: 'El Pronto Alivio me ayudó mucho para los cólicos de mi hija.',
      fecha: 'Hace 2 horas',
    },
    {
      id: 2,
      usuario: 'Taita Juan',
      mensaje:
        'La Manzanilla es excelente si se toma antes de dormir para armonizar.',
      fecha: 'Hace 5 horas',
    },
  ])
  const [nuevoComentario, setNuevoComentario] = useState('')

  const esFavorito = (id: number) => favoritos.includes(id)
  const toggleFavorito = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }

  const plantasFiltradas = (herbs || []).filter((plant) => {
    if (!plant) return false
    if (filtroActivo === 'todas') return true
    const cat = (plant.category || '').toLowerCase()
    const prop = (plant.properties || '').toLowerCase()
    const nom = (plant.name || '').toLowerCase()

    if (filtroActivo === 'amargas')
      return (
        cat.includes('amarga') ||
        prop.includes('amarga') ||
        ['ruda', 'ajenjo', 'verbena'].some((el) => nom.includes(el))
      )
    if (filtroActivo === 'frutas')
      return (
        cat.includes('fruta') ||
        prop.includes('frutal') ||
        ['limón', 'naranja', 'lulo'].some((el) => nom.includes(el))
      )
    if (filtroActivo === 'aromaticas')
      return (
        cat.includes('aromatica') ||
        cat.includes('aromática') ||
        ['manzanilla', 'menta', 'albahaca'].some((el) => nom.includes(el))
      )
    return false
  })

  const manejarEnvioComentario = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) return
    setComentarios([
      {
        id: Date.now(),
        usuario: 'Usuario del Tul',
        mensaje: nuevoComentario,
        fecha: 'Justo ahora',
      },
      ...comentarios,
    ])
    setNuevoComentario('')
  }

  return (
    <div
      className='min-h-screen flex flex-col transition-all duration-500 overflow-x-hidden relative'
      style={{
        backgroundColor: '#F4EFE4',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* CONTENIDO PRINCIPAL SIEMPRE VISIBLE */}
      <div className='flex-1 flex flex-col min-h-screen pb-32'>
        <main
          className='flex-1 overflow-auto p-4 md:p-6 '
          style={{
            marginRight: isChatExpanded ? '800px' : '0',
          }}
        >
          {/* ================= PANTALLA DE DETALLE ================= */}
          {plantaDetalle ? (
            <div className='max-w-4xl mx-auto bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300'>
              <div className='relative h-72 md:h-96 w-full'>
                <img
                  src={plantaDetalle.image}
                  className='w-full h-full object-cover'
                  alt={plantaDetalle.name}
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent'></div>
                <button
                  onClick={() => setPlantaDetalle(null)}
                  className='absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-all'
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={(e) =>
                    toggleFavorito(e, plantaDetalle.herb_Id || plantaDetalle.id)
                  }
                  className='absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full transition-all'
                >
                  <Heart
                    size={24}
                    className={
                      esFavorito(plantaDetalle.herb_Id || plantaDetalle.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                    }
                  />
                </button>
                <div className='absolute bottom-8 left-8'>
                  <span className='bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block'>
                    {plantaDetalle.category || 'Medicina Ancestral'}
                  </span>
                  <h2 className='text-4xl md:text-5xl font-serif font-bold text-white'>
                    {plantaDetalle.name}
                  </h2>
                </div>
              </div>

              <div className='p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10'>
                <div className='md:col-span-2'>
                  <h3 className='text-xl font-serif font-bold text-slate-800 mb-4 flex items-center gap-2'>
                    <Info className='text-emerald-700' size={20} /> Propiedades
                    y Saberes
                  </h3>
                  <p className='text-stone-600 leading-relaxed text-lg font-sans italic'>
                    {plantaDetalle.description}
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
                        {plantaDetalle.name}
                      </span>
                    </li>
                    <li className='flex flex-col'>
                      <span className='text-[10px] text-emerald-700 font-bold uppercase'>
                        Clasificación
                      </span>
                      <span className='text-slate-700 font-medium capitalize'>
                        {plantaDetalle.category || 'Nativa'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : activeTab === 'catalogo' ? (
            /* LISTA DEL CATÁLOGO */
            <div
              className={`grid gap-6 max-w-7xl mx-auto transition-all duration-300 ${
                isChatExpanded ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {herbs.map((h) => (
                <HerbCard key={h.name} plant={h} />
              ))}
            </div>
          ) : activeTab === 'jigra' ? (
            /* MI JIGRA */
            <div className='max-w-6xl mx-auto'>
              {(herbs || []).filter((p) => favoritos.includes(p.herb_id))
                .length > 0 ? (
                <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {(herbs || [])
                    .filter((p) => favoritos.includes(p.herb_id))
                    .map((h, idx) => (
                      <div
                        key={h.herb_id}
                        onClick={() => setPlantaDetalle(h)}
                        className='cursor-pointer hover:scale-[1.02] transition-all relative'
                      >
                        <HerbCard plant={h} />
                        <Heart
                          size={20}
                          className='absolute top-4 right-4 fill-red-500 text-red-500'
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className='text-center p-12 bg-white/40 rounded-3xl border border-dashed border-stone-300'>
                  <ShoppingBag
                    className='mx-auto mb-4 text-stone-400'
                    size={48}
                  />
                  <p className='text-stone-500 font-serif italic'>
                    Tu Jigra de saberes está vacía. Guarda plantas con el
                    corazón.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* MENSAJES */
            <div className='max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-stone-200 shadow-sm animate-in fade-in'>
              <h3 className='text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2'>
                <MessageCircle className='text-amber-700' /> Saberes Compartidos
              </h3>
              <form onSubmit={manejarEnvioComentario} className='mb-8'>
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  placeholder='¿Qué sabes sobre esta planta?'
                  className='w-full p-5 border border-stone-200 rounded-3xl bg-white/80 focus:ring-2 focus:ring-emerald-800 outline-none text-sm'
                  rows={3}
                />
                <button
                  type='submit'
                  className='mt-3 bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow-md'
                >
                  Enviar al Tul
                </button>
              </form>
            </div>
          )}
        </main>

        {/* MENÚ INFERIOR */}
        <nav className='fixed bottom-6 bg-emerald-900 text-stone-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 md:gap-10 z-40 border border-white/10 backdrop-blur-sm left-1/2 -translate-x-1/2'>
          <button
            onClick={() => {
              setActiveTab('catalogo')
              setPlantaDetalle(null)
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'catalogo' ? 'text-amber-300 scale-110' : 'text-stone-400'}`}
          >
            <Leaf size={20} />
            <span className='text-[9px] font-bold uppercase tracking-tighter'>
              Catálogo
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('comentarios')
              setPlantaDetalle(null)
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'comentarios' ? 'text-amber-300 scale-110' : 'text-stone-400'}`}
          >
            <MessageCircle size={20} />
            <span className='text-[9px] font-bold uppercase tracking-tighter'>
              Mensajes
            </span>
          </button>
          <button className='bg-amber-600 p-3 rounded-full -mt-12 shadow-xl border-4 border-[#F4EFE4] hover:scale-110 transition-transform text-white'>
            <ScanEye size={28} />
          </button>
          <button
            onClick={() => setIsChatExpanded(!isChatExpanded)}
            className={`flex flex-col items-center gap-1 transition-all ${isChatExpanded ? 'text-amber-300 scale-110' : 'text-stone-400'}`}
          >
            <MessageSquare size={20} />
            <span className='text-[9px] font-bold uppercase tracking-tighter'>
              The Wala
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('jigra')
              setPlantaDetalle(null)
            }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'jigra' ? 'text-amber-300 scale-110' : 'text-stone-400'}`}
          >
            <ShoppingBag size={20} />
            <span className='text-[9px] font-bold uppercase tracking-tighter'>
              Mi Jigra
            </span>
          </button>
        </nav>
      </div>

      {/* ================= 🟢 MODAL DEL CHATBOT SUPERPUESTO (No empuja el catálogo) ================= */}
      {isChatExpanded && (
        <div className='fixed z-40 flex items-center justify-center p-4animate-in fade-in duration-300'>
          {/* Ventana de Conversación del Chat */}
          <Chat isExpanded={true} onExpandedChange={setIsChatExpanded} />
        </div>
      )}
    </div>
  )
}
