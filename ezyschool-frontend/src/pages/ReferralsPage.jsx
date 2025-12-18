import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import { referralAPI } from "../api/endpoints.js";
import useAuthStore from "../contexts/authStore.js";

export default function ReferralsPage() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await referralAPI.getMyEarnings();
      setEarnings(response.data.data || {});
    } catch (error) {
      toast.error("Failed to load earnings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast.success("Referral code copied!");
    }
  };

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
            Referral Program
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <FiLoader className="animate-spin text-4xl text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Referral Code Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Your Referral Code</h2>
              <div className="bg-white text-gray-800 rounded-lg px-6 py-4 flex items-center justify-between">
                <span className="text-3xl font-bold tracking-widest">
                  {user?.referralCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FiCopy /> Copy
                </button>
              </div>
              <p className="mt-4 text-sm opacity-90">
                Share this code with friends and earn 30% commission on their
                purchases!
              </p>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm mb-2">Total Referrals</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {earnings?.totalReferrals || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm mb-2">Active Referrals</p>
                <p className="text-4xl font-bold text-green-600">
                  {earnings?.activeReferrals || 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-yellow-600">
                  ₹{earnings?.totalEarnings || 0}
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Share Your Code
                    </h4>
                    <p className="text-gray-600">
                      Send your unique referral code to friends and family
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      They Register
                    </h4>
                    <p className="text-gray-600">
                      Friends enter your code during registration
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      You Earn 30%
                    </h4>
                    <p className="text-gray-600">
                      Get 30% commission on their course purchases
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Withdraw Earnings
                    </h4>
                    <p className="text-gray-600">
                      Withdraw your earnings to your bank account
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Leaderboard
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-yellow-600">
                      🥇
                    </span>
                    <div>
                      <p className="font-semibold">Top Referrer</p>
                      <p className="text-sm text-gray-600">
                        5 active referrals
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-yellow-600">₹ 7,485</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
