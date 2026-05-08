import { SVGProps } from 'react'

const LeafLogo = (props: SVGProps<SVGSVGElement>) => (
  <div className='bg-green-500 w-10 h-10 rounded-full flex justify-center items-center shadow-sm'>
    <svg {...props} viewBox='0 0 24 24' className='w-6 h-6 fill-[#ffffff]'>
      <path d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z' />
    </svg>
  </div>
)
export default LeafLogo
