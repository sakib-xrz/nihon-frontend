"use client";

import { useAddProductReviewMutation } from "@/redux/feathers/productReview/productReviewApi";
import { BASE_URL } from "@/utils/contant";
import { Button, Form, Input, Modal, Rate, Table, Tag } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Page() {
  const token = useSelector((state) => state.auth.token);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [productReview, setProductReview] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, seIsLoading] = useState(true);
  const router = useRouter();
  const [currentProductId, setCurrentProductId] = useState(null);
  const [addReview] = useAddProductReviewMutation();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [router, token]);

  // Show product details in the modal
  const showProductDetails = (products) => {
    setSelectedProducts(products); // products should be an array
    setIsProductModalVisible(true);
  };

  // Show shipping address in the modal
  const showAddressDetails = (address) => {
    setSelectedAddress(address);
    setIsAddressModalVisible(true);
  };

  // Close modals
  const handleProductModalCancel = () => {
    setIsProductModalVisible(false);
  };

  const handleAddressModalCancel = () => {
    setIsAddressModalVisible(false);
  };
  // Columns for the product details table

  const handleReview = (productId) => {
    setCurrentProductId(productId);
  };

  console.log(productReview);
  const handleReviewSubmit = async (values) => {
    const information = {
      data: values,
      id: productReview,
    };
    const res = await addReview(information);
    if (res?.data?.success) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.error?.data?.message);
    }
  };

  const columns2 = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <Image
          src={images[0]}
          alt="Product Image"
          width={30}
          height={30}
          className="rounded"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Purchased Quantity",
      dataIndex: "purchased_quantity",
      key: "purchased_quantity",
    },
    {
      title: "Add Review",
      key: "add_review",
      render: (_, record) => {
        return (
          <>
            <Button onClick={() => setProductReview(record?._id)}>
              Add Product Review
            </Button>
            {productReview === record?._id && (
              <div className="mb-4 text-center mx-auto mt-4">
                <Form
                  onFinish={(values) => handleReviewSubmit(values)}
                  layout="vertical"
                >
                  <Form.Item
                    name="rating"
                    rules={[
                      { required: true, message: "Please provide a rating!" },
                    ]}
                  >
                    <Rate />
                  </Form.Item>
                  <Form.Item
                    name="comment"
                    rules={[
                      { required: true, message: "Please enter your review!" },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Write your review here..."
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit Review
                  </Button>
                </Form>
              </div>
            )}
          </>
        );
      },
    },
  ];

  // Columns for the main orders table
  const columns = [
    {
      title: "User Name",
      dataIndex: ["user", "name"],
      key: "username",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },

    {
      title: "Gender",
      dataIndex: ["user", "gender"],
      key: "gender",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Delivery Status",
      dataIndex: "isDelivered",
      key: "isDelivered",
      render: (isDelivered) => (
        <Tag color={isDelivered ? "green" : "red"}>
          {isDelivered ? "Delivered" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (payment_method) => <Tag>{payment_method}</Tag>,
    },
    {
      title: "Order Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (paymentDate) => (
        <Tag>{new Date(paymentDate).toLocaleDateString()}</Tag>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => (
        <div>
          <i class="fa-solid fa-bangladeshi-taka-sign"></i> {price}
        </div>
      ),
    },
    {
      title: "Shipping Address",
      dataIndex: "shipping_address",
      key: "shipping_address",
      render: (address) => (
        <Button onClick={() => showAddressDetails(address)}>
          View Address
        </Button>
      ),
    },
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
      render: (_, record) => (
        <Button onClick={() => showProductDetails(record.all_products)}>
          View Product
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (token) {
      fetch(`${BASE_URL}/order/get-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          seIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          seIsLoading(false);
        });
    }
  }, [token]);
  const handleReviewModalCancel = () => setIsReviewModalVisible(false);

  return (
    <div className="container mx-auto">
      <div>
        <div className="mx-auto">
          <Table
            columns={columns}
            dataSource={data?.data}
            rowKey="_id"
            pagination={false}
            loading={isLoading}
            scroll={{ x: "max-content" }} // This sets horizontal scrolling if necessary
          />
        </div>

        {/* Product Details Modal */}
        <Modal
          title="Product Details"
          open={isProductModalVisible}
          onCancel={handleProductModalCancel}
          footer={null}
          width={800}
        >
          {selectedProducts.length > 0 && (
            <Table
              columns={columns2}
              dataSource={selectedProducts}
              rowKey="_id"
              pagination={false}
            />
          )}
        </Modal>

        {/* Address Details Modal */}
        <Modal
          title="Shipping Address"
          open={isAddressModalVisible}
          onCancel={handleAddressModalCancel}
          footer={null}
        >
          {selectedAddress && (
            <div>
              <p>
                <strong className="mx-2 text-gray-600">Name:</strong>{" "}
                {selectedAddress.firstName}
                {selectedAddress.lastName}
              </p>
              <p>
                <strong className="mx-2 text-gray-600">Address:</strong>{" "}
                {selectedAddress.address}
              </p>
              <p>
                <strong className="mx-2 text-gray-600">City:</strong>{" "}
                {selectedAddress.city}
              </p>
              <p>
                <strong className="mx-2 text-gray-600">Zip Code:</strong>{" "}
                {selectedAddress.zip_code}
              </p>
              <p>
                <strong className="mx-2 text-gray-600">Email Or Phone:</strong>{" "}
                {selectedAddress.emailOrPhone}
              </p>
            </div>
          )}
        </Modal>

        {/* review  */}
      </div>
    </div>
  );
}
