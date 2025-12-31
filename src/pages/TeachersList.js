import React, { useState, useEffect } from 'react';
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
  Paper,
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
  Alert
} from '@mui/material';
import {
  Search,
  FilterList
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    state: '',
    sambhag: '',
    district: '',
    block: '',
    searchName: ''
  });
  
  const itemsPerPage = 10;

  // Get unique districts and blocks for filter dropdowns
  const getUniqueValues = (key) => {
    const values = teachers.map(teacher => teacher[key]).filter(Boolean);
    return [...new Set(values)];
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teachers, filters]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      console.log('Fetching teachers from:', '/users');
      const response = await publicApi.get('/users');
      console.log('Teachers response:', response.data);
      setTeachers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching teachers:', err);
      console.error('Error response:', err.response);
      setError('शिक्षकों की सूची लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = teachers;

    if (filters.state) {
      filtered = filtered.filter(teacher => 
        teacher.departmentState === filters.state
      );
    }

    if (filters.sambhag) {
      filtered = filtered.filter(teacher => 
        teacher.departmentSambhag === filters.sambhag
      );
    }

    if (filters.district) {
      filtered = filtered.filter(teacher => 
        teacher.departmentDistrict === filters.district
      );
    }

    if (filters.block) {
      filtered = filtered.filter(teacher => 
        teacher.departmentBlock === filters.block
      );
    }

    if (filters.searchName) {
      filtered = filtered.filter(teacher => 
        `${teacher.name} ${teacher.surname}`.toLowerCase()
          .includes(filters.searchName.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      sambhag: '',
      district: '',
      block: '',
      searchName: ''
    });
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

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
                Teacher's List (शिक्षकों की सूची)
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

              <Typography variant="body2" sx={{ color: '#666' }}>
                कुल {filteredTeachers.length} शिक्षक मिले {teachers.length > 0 && `(${teachers.length} में से)`}
              </Typography>
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
                    {currentTeachers.map((teacher, index) => (
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
                          {teacher.departmentState || 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.departmentSambhag || 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.departmentDistrict || 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          {teacher.departmentBlock || 'N/A'}
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
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 3,
                  borderTop: '1px solid #e0e0e0'
                }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              {/* Summary */}
              <Box sx={{ 
                textAlign: 'center', 
                p: 2, 
                borderTop: '1px solid #e0e0e0',
                background: '#FFFFFF'
              }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  कुल {filteredTeachers.length} में से {startIndex + 1}-{Math.min(endIndex, filteredTeachers.length)} परिणाम
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