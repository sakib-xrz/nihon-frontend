import { BASE_URL } from "@/utils/contant";
import RecentProductCard from "./RecentProductCard";

export default async function RecentProduct() {
  const res = await fetch(`${BASE_URL}/product/get-all-products`);
  const data = await res.json();

  return (
    <div>
      <div>
        <h3 className="text-2xl md:text-4xl text-gray-700 font-bold my-3 text-center">
          Recent Product
        </h3>
        <RecentProductCard data={data?.data} />
      </div>
    </div>
  );
}
