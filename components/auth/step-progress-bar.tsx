'use client'

import { Film } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface StepConfig {
  label: string
  icon: typeof Film
}

interface StepProgressBarProps {
  steps: StepConfig[]
  currentStep: number
}

export function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
  const progressValue = ((currentStep + 1) / steps.length) * 100

  return (
    <div className='mb-6'>
      {/* Step indicators */}
      <div className='mb-3 flex items-center justify-between'>
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div key={step.label} className='flex items-center gap-2'>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCompleted
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border bg-secondary/50 text-muted-foreground'
                }`}
              >
                <StepIcon className='h-4 w-4' />
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className='bg-border mx-2 hidden h-px w-12 sm:block' />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <Progress value={progressValue} className='h-1.5' />

      {/* Step counter */}
      <div className='mt-2 flex items-center justify-center gap-2'>
        <span className='text-muted-foreground text-xs'>
          Paso {currentStep + 1} de {steps.length}
        </span>
      </div>
    </div>
  )
}
