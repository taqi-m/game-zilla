import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A wrapper component for routes that require authentication and/or specific roles
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {string|string[]} [props.roles] - Required roles for access (optional)
 */
export default function ProtectedRoute({ children, roles }) {
  const { currentUser, loading, hasRole, isAdmin } = useAuth();
  const location = useLocation();

  // Wait while auth is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If roles are specified, check if user has any of the required roles
  if (roles && !hasRole(roles)) {
    // Redirect to unauthorized page or home page
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is admin and trying to access non-admin pages they're not supposed to
  // (except for profile, which is always accessible)
  if (isAdmin() && 
      !location.pathname.startsWith('/admin') && 
      location.pathname !== '/profile' && 
      location.pathname !== '/unauthorized') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User is authenticated and authorized
  return children;
}
