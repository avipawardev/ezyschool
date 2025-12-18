import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { Toaster } from "react-hot-toast";

// Student Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import LecturesPage from "./pages/LecturesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import DoubtsPage from "./pages/DoubtsPage";
import ReferralsPage from "./pages/ReferralsPage";
import ProfilePage from "./pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import StudentLayout from "./layouts/StudentLayout";

// Admin Pages
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminCoursesPage from "./pages/admin/CoursesPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminReportsPage from "./pages/admin/ReportsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

// Layouts
import AdminLayout from "./layouts/AdminLayout";

// Auth guard
import useAuthStore from "./contexts/authStore";

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Routes */}
          <Route element={<StudentLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId" 
              element={
                <ProtectedRoute>
                  <CourseDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lectures"
              element={
                <ProtectedRoute>
                  <LecturesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <AssignmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doubts"
              element={
                <ProtectedRoute>
                  <DoubtsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referrals"
              element={
                <ProtectedRoute>
                  <ReferralsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="/admin/dashboard" replace />} />
             <Route path="dashboard" element={<AdminDashboardPage />} />
             <Route path="courses" element={<AdminCoursesPage />} />
             <Route path="users" element={<AdminUsersPage />} />
             <Route path="reports" element={<AdminReportsPage />} />
             <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
