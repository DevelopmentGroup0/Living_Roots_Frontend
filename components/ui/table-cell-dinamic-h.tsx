import { useState } from 'react'
export const ExpandableDescription = ({
  description,
}: {
  description: string
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='w-58'>
      <div
        className={
          isExpanded
            ? 'wrap-break-word whitespace-pre-wrap'
            : 'whitespace-normal line-clamp-2 overflow-hidden'
        }
      >
        {description}
      </div>
      {description.length > 60 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-blue-500 hover:underline text-xs mt-1 block'
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  )
}
