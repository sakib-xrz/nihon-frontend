import React from 'react'

export default function Error({error}) {
  return (
    <div className='text-2xl text-center py-3 my-4 text-red-500 font-bold'>{error}</div>
  )
}
