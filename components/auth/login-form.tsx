'use client'

// ¡Importante! Asegúrate de que Mail y Lock estén en tu importación
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loginSchema, LoginValues } from './validation-sh'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (!result?.error) {
        router.push('/')
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-card-crema rounded-4xl px-8 py-9 w-full max-w-105 shadow-[0_15px_40px_rgba(0,0,0,0.06)] font-sans text-[#0E3321]">
      
      {/* Textos de Bienvenida dentro de la tarjeta */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-[32px] font-bold font-serif mb-2 text-[#0E3321]">
          Bienvenido
        </h2>
        <p className="text-[15px] italic text-[#386A4C] leading-snug px-4">
          Inicia sesión para acceder a tu herbario y catálogo botánico
        </p>
      </div>

      <form className='flex flex-col gap-5 relative z-10' onSubmit={handleSubmit(onSubmit)}>
        
        {/* Email */}
        <div>
          <label className="block text-[15px] font-bold mb-2 text-[#0E3321]">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0E3321]">
              <Mail size={18} strokeWidth={2.5} />
            </div>
            <input 
              type="email"
              placeholder="andres.buittron@example.com" 
              {...register('email')}
              /* Input redondeado completo con color verde oliva */
              className="w-full bg-[#BDD0AC] border border-[#A6BC93] rounded-full pl-12 pr-4 py-3.5 text-[15px] text-[#0E3321] outline-none placeholder:text-[#0E3321]/60 focus:border-[#0E3321] transition-all"
            />
          </div>
          {errors.email && <span className="text-red-600 text-[12px] mt-1 ml-4 block">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[15px] font-bold mb-2 text-[#0E3321]">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0E3321]">
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••" 
              {...register('password')}
              className="w-full bg-[#BDD0AC] border border-[#A6BC93] rounded-full pl-12 pr-12 py-3.5 text-[15px] text-[#0E3321] outline-none focus:border-[#0E3321] transition-all tracking-widest placeholder:tracking-widest"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0E3321] hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="text-red-600 text-[12px] mt-1 ml-4 block">{errors.password.message}</span>}
        </div>

        {/* ¿Olvidaste tu contraseña? */}
        <div className="mt-1">
          <Link href='#' className='text-[#0E3321] text-[14px] font-medium hover:underline'>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Botón Entrar */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#0F3521] hover:bg-[#092215] text-white rounded-full py-3.75 text-[16px] font-bold flex justify-center items-center gap-2 mt-2 transition-all disabled:opacity-70 shadow-md"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
            <>
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-white">
                <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z"/>
              </svg>
              Entrar
            </>
          )}
        </button>
      </form>
    </div>
  )
}