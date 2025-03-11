"use client";
import { useUpdateCategoryMutation } from '@/redux/feathers/shop/shopApi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Row, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function EditCategoryForm({ previousCategoryValue }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(previousCategoryValue?.image || null); // Show previous image if exists
    const [updateCategory, { isLoading, isError, data: categoryData }] = useUpdateCategoryMutation();

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

    const handleRemoveImage = () => {
        setImageUrl(null);
        setFile(null); // Clear the file if the user removes the image
    };

    const onSubmit = async (values) => {
        const myData = {
            name: values.name,
        };
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        formData.append('data', JSON.stringify(myData));

        try {
            await updateCategory({id:previousCategoryValue._id,data:formData}).unwrap(); // Handle the promise
            if (categoryData?.success) {
                toast.success(categoryData.message);
            }
        } catch (error) {
            toast.error("Failed to update category");
        }
    };

    useEffect(() => {
        if (isError) {
            toast.error("Error occurred while updating category");
        }
    }, [isError]);

    return (
        <>
            <h3 className="font-bold text-2xl px-2">Edit Category</h3>
            <div className="md:w-[50%] mx-auto sm:w-[80%] w-[95%]">
                <Form
                    onFinish={onSubmit}
                    initialValues={{
                        name: previousCategoryValue?.name || "", // Prepopulate category name
                    }}
                >
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
                                    <Button style={{ border: 0, background: 'none' }} type="button">
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </Button>
                                )}
                            </Upload>
                            {imageUrl && (
                                <Button
                                    type="link"
                                    onClick={handleRemoveImage}
                                    style={{ marginTop: 10, color: 'red' }}
                                >
                                    Remove Image
                                </Button>
                            )}
                        </Row>
                    </div>
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your category name!' }]}
                    >
                        <Input size="large" placeholder="Category Name" />
                    </Form.Item>
                    <Form.Item className="text-center">
                        <Button loading={isLoading} type="dashed" size="large" htmlType="submit">
                            Update Category
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default EditCategoryForm;