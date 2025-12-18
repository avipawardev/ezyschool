import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { doubtAPI } from "../api/endpoints.js";
import useAuthStore from "../contexts/authStore.js";

export default function DoubtsPage() {
  const [courseId, setCourseId] = useState("");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      const response = await doubtAPI.ask({
        question,
        language,
        courseId: courseId || null,
      });
      toast.success("Question submitted! AI is processing...");
      setQuestion("");
      fetchDoubts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit question");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoubts = async () => {
    try {
      const response = await doubtAPI.getAll();
      setDoubts(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchDoubts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-bold text-indigo-600">
            AI Doubt Solver
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Ask Question Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Ask Your Question
          </h2>
          <form onSubmit={handleAskDoubt} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="marathi">Marathi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course (Optional)
                </label>
                <input
                  type="text"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Course ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Processing..." : "Ask AI"}
            </button>
          </form>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Questions
          </h2>
          {doubts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600">No questions asked yet</p>
            </div>
          ) : (
            doubts.map((doubt) => (
              <div
                key={doubt._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Q: {doubt.question}
                  </h3>
                  <div className="flex gap-3 text-sm text-gray-500">
                    <span>Language: {doubt.language}</span>
                    <span>
                      Status: {doubt.aiSolved ? "✅ Solved" : "⏳ Processing"}
                    </span>
                  </div>
                </div>

                {doubt.answer && (
                  <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                    <p className="font-semibold text-gray-800 mb-2">
                      AI Answer:
                    </p>
                    <p className="text-gray-700">{doubt.answer}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="text-green-600 hover:text-green-700 text-sm font-semibold">
                        ✓ Helpful
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                        ✗ Not Helpful
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
