import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const user = Cookies.get('user');
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If a user exists, render the children or Outlet (nested routes)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
