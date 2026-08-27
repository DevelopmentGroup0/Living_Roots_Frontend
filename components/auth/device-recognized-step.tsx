import { Loader2, ShieldCheck } from 'lucide-react'
import { StepIndicator } from './step-indicator'

export function DeviceRecognizedStep() {
  return (
    <div className='flex flex-col items-center py-6 text-center'>
      <div className='relative w-16 h-16 flex items-center justify-center mb-5'>
        <Loader2 className='absolute inset-0 w-16 h-16 animate-spin text-[#A6BC93]' />
        <ShieldCheck className='w-7 h-7 text-[#0E3321]' />
      </div>
      <h3 className='text-lg font-bold text-[#0E3321] mb-1'>
        Dispositivo reconocido
      </h3>
      <p className='text-sm text-[#386A4C]'>
        Tu dispositivo guardado fue verificado automáticamente...
      </p>
      <StepIndicator current={2} />
    </div>
  )
}
