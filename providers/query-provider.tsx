'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState garantiza que cada sesión de usuario tenga su propio QueryClient
  // Si lo crearas fuera del componente, se compartiría entre requests en SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,      // datos frescos por 1 minuto
            retry: 1,                  // reintenta 1 vez antes de marcar error
            refetchOnWindowFocus: false, // evita refetch al cambiar de tab
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools solo aparece en desarrollo */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}