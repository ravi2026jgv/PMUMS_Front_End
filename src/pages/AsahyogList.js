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
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';

const AsahyogList = () => {
  const [nonDonors, setNonDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
  
  // Month and Year filters
  
  // User filters
const [filters, setFilters] = useState({
  userId: '',
  fullName: '',
  mobileNumber: '',
  sambhag: '',
  district: '',
  block: '',
beneficiaryId: ''});
  const fetchBeneficiaries = useCallback(async () => {
  try {
    const response = await publicApi.get('/admin/monthly-sahyog/non-donors/beneficiaries-all');
    setBeneficiaryOptions(response.data || []);
  } catch (err) {
    console.error('Error fetching beneficiaries:', err);
    setBeneficiaryOptions([]);
  }
}, []);
useEffect(() => {
  fetchBeneficiaries();
}, [fetchBeneficiaries]);
  // Server-side Pagination
  const [page, setPage] = useState(0); // 0-indexed for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);
  
  // Prevent duplicate API calls
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0); // Track request ID to handle race conditions
  const isInitialMount = useRef(true); // Track initial mount

  // Helper function to handle empty strings and null values
  const getDisplayValue = (value, fallback = 'N/A') => {
    return value && value.trim() !== '' ? value : fallback;
  };


  // Generate years (last 5 years)

  const fetchNonDonors = useCallback(async (pageNum = 0) => {
    // Increment request ID to track this request
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await publicApi.get('/admin/monthly-sahyog/non-donors/search-by-beneficiary', {
  params: {
    page: pageNum,
    size: pageSize,
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.fullName && { name: filters.fullName }),
    ...(filters.mobileNumber && { mobile: filters.mobileNumber }),
    ...(filters.sambhag && { sambhag: filters.sambhag }),
    ...(filters.district && { district: filters.district }),
    ...(filters.block && { block: filters.block }),
...(filters.beneficiaryId && { beneficiaryId: filters.beneficiaryId })  },
  signal: abortControllerRef.current.signal
});
      
      // Only update state if this is the latest request
      if (thisRequestId !== requestIdRef.current) {
        return;
      }
      
      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        setNonDonors(response.data);
        setTotalPages(1);
        setTotalElements(response.data.length);
        setPage(0);
      } else {
        // Spring Boot uses 'number' not 'pageNumber'
        const { content, number, pageNumber, totalPages: pages, totalElements: total } = response.data;
        const actualPageNumber = number !== undefined ? number : (pageNumber !== undefined ? pageNumber : pageNum);
        setNonDonors(content || []);
        setPage(actualPageNumber);
        setTotalPages(pages || 1);
        setTotalElements(total || 0);
      }
    } catch (err) {
      // Ignore abortion errors
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching non-donors:', err);
      setError('असहयोग सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setNonDonors([]);
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
  
  pageSize,
  filters.userId,
  filters.fullName,
  filters.mobileNumber,
  filters.sambhag,
  filters.district,
  filters.block,
   filters.beneficiaryId
]);

  // Fetch non-donors with debounced filtering when filters change
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      return;
    }
    
    const debounceTimer = setTimeout(() => {
      fetchNonDonors(0);
    }, 300); // 300ms debounce for text inputs
    
    return () => {
      clearTimeout(debounceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
  filters.userId,
  filters.fullName,
  filters.mobileNumber,
  filters.sambhag,
  filters.district,
  filters.block
, filters.beneficiaryId
]);

  // Initial load on component mount
  useEffect(() => {
    fetchNonDonors(0).then(() => {
      isInitialMount.current = false;
    });
    
    // Cleanup function to abort any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array - runs only once on mount

 const hasActiveFilters = () => {
  return Boolean(
    filters.userId ||
    filters.fullName ||
    filters.mobileNumber ||
    filters.sambhag ||
    filters.district ||
    filters.block ||
    filters.beneficiaryId
  );
};
const downloadBlobFile = (data, filename, type = 'text/csv;charset=utf-8') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
const handleExportAsahyog = async () => {
  try {
const response = await publicApi.get('/public/export/asahyog/by-beneficiary', {      params: {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.fullName && { name: filters.fullName }),
        ...(filters.mobileNumber && { mobile: filters.mobileNumber }),
        ...(filters.sambhag && { sambhag: filters.sambhag }),
        ...(filters.district && { district: filters.district }),
        ...(filters.block && { block: filters.block }),
        ...(filters.beneficiaryId && { beneficiaryId: filters.beneficiaryId }),
      },
      responseType: 'blob',
    });

    downloadBlobFile(response.data, 'asahyog_list.csv');
  } catch (err) {
    console.error('Error exporting asahyog list:', err);
    setError('असहयोग सूची एक्सपोर्ट करने में त्रुटि हुई।');
  }
};
  const handlePageChange = (event, newPage) => {
    const pageNum = parseInt(newPage, 10);
    if (isNaN(pageNum) || pageNum < 1) return;
    // MUI Pagination is 1-indexed, API is 0-indexed
    fetchNonDonors(pageNum - 1);
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
            <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f', fontWeight: 'bold' }}>
              फ़िल्टर (Filters)
            </Typography>
            <Grid container spacing={2} alignItems="end">
              
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
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#c62828',
                      },
                      '&.Mui-focused': {
                        borderColor: '#d32f2f',
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
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#c62828',
                      },
                      '&.Mui-focused': {
                        borderColor: '#d32f2f',
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
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: '#c62828',
                      },
                      '&.Mui-focused': {
                        borderColor: '#d32f2f',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2.4}>
  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
    संभाग (Sambhag)
  </Typography>
  <TextField
    fullWidth
    placeholder="संभाग दर्ज करें"
    value={filters.sambhag}
    onChange={(e) => setFilters(prev => ({ ...prev, sambhag: e.target.value }))}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        border: '2px solid #d32f2f',
        borderRadius: '8px',
        '&:hover': {
          borderColor: '#c62828',
        },
        '&.Mui-focused': {
          borderColor: '#d32f2f',
        }
      }
    }}
  />
</Grid>

<Grid item xs={12} sm={4} md={2.4}>
  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
    जिला (District)
  </Typography>
  <TextField
    fullWidth
    placeholder="जिला दर्ज करें"
    value={filters.district}
    onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        border: '2px solid #d32f2f',
        borderRadius: '8px',
        '&:hover': {
          borderColor: '#c62828',
        },
        '&.Mui-focused': {
          borderColor: '#d32f2f',
        }
      }
    }}
  />
</Grid>

<Grid item xs={12} sm={4} md={2.4}>
  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
    ब्लॉक (Block)
  </Typography>
  <TextField
    fullWidth
    placeholder="ब्लॉक दर्ज करें"
    value={filters.block}
    onChange={(e) => setFilters(prev => ({ ...prev, block: e.target.value }))}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        border: '2px solid #d32f2f',
        borderRadius: '8px',
        '&:hover': {
          borderColor: '#c62828',
        },
        '&.Mui-focused': {
          borderColor: '#d32f2f',
        }
      }
    }}
  />
</Grid>
<Grid item xs={12} sm={4} md={2.4}>
  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
    Beneficiary
  </Typography>
  <FormControl fullWidth size="small">
    <Select
      value={filters.beneficiaryId}
onChange={(e) => setFilters(prev => ({ ...prev, beneficiaryId: e.target.value }))}      displayEmpty
    >
      <MenuItem value="">All Beneficiaries</MenuItem>
      {beneficiaryOptions.map((item) => (
  <MenuItem key={item.id} value={item.id}>
    {item.name}
  </MenuItem>
))}
    </Select>
  </FormControl>
</Grid>
<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
  <Button
    variant="contained"
    onClick={handleExportAsahyog}
    sx={{
      backgroundColor: '#d32f2f',
      '&:hover': { backgroundColor: '#b71c1c' }
    }}
  >
    {hasActiveFilters() ? 'Export With Filter' : 'Export All'}
  </Button>
</Box>
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
                🎉 आपका सहयोग हो गया है
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
                            {getDisplayValue(user.registrationNumber || user.id)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {getDisplayValue(user.name)}
                          </TableCell>
                          <TableCell>
                            {getDisplayValue(user.department)}
                          </TableCell>
                          <TableCell>
                            {getDisplayValue(user.state || user.departmentState)}
                          </TableCell>
                          <TableCell>
                            {getDisplayValue(user.sambhag || user.departmentSambhag)}
                          </TableCell>
                          <TableCell>
                            {getDisplayValue(user.district || user.departmentDistrict)}
                          </TableCell>
                          <TableCell>
                            {getDisplayValue(user.block || user.departmentBlock)}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.85rem' }}>
                            {getDisplayValue(user.schoolName || user.schoolOfficeName)}
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
