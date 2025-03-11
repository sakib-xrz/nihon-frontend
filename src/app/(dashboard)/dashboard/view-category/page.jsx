import ViewCategory from '@/components/Dashbord/ViewCategory/ViewCategory'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <ViewCategory/>
        </Suspense>
    </div>
  )
}
