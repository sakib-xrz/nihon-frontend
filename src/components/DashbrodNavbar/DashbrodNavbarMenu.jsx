import {
  CarOutlined,
  EditOutlined,
  HomeOutlined,
  OrderedListOutlined,
  PictureOutlined,
  PlusOutlined,
  ProductOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const menuItems = [
  {
    key: "home",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <HomeOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <Link href="/" className="font-bold text-gray-600">
          Home
        </Link>
      </div>
    ),
  },
  {
    key: "user",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <UserOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <Link href="/dashboard/user" className="font-bold text-gray-600">
          User
        </Link>
      </div>
    ),
  },
  {
    key: "productManagement",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <ShoppingOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <span className="font-bold text-gray-600">Product Management</span>
      </div>
    ),
    children: [
      {
        key: "products",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <ProductOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link
              href="/dashboard/products"
              className="font-bold text-gray-600"
            >
              All Product
            </Link>
          </div>
        ),
      },
      {
        key: "addNewProduct",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <PlusOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link
              href="/dashboard/add-new-product"
              className="font-bold text-gray-600"
            >
              Add New Product
            </Link>
          </div>
        ),
      },
    ],
  },
  {
    key: "order",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <OrderedListOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <span className="font-bold text-gray-600">Order</span>
      </div>
    ),
    children: [
      {
        key: "allOrders",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <ProfileOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link
              href="/dashboard/all-order"
              className="font-bold text-gray-600"
            >
              All Orders
            </Link>
          </div>
        ),
      },
    ],
  },
  {
    key: "category",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <PictureOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <span className="font-bold text-gray-600">Category</span>
      </div>
    ),
    children: [
      {
        key: "viewCategories",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <PictureOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link
              href="/dashboard/view-category"
              className="font-bold text-gray-600"
            >
              View Categories
            </Link>
          </div>
        ),
      },
      {
        key: "createCategory",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <PlusOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link
              href="/dashboard/category"
              className="font-bold text-gray-600"
            >
              Create Category
            </Link>
          </div>
        ),
      },
    ],
  },
  {
    key: "brand",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <PictureOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <span className="font-bold text-gray-600">Brand</span>
      </div>
    ),
    children: [
      {
        key: "createBrand",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <PlusOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link href="/dashboard/brand" className="font-bold text-gray-600">
              Create Brand
            </Link>
          </div>
        ),
      },
      {
        key: "viewBrands",
        label: (
          <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
            <div className="mr-2">
              <PictureOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
            </div>
            <Link
              href="/dashboard/view-brand"
              className="font-bold text-gray-600"
            >
              View Brands
            </Link>
          </div>
        ),
      },
    ],
  },
  {
    key: "delivery",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <CarOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <Link href="/dashboard/delivery" className="font-bold text-gray-600">
          Delivery
        </Link>
      </div>
    ),
  },
  {
    key: "banner",
    label: (
      <div className="transition-transform duration-300 hover:translate-x-2 flex items-center">
        <div className="mr-2">
          <PictureOutlined style={{ fontSize: "18px", color: "#f9a8d4" }} />
        </div>
        <Link href="/dashboard/banner" className="font-bold text-gray-600">
          Banner
        </Link>
      </div>
    ),
  },
];

export default menuItems;
