import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Parse user data from cookies
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  console.log(allowedRoles)

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const userType = user.userTypeId; // Integer value (1 = admin, 2 = student, 3 = teacher)
  console.log("User Type:", userType);

  // Check if the userType is in the allowedRoles array
  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
