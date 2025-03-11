import Cart from '@/components/Cart/Cart'
import Loading from '@/components/Loading'
import { Suspense } from 'react'

export default function page() {
  return (
    <>
      <Suspense fallback={<Loading/>}>
        <Cart/>
      </Suspense>
    </>
  )
}
