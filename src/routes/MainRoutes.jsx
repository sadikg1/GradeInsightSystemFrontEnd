import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';
import { element } from 'prop-types';

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const StudentManagement = Loadable(lazy(() => import('views/studentManagement/studentManagement')));
const TeacherManagement = Loadable(lazy(() => import('views/teacherManagement/teacherManagement')));
const CourseManagement = Loadable(lazy(() => import('views/courseManagement/courseManagement')));
const TeacherCourseManagement = Loadable(lazy(() => import('views/teacherCourseManagement/teacherCourseManagement')));

const ResultManagement = Loadable(lazy(() => import('views/resultManagement/resultManagement')));
const UserManagement = Loadable(lazy(() => import('views/users/users')));

const Faculty = Loadable(lazy(() => import('views/faculty/faculty')));
const Semester = Loadable(lazy(() => import('views/semester/semester')));
const ExamType = Loadable(lazy(() => import('views/examType/examType')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'studentManagement',
      element: <StudentManagement /> // Directly associate the component with the parent route
    },
    {
      path: 'teacherManagement', // Parent path
      element: <TeacherManagement /> // Directly associate the component with the parent route
    },
    {
      path: 'courseManagement', // Parent path
      element: <CourseManagement /> // Directly associate the component with the parent route
    },
    {
      path: 'teacherCourseManagement', // Parent path
      element: <TeacherCourseManagement /> // Directly associate the component with the parent route
    },

    {
      path: 'faculty', // Empty path for default rendering under 'studentManagement'
      element: <Faculty />
    },
    {
      path: 'semester', // Empty path for default rendering under 'studentManagement'
      element: <Semester />
    },
    {
      path: 'examType', // Empty path for default rendering under 'studentManagement'
      element: <ExamType />
    },
    {
      path: 'resultManagement', // Parent path
      element: <ResultManagement /> // Directly associate the component with the parent route
    },
    {
      path: 'users', // Parent path
      element: <UserManagement></UserManagement>
    }
  ]
};

export default MainRoutes;
