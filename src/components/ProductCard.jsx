"use client";

import { useInWishlist } from "@/redux/feathers/wishlist/wishlistSlice";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  item,
  isOutOfStock,
  addToWishlist,
  handleAddToCart,
  setOpen,
  setSelectedImages,
  setSelectImage,
  setSingleProductData,
  setTitle,
}) {
  const isInWishlist = useInWishlist(item?._id);

  return (
    <div
      key={item?._id}
      className="group relative mx-auto mt-5 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100/50 hover:ring-purple-500/10"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 backdrop-blur-[2px]">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 py-6 text-center backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-900">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Out of Stock
              </span>
            </div>
          </div>
        )}
        {item?.discount?.value > 0 && (
          <div className="absolute -right-10 top-6 z-10 rotate-45 bg-gradient-to-r from-red-500 to-rose-500 px-12 py-1.5 text-xs font-bold tracking-wider text-white shadow-lg">
            {item.discount.type === "percentage"
              ? `${item.discount.value}% OFF`
              : `${item.discount.value}৳ OFF`}
          </div>
        )}
        <div className="relative h-full w-full group-hover:scale-105 transition-transform duration-500">
          {item?.images?.slice(0, 2).map((img, imgIndex) => (
            <div
              key={imgIndex}
              className={`absolute inset-0 transition-opacity duration-700 ${
                imgIndex === 0
                  ? "opacity-100 group-hover:opacity-0"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <Link href={`/product/${item?._id}`}>
                <Image
                  src={img}
                  fill
                  className="object-cover object-center"
                  alt={`${item?.name} - Image ${imgIndex + 1}`}
                />
              </Link>
            </div>
          ))}
        </div>

        <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform space-y-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={() => addToWishlist(item)}
            className={
              isInWishlist
                ? "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all bg-red-50 text-red-500 shadow-red-100"
                : "flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-red-50 hover:text-red-500 hover:shadow-red-100"
            }
          >
            <i className="fa-regular fa-heart text-lg"></i>
          </button>
          <button
            onClick={() => handleAddToCart(item)}
            disabled={isOutOfStock}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all ${
              isOutOfStock
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-50 hover:text-blue-500 hover:shadow-blue-100"
            }`}
          >
            <i className="fa-solid fa-cart-shopping text-lg"></i>
          </button>
          <button
            onClick={() => {
              setOpen(true);
              setSingleProductData(item);
              setSelectedImages(item.images);
              setTitle(item.name);
              setSelectImage(0);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-purple-50 hover:text-purple-500 hover:shadow-purple-100"
          >
            <i className="fa-solid fa-eye text-lg"></i>
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <Link href={`/product/${item?._id}`}>
          <h3 className="line-clamp-1 text-lg font-medium text-gray-900 transition-colors hover:text-[#f472b6]">
            {item?.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between border-t border-dashed border-gray-100 pt-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {item?.discount?.value > 0 ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    {item?.discountedPrice} Tk
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {item?.price} Tk
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {item?.price} Tk
                </span>
              )}
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-sm ${
                isOutOfStock ? "text-red-500" : "text-emerald-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOutOfStock ? "bg-red-500" : "bg-emerald-500"
                }`}
              ></span>
              {isOutOfStock ? "Out of Stock" : `In Stock: ${item?.in_stock}`}
            </span>
          </div>
        </div>
      </div>

      {item?.isOnMarketStatus === "pre-order" && (
        <div className="absolute right-4 top-4 z-20">
          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center font-bold">
              <div className="space-y-0.5 text-[10px] tracking-wide text-purple-700">
                <p>UP</p>
                <p>COMING</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
