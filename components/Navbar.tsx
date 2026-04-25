import { Bell } from 'lucide-react'

import { Button } from './ui/button'
import { UserAvatarButton } from './auth/user-button'
import { SearchBar } from './search/SearchBar'

export function Navbar() {
  return (
    <nav className='h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-6'>
      <div className='flex-1 flex justify-center'>
        <SearchBar />
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
