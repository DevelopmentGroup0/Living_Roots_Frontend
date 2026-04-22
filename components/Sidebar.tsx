import { Home, Leaf, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export function Sidebar() {
  return (
    <aside className='w-16 h-screen bg-gray-900 border-r border-gray-700 flex flex-col items-center py-6 gap-8'>
      <Link href='/dashboard'>
          <div className='w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center'>
           <Leaf className='w-6 h-6 text-white' />
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
