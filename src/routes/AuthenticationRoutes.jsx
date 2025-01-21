import MinimalLayout from 'layout/MinimalLayout';
import { element } from 'prop-types';
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin3 />
    },
    {
      path: 'register',
      element: <AuthRegister3 />
    }
  ]
  
};

export default AuthenticationRoutes;
