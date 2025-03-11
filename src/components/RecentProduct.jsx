import { BASE_URL } from "@/utils/contant";
import RecentProductCard from "./RecentProductCard";

export default async function RecentProduct() {
  const res = await fetch(`${BASE_URL}/product/get-all-products`);
  const data = await res.json();

  return (
    <div>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <h2 className="text-2xl text-gray-700">Recent Product</h2>
        <RecentProductCard data={data?.data} />
      </div>
    </div>
  );
}
