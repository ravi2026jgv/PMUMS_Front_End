import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
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
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Cancel,
  Search,
  FileDownloadRounded,
  VolunteerActivismRounded,
  InfoRounded,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';

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
  red: '#dc2626',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.92)',
    transition: 'all 0.25s ease',
    '& fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.18)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.40)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    fontWeight: 650,
    color: theme.text,
  },
};

const SahyogList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  const [filters, setFilters] = useState({
    userId: '',
    fullName: '',
    mobileNumber: '',
    sambhag: '',
    district: '',
    block: '',
    beneficiaryId: '',
  });

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const isInitialMount = useRef(true);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      const response = await publicApi.get('/admin/monthly-sahyog/donors/beneficiaries-all');
      setBeneficiaryOptions(response.data || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setBeneficiaryOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

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

  const fetchDonors = useCallback(async (pageNum = 0) => {
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

      const response = await publicApi.get('/admin/monthly-sahyog/donors/search-by-beneficiary', {
        params: {
          page: pageNum,
          size: pageSize,
          ...(filters.userId && { userId: filters.userId }),
          ...(filters.fullName && { name: filters.fullName }),
          ...(filters.mobileNumber && { mobile: filters.mobileNumber }),
          ...(filters.sambhag && { sambhag: filters.sambhag }),
          ...(filters.district && { district: filters.district }),
          ...(filters.block && { block: filters.block }),
          ...(filters.beneficiaryId && { beneficiaryId: filters.beneficiaryId }),
        },
        signal: abortControllerRef.current.signal,
      });

      if (thisRequestId !== requestIdRef.current) {
        return;
      }

      const {
        content,
        number,
        pageNumber,
        totalPages: pages,
        totalElements: total,
      } = response.data;

      const actualPageNumber =
        number !== undefined ? number : pageNumber !== undefined ? pageNumber : pageNum;

      setDonors(content || []);
      setPage(actualPageNumber);
      setTotalPages(pages || 1);
      setTotalElements(total || 0);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }

      console.error('Error fetching donors:', err);
      setError('सहयोग सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setDonors([]);
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
    filters.beneficiaryId,
  ]);

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchDonors(0);
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [
    fetchDonors,
    filters.userId,
    filters.fullName,
    filters.mobileNumber,
    filters.sambhag,
    filters.district,
    filters.block,
    filters.beneficiaryId,
  ]);

  useEffect(() => {
    fetchDonors(0).then(() => {
      isInitialMount.current = false;
    });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (event, newPage) => {
    const pageNum = parseInt(newPage, 10);
    if (isNaN(pageNum) || pageNum < 1) return;

    fetchDonors(pageNum - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <Chip
            icon={<CheckCircle />}
            label="भुगतान किया (Paid)"
            size="small"
            sx={{
              color: '#166534',
              fontWeight: 900,
              background: 'rgba(22, 163, 74, 0.12)',
              border: '1px solid rgba(22, 163, 74, 0.22)',
            }}
          />
        );

      case 'PARTIAL':
        return (
          <Chip
            icon={<Warning />}
            label="आंशिक भुगतान (Partial)"
            size="small"
            sx={{
              color: '#92400e',
              fontWeight: 900,
              background: 'rgba(250, 204, 21, 0.16)',
              border: '1px solid rgba(250, 204, 21, 0.35)',
            }}
          />
        );

      case 'UNPAID':
      default:
        return (
          <Chip
            icon={<Cancel />}
            label="अभुगतान (Unpaid)"
            size="small"
            sx={{
              color: '#991b1b',
              fontWeight: 900,
              background: 'rgba(220, 38, 38, 0.10)',
              border: '1px solid rgba(220, 38, 38, 0.20)',
            }}
          />
        );
    }
  };

  const startRecord = totalElements === 0 ? 0 : page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

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

  const handleExportSahyog = async () => {
    try {
      const response = await publicApi.get('/public/export/sahyog/by-beneficiary', {
        params: {
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

      downloadBlobFile(response.data, 'sahyog_list.csv');
    } catch (err) {
      console.error('Error exporting sahyog list:', err);
      setError('सहयोग सूची एक्सपोर्ट करने में त्रुटि हुई।');
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'N/A';

    return (
      <>
        {new Date(dateValue).toLocaleDateString('hi-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
        <br />
        <span style={{ fontSize: '0.8rem', color: theme.muted }}>
          {new Date(dateValue).toLocaleTimeString('hi-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </span>
      </>
    );
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 6, md: 8 },
          background: `
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.13), transparent 30%),
            radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #fbfaff 45%, #f5f3ff 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
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
            filter: 'blur(8px)',
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
            filter: 'blur(10px)',
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
                background: `linear-gradient(90deg, ${theme.gold}, #ffffff, ${theme.gold})`,
              },

              '&::after': {
                content: '""',
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                right: -110,
                bottom: -130,
                background: 'rgba(250, 204, 21, 0.14)',
              },
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
                <VolunteerActivismRounded sx={{ fontSize: 38, color: theme.gold }} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 950,
                  mb: 1.3,
                  fontSize: { xs: '1.9rem', md: '3rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                सहयोग सूची
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 750,
                  color: 'rgba(255,255,255,0.90)',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                सदस्यों के सहयोग की स्थिति देखें
              </Typography>

              <Chip
                label={`कुल ${totalElements.toLocaleString('hi-IN')} सहयोग रिकॉर्ड`}
                sx={{
                  mt: 2.5,
                  color: '#fff',
                  fontWeight: 900,
                  background: 'rgba(255,255,255,0.16)',
                  border: '1px solid rgba(255,255,255,0.24)',
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              />
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
                background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
              },
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
                      fontWeight: 950,
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
                    यूजर आईडी, नाम, मोबाइल, स्थान या लाभार्थी के आधार पर सहयोग रिकॉर्ड खोजें।
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleExportSahyog}
                  startIcon={<FileDownloadRounded />}
                  sx={{
                    borderRadius: '14px',
                    px: 2.8,
                    py: 1,
                    fontWeight: 950,
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                    boxShadow: '0 12px 28px rgba(109, 40, 217, 0.28)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {hasActiveFilters() ? 'Export With Filter' : 'Export All'}
                </Button>
              </Box>

              <Grid container spacing={2.5} alignItems="end">
                <Grid item xs={12} sm={4} md={2.4}>
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
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

                <Grid item xs={12} sm={4} md={2.4}>
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, fullName: e.target.value }))}
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

                <Grid item xs={12} sm={4} md={2.4}>
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
                    onChange={(e) => setFilters((prev) => ({ ...prev, mobileNumber: e.target.value }))}
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

                <Grid item xs={12} sm={4} md={2.4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
                    संभाग (Sambhag)
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="संभाग दर्ज करें"
                    value={filters.sambhag}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sambhag: e.target.value }))}
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

                <Grid item xs={12} sm={4} md={2.4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
                    जिला (District)
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="जिला दर्ज करें"
                    value={filters.district}
                    onChange={(e) => setFilters((prev) => ({ ...prev, district: e.target.value }))}
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

                <Grid item xs={12} sm={4} md={2.4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
                    ब्लॉक (Block)
                  </Typography>

                  <TextField
                    fullWidth
                    placeholder="ब्लॉक दर्ज करें"
                    value={filters.block}
                    onChange={(e) => setFilters((prev) => ({ ...prev, block: e.target.value }))}
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

                <Grid item xs={12} sm={4} md={2.4}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: theme.dark,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                    }}
                  >
                    लाभार्थी (Beneficiary)
                  </Typography>

                  <FormControl fullWidth size="small">
                    <Select
                      value={filters.beneficiaryId}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, beneficiaryId: e.target.value }))
                      }
                      displayEmpty
                      sx={inputSx}
                    >
                      <MenuItem value="">सभी लाभार्थी</MenuItem>

                      {beneficiaryOptions.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {hasActiveFilters() && (
                <Alert
                  severity="info"
                  icon={<InfoRounded />}
                  sx={{
                    mt: 2.5,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(124, 58, 237, 0.08)',
                    border: '1px solid rgba(124, 58, 237, 0.16)',
                    color: theme.text,
                    fontWeight: 750,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  फिल्टर सक्रिय है। कुल {totalElements.toLocaleString('hi-IN')} परिणाम मिले।
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              borderRadius: { xs: '24px', md: '32px' },
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              boxShadow: '0 28px 80px rgba(76, 29, 149, 0.13)',
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
            ) : donors.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.dark,
                    fontWeight: 900,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  आपका सहयोग नहीं हुआ
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
                            background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
                            color: 'white',
                            fontWeight: 950,
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
                        <TableCell>स्कूल का नाम</TableCell>
                        <TableCell>लाभार्थी</TableCell>
                        <TableCell>रसीद अपलोड दिनांक</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {donors.map((donor, index) => (
                        <TableRow
                          key={donor.registrationNumber || index}
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
                          <TableCell sx={{ fontWeight: '900 !important', color: `${theme.main} !important` }}>
                            {page * pageSize + index + 1}
                          </TableCell>

                          <TableCell sx={{ color: `${theme.main} !important`, fontWeight: '900 !important' }}>
                            {donor.registrationNumber || 'N/A'}
                          </TableCell>

                          <TableCell sx={{ fontWeight: '900 !important', color: `${theme.dark} !important` }}>
                            {donor.name || 'N/A'}
                          </TableCell>

                          <TableCell>{donor.department || 'N/A'}</TableCell>
                          <TableCell>{donor.state || 'N/A'}</TableCell>
                          <TableCell>{donor.sambhag || 'N/A'}</TableCell>
                          <TableCell>{donor.district || 'N/A'}</TableCell>
                          <TableCell>{donor.block || 'N/A'}</TableCell>
                          <TableCell>{donor.schoolName || 'N/A'}</TableCell>

                          <TableCell sx={{ fontWeight: '900 !important', color: `${theme.green} !important` }}>
                            {donor.beneficiary || 'N/A'}
                          </TableCell>

                          <TableCell>{formatDateTime(donor.receiptUploadDate)}</TableCell>
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
                      दिखाया जा रहा {startRecord.toLocaleString('hi-IN')} - {endRecord.toLocaleString('hi-IN')} कुल {totalElements.toLocaleString('hi-IN')} में से
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

export default SahyogList;