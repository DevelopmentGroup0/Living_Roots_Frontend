'use client'
import { useState } from 'react'
import { HerbCard } from '@/components/herbs/HerbCard'
import { Chat } from '@/components/chat/Chat'
import { Leaf, ScanEye, MessageSquare, ShoppingBag, UserRoundCheck, MessageCircle, ArrowLeft, Heart, Info, X } from 'lucide-react'

export function Main({ herbs = [] }: { herbs?: any[] }) {
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'catalogo' | 'jigra' | 'comentarios'>('catalogo')
  const [sabioActivo, setSabioActivo] = useState<'wala' | 'partera'>('wala')
  
  const [plantaDetalle, setPlantaDetalle] = useState<any | null>(null)
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [filtroActivo, setFiltroActivo] = useState<'todas' | 'amargas' | 'frutas' | 'aromaticas'>('todas')

  const [comentarios, setComentarios] = useState([
    { id: 1, usuario: 'Mama Elena', mensaje: 'El Pronto Alivio me ayudó mucho para los cólicos de mi hija.', fecha: 'Hace 2 horas' },
    { id: 2, usuario: 'Taita Juan', mensaje: 'La Manzanilla es excelente si se toma antes de dormir para armonizar.', fecha: 'Hace 5 horas' }
  ])
  const [nuevoComentario, setNuevoComentario] = useState('')

  const spiralBackground = `url('data:image/svg+xml,%3Csvg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"%3Q%3Cpath d="M60 60c0-18 14-32 32-32s32 14 32 32-14 32-32 32-32-14-32-32zm-30 0c0-10 8-18 18-18s18 8 18 18-8 18-18 18-18-8-18-18z" stroke="%23d1c2a5" stroke-width="1" fill="none" opacity="0.3"/%3Q%3C/svg%3Q')`

  const esFavorito = (id: number) => favoritos.includes(id)
  const toggleFavorito = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const plantasFiltradas = (herbs || []).filter((plant) => {
    if (!plant) return false
    if (filtroActivo === 'todas') return true
    const cat = (plant.category || '').toLowerCase()
    const prop = (plant.properties || '').toLowerCase()
    const nom = (plant.name || '').toLowerCase()

    if (filtroActivo === 'amargas') return cat.includes('amarga') || prop.includes('amarga') || ['ruda', 'ajenjo', 'verbena'].some(el => nom.includes(el))
    if (filtroActivo === 'frutas') return cat.includes('fruta') || prop.includes('frutal') || ['limón', 'naranja', 'lulo'].some(el => nom.includes(el))
    if (filtroActivo === 'aromaticas') return cat.includes('aromatica') || cat.includes('aromática') || ['manzanilla', 'menta', 'albahaca'].some(el => nom.includes(el))
    return false
  })

  const manejarEnvioComentario = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) return
    setComentarios([{ id: Date.now(), usuario: 'Usuario del Tul', mensaje: nuevoComentario, fecha: 'Justo ahora' }, ...comentarios])
    setNuevoComentario('')
  }

  return (
    <div className="min-h-screen flex flex-col transition-all duration-500 overflow-x-hidden relative" style={{ backgroundColor: '#F4EFE4', backgroundImage: spiralBackground, backgroundRepeat: 'repeat' }}>
      
      {/* CONTENIDO PRINCIPAL SIEMPRE VISIBLE */}
      <div className="flex-1 flex flex-col min-h-screen pb-32">
        
        {!plantaDetalle && (
  <header className="p-6 text-center max-w-4xl mx-auto mt-4 animate-in fade-in">
  <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-2 font-bold tracking-tight">
    Sabiduría Ancestral
  </h1>
  {/* ... el resto de tus textos ... */}
    <h2 className="text-lg md:text-2xl font-serif italic text-amber-700 tracking-wide font-medium mt-1">
      Recorriendo el Tul
    </h2>
    
    {/* Línea decorativa */}
    <div className="w-20 h-1 bg-amber-700/40 mx-auto mt-4 mb-6 rounded-full"></div>

    {/* Tu nuevo texto ancestral */}
    <p className="text-center text-base md:text-lg italic text-slate-700 font-serif max-w-2xl mx-auto leading-relaxed">
      Las plantas medicinales son la memoria viva de nuestro territorio. <br className="hidden md:block" />
      En el resguardo Muse Ukwe, cada hoja, raíz y fruto guarda sabiduría <br className="hidden md:block" />
      para sanar el cuerpo y el espíritu.
    </p>
  </header>
)}
        {activeTab === 'catalogo' && !plantaDetalle && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 px-4 animate-in fade-in">
            {(['todas', 'amargas', 'frutas', 'aromaticas'] as const).map((tipo) => (
              <button key={tipo} onClick={() => setFiltroActivo(tipo)} className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all border ${filtroActivo === tipo ? 'bg-emerald-800 text-white border-emerald-800 shadow-md' : 'bg-white/60 text-slate-700 border-stone-300 hover:bg-white'}`}>
                {tipo}
              </button>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">
          
          {/* ================= PANTALLA DE DETALLE ================= */}
          {plantaDetalle ? (
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="relative h-72 md:h-96 w-full">
                <img 
                  src={plantaDetalle.image || "https://images.unsplash.com/photo-1515514231713-39327d66bf53?q=80&w=800&auto=format&fit=crop"} 
                  className="w-full h-full object-cover" 
                  alt={plantaDetalle.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button onClick={() => setPlantaDetalle(null)} className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-all">
                  <ArrowLeft size={24} />
                </button>
                <button onClick={(e) => toggleFavorito(e, plantaDetalle.herb_Id || plantaDetalle.id)} className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full transition-all">
                  <Heart size={24} className={esFavorito(plantaDetalle.herb_Id || plantaDetalle.id) ? "fill-red-500 text-red-500" : "text-white"} />
                </button>
                <div className="absolute bottom-8 left-8">
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">
                    {plantaDetalle.category || 'Medicina Ancestral'}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">{plantaDetalle.name}</h2>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-serif font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Info className="text-emerald-700" size={20} /> Propiedades y Saberes
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-lg font-sans italic">
                    "{plantaDetalle.properties || 'Esta planta guarda los secretos del equilibrio entre el cuerpo y el espíritu dentro de nuestro Tul.'}"
                  </p>
                </div>
                
                <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 h-fit">
                  <h4 className="font-bold text-emerald-900 mb-4 text-sm uppercase">Detalles técnicos</h4>
                  <ul className="space-y-4">
                    <li className="flex flex-col"><span className="text-[10px] text-emerald-700 font-bold uppercase">Nombre Común</span><span className="text-slate-700 font-medium">{plantaDetalle.name}</span></li>
                    <li className="flex flex-col"><span className="text-[10px] text-emerald-700 font-bold uppercase">Clasificación</span><span className="text-slate-700 font-medium capitalize">{plantaDetalle.category || 'Nativa'}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          ) : activeTab === 'catalogo' ? (
            /* LISTA DEL CATÁLOGO */
            <div className="grid gap-6 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl animate-in fade-in">
              {plantasFiltradas.map((h, idx) => (
                <div key={h.herb_Id || idx} onClick={() => setPlantaDetalle(h)} className="cursor-pointer hover:scale-[1.02] transition-all relative group">
                  <HerbCard plant={h} />
                  <button onClick={(e) => toggleFavorito(e, h.herb_Id || h.id)} className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-md border border-stone-100">
                    <Heart size={18} className={esFavorito(h.herb_Id || h.id) ? "fill-red-500 text-red-500" : "text-stone-400"} />
                  </button>
                </div>
              ))}
            </div>
          ) : activeTab === 'jigra' ? (
            /* MI JIGRA */
            <div className="max-w-6xl mx-auto">
              {(herbs || []).filter(p => favoritos.includes(p.herb_Id || p.id)).length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {(herbs || []).filter(p => favoritos.includes(p.herb_Id || p.id)).map((h, idx) => (
                    <div key={h.herb_Id || idx} onClick={() => setPlantaDetalle(h)} className="cursor-pointer hover:scale-[1.02] transition-all relative">
                      <HerbCard plant={h} />
                      <Heart size={20} className="absolute top-4 right-4 fill-red-500 text-red-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12 bg-white/40 rounded-3xl border border-dashed border-stone-300">
                  <ShoppingBag className="mx-auto mb-4 text-stone-400" size={48} />
                  <p className="text-stone-500 font-serif italic">Tu Jigra de saberes está vacía. Guarda plantas con el corazón.</p>
                </div>
              )}
            </div>
          ) : (
            /* MENSAJES */
            <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-stone-200 shadow-sm animate-in fade-in">
              <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6 flex items-center gap-2"><MessageCircle className="text-amber-700" /> Saberes Compartidos</h3>
              <form onSubmit={manejarEnvioComentario} className="mb-8">
                <textarea value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)} placeholder="¿Qué sabes sobre esta planta?" className="w-full p-5 border border-stone-200 rounded-[1.5rem] bg-white/80 focus:ring-2 focus:ring-emerald-800 outline-none text-sm" rows={3} />
                <button type="submit" className="mt-3 bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow-md">Enviar al Tul</button>
              </form>
            </div>
          )}
        </main>

        {/* MENÚ INFERIOR */}
        <nav className="fixed bottom-6 bg-emerald-900 text-stone-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 md:gap-10 z-40 border border-white/10 backdrop-blur-sm left-1/2 -translate-x-1/2">
          <button onClick={() => { setActiveTab('catalogo'); setPlantaDetalle(null); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'catalogo' ? 'text-amber-300 scale-110' : 'text-stone-400'}`}>
            <Leaf size={20} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Catálogo</span>
          </button>
          <button onClick={() => { setActiveTab('comentarios'); setPlantaDetalle(null); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'comentarios' ? 'text-amber-300 scale-110' : 'text-stone-400'}`}>
            <MessageCircle size={20} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Mensajes</span>
          </button>
          <button className="bg-amber-600 p-3 rounded-full -mt-12 shadow-xl border-4 border-[#F4EFE4] hover:scale-110 transition-transform text-white">
            <ScanEye size={28} />
          </button>
          <button onClick={() => setIsChatExpanded(!isChatExpanded)} className={`flex flex-col items-center gap-1 transition-all ${isChatExpanded ? 'text-amber-300 scale-110' : 'text-stone-400'}`}>
            <MessageSquare size={20} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">The Wala</span>
          </button>
          <button onClick={() => { setActiveTab('jigra'); setPlantaDetalle(null); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'jigra' ? 'text-amber-300 scale-110' : 'text-stone-400'}`}>
            <ShoppingBag size={20} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Mi Jigra</span>
          </button>
        </nav>
      </div>

      {/* ================= 🟢 MODAL DEL CHATBOT SUPERPUESTO (No empuja el catálogo) ================= */}
      {isChatExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg h-[80vh] flex flex-col rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200 animate-in slide-in-from-bottom-5 duration-300">
            
            {/* Cabecera del Chat */}
            <div className="p-4 border-b border-stone-100 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-serif font-bold text-slate-800 text-lg">Consulta de Saberes</span>
                </div>
                <button onClick={() => setIsChatExpanded(false)} className="text-stone-400 hover:text-red-500 hover:bg-stone-100 p-2 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Selector de Sabios */}
              <div className="flex bg-stone-100/80 p-1 rounded-xl gap-1">
                <button onClick={() => setSabioActivo('wala')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${sabioActivo === 'wala' ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600'}`}>
                  <UserRoundCheck size={14} /> The Wala
                </button>
                <button onClick={() => setSabioActivo('partera')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${sabioActivo === 'partera' ? 'bg-amber-700 text-white shadow-sm' : 'text-slate-600'}`}>
                  <UserRoundCheck size={14} /> Partera
                </button>
              </div>
            </div>

            {/* Ventana de Conversación del Chat */}
            <div className="flex-1 overflow-hidden p-4 bg-stone-50/50">
              <Chat isExpanded={true} onExpandedChange={setIsChatExpanded} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}