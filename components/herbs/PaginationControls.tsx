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
    <div className='flex items-center justify-between px-6 py-4 border-t border-gray-200'>
      <p className='text-sm text-gray-500'>
        Mostrando {from} a {to} de {total}
      </p>
      <div className='flex items-center gap-1'>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className='h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 disabled:opacity-40 hover:bg-gray-50'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className='px-2 text-gray-400'>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className='h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 disabled:opacity-40 hover:bg-gray-50'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  )
}
