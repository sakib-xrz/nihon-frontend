import DashboardCategory from '@/components/Dashbord/DashboardCategory/DashboardCategory'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <DashboardCategory/>
        </Suspense>
    </div>
  )
}
