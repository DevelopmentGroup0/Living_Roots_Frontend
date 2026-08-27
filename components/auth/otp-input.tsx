'use client'

import { useRef } from 'react'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const digits = value.padEnd(length, ' ').split('').slice(0, length)

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit || ' '
    onChange(next.join('').trimEnd())
  }

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setDigit(index, digit)
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length)
    if (!pasted) return
    e.preventDefault()
    onChange(pasted)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className='flex justify-center gap-2.5' onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={digit.trim()}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className='w-12 h-14 text-center text-xl font-bold bg-[#BDD0AC] border border-[#A6BC93] rounded-2xl text-[#0E3321] outline-none focus:border-[#0E3321] transition-all disabled:opacity-60'
        />
      ))}
    </div>
  )
}
