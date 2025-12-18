import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiBell,
  FiHeart,
  FiUser,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import useAuthStore from "../contexts/authStore";

export default function StudentNavbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              EzySchool
            </h1>
        </Link>

        {/* Categories (Desktop) */}
        <div className="hidden md:flex items-center gap-1 cursor-pointer text-sm font-medium hover:text-purple-600 transition">
            <span>Categories</span> 
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search for anything"
            className="w-full py-2.5 pl-10 pr-4 text-sm text-gray-700 bg-gray-50 border border-black rounded-full focus:outline-none focus:ring-0 focus:bg-white placeholder-gray-500 transition-all"
          />
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/courses?category=class-5-8" className="hover:text-purple-600 transition">
            Class 5-8
          </Link>
          <Link to="/courses?category=class-9-10" className="hover:text-purple-600 transition">
            Class 9-10
          </Link>
          <Link to="/courses?category=class-11-12" className="hover:text-purple-600 transition">
             Class 11-12
          </Link>
          <Link to="/doubts" className="hover:text-purple-600 transition">
             Ask Doubt
          </Link>
        </div>

        {/* Icons & Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
            <button className="hidden sm:block hover:text-purple-600 transition relative">
                 <FiHeart className="text-xl" />
            </button>
            <button className="hover:text-purple-600 transition relative">
                <FiShoppingCart className="text-xl" />
            </button>
            <button className="hover:text-purple-600 transition relative">
                 <FiBell className="text-xl" />
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-600 rounded-full"></span>
            </button>
            
            {/* User Profile / Logout */}
             <div className="group relative">
                <button className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition">
                    {user?.name?.[0]?.toUpperCase() || <FiUser />}
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 hidden group-hover:block">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600">
                        Public Profile
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600">
                        Edit Profile
                    </Link>
                    <div className="border-t border-gray-100 mt-1"></div>
                     <Link to="/referrals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600">
                        Referrals
                    </Link>
                    <Link to="/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600">
                        My Reports
                    </Link>
                    <div className="border-t border-gray-100 mt-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600">
                        Log out
                    </button>
                </div>
             </div>
        </div>
      </div>
      
      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
      </div>
    </nav>
  );
}
