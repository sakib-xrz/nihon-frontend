import Link from 'next/link'
import React from 'react'

export default function Menu() {
  return (
    <div>
        <ul className='flex gap-4 items-center'>
            <li><Link className='font-bold text-[20px] text-white' href="">Home</Link></li>
            <li><Link className='font-bold text-[20px] text-white' href="">Shop</Link></li>
            <li><Link className='font-bold text-[20px] text-white' href="">Category</Link></li>
            <li><Link className='font-bold text-[20px] text-white' href="">ContactUs</Link></li>
        </ul>
    </div>
  )
}
