import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
    try {
        const token = localStorage.getItem('oysloe_token');
        return !!token;
    } catch {
        return false;
    }
};

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const location = useLocation();

    if (isAuthenticated()) return children;

    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
