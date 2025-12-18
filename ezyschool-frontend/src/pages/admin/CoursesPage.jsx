import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiVideo, FiFileText, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminCourseAPI as courseAPI } from "../../api/adminEndpoints.js";

// Mock Admin Data
const MOCK_ADMIN_COURSES = [
  { _id: "1", title: "Class 10 Mathematics", instructor: { name: "R.K. Sharma" }, students: 124, status: "Published", price: 999 },
  { _id: "2", title: "Physics Class 12", instructor: { name: "H.C. Verma" }, students: 89, status: "Draft", price: 1499 },
  { _id: "3", title: "Chemistry Class 11", instructor: { name: "A.K. Gupta" }, students: 56, status: "Published", price: 1299 }
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
        setLoading(true);
        const res = await courseAPI.getAll(); 
        setCourses(res.data.data || []);
        setLoading(false);
    } catch (err) {
        console.error("Failed to fetch courses:", err);
        // Fallback to mock if really needed, or just show error
        toast.error("Failed to load courses");
        setCourses([]); // Or MOCK_ADMIN_COURSES if you want to keep UI usable
        setLoading(false);
    }
  }

  const handleDelete = (id) => {
      if(window.confirm("Are you sure you want to delete this course?")) {
          setCourses(courses.filter(c => c._id !== id));
          toast.success("Course deleted");
      }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your course catalog</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
          >
              <FiPlus /> Create New Course
          </button>
      </div>

      {/* Filters/Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex gap-4">
          <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <select className="border border-gray-300 rounded px-4 py-2">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
          </select>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
              <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                      <th className="p-4">Course Title</th>
                      <th className="p-4">Instructor</th>
                      <th className="p-4">Students</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {loading ? (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading courses...</td></tr>
                  ) : courses.length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500">No courses found.</td></tr>
                  ) : (
                      courses.map(course => (
                          <tr key={course._id} className="hover:bg-gray-50 transition">
                              <td className="p-4 font-medium text-gray-900">{course.title}</td>
                              <td className="p-4 text-gray-600">{course.instructor?.name || "Unknown"}</td>
                              <td className="p-4 text-gray-600">{course.students}</td>
                              <td className="p-4 text-gray-900 font-bold">₹{course.price}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      course.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                      {course.status}
                                  </span>
                              </td>
                              <td className="p-4 text-right flex justify-end gap-2">
                                  <button title="Upload Lectures" className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiVideo /></button>
                                  <button title="Assignments" className="p-2 text-purple-600 hover:bg-purple-50 rounded"><FiFileText /></button>
                                  <button title="Edit" className="p-2 text-gray-600 hover:bg-gray-100 rounded"><FiEdit /></button>
                                  <button onClick={() => handleDelete(course._id)} title="Delete" className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                              </td>
                          </tr>
                      ))
                  )}
              </tbody>
          </table>
      </div>
      
      {/* Create Modal Mockup */}
      {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Course Title</label>
                          <input type="text" className="w-full border p-2 rounded" placeholder="e.g. Class 10 Physics" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Class</label>
                              <select className="w-full border p-2 rounded">
                                  <option>Class 10</option>
                                  <option>Class 12</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                              <input type="number" className="w-full border p-2 rounded" placeholder="999" />
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                      <button onClick={() => {toast.success("Course Created!"); setShowModal(false);}} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
