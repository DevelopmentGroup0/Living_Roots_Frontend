'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationControlsProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

function getPageWindow(
  current: number,
  total: number,
  siblings = 1,
): (number | 'ellipsis')[] {
  const totalNumbers = siblings * 2 + 5
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const left = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)
  const pages: (number | 'ellipsis')[] = [1]

  if (left > 2) pages.push('ellipsis')
  for (let i = Math.max(left, 2); i <= Math.min(right, total - 1); i++)
    pages.push(i)
  if (right < total - 1) pages.push('ellipsis')
  pages.push(total)

  return pages
}

export function PaginationControls({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationControlsProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  const pages = getPageWindow(page, totalPages)

  return (
    <nav
      aria-label='Paginación'
      className='flex flex-col items-center gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:justify-between sm:px-6'
    >
      <p className='text-sm text-gray-500'>
        Mostrando {from} a {to} de {total}
      </p>
      <div className='flex items-center gap-1'>
        <button
          type='button'
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label='Página anterior'
          className='size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50 sm:size-8'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} aria-hidden='true' className='px-1 text-gray-400'>
              …
            </span>
          ) : (
            <button
              key={p}
              type='button'
              onClick={() => onPageChange(p)}
              aria-label={`Página ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={`size-10 rounded-full text-sm font-medium transition-colors sm:size-8 ${
                p === page
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type='button'
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label='Página siguiente'
          className='size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50 sm:size-8'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </nav>
  )
}
