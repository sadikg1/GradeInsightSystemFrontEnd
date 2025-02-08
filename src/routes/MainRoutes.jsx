import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate } from "react-router-dom";
import { element } from "prop-types";
import ProtectedRoute from "./ProtectedRoute";

// dashboard routing
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

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
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
      element: <Dashboard />,
    },
    {
      path: "studentManagement",
      element: <StudentManagement />, // Directly associate the component with the parent route
    },
    {
      path: "teacherManagement", // Parent path
      element: <TeacherManagement />, // Directly associate the component with the parent route
    },
    {
      path: "courseManagement", // Parent path
      element: <CourseManagement />, // Directly associate the component with the parent route
    },
    {
      path: "teacherCourseManagement", // Parent path
      element: <TeacherCourseManagement />, // Directly associate the component with the parent route
    },

    {
      path: "faculty", // Empty path for default rendering under 'studentManagement'
      element: <Faculty />,
    },
    {
      path: "semester", // Empty path for default rendering under 'studentManagement'
      element: <Semester />,
    },
    {
      path: "examType", // Empty path for default rendering under 'studentManagement'
      element: <ExamType />,
    },
    {
      path: "userType", // Empty path for default rendering under 'studentManagement'
      element: <UserType />,
    },
    {
      path: "resultManagement", // Parent path
      element: <ResultManagement />, // Directly associate the component with the parent route
    },
    {
      path: "resultView", // Parent path
      element: <ResultView />, // Directly associate the component with the parent route
    },
    {
      path: "users", // Parent path
      element: <UserManagement></UserManagement>,
    },
  ],
};

export default MainRoutes;
