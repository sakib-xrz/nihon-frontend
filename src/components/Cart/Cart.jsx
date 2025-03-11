"use client";

import { deleteFromCart, updateQuantity } from "@/redux/feathers/Product/ProductSlice";
import { CloseOutlined } from "@ant-design/icons";
import { Button, InputNumber, Table } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

function Cart() {
  const currentCart = useSelector((state) => state.products.cartItem);
  const dispatch = useDispatch();

  const handleQuantityChange = (id, value) => {
    dispatch(updateQuantity({ _id: id, quantity: value }));
  };

  const deleteHandler = (record) => {
    dispatch(deleteFromCart(record));
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
      render:(price)=> <div><i className="text-[#49AF41] fa-solid fa-bangladeshi-taka-sign"></i> {price}</div>
    },
    {
      title: "Current Stock",
      dataIndex: "in_stock",
      key: "in_stock",  // Corrected the key
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          max={record.in_stock}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.key, value !== undefined && value !== null && value !== "" ? value : 1)}
          onBlur={(e) => {
            if (e.target.value === "" || e.target.value === "0") {
              handleQuantityChange(record.key, 1);
            }
          }}
          className="mx-2"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex items-center">
          <Button
            type="link"
            danger
            onClick={() => deleteHandler(record)}
            icon={<CloseOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const dataSource = currentCart.map((item) => ({
    key: item._id,
    images: item.images,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    in_stock: item.in_stock,
  }));

  return (
    <div className="bg-slate-50 h-auto">
      <div className="container mx-auto">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 'max-content' }}
          className="mx-auto"
        />
        <div className="text-end">
          <Link href='/checkout'>
            <Button className="mt-5 mb-5 font-bold" type="primary" danger size="large">
              CheckOut
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
