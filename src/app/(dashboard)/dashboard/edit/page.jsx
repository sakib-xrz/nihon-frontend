import ProductEdit from "@/components/Dashbord/ProductEdit/ProductEdit";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
        <Suspense fallback={<Loading/>}>
            <ProductEdit/>
        </Suspense>
    </div>
  )
}
