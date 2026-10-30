import { MobileNavTrigger } from './session/MobileNavTrigger'
import { UserAvatarButton } from './auth/user-button'
import { SearchBar } from './search/SearchBar'
import { SearchSymptom } from './search/SearchSymptom'

export function Navbar() {
  return (
    <nav className='flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 sm:gap-4 sm:px-6'>
      <MobileNavTrigger />

      <h2 className='hidden shrink-0 whitespace-nowrap font-serif text-2xl font-medium italic tracking-wide text-amber-700 xl:inline'>
        Recorriendo el Tul
      </h2>

      {/* Búsqueda + filtro: ocupan el espacio disponible y nunca desbordan */}
      <div className='flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3'>
        <div className='min-w-0 flex-1 md:max-w-xl'>
          <SearchBar />
        </div>
        <SearchSymptom />
      </div>

      <div className='shrink-0 border-l border-gray-200 pl-2 sm:pl-4'>
        <UserAvatarButton />
      </div>
    </nav>
  )
}
