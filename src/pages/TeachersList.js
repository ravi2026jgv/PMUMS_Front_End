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
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20); // Users per page
  
  // Filter state
  const [filters, setFilters] = useState({
    state: '',
    sambhag: '',
    district: '',
    block: '',
    searchName: ''
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

  // Get unique values for filter dropdowns (from current page data)
  const getUniqueValues = (key) => {
    const values = teachers.map(teacher => teacher[key]).filter(Boolean);
    return [...new Set(values)];
  };

  // Apply filters on current page data (client-side filtering)
  const applyFilters = useCallback(() => {
    let filtered = teachers;

    if (filters.state) {
      filtered = filtered.filter(teacher => teacher.state === filters.state);
    }
    if (filters.sambhag) {
      filtered = filtered.filter(teacher => teacher.sambhag === filters.sambhag);
    }
    if (filters.district) {
      filtered = filtered.filter(teacher => teacher.district === filters.district);
    }
    if (filters.block) {
      filtered = filtered.filter(teacher => teacher.block === filters.block);
    }
    if (filters.searchName) {
      filtered = filtered.filter(teacher => 
        `${teacher.name} ${teacher.surname}`.toLowerCase()
          .includes(filters.searchName.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
    
    // Check if any filter is active
    const hasActiveFilters = filters.state || filters.sambhag || filters.district || 
                            filters.block || filters.searchName;
    setFiltersActive(hasActiveFilters);
  }, [teachers, filters]);

  // Fetch paginated teachers from API
  const fetchTeachers = async (page = 0) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching paginated teachers:', { page, pageSize });
      const response = await publicApi.get(`/users/paginated?page=${page}&size=${pageSize}`);
      console.log('Paginated response:', response.data);
      
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
  };

  // Initial fetch
  useEffect(() => {
    fetchTeachers(0);
  }, []);

  // Apply filters when teachers or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      state: '',
      sambhag: '',
      district: '',
      block: '',
      searchName: ''
    });
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    // MUI Pagination is 1-indexed, API is 0-indexed
    fetchTeachers(page - 1);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>राज्य चुनें</InputLabel>
                  <Select
                    value={filters.state}
                    label="राज्य चुनें"
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <MenuItem value="">सभी राज्य</MenuItem>
                    {getUniqueValues('departmentState').map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>संभाग चुनें</InputLabel>
                  <Select
                    value={filters.sambhag}
                    label="संभाग चुनें"
                    onChange={(e) => handleFilterChange('sambhag', e.target.value)}
                  >
                    <MenuItem value="">सभी संभाग</MenuItem>
                    {getUniqueValues('departmentSambhag').map((sambhag) => (
                      <MenuItem key={sambhag} value={sambhag}>
                        {sambhag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>जिला चुनें</InputLabel>
                  <Select
                    value={filters.district}
                    label="जिला चुनें"
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                  >
                    <MenuItem value="">सभी जिले</MenuItem>
                    {getUniqueValues('departmentDistrict').map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>ब्लॉक चुनें</InputLabel>
                  <Select
                    value={filters.block}
                    label="ब्लॉक चुनें"
                    onChange={(e) => handleFilterChange('block', e.target.value)}
                  >
                    <MenuItem value="">सभी ब्लॉक</MenuItem>
                    {getUniqueValues('departmentBlock').map((block) => (
                      <MenuItem key={block} value={block}>
                        {block}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  placeholder="नाम से खोजें"
                  value={filters.searchName}
                  onChange={(e) => handleFilterChange('searchName', e.target.value)}
                  sx={{ minWidth: 250 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />

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
              </Box>

              {/* Filter info note */}
              {filtersActive && (
                <Alert 
                  severity="info" 
                  icon={<Info />}
                  sx={{ mt: 2, backgroundColor: '#e3f2fd' }}
                >
                  फ़िल्टर केवल वर्तमान पृष्ठ ({pageSize} रिकॉर्ड) पर लागू होता है। 
                  पूर्ण खोज के लिए जल्द ही सर्वर-साइड फ़िल्टर उपलब्ध होगा।
                </Alert>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  कुल <strong>{totalElements.toLocaleString('hi-IN')}</strong> शिक्षक पंजीकृत
                </Typography>
                {filtersActive && (
                  <Chip 
                    label={`इस पृष्ठ पर ${filteredTeachers.length} मिले`}
                    color="primary"
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
                    {(filtersActive ? filteredTeachers : teachers).map((teacher, index) => (
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
                  {filtersActive 
                    ? `इस पृष्ठ पर ${filteredTeachers.length} परिणाम दिखाए जा रहे हैं (कुल ${totalElements.toLocaleString('hi-IN')} में से)`
                    : `${startRecord.toLocaleString('hi-IN')} - ${endRecord.toLocaleString('hi-IN')} परिणाम (कुल ${totalElements.toLocaleString('hi-IN')} में से)`
                  }
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