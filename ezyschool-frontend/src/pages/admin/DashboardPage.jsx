import React from "react";
import {
  FiBook,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Courses", value: "24", color: "blue" },
    { label: "Total Students", value: "1,245", color: "green" },
    { label: "Total Revenue", value: "$45,230", color: "purple" },
    { label: "Active Sessions", value: "89", color: "orange" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p
              className={`text-3xl font-bold mt-2 text-${stat.color}-600`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/admin/courses")}>
          <div className="flex items-center">
            <FiBook className="text-4xl text-blue-500" />
            <div className="ml-4">
              <p className="font-bold text-lg">Manage Courses</p>
              <p className="text-gray-600 text-sm">
                Add, edit, or delete courses
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/admin/users")}>
          <div className="flex items-center">
            <FiUsers className="text-4xl text-green-500" />
            <div className="ml-4">
              <p className="font-bold text-lg">Manage Users</p>
              <p className="text-gray-600 text-sm">
                View and manage student accounts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer" onClick={() => navigate("/admin/reports")}>
          <div className="flex items-center">
            <FiBarChart2 className="text-4xl text-purple-500" />
            <div className="ml-4">
              <p className="font-bold text-lg">View Reports</p>
              <p className="text-gray-600 text-sm">
                Analyze platform statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
