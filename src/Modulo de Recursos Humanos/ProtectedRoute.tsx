import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  
  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!token) {
    return <Navigate to="/rrhh" replace />;
  }


  return <>{children}</>;
};