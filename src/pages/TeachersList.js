import React, { useState, useEffect, useCallback } from 'react';
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
  Chip
} from '@mui/material';
import {
  Search,
  FilterList,
  Info
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';

const TeachersList = () => {
  // Server-side pagination state
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(250); // Users per page
  
  // Location data for cascading dropdowns
  const [locationHierarchy, setLocationHierarchy] = useState(null);
  const [sambhagOptions, setSambhagOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  
  // Filter state - store both ID and name for display
  const [filters, setFilters] = useState({
    sambhagId: '',
    sambhagName: '',
    districtId: '',
    districtName: '',
    blockId: '',
    blockName: '',
    searchName: '',
    mobileNumber: ''
  });
  
  // Track if filters are active
  const [filtersActive, setFiltersActive] = useState(false);

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
    try {
      const response = await publicApi.get('/locations/hierarchy');
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

  // Check if any filter is active
  const checkFiltersActive = useCallback(() => {
    const hasActiveFilters = filters.sambhagId || filters.districtId || 
                            filters.blockId || filters.searchName || filters.mobileNumber;
    setFiltersActive(hasActiveFilters);
  }, [filters]);

  // Fetch paginated teachers from API with filters
  const fetchTeachers = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError('');
      
      // Build query params for server-side filtering
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', pageSize);
      
      if (filters.sambhagId) params.append('sambhagId', filters.sambhagId);
      if (filters.districtId) params.append('districtId', filters.districtId);
      if (filters.blockId) params.append('blockId', filters.blockId);
      if (filters.searchName) params.append('name', filters.searchName);
      if (filters.mobileNumber) params.append('mobile', filters.mobileNumber);
      
      console.log('Fetching filtered teachers:', { page, pageSize, filters });
      const response = await publicApi.get(`/users/filter?${params.toString()}`);
      console.log('Filter response:', response.data);
      
      // Process the paginated response
      const { content, pageNumber, totalPages: pages, totalElements: total } = response.data;
      
      // Process teachers data
      const processedTeachers = content.map(teacher => processTeacherData(teacher));
      
      setTeachers(processedTeachers);
      setCurrentPage(pageNumber);
      setTotalPages(pages);
      setTotalElements(total);
      
      console.log('Pagination info:', { pageNumber, pages, total });
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('शिक्षकों की सूची लोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  }, [filters.sambhagId, filters.districtId, filters.blockId, filters.searchName, filters.mobileNumber, pageSize]);

  // Initial fetch of location data
  useEffect(() => {
    fetchLocationData();
  }, []);

  // Fetch teachers when filters change (with debounce for text inputs)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTeachers(0);
      setCurrentPage(0);
    }, 300); // 300ms debounce for text inputs
    
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sambhagId, filters.districtId, filters.blockId, filters.searchName, filters.mobileNumber]);

  // Check filters active state
  useEffect(() => {
    checkFiltersActive();
  }, [checkFiltersActive]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sambhagId: '',
      sambhagName: '',
      districtId: '',
      districtName: '',
      blockId: '',
      blockName: '',
      searchName: '',
      mobileNumber: ''
    });
    setDistrictOptions([]);
    setBlockOptions([]);
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    // MUI Pagination is 1-indexed, API is 0-indexed
    const newPage = page - 1;
    setCurrentPage(newPage);
    fetchTeachers(newPage);
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
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                alignItems: 'center',
                mb: 2
              }}>
                {/* Location filters - Hidden temporarily
                <FormControl sx={{ minWidth: 200 }}>
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

                <FormControl sx={{ minWidth: 200 }} disabled={!filters.sambhagId}>
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

                <FormControl sx={{ minWidth: 200 }} disabled={!filters.districtId}>
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
                */}

                <TextField
                  placeholder="नाम से खोजें"
                  value={filters.searchName}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchName: e.target.value }))}
                  sx={{ minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  placeholder="मोबाइल नंबर से खोजें"
                  value={filters.mobileNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  sx={{ minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Clear Filters button - Hidden temporarily
                <Button
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
                */}
              </Box>

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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher, index) => (
                      <TableRow
                        key={teacher.id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: '#FFFFFF',
                          },
                          '&:hover': {
                            backgroundColor: '#e3f2fd',
                          },
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
    </Layout>
  );
};

export default TeachersList;