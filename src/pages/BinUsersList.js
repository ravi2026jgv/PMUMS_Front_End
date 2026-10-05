import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArchiveRounded,
  CurrencyRupeeRounded,
  GroupsRounded,
  RestartAltRounded,
  SearchRounded,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  soft: '#f4f2fb',
  text: '#221b43',
  muted: '#667085',
  border: '#ded8f5',
  green: '#0f766e',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: '#ffffff',
    '& fieldset': { borderColor: 'rgba(111, 92, 194, 0.22)' },
    '&:hover fieldset': { borderColor: 'rgba(111, 92, 194, 0.48)' },
    '&.Mui-focused fieldset': { borderColor: theme.main, borderWidth: '2px' },
  },
};

const moneyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const BinUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [sambhagOptions, setSambhagOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);

  const [filters, setFilters] = useState({
    name: '',
    userId: '',
    sambhagId: '',
    districtId: '',
    blockId: '',
  });

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadLocationHierarchy = useCallback(async () => {
    try {
      const response = await publicApi.get('/locations/hierarchy');
      const data = response?.data;

      // This project has had two hierarchy response shapes over time.
      const sambhags = Array.isArray(data)
        ? data
        : Array.isArray(data?.states?.[0]?.sambhags)
          ? data.states[0].sambhags
          : [];

      setLocationHierarchy(sambhags);
      setSambhagOptions(sambhags);
      setDistrictOptions([]);
      setBlockOptions([]);
    } catch (err) {
      console.error('Error loading locations for bin users:', err);
      setLocationHierarchy([]);
      setSambhagOptions([]);
      setDistrictOptions([]);
      setBlockOptions([]);
    }
  }, []);

  useEffect(() => {
    loadLocationHierarchy();
  }, [loadLocationHierarchy]);

  const fetchUsers = useCallback(async (pageNum = 0, filterOverride = null) => {
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');
      const activeFilters = filterOverride || filters;

      const response = await publicApi.get('/public/bin-users', {
        params: {
          page: pageNum,
          size: pageSize,
          ...(activeFilters.name && { name: activeFilters.name.trim() }),
          ...(activeFilters.userId && { userId: activeFilters.userId.trim() }),
          ...(activeFilters.sambhagId && { sambhagId: activeFilters.sambhagId }),
          ...(activeFilters.districtId && { districtId: activeFilters.districtId }),
          ...(activeFilters.blockId && { blockId: activeFilters.blockId }),
        },
        signal: abortControllerRef.current.signal,
      });

      if (thisRequestId !== requestIdRef.current) return;

      const result = response?.data || {};
      setUsers(Array.isArray(result.content) ? result.content : []);
      setPage(result.page ?? result.number ?? pageNum);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
    } catch (err) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
      console.error('Error fetching public bin users:', err);
      setUsers([]);
      setError('बिन उपयोगकर्ताओं की सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      if (thisRequestId === requestIdRef.current) setLoading(false);
    }
  }, [filters, pageSize]);

  useEffect(() => {
    fetchUsers(0);
    return () => abortControllerRef.current?.abort();
  }, []); // Initial load only; Search button applies filters.

  const handleSambhagChange = (event) => {
    const sambhagId = event.target.value;
    const selected = locationHierarchy.find((item) => String(item.id) === String(sambhagId));
    setFilters((prev) => ({ ...prev, sambhagId, districtId: '', blockId: '' }));
    setDistrictOptions(selected?.districts || []);
    setBlockOptions([]);
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(filters.sambhagId),
    );
    const selectedDistrict = selectedSambhag?.districts?.find(
      (item) => String(item.id) === String(districtId),
    );
    setFilters((prev) => ({ ...prev, districtId, blockId: '' }));
    setBlockOptions(selectedDistrict?.blocks || []);
  };

  const handleSearch = () => {
    setPage(0);
    fetchUsers(0);
  };

  const handleReset = () => {
    const emptyFilters = {
      name: '',
      userId: '',
      sambhagId: '',
      districtId: '',
      blockId: '',
    };
    setFilters(emptyFilters);
    setDistrictOptions([]);
    setBlockOptions([]);
    setPage(0);
    fetchUsers(0, emptyFilters);
  };

  const fullName = (user) =>
    [user?.name, user?.surname].filter(Boolean).join(' ').trim() || 'N/A';

  return (
    <Layout>
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          <Paper
            elevation={0}
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: `1px solid ${theme.border}`,
              background: '#ffffff',
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                background: 'linear-gradient(135deg, #221b43 0%, #6f5cc2 100%)',
                color: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <ArchiveRounded sx={{ fontSize: 34 }} />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  BIN USERS
                </Typography>
              </Box>
              <Typography sx={{ opacity: 0.92, maxWidth: 900 }}>
                बिन में स्थानांतरित सदस्यों की सार्वजनिक सूची और उनका कुल सत्यापित सहयोग।
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.border}`, borderRadius: '18px' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <GroupsRounded color="primary" />
                        <Box>
                          <Typography variant="caption" color="text.secondary">कुल बिन सदस्य</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>{totalElements}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.border}`, borderRadius: '18px' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <CurrencyRupeeRounded sx={{ color: theme.green }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">इस पेज का सत्यापित सहयोग</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {moneyFormatter.format(users.reduce((sum, item) => sum + Number(item.totalSahyog || 0), 0))}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.border}`, borderRadius: '18px' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <ArchiveRounded sx={{ color: theme.main }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">इस पेज की सत्यापित सहयोग प्रविष्टियाँ</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {users.reduce((sum, item) => sum + Number(item.sahyogCount || 0), 0).toLocaleString('en-IN')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: '18px', background: theme.soft }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="नाम खोजें"
                      value={filters.name}
                      onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      size="small"
                      label="पंजीयन क्रमांक"
                      value={filters.userId}
                      onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      sx={inputSx}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select displayEmpty value={filters.sambhagId} onChange={handleSambhagChange}>
                        <MenuItem value="">सभी संभाग</MenuItem>
                        {sambhagOptions.map((item) => (
                          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.25}>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select
                        displayEmpty
                        value={filters.districtId}
                        onChange={handleDistrictChange}
                        disabled={!filters.sambhagId}
                      >
                        <MenuItem value="">सभी जिले</MenuItem>
                        {districtOptions.map((item) => (
                          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.25}>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select
                        displayEmpty
                        value={filters.blockId}
                        onChange={(e) => setFilters((prev) => ({ ...prev, blockId: e.target.value }))}
                        disabled={!filters.districtId}
                      >
                        <MenuItem value="">सभी ब्लॉक</MenuItem>
                        {blockOptions.map((item) => (
                          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Button variant="contained" startIcon={<SearchRounded />} onClick={handleSearch} sx={{ borderRadius: '12px', px: 3 }}>
                        खोजें
                      </Button>
                      <Button variant="outlined" startIcon={<RestartAltRounded />} onClick={handleReset} sx={{ borderRadius: '12px', px: 3 }}>
                        रीसेट
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {loading ? (
                <Box sx={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : users.length === 0 ? (
                <Alert severity="info">कोई बिन उपयोगकर्ता नहीं मिला।</Alert>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.border}`, borderRadius: '18px' }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: theme.soft }}>
                        <TableCell sx={{ fontWeight: 800 }}>पंजीयन क्रमांक</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>नाम</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>विभाग / कार्यालय</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>संभाग / जिला / ब्लॉक</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800 }}>सहयोग संख्या</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>कुल सहयोग</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{user.registrationNumber || user.id}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 700 }}>{fullName(user)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.department || 'N/A'}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.schoolOfficeName || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.departmentSambhag || 'N/A'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {[user.departmentDistrict, user.departmentBlock].filter(Boolean).join(' / ') || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography sx={{ fontWeight: 800, color: theme.main }}>
                              {Number(user.sahyogCount || 0).toLocaleString('en-IN')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              सत्यापित सहयोग
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 800, color: theme.green }}>
                              {moneyFormatter.format(Number(user.totalSahyog || 0))}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {!loading && totalPages > 1 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    color="primary"
                    onChange={(_, value) => {
                      const nextPage = value - 1;
                      setPage(nextPage);
                      fetchUsers(nextPage);
                    }}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default BinUsersList;
