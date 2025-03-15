"use client";

import {
  deleteFromCart,
  updateQuantity,
} from "@/redux/feathers/Product/ProductSlice";
import { CloseOutlined } from "@ant-design/icons";
import { Button, InputNumber, Table, Card, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

function Cart() {
  const currentCart = useSelector((state) => state.products.cartItem);
  const dispatch = useDispatch();

  const handleQuantityChange = (id, value) => {
    dispatch(updateQuantity({ _id: id, quantity: value }));
  };

  const deleteHandler = (record) => {
    dispatch(deleteFromCart(record));
  };

  // Calculate item price with discount
  const calculateItemPrice = (item) => {
    if (item?.discount?.value > 0) {
      return item.discount.type === "percentage"
        ? item.price - (item.price * item.discount.value) / 100
        : item.price - item.discount.value;
    }
    return item.price;
  };

  // Calculate cart totals
  const cartTotals = useMemo(() => {
    return currentCart.reduce(
      (acc, item) => {
        const originalPrice = item.price * item.quantity;
        const discountedPrice = calculateItemPrice(item) * item.quantity;

        return {
          subtotal: acc.subtotal + originalPrice,
          totalDiscount: acc.totalDiscount + (originalPrice - discountedPrice),
          total: acc.total + discountedPrice,
          itemCount: acc.itemCount + item.quantity,
        };
      },
      { subtotal: 0, totalDiscount: 0, total: 0, itemCount: 0 }
    );
  }, [currentCart]);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (text, record) =>
        record?.images && record.images.length > 0 ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden mx-auto">
            <Image
              src={record.images[0]}
              fill
              className="object-cover transition-transform hover:scale-110 duration-300"
              alt={`Product ${record.name}`}
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-gray-400">No Image</span>
          </div>
        ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text, record) => (
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 font-medium">
            <i className="text-[#49AF41] fa-solid fa-bangladeshi-taka-sign"></i>
            {record?.discount?.value > 0 ? (
              <>
                <span className="text-gray-900">
                  {calculateItemPrice(record).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {record.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-gray-900">{record.price.toFixed(2)}</span>
            )}
          </div>
          {record?.discount?.value > 0 && (
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              {record.discount.type === "percentage"
                ? `${record.discount.value}% OFF`
                : `${record.discount.value}৳ OFF`}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Current Stock",
      dataIndex: "in_stock",
      key: "in_stock",
      align: "center",
      render: (stock) => (
        <span
          className={`${stock <= 5 ? "text-orange-500" : "text-emerald-600"}`}
        >
          {stock} left
        </span>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center">
          <InputNumber
            min={1}
            max={record.in_stock}
            value={record.quantity}
            onChange={(value) =>
              handleQuantityChange(
                record.key,
                value !== undefined && value !== null && value !== "" ? value : 1
              )
            }
            onBlur={(e) => {
              if (e.target.value === "" || e.target.value === "0") {
                handleQuantityChange(record.key, 1);
              }
            }}
            className="w-20"
          />
        </div>
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      align: "center",
      render: (_, record) => (
        <span className="font-medium text-gray-900">
          ৳ {(calculateItemPrice(record) * record.quantity).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Button
          type="text"
          danger
          onClick={() => deleteHandler(record)}
          icon={<CloseOutlined />}
          className="hover:bg-red-50"
        >
          Remove
        </Button>
      ),
    },
  ];

  const dataSource = currentCart.map((item) => ({
    key: item._id,
    ...item,
  }));

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:flex-1">
            <Card className="overflow-hidden">
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                scroll={{ x: "max-content" }}
              />
            </Card>
          </div>

          <div className="lg:w-80">
            <Card className="sticky top-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Items ({cartTotals.itemCount})
                  </span>
                  <span className="font-medium">
                    ৳ {cartTotals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Discount</span>
                  <span>- ৳ {cartTotals.totalDiscount.toFixed(2)}</span>
                </div>
                <Divider className="my-3" />
                <div className="flex justify-between text-lg font-medium text-gray-900">
                  <span>Total</span>
                  <span>৳ {cartTotals.total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block mt-6">
                <Button
                  type="primary"
                  size="large"
                  block
                  className="font-medium h-12"
                  disabled={cartTotals.itemCount === 0}
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
