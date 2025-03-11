"use client";
import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Upload, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { useUpdateProductMutation } from "@/redux/feathers/Product/ProductApi";

export default function EditUpdateProductForm({ previousData }) {
  const { data: brandData } = useFetchAllBrandQuery();
  const { data: categoryData } = useFetchAllCategoryQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [files, setFiles] = useState([]); // Store uploaded and remaining files
  const [removedImages, setRemovedImages] = useState([]); // Track removed images
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOption = categoryData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const brandOption = brandData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  // Prepopulate form with previous data
  useEffect(() => {
    if (previousData) {
      form.setFieldsValue({
        name: previousData.name,
        desc: previousData.desc,
        price: previousData.price,
        in_stock: previousData.in_stock,
        weight: previousData.weight,
        category: previousData.category._id,
        brand: previousData.brand._id,
      });

      // Prepopulate the Upload component with existing images
      const existingImages = previousData.images.map((url, index) => ({
        uid: `prev-${index}`,
        name: `image-${index}.jpg`,
        status: "done",
        url: url,
      }));
      setFiles(existingImages);
    }
  }, [previousData, form]);

  const handleUploadChange = ({ fileList }) => {
    setFiles(fileList); // Update file list when files are added or removed
  };

  const handleRemoveImage = (file) => {
    // If the removed image is from the previous data, add its URL to the removedImages array
    if (file.url) {
      setRemovedImages((prev) => [...prev, file.url]);
    }

    // Update the file list to exclude the removed image
    const newFileList = files.filter((item) => item.uid !== file.uid);
    setFiles(newFileList);
  };

  const onSubmit = async (values) => {
    const formData = new FormData();

    // Append product data as JSON
    formData.append(
      "data",
      JSON.stringify({
        name: values.name,
        desc: values.desc,
        price: values.price,
        in_stock: values.in_stock,
        weight: values.weight,
        category: values.category,
        brand: values.brand,
        removedImages: removedImages, // Send the URLs of removed images
      })
    );

    // Append only new files
    files.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj); // Only append new files
      }
    });

    try {
      setIsSubmitting(true); // Set loading state to true
      await updateProduct({ id: previousData._id, data: formData }).unwrap();
      toast.success("Product updated successfully");
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Error updating product");
    } finally {
      setIsSubmitting(false); // Set loading state to false
    }
  };

  const uploadButton = (
    <div>
      {files.length < 3 ? <PlusOutlined /> : null}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Form onFinish={onSubmit} form={form}>
      <div className="mx-5 mt-5 mb-5">
        <Row justify="center" align="middle">
          <Upload
            name="files"
            listType="picture-card"
            fileList={files}
            onChange={handleUploadChange}
            onRemove={handleRemoveImage}
            multiple
            beforeUpload={() => false} // Prevent automatic upload
          >
            {files.length >= 3 ? null : uploadButton}
          </Upload>
        </Row>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-3">
        <Form.Item name="name" rules={[{ required: true, message: "Please enter the name" }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="price" rules={[{ required: true, message: "Please enter the price" }]}>
          <InputNumber style={{ width: "100%" }} placeholder="Price" />
        </Form.Item>
        <Form.Item name="in_stock" rules={[{ required: true, message: "Please enter the stock quantity" }]}>
          <InputNumber style={{ width: "100%" }} placeholder="In Stock" />
        </Form.Item>
        <Form.Item name="weight">
          <InputNumber style={{ width: "100%" }} placeholder="Weight" />
        </Form.Item>
        <Form.Item name="category" rules={[{ required: true, message: "Please select the category" }]}>
          <Select options={categoryOption} placeholder="Category" />
        </Form.Item>
        <Form.Item name="brand" rules={[{ required: true, message: "Please select the brand" }]}>
          <Select options={brandOption} placeholder="Brand" />
        </Form.Item>
      </div>

      <Form.Item name="desc" rules={[{ required: true, message: "Please enter the description" }]}>
        <Input.TextArea rows={4} placeholder="Description" />
      </Form.Item>

      <Form.Item className="text-center">
        <Button loading={isSubmitting} type="primary" size="large" htmlType="submit">
          Update Product
        </Button>
      </Form.Item>
    </Form>
  );
}
