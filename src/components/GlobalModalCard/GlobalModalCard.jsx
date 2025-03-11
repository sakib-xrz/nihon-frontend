import { addProduct, decrementQuantity } from '@/redux/feathers/Product/ProductSlice';
import { toggleWishlistItem } from '@/redux/feathers/wishlist/wishlistSlice';
import { Button, InputNumber, Modal } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function GlobalModalCard({ open, onClose, singleProductData, selectedImages, title }) {
    const currentCart = useSelector((state) => state?.products?.cartItem);
    const user = useSelector((state) => state?.auth?.user);
    const dispatch = useDispatch();
    const [selectImage, setSelectImage] = useState(0);

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

    return (
        <Modal centered open={open} onCancel={onClose} width={1000} footer={null}>
            <div className='grid grid-cols-1 md:grid-cols-2 mx-auto'>
                <div className='flex flex-wrap gap-4 justify-center items-center'>
                    <div>
                        {selectedImages.map((item, index) => (
                            <div key={index} onClick={() => setSelectImage(index)} className='flex gap-4 cursor-pointer'>
                                <Image width={80} height={80} className='mt-3' src={item} alt={`Thumbnail ${index}`} />
                            </div>
                        ))}
                    </div>
                    <Image src={selectedImages[selectImage]} width={300} height={300} alt={`Modal Image ${selectImage}`} />
                </div>
                <div>
                    <h2 className='text-2xl sm:text-4xl text-[#663130] font-bold'>{title}</h2>
                    <div className='flex gap-4'>
                        <p className={`font-bold ${singleProductData?.in_stock === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                            In Stock - <span>{singleProductData?.in_stock}</span>
                        </p>
                        <p className='font-bold text-gray-500'>Weight - {singleProductData?.weight}</p>
                    </div>
                    <h3 className='text-2xl'>Price: {singleProductData.price}</h3>
                    <p className='text-gray-400'>{singleProductData?.desc?.slice(0, 450)}</p>
                    <div className='flex gap-4 my-4 items-center'>
                        <Button className='font-bold border-[#663130]' onClick={() => increment(singleProductData)}>+</Button>
                        <InputNumber
                            disabled
                            value={currentCart?.find((checkProduct) => checkProduct?._id === singleProductData?._id)?.quantity || 0}
                        />
                        <Button className='font-bold border-[#663130]' onClick={() => decrement(singleProductData)}>-</Button>
                    </div>
                    <div className='flex gap-5 mt-5'>
                        <button
                            onClick={() => handleAddToCart(singleProductData)}
                            disabled={singleProductData.in_stock === 0}
                            className='addToCart'
                        >
                            Add To Cart <i className='mt-1 hover:text-[#381B1A] fa-solid fa-cart-shopping'></i>
                        </button>
                        <button
                            onClick={() => wishlistHandler(singleProductData)}
                            disabled={singleProductData.in_stock === 0}
                            className='addToCart'
                        >
                            Add To Wishlist <i className='mt-1 hover:text-[#381B1A] fa-solid fa-heart'></i>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
