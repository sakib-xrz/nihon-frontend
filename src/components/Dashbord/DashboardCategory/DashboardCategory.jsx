"use client";
import { Input, Button, Form, Row, message, Upload } from 'antd';
import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { useAddNewCategoryMutation } from '@/redux/feathers/shop/shopApi';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function DashboardCategory() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [addNewCategory, { isLoading, isError, data: categoryData }] = useAddNewCategoryMutation();

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        setFile(file);
        getBase64(file, (url) => {
            setImageUrl(url);
            setLoading(false);
        });
        return false; // Prevent auto upload
    };

    const onSubmit = async (values) => {
        if (!file) {
            message.error('Please upload an image.');
            return;
        }
        const myData = {
            name: values.name,
        };
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify(myData));

        try {
            await addNewCategory(formData);
            if (categoryData?.success) {
                toast.success(categoryData.message);
            }
        } catch (error) {
            toast.error("Failed to create category");
        }
    };

    const uploadButton = (
        <Button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </Button>
    );

    return (
        <>
            <h3 className="font-bold text-2xl px-2">Add New Category</h3>
            <div className="md:w-[50%] mx-auto sm:w-[80%] w-[95%]">
                <Form onFinish={onSubmit}>
                    <div className="mx-5 mt-5 mb-5">
                        <Row justify="center" align="middle">
                            <Upload
                                name="avatar"
                                listType="picture-circle"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{
                                            padding: '5px',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                        }}
                                        className="border"
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Row>
                    </div>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input category name!' }]}
                    >
                        <Input size="large" placeholder="Create Category Name" />
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button loading={isLoading} type="dashed" size="large" htmlType="submit">
                            Create New Category
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default DashboardCategory;