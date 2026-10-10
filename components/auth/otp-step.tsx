'use client'

import { useEffect, useState } from 'react'
import { Loader2, MailCheck } from 'lucide-react'
import { OtpInput } from './otp-input'
import { StepIndicator } from './step-indicator'

const RESEND_COOLDOWN_SECONDS = 30

interface OtpStepProps {
  onSubmit: (code: string, rememberDevice: boolean) => void
  onResend: () => void
  isVerifying: boolean
  isResending: boolean
  error: string | null
}

export function OtpStep({
  onSubmit,
  onResend,
  isVerifying,
  isResending,
  error,
}: OtpStepProps) {
  const [code, setCode] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = () => {
    onResend()
    setCode('')
    setCooldown(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <div className='flex flex-col items-center text-center py-2'>
      <div className='w-14 h-14 rounded-full bg-[#D3E2CC] flex items-center justify-center mb-4'>
        <MailCheck className='w-6 h-6 text-green-950' />
      </div>
      <h3 className='text-lg font-bold text-green-950 mb-1'>
        Revisa tu correo
      </h3>
      <p className='text-sm text-green-800 mb-6 px-4'>
        Te enviamos un código de 6 dígitos. Ingrésalo para continuar.
      </p>

      <OtpInput value={code} onChange={setCode} disabled={isVerifying} />

      {error && <p className='text-red-600 text-[13px] mt-3'>{error}</p>}

      <label className='flex items-center gap-2 mt-5 text-sm text-lr-green-dark cursor-pointer select-none'>
        <input
          type='checkbox'
          checked={rememberDevice}
          onChange={(e) => setRememberDevice(e.target.checked)}
          className='w-4 h-4 accent-lr-green-dark'
        />
        Recordar este dispositivo por 60 días
      </label>

      <button
        type='button'
        disabled={code.length !== 6 || isVerifying}
        onClick={() => onSubmit(code, rememberDevice)}
        className='w-full bg-lr-green-dark hover:bg-foreground text-white rounded-full py-3.5 text-[15px] font-bold flex justify-center items-center gap-2 mt-6 transition-all disabled:opacity-70 disabled:cursor-not-allowed'
      >
        {isVerifying ? (
          <Loader2 className='animate-spin' size={20} />
        ) : (
          'Verificar código'
        )}
      </button>

      <button
        type='button'
        disabled={cooldown > 0 || isResending}
        onClick={handleResend}
        className='text-sm text-lr-green-dark mt-4 font-medium hover:underline disabled:opacity-70 disabled:cursor-not-allowed'
      >
        {isResending
          ? 'Reenviando...'
          : cooldown > 0
            ? `Reenviar código (${cooldown}s)`
            : 'Reenviar código'}
      </button>

      <StepIndicator current={2} />
    </div>
  )
}
