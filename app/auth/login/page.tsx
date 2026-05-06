import { LoginForm } from '@/components/auth/login-form'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <main className="bg-living-roots min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Título y Logo SUPERIOR */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#D3E2CC] w-[45px] h-[45px] rounded-full flex justify-center items-center shadow-sm">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#0E3321]">
            <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z"/>
          </svg>
        </div>
        <h1 className="text-[26px] font-semibold text-[#0E3321] m-0">Living Roots</h1>
      </div>

      <Suspense fallback={<div className='bg-[#F2EFE8]/60 h-[420px] w-full max-w-[420px] animate-pulse rounded-[32px]' />}>
        <LoginForm />
      </Suspense>

      {/* 🛑 ELIMINADO: Ya no está el link de "Crea tu cuenta" aquí abajo */}
      
    </main>
  )
}