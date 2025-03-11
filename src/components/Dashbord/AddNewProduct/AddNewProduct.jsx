"use client";
import React, { useState } from "react";
import { Upload, Button, Form, Input, InputNumber, Select, Row, Modal, Radio, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { useAddNewProductMutation } from "@/redux/feathers/Product/ProductApi";

const AddNewProduct = () => {
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [marketStatus, setMarketStatus] = useState("onMarket");

    const { data: brandData } = useFetchAllBrandQuery();
    const { data: categoryData } = useFetchAllCategoryQuery();

    const categoryOption = categoryData?.data?.map((item) => ({
        value: item._id,
        label: item.name,
    }));
    const brandOption = brandData?.data?.map((item) => ({
        value: item._id,
        label: item.name,
    }));

    const [addNewProduct, { isLoading, isError }] = useAddNewProductMutation();

    const handlePreview = async (file) => {
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    const onSubmit = async (values) => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files", file.originFileObj);
        });
        formData.append("data", JSON.stringify({ ...values, isOnMarketStatus: marketStatus }));

        try {
            await addNewProduct(formData).unwrap();
            toast.success("Product added successfully");
        } catch (error) {
            toast.error("Error adding product");
        }
    };

    const uploadButton = (
        <div>
            {fileList.length < 3 ? <PlusOutlined /> : null}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <h3 className="font-bold text-2xl px-2">Add New Product</h3>
            <Form onFinish={onSubmit}>
                <div className="mx-5 mt-5 mb-5">
                    <Row justify="center" align="middle">
                        <Upload
                            name="files"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            multiple
                            beforeUpload={() => false}
                            onRemove={(file) => {
                                const newFileList = fileList.filter((item) => item.uid !== file.uid);
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
                            <img alt="example" style={{ width: "100%" }} src={previewImage} />
                        </Modal>
                    </Row>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-3">
                    <Form.Item name="name" rules={[{ required: true, message: "Please enter the name" }]}>
                        <Input size="large" placeholder="Name" />
                    </Form.Item>
                    <Form.Item name="price" rules={[{ required: true, message: "Please enter the price" }]}>
                        <InputNumber size="large" style={{ width: "100%" }} placeholder="Price" />
                    </Form.Item>
                    <Form.Item name="total_quantity" rules={[{ required: true, message: "Please enter the total quantity" }]}>
                        <InputNumber size="large" style={{ width: "100%" }} placeholder="Total Quantity" />
                    </Form.Item>
                    <Form.Item name="in_stock" rules={[{ required: true, message: "Please enter the stock quantity" }]}>
                        <InputNumber size="large" style={{ width: "100%" }} placeholder="In Stock" />
                    </Form.Item>
                    <Form.Item name="sku" rules={[{ required: true, message: "Please enter the SKU" }]}>
                        <InputNumber size="large" style={{ width: "100%" }} placeholder="SKU" />
                    </Form.Item>
                    <Form.Item name="weight">
                        <InputNumber size="large" style={{ width: "100%" }} placeholder="Weight" />
                    </Form.Item>
                    <Form.Item name="category" rules={[{ required: true, message: "Please select the category" }]}>
                        <Select options={categoryOption} placeholder="Category" />
                    </Form.Item>
                    <Form.Item name="brand" rules={[{ required: true, message: "Please select the brand" }]}>
                        <Select options={brandOption} placeholder="Brand" />
                    </Form.Item>
                    <Form.Item name="discount.value">
                        <InputNumber size="large" style={{ width: "100%" }} placeholder="Discount Value" />
                    </Form.Item>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-3">
                    <Form.Item name="discount.type">
                        <Select options={[{ value: "percentage", label: "Percentage" }, { value: "fixed", label: "Fixed" }]} placeholder="Discount Type" />
                    </Form.Item>
                    <Form.Item name="discount.startDate">
                        <DatePicker style={{ width: "100%" }} placeholder="Discount Start Date" />
                    </Form.Item>
                    <Form.Item name="discount.endDate">
                        <DatePicker style={{ width: "100%" }} placeholder="Discount End Date" />
                    </Form.Item>
                </div>
                <Form.Item name="desc" rules={[{ required: true, message: "Please enter the description" }]}>
                    <Input.TextArea rows={4} placeholder="Description" />
                </Form.Item>


                <Form.Item className="text-center">
                    <Button loading={isLoading} type="dashed" size="large" htmlType="submit">Create New Product</Button>
                </Form.Item>

                {isError && <p style={{ color: "red", textAlign: "center" }}>Error adding product. Please try again.</p>}
            </Form>
        </>
    );
};

export default AddNewProduct;
