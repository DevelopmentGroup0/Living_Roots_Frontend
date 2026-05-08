import LeafLogo from './Logo'
import { Home, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

export function Sidebar() {
  return (
    <aside className='w-16 h-screen bg-gray-900 border-r border-gray-700 flex flex-col items-center py-6 gap-8'>
      <Link href='/dashboard'>
        <LeafLogo />
      </Link>

      <nav className='flex flex-col gap-6'>
        <Button
          variant='link'
          size='lg'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Link href='/auth/register'>
            <UserRoundPlus className='w-15 h-15' />
          </Link>
        </Button>
        <Button
          variant='link'
          size='lg'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Link href='/'>
            <Home className='w-15 h-15' />
          </Link>
        </Button>
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
