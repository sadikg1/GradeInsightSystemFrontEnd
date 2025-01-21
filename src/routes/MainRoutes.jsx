import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const StudentManagement = Loadable(lazy(() => import('views/studentManagement/studentManagement')));
const TeacherManagement = Loadable(lazy(() => import('views/teacherManagement/teacherManagement')));
const CourseManagement = Loadable(lazy(() => import('views/courseManagement/courseManagement')));
const ResultManagement = Loadable(lazy(() => import('views/resultManagement/resultManagement')));
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
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'studentManagement',
      element: <StudentManagement />, // Directly associate the component with the parent route
      children: [
        // Optional: You can define other child routes here for deeper nesting, for example:
        {
          path: '', // Empty path for default rendering under 'studentManagement'
          element: <StudentManagement />
        }
      ]
    },
    {
      path: 'teacherManagement', // Parent path
      element: <TeacherManagement />, // Directly associate the component with the parent route
      children: [
        // Optional: You can define other child routes here for deeper nesting, for example:
        {
          path: '', // Empty path for default rendering under 'studentManagement'
          element: <TeacherManagement />
        }
      ]
    },
    {
      path: 'courseManagement', // Parent path
      element: <CourseManagement />, // Directly associate the component with the parent route
      children: [
        // Optional: You can define other child routes here for deeper nesting, for example:
        {
          path: '', // Empty path for default rendering under 'studentManagement'
          element: <CourseManagement />
        }
      ]
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
      element: <ResultManagement />, // Directly associate the component with the parent route
      children: [
        // Optional: You can define other child routes here for deeper nesting, for example:
        {
          path: '', // Empty path for default rendering under 'studentManagement'
          element: <ResultManagement />
        }
      ]
    }
  ]
};

export default MainRoutes;
