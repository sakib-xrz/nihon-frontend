import { Suspense } from "react";
import BrandCard from "./BrandCard";
import Loading from "./Loading";
import { BASE_URL } from "@/utils/contant";

export default async function Brand() {
  const res = await fetch(`${BASE_URL}/brand/get-all-brands`, {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div
      className="container mx-auto"
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      data-aos-delay="500"
    >
      <Suspense fallback={<Loading />}>
        <BrandCard data={data} />
      </Suspense>
    </div>
  );
}
