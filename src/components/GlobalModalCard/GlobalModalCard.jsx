"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addProduct,
  decrementQuantity,
} from "@/redux/feathers/Product/ProductSlice";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import { Button, InputNumber, Modal, Tag, Tooltip } from "antd";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function GlobalModalCard({
  open,
  onClose,
  singleProductData,
  title,
  selectImage: initialSelectImage = 0,
  selectedImages: initialSelectedImages = [],
}) {
  const currentCart = useSelector((state) => state?.products?.cartItem);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();
  const [selectImage, setSelectImage] = useState(initialSelectImage);
  const [selectedImages, setSelectedImages] = useState(initialSelectedImages);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (singleProductData?.images) {
      setSelectedImages(singleProductData.images);
    }
  }, [singleProductData?.images]);

  useEffect(() => {
    setSelectImage(initialSelectImage);
  }, [initialSelectImage]);

  useEffect(() => {
    setSelectedImages(initialSelectedImages);
  }, [initialSelectedImages]);

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    return singleProductData?.discount?.value > 0
      ? singleProductData.discount.type === "percentage"
        ? singleProductData.price -
          (singleProductData.price * singleProductData.discount.value) / 100
        : singleProductData.price - singleProductData.discount.value
      : singleProductData.price;
  }, [singleProductData?.price, singleProductData?.discount]);

  const wishlistHandler = async (item) => {
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

  const handleAddToCart = async (product) => {
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

  const getQuantityInCart = (productId) => {
    const cartItem = currentCart?.find((item) => item._id === productId);
    return cartItem?.quantity || 0;
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      className="quick-view-modal"
      destroyOnClose
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto p-6">
        <div className="space-y-6">
          <div className="relative group rounded-xl overflow-hidden">
            {singleProductData?.in_stock === 0 && (
              <div className="absolute inset-0 z-20 backdrop-blur-[2px]">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/80 py-6 text-center backdrop-blur-sm">
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    Out of Stock
                  </span>
                </div>
              </div>
            )}
            <Image
              src={selectedImages?.[selectImage]}
              width={400}
              height={400}
              className="rounded-lg size-80 aspect-square transition-all duration-500 group-hover:scale-105 object-cover mx-auto"
              alt={`${title} - Main Image`}
            />
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            {selectedImages?.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectImage(index)}
                className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ring-2 ${
                  selectImage === index
                    ? "ring-purple-500 shadow-lg shadow-purple-100"
                    : "ring-transparent hover:ring-purple-300"
                }`}
              >
                <Image
                  width={80}
                  height={80}
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  src={item}
                  alt={`${title} - Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl font-medium text-gray-900">
              {title}
            </h2>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              {singleProductData?.discount?.value > 0 ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    {discountedPrice} Tk
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {singleProductData?.price} Tk
                  </span>
                  <Tag color="red" className="animate-pulse">
                    {singleProductData?.discount?.value}{" "}
                    {singleProductData?.discount?.type === "percentage"
                      ? "%"
                      : "Tk"}{" "}
                    off
                  </Tag>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {singleProductData?.price} Tk
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Tooltip
                title={
                  singleProductData?.in_stock === 0
                    ? "Out of Stock"
                    : `${singleProductData?.in_stock} items available`
                }
              >
                <span
                  className={`inline-flex items-center gap-1.5 text-sm ${
                    singleProductData?.in_stock === 0
                      ? "text-red-500"
                      : singleProductData?.in_stock <= 5
                      ? "text-orange-500"
                      : "text-emerald-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      singleProductData?.in_stock === 0
                        ? "bg-red-500"
                        : singleProductData?.in_stock <= 5
                        ? "bg-orange-500"
                        : "bg-emerald-500"
                    } animate-pulse`}
                  ></span>
                  {singleProductData?.in_stock === 0
                    ? "Out of Stock"
                    : singleProductData?.in_stock <= 5
                    ? "Low Stock"
                    : "In Stock"}
                </span>
              </Tooltip>

              {singleProductData?.weight && (
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                  <i className="fa-solid fa-weight-scale"></i>
                  Weight: {singleProductData.weight}
                </span>
              )}
            </div>

            <div className="pt-4 space-y-4">
              {singleProductData?.description && (
                <p className="text-gray-600 leading-relaxed">
                  {singleProductData.description}
                </p>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="default"
                    size="large"
                    disabled={
                      !user ||
                      singleProductData?.in_stock === 0 ||
                      getQuantityInCart(singleProductData?._id) <= 0
                    }
                    onClick={() => decrement(singleProductData)}
                    loading={isLoading}
                    className="flex items-center justify-center"
                  >
                    <i className="fa-solid fa-minus"></i>
                  </Button>
                  <InputNumber
                    min={0}
                    max={singleProductData?.in_stock}
                    value={getQuantityInCart(singleProductData?._id)}
                    disabled
                    className="w-16 text-center"
                  />
                  <Button
                    type="default"
                    size="large"
                    disabled={
                      !user ||
                      singleProductData?.in_stock === 0 ||
                      getQuantityInCart(singleProductData?._id) >=
                        singleProductData?.in_stock
                    }
                    onClick={() => increment(singleProductData)}
                    loading={isLoading}
                    className="flex items-center justify-center"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </Button>
                </div>

                <Button
                  type="primary"
                  size="large"
                  disabled={!user || singleProductData?.in_stock === 0}
                  onClick={() => handleAddToCart(singleProductData)}
                  loading={isLoading}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <i className="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </Button>

                <Button
                  type="default"
                  size="large"
                  onClick={() => wishlistHandler(singleProductData)}
                  loading={isLoading}
                  className="flex items-center justify-center hover:text-red-500 hover:border-red-500"
                >
                  <i className="fa-solid fa-heart"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
