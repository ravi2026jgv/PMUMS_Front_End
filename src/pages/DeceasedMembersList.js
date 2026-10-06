import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  GroupsRounded,
  InfoRounded,
  RestartAltRounded,
  SearchRounded,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { publicApi } from '../services/api';
import { usePortal } from '../portal/PortalContext';

const getTheme = (isTab2) =>
  isTab2
    ? {
        dark: '#083344',
        main: '#0891b2',
        soft: '#ecfeff',
        text: '#16323d',
        muted: '#526874',
        border: 'rgba(8,145,178,0.20)',
        hero: 'linear-gradient(135deg, #083344 0%, #0e7490 52%, #0891b2 100%)',
      }
    : {
        dark: '#221b43',
        main: '#6f5cc2',
        soft: '#f4f2fb',
        text: '#221b43',
        muted: '#667085',
        border: '#ded8f5',
        hero: 'linear-gradient(135deg, #221b43 0%, #30295c 48%, #6f5cc2 100%)',
      };

const DeceasedMembersList = () => {
  const { portalSlug } = usePortal();
  const isTab2 = portalSlug === 'tab2';
  const theme = useMemo(() => getTheme(isTab2), [isTab2]);

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

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px',
      background: '#ffffff',
      '& fieldset': { borderColor: theme.border },
      '&:hover fieldset': { borderColor: theme.main },
      '&.Mui-focused fieldset': { borderColor: theme.main, borderWidth: '2px' },
    },
  };

  const loadLocationHierarchy = useCallback(async () => {
    try {
      const response = await publicApi.get('/locations/hierarchy');
      const data = response?.data;
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
      console.error('Error loading locations for deceased members:', err);
      setLocationHierarchy([]);
      setSambhagOptions([]);
      setDistrictOptions([]);
      setBlockOptions([]);
    }
  }, []);

  useEffect(() => {
    loadLocationHierarchy();
  }, [loadLocationHierarchy]);

  const fetchUsers = useCallback(
    async (pageNum = 0, filterOverride = null) => {
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

        const response = await publicApi.get('/public/members/deceased', {
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
        console.error('Error fetching deceased members:', err);
        setUsers([]);
        setError('दिवंगत सदस्यों की सूची लोड करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [filters, pageSize],
  );

  useEffect(() => {
    fetchUsers(0);
    return () => abortControllerRef.current?.abort();
    // Initial load only. Filters are applied through the Search button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSambhagChange = (event) => {
    const sambhagId = event.target.value;
    const selected = locationHierarchy.find(
      (item) => String(item.id) === String(sambhagId),
    );

    setFilters((prev) => ({
      ...prev,
      sambhagId,
      districtId: '',
      blockId: '',
    }));
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

    setFilters((prev) => ({
      ...prev,
      districtId,
      blockId: '',
    }));
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

  const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <Box sx={{ py: { xs: 4, md: 6 }, background: theme.soft, minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Paper
            elevation={0}
            sx={{
              borderRadius: { xs: '22px', md: '30px' },
              overflow: 'hidden',
              border: `1px solid ${theme.border}`,
              background: '#ffffff',
              boxShadow: '0 24px 70px rgba(34, 27, 67, 0.10)',
            }}
          >
            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                background: theme.hero,
                color: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <GroupsRounded sx={{ fontSize: 38 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                  }}
                >
                  दिवंगत सदस्य
                </Typography>
              </Box>

              <Typography
                sx={{
                  opacity: 0.92,
                  maxWidth: 920,
                  fontWeight: 600,
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                कर्मचारी कल्याण कोष से जुड़े उन सम्मानित सदस्यों की सूची, जो अब हमारे बीच नहीं हैं।
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 2, md: 3.5 } }}>
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '18px',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <GroupsRounded sx={{ color: theme.main }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            कुल दिवंगत सदस्य
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: theme.dark }}>
                            {Number(totalElements || 0).toLocaleString('hi-IN')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={8}>
                  <Alert
                    icon={<InfoRounded />}
                    severity="info"
                    sx={{
                      height: '100%',
                      alignItems: 'center',
                      borderRadius: '18px',
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    इस सूची में केवल Member Status = Deceased वाले सदस्य प्रदर्शित होते हैं।
                  </Alert>
                </Grid>
              </Grid>

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: '18px',
                  background: theme.soft,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="नाम खोजें"
                      value={filters.name}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, name: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRounded fontSize="small" />
                          </InputAdornment>
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
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, userId: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      sx={inputSx}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select
                        displayEmpty
                        value={filters.sambhagId}
                        onChange={handleSambhagChange}
                      >
                        <MenuItem value="">सभी संभाग</MenuItem>
                        {sambhagOptions.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
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
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.25}>
                    <FormControl fullWidth size="small" sx={inputSx}>
                      <Select
                        displayEmpty
                        value={filters.blockId}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, blockId: e.target.value }))
                        }
                        disabled={!filters.districtId}
                      >
                        <MenuItem value="">सभी ब्लॉक</MenuItem>
                        {blockOptions.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<SearchRounded />}
                        onClick={handleSearch}
                        disabled={loading}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          background: theme.main,
                          '&:hover': { background: theme.dark },
                        }}
                      >
                        खोजें
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<RestartAltRounded />}
                        onClick={handleReset}
                        disabled={loading}
                        sx={{
                          borderRadius: '12px',
                          px: 3,
                          borderColor: theme.main,
                          color: theme.main,
                        }}
                      >
                        रीसेट
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '14px' }}>
                  {error}
                </Alert>
              )}

              {loading ? (
                <Box
                  sx={{
                    minHeight: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress sx={{ color: theme.main }} />
                </Box>
              ) : users.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: '14px' }}>
                  कोई दिवंगत सदस्य नहीं मिला।
                </Alert>
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: '18px',
                    overflowX: 'auto',
                  }}
                >
                  <Table sx={{ minWidth: isTab2 ? 1220 : 1120 }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& th': {
                            background: theme.dark,
                            color: '#ffffff',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <TableCell>क्र.सं.</TableCell>
                        <TableCell>पंजीयन क्रमांक</TableCell>
                        <TableCell>नाम</TableCell>
                        {isTab2 && <TableCell>कर्मचारी की श्रेणी</TableCell>}
                        <TableCell>विभाग</TableCell>
                        <TableCell>राज्य</TableCell>
                        <TableCell>संभाग</TableCell>
                        <TableCell>जिला</TableCell>
                        <TableCell>ब्लॉक</TableCell>
                        <TableCell>
                          {isTab2 ? 'पदस्थ कार्यालय का नाम' : 'स्कूल का नाम'}
                        </TableCell>
                        <TableCell>पंजीयन दिनांक</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={user.id || index} hover>
                          <TableCell sx={{ fontWeight: 800, color: theme.main }}>
                            {page * pageSize + index + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>
                            {user.registrationNumber || user.id || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ minWidth: 180 }}>
                            <Typography sx={{ fontWeight: 800, color: theme.dark }}>
                              {fullName(user)}
                            </Typography>
                          </TableCell>
                          {isTab2 && (
                            <TableCell>{user.employeeCategory || 'N/A'}</TableCell>
                          )}
                          <TableCell>{user.department || 'N/A'}</TableCell>
                          <TableCell>{user.state || user.departmentState || 'N/A'}</TableCell>
                          <TableCell>{user.sambhag || user.departmentSambhag || 'N/A'}</TableCell>
                          <TableCell>{user.district || user.departmentDistrict || 'N/A'}</TableCell>
                          <TableCell>{user.block || user.departmentBlock || 'N/A'}</TableCell>
                          <TableCell sx={{ minWidth: 190 }}>
                            {user.schoolOfficeName || user.schoolName || 'N/A'}
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                    onChange={(_, value) => {
                      const nextPage = value - 1;
                      setPage(nextPage);
                      fetchUsers(nextPage);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: `${theme.main} !important`,
                        color: '#ffffff',
                      },
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

export default DeceasedMembersList;
