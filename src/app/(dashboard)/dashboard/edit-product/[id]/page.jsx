import EditProduct from "@/components/Dashbord/EditProduct/EditProduct";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page({ params }) {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <EditProduct productId={params.id} />
            </Suspense>
        </div>
    )
}
