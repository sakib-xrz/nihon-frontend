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
      <div style={{ width: "90%", margin: "0 auto" }}>
        <h2 className="text-2xl text-gray-700">
          Pre-Order Now for Early Access
        </h2>
        <Suspense>
          <RecentProductCard data={filterdata} />
        </Suspense>
      </div>
    </div>
  );
}
