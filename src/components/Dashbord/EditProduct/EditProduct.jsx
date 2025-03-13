"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Alert,
  Spin,
} from "antd";
import { toast } from "sonner";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import {
  useUpdateProductMutation,
  useFetchSingleProductQuery,
} from "@/redux/feathers/Product/ProductApi";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const EditProduct = ({ productId }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [marketStatus, setMarketStatus] = useState("onMarket");

  const {
    data: brandData,
    isLoading: brandLoading,
    error: brandError,
  } = useFetchAllBrandQuery();
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useFetchAllCategoryQuery();
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useFetchSingleProductQuery(productId, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const categoryOption = categoryData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));
  const brandOption = brandData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        in_stock: product.in_stock,
        weight: product.weight,
        category: product.category._id,
        brand: product.brand._id,
        desc: product.desc,
        "discount.value": product.discount?.value,
        "discount.type": product.discount?.type,
        "discount.startDate": product.discount?.startDate
          ? dayjs(product.discount.startDate)
          : null,
        "discount.endDate": product.discount?.endDate
          ? dayjs(product.discount.endDate)
          : null,
      });
      setMarketStatus(product.isOnMarketStatus || "onMarket");
    }
  }, [productData, form]);

  const onSubmit = async (values) => {
    try {
      await updateProduct({
        id: productId,
        data: { ...values, isOnMarketStatus: marketStatus },
      }).unwrap();
      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      console.log(error);
      toast.error("Error updating product");
    }
  };

  if (productLoading || categoryLoading || brandLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (productError || categoryError || brandError) {
    return (
      <div className="p-5">
        <Alert
          message="Error"
          description={
            productError
              ? "Failed to load product data. Please try again later."
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

  if (!productData?.data) {
    return (
      <div className="p-5">
        <Alert
          message="Product Not Found"
          description="The requested product could not be found."
          type="warning"
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
      <h3 className="font-bold text-2xl px-2">Edit Product</h3>
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        className="max-w-3xl mx-auto p-5"
      >
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
        </div>
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
          >
            Update Product
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EditProduct;
