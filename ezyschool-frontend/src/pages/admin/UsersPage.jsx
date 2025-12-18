import React, { useState } from "react";
import { FiSearch, FiTrash2, FiMail, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";

// Mock Users Data
const MOCK_USERS = [
  { _id: 1, name: "Student User", email: "student@ezyschool.com", role: "student", class: "10", joined: "2024-01-15", status: "Active" },
  { _id: 2, name: "John Doe", email: "john@example.com", role: "student", class: "12", joined: "2024-02-01", status: "Inactive" },
  { _id: 3, name: "Alice Smith", email: "alice@example.com", role: "student", class: "9", joined: "2024-02-10", status: "Active" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
      if(window.confirm("Delete this user?")) {
          setUsers(users.filter(u => u._id !== id));
          toast.success("User deleted");
      }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
            <p className="text-gray-600 mt-1">View, edit or deactivate student accounts</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Export CSV
          </button>
      </div>

       {/* Search */}
       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 max-w-md">
          <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
              <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500">No users found</td></tr>
                  ) : (
                      filteredUsers.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50 transition">
                              <td className="p-4 font-bold text-gray-800">{user.name}</td>
                              <td className="p-4 text-gray-600">{user.email}</td>
                              <td className="p-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">Class {user.class}</span></td>
                              <td className="p-4">
                                  <span className={`text-xs px-2 py-1 rounded font-bold ${user.status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                                      {user.status}
                                  </span>
                              </td>
                              <td className="p-4 text-sm text-gray-500">{user.joined}</td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                  <button title="Email" className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiMail /></button>
                                  <button title="Edit" className="p-2 text-gray-600 hover:bg-gray-100 rounded"><FiEdit2 /></button>
                                  <button onClick={() => handleDelete(user._id)} title="Delete" className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                              </td>
                          </tr>
                      ))
                  )}
              </tbody>
          </table>
      </div>
    </div>
  );
}
