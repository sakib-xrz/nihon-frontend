import User from "@/components/Dashbord/User/User"
import Loading from "@/components/Loading"
import { Suspense } from "react"

export default async function  page() {
   
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <User />
        </Suspense>
    </div>
  )
}
