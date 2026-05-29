'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HerbIdCell({ id }: { id: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const truncatedId = id.substring(0, 8) + '...'

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className='flex items-center gap-1 cursor-pointer font-mono text-sm hover:bg-muted/50 p-1 rounded transition-colors'
      onClick={() => setIsExpanded(!isExpanded)}
      title='Click para expandir/colapsar'
    >
      <span className='truncate'>{isExpanded ? id : truncatedId}</span>

      <div className='flex items-center gap-0.5 ml-auto'>
        {/* Botón Copiar */}
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className='h-3 w-3 text-green-500' />
          ) : (
            <Copy className='h-3 w-3' />
          )}
        </Button>

        {/* Botón Abrir en nueva pestaña */}
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/herb/${id}`} target='_blank' rel='noopener noreferrer'>
            <ExternalLink className='h-3 w-3' />
          </Link>
        </Button>
      </div>
    </div>
  )
}
