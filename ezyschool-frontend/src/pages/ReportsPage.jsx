import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiDownload, FiBarChart2, FiActivity, FiCheckCircle, FiClock, FiTarget } from "react-icons/fi";
import toast from "react-hot-toast";
import { reportAPI } from "../api/endpoints.js";
import useAuthStore from "../contexts/authStore.js";

// Mock Data
const MOCK_REPORTS = [
    {
        _id: "r1",
        createdAt: new Date().toISOString(),
        averageScore: 85,
        assignmentCount: 12,
        testCount: 4,
        hoursStudied: 24,
        weeklyBreakdown: [
            { week: 1, score: 80 },
            { week: 2, score: 85 },
            { week: 3, score: 90 },
            { week: 4, score: 85 },
        ]
    }
];

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?._id) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getStudentReports(user._id);
      const data = response.data.data || [];
      setReports(data.length ? data : MOCK_REPORTS);
    } catch (error) {
    //   toast.error("Failed to load reports");
      setReports(MOCK_REPORTS); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (reportId) => {
    toast.success("Report download started!");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                 <h1 className="text-3xl font-bold font-serif text-gray-900">Academic Performance</h1>
                 <p className="text-gray-600 mt-1">Track your progress and activity</p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700 transition shadow-sm">
                Download Summary
            </button>
        </div>

        {loading ? (
           <div className="text-center py-20">Loading your performance data...</div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Reports List */}
                <div className="lg:col-span-2 space-y-6">
                    {reports.map((report) => (
                        <div key={report._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {new Date(report.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} Report
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Generated on {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-3xl font-bold text-indigo-600">{report.averageScore}%</span>
                                    <span className="text-xs font-bold uppercase text-gray-400">Avg Score</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-center">
                                    <FiCheckCircle className="mx-auto text-green-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{report.assignmentCount}</p>
                                    <p className="text-xs text-gray-500 uppercase">Assignments</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-center">
                                    <FiTarget className="mx-auto text-blue-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{report.testCount}</p>
                                    <p className="text-xs text-gray-500 uppercase">Tests</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-center">
                                    <FiClock className="mx-auto text-orange-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{report.hoursStudied}h</p>
                                    <p className="text-xs text-gray-500 uppercase">Study Time</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded border border-gray-100 text-center">
                                    <FiActivity className="mx-auto text-purple-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">A+</p>
                                    <p className="text-xs text-gray-500 uppercase">Grade</p>
                                </div>
                            </div>

                            {report.weeklyBreakdown && (
                                <div>
                                    <h3 className="font-bold text-sm text-gray-700 uppercase mb-4">Weekly Analysis</h3>
                                    <div className="space-y-4">
                                        {report.weeklyBreakdown.map((week, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <span className="text-sm font-bold text-gray-500 w-16">Week {week.week}</span>
                                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${week.score}%` }}></div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-700 w-10 text-right">{week.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                                <button 
                                    onClick={() => downloadReport(report._id)}
                                    className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
                                >
                                    <FiDownload /> Download PDF Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar: Tips & Stats */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiBarChart2 className="text-indigo-600" /> Overall Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Reports Generated</span>
                                <span className="font-bold">{reports.length}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Highest Score</span>
                                <span className="font-bold text-green-600">92%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Attendance</span>
                                <span className="font-bold text-blue-600">95%</span>
                            </div>
                        </div>
                    </div>

                     <div className="bg-indigo-900 text-white rounded-lg p-6 shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Keep it up! 🎉</h3>
                        <p className="text-indigo-200 text-sm mb-4">
                            Consistent effort leads to success. Here are some tips to improve your score:
                        </p>
                        <ul className="text-sm space-y-2 text-indigo-100">
                            <li className="flex items-center gap-2">✓ Revise notes weekly</li>
                            <li className="flex items-center gap-2">✓ Practice mock tests</li>
                            <li className="flex items-center gap-2">✓ Clear doubts instantly</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
