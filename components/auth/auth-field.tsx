'use client'

import { forwardRef, type ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface AuthFieldConfig {
  id: string
  label: string
  type: string
  placeholder: string
  icon: ReactNode
  autoComplete?: string
  required?: boolean
  suffix?: ReactNode
}

interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: AuthFieldConfig
  error?: string // Para mostrar mensajes de error de validación
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ field, error, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-2'>
        <Label htmlFor={field.id} className='text-foreground/80'>
          {field.label}
        </Label>
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'>
            {field.icon}
          </div>

          <Input
            {...props} // Aquí RHF inyecta name, onChange y onBlur
            ref={ref} // Conecta la referencia al input real
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            required={field.required ?? true}
            className={`bg-secondary/50 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-primary/30 h-11 pr-10 pl-10 ${
              error
                ? 'border-destructive focus-visible:ring-destructive/30'
                : ''
            }`}
          />

          {field.suffix && (
            <div className='absolute top-1/2 right-3 -translate-y-1/2'>
              {field.suffix}
            </div>
          )}
        </div>

        {/* Espacio para el mensaje de error */}
        {error && (
          <span className='text-destructive mt-1 text-xs'>{error}</span>
        )}
      </div>
    )
  }
)

AuthField.displayName = 'AuthField'
