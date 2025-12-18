import React, { useState, useEffect } from "react";
import {
  FiFileText,
  FiSend,
  FiPlus,
  FiFilter,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { adminReportAPI } from "../../api/adminEndpoints";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  
  // Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateData, setGenerateData] = useState({
    studentId: "",
    courseId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminReportAPI.getAll(filters);
      setReports(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = async (reportId) => {
    try {
      toast.loading("Sending report...", { id: "sendReport" });
      await adminReportAPI.sendToParent(reportId);
      toast.success("Report sent to parent via WhatsApp!", { id: "sendReport" });
      
      // Update local state
      setReports(reports.map(r => 
        r._id === reportId 
          ? { ...r, sentToParent: true, sentAt: new Date() } 
          : r
      ));
    } catch (error) {
      console.error("Error sending report:", error);
      toast.error(error.response?.data?.message || "Failed to send report", { id: "sendReport" });
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!generateData.studentId || !generateData.courseId) {
      toast.error("Please provide Student ID and Course ID");
      return;
    }

    try {
      setGenerating(true);
      await adminReportAPI.generate(generateData);
      toast.success("Report generated successfully!");
      setShowGenerateModal(false);
      fetchReports(); // Refresh list
      // Reset form (keep month/year)
      setGenerateData(prev => ({ ...prev, studentId: "", courseId: "" }));
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [2023, 2024, 2025];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>
           <p className="text-gray-600 mt-2">Manage and track student progress reports</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus /> Generate New Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <FiFilter />
          <span className="font-medium">Filter by:</span>
        </div>
        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Reports Found</h3>
            <p className="text-gray-500 mt-2">No reports generated for the selected month.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {report.studentId?.name?.[0] || "?"}
                          </div>
                          <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{report.studentId?.name || "Unknown Student"}</div>
                              <div className="text-sm text-gray-500">{report.studentId?.email}</div>
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.courseId?.title || "Unknown Course"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${report.performanceAnalysis === 'excellent' ? 'bg-green-100 text-green-800' : 
                          report.performanceAnalysis === 'good' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {report.performanceAnalysis?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.completedAssignments} / {report.totalAssignments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex flex-col">
                          {report.sentToParent ? (
                              <span className="flex items-center text-green-600 text-xs font-medium">
                                  <FiCheckCircle className="mr-1" /> Sent
                              </span>
                          ) : (
                              <span className="flex items-center text-yellow-600 text-xs font-medium">
                                  <FiAlertCircle className="mr-1" /> Pending
                              </span>
                          )}
                          {report.sentAt && <span className="text-xs text-gray-400">{new Date(report.sentAt).toLocaleDateString()}</span>}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                          onClick={() => handleSendReport(report._id)}
                          disabled={report.sentToParent}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md transition
                              ${report.sentToParent 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                          <FiSend /> {report.sentToParent ? "Sent" : "WhatsApp"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Monthly Report</h2>
            <form onSubmit={handleGenerateReport}>
              <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                   <input 
                      type="text" 
                      placeholder="Enter Student ID"
                      value={generateData.studentId}
                      onChange={(e) => setGenerateData({...generateData, studentId: e.target.value})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                   <input 
                      type="text" 
                      placeholder="Enter Course ID"
                      value={generateData.courseId}
                      onChange={(e) => setGenerateData({...generateData, courseId: e.target.value})}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <select
                            value={generateData.month}
                            onChange={(e) => setGenerateData({...generateData, month: parseInt(e.target.value)})}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <select
                            value={generateData.year}
                            onChange={(e) => setGenerateData({...generateData, year: parseInt(e.target.value)})}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                   type="button"
                   onClick={() => setShowGenerateModal(false)}
                   className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                   Cancel
                </button>
                <button
                   type="submit"
                   disabled={generating}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                   {generating ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
