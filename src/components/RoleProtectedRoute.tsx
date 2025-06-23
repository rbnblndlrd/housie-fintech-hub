
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'customer' | 'provider';
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo 
}) => {
  const { currentRole } = useRole();
  const { user } = useAuth();

  // If user is not authenticated, let other auth guards handle it
  if (!user) {
    return <>{children}</>;
  }

  // If current role doesn't match required role, redirect
  if (currentRole !== requiredRole) {
    const defaultRedirect = requiredRole === 'customer' ? '/customer-dashboard' : '/provider-dashboard';
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
