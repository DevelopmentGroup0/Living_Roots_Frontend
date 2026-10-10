import { LoginForm } from '@/components/auth/login-form'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <main className=' min-h-screen flex flex-col items-center justify-center p-4 font-sans'>
      <Suspense
        fallback={
          <div className='bg-[#F2EFE8]/60 h-105 w-full max-w-105 animate-pulse rounded-4xl' />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
