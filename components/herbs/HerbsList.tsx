'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { herbService } from '@/services/herbs-service'
// import { SymptomCombobox } from '@/components/syptoms/SymptomCombobox'
import { HerbCard } from './HerbCard'
import { FeedbackForm } from '../emails/Contact-Form'
import {
  Leaf,
  MessageCircle,
  MessageSquare,
  ScanEye,
  ShoppingBag,
} from 'lucide-react'
import { Chat } from '../chat/Chat'

export function HerbsList({
  initialQuery,
  initialSymptomId,
}: {
  initialQuery: string
  initialSymptomId?: string
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const token = session?.accessToken as string | undefined
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'catalogo' | 'jigra' | 'comentarios'
  >('catalogo')
  const searchParams = useSearchParams()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const query = searchParams.get('query') ?? initialQuery
  const symptomId = searchParams.get('symptomId') ?? initialSymptomId

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['herbs', query, symptomId],
      queryFn: ({ pageParam }) =>
        herbService.getAll({
          page: pageParam,
          limit: 12,
          search: query,
          symptomId,
        }, token),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        fetchNextPage(),
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const herbs = data?.pages.flatMap((page) => page.data) ?? []
  console.log('Data inicial', herbs)
  //   const handleSymptomChange = (newSymptomId?: string) => {
  //     const params = new URLSearchParams(searchParams.toString())
  //     newSymptomId
  //       ? params.set('symptomId', newSymptomId)
  //       : params.delete('symptomId')
  //     router.push(`?${params.toString()}`)
  //   }
  //   <div className='mb-6 flex justify-end'>
  //     <SymptomCombobox value={symptomId} onChange={handleSymptomChange} />
  //   </div>

  return (
    <>
      <div className='flex-1 flex flex-col min-h-screen pb-32'>
        <main
          className='flex-1 overflow-auto p-4 md:p-6 '
          style={{
            marginRight: isChatExpanded ? '800px' : '0',
          }}
        >
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
              {isFetchingNextPage &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className='animate-pulse'>
                    <div className='aspect-square rounded-lg bg-[#DCE5D8]' />
                    <div className='mt-2 h-4 w-2/3 rounded bg-[#DCE5D8]' />
                  </div>
                ))}
              <div ref={sentinelRef} className='h-1' />
            </div>
          ) : activeTab === 'jigra' ? (
            /* MI JIGRA */
            <div className='max-w-6xl mx-auto'></div>
          ) : (
            /* MENSAJES */
            <div className='max-w-2xl mx-auto bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-stone-200 shadow-sm animate-in fade-in'>
              <FeedbackForm />
            </div>
          )}
        </main>

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
    </>
  )
}
