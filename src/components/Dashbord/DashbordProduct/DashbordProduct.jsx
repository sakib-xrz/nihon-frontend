"use client";
import { useFetchAllBrandQuery } from "@/redux/feathers/brand/brandApi";
import {
  useDeleteProductMutation,
  useFetchAllProductsQuery,
} from "@/redux/feathers/Product/ProductApi";
import { useFetchAllCategoryQuery } from "@/redux/feathers/shop/shopApi";
import { sanitizeParams } from "@/utils";
import { Alert, Button, Input, Pagination, Spin, Table, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const DashbordProduct = () => {
  const [params, setParams] = useState([]);
  const [search, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const { data: category, isLoading: categoryLoading } =
    useFetchAllCategoryQuery();
  const { data: brand, isLoading: brandLoading } = useFetchAllBrandQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const { data, isLoading, isError, error, refetch } = useFetchAllProductsQuery(
    sanitizeParams({
      searchTerm: search,
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

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await deleteProduct(productId).unwrap();
      if (res?.success) {
        toast.error(res?.message);
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images) => (
        <Image
          src={images[0]}
          alt="product"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Brand",
      dataIndex: ["brand", "name"],
      key: "brand",
      filters: brandOptions,
      onFilter: (value, record) => record.brand?._id === value,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      filters: categoryOptions,
      onFilter: (value, record) => record.category?._id === value,
    },
    { title: "Stock", dataIndex: "in_stock", key: "in_stock" },
    {
      title: "Update",
      key: "update",
      render: (_, record) => (
        <Link href={`/dashboard/edit-product/${record._id}`}>
          <Button type="primary">Update</Button>
        </Link>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteProduct(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (extra.action === "filter") {
      const queryParams = [];
      filters.brand?.forEach((item) =>
        queryParams.push({ name: "brand", value: item })
      );
      filters.category?.forEach((item) =>
        queryParams.push({ name: "category", value: item })
      );
      setParams(queryParams);
      // refetch(); // Refetch data with new filters
    }
  };

  if (isLoading) return <Spin />;
  if (isError) {
    console.error("Error loading products:", error);
    return <Alert message="Error loading products" type="error" />;
  }
  console.log(data);
  return (
    <>
      <div className="w-[50%] py-5 mx-auto">
        <Input
          type="text"
          placeholder="Search Product"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="_id"
        pagination={false}
        loading={isLoading || categoryLoading || brandLoading}
        onChange={onChange}
        scroll={{ x: "max-content" }}
      />
      <div className="mt-5">
        <Pagination
          onChange={(value) => setPage(value)}
          pageSize={data?.meta?.limit}
          total={data?.meta?.total}
        />
      </div>
    </>
  );
};

export default DashbordProduct;
