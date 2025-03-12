"use client";
import {
  addProduct,
  decrementQuantity,
} from "@/redux/feathers/Product/ProductSlice";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "sonner";
import GlobalModalCard from "./GlobalModalCard/GlobalModalCard";
import ProductCard from "./ProductCard";

export default function RecentProductCard({ data }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const currentCart = useSelector((state) => state?.products?.cartItem);
  const [singleProductData, setSingleProductData] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [title, setTitle] = useState("");
  const [selectImage, setSelectImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const addToWishlist = (item) => {
    dispatch(toggleWishlistItem(item));
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.warning(
        "Please log in to your account to add products to your cart."
      );
    } else {
      dispatch(addProduct(product));
    }
  };

  const settings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const product = data.map((item) => {
    const isOutOfStock = item?.in_stock <= 0;
    return (
      <div key={item?._id} className="p-2.5">
        <ProductCard
          item={item}
          isOutOfStock={isOutOfStock}
          addToWishlist={addToWishlist}
          handleAddToCart={handleAddToCart}
          setOpen={setOpen}
          setSelectedImages={setSelectedImages}
          setSelectImage={setSelectImage}
          setSingleProductData={setSingleProductData}
          setTitle={setTitle}
        />
      </div>
    );
  });

  return (
    <>
      <div className="container mx-auto my-10">
        <div>
          <Slider {...settings}>{product}</Slider>
        </div>
      </div>
      <GlobalModalCard
        open={open}
        onClose={() => setOpen(false)}
        singleProductData={singleProductData}
        selectedImages={selectedImages}
        title={title}
      />
    </>
  );
}
