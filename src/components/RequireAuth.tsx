import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("oysloe_token");
    return !!token;
  } catch {
    return false;
  }
};

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const location = useLocation();

  if (isAuthenticated()) return children;

  // Allow guest access to the Home and Ads details pages when a "guest" flag
  // is set (by the login/signup "Skip" action). This enables browsing ads
  // without signing in while keeping other routes protected.
  try {
    const guest = localStorage.getItem("oysloe_guest");
    if (guest === "true") {
      const path = location.pathname || "";
      // allow root/homepage
      if (path === "/" || path === "/homepage") return children;
      // allow ads details like /ads/:id
      if (path.startsWith("/ads/")) return children;
    }
  } catch {
    // ignore localStorage errors
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
