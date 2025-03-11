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

  const handelAddToCart = (product) => {
    if (product?.in_stock <= 0) {
      toast.warning("This product is out of stock.");
      return;
    }
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

  return (
    <>
      <div className="container mx-auto my-10">
        <div className="slider-container">
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
