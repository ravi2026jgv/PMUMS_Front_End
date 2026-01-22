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

  // Count statistics based on new data structure
  const totalDonors = donors.length;
  const uniqueDonors = new Set(donors.map(d => d.registrationNumber)).size;
  const uniqueBeneficiaries = new Set(donors.map(d => d.beneficiary)).size;

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
                    label={`कुल सहयोग: ${totalDonors}`} 
                    color="primary" 
                    sx={{ fontWeight: 600 }} 
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label={`अलग सदस्य: ${uniqueDonors}`} 
                    color="success" 
                    sx={{ fontWeight: 600 }} 
                  />
                  <Chip 
                    label={`लाभार्थी: ${uniqueBeneficiaries}`} 
                    color="info" 
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
                          अपलोड तारीख
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.map((donor, index) => (
                        <TableRow
                          key={donor.registrationNumber || index}
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
                            {donor.receiptUploadDate ? 
                              new Date(donor.receiptUploadDate).toLocaleDateString('hi-IN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }) : 'N/A'
                            }
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
