'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { HerbCard } from '@/components/herbs/HerbCard'
import { Chat } from '@/components/chat/Chat'
import {
  Leaf,
  ScanEye,
  MessageSquare,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react'
import { Plant } from './herbs/interfaces'
import ContactForm from './emails/Contact-Form'

export function Main({ herbs }: { herbs: Plant[] }) {
  const router = useRouter()
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'catalogo' | 'jigra' | 'comentarios'
  >('catalogo')

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
          {activeTab === 'catalogo' ? (
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
            <div className='max-w-6xl mx-auto'></div>
          ) : (
            /* MENSAJES */
            <div className='max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-stone-200 shadow-sm animate-in fade-in'>
              <ContactForm />
            </div>
          )}
        </main>

        {/* MENÚ INFERIOR */}
        <nav className='fixed bottom-6 bg-emerald-900 text-stone-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 md:gap-10 z-40 border border-white/10 backdrop-blur-sm left-1/2 -translate-x-1/2'>
          <button
            onClick={() => {
              setActiveTab('catalogo')
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
              router.push('/jigra')
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

      {isChatExpanded && (
        <div className='fixed z-40 flex items-center justify-center p-4animate-in fade-in duration-300'>
          {/* Ventana de Conversación del Chat */}
          <Chat isExpanded={true} onExpandedChange={setIsChatExpanded} />
        </div>
      )}
    </div>
  )
}
