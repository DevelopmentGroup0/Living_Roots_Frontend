'use client'

interface PasswordStrengthProps {
  value: string
}

export function PasswordStrength({ value }: PasswordStrengthProps) {
  // Lógica de cálculo de fuerza (0 a 4)
  const getStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const strength = value ? getStrength(value) : 0

  const strengthConfig = [
    { label: 'Muy débil', color: 'bg-muted' },
    { label: 'Débil', color: 'bg-red-500' },
    { label: 'Media', color: 'bg-yellow-500' },
    { label: 'Fuerte', color: 'bg-emerald-500' },
    { label: 'Muy fuerte', color: 'bg-blue-500' },
  ]

  const current = strengthConfig[strength]

  return (
    <div className='mt-1 flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-muted-foreground text-[10px] font-bold tracking-wider uppercase'>
          Seguridad: <span className='text-foreground'>{current.label}</span>
        </span>
      </div>

      <div className='flex h-1 gap-1.5'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-full flex-1 rounded-full transition-all duration-500 ${
              i < strength ? current.color : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      <p className='text-muted-foreground text-[11px] leading-tight'>
        Usa al menos 8 caracteres con letras, números y símbolos.
      </p>
    </div>
  )
}
