import CheckOut from '@/components/CheckOut/CheckOut'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <CheckOut/>
      </Suspense>
    </div>
  )
}
