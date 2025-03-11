"use client"
import { addProduct, decrementQuantity } from '@/redux/feathers/Product/ProductSlice';
import { toggleWishlistItem } from '@/redux/feathers/wishlist/wishlistSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../style/productCart.css';
import GlobalModalCard from './GlobalModalCard/GlobalModalCard';
import 'aos/dist/aos.css';
import AOS from 'aos';

export default function ProductCart({ data }) {
    const user = useSelector((state)=> state?.auth?.user)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [title, setTitle] = useState('');
    const [selectImage, setSelectImage] = useState(0);
    const [singleProductData, setSingleProductData] = useState({});

    const {
        _id, averageRating, createdAt, desc, images, in_stock, isDeleted, isOnMarketStatus, isPublished, name, price, reviews, sku, total_quantity, updatedAt, weight
    } = data;

    const increment = (product) => {
        if (!user) {
            toast.warning('Please log in to your account to add products to your cart.');
        } else {
            dispatch(addProduct(product));
        }

    };

    const decrement = (product) => {
        if (!user) {
            toast.warning('Please log in to your account to add products to your cart.');
        } else {
            dispatch(decrementQuantity(product));
        }

    };

    const handelAddToCart = (product) => {
        if (!user) {
            toast.warning('Please log in to your account to add products to your cart.');
        } else {
            dispatch(addProduct(product));
        }
    };

    const wishlistHandeler = (product) => {
        dispatch(toggleWishlistItem(product))
    };
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
   
      useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <>
            <div className='mt-4' data-aos="fade-up">
                <div className="imgContainer">
                    {images?.slice(0, 2).map((img, imgIndex) => (
                        <div key={imgIndex} className="img_single">
                            <Link href={`/product/${_id}`}><Image src={img} width={300} height={300} className='mx-auto text-center' alt={`Image ${imgIndex}`} /></Link>
                        </div>
                    ))}
                    <div style={{ width: "300px", margin: '0 auto' }}>
                        <ul className="iconul flex flex-col justify-center items-center gap-8 rounded">
                            <li><i className="text-[20px] text-white fa-regular fa-heart"></i></li>
                            <li><i className="text-[20px] text-white fa-solid fa-cart-shopping"></i></li>
                            <li onClick={() => { setOpen(true); setSingleProductData(data); setSelectedImages(images); setTitle(data.name); setSelectImage(0); }}>
                                <i className="text-[20px] text-white fa-solid fa-eye"></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex justify-evenly'>
                    <h4 className='font-medium p-2'>Price: {price} Tk</h4>
                    <h4 className='font-medium p-2'>In Stock: {in_stock}</h4>
                </div>
                <h3 className='font-bold text-[20px] text-gray-600 text-center'>{name}</h3>
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
