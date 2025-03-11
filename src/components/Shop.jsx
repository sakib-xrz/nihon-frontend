"use client";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllProductsQuery } from "@/redux/feathers/Product/ProductApi";
import {
  addProduct,
  decrementQuantity,
} from "@/redux/feathers/Product/ProductSlice";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import { FilterFilled } from "@ant-design/icons";
import { Input, Pagination, Radio, Select, Slider, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import "../style/shop.css";
import Error from "./Error";
import GlobalModalCard from "./GlobalModalCard/GlobalModalCard";
import Loading from "./Loading";
import { sanitizeParams } from "@/utils";

const { Option } = Select;

function Shop() {
  const user = useSelector((state) => state?.auth?.user);
  const currentCart = useSelector((state) => state?.products?.cartItem);
  const {
    isLoading: categoryLoading,
    isError: categoryError,
    data: categoryData,
  } = useFetchAllCategoryQuery();
  const {
    isLoading: brandLoading,
    isError: brandError,
    data: brandData,
  } = useFetchAllBrandQuery();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [selectImage, setSelectImage] = useState(0);
  const [singleProductData, setSingleProductData] = useState({});
  const [placement, setPlacement] = useState("right");
  const [categoryValue, setCategoryValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);

  let totalProduct = 0;

  // Fetch product data with filters
  const {
    isLoading: productLoading,
    isError: productError,
    data: productData,
  } = useFetchAllProductsQuery(
    sanitizeParams({
      category: categoryValue,
      brand: brandValue,
      searchTerm: searchTerm,
      page: page,
      limit: limit,
      minPrice: minPrice,
      maxPrice: maxPrice,
    })
  );

  totalProduct = productData?.meta?.total;

  const onChangeCategory = (e) => {
    setCategoryValue(e.target.value);
  };

  const onChangeBrand = (e) => {
    setBrandValue(e.target.value);
  };

  const addToWishlist = (item) => {
    dispatch(toggleWishlistItem(item));
  };

  const handelAddToCart = (product) => {
    if (!user) {
      toast.warning(
        "Please log in to your account to add products to your cart."
      );
    } else {
      dispatch(addProduct(product));
    }
  };

  const increment = (product) => {
    if (!user) {
      toast.warning(
        "Please log in to your account to add products to your cart."
      );
    } else {
      dispatch(addProduct(product));
    }
  };

  const decrement = (product) => {
    if (!user) {
      toast.warning(
        "Please log in to your account to add products to your cart."
      );
    } else {
      dispatch(decrementQuantity(product));
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  // Rendering product content
  let content = null;

  if (productLoading) {
    content = <Loading />;
  } else if (productError) {
    content = <Error error="Something went wrong" />;
  } else if (!productData || productData?.data?.length === 0) {
    content = <Error error="No Data Found" />;
  } else {
    content = productData?.data?.map((item) => {
      const isOutOfStock = item?.in_stock <= 0;
      return (
        <div
          key={item?._id}
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="500"
          className="mt-5 mx-auto relative"
        >
          <div className="imgContainer" style={{ position: "relative" }}>
            {isOutOfStock && (
              <div
                className="out-of-stock-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "1.5rem",
                  zIndex: 2,
                }}
              >
                Out of Stock
              </div>
            )}
            {item?.images?.slice(0, 2).map((img, imgIndex) => (
              <div key={imgIndex} className="img_single">
                <Link href={`/product/${item?._id}`}>
                  <Image
                    src={img}
                    width={300}
                    height={300}
                    className="mx-auto text-center"
                    alt={`Image ${imgIndex}`}
                  />
                </Link>
              </div>
            ))}
            <div style={{ width: "300px", margin: "0 auto" }}>
              <ul className="iconul flex flex-col justify-center items-center gap-8 rounded z-50">
                <li>
                  <i
                    onClick={() => addToWishlist(item)}
                    className="text-[20px] text-white fa-regular fa-heart"
                  ></i>
                </li>
                <li onClick={() => handelAddToCart(item)}>
                  <i
                    className={`text-[20px] ${
                      isOutOfStock ? "text-gray-400" : "text-white"
                    } fa-solid fa-cart-shopping`}
                  ></i>
                </li>
                <li
                  onClick={() => {
                    setOpen(true);
                    setSingleProductData(item);
                    setSelectedImages(item.images);
                    setTitle(item.name);
                    setSelectImage(0);
                  }}
                >
                  <i className="text-[20px] text-white fa-solid fa-eye"></i>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-evenly">
            <h4 className="font-medium p-2">Price: {item?.price} Tk</h4>
            <h4 className="font-medium p-2">
              {isOutOfStock ? "Out of Stock" : `In Stock: ${item?.in_stock}`}
            </h4>
          </div>
          <h3 className="font-bold text-[20px] text-gray-600 text-center">
            {item?.name}
          </h3>
          {item?.isOnMarketStatus === "pre-order" && (
            <div className="absolute cursor-pointer right-2 top-0 w-[70px] h-[70px] rounded-full bg-white flex flex-col justify-center items-center text-gray-500 font-bold shadow-lg">
              <p>Up</p>
              <p>Coming</p>
            </div>
          )}
        </div>
      );
    });
  }

  // Rendering category content
  let categoryContent = null;

  if (categoryLoading) {
    categoryContent = <Loading />;
  } else if (categoryError) {
    categoryContent = <Error text="Something went wrong" />;
  } else if (!categoryData || categoryData?.data?.length === 0) {
    categoryContent = <Error text="No Data Found" />;
  } else {
    categoryContent = categoryData?.data?.map((item, index) => (
      <div key={index}>
        <Radio
          className="text-gray-400 text-[18px] mt-2 font-bold"
          value={item?._id}
        >
          {item?.name}
        </Radio>
      </div>
    ));
  }

  // Rendering brand content
  let brandContent = null;

  if (brandLoading) {
    brandContent = <Loading />;
  } else if (brandError) {
    brandContent = <Error text="Something went wrong" />;
  } else if (!brandData || categoryData?.data?.length === 0) {
    brandContent = <Error text="No Data Found" />;
  } else {
    brandContent = brandData?.data?.map((item, index) => (
      <div key={index}>
        <Radio
          className="text-gray-400 text-[18px] font-bold mt-2"
          value={item?._id}
        >
          {item?.name}
        </Radio>
      </div>
    ));
  }

  // Determine the maximum price for the slider
  const maximumPrice = productData?.data?.reduce((max, item) => {
    return item.price > max ? item.price : max;
  }, minPrice);

  const onSortChange = (values) => {
    setSort(values);
  };
  const handlePriceSlider = (values) => {
    setMinPrice(values);
  };

  return (
    <div className="w-full">
      <div
        className="container text-center my-8 mx-auto"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-delay="500"
      >
        <Input
          size="large"
          style={{ width: "60%" }}
          placeholder="Search Your Product"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mobileFilter">
        <div className="grid grid-cols-1 md:grid-cols-2 justify-center bg-slate-100 mx-auto p-4">
          <div>
            <h3 className="text-bold text-gray-700 font-bold mt-5">
              Categories
            </h3>
            <Radio.Group onChange={onChangeCategory} value={categoryValue}>
              <Space direction="vertical">
                <div>{categoryContent}</div>
              </Space>
            </Radio.Group>
          </div>

          <div>
            <h3 className="text-bold text-gray-700 font-bold mt-5">Brand</h3>
            <Radio.Group onChange={onChangeBrand} value={brandValue}>
              <Space direction="vertical">{brandContent}</Space>
            </Radio.Group>
          </div>
        </div>
      </div>
      <div className="w-full px-5">
        <div className="flex gap-5">
          <div className="dasktopfilter filter w-[350px] p-4">
            <Select
              className="mt-5 w-full"
              placeholder="Sort by Product"
              onChange={onSortChange}
              suffixIcon={<FilterFilled />}
            >
              <Option value="lowToHigh">Price: Low to High</Option>
              <Option value="highToLow">Price: High to Low</Option>
              <Option value="rating">Sort by Rating</Option>
            </Select>

            <h3 className="text-bold text-gray-700 font-bold mt-5">
              Price Range
            </h3>

            <Slider
              defaultValue={minPrice}
              max={maximumPrice}
              onChange={handlePriceSlider}
            />
            <h3 className="text-bold text-gray-700 font-bold mt-5">
              Categories
            </h3>
            <Radio.Group onChange={onChangeCategory} value={categoryValue}>
              <Space direction="vertical">
                <div>{categoryContent}</div>
              </Space>
            </Radio.Group>

            <h3 className="text-bold text-gray-700 font-bold mt-5">Brand</h3>
            <Radio.Group onChange={onChangeBrand} value={brandValue}>
              <Space direction="vertical">{brandContent}</Space>
            </Radio.Group>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {content}
            </div>
          </div>
        </div>
        <div className="flex justify-center my-10">
          <Pagination
            className="text-center"
            current={page}
            total={totalProduct}
            pageSize={limit}
            onChange={handlePageChange}
          />
        </div>
      </div>
      <GlobalModalCard
        open={open}
        onClose={() => setOpen(false)}
        singleProductData={singleProductData}
        selectedImages={selectedImages}
        title={title}
      />
    </div>
  );
}

export default Shop;
