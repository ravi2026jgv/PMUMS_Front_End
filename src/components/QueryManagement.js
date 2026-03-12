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
  TextField,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Support,
  CheckCircle,
  Cancel,
  Schedule,
  Visibility,
  Reply,
  Assignment,
  TrendingUp,
  Person,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const QueryManagement = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Query categories
  const queryTypes = {
    'death_certificate': 'मृत्यु प्रमाणपत्र',
    'payment_issue': 'भुगतान समस्या',
    'membership': 'सदस्यता',
    'document_upload': 'दस्तावेज़ अपलोड',
    'general': 'सामान्य',
    'technical': 'तकनीकी'
  };

  const queryStatuses = {
    'pending': 'लंबित',
    'in_progress': 'प्रगति में',
    'resolved': 'हल',
    'rejected': 'अस्वीकृत',
    'escalated': 'उच्च स्तर पर भेजा गया'
  };

  // Initialize mock data
  useEffect(() => {
    const mockQueries = [
      {
        id: 1,
        ticketId: 'QRY-001',
        userName: 'राजेश कुमार',
        userEmail: 'rajesh@example.com',
        userPhone: '9876543210',
        subject: 'मृत्यु प्रमाणपत्र अपलोड नहीं हो रहा',
        category: 'death_certificate',
        description: 'मैं अपने पिता का मृत्यु प्रमाणपत्र अपलोड करने की कोशिश कर रहा हूँ लेकिन फाइल अपलोड नहीं हो रही है। कृपया इसका समाधान बताएं।',
        status: 'pending',
        priority: 'high',
        createdAt: '2025-01-20T10:30:00Z',
        updatedAt: '2025-01-20T10:30:00Z',
        assignedTo: user?.name,
        location: {
          sambhag: 'भोपाल',
          district: 'भोपाल',
          block: 'भोपाल शहर'
        },
        responses: []
      },
      {
        id: 2,
        ticketId: 'QRY-002',
        userName: 'सुनीता देवी',
        userEmail: 'sunita@example.com',
        userPhone: '9876543211',
        subject: 'सदस्यता शुल्क भुगतान की समस्या',
        category: 'payment_issue',
        description: 'मैंने ऑनलाइन सदस्यता शुल्क का भुगतान किया था लेकिन अभी तक मेरा अकाउंट एक्टिव नहीं हुआ है। Transaction ID: TXN123456789',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2025-01-19T14:20:00Z',
        updatedAt: '2025-01-20T09:15:00Z',
        assignedTo: user?.name,
        location: {
          sambhag: 'इंदौर',
          district: 'इंदौर',
          block: 'इंदौर शहर'
        },
        responses: [
          {
            id: 1,
            respondedBy: 'Admin',
            response: 'हमें आपकी समस्या की जांच कर रहे हैं। कृपया अपनी Transaction ID फिर से भेजें।',
            timestamp: '2025-01-20T09:15:00Z'
          }
        ]
      },
      {
        id: 3,
        ticketId: 'QRY-003',
        userName: 'अमित शर्मा',
        userEmail: 'amit@example.com',
        userPhone: '9876543212',
        subject: 'लॉगिन नहीं हो पा रहा',
        category: 'technical',
        description: 'मैं अपने अकाउंट में लॉगिन करने की कोशिश कर रहा हूँ लेकिन "गलत पासवर्ड" का मैसेज आ रहा है। Forgot Password भी काम नहीं कर रहा।',
        status: 'resolved',
        priority: 'low',
        createdAt: '2025-01-18T16:45:00Z',
        updatedAt: '2025-01-19T11:30:00Z',
        assignedTo: 'Tech Support',
        location: {
          sambhag: 'ग्वालियर',
          district: 'ग्वालियर',
          block: 'ग्वालियर शहर'
        },
        responses: [
          {
            id: 1,
            respondedBy: 'Tech Support',
            response: 'आपका पासवर्ड रीसेट कर दिया गया है। कृपया अपने ईमेल को चेक करें और नया पासवर्ड सेट करें।',
            timestamp: '2025-01-19T11:30:00Z'
          }
        ]
      }
    ];

    setQueries(mockQueries);
  }, [user]);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      in_progress: '#2196f3',
      resolved: '#4caf50',
      rejected: '#f44336',
      escalated: '#9c27b0'
    };
    return colors[status] || '#757575';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#f44336',
      medium: '#ff9800',
      low: '#4caf50'
    };
    return colors[priority] || '#757575';
  };

  const getQueryStats = () => {
    const stats = {
      total: queries.length,
      pending: queries.filter(q => q.status === 'pending').length,
      inProgress: queries.filter(q => q.status === 'in_progress').length,
      resolved: queries.filter(q => q.status === 'resolved').length,
      rejected: queries.filter(q => q.status === 'rejected').length
    };
    return stats;
  };

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setResponseText('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuery(null);
    setResponseText('');
  };

  const handleUpdateStatus = (queryId, newStatus, response = '') => {
    setQueries(prev => prev.map(query => {
      if (query.id === queryId) {
        const updatedQuery = {
          ...query,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };

        if (response) {
          updatedQuery.responses = [
            ...query.responses,
            {
              id: query.responses.length + 1,
              respondedBy: user?.name || 'Admin',
              response: response,
              timestamp: new Date().toISOString()
            }
          ];
        }

        return updatedQuery;
      }
      return query;
    }));

    showSnackbar(`क्वेरी स्थिति अपडेट की गई: ${queryStatuses[newStatus]}`, 'success');
    handleCloseDialog();
  };

  const handleSendResponse = () => {
    if (responseText.trim() && selectedQuery) {
      handleUpdateStatus(selectedQuery.id, 'in_progress', responseText);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getFilteredQueries = () => {
    switch (activeTab) {
      case 0: // All
        return queries;
      case 1: // Pending
        return queries.filter(q => q.status === 'pending');
      case 2: // In Progress
        return queries.filter(q => q.status === 'in_progress');
      case 3: // Resolved
        return queries.filter(q => q.status === 'resolved');
      default:
        return queries;
    }
  };

  const stats = getQueryStats();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={12} 
        sx={{ 
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Support sx={{ 
              fontSize: 48,
              color: '#ff9800'
            }} />
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                क्वेरी प्रबंधन सिस्टम
              </Typography>
              <Typography variant="h6" sx={{ color: '#666' }}>
                सभी उपयोगकर्ता प्रश्नों और समस्याओं का समाधान
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
              <Typography variant="body1">
                कुल क्वेरी
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body1">
                लंबित
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.inProgress}
              </Typography>
              <Typography variant="body1">
                प्रगति में
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.resolved}
              </Typography>
              <Typography variant="body1">
                हल किए गए
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Cancel sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body1">
                अस्वीकृत
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Query Management Table */}
      <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            bgcolor: '#f5f5f5',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab 
            label={
              <Badge badgeContent={stats.total} color="primary">
                सभी क्वेरी
              </Badge>
            }
          />
          <Tab 
            label={
              <Badge badgeContent={stats.pending} color="warning">
                लंबित
              </Badge>
            }
          />
          <Tab 
            label={
              <Badge badgeContent={stats.inProgress} color="info">
                प्रगति में
              </Badge>
            }
          />
          <Tab 
            label={
              <Badge badgeContent={stats.resolved} color="success">
                हल किए गए
              </Badge>
            }
          />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fff3e0' }}>
                <TableCell><strong>टिकट ID</strong></TableCell>
                <TableCell><strong>उपयोगकर्ता</strong></TableCell>
                <TableCell><strong>विषय</strong></TableCell>
                <TableCell><strong>श्रेणी</strong></TableCell>
                <TableCell><strong>प्राथमिकता</strong></TableCell>
                <TableCell><strong>स्थिति</strong></TableCell>
                <TableCell><strong>दिनांक</strong></TableCell>
                <TableCell><strong>कार्य</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredQueries().map((query) => (
                <TableRow key={query.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {query.ticketId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {query.userName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {query.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {query.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={queryTypes[query.category]}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={query.priority.toUpperCase()}
                      size="small"
                      sx={{ 
                        bgcolor: getPriorityColor(query.priority),
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={queryStatuses[query.status]}
                      size="small"
                      sx={{ 
                        bgcolor: getStatusColor(query.status),
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(query.createdAt).toLocaleDateString('hi-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewQuery(query)}
                        title="विवरण देखें"
                        color="primary"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleUpdateStatus(query.id, 'resolved')}
                        title="हल करें"
                        color="success"
                        disabled={query.status === 'resolved'}
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleUpdateStatus(query.id, 'rejected')}
                        title="अस्वीकार करें"
                        color="error"
                        disabled={query.status === 'resolved' || query.status === 'rejected'}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {getFilteredQueries().length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="info">
              कोई क्वेरी उपलब्ध नहीं है।
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Query Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedQuery && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  क्वेरी विवरण - {selectedQuery.ticketId}
                </Typography>
                <Chip 
                  label={queryStatuses[selectedQuery.status]}
                  sx={{ 
                    bgcolor: getStatusColor(selectedQuery.status),
                    color: 'white'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <Person sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      उपयोगकर्ता जानकारी
                    </Typography>
                    <Typography variant="body2"><strong>नाम:</strong> {selectedQuery.userName}</Typography>
                    <Typography variant="body2"><strong>ईमेल:</strong> {selectedQuery.userEmail}</Typography>
                    <Typography variant="body2"><strong>फोन:</strong> {selectedQuery.userPhone}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      समय जानकारी
                    </Typography>
                    <Typography variant="body2">
                      <strong>बनाया गया:</strong> {new Date(selectedQuery.createdAt).toLocaleString('hi-IN')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>अपडेट किया गया:</strong> {new Date(selectedQuery.updatedAt).toLocaleString('hi-IN')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  विषय: {selectedQuery.subject}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>श्रेणी:</strong> {queryTypes[selectedQuery.category]}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>विवरण:</strong> {selectedQuery.description}
                </Typography>
              </Paper>

              {/* Previous Responses */}
              {selectedQuery.responses.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    पिछले उत्तर:
                  </Typography>
                  {selectedQuery.responses.map((response) => (
                    <Box key={response.id} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        {response.respondedBy} - {new Date(response.timestamp).toLocaleString('hi-IN')}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {response.response}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}

              {/* Response Input */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="आपका उत्तर"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="उपयोगकर्ता को अपना उत्तर यहाँ लिखें..."
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  startIcon={<Reply />}
                  sx={{ bgcolor: '#4caf50' }}
                >
                  उत्तर भेजें
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleUpdateStatus(selectedQuery.id, 'resolved', responseText)}
                  startIcon={<CheckCircle />}
                  sx={{ bgcolor: '#2196f3' }}
                >
                  हल करके बंद करें
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleUpdateStatus(selectedQuery.id, 'rejected', responseText)}
                  startIcon={<Cancel />}
                  color="error"
                >
                  अस्वीकार करें
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QueryManagement;