import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  TablePagination,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  Edit,
  Delete,
  Block,
  Lock,
  PersonAdd,
  Download,
  Add,
  Visibility,
  Assignment,
  Payment,
  ManageAccounts,
  Support,
  LocationOn,
  Phone,
  BusinessCenter,
  Save,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

// Access control component
const AccessControl = ({ user, children }) => {
  const allowedRoles = ['ADMIN', 'ROLE_ADMIN', 'MANAGER', 'ROLE_MANAGER', 'ROLE_SAMBHAG_MANAGER', 'ROLE_DISTRICT_MANAGER', 'ROLE_BLOCK_MANAGER'];
  
  // Check access
  const hasAccess = user && user.role && allowedRoles.some(role => 
    user.role === role || 
    user.role?.toUpperCase() === role ||
    user.roles?.includes(role) ||
    user.authorities?.some(auth => auth.authority === role)
  );

  // Redirect unauthorized users
  useEffect(() => {
    if (user && user.role && !hasAccess) {
      console.warn('Access denied: User does not have required permissions for dashboard');
      window.location.href = '/';
    }
  }, [user, hasAccess]);

  // Loading state
  if (!user || !user.role) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              प्रमाणीकरण जांच रहे हैं...
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  // Access denied
  if (!hasAccess) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={6} sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
            <Typography variant="h4" color="error" gutterBottom>
              पहुंच अस्वीकृत
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
              आपको इस डैशबोर्ड तक पहुंचने की अनुमति नहीं है
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              यह डैशबोर्ड केवल प्रशासकों और प्रबंधकों के लिए उपलब्ध है
            </Typography>
            <Typography variant="body2" color="textSecondary">
              वर्तमान भूमिका: {user.role || 'अज्ञात'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => window.location.href = '/'}
            >
              होम पेज पर जाएं
            </Button>
          </Paper>
        </Container>
      </Layout>
    );
  }

  return children;
};

export default AccessControl;