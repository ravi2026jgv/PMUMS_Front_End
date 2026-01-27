import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  TextField,
  Button,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

const SahyogList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Month and Year filters
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // Server-side Pagination
  const [page, setPage] = useState(0); // 0-indexed for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(250);
  
  // User filters
  const [filters, setFilters] = useState({
    userId: '',
    fullName: '',
    mobileNumber: ''
  });
  
  // Prevent duplicate API calls
  const abortControllerRef = useRef(null);

  const months = [
    { value: 1, label: 'जनवरी (January)' },
    { value: 2, label: 'फरवरी (February)' },
    { value: 3, label: 'मार्च (March)' },
    { value: 4, label: 'अप्रैल (April)' },
    { value: 5, label: 'मई (May)' },
    { value: 6, label: 'जून (June)' },
    { value: 7, label: 'जुलाई (July)' },
    { value: 8, label: 'अगस्त (August)' },
    { value: 9, label: 'सितंबर (September)' },
    { value: 10, label: 'अक्टूबर (October)' },
    { value: 11, label: 'नवंबर (November)' },
    { value: 12, label: 'दिसंबर (December)' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0); // Reset to first page
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setPage(0); // Reset to first page
  };

  const fetchDonors = useCallback(async (pageNum = 0) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/admin/monthly-sahyog/donors/search', {
        params: {
          month: selectedMonth,
          year: selectedYear,
          page: pageNum,
          size: pageSize,
          ...(filters.userId && { userId: filters.userId }),
          ...(filters.fullName && { name: filters.fullName }),
          ...(filters.mobileNumber && { mobile: filters.mobileNumber })
        },
        signal: abortControllerRef.current.signal
      });
      
      // Handle paginated response
      const { content, pageNumber, totalPages: pages, totalElements: total } = response.data;
      
      setDonors(content || []);
      setPage(pageNumber || 0);
      setTotalPages(pages || 1);
      setTotalElements(total || 0);
    } catch (err) {
      // Ignore abortion errors
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching donors:', err);
      setError('सहयोग सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, selectedMonth, selectedYear, filters.userId, filters.fullName, filters.mobileNumber]);

  useEffect(() => {
    fetchDonors(0);
    
    // Cleanup function to abort any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array to run only once

  const handlePageChange = (event, newPage) => {
    // MUI Pagination is 1-indexed, API is 0-indexed
    fetchDonors(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <Chip
            icon={<CheckCircle />}
            label="भुगतान किया (Paid)"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      case 'PARTIAL':
        return (
          <Chip
            icon={<Warning />}
            label="आंशिक भुगतान (Partial)"
            color="warning"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      case 'UNPAID':
      default:
        return (
          <Chip
            icon={<Cancel />}
            label="अभुगतान (Unpaid)"
            color="error"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
    }
  };

  // Calculate display range for current page
  const startRecord = page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Paper
            elevation={10}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1a237e 0%, #303f9f 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}>
              मासिक सहयोग सूची (Monthly Sahyog List)
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 1, opacity: 0.9 }}>
              सदस्यों के मासिक सहयोग की स्थिति देखें
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Filters */}
          <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 'bold' }}>
              फ़िल्टर (Filters)
            </Typography>
            <Grid container spacing={2} alignItems="end">
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>महीना चुनें (Month)</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    label="महीना चुनें (Month)"
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>वर्ष चुनें (Year)</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    label="वर्ष चुनें (Year)"
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  यूजर आईडी (User ID)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="यूजर आईडी दर्ज करें"
                  value={filters.userId}
                  onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #1976d2',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#1565c0',
                      },
                      '&.Mui-focused': {
                        borderColor: '#1976d2',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  पूरा नाम (Full Name)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="पूरा नाम दर्ज करें"
                  value={filters.fullName}
                  onChange={(e) => setFilters(prev => ({ ...prev, fullName: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #1976d2',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#1565c0',
                      },
                      '&.Mui-focused': {
                        borderColor: '#1976d2',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  मोबाइल (Mobile)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="मोबाइल नंबर दर्ज करें"
                  value={filters.mobileNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #1976d2',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#1565c0',
                      },
                      '&.Mui-focused': {
                        borderColor: '#1976d2',
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
              <Button 
                variant="contained" 
                onClick={() => fetchDonors(0)}
                sx={{ bgcolor: '#1a237e' }}
              >
                खोजें (Search)
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setFilters({ userId: '', fullName: '', mobileNumber: '' });
                  fetchDonors(0);
                }}
              >
                साफ़ करें (Clear)
              </Button>
            </Box>
          </Paper>

          {/* Data Table */}
          <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={50} />
                <Typography sx={{ ml: 2 }}>लोड हो रहा है...</Typography>
              </Box>
            ) : donors.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#666' }}>
                  इस महीने के लिए कोई डेटा नहीं मिला
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#1a237e' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          क्र.सं.
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          रजिस्ट्रेशन नं.
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          नाम (Name)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          विभाग
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          राज्य
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          संभाग
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          जिला
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          ब्लॉक
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          स्कूल का नाम
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          लाभार्थी
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          रसीद अपलोड दिनांक
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donors.map((donor, index) => (
                        <TableRow
                          key={donor.registrationNumber || index}
                          sx={{
                            '&:hover': { backgroundColor: '#f5f5f5' },
                            transition: 'background-color 0.2s',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {page * pageSize + index + 1}
                          </TableCell>
                          <TableCell sx={{ color: '#1a237e', fontWeight: 500 }}>
                            {donor.registrationNumber || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {donor.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {donor.department || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {donor.state || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {donor.sambhag || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {donor.district || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {donor.block || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.85rem' }}>
                            {donor.schoolName || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 500, color: '#2e7d32' }}>
                            {donor.beneficiary || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.9rem' }}>
                            {donor.receiptUploadDate ? (
                              <>
                                {new Date(donor.receiptUploadDate).toLocaleDateString('hi-IN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                                <br />
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                  {new Date(donor.receiptUploadDate).toLocaleTimeString('hi-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </>
                            ) : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: 2,
                    py: 3 
                  }}>
                    <Pagination
                      count={totalPages}
                      page={page + 1} // Convert 0-indexed to 1-indexed for display
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      दिखाया जा रहा {startRecord}-{endRecord} कुल {totalElements} में से
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default SahyogList;
