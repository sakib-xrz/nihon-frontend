import ViewBrand from "@/components/Dashbord/ViewBrand/ViewBrand";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <ViewBrand/>
        </Suspense>
    </div>
  )
}
