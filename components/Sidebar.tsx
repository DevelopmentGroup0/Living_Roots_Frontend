import { Home, Leaf, BarChart3, Settings, Users } from 'lucide-react'
import { Button } from './ui/button'

export function Sidebar() {
  return (
    <aside className='w-16 h-screen bg-gray-900 border-r border-gray-700 flex flex-col items-center py-6 gap-8'>
      <div className='w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center'>
        <Leaf className='w-6 h-6 text-white' />
      </div>

      <nav className='flex flex-col gap-6'>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Home className='w-5 h-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <BarChart3 className='w-5 h-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Users className='w-5 h-5' />
        </Button>
      </nav>

      <div className='mt-auto'>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-white hover:bg-gray-800'
        >
          <Settings className='w-5 h-5' />
        </Button>
      </div>
    </aside>
  )
}
