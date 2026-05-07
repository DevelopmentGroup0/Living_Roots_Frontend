import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export function Sidebar() {
  return (
    <aside className='w-16 h-screen bg-gray-900 border-r border-gray-700 flex flex-col items-center py-6 gap-8'>
      <Link href='/dashboard'>
        <div className='bg-green-500 w-11.25 h-11.25 rounded-full flex justify-center items-center shadow-sm'>
          <svg viewBox='0 0 24 24' className='w-6 h-6 fill-[#ffffff]'>
            <path d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z' />
          </svg>
        </div>
      </Link>

      <nav className='flex flex-col gap-6'>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Link href='/'>
            <Home className='w-5 h-5' />
          </Link>
        </Button>
        {/* <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Users className='w-5 h-5' />
        </Button> */}
      </nav>

      {/* <div className='mt-auto'>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Settings className='w-5 h-5' />
        </Button>
      </div> */}
    </aside>
  )
}
