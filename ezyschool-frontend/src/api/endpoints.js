import apiClient from "./client.js";

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  getProfile: () => apiClient.get("/auth/profile"),
  updateProfile: (data) => apiClient.put("/auth/profile", data),
  logout: () => apiClient.post("/auth/logout"),
};

// Course APIs
export const courseAPI = {
  getAll: (params) => apiClient.get("/courses", { params }),
  getById: (id) => apiClient.get(`/courses/${id}`),
  enroll: (courseId) => apiClient.post("/courses/enroll", { courseId }),
  getMyCourses: () => apiClient.get("/courses/my-courses"),
};

// Lecture APIs
export const lectureAPI = {
  getByCoursseId: (courseId) => apiClient.get(`/lectures/course/${courseId}`),
  getById: (id) => apiClient.get(`/lectures/${id}`),
};

// Assignment APIs
export const assignmentAPI = {
  upload: (data) => apiClient.post("/assignments/upload", data),
  getByLecture: (lectureId) =>
    apiClient.get(`/assignments/lecture/${lectureId}`),
  getAll: () => apiClient.get("/assignments/student/all"),
  getByCourse: (courseId) => apiClient.get(`/assignments/course/${courseId}`),
  getStats: (courseId) => apiClient.get(`/assignments/stats/${courseId}`),
};

// Doubt APIs
export const doubtAPI = {
  ask: (data) => apiClient.post("/doubts/ask", data),
  getAll: () => apiClient.get("/doubts/my-doubts"),
  getByCourse: (courseId) => apiClient.get(`/doubts/course/${courseId}`),
  markHelpful: (doubtId) => apiClient.put(`/doubts/helpful/${doubtId}`),
};

// Referral APIs
export const referralAPI = {
  getMyEarnings: () => apiClient.get("/referrals/my-earnings"),
};

// Test APIs
export const testAPI = {
  getByCourse: (courseId) => apiClient.get(`/tests/course/${courseId}`),
  getById: (id) => apiClient.get(`/tests/${id}`),
};

// Report APIs
export const reportAPI = {
  getStudentReports: (studentId) =>
    apiClient.get(`/reports/student/${studentId}`),
  getMonthly: (studentId, month, year) =>
    apiClient.get(`/reports/${studentId}/${month}/${year}`),
};
