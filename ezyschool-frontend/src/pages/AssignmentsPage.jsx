import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiLoader, FiUpload, FiCalendar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { assignmentAPI } from "../api/endpoints.js";

const MOCK_ASSIGNMENTS = [
  { _id: 1, title: "Algebra Worksheet 1.2", description: "Complete exercises 1-10 from Chapter 1", dueDate: new Date(Date.now() + 86400000).toISOString(), status: "pending", subject: "Mathematics" },
  { _id: 2, title: "Photosynthesis Essay", description: "Write a 500 word essay on the process of photosynthesis", dueDate: new Date(Date.now() - 86400000).toISOString(), status: "graded", grade: "A", subject: "Biology" },
  { _id: 3, title: "Physics Lab Report", description: "Submit the lab report for the pendulum experiment", dueDate: new Date(Date.now() + 172800000).toISOString(), status: "submitted", subject: "Physics" },
]

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentAPI.getAll();
      const data = response.data.data || [];
      setAssignments(data.length ? data : MOCK_ASSIGNMENTS);
    } catch (error) {
    //   toast.error("Failed to load assignments");
       setAssignments(MOCK_ASSIGNMENTS);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'graded': return 'text-green-600 bg-green-100';
          case 'submitted': return 'text-blue-600 bg-blue-100';
          default: return 'text-yellow-600 bg-yellow-100';
      }
  }

  const getStatusIcon = (status) => {
      switch(status) {
          case 'graded': return <FiCheckCircle />;
          case 'submitted': return <FiCheckCircle />;
          default: return <FiAlertCircle />;
      }
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-1">Manage your homework and project submissions</p>
          </div>

        {/* Content */}
          {loading ? (
             <div className="text-center py-20">Loading assignments...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map(assg => (
                    <div key={assg._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 border border-gray-200 px-2 py-1 rounded">
                                {assg.subject || "General"}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${getStatusColor(assg.status)}`}>
                                {getStatusIcon(assg.status)}
                                {assg.status.charAt(0).toUpperCase() + assg.status.slice(1)}
                            </span>
                        </div>
                        
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{assg.title}</h3>
                        <p className="text-sm text-gray-600 flex-grow mb-4">{assg.description}</p>
                        
                        <div className="border-t border-gray-100 pt-4 mt-auto">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <FiCalendar />
                                <span>Due: {new Date(assg.dueDate).toLocaleDateString()}</span>
                            </div>
                            
                            {assg.status === 'pending' ? (
                                <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                                    <FiUpload /> Submit Work
                                </button>
                            ) : (
                                <div className="text-center py-2 bg-gray-50 rounded text-sm font-semibold text-gray-600 border border-gray-200">
                                    {assg.status === 'graded' ? `Grade: ${assg.grade}` : 'Submitted'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
          )}
      </div>
    </div>
  );
}
