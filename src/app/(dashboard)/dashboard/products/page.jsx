import DashbordProduct from "@/components/Dashbord/DashbordProduct/DashbordProduct";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DashbordProduct />
      </Suspense>
    </div>
  );
}
