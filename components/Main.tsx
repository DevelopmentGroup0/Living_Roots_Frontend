'use client'
import { useState } from 'react'
import { HerbCard } from './herbs/HerbCard'
import { Plant } from './herbs/interfaces'
// import { Chat } from './Chat'
export function Main({ herbs }: { herbs: Plant[] }) {
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  return (
    <>
      <main
        className='flex-1 overflow-auto p-6 transition-all duration-300'
        style={{
          marginRight: isChatExpanded ? '400px' : '0',
        }}
      >
        <div
          className={`grid gap-6 max-w-7xl mx-auto transition-all duration-300 ${
            isChatExpanded ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {herbs.map((h) => (
            <HerbCard key={h.herb_Id} plant={h} />
          ))}
        </div>
      </main>
      {/* <Chat isExpanded={isChatExpanded} onExpandedChange={setIsChatExpanded} /> */}
    </>
  )
}
