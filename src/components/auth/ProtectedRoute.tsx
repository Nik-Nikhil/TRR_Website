import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredRole?: string;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requiredRole,
  redirectTo = '/admin-login' 
}: ProtectedRouteProps) {
  
  if (requireAdmin) {
    const isAdminLoggedIn = AuthService.isAdminLoggedIn();
    
    if (!isAdminLoggedIn) {
      return <Navigate to={redirectTo} replace />;
    }

    // Check specific role if required
    if (requiredRole) {
      const hasRole = AuthService.hasAdminRole(requiredRole);
      if (!hasRole) {
        return (
          <div className="min-h-screen bg-[#050608] flex items-center justify-center">
            <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-lg border border-red-500/50">
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">🚫</div>
                <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-slate-300 mb-4">
                  You don't have the required permissions to access this page.
                </p>
                <p className="text-sm text-slate-400">
                  Required role: {requiredRole}
                </p>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  return <>{children}</>;
}