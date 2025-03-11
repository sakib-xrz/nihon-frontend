"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '../style/navigation.css';
import { Drawer, Dropdown, Menu } from 'antd';
import MobileMenu from './MobileMenu';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { logout } from '@/redux/feathers/Auth/AuthSlice';

export default function Information() {
    const currentCart = useSelector((state) => state?.products?.cartItem);
    const wishlist = useSelector((state) => state?.wishlist?.wishlist);
    const user = useSelector((state)=> state?.auth?.user);
    const dispatch = useDispatch()

    const [open, setOpen] = useState(false);
    const [drawerWidth, setDrawerWidth] = useState('30%');

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    // Update drawer width based on screen size
    useEffect(() => {
        const updateDrawerWidth = () => {
            if (window.innerWidth < 640) {
                setDrawerWidth('50%');
            } else if (window.innerWidth < 768) {
                setDrawerWidth('40%');
            } else {
                setDrawerWidth('30%');
            }
        };

        window.addEventListener('resize', updateDrawerWidth);
        updateDrawerWidth();

        return () => {
            window.removeEventListener('resize', updateDrawerWidth);
        };
    }, []);
    
    const menu = (
        <Menu>
          <Menu.Item  key="1">
            {user ? <p onClick={()=>dispatch(logout())} className='text-[20px]'>
              Logout
            </p>
            :
            <Link className='text-[20px]' href="/login">
              Login
            </Link>}
          </Menu.Item>
          <Menu.Item  key="2">
            <Link className='text-[20px]' href="/signup">
              Registration
            </Link>
          </Menu.Item>
          <Menu.Item  key="3">
            <Link className='text-[20px]' href="/forgot-password">
              Forgot Password
            </Link>
          </Menu.Item>
          {user?.role === 'admin' && <Menu.Item  key="3">
            <Link className='text-[20px]' href="/dashboard">
            Dashboard
            </Link>
          </Menu.Item>}
          {user  && <Menu.Item  key="3">
            <Link className='text-[20px]' href="/myorder">
            My Order
            </Link>
          </Menu.Item>}
        </Menu>
      );

    return (
        <>
            <ul className='flex gap-5 items-center'>
                <li>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <i className="text-white text-[25px] fa-solid fa-user cursor-pointer">
                        </i>
                    </Dropdown>
                </li>
                <li className='relative'>
                    <Link href='/cart'>
                        <i className="text-white text-[25px] fa-solid fa-cart-shopping"></i>
                        {currentCart?.length > 0 && (
                            <div className='absolute text-red-600 w-[35px] font-[700] h-[35px] p-1 mt-[-55px] left-3 flex justify-center items-center border rounded-full'>
                                {currentCart.length}
                            </div>
                        )}
                    </Link>
                </li>
                <li className='relative'>
                    <Link href='/wishlist'>
                        <i className="text-white text-[25px] fa-solid fa-heart"></i>
                        {wishlist?.length > 0 && (
                            <div className='absolute text-red-600 w-[35px] font-[700] h-[35px] p-1 mt-[-55px] left-3 flex justify-center items-center border rounded-full'>
                                {wishlist.length}
                            </div>
                        )}
                    </Link>
                </li>
                <li onClick={showDrawer} className='hamburger'>
                    <i className="text-white text-[25px] fa-solid fa-bars"></i>
                </li>
            </ul>

            <Drawer
                title={<p className='text-[20px] text-white'>Navigation</p>}
                placement="right"
                closable={false}
                onClose={onClose}
                open={open}
                width={drawerWidth}
                style={{ backgroundColor: '#F9A8D4' }}
                className='custom-drawer bg-[#F9A8D4]'
            >
                <MobileMenu />
            </Drawer>
        </>
    );
}
