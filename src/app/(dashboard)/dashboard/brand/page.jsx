import DashboardBrand from "@/components/Dashbord/DashboardBrand/DashboardBrand";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <DashboardBrand/>
        </Suspense>
    </div>
  )
}
