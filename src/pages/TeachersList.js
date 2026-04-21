import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Pagination,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  FilterList,
  Info
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi, receiptAPI, FILE_BASE_URL } from '../services/api';
const TeachersList = () => {
  // Server-side pagination state
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20); // Users per page
  
  // Location data for cascading dropdowns
  const [locationHierarchy, setLocationHierarchy] = useState(null);
  const [sambhagOptions, setSambhagOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  
  const [utrDialogOpen, setUtrDialogOpen] = useState(false);
const [selectedTeacher, setSelectedTeacher] = useState(null);
const [utrForm, setUtrForm] = useState({
  amount: '',
  referenceName: '',
  utrNumber: ''
});
const [utrSubmitting, setUtrSubmitting] = useState(false);
const [utrSuccess, setUtrSuccess] = useState('');

  // Filter state - store both ID and name for display
  const [filters, setFilters] = useState({
    sambhagId: '',
    sambhagName: '',
    districtId: '',
    districtName: '',
    blockId: '',
    blockName: '',
    userId: '',
    searchName: '',
    mobileNumber: ''
  });
  
  // Track if filters are active
  const [filtersActive, setFiltersActive] = useState(false);

  // Prevent duplicate API calls
  const abortControllerRef = useRef(null);
  const locationAbortControllerRef = useRef(null);
  const isInitialMount = useRef(true); // Track initial mount
  const requestIdRef = useRef(0); // Track request ID to handle race conditions
  
  // Process teacher data using actual database relationships
  const processTeacherData = (teacher) => {
    try {
      const hasDbRelations = teacher.departmentState && teacher.departmentSambhag && 
                            teacher.departmentDistrict && teacher.departmentBlock;
      
      if (hasDbRelations) {
        return {
          ...teacher,
          state: teacher.departmentState,
          sambhag: teacher.departmentSambhag, 
          district: teacher.departmentDistrict,
          block: teacher.departmentBlock
        };
      } else {
        return {
          ...teacher,
          state: teacher.departmentState || 'Madhya Pradesh',
          sambhag: teacher.departmentSambhag || 'Bhopal Division',
          district: teacher.departmentDistrict || 'Bhopal',
          block: teacher.departmentBlock || 'Bhopal'
        };
      }
    } catch (error) {
      return {
        ...teacher,
        state: 'Madhya Pradesh',
        sambhag: 'Bhopal Division', 
        district: 'Bhopal',
        block: 'Bhopal'
      };
    }
  };

  // Fetch location hierarchy data
  const fetchLocationData = async () => {
    // Cancel any ongoing request
    if (locationAbortControllerRef.current) {
      locationAbortControllerRef.current.abort();
    }
    
    // Create new AbortController
    locationAbortControllerRef.current = new AbortController();
    
    try {
      const response = await publicApi.get('/locations/hierarchy', {
        signal: locationAbortControllerRef.current.signal
      });
      const data = response.data;
      setLocationHierarchy(data);
      
      // Extract sambhags from the first state (MP)
      if (data?.states?.[0]?.sambhags) {
        const sambhags = data.states[0].sambhags.map(s => ({
          id: s.id,
          name: s.name,
          districts: s.districts
        }));
        setSambhagOptions(sambhags);
      }
    } catch (err) {
      // Ignore abortion errors
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching locations:', err);
    }
  };

  // Handle sambhag change
  const handleSambhagChange = (sambhagId) => {
    const sambhag = sambhagOptions.find(s => s.id === sambhagId);
    setFilters(prev => ({
      ...prev,
      sambhagId: sambhagId,
      sambhagName: sambhag?.name || '',
      districtId: '',
      districtName: '',
      blockId: '',
      blockName: ''
    }));
    setDistrictOptions(sambhag?.districts || []);
    setBlockOptions([]);
  };

  // Handle district change
  const handleDistrictChange = (districtId) => {
    const district = districtOptions.find(d => d.id === districtId);
    setFilters(prev => ({
      ...prev,
      districtId: districtId,
      districtName: district?.name || '',
      blockId: '',
      blockName: ''
    }));
    setBlockOptions(district?.blocks || []);
  };

  // Handle block change
  const handleBlockChange = (blockId) => {
    const block = blockOptions.find(b => b.id === blockId);
    setFilters(prev => ({
      ...prev,
      blockId: blockId,
      blockName: block?.name || ''
    }));
  };

  // Check if any filter is active (simple function, not useCallback)
  const updateFiltersActive = () => {
    const hasActiveFilters = filters.sambhagId || filters.districtId || 
                            filters.blockId || filters.searchName || filters.mobileNumber;
    setFiltersActive(hasActiveFilters);
  };

  // Fetch paginated teachers from API with filters
  const fetchTeachers = async (page = 0, currentFilters = filters) => {
    // Validate and sanitize page number
    const validPage = Math.max(0, parseInt(page, 10) || 0);
    
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
      
      // Build query params for server-side filtering
      const params = new URLSearchParams();
      params.append('page', validPage);
      params.append('size', pageSize);
      
      if (currentFilters.sambhagId) params.append('sambhagId', currentFilters.sambhagId);
      if (currentFilters.districtId) params.append('districtId', currentFilters.districtId);
      if (currentFilters.blockId) params.append('blockId', currentFilters.blockId);
      if (currentFilters.userId) params.append('userId', currentFilters.userId);
      if (currentFilters.searchName) params.append('name', currentFilters.searchName);
      if (currentFilters.mobileNumber) params.append('mobile', currentFilters.mobileNumber);
      
      console.log(`[Request ${thisRequestId}] Fetching page: ${validPage}`);
      const response = await publicApi.get(`/users/filter?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      });
      
      // Only update state if this is the latest request
      if (thisRequestId !== requestIdRef.current) {
        console.log(`[Request ${thisRequestId}] Ignoring stale response, current is ${requestIdRef.current}`);
        return;
      }
      
      console.log(`[Request ${thisRequestId}] API Response - pageNumber:`, response.data.number || response.data.pageNumber);
      
      // Process the paginated response
      // Spring Boot uses 'number' for page number, not 'pageNumber'
      const { content, number, pageNumber, totalPages: pages, totalElements: total } = response.data;
      const actualPageNumber = number !== undefined ? number : (pageNumber !== undefined ? pageNumber : validPage);
      
      // Process teachers data
      const processedTeachers = content.map(teacher => processTeacherData(teacher));
      
      setTeachers(processedTeachers);
      setCurrentPage(actualPageNumber);
      setTotalPages(pages || 0);
      setTotalElements(total || 0);
      
      console.log(`[Request ${thisRequestId}] State updated - currentPage:`, actualPageNumber);
    } catch (err) {
      // Ignore abortion errors
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching teachers:', err);
      setError('शिक्षकों की सूची लोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      // Only update loading if this is still the latest request
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch of location data and teachers
  useEffect(() => {
    fetchLocationData();
    fetchTeachers(0, filters).then(() => {
      isInitialMount.current = false;
    });
    
    // Cleanup function to abort any ongoing requests
    return () => {
      if (locationAbortControllerRef.current) {
        locationAbortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch teachers when filters change (skip initial mount)
  useEffect(() => {
    // Update filters active state
    updateFiltersActive();
    
    // Skip on initial mount - initial fetch is done separately
    if (isInitialMount.current) {
      return;
    }
    
    const debounceTimer = setTimeout(() => {
      fetchTeachers(0, filters);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sambhagId, filters.districtId, filters.blockId, filters.userId, filters.searchName, filters.mobileNumber]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sambhagId: '',
      sambhagName: '',
      districtId: '',
      districtName: '',
      blockId: '',
      blockName: '',
      userId: '',
      searchName: '',
      mobileNumber: ''
    });
    setDistrictOptions([]);
    setBlockOptions([]);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    // MUI Pagination passes the new page number (1-indexed)
    const pageNum = parseInt(newPage, 10);
    console.log('Page change triggered:', pageNum);
    
    // Validate page number
    if (isNaN(pageNum) || pageNum < 1) {
      console.error('Invalid page number:', newPage);
      return;
    }
    
    // MUI Pagination is 1-indexed, API is 0-indexed
    const pageIndex = pageNum - 1;
    console.log('Fetching page index:', pageIndex);
    fetchTeachers(pageIndex, filters);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };
const openUtrDialog = (teacher) => {
  setSelectedTeacher(teacher);
  setUtrForm({
    amount: '',
    referenceName: '',
    utrNumber: ''
  });
  setUtrSuccess('');
  setError('');
  setUtrDialogOpen(true);
};

const closeUtrDialog = () => {
  if (utrSubmitting) return;
  setUtrDialogOpen(false);
  setSelectedTeacher(null);
  setUtrForm({
    amount: '',
    referenceName: '',
    utrNumber: ''
  });
};

const handleUtrSubmit = async () => {
  if (!utrForm.amount || !utrForm.referenceName || !utrForm.utrNumber) {
    setError('कृपया सभी UTR विवरण भरें।');
    return;
  }

  try {
    setUtrSubmitting(true);
    setError('');
    setUtrSuccess('');

    await receiptAPI.uploadReceipt({
      amount: Number(utrForm.amount),
      referenceName: utrForm.referenceName,
      utrNumber: utrForm.utrNumber
    });

    setUtrSuccess('UTR सफलतापूर्वक सबमिट हो गया।');
    await fetchTeachers(currentPage, filters);

    setTimeout(() => {
      closeUtrDialog();
    }, 800);
  } catch (err) {
    console.error('UTR upload failed:', err);
    setError(err?.response?.data?.message || 'UTR सबमिट करने में त्रुटि हुई।');
  } finally {
    setUtrSubmitting(false);
  }
};

const getQrImageUrl = (qrPath) => {
  if (!qrPath) return '';
  if (qrPath.startsWith('http://') || qrPath.startsWith('https://')) {
    return qrPath;
  }
  return `${FILE_BASE_URL}${qrPath.startsWith('/') ? qrPath : `/${qrPath}`}`;
};
const showUtrColumns = filters.mobileNumber.length === 10;
  // Calculate display range for current page
  const startRecord = currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <Layout>
      <Box sx={{ py: 4, minHeight: '100vh', background: '#FFF8F0' }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#1a237e',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Our Members (शिक्षकों की सूची)
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#666',
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}
              >
                PMUMS पंजीकृत शिक्षकों की संपूर्ण सूची
              </Typography>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="end">
                {/* Location filters - Hidden temporarily
                <Grid item xs={12} sm={4} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>संभाग चुनें</InputLabel>
                    <Select
                      value={filters.sambhagId}
                      label="संभाग चुनें"
                      onChange={(e) => handleSambhagChange(e.target.value)}
                    >
                      <MenuItem value="">सभी संभाग</MenuItem>
                      {sambhagOptions.map((sambhag) => (
                        <MenuItem key={sambhag.id} value={sambhag.id}>
                          {sambhag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4} md={2}>
                  <FormControl fullWidth size="small" disabled={!filters.sambhagId}>
                    <InputLabel>जिला चुनें</InputLabel>
                    <Select
                      value={filters.districtId}
                      label="जिला चुनें"
                      onChange={(e) => handleDistrictChange(e.target.value)}
                    >
                      <MenuItem value="">सभी जिले</MenuItem>
                      {districtOptions.map((district) => (
                        <MenuItem key={district.id} value={district.id}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4} md={2}>
                  <FormControl fullWidth size="small" disabled={!filters.districtId}>
                    <InputLabel>ब्लॉक चुनें</InputLabel>
                    <Select
                      value={filters.blockId}
                      label="ब्लॉक चुनें"
                      onChange={(e) => handleBlockChange(e.target.value)}
                    >
                      <MenuItem value="">सभी ब्लॉक</MenuItem>
                      {blockOptions.map((block) => (
                        <MenuItem key={block.id} value={block.id}>
                          {block.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                */}

                <Grid item xs={12} sm={4} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                    यूजर आईडी (User ID)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="यूजर आईडी से खोजें"
                    value={filters.userId}
                    onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '2px solid #2e7d32',
                        borderRadius: '8px',
                        '&:hover': {
                          borderColor: '#1b5e20',
                        },
                        '&.Mui-focused': {
                          borderColor: '#2e7d32',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                    नाम (Name)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="नाम से खोजें"
                    value={filters.searchName}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchName: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '2px solid #2e7d32',
                        borderRadius: '8px',
                        '&:hover': {
                          borderColor: '#1b5e20',
                        },
                        '&.Mui-focused': {
                          borderColor: '#2e7d32',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                    मोबाइल (Mobile)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 10 }}
                    placeholder="मोबाइल नंबर से खोजें"
                    value={filters.mobileNumber}
onChange={(e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
  setFilters(prev => ({ ...prev, mobileNumber: value }));
}}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '2px solid #2e7d32',
                        borderRadius: '8px',
                        '&:hover': {
                          borderColor: '#1b5e20',
                        },
                        '&.Mui-focused': {
                          borderColor: '#2e7d32',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Clear Filters button - Hidden temporarily
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={clearFilters}
                    sx={{
                      background: '#ff9800',
                      '&:hover': { background: '#f57c00' }
                    }}
                    startIcon={<FilterList />}
                  >
                    फिल्टर साफ़ करें
                  </Button>
                </Grid>
                */}
              </Grid>

              {/* Filter info */}
              {filtersActive && (
                <Alert 
                  severity="success" 
                  icon={<Info />}
                  sx={{ mt: 2, backgroundColor: '#e8f5e9' }}
                >
                  सर्वर-साइड फ़िल्टर सक्रिय है। कुल {totalElements.toLocaleString('hi-IN')} परिणाम मिले।
                </Alert>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  कुल <strong>{totalElements.toLocaleString('hi-IN')}</strong> {filtersActive ? 'परिणाम' : 'शिक्षक पंजीकृत'}
                </Typography>
                {filtersActive && (
                  <Chip 
                    label={`फ़िल्टर सक्रिय`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Loading and Error States */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Teachers Table */}
          {!loading && !error && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                      '& th': { 
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }
                    }}>
                      <TableCell align="center">पंजीकरण संख्या</TableCell>
                      <TableCell align="center">नाम</TableCell>
                      <TableCell align="center">विभाग</TableCell>
                      <TableCell align="center">राज्य</TableCell>
                      <TableCell align="center">संभाग</TableCell>
                      <TableCell align="center">जिला</TableCell>
                      <TableCell align="center">ब्लॉक</TableCell>
                      <TableCell align="center">स्कूल का नाम</TableCell>
                      <TableCell align="center">पंजीकरण तिथि</TableCell>
                  {showUtrColumns && <TableCell align="center"> QR कोड</TableCell>}
{showUtrColumns && <TableCell align="center">UTR अपलोड</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow
                        key={teacher.id}
                  sx={{
  ...(showUtrColumns
    ? {
        backgroundColor: teacher.utrUploaded ? '#e8f5e9' : '#ffebee',
        '&:nth-of-type(odd)': {
          backgroundColor: teacher.utrUploaded ? '#dff3e3' : '#fde7e7',
        },
        '&:hover': {
          backgroundColor: teacher.utrUploaded ? '#c8e6c9' : '#ffcdd2',
        },
      }
    : {
       backgroundColor: teacher.utrUploaded ? '#e8f5e9' : '#ffebee',
        '&:nth-of-type(odd)': {
          backgroundColor: teacher.utrUploaded ? '#dff3e3' : '#fde7e7',
        },
        '&:hover': {
          backgroundColor: teacher.utrUploaded ? '#c8e6c9' : '#ffcdd2',
        },
      }),
  '& td': {
    borderBottom: '1px solid #e0e0e0'
  }
}}
                      >
                        <TableCell align="center" sx={{ 
                          fontWeight: 600,
                          color: '#1a237e',
                          fontFamily: 'monospace'
                        }}>
                          {teacher.id || 'N/A'}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 500 }}>
                          {`${teacher.name} ${teacher.surname}`}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.department || 'शिक्षा विभाग'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.state || 'मध्य प्रदेश'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.sambhag || 'भोपाल संभाग'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.district || 'भोपाल'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.block || 'भोपाल'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.schoolOfficeName || 'शासकीय प्राथमिक विद्यालय'}
                        </TableCell>
                        <TableCell align="center">
                          {formatDate(teacher.createdAt || teacher.createdDate) || 'N/A'}
                        </TableCell>
                        {showUtrColumns && (
  <TableCell align="center">
    {teacher.utrUploaded ? (
      <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
        UTR जमा हो चुका है
      </Typography>
    ) : teacher.allocatedQrCode ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <img
          src={getQrImageUrl(teacher.allocatedQrCode)}
          alt="Assigned QR"
          style={{
            width: 70,
            height: 70,
            objectFit: 'contain',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fff',
            padding: 4
          }}
        />
        <Typography variant="caption" sx={{ color: '#555' }}>
          मृत्यु प्रकरण QR
        </Typography>
      </Box>
    ) : (
      <Typography variant="body2" color="text.secondary">
        उपलब्ध नहीं
      </Typography>
    )}
  </TableCell>
)}
{showUtrColumns && (
  <TableCell align="center">
    {teacher.utrUploaded ? (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Chip label="UTR Uploaded" color="success" size="small" />
        {teacher.latestUtrNumber && (
          <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
            {teacher.latestUtrNumber}
          </Typography>
        )}
      </Box>
    ) : (
      <Button
        variant="contained"
        size="small"
        onClick={() => openUtrDialog(teacher)}
        sx={{
          backgroundColor: '#d32f2f',
          '&:hover': { backgroundColor: '#b71c1c' },
          borderRadius: '8px',
          textTransform: 'none'
        }}
      >
        UTR Upload
      </Button>
    )}
  </TableCell>
)}                      </TableRow>
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
                  p: 3,
                  borderTop: '1px solid #e0e0e0'
                }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1} // MUI is 1-indexed, our state is 0-indexed
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    disabled={loading}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    पृष्ठ {(currentPage + 1).toLocaleString('hi-IN')} / {totalPages.toLocaleString('hi-IN')}
                  </Typography>
                </Box>
              )}

              {/* Summary */}
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                borderTop: '1px solid #e0e0e0',
                background: '#f5f5f5'
              }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {`${startRecord.toLocaleString('hi-IN')} - ${endRecord.toLocaleString('hi-IN')} परिणाम (कुल ${totalElements.toLocaleString('hi-IN')} में से)`}
                </Typography>
              </Box>
            </Card>
          )}
        </Container>
      </Box>
      <Dialog open={utrDialogOpen} onClose={closeUtrDialog} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 700, color: '#1a237e' }}>
    UTR विवरण जमा करें
  </DialogTitle>

  <DialogContent>
    {selectedTeacher && (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>यूजर:</strong> {selectedTeacher.name} {selectedTeacher.surname}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>मोबाइल:</strong> {selectedTeacher.mobileNumber || 'N/A'}
        </Typography>
        <Typography variant="body2">
          <strong>मृत्यु प्रकरण:</strong> {selectedTeacher.assignedDeathCaseName || 'N/A'}
        </Typography>
      </Box>
    )}

    <TextField
      fullWidth
      margin="normal"
      label="राशि"
      type="number"
      value={utrForm.amount}
      onChange={(e) => setUtrForm(prev => ({ ...prev, amount: e.target.value }))}
    />

    <TextField
      fullWidth
      margin="normal"
      label="Reference Name"
      value={utrForm.referenceName}
      onChange={(e) => setUtrForm(prev => ({ ...prev, referenceName: e.target.value }))}
    />

    <TextField
      fullWidth
      margin="normal"
      label="UTR Number"
      value={utrForm.utrNumber}
      onChange={(e) => setUtrForm(prev => ({ ...prev, utrNumber: e.target.value }))}
    />

    {utrSuccess && (
      <Alert severity="success" sx={{ mt: 2 }}>
        {utrSuccess}
      </Alert>
    )}
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={closeUtrDialog} disabled={utrSubmitting}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleUtrSubmit}
      disabled={utrSubmitting}
      sx={{ textTransform: 'none' }}
    >
      {utrSubmitting ? 'Submitting...' : 'Submit UTR'}
    </Button>
  </DialogActions>
</Dialog>
    </Layout>
  );
};

export default TeachersList;