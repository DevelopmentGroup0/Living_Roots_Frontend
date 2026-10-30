'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useMobileNavStore } from '@/store/useMobileNavStore'
import { ChatSidemenu } from '@/components/chat/ChatSidemenu'
import LeafLogo from '@/components/Logo'
import type { NavItem } from '@/components/Sidebar'

import type { ComponentType } from 'react'

interface MobileNavDrawerProps {
  navigationItems: NavItem[]
  activeUser: string
  icons: Record<NavItem['icon'], ComponentType<{ className?: string }>>
}

// Menú lateral para pantallas pequeñas (< sm). Usa el Dialog de Base UI, que
// ya resuelve el foco, la tecla Escape y el cierre al tocar el fondo.
export function MobileNavDrawer({
  navigationItems,
  activeUser,
  icons,
}: MobileNavDrawerProps) {
  const open = useMobileNavStore((state) => state.open)
  const setOpen = useMobileNavStore((state) => state.setOpen)
  const pathname = usePathname()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className='fixed inset-0 z-50 bg-black/40 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 sm:hidden' />
        <DialogPrimitive.Popup
          aria-label='Menú de navegación'
          className='fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl outline-none duration-200 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left sm:hidden'
        >
          <div className='flex min-h-16 items-center justify-between border-b border-gray-200 px-4'>
            <div className='flex items-center gap-3 text-neutral-800'>
              <LeafLogo />
              <DialogPrimitive.Title className='font-serif text-xl italic text-amber-700'>
                Living Roots
              </DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close
              render={
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Cerrar menú de navegación'
                />
              }
            >
              <X className='h-5 w-5' />
            </DialogPrimitive.Close>
          </div>

          <nav className='flex flex-col gap-1 p-2' aria-label='Principal'>
            {navigationItems.map((item) => {
              const Icon = icons[item.icon]
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex h-12 items-center gap-3 rounded-md px-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${isActive ? 'text-green-600' : 'text-gray-500'}`}
                  />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Historial de chats (mismo componente que el Sidebar de escritorio) */}
          <div className='min-h-0 flex-1 border-t border-gray-200 pt-2'>
            <ChatSidemenu userId={activeUser} openSideMenu />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
