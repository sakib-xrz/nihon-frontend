"use client";
import React, { useState } from "react";
import {
  Upload,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Modal,
  Radio,
  DatePicker,
  Alert,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { useAddNewProductMutation } from "@/redux/feathers/Product/ProductApi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AddNewProduct = () => {
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [marketStatus, setMarketStatus] = useState("onMarket");

  const { data: brandData, isLoading: brandLoading, error: brandError } = useFetchAllBrandQuery();
  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useFetchAllCategoryQuery();

  const [addNewProduct, { isLoading, isError }] = useAddNewProductMutation();

  const categoryOption = categoryData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));
  const brandOption = brandData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  const onSubmit = async (values) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });
    formData.append(
      "data",
      JSON.stringify({ ...values, isOnMarketStatus: marketStatus })
    );

    try {
      await addNewProduct(formData).unwrap();
      toast.success("Product added successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.log(error);
      toast.error("Error adding product");
    }
  };

  const uploadButton = (
    <div>
      {fileList.length < 3 ? <PlusOutlined /> : null}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (categoryLoading || brandLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (categoryError || brandError) {
    return (
      <div className="p-5">
        <Alert
          message="Error"
          description={
            categoryError && brandError
              ? "Failed to load categories and brands. Please try again later."
              : categoryError
              ? "Failed to load categories. Please try again later."
              : "Failed to load brands. Please try again later."
          }
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!categoryData?.data?.length || !brandData?.data?.length) {
    return (
      <div className="p-5">
        <Alert
          message="Missing Data"
          description={
            !categoryData?.data?.length && !brandData?.data?.length
              ? "No categories and brands found. Please add some categories and brands first."
              : !categoryData?.data?.length
              ? "No categories found. Please add some categories first."
              : "No brands found. Please add some brands first."
          }
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <h3 className="font-bold text-2xl px-2">Add New Product</h3>
      <Form
        onFinish={onSubmit}
        layout="vertical"
        className="max-w-3xl mx-auto p-5"
      >
        <div className="mx-5 mt-5 mb-5">
          <Form.Item 
            label="Product Images" 
            extra="Upload up to 3 product images. Each image should be less than 5MB."
          >
            <Row justify="center" align="middle">
              <Upload
                name="files"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple
                beforeUpload={(file) => {
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    toast.error('Image must be smaller than 5MB!');
                  }
                  return false;
                }}
                onRemove={(file) => {
                  const newFileList = fileList.filter(
                    (item) => item.uid !== file.uid
                  );
                  setFileList(newFileList);
                }}
              >
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
              >
                <Image
                  alt="example"
                  style={{ width: "100%", height: "auto" }}
                  src={previewImage}
                  width={800}
                  height={600}
                  priority
                />
              </Modal>
            </Row>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input size="large" placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="Price"
            />
          </Form.Item>
          <Form.Item
            label="In Stock"
            name="in_stock"
            rules={[
              { required: true, message: "Please enter the stock quantity" },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="In Stock"
            />
          </Form.Item>
          <Form.Item label="Weight" name="weight">
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="Weight"
            />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select the category" }]}
          >
            <Select options={categoryOption} placeholder="Category" />
          </Form.Item>
          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Please select the brand" }]}
          >
            <Select options={brandOption} placeholder="Brand" />
          </Form.Item>
          <Form.Item label="Discount Value" name="discount.value">
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="Discount Value"
            />
          </Form.Item>
          <Form.Item label="Discount Type" name="discount.type">
            <Select
              options={[
                { value: "percentage", label: "Percentage" },
                { value: "fixed", label: "Fixed" },
              ]}
              placeholder="Discount Type"
            />
          </Form.Item>
          <Form.Item label="Start Date" name="discount.startDate">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Discount Start Date"
            />
          </Form.Item>
          <Form.Item label="End Date" name="discount.endDate">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Discount End Date"
            />
          </Form.Item>
        </div>
        <div className="mt-4">
          <Form.Item
            label="Description"
            name="desc"
            rules={[
              { required: true, message: "Please enter the description" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Product Description" />
          </Form.Item>
          <div className="flex justify-end mt-4">
            <Button type="primary" htmlType="submit" loading={isLoading} size="large">
              Add Product
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AddNewProduct;
