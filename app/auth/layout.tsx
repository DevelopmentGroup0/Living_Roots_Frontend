export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex min-h-screen justify-center bg-background font-sans dark:bg-black'>
      {children}
    </main>
  )
}
