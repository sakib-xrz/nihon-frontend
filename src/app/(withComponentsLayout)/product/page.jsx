import PageHeader from '@/components/PageHeader'
import Shop from '@/components/Shop'
import React from 'react'

export default function page() {
  return (
    <>
      <div className='w-full'>
        <PageHeader title="SHOP" />
      </div>
      <div className=' w-[95%] mx-auto'>
        <Shop />
      </div>
    </>
  )
}
