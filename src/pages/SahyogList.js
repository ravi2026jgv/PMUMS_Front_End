import React, { useState, useEffect, useCallback } from 'react';
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
  Pagination,
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
  
  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(20);

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

  // Generate years (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/admin/monthly-sahyog/donors', {
        params: {
          month: selectedMonth,
          year: selectedYear
        }
      });
      
      setDonors(response.data || []);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError('सहयोग सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(1);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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

  // Paginate data
  const paginatedData = donors.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(donors.length / rowsPerPage);

  // Count statistics
  const paidCount = donors.filter(d => d.status === 'PAID').length;
  const partialCount = donors.filter(d => d.status === 'PARTIAL').length;
  const unpaidCount = donors.filter(d => d.status === 'UNPAID').length;

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

          {/* Filters */}
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>
                  महीना चुनें (Select Month)
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>
                  वर्ष चुनें (Select Year)
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip 
                    label={`कुल: ${donors.length}`} 
                    color="primary" 
                    sx={{ fontWeight: 600 }} 
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label={`भुगतान: ${paidCount}`} 
                    color="success" 
                    sx={{ fontWeight: 600 }} 
                  />
                  <Chip 
                    icon={<Warning />} 
                    label={`आंशिक: ${partialCount}`} 
                    color="warning" 
                    sx={{ fontWeight: 600 }} 
                  />
                  <Chip 
                    icon={<Cancel />} 
                    label={`अभुगतान: ${unpaidCount}`} 
                    color="error" 
                    sx={{ fontWeight: 600 }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

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
                          यूजर आईडी
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          नाम (Name)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          भुगतान राशि (Paid Amount)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white', fontSize: '1rem' }}>
                          स्थिति (Status)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((donor, index) => (
                        <TableRow
                          key={donor.userId}
                          sx={{
                            '&:hover': { backgroundColor: '#f5f5f5' },
                            transition: 'background-color 0.2s',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell sx={{ color: '#1a237e', fontWeight: 500 }}>
                            {donor.userId}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {donor.username}
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: donor.paidAmount > 0 ? '#2e7d32' : '#d32f2f'
                              }}
                            >
                              ₹{donor.paidAmount.toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(donor.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
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
