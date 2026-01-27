import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Download,
  Person,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';

const NonDonorList = () => {
  const [nonDonors, setNonDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for non-donors (users who haven't made any donations)
    const mockNonDonors = [
      {
        id: 1,
        name: 'अशोक कुमार',
        email: 'ashok@example.com',
        phone: '9876543220',
        employeeId: 'EMP001',
        sambhag: 'भोपाल',
        district: 'भोपाल',
        block: 'भोपाल शहर',
        registeredDate: '2024-01-15',
        lastLogin: '2025-01-10',
        membershipType: 'नियमित सदस्य',
        status: 'active'
      },
      {
        id: 2,
        name: 'रमेश वर्मा',
        email: 'ramesh@example.com',
        phone: '9876543221',
        employeeId: 'EMP002',
        sambhag: 'इंदौर',
        district: 'इंदौर',
        block: 'इंदौर शहर',
        registeredDate: '2024-02-20',
        lastLogin: '2025-01-08',
        membershipType: 'नियमित सदस्य',
        status: 'active'
      },
      {
        id: 3,
        name: 'सुधा देवी',
        email: 'sudha@example.com',
        phone: '9876543222',
        employeeId: 'EMP003',
        sambhag: 'ग्वालियर',
        district: 'ग्वालियर',
        block: 'ग्वालियर शहर',
        registeredDate: '2024-03-10',
        lastLogin: '2025-01-05',
        membershipType: 'आजीवन सदस्य',
        status: 'active'
      },
      {
        id: 4,
        name: 'विकास शर्मा',
        email: 'vikas@example.com',
        phone: '9876543223',
        employeeId: 'EMP004',
        sambhag: 'भोपाल',
        district: 'विदिशा',
        block: 'विदिशा',
        registeredDate: '2024-04-05',
        lastLogin: '2024-12-28',
        membershipType: 'नियमित सदस्य',
        status: 'inactive'
      },
      {
        id: 5,
        name: 'मीरा पाटिल',
        email: 'mira@example.com',
        phone: '9876543224',
        employeeId: 'EMP005',
        sambhag: 'इंदौर',
        district: 'धार',
        block: 'धार',
        registeredDate: '2024-05-15',
        lastLogin: '2025-01-15',
        membershipType: 'नियमित सदस्य',
        status: 'active'
      }
    ];

    setTimeout(() => {
      setNonDonors(mockNonDonors);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExportToExcel = () => {
    // Create comprehensive Excel data
    const headers = [
      'सीरियल नंबर',
      'नाम',
      'कर्मचारी ID',
      'ईमेल',
      'फोन नंबर',
      'संभाग',
      'जिला',
      'ब्लॉक',
      'सदस्यता प्रकार',
      'पंजीकरण दिनांक',
      'अंतिम लॉगिन',
      'स्थिति',
      'टिप्पणी'
    ];

    // Create CSV content with BOM for proper Hindi display
    const BOM = '\uFEFF';
    let csvContent = BOM + headers.join(',') + '\n';
    
    nonDonors.forEach((user, index) => {
      const row = [
        index + 1,
        `"${user.name}"`,
        `"${user.employeeId}"`,
        `"${user.email}"`,
        `"${user.phone}"`,
        `"${user.sambhag}"`,
        `"${user.district}"`,
        `"${user.block}"`,
        `"${user.membershipType}"`,
        `"${new Date(user.registeredDate).toLocaleDateString('hi-IN')}"`,
        `"${new Date(user.lastLogin).toLocaleDateString('hi-IN')}"`,
        `"${user.status === 'active' ? 'सक्रिय' : 'निष्क्रिय'}"`,
        `"${user.status === 'inactive' ? 'लंबे समय से निष्क्रिय' : 'डोनेशन नहीं किया'}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Non_Donor_List_${new Date().toLocaleDateString('en-CA').replace(/-/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Show success message (you can integrate with snackbar)
    alert('गैर-दानदाता सूची सफलतापूर्वक डाउनलोड हो गई!');
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={50} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            डेटा लोड हो रहा है...
          </Typography>
        </Box>
      </Container>
    );
  }

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
              <Person sx={{ 
                fontSize: 48,
                color: '#f57c00'
              }} />
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  गैर-दानदाता सदस्य सूची
                </Typography>
                <Typography variant="h6" sx={{ color: '#666' }}>
                  ऐसे सदस्य जिन्होंने अभी तक कोई दान नहीं दिया है
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Download />}
              onClick={handleExportToExcel}
              sx={{ 
                bgcolor: '#4caf50',
                '&:hover': {
                  bgcolor: '#388e3c'
                },
                px: 3,
                py: 1.5
              }}
            >
              Excel में डाउनलोड करें
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Summary Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 3, 
          borderRadius: 3,
          fontSize: '1.1rem'
        }}
      >
        <strong>सारांश:</strong> कुल {nonDonors.length} सदस्यों ने अभी तक कोई दान नहीं दिया है। 
        इस सूची का उपयोग करके आप इन सदस्यों से संपर्क कर सकते हैं और उन्हें दान के लिए प्रेरित कर सकते हैं।
      </Alert>

      {/* Non-Donors Table */}
      <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: '#fff3e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            गैर-दानदाता सदस्य ({nonDonors.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#ffebee' }}>
                <TableCell><strong>सीरियल</strong></TableCell>
                <TableCell><strong>सदस्य विवरण</strong></TableCell>
                <TableCell><strong>संपर्क जानकारी</strong></TableCell>
                <TableCell><strong>स्थान विवरण</strong></TableCell>
                <TableCell><strong>सदस्यता</strong></TableCell>
                <TableCell><strong>अंतिम गतिविधि</strong></TableCell>
                <TableCell><strong>स्थिति</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nonDonors.map((member, index) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {member.employeeId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
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
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <LocationOn sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                        {member.sambhag}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {member.district}/{member.block}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip 
                        label={member.membershipType} 
                        size="small"
                        variant="outlined"
                        color={member.membershipType === 'आजीवन सदस्य' ? 'primary' : 'default'}
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="caption" color="textSecondary" display="block">
                        {new Date(member.registeredDate).toLocaleDateString('hi-IN')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(member.lastLogin).toLocaleDateString('hi-IN')}
                    </Typography>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {nonDonors.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="success">
              बधाई हो! सभी सदस्यों ने दान दिया है। कोई गैर-दानदाता सदस्य नहीं मिला।
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Additional Information */}
      <Paper elevation={6} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          गैर-दानदाता सूची के बारे में
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography>
            <strong>महत्वपूर्ण सूचना:</strong>
            <ul>
              <li>यह सूची उन सदस्यों की है जिन्होंने अभी तक संघ को कोई दान नहीं दिया है</li>
              <li>इस सूची का उपयोग करके आप इन सदस्यों से व्यक्तिगत संपर्क कर सकते हैं</li>
              <li>सदस्यों को दान के महत्व के बारे में बताया जा सकता है</li>
              <li>यह सूची गोपनीय है और केवल अधिकृत व्यक्तियों के लिए है</li>
            </ul>
          </Typography>
        </Alert>
        
        <Alert severity="info">
          <Typography>
            <strong>उपयोग के सुझाव:</strong>
            <ul>
              <li>फोन या ईमेल के द्वारा संपर्क करें</li>
              <li>दान की आवश्यकता और लाभों के बारे में समझाएं</li>
              <li>छोटी राशि से शुरुआत करने को कहें</li>
              <li>नियमित दान के लिए प्रेरित करें</li>
            </ul>
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default NonDonorList;