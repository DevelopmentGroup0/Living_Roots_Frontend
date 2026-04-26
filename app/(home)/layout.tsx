import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'

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
          <Navbar />
          {children}
        </div>
      </div>
    </>
  )
}
