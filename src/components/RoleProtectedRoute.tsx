
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';
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
  const { currentRole } = useRoleSwitch();
  const { user } = useAuth();

  console.log('🛡️ RoleProtectedRoute:', { hasUser: !!user, currentRole, requiredRole });

  // If user is not authenticated, let other auth guards handle it
  if (!user) {
    return <>{children}</>;
  }

  // If current role doesn't match required role, redirect
  if (currentRole !== requiredRole) {
    const defaultRedirect = '/dashboard'; // Use unified dashboard
    console.log('🛡️ Role mismatch, redirecting to:', redirectTo || defaultRedirect);
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
