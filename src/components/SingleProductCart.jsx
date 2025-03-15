"use client";
import { useFetchAllProductsQuery } from "@/redux/feathers/Product/ProductApi";
import {
  addProduct,
  decrementQuantity,
} from "@/redux/feathers/Product/ProductSlice";
import {
  Image as AntdImage,
  Breadcrumb,
  Button,
  InputNumber,
  Modal,
  Tag,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "sonner";
import "../style/singleProduct.css";
import Error from "./Error";
import Loading from "./Loading";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import GlobalModalCard from "./GlobalModalCard/GlobalModalCard";
import SingleProductSteps from "./SingleProductSteps";
import ProductCard from "./ProductCard";

export default function SingleProductCart({ data }) {
  const user = useSelector((state) => state.auth?.user);
  const currentCart = useSelector((state) => state?.products?.cartItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState(data?.images || []);
  const [singleProductData, setSingleProductData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectImage, setSelectImage] = useState(0);

  const {
    isLoading: productLoading,
    isError: productError,
    data: allProductData,
  } = useFetchAllProductsQuery([]);

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    return data?.discount?.value > 0
      ? data.discount.type === "percentage"
        ? data.price - (data.price * data.discount.value) / 100
        : data.price - data.discount.value
      : data.price;
  }, [data?.price, data?.discount]);

  const increment = async (product) => {
    try {
      setIsLoading(true);
      if (!user) {
        toast.warning(
          "Please log in to your account to add products to your cart."
        );
        return;
      }
      if (product?.in_stock === 0) {
        toast.error("This product is out of stock.");
        return;
      }
      dispatch(addProduct(product));
      toast.success("Product quantity increased.");
    } catch (error) {
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const decrement = async (product) => {
    try {
      setIsLoading(true);
      if (!user) {
        toast.warning(
          "Please log in to your account to add products to your cart."
        );
        return;
      }
      dispatch(decrementQuantity(product));
      toast.success("Product quantity decreased.");
    } catch (error) {
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const wishlistHandeler = async (item) => {
    try {
      setIsLoading(true);
      if (!user) {
        toast.warning(
          "Please log in to your account to add products to your wishlist."
        );
        return;
      }
      dispatch(toggleWishlistItem(item));
      toast.success("Wishlist updated successfully.");
    } catch (error) {
      toast.error("Failed to update wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handelAddToCart = async (product) => {
    try {
      setIsLoading(true);
      if (!user) {
        toast.warning(
          "Please log in to your account to add products to your cart."
        );
        return;
      }
      if (product?.in_stock === 0) {
        toast.error("This product is out of stock.");
        return;
      }
      dispatch(addProduct(product));
      toast.success("Product added to cart successfully.");
    } catch (error) {
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const settings = {
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
          dots: true,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  // Fetch product by category with loading and error states
  const categoryWiseData = useMemo(() => {
    if (!allProductData?.data?.length) return [];
    return allProductData.data
      .filter(
        (item) =>
          item?.category._id === data?.category._id && item?._id !== data?._id
      )
      .slice(0, 8);
  }, [allProductData?.data, data?.category._id, data?._id]);

  const renderRelatedProducts = () => {
    if (productLoading) return <Loading />;
    if (productError) return <Error error="Failed to load related products" />;
    if (!categoryWiseData.length)
      return <Error error="No related products found" />;

    return categoryWiseData.map((item) => (
      <div
        key={item?._id}
        className="p-2.5 transition-transform duration-300 hover:scale-[1.02]"
      >
        <ProductCard
          item={item}
          isOutOfStock={item?.in_stock <= 0}
          addToWishlist={wishlistHandeler}
          handleAddToCart={handelAddToCart}
          setOpen={setOpen}
          setSingleProductData={setSingleProductData}
          singleProductData={singleProductData}
          setSelectedImages={setSelectedImages}
          setSelectImage={setSelectImage}
          setTitle={setTitle}
        />
      </div>
    ));
  };

  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="py-5 md:px-10 sm:px-5 px-3 bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm">
        <Breadcrumb
          className="text-lg font-medium"
          items={[
            {
              title: (
                <Link
                  href="/"
                  className="hover:text-purple-600 transition-colors"
                >
                  Home
                </Link>
              ),
            },
            {
              title: (
                <Link
                  href={`/category/${data?.category?._id}`}
                  className="hover:text-purple-600 transition-colors"
                >
                  {data?.category?.name}
                </Link>
              ),
            },
            {
              title: <span className="text-gray-600">{data?.name}</span>,
            },
          ]}
        />
      </div>
      <div className="container mx-auto mt-10">
        <div className="grid grid-cols-12 ">
          <div className="mx-3 sm:mx-4 md:mx-5 col-span-12 md:col-span-6 space-y-6 px-4">
            <div className="relative group rounded-xl overflow-hidden flex items-center justify-center">
              {data?.in_stock === 0 && (
                <div className="absolute inset-0 z-20 backdrop-blur-[2px]">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 py-6 text-center backdrop-blur-sm">
                    <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      Out of Stock
                    </span>
                  </div>
                </div>
              )}
              <AntdImage
                src={selectedImages[selectedImage]}
                alt={`${data?.name} - Main Image`}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105 !size-96"
                preview={{
                  src: selectedImages[selectedImage],
                }}
              />
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              {selectedImages?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ring-2 ${
                    selectedImage === index
                      ? "ring-purple-500 shadow-lg shadow-purple-100"
                      : "ring-transparent hover:ring-purple-300"
                  }`}
                >
                  <Image
                    width={80}
                    height={80}
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    src={image}
                    alt={`${data?.name} - Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mx-3 sm:mx-4 md:mx-5 col-span-12 md:col-span-6 lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-medium text-gray-900">
                {data?.name}
              </h1>

              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                {data?.discount?.value > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      {discountedPrice} Tk
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {data?.price} Tk
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {data?.price} Tk
                  </span>
                )}
                {data?.discount?.value > 0 && (
                  <Tag color="red">
                    {data?.discount?.value}{" "}
                    {data?.discount?.type === "percentage" ? "%" : "Tk"} off
                  </Tag>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-sm ${
                    data?.in_stock === 0 ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      data?.in_stock === 0 ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  ></span>
                  {data?.in_stock === 0
                    ? "Out of Stock"
                    : `In Stock: ${data?.in_stock}`}
                </span>

                {data?.weight && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                    <i className="fa-solid fa-weight-scale"></i>
                    Weight: {data?.weight}
                  </span>
                )}

                {data?.isOnMarketStatus === "pre-order" && (
                  <Tag color="magenta">Upcoming</Tag>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => decrement(data)}
                  disabled={
                    !user ||
                    currentCart?.find((p) => p._id === data?._id)?.quantity <= 0
                  }
                >
                  <i className="fa-solid fa-minus"></i>
                </Button>
                <InputNumber
                  className="font-medium text-gray-900 w-16 text-center"
                  disabled
                  value={
                    currentCart?.find(
                      (checkProduct) => checkProduct?._id === data?._id
                    )?.quantity || 0
                  }
                />
                <Button
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => increment(data)}
                  disabled={!user || data?.in_stock === 0}
                >
                  <i className="fa-solid fa-plus"></i>
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handelAddToCart(data)}
                  disabled={!user || data?.in_stock === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all h-12 ${
                    !user || data?.in_stock === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-100"
                  }`}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  Add to Cart
                </Button>

                <Button
                  onClick={() => wishlistHandeler(data)}
                  disabled={!user}
                  className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
                    !user
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  <i className="fa-regular fa-heart text-lg"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* steps  */}
      <SingleProductSteps data={data}></SingleProductSteps>
      {/* steps  */}
      <div className="container mx-auto my-10">
        <h2 className="text-2xl font-bold py-5 px-10 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
          Related Products
        </h2>
        <div className="slider-container">
          {categoryWiseData.length > 0 ? (
            <Slider {...settings}>{renderRelatedProducts()}</Slider>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No related products found
            </div>
          )}
        </div>
      </div>
      <GlobalModalCard
        open={open}
        onClose={() => setOpen(false)}
        singleProductData={singleProductData}
        selectedImages={selectedImages}
        title={data?.name}
      />
    </div>
  );
}
