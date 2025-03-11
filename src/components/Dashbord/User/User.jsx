"use client"
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { useFetchAllUsersQuery } from '@/redux/feathers/user/userApi'
import { Button, Table, Tag } from 'antd'

export default function User() {
    const { isLoading, isError, data } = useFetchAllUsersQuery()
    let content = null
    if (isLoading) {
        content = <Loading />
    }
    if (!isLoading && isError) {
        content = <Error error="somthing went wrong" />
    }
    if (!isLoading && isError && data?.data?.length === 0) {
        content = <Error error="No Data Found" />
    }



    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <button className={role === 'admin' ? 'bg-green-600 text-white font-bold px-2 py-1 rounded ' : ' px-2 py-1 rounded border-dashed border font-bold' }>{role}</button>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (isVerified) => <Tag className='bg-green-500 text-white'>{(isVerified ? 'Yes' : 'No')}</Tag>,
        },
        {
            title: 'Verified',
            dataIndex: 'isVerified',
            key: 'isVerified',
            render: (isVerified) => <Tag className='text-green-500'>{(isVerified ? 'Yes' : 'No')}</Tag>, // Render as 'Yes' or 'No'
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleDateString(), // Format date
        },
        {
            title: 'Action',
            key: 'action',
            render: (_,data)=> <Button type='dashed'>Convert To Admin</Button>, // Format date
        },
    ];

    return (
        <div>
            <p className='text-center py-5'>{content}</p>
            <Table
                loading={isLoading}
                bordered
                scroll={{ x: true }}
                columns={columns}
                dataSource={data?.data}
                pagination={false}
            />
            <p className="text-center">{content}</p>
        </div>
    )
}
