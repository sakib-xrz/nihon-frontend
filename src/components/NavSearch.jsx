"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Your Product"
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600"
      >
        Search
      </button>
    </form>
  );
}
