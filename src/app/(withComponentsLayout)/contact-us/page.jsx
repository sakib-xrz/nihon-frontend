"use client";
import React from "react";
import { Input, Button, Form } from "antd";

const ContactUs = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log("Form Data:", values);
        // Handle form submission logic here
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Contact Us</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                {/* Name Field */}
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                >
                    <Input placeholder="Your Name" />
                </Form.Item>

                {/* Email Field */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                    ]}
                >
                    <Input placeholder="Your Email" />
                </Form.Item>

                {/* Description/Message Field */}
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter your message" }]}
                >
                    <Input.TextArea
                        placeholder="Write your message here..."
                        rows={4}
                    />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button
                        htmlType="submit"
                        className="w-full bg-[#F9A8D4] border hover:!border-[#F9A8D4] border-[#F9A8D4] hover:!text-white text-white font-bold py-2 px-4 rounded shadow-md hover:!bg-[#F9A8D4] hover:shadow-lg hover:brightness-110 transition"
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ContactUs;
