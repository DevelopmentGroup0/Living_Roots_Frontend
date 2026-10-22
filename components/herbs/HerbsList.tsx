'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { herbService } from '@/services/herbs-service'
import { HerbCard } from './HerbCard'
import Image from 'next/image'
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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

  return (
    <>
      <div className='flex-1 flex flex-col min-h-screen pb-12'>
        <main
          className='flex-1 overflow-auto p-4 md:p-6 '
          style={{
            marginRight: isChatExpanded ? '800px' : '0',
          }}
        >
          <div
            className={`grid gap-6 max-w-7xl mx-auto transition-all duration-300 ${
              isChatExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
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
        </main>

        <button
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          className={`${isChatExpanded ? 'hidden' : 'flex'} fixed bottom-6 right-10 z-50 flex items-center justify-center w-34 h-34 rounded-full shadow-xl hover:bg-green-200 dark:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-primary/40 group overflow-hidden border-2 border-primary/20`}
        >
          <div className='absolute inset-0 transition-opacity duration-300 ease-in-out group-hover:opacity-0'>
            <Image
              src='/images/mascot-normal.png'
              alt='Mascota del chat'
              fill
              sizes='64px'
              className='object-cover'
              priority
            />
          </div>

          <div className='absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100'>
            <Image
              src='/images/mascot-wink.png'
              alt='Mascota guiñando el ojo'
              fill
              sizes='64px'
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
