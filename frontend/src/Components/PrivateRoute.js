import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = memo(({ element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    localStorage.setItem('redirectPath', window.location.pathname);
    return <Navigate to="/signin" replace />;
  }

  return element;
});

export default PrivateRoute;
