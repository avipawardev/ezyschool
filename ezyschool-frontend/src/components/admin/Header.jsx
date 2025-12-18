import React from "react";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";

export default function Header({ setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded hover:bg-gray-100 lg:hidden"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="flex-1"></div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FiBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiUser className="text-xl text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
