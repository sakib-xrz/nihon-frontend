"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import { toast } from "sonner";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { useUpdateProductMutation, useFetchSingleProductQuery } from "@/redux/feathers/Product/ProductApi";
import dayjs from "dayjs";

const EditProduct = ({ productId }) => {
  const [form] = Form.useForm();
  const [marketStatus, setMarketStatus] = useState("onMarket");

  const { data: brandData } = useFetchAllBrandQuery();
  const { data: categoryData } = useFetchAllCategoryQuery();
  const { data: productData, isLoading: productLoading } = useFetchSingleProductQuery(productId);
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
        total_quantity: product.total_quantity,
        in_stock: product.in_stock,
        sku: product.sku,
        weight: product.weight,
        category: product.category,
        brand: product.brand,
        "discount.value": product.discount?.value,
        "discount.type": product.discount?.type,
        "discount.startDate": product.discount?.startDate ? dayjs(product.discount.startDate) : null,
        "discount.endDate": product.discount?.endDate ? dayjs(product.discount.endDate) : null,
      });
      setMarketStatus(product.isOnMarketStatus || "onMarket");
    }
  }, [productData, form]);

  const onSubmit = async (values) => {
    try {
      await updateProduct({ 
        id: productId, 
        data: { ...values, isOnMarketStatus: marketStatus }
      }).unwrap();
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  if (productLoading) {
    return <div>Loading...</div>;
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
            label="Total Quantity"
            name="total_quantity"
            rules={[
              { required: true, message: "Please enter the total quantity" },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="Total Quantity"
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
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "Please enter the SKU" }]}
          >
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="SKU"
            />
          </Form.Item>
          <Form.Item 
            label="Weight"
            name="weight"
          >
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
          <Form.Item 
            label="Discount Value"
            name="discount.value"
          >
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              placeholder="Discount Value"
            />
          </Form.Item>
          <Form.Item 
            label="Discount Type"
            name="discount.type"
          >
            <Select
              options={[
                { value: "percentage", label: "Percentage" },
                { value: "fixed", label: "Fixed" },
              ]}
              placeholder="Discount Type"
            />
          </Form.Item>
          <Form.Item 
            label="Start Date"
            name="discount.startDate"
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Discount Start Date"
            />
          </Form.Item>
          <Form.Item 
            label="End Date"
            name="discount.endDate"
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Discount End Date"
            />
          </Form.Item>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update Product
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EditProduct;
