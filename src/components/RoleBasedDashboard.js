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
  Alert,
} from '@mui/material';
import {
  People,
  LocationOn,
  Download,
  Phone,
  Email,
  Assignment,
  Edit,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Mock data based on user role
    if (user?.role === 'SAMBHAG_MANAGER') {
      setUserData([
        {
          id: 1,
          name: 'राजेश कुमार',
          phone: '9876543210',
          email: 'rajesh@example.com',
          district: 'भोपाल',
          block: 'भोपाल शहर',
          membershipType: 'नियमित सदस्य',
          status: 'active',
          joiningDate: '2024-01-15',
          comments: 'अच्छा योगदान'
        },
        {
          id: 2,
          name: 'सुनीता देवी',
          phone: '9876543211',
          email: 'sunita@example.com',
          district: 'विदिशा',
          block: 'विदिशा',
          membershipType: 'आजीवन सदस्य',
          status: 'active',
          joiningDate: '2024-02-10',
          comments: 'नियमित भुगतान'
        }
      ]);

      setStats({
        totalUsers: 156,
        activeUsers: 142,
        districts: 8,
        blocks: 45
      });
    } else if (user?.role === 'DISTRICT_MANAGER') {
      setUserData([
        {
          id: 3,
          name: 'अमित शर्मा',
          phone: '9876543212',
          email: 'amit@example.com',
          district: 'भोपाल',
          block: 'कोह-ए-फिज़ा',
          membershipType: 'नियमित सदस्य',
          status: 'active',
          joiningDate: '2024-03-05',
          comments: 'सक्रिय सदस्य'
        }
      ]);

      setStats({
        totalUsers: 45,
        activeUsers: 42,
        blocks: 12
      });
    } else if (user?.role === 'BLOCK_MANAGER') {
      setUserData([
        {
          id: 4,
          name: 'प्रिया वर्मा',
          phone: '9876543213',
          email: 'priya@example.com',
          district: 'भोपाल',
          block: 'कोह-ए-फिज़ा',
          membershipType: 'नियमित सदस्य',
          status: 'active',
          joiningDate: '2024-04-12',
          comments: 'नया सदस्य'
        }
      ]);

      setStats({
        totalUsers: 15,
        activeUsers: 14
      });
    }
  }, [user]);

  const getRoleTitle = () => {
    const titles = {
      SAMBHAG_MANAGER: 'संभाग प्रबंधक डैशबोर्ड',
      DISTRICT_MANAGER: 'जिला प्रबंधक डैशबोर्ड',
      BLOCK_MANAGER: 'ब्लॉक प्रबंधक डैशबोर्ड'
    };
    return titles[user?.role] || 'प्रबंधक डैशबोर्ड';
  };

  const getLocationInfo = () => {
    if (user?.role === 'SAMBHAG_MANAGER') {
      return `संभाग: ${user?.sambhag || 'भोपाल'}`;
    } else if (user?.role === 'DISTRICT_MANAGER') {
      return `जिला: ${user?.district || 'भोपाल'}`;
    } else if (user?.role === 'BLOCK_MANAGER') {
      return `ब्लॉक: ${user?.block || 'कोह-ए-फिज़ा'}`;
    }
    return '';
  };

  const handleExportToExcel = () => {
    // Implementation for Excel export with all member table options
    const headers = ['नाम', 'फोन', 'ईमेल', 'जिला', 'ब्लॉक', 'सदस्यता प्रकार', 'स्थिति', 'सदस्यता दिनांक', 'टिप्पणी'];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    userData.forEach(user => {
      const row = [
        user.name,
        user.phone,
        user.email,
        user.district,
        user.block,
        user.membershipType,
        user.status,
        user.joiningDate,
        user.comments || ''
      ];
      csvContent += row.join(',') + '\n';
    });

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${user?.role}_users_${new Date().toLocaleDateString('en-CA')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOn sx={{ 
                fontSize: 48,
                color: '#1976d2'
              }} />
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  {getRoleTitle()}
                </Typography>
                <Typography variant="h6" sx={{ color: '#666' }}>
                  {getLocationInfo()}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={`स्वागत है, ${user?.name || 'प्रबंधक'}`}
              color="primary"
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 2.5,
                px: 1
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalUsers || 0}
                  </Typography>
                  <Typography variant="h6">
                    कुल उपयोगकर्ता
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.activeUsers || 0}
                  </Typography>
                  <Typography variant="h6">
                    सक्रिय सदस्य
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {user?.role === 'SAMBHAG_MANAGER' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationOn sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.districts || 0}
                      </Typography>
                      <Typography variant="h6">
                        जिले
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={8} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', color: 'white' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationOn sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stats.blocks || 0}
                      </Typography>
                      <Typography variant="h6">
                        ब्लॉक
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* User Management Table */}
      <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            सदस्य सूची ({userData.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Download />}
            onClick={handleExportToExcel}
            sx={{ bgcolor: '#4caf50' }}
          >
            Excel डाउनलोड
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell><strong>नाम</strong></TableCell>
                <TableCell><strong>संपर्क विवरण</strong></TableCell>
                <TableCell><strong>स्थान</strong></TableCell>
                <TableCell><strong>सदस्यता</strong></TableCell>
                <TableCell><strong>स्थिति</strong></TableCell>
                <TableCell><strong>सदस्यता दिनांक</strong></TableCell>
                <TableCell><strong>टिप्पणी</strong></TableCell>
                <TableCell><strong>कार्य</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {member.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <Email sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                        {member.email}
                      </Typography>
                      <Typography variant="body2">
                        <Phone sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                        {member.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                      {member.district}/{member.block}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.membershipType} 
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.status === 'active' ? 'सक्रिय' : 'निष्क्रिय'}
                      size="small"
                      sx={{ 
                        bgcolor: member.status === 'active' ? '#4caf50' : '#ff9800',
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(member.joiningDate).toLocaleDateString('hi-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.comments || 'कोई टिप्पणी नहीं'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" title="विवरण देखें">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="संपादित करें">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {userData.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="info">
              कोई सदस्य डेटा उपलब्ध नहीं है।
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Role-specific information */}
      <Paper elevation={6} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          भूमिका जानकारी
        </Typography>
        <Alert severity="info">
          <Typography>
            <strong>{getRoleTitle()}</strong> के रूप में, आप निम्नलिखित कार्य कर सकते हैं:
            <ul>
              <li>अपने क्षेत्राधिकार में सभी सदस्यों की सूची देख सकते हैं</li>
              <li>सदस्य विवरण संपादित कर सकते हैं</li>
              <li>Excel फॉर्मेट में रिपोर्ट डाउनलोड कर सकते हैं</li>
              <li>सदस्यों पर टिप्पणी जोड़ सकते हैं</li>
              {user?.role === 'SAMBHAG_MANAGER' && <li>सभी जिलों और ब्लॉकों का डेटा देख सकते हैं</li>}
              {user?.role === 'DISTRICT_MANAGER' && <li>अपने जिले के सभी ब्लॉकों का डेटा देख सकते हैं</li>}
              {user?.role === 'BLOCK_MANAGER' && <li>अपने ब्लॉक के सदस्यों का डेटा देख सकते हैं</li>}
            </ul>
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default RoleBasedDashboard;