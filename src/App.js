import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AnnouncementPopup from './components/AnnouncementPopup';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import About from './pages/About';
import RoleBasedDashboard from './components/RoleBasedDashboard';
import QueryManagement from './components/QueryManagement';
import NonDonorList from './components/NonDonorList';
import TeachersList from './pages/TeachersList';
import NiyamawaliPage from './pages/Niyamawali';
import SahyogList from './pages/SahyogList';
import AsahyogList from './pages/AsahyogList';
import ContactUs from './pages/ContactUs';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/teachers-list" element={<TeachersList />} />
              <Route path="/sahyog-list" element={<SahyogList />} />
              <Route path="/asahyog-list" element={<AsahyogList />} />
              <Route path="/niyamawali" element={<NiyamawaliPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={["ADMIN", "SAMBHAG_MANAGER", "DISTRICT_MANAGER", "BLOCK_MANAGER"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/manager/dashboard" 
                  element={
                    <ProtectedRoute requiredRoles={["SAMBHAG_MANAGER", "DISTRICT_MANAGER", "BLOCK_MANAGER"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/sambhag/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="SAMBHAG_MANAGER">
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/district/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="DISTRICT_MANAGER">
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/block/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="BLOCK_MANAGER">
                      <RoleBasedDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/queries" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <QueryManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/non-donors" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <NonDonorList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
              
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              
              {/* Announcement Popup */}
              <AnnouncementPopup />
            </Router>
          </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
