import React, { useState, useEffect, useRef } from 'react';
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
  DialogActions,
  Paper,
  IconButton
} from '@mui/material';
import {
  Search,
  Info,
  Close,
  GroupsRounded,
  UploadFileRounded,
  QrCode2Rounded,
  PaymentsRounded,
  CurrencyRupeeRounded,
  ReceiptLongRounded,
  PersonRounded
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi, receiptAPI, FILE_BASE_URL } from '../services/api';

const theme = {
  dark: '#3b0764',
  main: '#6d28d9',
  light: '#a855f7',
  gold: '#facc15',
  soft: '#f5f3ff',
  softGold: '#fffbeb',
  text: '#4c1d95',
  muted: '#5b5b6b',
  green: '#16a34a',
  red: '#dc2626'
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.92)',
    transition: 'all 0.25s ease',
    '& fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.18)',
      borderWidth: '1px'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.40)'
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.main,
      borderWidth: '2px'
    }
  },
  '& .MuiInputBase-input': {
    fontWeight: 650,
    color: theme.text
  }
};

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(200);

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

  const [filtersActive, setFiltersActive] = useState(false);

  const abortControllerRef = useRef(null);
  const locationAbortControllerRef = useRef(null);
  const isInitialMount = useRef(true);
  const requestIdRef = useRef(0);

  const processTeacherData = (teacher) => {
    try {
      const hasDbRelations =
        teacher.departmentState &&
        teacher.departmentSambhag &&
        teacher.departmentDistrict &&
        teacher.departmentBlock;

      if (hasDbRelations) {
        return {
          ...teacher,
          state: teacher.departmentState,
          sambhag: teacher.departmentSambhag,
          district: teacher.departmentDistrict,
          block: teacher.departmentBlock
        };
      }

      return {
        ...teacher,
        state: teacher.departmentState || 'Madhya Pradesh',
        sambhag: teacher.departmentSambhag || 'Bhopal Division',
        district: teacher.departmentDistrict || 'Bhopal',
        block: teacher.departmentBlock || 'Bhopal'
      };
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

  const fetchLocationData = async () => {
    if (locationAbortControllerRef.current) {
      locationAbortControllerRef.current.abort();
    }

    locationAbortControllerRef.current = new AbortController();

    try {
      const response = await publicApi.get('/locations/hierarchy', {
        signal: locationAbortControllerRef.current.signal
      });

      const data = response.data;
      setLocationHierarchy(data);

      if (data?.states?.[0]?.sambhags) {
        const sambhags = data.states[0].sambhags.map((s) => ({
          id: s.id,
          name: s.name,
          districts: s.districts
        }));
        setSambhagOptions(sambhags);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }

      console.error('Error fetching locations:', err);
    }
  };

  const handleSambhagChange = (sambhagId) => {
    const sambhag = sambhagOptions.find((s) => s.id === sambhagId);

    setFilters((prev) => ({
      ...prev,
      sambhagId,
      sambhagName: sambhag?.name || '',
      districtId: '',
      districtName: '',
      blockId: '',
      blockName: ''
    }));

    setDistrictOptions(sambhag?.districts || []);
    setBlockOptions([]);
  };

  const handleDistrictChange = (districtId) => {
    const district = districtOptions.find((d) => d.id === districtId);

    setFilters((prev) => ({
      ...prev,
      districtId,
      districtName: district?.name || '',
      blockId: '',
      blockName: ''
    }));

    setBlockOptions(district?.blocks || []);
  };

  const handleBlockChange = (blockId) => {
    const block = blockOptions.find((b) => b.id === blockId);

    setFilters((prev) => ({
      ...prev,
      blockId,
      blockName: block?.name || ''
    }));
  };

  const updateFiltersActive = () => {
    const hasActiveFilters =
      filters.sambhagId ||
      filters.districtId ||
      filters.blockId ||
      filters.userId ||
      filters.searchName ||
      filters.mobileNumber;

    setFiltersActive(hasActiveFilters);
  };

  const fetchTeachers = async (page = 0, currentFilters = filters) => {
    const validPage = Math.max(0, parseInt(page, 10) || 0);

    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.append('page', validPage);
      params.append('size', pageSize);

      if (currentFilters.sambhagId) params.append('sambhagId', currentFilters.sambhagId);
      if (currentFilters.districtId) params.append('districtId', currentFilters.districtId);
      if (currentFilters.blockId) params.append('blockId', currentFilters.blockId);
      if (currentFilters.userId) params.append('userId', currentFilters.userId);
      if (currentFilters.searchName) params.append('name', currentFilters.searchName);
      if (currentFilters.mobileNumber) params.append('mobile', currentFilters.mobileNumber);

      const response = await publicApi.get(`/users/filter?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      });

      if (thisRequestId !== requestIdRef.current) {
        return;
      }

      const {
        content,
        number,
        pageNumber,
        totalPages: pages,
        totalElements: total
      } = response.data;

      const actualPageNumber =
        number !== undefined ? number : pageNumber !== undefined ? pageNumber : validPage;

      const processedTeachers = content.map((teacher) => processTeacherData(teacher));

      setTeachers(processedTeachers);
      setCurrentPage(actualPageNumber);
      setTotalPages(pages || 0);
      setTotalElements(total || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }

      console.error('Error fetching teachers:', err);
      setError('शिक्षकों की सूची लोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLocationData();
    fetchTeachers(0, filters).then(() => {
      isInitialMount.current = false;
    });

    return () => {
      if (locationAbortControllerRef.current) {
        locationAbortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateFiltersActive();

    if (isInitialMount.current) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchTeachers(0, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.sambhagId,
    filters.districtId,
    filters.blockId,
    filters.userId,
    filters.searchName,
    filters.mobileNumber
  ]);

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

  const handlePageChange = (event, newPage) => {
    const pageNum = parseInt(newPage, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      console.error('Invalid page number:', newPage);
      return;
    }

    const pageIndex = pageNum - 1;
    fetchTeachers(pageIndex, filters);
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
  userId: selectedTeacher?.id,
  mobileNumber: selectedTeacher?.mobileNumber,
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

  const startRecord = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endRecord = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <Layout>
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          minHeight: '100vh',
          background: `
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.13), transparent 30%),
            radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #fbfaff 45%, #f5f3ff 100%)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            top: -170,
            left: -130,
            background: 'rgba(124, 58, 237, 0.10)',
            filter: 'blur(8px)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 310,
            height: 310,
            borderRadius: '50%',
            right: -120,
            bottom: -140,
            background: 'rgba(250, 204, 21, 0.16)',
            filter: 'blur(10px)'
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: { xs: '28px', md: '38px' },
              background:
                'linear-gradient(135deg, rgba(76,29,149,0.96), rgba(124,58,237,0.92))',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 30px 90px rgba(76, 29, 149, 0.22)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 7,
                background: `linear-gradient(90deg, ${theme.gold}, #ffffff, ${theme.gold})`
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                right: -110,
                bottom: -130,
                background: 'rgba(250, 204, 21, 0.14)'
              }
            }}
          >
            <CardContent
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
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
                  border: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                <GroupsRounded sx={{ fontSize: 38, color: theme.gold }} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 950,
                  mb: 1.3,
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                }}
              >
                Our Members
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 750,
                  color: 'rgba(255,255,255,0.90)',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                }}
              >
                PMUMS पंजीकृत शिक्षकों की संपूर्ण सूची
              </Typography>

              <Chip
                label={`कुल ${totalElements.toLocaleString('hi-IN')} शिक्षक पंजीकृत`}
                sx={{
                  mt: 2.5,
                  color: '#fff',
                  fontWeight: 900,
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.24)',
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                }}
              />
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: { xs: '24px', md: '32px' },
              background: 'rgba(255,255,255,0.84)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              boxShadow: '0 24px 70px rgba(76, 29, 149, 0.12)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 7,
                background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`
              }
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
                  mb: 2.5
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 950,
                      fontSize: { xs: '1.25rem', md: '1.45rem' },
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                    }}
                  >
                    खोज और फिल्टर
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.muted,
                      fontWeight: 650,
                      mt: 0.5,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                    }}
                  >
                    यूजर आईडी, नाम या मोबाइल नंबर से सदस्य खोजें।
                  </Typography>
                </Box>

                {filtersActive && (
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{
                      borderRadius: '14px',
                      px: 2.5,
                      fontWeight: 900,
                      textTransform: 'none',
                      color: theme.main,
                      borderColor: 'rgba(124, 58, 237, 0.35)',
                      '&:hover': {
                        borderColor: theme.main,
                        background: 'rgba(124, 58, 237, 0.06)'
                      }
                    }}
                  >
                    फिल्टर साफ़ करें
                  </Button>
                )}
              </Box>

              <Grid container spacing={2.5} alignItems="end">
                <Grid item xs={12} sm={4} md={4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                    }}
                  >
                    यूजर आईडी (User ID)
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="यूजर आईडी से खोजें"
                    value={filters.userId}
                    onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.main }} />
                        </InputAdornment>
                      )
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
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                    }}
                  >
                    नाम (Name)
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="नाम से खोजें"
                    value={filters.searchName}
                    onChange={(e) => setFilters((prev) => ({ ...prev, searchName: e.target.value }))}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.main }} />
                        </InputAdornment>
                      )
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
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                    }}
                  >
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
                      setFilters((prev) => ({ ...prev, mobileNumber: value }));
                    }}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: theme.main }} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              {filtersActive && (
                <Alert
                  severity="success"
                  icon={<Info />}
                  sx={{
                    mt: 2.5,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(22, 163, 74, 0.08)',
                    border: '1px solid rgba(22, 163, 74, 0.18)',
                    color: '#166534',
                    fontWeight: 750,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                  }}
                >
                  सर्वर-साइड फ़िल्टर सक्रिय है। कुल {totalElements.toLocaleString('hi-IN')} परिणाम मिले।
                </Alert>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mt: 2.5,
                  flexWrap: 'wrap'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.muted,
                    fontWeight: 750,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                  }}
                >
                  कुल <strong>{totalElements.toLocaleString('hi-IN')}</strong>{' '}
                  {filtersActive ? 'परिणाम' : 'शिक्षक पंजीकृत'}
                </Typography>

                {filtersActive && (
                  <Chip
                    label="फ़िल्टर सक्रिय"
                    size="small"
                    sx={{
                      color: theme.main,
                      fontWeight: 900,
                      background: theme.soft,
                      border: '1px solid rgba(124, 58, 237, 0.18)'
                    }}
                  />
                )}

                {showUtrColumns && (
                  <Chip
                    icon={<QrCode2Rounded />}
                    label="UTR Mode Active"
                    size="small"
                    sx={{
                      color: theme.dark,
                      fontWeight: 900,
                      background: theme.softGold,
                      border: '1px solid rgba(250, 204, 21, 0.35)'
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>

          {loading && (
            <Paper
              elevation={0}
              sx={{
                py: 6,
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                textAlign: 'center'
              }}
            >
              <CircularProgress sx={{ color: theme.main }} />
              <Typography
                sx={{
                  mt: 2,
                  color: theme.muted,
                  fontWeight: 800,
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                }}
              >
                डेटा लोड हो रहा है...
              </Typography>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '16px' }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <Card
              elevation={0}
              sx={{
                borderRadius: { xs: '24px', md: '32px' },
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                boxShadow: '0 28px 80px rgba(76, 29, 149, 0.13)',
                overflow: 'hidden'
              }}
            >
              <TableContainer sx={{ maxHeight: 'calc(100vh - 220px)' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        '& th': {
                          background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
                          color: 'white',
                          fontWeight: 950,
                          fontSize: '0.92rem',
                          whiteSpace: 'nowrap',
                          fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <TableCell align="center">पंजीकरण संख्या</TableCell>
                      <TableCell align="center">नाम</TableCell>
                      <TableCell align="center">विभाग</TableCell>
                      <TableCell align="center">राज्य</TableCell>
                      <TableCell align="center">संभाग</TableCell>
                      <TableCell align="center">जिला</TableCell>
                      <TableCell align="center">ब्लॉक</TableCell>
                      <TableCell align="center">स्कूल का नाम</TableCell>
                      <TableCell align="center">पंजीकरण तिथि</TableCell>
                      {showUtrColumns && <TableCell align="center">QR कोड</TableCell>}
                      {showUtrColumns && <TableCell align="center">UTR अपलोड</TableCell>}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {teachers.map((teacher) => {
                      const uploaded = teacher.utrUploaded;

                      return (
                        <TableRow
                          key={teacher.id}
                          sx={{
                            backgroundColor: showUtrColumns
                              ? uploaded
                                ? 'rgba(22, 163, 74, 0.08)'
                                : 'rgba(220, 38, 38, 0.07)'
                              : '#fff',
                            '&:nth-of-type(odd)': {
                              backgroundColor: showUtrColumns
                                ? uploaded
                                  ? 'rgba(22, 163, 74, 0.12)'
                                  : 'rgba(220, 38, 38, 0.10)'
                                : 'rgba(245, 243, 255, 0.38)'
                            },
                            '&:hover': {
                              backgroundColor: showUtrColumns
                                ? uploaded
                                  ? 'rgba(22, 163, 74, 0.16)'
                                  : 'rgba(220, 38, 38, 0.14)'
                                : 'rgba(245, 243, 255, 0.78)'
                            },
                            '& td': {
                              borderBottom: '1px solid rgba(124, 58, 237, 0.10)',
                              color: '#374151',
                              fontWeight: 650,
                              fontSize: '0.9rem',
                              fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                            }
                          }}
                        >
                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: '950 !important',
                              color: `${theme.main} !important`,
                              fontFamily: 'monospace !important'
                            }}
                          >
                            {teacher.id || 'N/A'}
                          </TableCell>

                          <TableCell align="center" sx={{ fontWeight: '850 !important', color: `${theme.dark} !important` }}>
                            {`${teacher.name || ''} ${teacher.surname || ''}`}
                          </TableCell>

                          <TableCell align="center">{teacher.department || 'शिक्षा विभाग'}</TableCell>
                          <TableCell align="center">{teacher.state || 'मध्य प्रदेश'}</TableCell>
                          <TableCell align="center">{teacher.sambhag || 'भोपाल संभाग'}</TableCell>
                          <TableCell align="center">{teacher.district || 'भोपाल'}</TableCell>
                          <TableCell align="center">{teacher.block || 'भोपाल'}</TableCell>
                          <TableCell align="center">{teacher.schoolOfficeName || 'शासकीय प्राथमिक विद्यालय'}</TableCell>
                          <TableCell align="center">{formatDate(teacher.createdAt || teacher.createdDate) || 'N/A'}</TableCell>

                          {showUtrColumns && (
                            <TableCell align="center">
                              {teacher.utrUploaded ? (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: theme.green,
                                    fontWeight: 900,
                                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                                  }}
                                >
                                  UTR जमा हो चुका है
                                </Typography>
                              ) : teacher.allocatedQrCode ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={getQrImageUrl(teacher.allocatedQrCode)}
                                    alt="Assigned QR"
                                    sx={{
                                      width: 74,
                                      height: 74,
                                      objectFit: 'contain',
                                      border: '1px solid rgba(124, 58, 237, 0.18)',
                                      borderRadius: '12px',
                                      background: '#fff',
                                      p: 0.7,
                                      boxShadow: '0 8px 22px rgba(76, 29, 149, 0.10)'
                                    }}
                                  />

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.muted,
                                      fontWeight: 750,
                                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                                    }}
                                  >
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
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1
                                  }}
                                >
                                  <Chip
                                    label="UTR Uploaded"
                                    size="small"
                                    sx={{
                                      color: '#166534',
                                      fontWeight: 900,
                                      background: 'rgba(22, 163, 74, 0.12)',
                                      border: '1px solid rgba(22, 163, 74, 0.22)'
                                    }}
                                  />

                                  {teacher.latestUtrNumber && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.green,
                                        fontWeight: 900,
                                        fontFamily: 'Poppins, Arial, sans-serif'
                                      }}
                                    >
                                      {teacher.latestUtrNumber}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<UploadFileRounded />}
                                  onClick={() => openUtrDialog(teacher)}
                                  sx={{
                                    background: `linear-gradient(135deg, ${theme.red}, #ef4444)`,
                                    boxShadow: '0 10px 22px rgba(220, 38, 38, 0.24)',
                                    '&:hover': {
                                      background: 'linear-gradient(135deg, #991b1b, #dc2626)',
                                      transform: 'translateY(-1px)'
                                    },
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 900
                                  }}
                                >
                                  UTR Upload
                                </Button>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
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
                    p: 3,
                    borderTop: '1px solid rgba(124, 58, 237, 0.12)',
                    background: 'rgba(245,243,255,0.45)'
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={handlePageChange}
                    size="large"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    disabled={loading}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '12px',
                        fontWeight: 800,
                        color: theme.text
                      },
                      '& .Mui-selected': {
                        background: `${theme.main} !important`,
                        color: '#fff',
                        boxShadow: '0 8px 20px rgba(124, 58, 237, 0.25)'
                      }
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.muted,
                      fontWeight: 800,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                    }}
                  >
                    पृष्ठ {(currentPage + 1).toLocaleString('hi-IN')} / {totalPages.toLocaleString('hi-IN')}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  textAlign: 'center',
                  p: 2.2,
                  borderTop: '1px solid rgba(124, 58, 237, 0.12)',
                  background: 'rgba(255,255,255,0.75)'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.muted,
                    fontWeight: 800,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
                  }}
                >
                  {`${startRecord.toLocaleString('hi-IN')} - ${endRecord.toLocaleString('hi-IN')} परिणाम (कुल ${totalElements.toLocaleString('hi-IN')} में से)`}
                </Typography>
              </Box>
            </Card>
          )}
        </Container>
      </Box>

     <Dialog
  open={utrDialogOpen}
  onClose={utrSubmitting ? undefined : closeUtrDialog}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: '28px',
      overflow: 'hidden',
      border: '1px solid rgba(124, 58, 237, 0.16)',
      boxShadow: '0 28px 80px rgba(76, 29, 149, 0.22)',
      background: 'rgba(255,255,255,0.96)',
      position: 'relative'
    }
  }}
>
  <DialogTitle
    sx={{
      p: 0,
      position: 'relative',
      background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
      color: '#fff',
      overflow: 'hidden'
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: -80,
        right: -80,
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'rgba(250, 204, 21, 0.16)'
      }}
    />

    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '22px',
          mx: 'auto',
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.16)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: theme.gold
        }}
      >
        <PaymentsRounded sx={{ fontSize: 36 }} />
      </Box>

      <Typography
        sx={{
          fontWeight: 950,
          fontSize: { xs: '1.25rem', md: '1.45rem' },
          fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
        }}
      >
        UTR विवरण जमा करें
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          color: 'rgba(255,255,255,0.86)',
          fontWeight: 650,
          fontSize: '0.92rem',
          fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
        }}
      >
        कृपया राशि, Reference Name और UTR Number सही भरें
      </Typography>
    </Box>

    <IconButton
      onClick={closeUtrDialog}
      disabled={utrSubmitting}
      sx={{
        position: 'absolute',
        right: 12,
        top: 12,
        color: '#fff',
        background: 'rgba(255,255,255,0.14)',
        zIndex: 2,
        '&:hover': {
          background: 'rgba(255,255,255,0.22)'
        }
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent
    sx={{
      marginTop:2,
      px: { xs: 2.5, md: 3.5 },
      py: { xs: 3, md: 3.5 },
      background: `
        radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.10), transparent 32%),
        linear-gradient(180deg, #ffffff 0%, #fbfaff 100%)
      `
    }}
  >
    {selectedTeacher && (
      <Paper
        elevation={0}
        sx={{
          mb: 2.5,
          p: 2,
          borderRadius: '18px',
          background:
            'linear-gradient(135deg, rgba(255,251,235,0.92), rgba(255,255,255,0.90))',
          border: '1px solid rgba(250, 204, 21, 0.35)'
        }}
      >
        <Chip
          label="Member Details"
          size="small"
          sx={{
            mb: 1.2,
            color: theme.dark,
            fontWeight: 900,
            background: '#fffbeb',
            border: '1px solid rgba(250, 204, 21, 0.35)',
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        />

        <Typography
          variant="body2"
          sx={{
            mb: 0.7,
            color: theme.muted,
            fontWeight: 750,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          <strong>यूजर:</strong> {selectedTeacher.name} {selectedTeacher.surname}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 0.7,
            color: theme.muted,
            fontWeight: 750,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          <strong>यूजर आईडी:</strong> {selectedTeacher.id || 'N/A'}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 0.7,
            color: theme.muted,
            fontWeight: 750,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          <strong>मोबाइल:</strong> {selectedTeacher.mobileNumber || 'N/A'}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.muted,
            fontWeight: 750,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          <strong>मृत्यु प्रकरण:</strong>{' '}
          {selectedTeacher.assignedDeathCaseName || 'N/A'}
        </Typography>
      </Paper>
    )}

    {error && (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: '16px',
          fontWeight: 700
        }}
      >
        {error}
      </Alert>
    )}

    <Grid container spacing={1.5}>
      <Grid item xs={12} sm={6}>
        <Typography
          variant="body2"
          sx={{
            color: theme.dark,
            fontWeight: 900,
            mb: 0.8,
            display: 'block',
            fontSize: '0.94rem',
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          राशि (₹) *
        </Typography>

        <TextField
          fullWidth
          type="number"
          value={utrForm.amount}
          onChange={(e) =>
            setUtrForm((prev) => ({ ...prev, amount: e.target.value }))
          }
          disabled={utrSubmitting}
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupeeRounded sx={{ color: theme.main }} />
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="body2"
          sx={{
            color: theme.dark,
            fontWeight: 900,
            mb: 0.8,
            display: 'block',
            fontSize: '0.94rem',
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          Reference Name *
        </Typography>

        <TextField
          fullWidth
          value={utrForm.referenceName}
          onChange={(e) =>
            setUtrForm((prev) => ({
              ...prev,
              referenceName: e.target.value
            }))
          }
          disabled={utrSubmitting}
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRounded sx={{ color: theme.main }} />
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="body2"
          sx={{
            color: theme.dark,
            fontWeight: 900,
            mb: 0.8,
            display: 'block',
            fontSize: '0.94rem',
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
          }}
        >
          UTR Number *
        </Typography>

        <TextField
          fullWidth
          value={utrForm.utrNumber}
          onChange={(e) =>
            setUtrForm((prev) => ({ ...prev, utrNumber: e.target.value }))
          }
          disabled={utrSubmitting}
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ReceiptLongRounded sx={{ color: theme.main }} />
              </InputAdornment>
            )
          }}
        />
      </Grid>
    </Grid>

    {utrSuccess && (
      <Alert
        severity="success"
        sx={{
          mt: 2.5,
          borderRadius: '16px',
          fontWeight: 700
        }}
      >
        {utrSuccess}
      </Alert>
    )}
  </DialogContent>

  <DialogActions
    sx={{
      px: { xs: 2.5, md: 3.5 },
      pb: 3,
      pt: 0,
      background: '#fbfaff'
    }}
  >
    <Button
      onClick={closeUtrDialog}
      disabled={utrSubmitting}
      sx={{
        color: theme.muted,
        fontWeight: 900,
        borderRadius: '14px',
        px: 2.5,
        textTransform: 'none',
        fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif'
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleUtrSubmit}
      disabled={utrSubmitting}
      sx={{
        borderRadius: '14px',
        px: 3,
        py: 1,
        fontWeight: 950,
        textTransform: 'none',
        fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
        background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
        boxShadow: '0 12px 28px rgba(109, 40, 217, 0.28)',
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
          transform: 'translateY(-1px)'
        },
        '&:disabled': {
          background: '#c4b5fd',
          color: '#fff'
        }
      }}
    >
      {utrSubmitting ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
          Submitting...
        </>
      ) : (
        <>
          <UploadFileRounded sx={{ mr: 1 }} />
          Submit UTR
        </>
      )}
    </Button>
  </DialogActions>
</Dialog>
    </Layout>
  );
};

export default TeachersList;