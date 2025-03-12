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
  return (
    <div
      key={item?._id}
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      data-aos-delay="500"
      className="mt-5 mx-auto relative"
    >
      <div className="imgContainer relative group">
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
              zIndex: 20,
            }}
          >
            Out of Stock
          </div>
        )}
        {item?.discount?.value > 0 && (
          <div
            className="discount-badge"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#ff4444",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              zIndex: 25,
              fontSize: "0.9rem",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {item.discount.type === "percentage"
              ? `${item.discount.value}% OFF`
              : `${item.discount.value}৳ OFF`}
          </div>
        )}
        <div className="relative z-10">
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
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ul className="iconul flex flex-col justify-center items-center gap-8 rounded z-30">
            <li>
              <i
                onClick={() => addToWishlist(item)}
                className="text-[20px] text-white fa-regular fa-heart"
              ></i>
            </li>
            <li onClick={() => handleAddToCart(item)}>
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
        <div className="p-2">
          <h4 className="font-medium">
            {item?.discount?.value > 0 ? (
              <>
                <span className="text-red-600">{item?.discountedPrice} Tk</span>
                <span className="ml-2 text-gray-400 line-through text-sm">
                  {item?.price} Tk
                </span>
              </>
            ) : (
              <span>{item?.price} Tk</span>
            )}
          </h4>
        </div>
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
}
