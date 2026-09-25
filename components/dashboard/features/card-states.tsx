export function CardSkeleton({ className = 'h-40' }: { className?: string }) {
  return (
    <div
      role='status'
      aria-busy='true'
      aria-label='Cargando'
      className={`animate-pulse rounded-lg bg-[#0E3321]/6 ${className}`}
    />
  )
}
