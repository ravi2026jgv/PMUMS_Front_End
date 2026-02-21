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
  Avatar,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  Support,
  Block,
  LockOpen,
  ManageAccounts,
  Delete,
  Add,
  Edit,
  Visibility,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  LocationOn,
  BusinessCenter,
  Escalator,
  AssignmentInd,
  QueryStats,
  TrendingUp,
  Schedule,
  PriorityHigh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { managerAPI } from '../services/api';
import Layout from '../components/Layout/Layout';
import { CreateQueryDialog, ResolveQueryDialog } from '../components/QueryDialogs';

const ManagerDashboard = () => {
  const { user } = useAuth();
  
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [createQueryOpen, setCreateQueryOpen] = useState(false);
  const [resolveQueryOpen, setResolveQueryOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination states
  const [usersPage, setUsersPage] = useState(0);
  const [queriesPage, setQueriesPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalQueries, setTotalQueries] = useState(0);
  
  // Filter states
  const [userFilters, setUserFilters] = useState({
    search: '',
    role: '',
    status: 'ACTIVE'
  });
  const [queryFilters, setQueryFilters] = useState({
    status: '',
    priority: '',
    type: 'assigned'
  });

  // Manager role levels and permissions
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isSambhagManager = user?.role === 'ROLE_SAMBHAG_MANAGER';
  const isDistrictManager = user?.role === 'ROLE_DISTRICT_MANAGER';
  const isBlockManager = user?.role === 'ROLE_BLOCK_MANAGER';
  
  const canManageUsers = isAdmin || isSambhagManager || isDistrictManager;
  const canAssignQueries = isAdmin || isSambhagManager || isDistrictManager;
  const canEscalateQueries = isSambhagManager || isDistrictManager || isBlockManager;

  // API Functions
  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getDashboardOverview();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      showSnackbar('Error loading dashboard!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessibleUsers = async () => {
    try {
      const params = {
        page: usersPage,
        size: rowsPerPage,
        ...userFilters
      };
      const response = await managerAPI.getAccessibleUsers(params);
      setUsers(response.data.content || []);
      setTotalUsers(response.data.totalElements || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error loading users!', 'error');
    }
  };

  const fetchQueries = async () => {
    try {
      const params = {
        page: queriesPage,
        size: rowsPerPage,
        ...queryFilters
      };
      const response = await managerAPI.getQueries(params);
      setQueries(response.data.content || []);
      setTotalQueries(response.data.totalElements || 0);
    } catch (error) {
      console.error('Error fetching queries:', error);
      showSnackbar('Error loading queries!', 'error');
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await managerAPI.getAssignments();
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      showSnackbar('Error loading assignments!', 'error');
    }
  };

  // Action Handlers
  const handleBlockUser = async (userId, reason = 'Administrative action') => {
    try {
      await managerAPI.blockUser(userId, reason);
      showSnackbar('User blocked successfully!', 'success');
      fetchAccessibleUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      showSnackbar('Error blocking user!', 'error');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await managerAPI.unblockUser(userId);
      showSnackbar('User unblocked successfully!', 'success');
      fetchAccessibleUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      showSnackbar('Error unblocking user!', 'error');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await managerAPI.updateUserRole(userId, newRole);
      showSnackbar('User role updated successfully!', 'success');
      fetchAccessibleUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      showSnackbar('Error updating role!', 'error');
    }
  };

  const handleAssignQuery = async (queryId, managerId) => {
    try {
      await managerAPI.assignQuery(queryId, managerId);
      showSnackbar('Query assigned successfully!', 'success');
      fetchQueries();
    } catch (error) {
      console.error('Error assigning query:', error);
      showSnackbar('Error assigning query!', 'error');
    }
  };

  const handleResolveQuery = async (queryId, resolution) => {
    try {
      await managerAPI.resolveQuery(queryId, resolution);
      showSnackbar('Query resolved successfully!', 'success');
      fetchQueries();
    } catch (error) {
      console.error('Error resolving query:', error);
      showSnackbar('Error resolving query!', 'error');
    }
  };

  const handleEscalateQuery = async (queryId) => {
    try {
      await managerAPI.escalateQuery(queryId);
      showSnackbar('Query escalated successfully!', 'success');
      fetchQueries();
    } catch (error) {
      console.error('Error escalating query:', error);
      showSnackbar('Error escalating query!', 'error');
    }
  };

  // Utility Functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#4caf50';
      case 'blocked': return '#f44336';
      case 'deleted': return '#9e9e9e';
      case 'pending': return '#ff9800';
      case 'in_progress': return '#2196f3';
      case 'resolved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'escalated': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return '#d32f2f';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Admin';
      case 'ROLE_SAMBHAG_MANAGER': return 'Division Manager';
      case 'ROLE_DISTRICT_MANAGER': return 'District Manager';
      case 'ROLE_BLOCK_MANAGER': return 'Block Manager';
      case 'ROLE_USER': return 'User';
      default: return role;
    }
  };

  // Effects
  useEffect(() => {
    fetchDashboardOverview();
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchAccessibleUsers();
    }
  }, [activeTab, usersPage, rowsPerPage, userFilters]);

  useEffect(() => {
    if (activeTab === 2) {
      fetchQueries();
    }
  }, [activeTab, queriesPage, rowsPerPage, queryFilters]);

  // Dashboard Stats Cards
  const renderDashboardStats = () => {
    if (!dashboardData) return null;

    const stats = [
      {
        title: 'Total Users',
        value: dashboardData.userStats?.totalUsers || 0,
        icon: <People sx={{ fontSize: 40 }} />,
        color: '#1E3A8A',
        subtitle: 'Managed Users'
      },
      {
        title: 'Pending Queries',
        value: dashboardData.queryStats?.pendingCount || 0,
        icon: <Assignment sx={{ fontSize: 40 }} />,
        color: '#ff9800',
        subtitle: 'For Resolution'
      },
      {
        title: 'Resolved Queries',
        value: dashboardData.queryStats?.resolvedCount || 0,
        icon: <CheckCircle sx={{ fontSize: 40 }} />,
        color: '#4caf50',
        subtitle: 'Successfully Resolved'
      },
      {
        title: 'Managed Areas',
        value: Array.isArray(dashboardData.scope?.managedLocations) ? 
               dashboardData.scope.managedLocations.length : 
               (dashboardData.scope?.totalLocations || 0),
        icon: <LocationOn sx={{ fontSize: 40 }} />,
        color: '#9c27b0',
        subtitle: 'Assigned Areas'
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={8} 
              sx={{ 
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.8 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Users Management Tab
  const renderUsersTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          User Management ({totalUsers})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={userFilters.search}
            onChange={(e) => setUserFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={userFilters.status}
              label="Status"
              onChange={(e) => setUserFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="BLOCKED">Blocked</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1E3A8A', mr: 2 }}>
                      {user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.email}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        📱 {user.phoneNumber}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    size="small"
                    sx={{
                      bgcolor: user.role === 'ROLE_ADMIN' ? '#f44336' : '#2196f3',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                    {user.sambhagName || 'N/A'}/{user.districtName || 'N/A'}
                  </Typography>
                  {user.blockName && (
                    <Typography variant="caption" display="block">
                      Block: {user.blockName}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status === 'ACTIVE' ? 'Active' : user.status === 'BLOCKED' ? 'Blocked' : user.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(user.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {canManageUsers && (
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateUserRole(
                          user.id, 
                          user.role === 'ROLE_USER' ? 'ROLE_BLOCK_MANAGER' : 'ROLE_USER'
                        )}
                        title={user.role === 'ROLE_USER' ? 'Make Manager' : 'Make User'}
                        color="primary"
                      >
                        <ManageAccounts fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => user.status === 'BLOCKED' ? 
                        handleUnblockUser(user.id) : 
                        handleBlockUser(user.id)
                      }
                      title={user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                      color={user.status === 'BLOCKED' ? 'success' : 'error'}
                    >
                      {user.status === 'BLOCKED' ? <LockOpen fontSize="small" /> : <Block fontSize="small" />}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalUsers}
        page={usersPage}
        onPageChange={(e, newPage) => setUsersPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setUsersPage(0);
        }}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );

  // Queries Management Tab
  const renderQueriesTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #1E3A8A15, #1E3A8A05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Query Management ({totalQueries})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateQueryOpen(true)}
            sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)', color: 'white' }}
          >
            New Query
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Query</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {query.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {query.description?.substring(0, 100)}...
                    </Typography>
                    {query.locationContext && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#666' }}>
                        📍 {query.locationContext}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={query.priorityDisplay || query.priority}
                    size="small"
                    sx={{
                      bgcolor: getPriorityColor(query.priority),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={query.statusDisplay || query.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(query.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(query.createdAt).toLocaleDateString('en-IN')}
                  </Typography>
                  <Typography variant="caption" display="block">
                    By: {query.createdByName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedItem(query)}
                      title="View"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    {query.status === 'PENDING' && canEscalateQueries && (
                      <IconButton
                        size="small"
                        onClick={() => handleEscalateQuery(query.id)}
                        title="Escalate"
                        color="warning"
                      >
                        <Escalator fontSize="small" />
                      </IconButton>
                    )}
                    {(query.status === 'PENDING' || query.status === 'IN_PROGRESS') && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedItem(query);
                          setResolveQueryOpen(true);
                        }}
                        title="Resolve"
                        color="success"
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalQueries}
        page={queriesPage}
        onPageChange={(e, newPage) => setQueriesPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setQueriesPage(0);
        }}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A', mb: 1 }}>
          <Dashboard sx={{ mr: 2, verticalAlign: 'middle' }} />
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome, {user?.name}! Your Role: {getRoleLabel(user?.role)}
        </Typography>
        {dashboardData?.scope && (
          <Typography variant="body2" color="textSecondary">
            Managed Areas: {dashboardData.scope.totalSambhags || 0} Divisions, {dashboardData.scope.totalDistricts || 0} Districts, {dashboardData.scope.totalBlocks || 0} Blocks
          </Typography>
        )}
      </Box>

      {/* Dashboard Stats */}
      {renderDashboardStats()}

      {/* Alerts Section */}
      {dashboardData?.alerts && Object.keys(dashboardData.alerts).length > 0 && (
        <Box sx={{ mb: 4 }}>
          {Object.entries(dashboardData.alerts).map(([key, alert]) => (
            <Alert
              key={key}
              severity={alert.severity}
              sx={{ mb: 1 }}
              action={
                <Button color="inherit" size="small">
                  View
                </Button>
              }
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Main Tabs */}
      <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              color: 'white',
              '&.Mui-selected': {
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#fff'
            }
          }}
        >
          <Tab 
            icon={<Dashboard />} 
            label="Overview" 
            iconPosition="start"
          />
          <Tab 
            icon={<People />} 
            label="User Management" 
            iconPosition="start"
          />
          <Tab 
            icon={<Assignment />} 
            label="Query Management" 
            iconPosition="start"
          />
          <Tab 
            icon={<AssignmentInd />} 
            label="Assignments" 
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Dashboard Overview
              </Typography>
              {dashboardData && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          My Area
                        </Typography>
                        <List dense>
                          {dashboardData.scope?.managedLocations?.map((location, index) => (
                            <ListItem key={location.locationId || index}>
                              <ListItemIcon>
                                <LocationOn color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={typeof location.fullPath === 'string' ? location.fullPath : 
                                        (location.locationName || 'Location name not available')}
                                secondary={`${location.userCount || 0} Users`}
                              />
                            </ListItem>
                          )) || []}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Recent Activity
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          No new activity so far.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
          {activeTab === 1 && renderUsersTab()}
          {activeTab === 2 && renderQueriesTab()}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Assignment Management
              </Typography>
              <Alert severity="info">
                Assignment feature coming soon.
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Query Dialogs */}
      <CreateQueryDialog
        open={createQueryOpen}
        onClose={() => setCreateQueryOpen(false)}
        onSuccess={() => {
          showSnackbar('New query created successfully!', 'success');
          fetchQueries();
        }}
      />
      
      <ResolveQueryDialog
        open={resolveQueryOpen}
        onClose={() => {
          setResolveQueryOpen(false);
          setSelectedItem(null);
        }}
        query={selectedItem}
        onSuccess={() => {
          showSnackbar('Query resolved successfully!', 'success');
          fetchQueries();
          setSelectedItem(null);
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Layout>
  );
};

export default ManagerDashboard;