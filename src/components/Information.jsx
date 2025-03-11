"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/feathers/Auth/AuthSlice";
import MobileMenu from "./MobileMenu";

export default function Information() {
  const currentCart = useSelector((state) => state?.products?.cartItem);
  const wishlist = useSelector((state) => state?.wishlist?.wishlist);
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-5">
      {/* Wishlist Icon */}
      <div className="relative">
        <Link href="/wishlist">
          <button className="text-white text-2xl focus:outline-none">
            <i className="fa-solid fa-heart"></i>
          </button>
        </Link>
        {wishlist?.length > 0 && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {wishlist.length}
          </div>
        )}
      </div>

      {/* Cart Icon */}
      <div className="relative">
        <Link href="/cart">
          <button className="text-white text-2xl focus:outline-none">
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
        </Link>
        {currentCart?.length > 0 && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {currentCart.length}
          </div>
        )}
      </div>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="text-white text-2xl focus:outline-none"
        >
          <i className="fa-solid fa-user"></i>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
            <ul>
              {!user && (
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 rounded rounded-b-none">
                  <Link href="/login">Login</Link>
                </li>
              )}
              {user?.role === "admin" && (
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 rounded">
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              )}
              {!user && (
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 rounded">
                  <Link href="/signup">Registration</Link>
                </li>
              )}
              {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 rounded">
                <Link href="/forgot-password">Forgot Password</Link>
              </li> */}
              {user && (
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 rounded">
                  <Link href="/myorder">My Order</Link>
                </li>
              )}
              {user && (
                <li
                  className="px-4 py-2 hover:bg-red-500 cursor-pointer text-gray-800 rounded hover:text-white rounded-t-none"
                  onClick={() => user && dispatch(logout())}
                >
                  Logout
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Hamburger for Mobile Drawer */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="text-white text-2xl focus:outline-none md:hidden"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="relative ml-auto bg-pink-400 w-11/12 max-w-xs p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg">Navigation</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-white text-2xl focus:outline-none"
              >
                &times;
              </button>
            </div>
            <MobileMenu />
          </div>
        </div>
      )}
    </div>
  );
}
