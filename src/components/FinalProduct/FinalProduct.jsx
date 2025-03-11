"use client";
import { deleteFromCart } from "@/redux/feathers/Product/ProductSlice";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import bkash from '../../assets/bkash.png'
import BkashForm from "../BkashForm/BkashForm";

function FinalProduct({ allInputValue }) {
    const currentCart = useSelector((state) => state.products.cartItem);
    const dispatch = useDispatch();
    
    const deleteHandler = (record) => {
        dispatch(deleteFromCart(record));
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (text, record) =>
                record?.images && record.images.length > 0 ? (
                    <Image
                        src={record.images[0]}
                        width={80}
                        height={80}
                        alt={`Product ${record.name}`}
                    />
                ) : (
                    <span>No Image</span>
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
            render: (text) => (
                <>
                    <i className="fa-solid mx-1 fa-bangladeshi-taka-sign"></i> {`${text}`}
                </>
            ),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Button
                    type="link"
                    danger
                    onClick={() => deleteHandler(record)}
                    icon={<CloseOutlined />}
                >
                    Delete
                </Button>
            ),
        },
    ];

    // Calculate subtotal
    const subtotal = currentCart.reduce((acc, current) => {
        const price = Number(current.price) || 0;  
        const quantity = Number(current.quantity) || 0;  
        return acc + (price * quantity);
      }, 0);
    
    const dataSource = currentCart.map((item) => ({
        key: item._id,
        images: item.images,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
    }));

  const DeliveryCharges = 60

    return (
        <>
            <div className=" w-[100%] sm:w-[90%] md:[70%] mx-auto">
                <div className="mt-6 bg-slate-50 p-5 rounded">
                    <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span>
                            <i className="fa-solid mx-1 fa-bangladeshi-taka-sign"></i>
                            {subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span>Delivery Charges</span>
                        <span>
                            <i className="fa-solid mx-1 fa-bangladeshi-taka-sign"></i>
                            60
                        </span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg mt-4">
                        <span>Total</span>
                        <span>
                            <i className="fa-solid mx-1 fa-bangladeshi-taka-sign"></i>
                            {Number(subtotal + DeliveryCharges).toFixed(2)}
                        </span>
                    </div>
                </div>
                <div className="my-4">
                    <BkashForm allInputValue={allInputValue} />
                </div>
                <div className="overflow-x-auto max-w-full">
                    <Table
                        className="mt-4 mx-auto"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                </div>
            </div>
        </>
    );
}

export default FinalProduct;
