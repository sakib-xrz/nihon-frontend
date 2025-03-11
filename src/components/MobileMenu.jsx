import Link from 'next/link'
import React from 'react'
import { HomeOutlined, ShopOutlined, AppstoreOutlined, PhoneOutlined } from '@ant-design/icons'; // Import icons from Ant Design

export default function MobileMenu() {
  return (
    <div>
      <ul className='flex flex-col gap-4 text-left'>
        <li>
          <Link className='font-bold text-[20px] text-white flex items-center gap-2' href="/">
            <HomeOutlined /> Home
          </Link>
        </li>
        <li>
          <Link className='font-bold text-[20px] text-white flex items-center gap-2' href="/product">
            <ShopOutlined /> Shop
          </Link>
        </li>
        <li>
          <Link className='font-bold text-[20px] text-white flex items-center gap-2' href="/category">
            <AppstoreOutlined /> Category
          </Link>
        </li>
        <li>
          <Link className='font-bold text-[20px] text-white flex items-center gap-2' href="/contact-us">
            <PhoneOutlined /> Contact Us
          </Link>
        </li>
      </ul>
    </div>
  );
}
