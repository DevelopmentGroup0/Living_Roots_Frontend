'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { herbService } from '@/services/herbs-service'
import { HerbCard } from './HerbCard'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Chat } from '../chat/Chat'

export function HerbsList({
  initialQuery,
  initialSymptomId,
}: {
  initialQuery: string
  initialSymptomId?: string
}) {
  const { data: session } = useSession()
  const token = session?.accessToken as string | undefined
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const searchParams = useSearchParams()
  const sentinelRef = useRef<HTMLDivElement>(null)

  const query = searchParams.get('query') ?? initialQuery
  const symptomId = searchParams.get('symptomId') ?? initialSymptomId

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
      queryKey: ['herbs', query, symptomId],
      queryFn: ({ pageParam }) =>
        herbService.getAll(
          {
            page: pageParam,
            limit: 12,
            search: query,
            symptomId,
          },
          token,
        ),
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
  const hasFilters = Boolean(query || symptomId)

  return (
    <>
      <div className='flex-1 flex flex-col min-h-screen pb-12'>
        <main
          // Solo en pantallas muy anchas se deja espacio para el chat (800px);
          // en el resto el chat se superpone a pantalla completa.
          className={`flex-1 overflow-auto p-4 md:p-6 ${isChatExpanded ? 'xl:mr-[800px]' : ''}`}
        >
          {isError && (
            <div
              role='alert'
              className='mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center'
            >
              <p className='text-lr-green-dark font-medium'>
                No pudimos cargar las plantas.
              </p>
              <Button variant='outline' onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          )}

          {!isError && !isLoading && herbs.length === 0 && (
            <div className='mx-auto mt-10 flex max-w-md flex-col items-center gap-3 text-center'>
              <p className='text-lr-green-dark text-lg font-serif'>
                No encontramos plantas
                {hasFilters ? ' con esos filtros' : ' por ahora'}.
              </p>
              {hasFilters && (
                <>
                  <p className='text-sm text-gray-500'>
                    Prueba con otro nombre o quita el filtro de síntoma.
                  </p>
                  <Button variant='outline' render={<Link href='/' />}>
                    Limpiar búsqueda
                  </Button>
                </>
              )}
            </div>
          )}

          <div
            className={`grid gap-4 sm:gap-6 max-w-7xl mx-auto transition-all duration-300 ${
              isChatExpanded
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'
            }`}
          >
            {herbs.map((h) => (
              <HerbCard key={h.herb_id} plant={h} />
            ))}
            {(isLoading || isFetchingNextPage) &&
              Array.from({ length: isLoading ? 6 : 4 }).map((_, i) => (
                <div key={`skeleton-${i}`} className='animate-pulse'>
                  <div className='aspect-square rounded-lg bg-[#DCE5D8]' />
                  <div className='mt-2 h-4 w-2/3 rounded bg-[#DCE5D8]' />
                </div>
              ))}
            <div ref={sentinelRef} className='h-1' />
          </div>
        </main>

        <button
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          aria-label='Abrir asistente de plantas'
          className={`${isChatExpanded ? 'hidden' : 'flex'} fixed bottom-4 right-4 sm:bottom-6 sm:right-10 z-50 items-center justify-center size-20 sm:size-28 lg:size-34 rounded-full shadow-xl hover:bg-green-200 dark:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-primary/40 group overflow-hidden border-2 border-primary/20`}
        >
          <div className='absolute inset-0 transition-opacity duration-300 ease-in-out group-hover:opacity-0'>
            <Image
              src='/images/mascot-normal.png'
              alt='Mascota del chat'
              fill
              sizes='(min-width: 1024px) 136px, 112px'
              className='object-cover'
              priority
            />
          </div>

          <div className='absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100'>
            <Image
              src='/images/mascot-wink.png'
              alt='Mascota guiñando el ojo'
              fill
              sizes='(min-width: 1024px) 136px, 112px'
              className='object-cover'
              priority
            />
          </div>
        </button>
      </div>
      {isChatExpanded && (
        <div className='fixed z-40 flex items-center justify-center p-4 animate-in fade-in duration-300'>
          {/* Ventana de Conversación del Chat */}
          <Chat isExpanded={true} onExpandedChange={setIsChatExpanded} />
        </div>
      )}
    </>
  )
}
