"use client"; 

import { addProduct } from '@/redux/feathers/Product/ProductSlice';
import { removeWishlistItem } from '@/redux/feathers/wishlist/wishlistSlice';
import { CloseOutlined } from '@ant-design/icons';
import { Table as AntdTable, Button } from 'antd';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function Wishlist() {
    const user = useSelector((state) => state?.auth?.user?.email)
    const { wishlist } = useSelector((state) => state?.wishlist) || {};
    const dispatch = useDispatch();

    const handleDeleteWishlist = (product) => {
        dispatch(removeWishlistItem({ key: product._id }));
    };

    const handleAddToCart = (product) => {
        if (!user) {
            toast.warning('Please log in to your account to add products to your cart.');
        } else {
            dispatch(addProduct(product));
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text, record) => (
                record?.images && record.images.length > 0 ? (
                    <Image
                        src={record.images[0]}
                        width={80}
                        height={80}
                        alt={`Product ${record.name}`}
                    />
                ) : (
                    <span>No Image</span>
                )
            ),
        },        
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `${price}`, // Format price to 2 decimal places
        },
        {
            title: "Current Stock",
            dataIndex: "in_stock",
            key: "in_stock",
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteWishlist(record)}
                        icon={<CloseOutlined />}
                    >
                        Delete
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleAddToCart(record)}
                    >
                        Add To Cart
                    </Button>
                </>
            ),
        },
    ];

    const dataSource = wishlist?.map((item) => ({
        ...item, // Spread the item to keep all original properties, including _id
    })) || [];

    return (
        <div className="mx-auto">
            <AntdTable
                scroll={{ x: 'max-content' }}
                className="mx-auto"
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
}

export default Wishlist;