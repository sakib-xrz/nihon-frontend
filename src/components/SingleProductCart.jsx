"use client";
import { useFetchAllProductsQuery } from "@/redux/feathers/Product/ProductApi";
import { addProduct, decrementQuantity } from "@/redux/feathers/Product/ProductSlice";
import { Image as AntdImage, Breadcrumb, Button, InputNumber, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { toast } from "sonner";
import '../style/singleProduct.css';
import Error from "./Error";
import Loading from "./Loading";
import { toggleWishlistItem } from "@/redux/feathers/wishlist/wishlistSlice";
import GlobalModalCard from "./GlobalModalCard/GlobalModalCard";
import SingleProductSteps from "./SingleProductSteps";


export default function SingleProductCart({ data }) {
    const user = useSelector((state) => state.auth?.user);
    const currentCart = useSelector((state) => state?.products?.cartItem);
    const [singleProductData, setSingleProductData] = useState({});
    const [selectedImage, setSelectedImage] = useState(0); // Merge selectImage and selectedImage
    const [title, setTitle] = useState("");
    const [selectImage, setSelectImage] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const { isLoading: productLoading, isError: productError, data: allProductData } = useFetchAllProductsQuery([]);
    let product;
    const dispatch = useDispatch();

    const increment = (product) => {
        if (!user) {
            toast.warning("Please log in to your account to add products to your cart.");
        } else {
            dispatch(addProduct(product));
        }
    };

    const settings = {
        autoplay: true,
        arrows:false,
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

    const decrement = (product) => {
        if (!user) {
            toast.warning("Please log in to your account to add products to your cart.");
        } else {
            dispatch(decrementQuantity(product));
        }
    };

   
    const wishlistHandeler = (item) => {
        dispatch(toggleWishlistItem(item))
    };

    const handelAddToCart = (product) => {
        if (!user) {
            toast.warning("Please log in to your account to add products to your cart.");
        } else {
            dispatch(addProduct(product));
        }
    };

    // Fetch product by category
    if (productLoading) {
        product = <Loading />;
    }
    if (!productLoading && productError) {
        product = <Error error="Something went wrong" />;
    }
    if (!productLoading && !productError && allProductData?.data.length === 0) {
        product = <Error error="No Data Found" />;
    }
    if (!productLoading && !productError && allProductData.data.length > 0) {
        const categoryWiseData = allProductData.data.filter((item) => item?.category._id === data?.category._id);
        product = categoryWiseData.map((item) => (
            <div data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-delay="500" className='mt-5 mx-auto relative' key={item.title}>
                <div className="imgContainer">
                    {item?.images?.slice(0, 2).map((img, imgIndex) => (
                        <div key={imgIndex} className="img_single">
                            <Link href={`/product/${item?._id}`}>
                                <Image src={img} width={300} height={300} className='mx-auto text-center' alt={`Image ${imgIndex}`} />
                            </Link>
                        </div>
                    ))}
                    <div style={{ width: "300px", margin: '0 auto' }}>
                        <ul className='iconul flex flex-col justify-center items-center gap-8 rounded'>
                            <li><i onClick={()=>wishlistHandeler(item)} className="text-[20px] text-white fa-regular fa-heart"></i></li>
                            <li onClick={() => handelAddToCart(item)}><i className="text-[20px] text-white fa-solid fa-cart-shopping"></i></li>
                            <li onClick={() => { setOpen(true); setSingleProductData(item); setSelectedImages(item.images); setTitle(item.name); setSelectImage(0); }}>
                                <i className="text-[20px] text-white fa-solid fa-eye"></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex justify-evenly'>
                    <h4 className='font-medium p-2'>Price: {item?.price} Tk</h4>
                    <h4 className='font-medium p-2'>In Stock: {item?.in_stock}</h4>
                </div>
                <h3 className='font-bold text-[20px] text-gray-600 text-center'>{item?.name}</h3>
                {item?.isOnMarketStatus === 'pre-order' && <div className="absolute cursor-pointer right-2 top-0 w-[70px] h-[70px] rounded-full bg-white flex flex-col justify-center items-center text-gray-500 font-bold shadow-lg">
                    <p>Up</p>
                    <p>Coming</p>
                </div>}
            </div>
        ));
    }

    return (
        <div className="w-full">
            <div className="py-5 md:px-10 sm:px-5 px-3 bg-slate-100 flex gap-4 font-bold">
                <Breadcrumb
                    style={{ fontSize: "18px" }}
                    items={[
                        {
                            title: <Link href="/">Home</Link>,
                        },
                        {
                            title: <Link href={`/category/${data?.category?._id}`}>{data?.category?.name}</Link>,
                        },
                        {
                            title: data?.name,
                        },
                    ]}
                />
            </div>
            <div className="container mx-auto">
                <div className="grid grid-cols-12 ">
                    <div className="mx-3 sm:mx-4 md:mx-5 col-span-12 md:col-span-6 lg:col-span-7 justify-between items-center">
                        <div className="flex gap-5 justify-center items-center">
                            <div className="mt-5">
                                <AntdImage.PreviewGroup>
                                    <AntdImage src={data?.images[selectedImage]} width={400} height={500} alt="single product image" />
                                </AntdImage.PreviewGroup>
                            </div>
                            <div className="flex flex-col mt-5 gap-4">
                                {data?.images.map((item, index) => (
                                    <div data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-delay="500" key={index} className="cursor-pointer">
                                        <Image onClick={() => setSelectedImage(index)} width={100} height={100} src={item} alt={`Single product thumbnail ${index}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mx-3 sm:mx-4 md:mx-5 col-span-12 md:col-span-6 lg:col-span-5 justify-between items-center">
                        <h1 className="text-2xl sm:text-4xl text-gray-500">{data?.name}</h1>
                        <div className="flex items-center gap-5 p-4">
                            <h1 className="text-2xl text-gray-800">Price: $ {data?.price}</h1>
                            <h4 className="font-medium p-2">In Stock: {data?.in_stock}</h4>
                        </div>
                        <p className="text-gray-500 mt-4">{data?.desc.slice(0, 300)}</p>
                        <div className="flex gap-4 my-4 items-center">
                            <Button className="font-bold border-[#663130]" onClick={() => increment(singleProductData)}>
                                +
                            </Button>
                            <InputNumber
                                className="font-bold text-black"
                                disabled
                                value={currentCart?.find((checkProduct) => checkProduct?._id === singleProductData?._id)?.quantity || 0}
                            ></InputNumber>
                            <Button className="font-bold border-[#663130]" onClick={() => decrement(singleProductData)}>
                                -
                            </Button>
                        </div>
                        <Button onClick={() => handelAddToCart(singleProductData)} className="font-bold mr-3 border-[#663130]">
                            Add To Cart
                        </Button>

                        <Button onClick={() => wishlistHandeler(singleProductData)} className="font-bold mr-3 border-[#663130]">
                            Add To Wishlist
                        </Button>
                    </div>
                </div>
            </div>
            {/* steps  */}
            <SingleProductSteps data={data}></SingleProductSteps>
            {/* steps  */}
            <div className="container mx-auto my-10">
                <h2 className="text-2xl font-bold py-5 px-10 bg-slate-100">Relative products</h2>
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
        </div>
    );
}
