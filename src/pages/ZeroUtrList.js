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
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  Card,
  CardContent,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  BlockRounded,
  InfoRounded,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

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
  border: '#ded8f5',
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

const ZeroUtrList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    userId: '',
    fullName: '',
    mobileNumber: '',
    sambhag: '',
    district: '',
    block: '',
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const isInitialMount = useRef(true);

  const getDisplayValue = (value, fallback = 'N/A') => {
    return value && String(value).trim() !== '' ? value : fallback;
  };

  const hasActiveFilters = () => {
    return Boolean(
      filters.userId ||
      filters.fullName ||
      filters.mobileNumber ||
      filters.sambhag ||
      filters.district ||
      filters.block
    );
  };

  const fetchUsers = useCallback(async (pageNum = 0) => {
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

      const hasFilters =
        filters.userId ||
        filters.fullName ||
        filters.mobileNumber ||
        filters.sambhag ||
        filters.district ||
        filters.block;

      const endpoint = hasFilters
        ? '/admin/monthly-sahyog/no-utr-ever/search'
        : '/admin/monthly-sahyog/no-utr-ever';

      const response = await api.get(endpoint, {
        params: {
          page: pageNum,
          size: pageSize,
          ...(filters.userId && { userId: filters.userId }),
          ...(filters.fullName && { name: filters.fullName }),
          ...(filters.mobileNumber && { mobile: filters.mobileNumber }),
          ...(filters.sambhag && { sambhag: filters.sambhag }),
          ...(filters.district && { district: filters.district }),
          ...(filters.block && { block: filters.block }),
        },
        signal: abortControllerRef.current.signal,
      });

      if (thisRequestId !== requestIdRef.current) return;

      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setTotalPages(1);
        setTotalElements(response.data.length);
        setPage(0);
      } else {
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
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }

      console.error('Error fetching no UTR ever users:', err);
      setError('नो UTR सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      setUsers([]);
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
  ]);

  useEffect(() => {
    if (isInitialMount.current) return;

    const debounceTimer = setTimeout(() => {
      fetchUsers(0);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    fetchUsers,
    filters.userId,
    filters.fullName,
    filters.mobileNumber,
    filters.sambhag,
    filters.district,
    filters.block,
  ]);

  useEffect(() => {
    fetchUsers(0).then(() => {
      isInitialMount.current = false;
    });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchUsers]);

  const handlePageChange = (event, newPage) => {
    const pageNum = parseInt(newPage, 10);
    if (isNaN(pageNum) || pageNum < 1) return;

    fetchUsers(pageNum - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
boxShadow: '0 30px 90px rgba(34, 27, 67, 0.22)',    color: '#fff',
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
                <BlockRounded sx={{ fontSize: 38, color: '#ffffff' }} />
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1.3,
                  fontSize: { xs: '1.9rem', md: '3rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                नो UTR सूची
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
                जिन सदस्यों ने अभी तक एक भी UTR अपलोड नहीं किया है
              </Typography>

              <Chip
                label={`कुल ${totalElements.toLocaleString('hi-IN')} नो UTR रिकॉर्ड`}
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
                    यूजर आईडी, नाम, मोबाइल या स्थान के आधार पर नो UTR रिकॉर्ड खोजें।
                  </Typography>
                </Box>
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
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, mobileNumber: e.target.value }))
                    }
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
                    fontWeight: 750,
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
             backgroundColor: theme.softAccent,
border: '1px solid rgba(15, 118, 110, 0.18)',
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
                    fontWeight: 950,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  कोई सदस्य नहीं मिला
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
background: theme.dark,
fontWeight: 700,                            color: 'white',
                           
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
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow
                          key={user.id || index}
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
                          <TableCell sx={{ fontWeight: '700 !important', color: `${theme.dark} !important` }}>
                            {page * pageSize + index + 1}
                          </TableCell>

                          <TableCell sx={{ color: `${theme.dark} !important`, fontWeight: '700 !important' }}>
                            {getDisplayValue(user.registrationNumber || user.id)}
                          </TableCell>

                          <TableCell sx={{ fontWeight: '700 !important', color: `${theme.dark} !important` }}>
                            {getDisplayValue(
                              [user.name, user.surname].filter(Boolean).join(' ') || user.name
                            )}
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
                      flexDirection: { xs: 'column', md: 'row' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      px: 3,
                      py: 2.5,
                      borderTop: '1px solid rgba(124, 58, 237, 0.12)',
                      backgroundColor: 'rgba(245,243,255,0.45)',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.muted,
                        fontWeight: 800,
                        fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                      }}
                    >
                      Showing {startRecord.toLocaleString('hi-IN')} to {endRecord.toLocaleString('hi-IN')} of {totalElements.toLocaleString('hi-IN')} records
                    </Typography>

                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      shape="rounded"
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

export default ZeroUtrList;