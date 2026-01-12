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
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';

const AsahyogList = () => {
  const [nonDonors, setNonDonors] = useState([]);
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
  const [pageSize] = useState(20);

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

  const fetchNonDonors = useCallback(async (pageNum = 0) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await publicApi.get('/admin/non-donors/paginated', {
        params: {
          month: selectedMonth,
          year: selectedYear,
          page: pageNum,
          size: pageSize
        }
      });
      
      const { content, pageNumber, totalPages: pages, totalElements: total } = response.data;
      
      setNonDonors(content || []);
      setPage(pageNumber);
      setTotalPages(pages);
      setTotalElements(total);
    } catch (err) {
      console.error('Error fetching non-donors:', err);
      setError('असहयोग सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setNonDonors([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, pageSize]);

  useEffect(() => {
    fetchNonDonors(0);
  }, [fetchNonDonors]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(0);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    // MUI Pagination is 1-indexed, API is 0-indexed
    fetchNonDonors(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate display range for current page
  const startRecord = page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
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
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}>
              असहयोग सूची (Asahyog List)
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 1, opacity: 0.9 }}>
              जिन सदस्यों ने अभी तक सहयोग नहीं किया है
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
                    label={`कुल असहयोगी: ${totalElements}`} 
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
                <CircularProgress size={50} color="error" />
                <Typography sx={{ ml: 2 }}>लोड हो रहा है...</Typography>
              </Box>
            ) : nonDonors.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                  🎉 इस महीने सभी सदस्यों ने सहयोग किया है!
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#d32f2f' }}>
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
                          मोबाइल नंबर
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nonDonors.map((user, index) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:hover': { backgroundColor: '#ffebee' },
                            transition: 'background-color 0.2s',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fff8f8'
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {page * pageSize + index + 1}
                          </TableCell>
                          <TableCell sx={{ color: '#d32f2f', fontWeight: 500 }}>
                            {user.id}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {`${user.name || ''} ${user.surname || ''}`.trim() || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {user.mobileNumber || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {user.departmentSambhag || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {user.departmentDistrict || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {user.departmentBlock || 'N/A'}
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
                      page={page + 1}
                      onChange={handlePageChange}
                      color="error"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {`${startRecord.toLocaleString('hi-IN')} - ${endRecord.toLocaleString('hi-IN')} परिणाम (कुल ${totalElements.toLocaleString('hi-IN')} में से)`}
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

export default AsahyogList;
