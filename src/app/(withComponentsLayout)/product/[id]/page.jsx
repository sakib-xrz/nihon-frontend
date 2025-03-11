import Loading from "@/components/Loading";
import SingleProductCart from "@/components/SingleProductCart";
import { BASE_URL } from "@/utils/contant";
import { Suspense } from "react";

export default async function page({ params }) {
  const res = await fetch(
    `${BASE_URL}/product/get-single-product/${params.id}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <SingleProductCart data={data?.data} />
      </Suspense>
    </>
  );
}
