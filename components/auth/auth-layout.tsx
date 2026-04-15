'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Film } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  footerText: string
  footerLinkText: string
  footerLinkHref: string
}

function FilmStripDecoration({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`absolute ${side === 'left' ? 'left-0' : 'right-0'} top-0 hidden h-full w-4 lg:block`}
    >
      <div className='flex h-full flex-col items-center justify-around py-6'>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className='bg-primary/15 h-2 w-2 rounded-sm' />
        ))}
      </div>
    </div>
  )
}

function BrandLogo() {
  return (
    <Link href='/' className='mb-8 flex items-center justify-center gap-3'>
      <div className='bg-primary/20 ring-primary/30 flex h-11 w-11 items-center justify-center rounded-lg ring-1'>
        <Film className='text-primary h-6 w-6' />
      </div>
      <span className='text-foreground text-2xl font-bold tracking-tight'>
        CineStudio
      </span>
    </Link>
  )
}

function BackgroundDecoration() {
  return (
    <div className='pointer-events-none fixed inset-0 overflow-hidden'>
      {/* Spotlight glow top-left */}
      <div className='bg-primary/5 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl' />
      {/* Spotlight glow bottom-right */}
      <div className='bg-accent/5 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl' />
    </div>
  )
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <main className='bg-background relative flex h-screen w-3xl items-center justify-center px-4 py-12'>
      <BackgroundDecoration />
      <FilmStripDecoration side='left' />
      <FilmStripDecoration side='right' />

      <div className='relative z-10 w-full max-w-md'>
        <BrandLogo />

        {/* Card */}
        <div className='border-border bg-card shadow-primary/5 rounded-xl border px-8 py-3 shadow-lg'>
          {/* Header */}
          <div className='mb-6 text-center'>
            <h1 className='text-foreground text-2xl font-bold text-balance'>
              {title}
            </h1>
            <p className='text-muted-foreground mt-2 text-sm'>{subtitle}</p>
          </div>

          {children}
        </div>

        {/* Footer */}
        <p className='text-muted-foreground mt-6 text-center text-sm'>
          {footerText}{' '}
          <Link
            href={footerLinkHref}
            className='text-primary hover:text-primary/80 font-medium underline-offset-4 transition-colors hover:underline'
          >
            {footerLinkText}
          </Link>
        </p>

        {/* Bottom decorative line */}
        <div className='mt-8 flex items-center justify-center gap-2'>
          <div className='bg-border h-px w-8' />
          <Film className='text-muted-foreground/40 h-3 w-3' />
          <div className='bg-border h-px w-8' />
        </div>
      </div>
    </main>
  )
}
