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
  Pagination,
  TextField,
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import api from '../services/api';

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

  const [page, setPage] = useState(0); // API is 0-indexed
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const isInitialMount = useRef(true);

  const getDisplayValue = (value, fallback = 'N/A') => {
    return value && String(value).trim() !== '' ? value : fallback;
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
          background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Paper
            elevation={10}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              color: 'white',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}
            >
              नो UTR सूची (No UTR List)
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 1, opacity: 0.9 }}>
              जिन सदस्यों ने अभी तक एक भी UTR अपलोड नहीं किया है
            </Typography>
          </Paper>

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
                  onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #d32f2f',
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
                  onChange={(e) => setFilters((prev) => ({ ...prev, fullName: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #d32f2f',
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
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mobileNumber: e.target.value }))
                  }
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                    },
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
                  onChange={(e) => setFilters((prev) => ({ ...prev, sambhag: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                    },
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
                  onChange={(e) => setFilters((prev) => ({ ...prev, district: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                    },
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
                  onChange={(e) => setFilters((prev) => ({ ...prev, block: e.target.value }))}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: '2px solid #d32f2f',
                      borderRadius: '8px',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={50} color="error" />
                <Typography sx={{ ml: 2 }}>लोड हो रहा है...</Typography>
              </Box>
            ) : users.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                  कोई सदस्य नहीं मिला
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
                      {users.map((user, index) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            '&:hover': { backgroundColor: '#ffebee' },
                            transition: 'background-color 0.2s',
                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#fff8f8',
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>
                            {page * pageSize + index + 1}
                          </TableCell>
                          <TableCell sx={{ color: '#d32f2f', fontWeight: 500 }}>
                            {getDisplayValue(user.registrationNumber || user.id)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {getDisplayValue(
                              [user.name, user.surname].filter(Boolean).join(' ') || user.name
                            )}
                          </TableCell>
                          <TableCell>{getDisplayValue(user.department)}</TableCell>
                          <TableCell>{getDisplayValue(user.state || user.departmentState)}</TableCell>
                          <TableCell>
                            {getDisplayValue(user.sambhag || user.departmentSambhag)}
                          </TableCell>
                          <TableCell>
                            {getDisplayValue(user.district || user.departmentDistrict)}
                          </TableCell>
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
                      flexDirection: { xs: 'column', md: 'row' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      px: 3,
                      py: 2.5,
                      borderTop: '1px solid #eee',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                      Showing {startRecord} to {endRecord} of {totalElements} records
                    </Typography>

                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      color="error"
                      shape="rounded"
                      showFirstButton
                      showLastButton
                    />
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

export default ZeroUtrList;