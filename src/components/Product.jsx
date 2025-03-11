"use client";
import { useFetchAllProductsQuery } from '@/redux/feathers/Product/ProductApi';
import { addProduct } from '@/redux/feathers/Product/ProductSlice';
import { toggleWishlistItem } from '@/redux/feathers/wishlist/wishlistSlice';
import { Pagination } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import '../style/productCart.css';
import Error from './Error';
import GlobalModalCard from './GlobalModalCard/GlobalModalCard';
import Loading from './Loading';

export default function Product() {
    const user = useSelector((state) => state?.auth?.user);
    const currentCart = useSelector((state) => state?.products?.cartItem);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [open, setOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [title, setTitle] = useState('');
    const [selectImage, setSelectImage] = useState(0);
    const [singleProductData, setSingleProductData] = useState({});
    
    const { isLoading, isError, data } = useFetchAllProductsQuery([
        { name: 'page', value: page || 1 },
        { name: 'limit', value: limit },
        { name: 'sort', value: 'desc' }
    ]);

    let content;

    // Handle loading state
    if (isLoading) {
        content = <Loading />;
    }

    // Handle error state
    if (!isLoading && isError) {
        content = <Error error="Something went wrong" />;
    }

    // Handle no data found
    if (!isLoading && !isError && data?.data?.length === 0) {
        content = <Error error="No Data Found" />;
    }

    const totalQuantity = data?.meta?.total;

    const handlePageChange = (page) => {
        setPage(page);
    };

    const wishlistHandler = (item) => {
        dispatch(toggleWishlistItem(item));
    };

    const handleAddToCart = (product) => {
        if (!user) {
            toast.warning('Please log in to your account to add products to your cart.');
        } else {
            dispatch(addProduct(product));
        }
    };

    // Handle successful data retrieval
    if (!isLoading && !isError && data?.data?.length > 0) {
        content = data?.data?.map((item) => (
            <div className='mt-4' key={item?._id} data-aos="fade-up"data-aos-anchor-placement="top-bottom" data-aos-delay="400">
                <div className="imgContainer">
                    {item?.images?.slice(0, 2).map((img, imgIndex) => (
                        <div key={imgIndex} className="img_single">
                            <Link href={`/product/${item?._id}`}>
                                <Image src={img} width={300} height={300} className='mx-auto text-center' alt={`Image ${imgIndex}`} />
                            </Link>
                        </div>
                    ))}
                    <div style={{ width: "300px", margin: '0 auto' }}>
                        <ul className="iconul flex flex-col justify-center items-center gap-8 rounded">
                            <li onClick={() => wishlistHandler(item)}>
                                <i className="text-[20px] text-white fa-regular fa-heart"></i>
                            </li>
                            <li onClick={() => handleAddToCart(item)}>
                                <i className="text-[20px] text-white fa-solid fa-cart-shopping"></i>
                            </li>
                            <li
                                onClick={() => {
                                    setOpen(true);
                                    setSingleProductData(item);
                                    setSelectedImages(item?.images || []);
                                    setTitle(item?.name);
                                    setSelectImage(0);
                                }}
                            >
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
            </div>
        ));
    }

    return (
        <>
            <div className='container mx-auto'>
                <div className='text-center mb-5'>
                    <h4 className='text-2xl sm:text-4xl md:text-6xl font-bold extraFont my-5'>Perfect Shades</h4>
                    <h3 className='text-2xl md:text-4xl text-[#663130] font-bold my-3' data-aos="fade-up"data-aos-anchor-placement="top-bottom">Find Your Beauty Match</h3>
                </div>
                <div className='grid grid-cols-1 gap-5 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {content}
                </div>
            </div>
            <div className='flex justify-center my-10'>
                <Pagination current={page} onChange={handlePageChange} total={totalQuantity} />
            </div>

            {/* Reusable Modal for Product Details */}
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
