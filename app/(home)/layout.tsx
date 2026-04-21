import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'
import { Suspense } from 'react'

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className='flex h-screen bg-gray-100'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Los componentes que utilicen el useParams deben ser envueltos en un Suspense */}
          <Suspense fallback={<div className='bg-accent h-12 w-full' />}>
            <Navbar />
          </Suspense>
          {children}
        </div>
      </div>
    </>
  )
}
