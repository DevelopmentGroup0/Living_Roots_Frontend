import { RegisterForm } from '@/components/auth/register-form'
import { Suspense } from 'react'

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className='bg-muted h-40 animate-pulse rounded-md' />}
    >
      <RegisterForm />
    </Suspense>
  )
}
