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
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  TextField,
  Button,
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import api, { publicApi } from '../services/api';

const PendingProfilesList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Location dropdown states
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [sambhagOptions, setSambhagOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    sambhagId: '',
    districtId: '',
    blockId: '',
    userId: '',
    fullName: '',
    mobileNumber: '',
  });
const hasActiveFilters = () => {
  return Boolean(
    filters.sambhagId ||
    filters.districtId ||
    filters.blockId ||
    filters.userId ||
    filters.fullName ||
    filters.mobileNumber
  );
};
  // Pagination
  const [page, setPage] = useState(0); // 0-based for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Prevent duplicate API calls
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const isInitialMount = useRef(true);

  const getDisplayValue = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    const stringValue = String(value).trim();
    return stringValue !== '' ? stringValue : fallback;
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
 const loadLocationHierarchy = async () => {
  try {
const response = await api.get('/locations/hierarchy');
    const hierarchy = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
      ? response.data.data
      : Array.isArray(response?.data?.content)
      ? response.data.content
      : [];

    setLocationHierarchy(hierarchy);
    setSambhagOptions(hierarchy);
    setDistrictOptions([]);
    setBlockOptions([]);
  } catch (err) {
    console.error('Error loading location hierarchy:', err);
    setLocationHierarchy([]);
    setSambhagOptions([]);
    setDistrictOptions([]);
    setBlockOptions([]);
  }
};

  useEffect(() => {
    loadLocationHierarchy();
  }, []);

  const handleSambhagChange = (event) => {
    const sambhagId = event.target.value;
    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(sambhagId)
    );

    setFilters((prev) => ({
      ...prev,
      sambhagId,
      districtId: '',
      blockId: '',
    }));

    setDistrictOptions(selectedSambhag?.districts || []);
    setBlockOptions([]);
    setPage(0);
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;

    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(filters.sambhagId)
    );
    const selectedDistrict = selectedSambhag?.districts?.find(
      (item) => String(item.id) === String(districtId)
    );

    setFilters((prev) => ({
      ...prev,
      districtId,
      blockId: '',
    }));

    setBlockOptions(selectedDistrict?.blocks || []);
    setPage(0);
  };

  const handleBlockChange = (event) => {
    const blockId = event.target.value;
    setFilters((prev) => ({
      ...prev,
      blockId,
    }));
    setPage(0);
  };

  const fetchPendingProfiles = useCallback(async (pageNum = 0) => {
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

const response = await publicApi.get('/users/pending-profiles/filter', {        params: {
          page: pageNum,
          size: pageSize,
          ...(filters.sambhagId && { sambhagId: filters.sambhagId }),
          ...(filters.districtId && { districtId: filters.districtId }),
          ...(filters.blockId && { blockId: filters.blockId }),
          ...(filters.userId && { userId: filters.userId }),
          ...(filters.fullName && { name: filters.fullName }),
          ...(filters.mobileNumber && { mobile: filters.mobileNumber }),
        },
        signal: abortControllerRef.current.signal,
      });

      if (thisRequestId !== requestIdRef.current) return;

      const {
        content,
        number,
        pageNumber,
        totalPages: pages,
        totalElements: total,
      } = response.data;

      const actualPageNumber =
        number !== undefined ? number : pageNumber !== undefined ? pageNumber : pageNum;

      setUsers(content || []);
      setPage(actualPageNumber);
      setTotalPages(pages || 1);
      setTotalElements(total || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }

      console.error('Error fetching pending profiles:', err);
      setError('पेंडिंग प्रोफाइल सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setUsers([]);
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    pageSize,
    filters.sambhagId,
    filters.districtId,
    filters.blockId,
    filters.userId,
    filters.fullName,
    filters.mobileNumber,
  ]);

  useEffect(() => {
    if (isInitialMount.current) return;

    const debounceTimer = setTimeout(() => {
      fetchPendingProfiles(0);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    fetchPendingProfiles,
    filters.sambhagId,
    filters.districtId,
    filters.blockId,
    filters.userId,
    filters.fullName,
    filters.mobileNumber,
  ]);

  useEffect(() => {
    fetchPendingProfiles(0).then(() => {
      isInitialMount.current = false;
    });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handlePageChange = (event, newPage) => {
    const pageNum = parseInt(newPage, 10);
    if (isNaN(pageNum) || pageNum < 1) return;

    fetchPendingProfiles(pageNum - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleExportPendingProfiles = async () => {
  try {
const response = await publicApi.get('/users/pending-profiles/export', {      params: {
        ...(filters.sambhagId && { sambhagId: filters.sambhagId }),
        ...(filters.districtId && { districtId: filters.districtId }),
        ...(filters.blockId && { blockId: filters.blockId }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.fullName && { name: filters.fullName }),
        ...(filters.mobileNumber && { mobile: filters.mobileNumber }),
      },
      responseType: 'blob',
    });

    downloadBlobFile(response.data, 'pending_profiles.csv');
  } catch (err) {
    console.error('Error exporting pending profiles:', err);
    setError('पेंडिंग प्रोफाइल एक्सपोर्ट करने में त्रुटि हुई।');
  }
};

  const startRecord = page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fff8f1 0%, #ffe0b2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <Paper
            elevation={10}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ef6c00 0%, #fb8c00 100%)',
              color: 'white',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}
            >
              पेंडिंग प्रोफाइल सूची (Pending Profile List)
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 1, opacity: 0.9 }}>
              जिन सदस्यों की प्रोफाइल जानकारी अधूरी है
            </Typography>
          </Paper>

          {/* Filters */}
          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ef6c00', fontWeight: 'bold' }}>
              फ़िल्टर (Filters)
            </Typography>

            <Grid container spacing={2} alignItems="end">
              {/* <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  संभाग (Sambhag)
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.sambhagId}
                    onChange={handleSambhagChange}
                    displayEmpty
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '2px solid #ef6c00',
                        borderRadius: '8px',
                      },
                    }}
                  >
                    <MenuItem value="">सभी संभाग</MenuItem>
                    {Array.isArray(sambhagOptions) && sambhagOptions.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  जिला (District)
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.districtId}
                    onChange={handleDistrictChange}
                    displayEmpty
                    disabled={!filters.sambhagId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '2px solid #ef6c00',
                        borderRadius: '8px',
                      },
                    }}
                  >
                    <MenuItem value="">सभी जिले</MenuItem>
                    {Array.isArray(districtOptions) && districtOptions.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  ब्लॉक (Block)
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.blockId}
                    onChange={handleBlockChange}
                    displayEmpty
                    disabled={!filters.districtId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '2px solid #ef6c00',
                        borderRadius: '8px',
                      },
                    }}
                  >
                    <MenuItem value="">सभी ब्लॉक</MenuItem>
                    {Array.isArray(blockOptions) && blockOptions.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              <Grid item xs={12} sm={4} md={2.4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#1a237e' }}>
                  यूजर आईडी (User ID)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="यूजर आईडी दर्ज करें"
                  value={filters.userId}
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, userId: e.target.value }));
                    setPage(0);
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #ef6c00',
                      borderRadius: '8px',
                    },
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
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, fullName: e.target.value }));
                    setPage(0);
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #ef6c00',
                      borderRadius: '8px',
                    },
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
                  onChange={(e) => {
                    setFilters((prev) => ({ ...prev, mobileNumber: e.target.value }));
                    setPage(0);
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #ef6c00',
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
  <Button
    variant="contained"
    onClick={handleExportPendingProfiles}
    sx={{
      backgroundColor: '#ef6c00',
      '&:hover': { backgroundColor: '#e65100' }
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

          {/* Table */}
          <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={50} sx={{ color: '#ef6c00' }} />
                <Typography sx={{ ml: 2 }}>लोड हो रहा है...</Typography>
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                  कोई पेंडिंग प्रोफाइल नहीं मिली।
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#ef6c00' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>क्र.सं.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>रजिस्ट्रेशन नं.</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>नाम (Name)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>विभाग</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>राज्य</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>संभाग</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>जिला</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ब्लॉक</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>स्कूल / ऑफिस</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:hover': { backgroundColor: '#fff3e0' },
                            transition: 'background-color 0.2s',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fffaf3',
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {page * pageSize + index + 1}
                          </TableCell>
                          <TableCell sx={{ color: '#ef6c00', fontWeight: 600 }}>
                            {getDisplayValue(user.registrationNumber || user.id)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {getDisplayValue(user.name)}
                          </TableCell>
                          <TableCell>{getDisplayValue(user.department)}</TableCell>
                          <TableCell>{getDisplayValue(user.state || user.departmentState)}</TableCell>
                          <TableCell>{getDisplayValue(user.sambhag || user.departmentSambhag)}</TableCell>
                          <TableCell>{getDisplayValue(user.district || user.departmentDistrict)}</TableCell>
                          <TableCell>{getDisplayValue(user.block || user.departmentBlock)}</TableCell>
                          <TableCell sx={{ fontSize: '0.85rem' }}>
                            {getDisplayValue(user.schoolName || user.schoolOfficeName)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                      py: 3,
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: '#ef6c00',
                          color: '#fff',
                        },
                      }}
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

export default PendingProfilesList;