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
    <Link href='/'>
      <div className='flex items-center justify-center gap-3 mb-6'>
        <div className='bg-[#D3E2CC] w-11.25 h-11.25 rounded-full flex justify-center items-center shadow-sm'>
          <svg viewBox='0 0 24 24' className='w-6 h-6 fill-[#0E3321]'>
            <path d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z' />
          </svg>
        </div>
        <h1 className='text-[26px] font-semibold text-[#0E3321] m-0'>
          Living Roots
        </h1>
      </div>
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
    <main className='bg-background relative flex h-screen w-3xl items-center justify-center px-4 py-12 bg-card-crema shadow-[0_15px_40px_rgba(0,0,0,0.06)] font-sans text-[#0E3321]'>
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
      </div>
    </main>
  )
}
