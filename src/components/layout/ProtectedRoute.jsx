import React from "react";
import { useAuth } from "../../context";
import { Navigate } from "react-router-dom";

const ACCESS_LEVELS = {
  enumerator: 1,
  TeamLead: 2,
  SubAdmin: 3,
  SuperAdmin: 4,
};

const ProtectedRoute = ({ component: Component, requiredRole }) => {
  const { user, isLoggedIn } = useAuth();

  const hasAccess =
    isLoggedIn && ACCESS_LEVELS[user.role] === ACCESS_LEVELS[requiredRole];

  if (!hasAccess) {
    return <Navigate replace to={"/"} />;
  }

  return Component;
};

export default ProtectedRoute;
