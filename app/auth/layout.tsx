import Image from 'next/image'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='grid min-h-screen bg-background font-sans dark:bg-black lg:grid-cols-2'>
      {/* Columna izquierda: paisaje. Oculta en mobile para dejar el
         formulario a pantalla completa (según lo definido). */}
      <div className='relative hidden lg:block'>
        <Image
          src='/images/hidroelectrica.png'
          alt='Paisaje de Morales, Cauca'
          fill
          priority
          sizes='50vw'
          className='object-cover'
        />
      </div>

      {/* Columna derecha: formulario centrado. La tarjeta/borde ya la
         trae LoginForm, así que aquí solo centramos. */}
      <div className='flex items-center justify-center p-6 sm:p-0'>
        {children}
      </div>
    </main>
  )
}
