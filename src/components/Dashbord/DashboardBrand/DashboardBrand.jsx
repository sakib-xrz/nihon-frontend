"use client"
import { Input, Button, Form, Row, message, Upload } from 'antd';
import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'sonner';
import { useAddNewBrandMutation } from '@/redux/feathers/brand/brandApi';
// import { useAddNewBrandMutation } from '@/lib/fetchers/Brand/BrandApi';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function Page() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [addNewBrand,{isLoading,isError,data:brandData}] = useAddNewBrandMutation()

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        // Handle file upload logic
        setFile(file);
        return true;
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (imageUrl) => {
                setImageUrl(imageUrl);
                setLoading(false);
            });
        }
    };

    const onSubmit = async (values) => {
        const myData = {
            name:values?.name,
            desc:values?.desc
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('data', JSON.stringify(myData)); 
        addNewBrand(formData)
    };

    const uploadButton = (
        <Button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </Button>
    );

    if(brandData?.success === true){
        toast.success(brandData?.message)
    }
    

    return (
        <>
        <h3 className="font-bold text-2xl px-2">Add New Brand</h3>
        <div className='md:w-[50%] mx-auto sm:w-[80%] w-[95%]'>
            <Form onFinish={onSubmit}>
            <div className="mx-5 mt-5 mb-5">
                <Row justify="center" align="middle">
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
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
            <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                <Input size='large' placeholder="Create Category Name" />
            </Form.Item>
            <Form.Item name="desc">
                <TextArea rows={4} size='large' placeholder="Description" />
            </Form.Item>
            <Form.Item className='text-center'>
                <Button loading={isLoading} type="dashed" size="large" htmlType="submit">
                    Create New Brand
                </Button>
            </Form.Item>
        </Form>
        </div>
        </>
        
    );
}

export default Page;
const { TextArea } = Input;