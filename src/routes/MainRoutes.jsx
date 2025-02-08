import { lazy } from "react";
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { element } from "prop-types";

// Lazy-loaded components
const Dashboard = Loadable(lazy(() => import("views/dashboard")));
const StudentManagement = Loadable(
  lazy(() => import("views/studentManagement/studentManagement"))
);
const TeacherManagement = Loadable(
  lazy(() => import("views/teacherManagement/teacherManagement"))
);
const CourseManagement = Loadable(
  lazy(() => import("views/courseManagement/courseManagement"))
);
const TeacherCourseManagement = Loadable(
  lazy(() => import("views/teacherCourseManagement/teacherCourseManagement"))
);
const ResultManagement = Loadable(
  lazy(() => import("views/resultManagement/resultManagement"))
);
const UserManagement = Loadable(lazy(() => import("views/users/users")));
const Faculty = Loadable(lazy(() => import("views/faculty/faculty")));
const Semester = Loadable(lazy(() => import("views/semester/semester")));
const ExamType = Loadable(lazy(() => import("views/examType/examType")));
const UserType = Loadable(lazy(() => import("views/users/userstypes")));
const ResultView = Loadable(lazy(() => import("views/resultView/resultView")));
const UnAuthorized=Loadable(lazy(()=>import("views/unAuthorized/unAuthorized")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: (
    <ProtectedRoute allowedRoles={[1, 2, 3]}>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "/",
      element: <Navigate to="/auth/login" replace />,
    },
    {
      path: "dashboard",
      element: (
        <ProtectedRoute allowedRoles={[1, 3, 2]}>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "studentManagement",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <StudentManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "teacherManagement",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <TeacherManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "courseManagement",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <CourseManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "teacherCourseManagement",
      element: (
        <ProtectedRoute allowedRoles={[2, 3]}>
          <TeacherCourseManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "faculty",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <Faculty />
        </ProtectedRoute>
      ),
    },
    {
      path: "semester",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <Semester />
        </ProtectedRoute>
      ),
    },
    {
      path: "examType",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <ExamType />
        </ProtectedRoute>
      ),
    },
    {
      path: "userType",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <UserType />
        </ProtectedRoute>
      ),
    },
    {
      path: "resultManagement",
      element: (
        <ProtectedRoute allowedRoles={[1, 2, 3]}>
          <ResultManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "resultView",
      element: (
        <ProtectedRoute allowedRoles={[1, 2, 3]}>
          <ResultView />
        </ProtectedRoute>
      ),
    },
    {
      path: "users",
      element: (
        <ProtectedRoute allowedRoles={[2]}>
          <UserManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "unauthorized",
      element:<UnAuthorized/>
    }
  ],
};

export default MainRoutes;
