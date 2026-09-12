import React from 'react'

interface ChatLeafIconProps {
  size?: number
  className?: string
  leafColor?: string
}

export const ChatLeafIcon: React.FC<ChatLeafIconProps> = ({
  size = 24,
  className = '',
  leafColor = 'text-green-500',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='w-full h-full'
      >
        <path d='M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719' />
      </svg>

      <svg
        viewBox='0 0 24 24'
        className={`absolute -bottom-1 -right-1 w-1/2 h-1/2 fill-current ${leafColor}`}
      >
        <path d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z' />
      </svg>
    </div>
  )
}
