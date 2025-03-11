"use client";
import Link from "next/link";
import Information from "@/components/Information";
import NavSearch from "@/components/NavSearch";
import ResPonsiveSearch from "@/components/ResPonsiveSearch";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-pink-400 shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h3 className="text-2xl font-bold text-white">LOGO</h3>

          {/* Desktop Search */}
          <div className="hidden md:block w-2/3">
            <NavSearch />
          </div>

          {/* User Information & Icons */}
          <div>
            <Information />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="mt-4 hidden md:block">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link href="/" className="text-white hover:text-gray-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/product" className="text-white hover:text-gray-200">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/category" className="text-white hover:text-gray-200">
                Category
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className="text-white hover:text-gray-200"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Search */}
        <div className="block md:hidden mt-4">
          <ResPonsiveSearch />
        </div>
      </div>
    </nav>
  );
}
