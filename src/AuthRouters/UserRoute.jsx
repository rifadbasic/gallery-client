// src/routes/AdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserStatus from "../hooks/useUserStatus";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { userStatus:status, isLoading } = useUserStatus();
  const location = useLocation();

  if (loading || isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (!user || status === "explorer") {
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  return children;
};

export default UserRoute;