import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = memo(({ element, allowedRoles }) => {
  const { isLoggedIn, role } = useAuth(); // Get user data from the auth context

  if (!isLoggedIn) {
    // Save the current path for redirection after login
    localStorage.setItem('redirectPath', window.location.pathname);
    return <Navigate to="/signin" replace />;
  }

  // Log current role and allowed roles for debugging
  console.log('Allowed roles:', allowedRoles, 'Current role:', role); // Use user?.role here

  // If roles are defined, check if the user's role matches the allowed roles
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect to home if the user doesn't have the required role
  }

  // Render the element if the user is authenticated and authorized
  return element;
});

export default PrivateRoute;
