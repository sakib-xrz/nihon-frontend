import AllOrder from "@/components/Dashbord/AllOrder/AllOrder";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <AllOrder/>
        </Suspense>
    </div>
  )
}
