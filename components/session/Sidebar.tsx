'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sacramento } from 'next/font/google'

const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

import {
  Home,
  UserRoundPlus,
  BookOpen,
  PanelLeft,
  PanelLeftClose,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

import { Button } from '../ui/button'

import type { NavItem } from '../Sidebar'
import LeafLogo from '../Logo'
import { LogoSVG } from '../icons/LeafIcon'

interface SidebarClientProps {
  navigationItems: NavItem[]
}

const iconMap = {
  dashboard: LogoSVG,
  users: UserRoundPlus,
  stories: BookOpen,
  MessageCircle: MessageCircle,
  ShoppingBag: ShoppingBag,
  home: Home,
}

export default function SidebarClient({ navigationItems }: SidebarClientProps) {
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsOpen((previous) => !previous)
  }

  return (
    <TooltipProvider>
      <aside
        className={`sticky top-0 h-screen shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'}
        `}
      >
        <div className='flex h-full flex-col'>
          <div
            className={`flex h-16 items-center border-b border-gray-200 px-2 ${isOpen ? 'justify-end' : 'justify-center'}`}
          >
            <Tooltip>
              {isOpen && (
                <div className='flex items-center gap-3 px-3 py-2 text-neutral-800 dark:text-neutral-100'>
                  <LeafLogo />
                  {/* className={``} */}
                  <span
                    className={`${sacramento.className} whitespace-nowrap text-2xl font-normal tracking-wide select-none transition-all duration-200 ${isOpen ? 'w-auto opacity-100' : 'pointer-events-none w-0 opacity-0'}`}
                  >
                    Living Roots
                  </span>
                </div>
              )}

              <Button
                variant='ghost'
                size='icon'
                onClick={toggleSidebar}
                aria-label={
                  isOpen ? 'Cerrar barra lateral' : 'Abrir barra lateral'
                }
                className='text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              >
                {isOpen ? (
                  <PanelLeftClose className='h-5 w-5' />
                ) : (
                  <PanelLeft className='h-5 w-5' />
                )}
              </Button>
              <TooltipContent side='right'>
                {isOpen ? 'Cerrar barra lateral' : 'Abrir barra lateral'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Navegación */}
          <nav className='flex flex-1 flex-col gap-1 p-2'>
            {navigationItems.map((item) => {
              const Icon = iconMap[item.icon]

              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

              const link = (
                <Link
                  href={item.href}
                  className={`group flex h-11 w-full items-center overflow-hidden rounded-md text-sm transition-colors ${
                    isActive
                      ? `bg-green-100 text-green-700hover:bg-green-100 hover:text-green-700`
                      : `text-gray-600 hover:bg-gray-100 hover:text-gray-900`
                  }

                    ${isOpen ? 'justify-start px-3 gap-3' : 'justify-center px-0'}
                  `}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-green-600'
                        : 'text-gray-500 group-hover:text-gray-900'
                    }
                    `}
                  />

                  <span
                    className={`whitespace-nowrap transition-all duration-200 ${isOpen ? 'w-auto opacity-100' : 'pointer-events-none w-0 opacity-0'}`}
                  >
                    {item.label}
                  </span>
                </Link>
              )

              if (!isOpen) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger>{link}</TooltipTrigger>
                    <TooltipContent>{item.label}</TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.href}>{link}</div>
            })}
          </nav>
        </div>
      </aside>
    </TooltipProvider>
  )
}
