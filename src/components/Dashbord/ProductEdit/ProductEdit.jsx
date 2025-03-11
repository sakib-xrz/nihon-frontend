"use client";
import Error from '@/components/Error';
import { useFetchAllProductsQuery } from '@/redux/feathers/Product/ProductApi';
import { Button, Input, Modal, Pagination, Spin, Table } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import EditUpdateProductForm from '../EditUpdateProductForm/EditUpdateProductForm';
import Loading from '@/components/Loading';

export default function ProductEdit() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const { isLoading, isError, data } = useFetchAllProductsQuery(
    [
      { name: 'searchTerm', value: searchTerm || '' },
      { name: 'page', value: page || 1 },
      { name: 'limit', value: limit || 10 },
    ]
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [singleData, setSingleData] = useState({})
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  let content = null;
  let dataSource = [];

  if (isLoading) {
    content = <Loading />;
  }
  const handlePageChange = (page) => {
    setPage(page);
  };

  if (isError) {
    content = <Error error="Something went wrong" />;
  }

  if (data?.data) {
    if (data.data.length === 0) {
      content = <Error error="No Data found" />;
    } else {
      dataSource = data.data; // Set data source only if data exists and has items
    }
  }
  const columns = [
    {
      title: 'Images',
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <div className="flex gap-4 items-center">
          {images?.map((image, index) => (
            <Image
            className="rounded-md"
              key={index}
              src={image}
              width={50}
              height={50}
              alt={`product-image-${index}`}
            />
          ))}
        </div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Brand Name',
      dataIndex: ['brand', 'name'], // Accessing nested data
      key: 'brand',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'In Stock',
      dataIndex: 'in_stock',
      key: 'in_stock',
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span onClick={() => setSingleData(record)}>
          <Button type="dashed" onClick={showLoading} >
            Edit Product
          </Button>
        </span>
      ),
    },
  ];

  const totalProduct = data?.meta?.total

  return (
    <>
      <div className="mb-10">

        <div className="container text-center my-8 mx-auto">
          <Input size="large" style={{ width: '60%' }} placeholder="Search Your Product" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <Table
          bordered
          scroll={{ x: true }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <p className="text-center">{content}</p>
        <div className="flex justify-center my-10">
          <Pagination
            current={page}
            total={totalProduct}
            pageSize={limit}
            onChange={handlePageChange} />
        </div>
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            <EditUpdateProductForm previousData={singleData} />
          </>
        )}
      </Modal>
    </>
  );
}