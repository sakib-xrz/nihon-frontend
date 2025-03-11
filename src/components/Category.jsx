import { Suspense } from "react";
import CategoryCard from "./CategoryCard";
import Loading from "./Loading";
import { BASE_URL } from "@/utils/contant";

export default async function Category() {
  const res = await fetch(`${BASE_URL}/category/get-all-categories`, {
    cache: "no-store",
  });
  const data = await res.json();
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CategoryCard data={data} />
      </Suspense>
    </>
  );
}
