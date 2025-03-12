import { Suspense } from "react";
import RecentProductCard from "./RecentProductCard";
import { BASE_URL } from "@/utils/contant";

export default async function PreOrder() {
  const res = await fetch(`${BASE_URL}/product/get-all-products`);
  const data = await res.json();
  const filterdata = data.data.filter(
    (item) => item?.isOnMarketStatus === "pre-order"
  );
  return (
    <div>
      <div>
        <h3 className="text-2xl md:text-4xl text-gray-700 font-bold my-3 text-center">
          Pre-Order Now for Early Access
        </h3>
        <Suspense>
          <RecentProductCard data={filterdata} />
        </Suspense>
      </div>
    </div>
  );
}
