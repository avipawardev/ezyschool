import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FiBook, label: "Courses", path: "/admin/courses" },
    { icon: FiUsers, label: "Users", path: "/admin/users" },
    { icon: FiBarChart, label: "Reports", path: "/admin/reports" },
    { icon: FiSettings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-indigo-900 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        <h2 className={`font-bold text-xl ${!sidebarOpen && "hidden"}`}>
          EzySchool Admin
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-indigo-800"
        >
          <FiMenu />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-indigo-700 text-white"
                  : "hover:bg-indigo-800 text-gray-300"
              }`}
            >
              <Icon className="text-xl" />
              <span className={`${!sidebarOpen && "hidden"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
