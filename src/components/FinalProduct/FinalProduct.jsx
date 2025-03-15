"use client";
import { deleteFromCart } from "@/redux/feathers/Product/ProductSlice";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Table, Card, Divider } from "antd";
import Image from "next/image";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import BkashForm from "../BkashForm/BkashForm";
import "./FinalProduct.css";

function FinalProduct({ allInputValue }) {
    const currentCart = useSelector((state) => state.products.cartItem);
    const dispatch = useDispatch();
    
    const deleteHandler = (record) => {
        dispatch(deleteFromCart(record));
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
            width: "50%",
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                        {record?.images && record.images.length > 0 ? (
                            <Image
                                src={record.images[0]}
                                fill
                                className="object-cover rounded-md"
                                alt={`Product ${record.name}`}
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                            {record.name}
                        </h3>
                        {record.discount && (
                            <div className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-red-50 text-red-600">
                                {record.discount.type === "percentage" 
                                    ? `${record.discount.value}% OFF`
                                    : `${record.discount.value}৳ OFF`}
                            </div>
                        )}
                        {record.in_stock <= 5 && (
                            <p className="mt-1 text-xs text-orange-500">
                                Only {record.in_stock} left in stock
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            align: "right",
            width: "15%",
            render: (text, record) => {
                const discountedPrice = calculateItemPrice(record);
                return (
                    <div className="text-right">
                        <div className="font-medium text-gray-900">
                            ৳ {discountedPrice.toFixed(2)}
                        </div>
                        {record.discount && (
                            <div className="text-xs text-gray-500 line-through">
                                ৳ {text}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "15%",
            render: (quantity) => (
                <div className="font-medium text-gray-900 text-center">
                    {quantity}
                </div>
            ),
        },
        {
            title: "Total",
            key: "total",
            align: "right",
            width: "15%",
            render: (_, record) => {
                const total = calculateItemPrice(record) * record.quantity;
                return (
                    <div className="text-right">
                        <div className="font-medium text-gray-900">
                            ৳ {total.toFixed(2)}
                        </div>
                    </div>
                );
            },
        },
        {
            title: "",
            key: "action",
            width: "5%",
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    onClick={() => deleteHandler(record)}
                    icon={<CloseOutlined />}
                    className="hover:bg-red-50"
                />
            ),
        },
    ];

    // Calculate item price with discount
    const calculateItemPrice = (item) => {
        if (item?.discount?.value > 0) {
            return item.discount.type === "percentage"
                ? item.price - (item.price * item.discount.value) / 100
                : item.price - item.discount.value;
        }
        return item.price;
    };

    // Calculate all totals
    const totals = useMemo(() => {
        return currentCart.reduce((acc, item) => {
            const originalPrice = item.price * item.quantity;
            const discountedPrice = calculateItemPrice(item) * item.quantity;
            
            return {
                subtotal: acc.subtotal + originalPrice,
                totalDiscount: acc.totalDiscount + (originalPrice - discountedPrice),
                total: acc.total + discountedPrice,
                itemCount: acc.itemCount + item.quantity,
            };
        }, { subtotal: 0, totalDiscount: 0, total: 0, itemCount: 0 });
    }, [currentCart]);
    
    const DeliveryCharges = 60;
    const grandTotal = totals.total + DeliveryCharges;

    const dataSource = currentCart.map((item) => ({
        key: item._id,
        ...item,
    }));

    return (
        <div className="w-[100%] sm:w-[90%] md:[70%] mx-auto space-y-6">
            <Card className="overflow-x-auto" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    className="cart-table"
                />
            </Card>

            <Card className="bg-slate-50">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Subtotal ({totals.itemCount} items)</span>
                        <span className="font-medium">
                            ৳ {totals.subtotal.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-red-500">
                        <span>Discount</span>
                        <span>- ৳ {totals.totalDiscount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-600">
                        <span>Total after discount</span>
                        <span className="font-medium">
                            ৳ {totals.total.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-600">
                        <span>Delivery Charges</span>
                        <span className="font-medium">
                            ৳ {DeliveryCharges.toFixed(2)}
                        </span>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex justify-between items-center text-lg font-medium text-gray-900">
                        <span>Grand Total</span>
                        <span>৳ {grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <BkashForm 
                        allInputValue={allInputValue} 
                        grandTotal={grandTotal}
                        itemCount={totals.itemCount}
                    />
                </div>
            </Card>
        </div>
    );
}

export default FinalProduct;
