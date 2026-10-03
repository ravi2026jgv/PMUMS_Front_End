import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { normalizeRole } from '../utils/roleUtils';
import { usePortal } from '../portal/PortalContext';

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const { path } = usePortal();

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={path('/login')} state={{ from: location }} replace />;
  }

  const currentRole = normalizeRole(user?.role);

  const hasRequiredRole = () => {
    if (!requiredRole && !requiredRoles) return true;

    if (requiredRole) {
      return currentRole === normalizeRole(requiredRole);
    }

    if (requiredRoles && Array.isArray(requiredRoles)) {
      return requiredRoles.map(normalizeRole).includes(currentRole);
    }

    return false;
  };

  if (!hasRequiredRole()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          अनधिकृत पहुंच
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          आपको इस पेज तक पहुंचने की अनुमति नहीं है।
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
