'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMobileNavStore } from '@/store/useMobileNavStore'

// Botón hamburguesa: solo visible en móvil (el Sidebar fijo aparece desde sm).
export function MobileNavTrigger() {
  const setOpen = useMobileNavStore((state) => state.setOpen)

  return (
    <Button
      variant='ghost'
      size='icon'
      className='shrink-0 sm:hidden'
      onClick={() => setOpen(true)}
      aria-label='Abrir menú de navegación'
    >
      <Menu className='h-5 w-5' />
    </Button>
  )
}
