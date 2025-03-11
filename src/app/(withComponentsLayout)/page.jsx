import Banner from "@/components/Banner";
import Brand from "@/components/Brand";
import Category from "@/components/Category";
import PreOrder from "@/components/PreOrder";
import Product from "@/components/Product";
import RecentProduct from "@/components/RecentProduct";
import SkinCareBanner from "@/components/SkinCareBanner";
import Subscribe from "@/components/Subscribe";

export default function Home() {
  return (
    <div className="w-full">
      <Banner />
      <Category />
      <SkinCareBanner />
      <Product />
      <RecentProduct />
      <Subscribe />
      <Brand />
      <PreOrder />
    </div>
  );
}
