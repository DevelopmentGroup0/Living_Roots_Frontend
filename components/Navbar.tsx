import { UserAvatarButton } from './auth/user-button'
import { SearchBar } from './search/SearchBar'
import { SearchSymptom } from './search/SearchSymptom'

export function Navbar() {
  return (
    <nav className='h-16 bg-white border-b border-gray-200 flex items-center sm:px-6 sm:gap-6 justify-between'>
      <h2 className='hidden md:inline text-2xl font-serif italic text-amber-700 tracking-wide font-medium '>
        Recorriendo el Tul
      </h2>
      <div className='flex justify-center relative'>
        <SearchBar />
        <SearchSymptom />
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3 pl-4 border-l border-gray-200'>
          <UserAvatarButton />
        </div>
      </div>
    </nav>
  )
}
