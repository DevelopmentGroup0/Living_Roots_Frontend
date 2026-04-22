import { Search, Bell } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { UserAvatarButton } from './auth/user-button'

export function Navbar() {
  return (
    <nav className='h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-6'>
      <div className='flex-1 flex justify-center'>
        <div className='w-full max-w-2xl relative'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
          <Input
            type='text'
            placeholder='Buscar plantas, síntomas, datos...'
            className='pl-12'
          />
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon'>
          <Bell className='w-5 h-5' />
        </Button>

        <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
          <UserAvatarButton />
        </div>
      </div>
    </nav>
  )
}
