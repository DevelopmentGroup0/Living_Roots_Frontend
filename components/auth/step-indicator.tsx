interface StepIndicatorProps {
  current: number // 1-based
  total?: number
}

export function StepIndicator({ current, total = 3 }: StepIndicatorProps) {
  return (
    <div className='flex justify-center items-center gap-2 mt-6'>
      {Array.from({ length: total }).map((_, i) => {
        const stepNumber = i + 1
        const isDone = stepNumber < current
        const isActive = stepNumber === current

        return (
          <span
            key={stepNumber}
            className={
              isActive
                ? 'w-3 h-3 rounded-full bg-[#0E3321] ring-4 ring-[#0E3321]/20 transition-all'
                : isDone
                  ? 'w-2.5 h-2.5 rounded-full bg-[#5C9A6B] transition-all'
                  : 'w-2.5 h-2.5 rounded-full bg-[#D9D9D9] transition-all'
            }
          />
        )
      })}
    </div>
  )
}
