import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role(s) if specified
  const hasRequiredRole = () => {
    if (!requiredRole && !requiredRoles) return true;
    
    if (requiredRole) {
      return user?.role === requiredRole || user?.role === `ROLE_${requiredRole}`;
    }
    
    if (requiredRoles && Array.isArray(requiredRoles)) {
      return requiredRoles.some(role => 
        user?.role === role || user?.role === `ROLE_${role}`
      );
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
          padding: 3
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          अनधिकृत पहुंच
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          आपको इस पेज तक पहुंचने की अनुमति नहीं है। कृपया सही क्रेडेंशियल्स के साथ लॉगिन करें।
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;