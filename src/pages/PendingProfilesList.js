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
  Card,
  CardContent,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FileDownloadRounded,
  PendingActionsRounded,
  InfoRounded,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import api, { publicApi } from '../services/api';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  green: '#0f766e',
  red: '#b42318',
  border: '#ded8f5'
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: '#ffffff',
    transition: 'all 0.25s ease',
    '& fieldset': {
      borderColor: 'rgba(111, 92, 194, 0.22)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(111, 92, 194, 0.48)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    fontWeight: 600,
    color: theme.text,
    fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
  },
};

const PendingProfilesList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [sambhagOptions, setSambhagOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);

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

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

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

      const response = await publicApi.get('/users/pending-profiles/filter', {
        params: {
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
      const response = await publicApi.get('/users/pending-profiles/export', {
        params: {
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

  const startRecord = totalElements === 0 ? 0 : page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 6, md: 8 },
         background: theme.soft,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: { xs: '28px', md: '38px' },
background: 'linear-gradient(135deg, #221b43 0%, #30295c 48%, #3b3268 100%)',
boxShadow: '0 30px 90px rgba(34, 27, 67, 0.22)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              overflow: 'hidden',
              position: 'relative',

              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 7,
background: theme.main,              },

              
            }}
          >
            <CardContent
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '22px',
                  mx: 'auto',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
<PendingActionsRounded sx={{ fontSize: 38, color: '#ffffff' }} />              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1.3,
                  fontSize: { xs: '1.9rem', md: '3rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                पेंडिंग प्रोफाइल सूची
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.90)',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                जिन सदस्यों की प्रोफाइल जानकारी अधूरी है
              </Typography>

              <Chip
                label={`कुल ${totalElements.toLocaleString('hi-IN')} पेंडिंग प्रोफाइल`}
                sx={{
                  mt: 2.5,
                  color: '#fff',
                  fontWeight: 700,
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.24)',
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              />
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: { xs: '24px', md: '32px' },
             background: '#ffffff',
border: '1px solid rgba(111, 92, 194, 0.16)',
boxShadow: '0 24px 70px rgba(34, 27, 67, 0.10)',
              overflow: 'hidden',
              position: 'relative',

              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 7,
background: theme.main,              },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  flexWrap: 'wrap',
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 850,
                      fontSize: { xs: '1.25rem', md: '1.45rem' },
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
                    खोज और फिल्टर
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.muted,
                      fontWeight: 650,
                      mt: 0.5,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
                    यूजर आईडी, पूरा नाम या मोबाइल नंबर से पेंडिंग प्रोफाइल खोजें।
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleExportPendingProfiles}
                  startIcon={<FileDownloadRounded />}
                  sx={{
                    borderRadius: '14px',
                    px: 2.8,
                    py: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    background:'#0f7633',
boxShadow: '0 12px 28px rgba(15, 118, 110, 0.28)',
'&:hover': {
  background: '#0b5f59',
  transform: 'translateY(-1px)',
},
                  }}
                >
                  {hasActiveFilters() ? 'Export With Filter' : 'Export All'}
                </Button>
              </Box>

              <Grid container spacing={2.5} alignItems="end">
                {/* Location filters kept for future use */}
                {false && (
                  <>
                    <Grid item xs={12} sm={4} md={2.4}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                        संभाग (Sambhag)
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={filters.sambhagId}
                          onChange={handleSambhagChange}
                          displayEmpty
                          sx={inputSx}
                        >
                          <MenuItem value="">सभी संभाग</MenuItem>
                          {Array.isArray(sambhagOptions) &&
                            sambhagOptions.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2.4}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                        जिला (District)
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={filters.districtId}
                          onChange={handleDistrictChange}
                          displayEmpty
                          disabled={!filters.sambhagId}
                          sx={inputSx}
                        >
                          <MenuItem value="">सभी जिले</MenuItem>
                          {Array.isArray(districtOptions) &&
                            districtOptions.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2.4}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                        ब्लॉक (Block)
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={filters.blockId}
                          onChange={handleBlockChange}
                          displayEmpty
                          disabled={!filters.districtId}
                          sx={inputSx}
                        >
                          <MenuItem value="">सभी ब्लॉक</MenuItem>
                          {Array.isArray(blockOptions) &&
                            blockOptions.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={4} md={4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
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
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
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
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
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
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.main }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {hasActiveFilters() && (
                <Alert
                  severity="info"
                  icon={<InfoRounded />}
                  sx={{
                    mt: 2.5,
                    borderRadius: '16px',
                   backgroundColor: theme.softAccent,
border: '1px solid rgba(15, 118, 110, 0.18)',
                    color: theme.text,
                    fontWeight: 600,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  फिल्टर सक्रिय है। कुल {totalElements.toLocaleString('hi-IN')} परिणाम मिले।
                </Alert>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }}>
              {error}
            </Alert>
          )}

          <Card
            elevation={0}
            sx={{
              borderRadius: { xs: '24px', md: '32px' },
              background: '#ffffff',
border: '1px solid rgba(111, 92, 194, 0.16)',
boxShadow: '0 28px 80px rgba(34, 27, 67, 0.12)',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 8,
                }}
              >
                <CircularProgress size={50} sx={{ color: theme.main }} />

                <Typography
                  sx={{
                    mt: 2,
                    color: theme.muted,
                    fontWeight: 800,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  लोड हो रहा है...
                </Typography>
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.dark,
                    fontWeight: 900,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  कोई पेंडिंग प्रोफाइल नहीं मिली।
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: theme.muted,
                    fontWeight: 650,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  कृपया फिल्टर बदलकर पुनः प्रयास करें।
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& th': {
background: theme.dark,                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            whiteSpace: 'nowrap',
                            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                            borderBottom: 'none',
                          },
                        }}
                      >
                        <TableCell>क्र.सं.</TableCell>
                        <TableCell>रजिस्ट्रेशन नं.</TableCell>
                        <TableCell>नाम (Name)</TableCell>
                        <TableCell>विभाग</TableCell>
                        <TableCell>राज्य</TableCell>
                        <TableCell>संभाग</TableCell>
                        <TableCell>जिला</TableCell>
                        <TableCell>ब्लॉक</TableCell>
                        <TableCell>स्कूल / ऑफिस</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            transition: 'background-color 0.2s',
                            backgroundColor:
                              index % 2 === 0
                                ? '#ffffff'
                                : 'rgba(245, 243, 255, 0.38)',
                            '&:hover': {
                              backgroundColor: 'rgba(245, 243, 255, 0.78)',
                            },
                            '& td': {
                              borderBottom: '1px solid rgba(124, 58, 237, 0.10)',
                              color: '#374151',
                              fontWeight: 650,
                              fontSize: '0.9rem',
                              fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                            },
                          }}
                        >
                          <TableCell sx={{ fontWeight: '700 !important', color: `${theme.main} !important` }}>
                            {page * pageSize + index + 1}
                          </TableCell>

                          <TableCell sx={{ color: `${theme.dark} !important`, fontWeight: '700 !important' }}>
                            {getDisplayValue(user.registrationNumber || user.id)}
                          </TableCell>

                          <TableCell sx={{ fontWeight: '700 !important', color: `${theme.dark} !important` }}>
                            {getDisplayValue(user.name)}
                          </TableCell>

                          <TableCell>{getDisplayValue(user.department)}</TableCell>
                          <TableCell>{getDisplayValue(user.state || user.departmentState)}</TableCell>
                          <TableCell>{getDisplayValue(user.sambhag || user.departmentSambhag)}</TableCell>
                          <TableCell>{getDisplayValue(user.district || user.departmentDistrict)}</TableCell>
                          <TableCell>{getDisplayValue(user.block || user.departmentBlock)}</TableCell>
                          <TableCell>{getDisplayValue(user.schoolName || user.schoolOfficeName)}</TableCell>
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
                      borderTop: '1px solid rgba(124, 58, 237, 0.12)',
                      background: 'rgba(245,243,255,0.45)',
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
                        '& .MuiPaginationItem-root': {
                          borderRadius: '12px',
                          fontWeight: 800,
                          color: theme.text,
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                          backgroundColor: `${theme.main} !important`,
                          color: '#fff',
                          boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)',
                        },
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.muted,
                        fontWeight: 800,
                        fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                      }}
                    >
                      {`${startRecord.toLocaleString('hi-IN')} - ${endRecord.toLocaleString('hi-IN')} परिणाम (कुल ${totalElements.toLocaleString('hi-IN')} में से)`}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Card>
        </Container>
      </Box>
    </Layout>
  );
};

export default PendingProfilesList;