"use client";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import {
  useDeleteProductMutation,
  useFetchAllProductsQuery,
  useUpdateProductMutation,
} from "@/redux/feathers/Product/ProductApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { sanitizeParams } from "@/utils";
import {
  Alert,
  Button,
  Input,
  Pagination,
  Spin,
  Table,
  Tag,
  Space,
  Typography,
  Tooltip,
  Modal,
  Select,
} from "antd";
import {
  QuestionCircleOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  PictureOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";

const DashbordProduct = () => {
  const [params, setParams] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});

  const { data: category, isLoading: categoryLoading } =
    useFetchAllCategoryQuery();
  const { data: brand, isLoading: brandLoading } = useFetchAllBrandQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data, isLoading, isError, error, refetch } = useFetchAllProductsQuery(
    sanitizeParams({
      searchTerm: searchTerm,
      page: page,
      limit: limit,
      ...params,
    })
  );

  const categoryOptions = category?.data?.map((item) => ({
    text: item?.name,
    value: item?._id,
  }));

  const brandOptions = brand?.data?.map((item) => ({
    text: item?.name,
    value: item?._id,
  }));

  // Update tableData whenever data changes
  useEffect(() => {
    if (data?.data) {
      setTableData(data.data);
    }
  }, [data]);

  const handleUpdateProduct = (productId) => {
    const productToUpdate = tableData.find(
      (product) => product._id === productId
    );
    // if (productToUpdate) {
    //   setSelectedProduct(productToUpdate);
    //   setOpen(true);
    // }
  };

  const showDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      const res = await deleteProduct(selectedProduct._id).unwrap();
      if (res?.success) {
        toast.success("Product deleted successfully");
        refetch();
      }
    } catch (error) {
      handleAPIError(error, "delete product");
    } finally {
      setDeleteModalVisible(false);
      setSelectedProduct(null);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;

    try {
      setBulkActionLoading(true);
      const results = await Promise.all(
        selectedRowKeys.map((id) => deleteProduct(id).unwrap())
      );

      const successCount = results.filter((res) => res?.success).length;
      const failedCount = selectedRowKeys.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} products`);
        if (failedCount > 0) {
          toast.warning(`Failed to delete ${failedCount} products`);
        }
        setSelectedRowKeys([]);
        refetch();
      }
    } catch (error) {
      handleAPIError(error, "delete products");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleMarketStatusChange = async (productId, newStatus) => {
    try {
      await updateProduct({
        id: productId,
        data: { isOnMarketStatus: newStatus },
      }).unwrap();
      toast.success("Market status updated successfully");
      refetch();
    } catch (error) {
      handleAPIError(error, "update market status");
    }
  };

  const getDiscountInfo = (record) => {
    const now = new Date();
    const startDate = record.discount?.startDate
      ? new Date(record.discount.startDate)
      : null;
    const endDate = record.discount?.endDate
      ? new Date(record.discount.endDate)
      : null;

    const isActive = startDate && endDate && startDate <= now && endDate >= now;
    const isPending = startDate && startDate > now;
    const isExpired = endDate && endDate < now;

    const discountedPrice = record.discount?.value
      ? record.discount.type === "percentage"
        ? record.price - record.price * (record.discount.value / 100)
        : record.price - record.discount.value
      : null;

    return {
      isActive,
      isPending,
      isExpired,
      discountedPrice,
      discountText:
        record.discount?.type === "percentage"
          ? `${record.discount.value}%`
          : `$${record.discount.value}`,
      startDate,
      endDate,
    };
  };

  const getStockLevel = (stock) => {
    if (stock > 20) return "High";
    if (stock > 10) return "Medium";
    if (stock > 0) return "Low";
    return "Out of Stock";
  };

  const getStockColor = (stock) => {
    if (stock > 20) return "green";
    if (stock > 10) return "orange";
    if (stock > 0) return "red";
    return "error";
  };

  // Error handling for API calls
  const handleAPIError = (error, action) => {
    console.error(`Error during ${action}:`, error);
    const errorMessage =
      error.data?.message || error.message || `Failed to ${action}`;
    toast.error(errorMessage);
  };

  // Handle keyboard shortcuts
  useHotkeys("ctrl+f", (e) => {
    e.preventDefault();
    document.getElementById("product-search").focus();
  });

  useHotkeys("ctrl+n", (e) => {
    e.preventDefault();
    window.location.href = "/dashboard/add-product";
  });

  // Removed checkbox-related hotkeys for delete (Ctrl+D) and export (Ctrl+E)

  useHotkeys("ctrl+h", (e) => {
    e.preventDefault();
    setHelpModalVisible(true);
  });

  useHotkeys("ctrl+right", () => {
    if (page < Math.ceil((data?.meta?.total || 0) / limit)) {
      setPage(page + 1);
    }
  });

  useHotkeys("ctrl+left", () => {
    if (page > 1) {
      setPage(page - 1);
    }
  });

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const columns = [
    {
      title: "Product Info",
      key: "productInfo",
      width: 200,
      render: (record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.images[0]}
            alt={record.name}
            width={60}
            height={60}
            className="rounded-lg object-cover"
          />
          <div>
            <Typography.Text strong className="text-base line-clamp-1">
              {record.name}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      key: "price",
      width: 150,
      sorter: (a, b) => {
        const aDiscount = getDiscountInfo(a);
        const bDiscount = getDiscountInfo(b);
        const aPrice = aDiscount.isActive ? aDiscount.discountedPrice : a.price;
        const bPrice = bDiscount.isActive ? bDiscount.discountedPrice : b.price;
        return aPrice - bPrice;
      },
      render: (record) => {
        return (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              {record?.discount?.value > 0 ? (
                <>
                  <Typography.Text strong className="text-base line-clamp-1">
                    {record?.discountedPrice} Tk
                  </Typography.Text>
                  <Typography.Text className="text-sm text-gray-400 line-through">
                    {record?.price} Tk
                  </Typography.Text>
                </>
              ) : (
                <Typography.Text strong className="text-base line-clamp-1">
                  {record?.price} Tk
                </Typography.Text>
              )}
            </div>
            {record?.discount?.value > 0 && (
              <Tag color="red">
                {record?.discount?.value}{" "}
                {record?.discount?.type === "percentage" ? "%" : "Tk"} off
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Stock",
      key: "stock",
      width: 120,
      render: (record) => (
        <div className="flex items-center justify-center">
          <Tag color={getStockColor(record.in_stock)}>
            {record.in_stock} ({getStockLevel(record.in_stock)})
          </Tag>
        </div>
      ),
      filters: [
        { text: "High Stock (>20)", value: "high" },
        { text: "Medium Stock (11-20)", value: "medium" },
        { text: "Low Stock (1-10)", value: "low" },
        { text: "Out of Stock", value: "out" },
      ],
      onFilter: (value, record) => {
        switch (value) {
          case "high":
            return record.in_stock > 20;
          case "medium":
            return record.in_stock > 10 && record.in_stock <= 20;
          case "low":
            return record.in_stock > 0 && record.in_stock <= 10;
          case "out":
            return record.in_stock <= 0;
          default:
            return true;
        }
      },
      sorter: (a, b) => a.in_stock - b.in_stock,
    },
    {
      title: "Category",
      key: "category",
      width: 150,
      render: (record) => (
        <div className="flex items-center justify-center">
          <Tag color="blue">{record.category?.name}</Tag>
        </div>
      ),
      filters: categoryOptions,
      onFilter: (value, record) => record.category?._id === value,
    },
    {
      title: "Brand",
      key: "brand",
      width: 150,
      render: (record) => (
        <div className="flex items-center justify-center">
          {" "}
          <Tag color="purple">{record.brand?.name}</Tag>{" "}
        </div>
      ),
      filters: brandOptions,
      onFilter: (value, record) => record.brand?._id === value,
    },
    {
      title: "Market Status",
      key: "marketStatus",
      width: 150,
      render: (record) => (
        <div className="flex items-center justify-center">
          <Select
            value={record.isOnMarketStatus}
            onChange={(value) => handleMarketStatusChange(record._id, value)}
            loading={isLoading}
            size="small"
          >
            <Select.Option value="onMarket">On Market</Select.Option>
            <Select.Option value="pre-order">Pre-order</Select.Option>
          </Select>
        </div>
      ),
      filters: [
        { text: "On Market", value: "onMarket" },
        { text: "Pre-order", value: "pre-order" },
      ],
      onFilter: (value, record) => record.isOnMarketStatus === value,
    },
    {
      title: <div className="flex items-center justify-center">Actions</div>,
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <Space>
            <Tooltip title="Edit product details">
              <Link href={`/dashboard/edit-product/${record._id}`}>
                <Button type="primary" size="small" icon={<EditOutlined />}>
                  Edit
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Manage product images">
              <Link href={`/dashboard/products/image-update/${record._id}`}>
                <Button type="default" size="small" icon={<PictureOutlined />}>
                  Images
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Delete this product">
              <Button
                danger
                size="small"
                onClick={() => showDeleteConfirm(record)}
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(Array.isArray(sorter) ? sorter[0] : sorter);
  };

  const clearAllFilters = () => {
    setFilteredInfo({});
    setSearchText("");
    setSearchTerm("");
  };

  const clearAllSorts = () => {
    setSortedInfo({});
  };

  return (
    <div>
      {isError ? (
        <Alert
          message="Error Loading Products"
          description={
            <div>
              <p>
                {error?.data?.message ||
                  error?.message ||
                  "Failed to load products"}
              </p>
              <Button type="primary" onClick={() => refetch()} className="mt-2">
                Try Again
              </Button>
            </div>
          }
          type="error"
          showIcon
          className="mb-4"
        />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <Space className="flex-wrap">
                <Typography.Title
                  level={4}
                  className="!mb-0 !text-xl sm:!text-2xl"
                >
                  Products Management
                </Typography.Title>
                <Tooltip title="View keyboard shortcuts (Ctrl+H)">
                  <Button
                    type="text"
                    icon={<QuestionCircleOutlined />}
                    onClick={() => setHelpModalVisible(true)}
                  />
                </Tooltip>
              </Space>
              <Space className="flex-wrap w-full sm:w-auto justify-end gap-2">
                <Button size="middle" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
                <Button size="middle" onClick={clearAllSorts}>
                  Clear Sorting
                </Button>
                <Link
                  href="/dashboard/add-product"
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    className="w-full sm:w-auto"
                  >
                    Add New Product
                  </Button>
                </Link>
              </Space>
            </div>
            <div className="w-full">
              <Tooltip title="Search products (Ctrl+F)">
                <Input.Search
                  id="product-search"
                  placeholder="Search products by name..."
                  className="w-full"
                  size="large"
                  allowClear
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={(value) => setSearchTerm(value)}
                />
              </Tooltip>
            </div>
          </div>

          {isLoading || categoryLoading || brandLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spin size="large" tip="Loading products..." />
            </div>
          ) : tableData.length === 0 ? (
            <Alert
              message="No Products Found"
              description={
                <div>
                  <p>There are no products matching your current filters.</p>
                  {searchTerm && (
                    <Button
                      type="link"
                      onClick={() => {
                        setSearchText("");
                        setSearchTerm("");
                      }}
                      className="p-0"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />
          ) : (
            <Table
              columns={columns.map((col) => ({
                ...col,
                sortOrder:
                  sortedInfo.columnKey === col.key ? sortedInfo.order : null,
                filteredValue: filteredInfo[col.key] || null,
              }))}
              dataSource={tableData}
              rowKey="_id"
              pagination={false}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
              className="shadow-sm rounded-lg"
              bordered
            />
          )}

          {!isLoading && tableData.length > 0 && (
            <div className="mt-5 flex justify-between items-center">
              <Typography.Text className="text-gray-500">
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, data?.meta?.total || 0)} of{" "}
                {data?.meta?.total || 0} products
              </Typography.Text>
              <Space align="center">
                <Tooltip title="Previous page (Ctrl+←)">
                  <Button
                    icon={<LeftOutlined />}
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  />
                </Tooltip>
                <Pagination
                  current={page}
                  onChange={(value) => setPage(value)}
                  pageSize={limit}
                  onShowSizeChange={(current, size) => {
                    setLimit(size);
                    setPage(1);
                  }}
                  total={data?.meta?.total}
                  showSizeChanger
                  showQuickJumper
                />
                <Tooltip title="Next page (Ctrl+→)">
                  <Button
                    icon={<RightOutlined />}
                    disabled={
                      page >= Math.ceil((data?.meta?.total || 0) / limit)
                    }
                    onClick={() => setPage(page + 1)}
                  />
                </Tooltip>
              </Space>
            </div>
          )}
        </>
      )}

      <Modal
        title="Delete Product"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedProduct(null);
        }}
        okText="Yes, Delete"
        okButtonProps={{ danger: true, loading: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
        centered
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedProduct?.name}</strong>?
        </p>
        <p className="text-gray-500 mt-2">This action cannot be undone.</p>
      </Modal>

      <Modal
        title="Keyboard Shortcuts"
        open={helpModalVisible}
        onCancel={() => setHelpModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHelpModalVisible(false)}>
            Close
          </Button>,
        ]}
        centered
      >
        <div className="space-y-4">
          <Typography.Title level={5}>Navigation</Typography.Title>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <kbd>Ctrl</kbd> + <kbd>←</kbd> - Previous page
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>→</kbd> - Next page
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>F</kbd> - Focus search
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>H</kbd> - Show this help
            </li>
          </ul>

          <Typography.Title level={5}>Selection Tips</Typography.Title>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Use the selection dropdown to select all, none, or by stock level
            </li>
            <li>Click column headers to sort by that column</li>
            <li>Use filters to narrow down the product list</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default DashbordProduct;
