"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  Image,
  Spin,
  Upload,
  message,
  Alert,
  Typography,
  Tooltip,
  Empty,
  Progress,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  useDeleteProductImageMutation,
  useFetchSingleProductQuery,
  useUpdateProductImagesMutation,
} from "@/redux/feathers/Product/ProductApi";

const { Title, Text } = Typography;

const ProductImageUpdate = () => {
  const params = useParams();
  const id = params?.id;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchSingleProductQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const [updateImages, { isLoading: isUpdating }] =
    useUpdateProductImagesMutation();
  const [deleteImage, { isLoading: isDeleting }] =
    useDeleteProductImageMutation();
  const product = productData?.data;

  useEffect(() => {
    if (product?.images) {
      setFileList([]);
      setUploadProgress(0);
    }
  }, [product]);

  const handleImageDelete = (imageUrl, index) => {
    Modal.confirm({
      title: "Delete Image",
      content: "Are you sure you want to delete this image?",
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { loading: isDeleting },
      onOk: async () => {
        try {
          await deleteImage({ id, body: { imageUrl } }).unwrap();
          await refetch();
          message.success("Image deleted successfully");
        } catch (err) {
          message.error(
            err?.data?.message || "Failed to delete image. Please try again."
          );
        }
      },
    });
  };

  const handleFileChange = async ({ fileList }, index) => {
    if (fileList.length > 0) {
      const file = fileList[fileList.length - 1];
      setFileList([file]);
      setSelectedIndex(index);
      
      const formData = new FormData();
      formData.append("files", file.originFileObj);

      let interval;
      try {
        interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await updateImages({
          id,
          data: formData,
          index: typeof index === "number" ? index : -1,
        }).unwrap();

        clearInterval(interval);
        setUploadProgress(100);
        await refetch();
        message.success("Image updated successfully");

        setTimeout(() => {
          setFileList([]);
          setSelectedIndex(null);
          setUploadProgress(0);
        }, 1000);
      } catch (err) {
        clearInterval(interval);
        setUploadProgress(0);
        setSelectedIndex(null);
        message.error(
          err?.data?.message ||
            "Failed to update image. Please check the file size and try again."
        );
      }
    }
  };

  const handleImageUpload = async (index) => {
    // This function is now deprecated as the upload is handled in handleFileChange
    return;
  };

  const beforeUpload = (file) => {
    const isValidFormat = ["image/jpeg", "image/jpg", "image/png"].includes(
      file.type
    );
    if (!isValidFormat) {
      message.error("Only JPG and PNG images are allowed!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Product"
          description={
            <div>
              <p>
                {error?.data?.message ||
                  error?.message ||
                  "Failed to load product details. Please check your connection and try again."}
              </p>
              <Button
                type="primary"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          }
          type="error"
          showIcon
          className="shadow-md rounded-lg"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <Card className="shadow-md rounded-lg">
          <Empty
            description={
              <Text className="text-gray-600">
                Product not found or has been removed
              </Text>
            }
          >
            <Button type="primary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="shadow-md rounded-lg">
        <Title level={4} className="mb-4">
          Update Product Images
        </Title>
        <Alert
          message="Image Guidelines"
          description={
            <ul className="list-disc pl-4">
              <li>Maximum 3 images allowed per product</li>
              <li>Each image must be less than 5MB</li>
              <li>Supported formats: JPG, JPEG, PNG</li>
              <li>Click on an image slot to update or add a new image</li>
            </ul>
          }
          type="info"
          showIcon
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => {
            const image = product?.images?.[index];
            const isUploading = selectedIndex === index && uploadProgress > 0;

            return (
              <div key={index} className="relative">
                <Card
                  className={`h-[200px] flex items-center justify-center ${
                    !image ? "border-dashed" : ""
                  }`}
                  hoverable
                >
                  {image ? (
                    <div className="relative group">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="max-h-[180px] object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Tooltip title="Delete Image">
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            ghost
                            onClick={() => handleImageDelete(image, index)}
                            loading={isDeleting}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <Upload
                      accept="image/*"
                      beforeUpload={beforeUpload}
                      fileList={fileList}
                      onChange={(info) => handleFileChange(info, index)}
                      showUploadList={false}
                    >
                      <div className="text-center cursor-pointer">
                        <UploadOutlined className="text-2xl mb-2" />
                        <div>Upload Image {index + 1}</div>
                      </div>
                    </Upload>
                  )}
                </Card>
                {isUploading && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                    <div className="text-center">
                      <Progress type="circle" percent={uploadProgress} />
                      <div className="mt-2">Uploading...</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ProductImageUpdate;
