
import { Route, Routes } from "react-router-dom";
import RouteGuard from "./components/route-guard";
import StudentSupportPage from "./pages/student/support";
import StudentReferralPage from "./pages/student/refer-and-earn";

import { useContext, lazy, Suspense } from "react";
import { AuthContext } from "./context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

const AuthPage = lazy(() => import("./pages/auth"));
const InstructorDashboardpage = lazy(() => import("./pages/instructor"));
const StudentViewCommonLayout = lazy(() =>
  import("./components/student-view/common-layout")
);
const StudentHomePage = lazy(() => import("./pages/student/home"));
const NotFoundPage = lazy(() => import("./pages/not-found"));
const AddNewCoursePage = lazy(() =>
  import("./pages/instructor/add-new-course")
);
const StudentViewCoursesPage = lazy(() => import("./pages/student/courses"));
const StudentViewCourseDetailsPage = lazy(() =>
  import("./pages/student/course-details")
);
const PaypalPaymentReturnPage = lazy(() =>
  import("./pages/student/payment-return")
);
const StudentCoursesPage = lazy(() => import("./pages/student/student-courses"));
const StudentViewCourseProgressPage = lazy(() =>
  import("./pages/student/course-progress")
);
const StudentProfilePage = lazy(() => import("./pages/student/profile"));
const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard"));
const AdminCourses = lazy(() => import("./pages/admin/courses"));
const AdminUsers = lazy(() => import("./pages/admin/users"));
const AdminSupport = lazy(() => import("./pages/admin/support"));
const AdminReferralPage = lazy(() => import("./pages/admin/referrals"));

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Suspense fallback={<Skeleton className="w-full h-screen bg-gray-100" />}>
      <Routes>
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardpage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <RouteGuard
            element={<AdminLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="referrals" element={<AdminReferralPage />} />
      </Route>
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route
          path="course/details/:id"
          element={<StudentViewCourseDetailsPage />}
        />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="support" element={<StudentSupportPage />} />
        <Route path="refer-and-earn" element={<StudentReferralPage />} />
        <Route
          path="course-progress/:id"
          element={<StudentViewCourseProgressPage />}
        />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
