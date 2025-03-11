import AddNewProduct from "@/components/Dashbord/AddNewProduct/AddNewProduct";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page() {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <AddNewProduct />
            </Suspense>
        </div>
    )
}
