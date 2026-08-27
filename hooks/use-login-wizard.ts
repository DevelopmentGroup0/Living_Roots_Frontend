'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  loginRequest,
  resendCodeRequest,
  verifyTwoFactorRequest,
} from '@/lib/auth/two-factor-api'

export type LoginWizardStep =
  | 'credentials'
  | 'device-recognized'
  | 'otp'
  | 'success'

interface UseLoginWizardOptions {
  onSuccess: (accessToken: string) => void | Promise<void>
}

export function useLoginWizard({ onSuccess }: UseLoginWizardOptions) {
  const [step, setStep] = useState<LoginWizardStep>('credentials')
  const [preAuthToken, setPreAuthToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
    onSuccess: (data) => {
      setError(null)
      if (data.requires2FA) {
        setPreAuthToken(data.preAuthToken)
        setStep('otp')
        return
      }
      // Dispositivo confiable: mostramos el paso "reconocido" un momento
      // (como en la referencia) antes de completar el login.
      setStep('device-recognized')
      setTimeout(() => {
        setStep('success')
        void onSuccess(data.access_token)
      }, 1200)
    },
    onError: (err: Error) => setError(err.message),
  })

  const verifyMutation = useMutation({
    mutationFn: ({
      code,
      rememberDevice,
    }: {
      code: string
      rememberDevice: boolean
    }) => {
      if (!preAuthToken) {
        throw new Error(
          'La sesión de verificación expiró, inicia sesión de nuevo',
        )
      }
      return verifyTwoFactorRequest(preAuthToken, code, rememberDevice)
    },
    onSuccess: async (data) => {
      setError(null)
      setStep('success')
      await onSuccess(data.access_token)
    },
    onError: (err: Error) => setError(err.message),
  })

  const resendMutation = useMutation({
    mutationFn: () => {
      if (!preAuthToken) {
        throw new Error(
          'La sesión de verificación expiró, inicia sesión de nuevo',
        )
      }
      return resendCodeRequest(preAuthToken)
    },
    onError: (err: Error) => setError(err.message),
  })

  return {
    step,
    error,
    submitCredentials: loginMutation.mutate,
    isSubmittingCredentials: loginMutation.isPending,
    submitOtp: verifyMutation.mutate,
    isVerifyingOtp: verifyMutation.isPending,
    resendCode: resendMutation.mutate,
    isResending: resendMutation.isPending,
  }
}
