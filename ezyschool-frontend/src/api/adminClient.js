import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Optional: Redirect to login if you have a login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const adminAuthAPI = {
  login: (data) => apiClient.post("/auth/login", data),
  getProfile: () => apiClient.get("/auth/profile"),
  logout: () => apiClient.post("/auth/logout"),
};

export const adminCourseAPI = {
  create: (data) => apiClient.post("/courses/create", data),
  getAll: () => apiClient.get("/courses"),
  update: (id, data) => apiClient.put(`/courses/${id}`, data),
  delete: (id) => apiClient.delete(`/courses/${id}`),
  getStats: (id) => apiClient.get(`/courses/${id}/stats`),
};

export const adminLectureAPI = {
  create: (data) => apiClient.post("/lectures/create", data),
  update: (id, data) => apiClient.put(`/lectures/${id}`, data),
  delete: (id) => apiClient.delete(`/lectures/${id}`),
};

export const adminAssignmentAPI = {
  grade: (id, data) => apiClient.put(`/assignments/grade/${id}`, data),
};

export const adminReferralAPI = {
  getAll: () => apiClient.get("/referrals/admin/all-referrals"),
  processPayment: (data) =>
    apiClient.post("/referrals/admin/process-payment", data),
};

export const adminTestAPI = {
  create: (data) => apiClient.post("/tests/create", data),
  update: (id, data) => apiClient.put(`/tests/${id}`, data),
  publish: (id) => apiClient.put(`/tests/${id}/publish`),
};

export const adminReportAPI = {
  generate: (data) => apiClient.post("/reports/generate", data),
  getAll: (params) => apiClient.get("/reports/admin/all", { params }),
  updateStatus: (id, data) => apiClient.put(`/reports/${id}/status`, data),
  sendToParent: (id) => apiClient.post(`/reports/${id}/send`),
};

export const adminDoubtAPI = {
  getUnresolved: () => apiClient.get("/doubts/admin/unresolved"),
  updateAnswer: (id, data) => apiClient.put(`/doubts/admin/answer/${id}`, data),
};

export default apiClient;
