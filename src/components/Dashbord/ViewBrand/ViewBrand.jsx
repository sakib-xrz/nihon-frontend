"use client"
import { useDeleteBrandMutation, useFetchAllBrandQuery } from '@/redux/feathers/brand/brandApi';
import { Button, Table } from 'antd';
import Image from 'next/image';
import { toast } from 'sonner';

function ViewBrand() {
  const { isLoading, isError, data } = useFetchAllBrandQuery();
  const [deleteBrand] = useDeleteBrandMutation()
  const tableData = data?.data;

  const handleDeleteBrand = async(id)=>{
    const deleted = await deleteBrand(id?._id)
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
        <Image
          src={image}
          width={100}
          height={100}
          alt="Brand Image" // Add meaningful alt text here
          style={{ borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_,id) => (
       <>
         <Button onClick={()=>handleDeleteBrand(id)} type="dashed" className="bg-red-500 text-white hover:bg-sky-500">
          Delete Brand
        </Button>
       </>
      ),
    },
  ];

  return (
    <div>
      <h3 className="font-bold text-2xl px-2">View Brand List</h3>
      <div className="mx-auto">
        <Table
          scroll={{
            x: 1300, // Horizontal scroll
            y: 500,  // Vertical scroll height
          }}
          loading={isLoading}
          pagination={false}
          dataSource={tableData}
          columns={columns}
        />
      </div>
    </div>
  );
}

export default ViewBrand;