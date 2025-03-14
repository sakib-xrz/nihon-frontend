"use client";

import ProductImageUpdate from '@/components/ProductImageUpdate'
import Loading from '@/components/Loading'
import { Suspense } from 'react'

export default function ProductImageUpdatePage() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ProductImageUpdate />
      </Suspense>
    </div>
  )
}
