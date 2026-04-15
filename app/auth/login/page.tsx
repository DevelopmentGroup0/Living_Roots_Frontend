import { Suspense } from 'react'
import { LoginFormWrapper } from '../../../components/ui/loader-wrapper/login-form-wrapper'

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className='bg-muted h-40 animate-pulse rounded-md' />}
    >
      <LoginFormWrapper />
    </Suspense>
  )
}
