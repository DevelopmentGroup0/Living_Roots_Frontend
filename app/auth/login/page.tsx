import { LoginForm } from '@/components/auth/login-form'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className='bg-muted h-40 animate-pulse rounded-md' />}
    >
      <LoginForm />
    </Suspense>
  )
}
