"use client";

import { Button, Table, Modal, Form, Input } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import { useDeleteCategoryMutation, useFetchAllCategoryQuery } from '@/redux/feathers/shop/shopApi';
import EditCategoryForm from '../EditCategoryForm/EditCategoryForm';
import { toast } from 'sonner';

function Page() {
  const { isLoading, isError, data } = useFetchAllCategoryQuery();
  const [deleteCategory] = useDeleteCategoryMutation()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Track the category being edited

  const tableData = data?.data;

  const handleEditClick = (category) => {
    setEditingCategory(category); // Set the current category to be edited
    setIsModalVisible(true); // Show the modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Hide the modal
    setEditingCategory(null); // Clear the category being edited
  };

  const handleSave = () => {
    // Logic to handle saving the edited category
    console.log('Saving:', editingCategory);
    setIsModalVisible(false); // Hide the modal after saving
  };

  const handleDeleteCategory = async (id)=>{
    const deleted = await deleteCategory(id)
    if(deleted?.data?.success){
      toast.success(deleted?.data?.message)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image src={image} width={70} height={70} style={{ borderRadius: '50%' }} alt="Category" />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (category) => (
        <>
          <Button type="dashed" className="text-gray-800" size="large" onClick={() => handleEditClick(category)}>
            Edit Category
          </Button>
          <Button onClick={()=>handleDeleteCategory(category._id)} type="dashed" className="text-red-500" size="large" style={{ marginLeft: '10px' }}>
            Delete Category
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h3 className="font-bold text-2xl px-2">View Category List</h3>
      <div className="mx-auto">
        <div className="overflow-x-auto w-full">
          <Table
            loading={isLoading}
            pagination={false}
            dataSource={tableData}
            columns={columns}
            rowKey="id" // Make sure to have a unique key for each row
          />
        </div>
      </div>

      {/* Edit Category Modal */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText="Save"
      >
        <EditCategoryForm previousCategoryValue={editingCategory} />
      </Modal>
    </div>
  );
}

export default Page;