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
  Dialog,
DialogTitle,
DialogContent,
DialogActions,
IconButton,
Stack,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Cancel,
  Search,
  FileDownloadRounded,
  VolunteerActivismRounded,
  InfoRounded,
  EditRounded,
DeleteRounded,
CloseRounded,
SaveRounded,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { adminAPI, publicApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { isAdminOrSuperAdmin } from '../utils/roleUtils';

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
const OPEN_DEATH_CASES_VALUE = 'OPEN_DEATH_CASES';
const DEFAULT_FILTERS = {
  userId: '',
  fullName: '',
  mobileNumber: '',
  sambhag: '',
  district: '',
  block: '',
  beneficiaryId: OPEN_DEATH_CASES_VALUE,
};
const SahyogList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
const { user } = useAuth();
const isAdminUser = isAdminOrSuperAdmin(user);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

const [filters, setFilters] = useState(DEFAULT_FILTERS);

const [editDialogOpen, setEditDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedDonor, setSelectedDonor] = useState(null);
const [actionLoading, setActionLoading] = useState(false);

const [editForm, setEditForm] = useState({
  amount: '',
  paymentDate: '',
  referenceName: '',
  utrNumber: '',
  deathCaseId: '',
});
const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const isInitialMount = useRef(true);

  const fetchBeneficiaries = useCallback(async () => {
    try {
// OLD
// const response = await publicApi.get('/admin/monthly-sahyog/donors/beneficiaries-all');

// NEW
const response = await publicApi.get('/public/monthly-sahyog/donors/beneficiaries-all');      setBeneficiaryOptions(response.data || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
      setBeneficiaryOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';

  try {
    return new Date(dateValue).toISOString().split('T')[0];
  } catch {
    return '';
  }
};

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

const fetchDonors = useCallback(async (pageNum = 0, filtersOverride = null) => {    if (isFetchingRef.current) return;
isFetchingRef.current = true;
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');
const activeFilters = filtersOverride || filters;
// OLD
// const response = await publicApi.get('/admin/monthly-sahyog/donors/search-by-beneficiary', {

// NEW
const response = await publicApi.get('/public/monthly-sahyog/donors/search-by-beneficiary', {
       params: {
  page: pageNum,
  size: pageSize,
  ...(activeFilters.userId && { userId: activeFilters.userId }),
  ...(activeFilters.fullName && { name: activeFilters.fullName }),
  ...(activeFilters.mobileNumber && { mobile: activeFilters.mobileNumber }),
  ...(activeFilters.sambhag && { sambhag: activeFilters.sambhag }),
  ...(activeFilters.district && { district: activeFilters.district }),
  ...(activeFilters.block && { block: activeFilters.block }),
  ...(activeFilters.beneficiaryId &&
    activeFilters.beneficiaryId !== OPEN_DEATH_CASES_VALUE && {
      beneficiaryId: activeFilters.beneficiaryId,
    }),
  ...(activeFilters.beneficiaryId === OPEN_DEATH_CASES_VALUE && {
    openOnly: true,
  }),
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
      isFetchingRef.current = false;
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

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     return;
  //   }

  //   const debounceTimer = setTimeout(() => {
  //     fetchDonors(0);
  //   }, 300);

  //   return () => {
  //     clearTimeout(debounceTimer);
  //   };
  // }, [
  //   fetchDonors,
  //   filters.userId,
  //   filters.fullName,
  //   filters.mobileNumber,
  //   filters.sambhag,
  //   filters.district,
  //   filters.block,
  //   filters.beneficiaryId,
  // ]);

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
const handleOpenEditDialog = (donor) => {
  setSelectedDonor(donor);

  setEditForm({
  amount: donor.amount ?? '',
  paymentDate: formatDateForInput(donor.paymentDate || donor.receiptUploadDate),
  referenceName: donor.referenceName || '',
  utrNumber: donor.utrNumber || '',
  deathCaseId: donor.deathCaseId || '',
});

  setEditDialogOpen(true);
};

const handleCloseEditDialog = () => {
  if (actionLoading) return;

  setEditDialogOpen(false);
  setSelectedDonor(null);
  setEditForm({
  amount: '',
  paymentDate: '',
  referenceName: '',
  utrNumber: '',
  deathCaseId: '',
});
};

const handleEditFormChange = (field, value) => {
  setEditForm((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleUpdateSahyogReceipt = async () => {
  if (!selectedDonor?.receiptId) {
    setError('Receipt ID नहीं मिला। कृपया backend response जांचें।');
    return;
  }

  const cleanUtrNumber = editForm.utrNumber?.trim();

  if (!cleanUtrNumber) {
    setError('कृपया UTR Number भरें।');
    return;
  }

  try {
    setActionLoading(true);
    setError('');

    const payload = {
      amount: editForm.amount !== '' ? Number(editForm.amount) : null,
      paymentDate: editForm.paymentDate || null,
      referenceName: editForm.referenceName?.trim() || null,
      utrNumber: cleanUtrNumber,
      deathCaseId: editForm.deathCaseId ? Number(editForm.deathCaseId) : null,
    };

    await adminAPI.updateSahyogReceipt(selectedDonor.receiptId, payload);

    handleCloseEditDialog();
    fetchDonors(page);
  } catch (err) {
    console.error('Error updating sahyog receipt:', err);
    setError(
      err.response?.data?.message ||
        'सहयोग रिकॉर्ड अपडेट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
    );
  } finally {
    setActionLoading(false);
  }
};

const handleOpenDeleteDialog = (donor) => {
  setSelectedDonor(donor);
  setDeleteDialogOpen(true);
};

const handleCloseDeleteDialog = () => {
  if (actionLoading) return;

  setDeleteDialogOpen(false);
  setSelectedDonor(null);
};

const handleDeleteSahyogReceipt = async () => {
  if (!selectedDonor?.receiptId) {
    setError('Receipt ID नहीं मिला। कृपया backend response जांचें।');
    return;
  }

  try {
    setActionLoading(true);
    setError('');

    await adminAPI.deleteSahyogReceipt(selectedDonor.receiptId);

    handleCloseDeleteDialog();
    fetchDonors(page);
  } catch (err) {
    console.error('Error deleting sahyog receipt:', err);
    setError(
      err.response?.data?.message ||
        'सहयोग रिकॉर्ड हटाने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
    );
  } finally {
    setActionLoading(false);
  }
};

const handleSearch = () => {
  setPage(0);
  fetchDonors(0);
};

const handleClearFilters = () => {
  setFilters(DEFAULT_FILTERS);
  setPage(0);
  fetchDonors(0, DEFAULT_FILTERS);
};

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
...(filters.beneficiaryId &&
  filters.beneficiaryId !== OPEN_DEATH_CASES_VALUE && {
    beneficiaryId: filters.beneficiaryId,
  }),
...(filters.beneficiaryId === OPEN_DEATH_CASES_VALUE && {
  openOnly: true,
}),
        },
        responseType: 'blob',
      });

      downloadBlobFile(response.data, 'sahyog_list.csv');
    } catch (err) {
      console.error('Error exporting sahyog list:', err);
      setError('सहयोग सूची एक्सपोर्ट करने में त्रुटि हुई।');
    }
  };

const formatDateTime = (dateValue, showTime = true) => {
  if (!dateValue) return 'N/A';

  const value = String(dateValue);

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/
  );

  if (!match) {
    const fallbackDate = new Date(dateValue);

    if (Number.isNaN(fallbackDate.getTime())) return 'N/A';

    return (
      <>
        {fallbackDate.toLocaleDateString('hi-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}

        {showTime && (
          <>
            <br />
            <span style={{ fontSize: '0.8rem', color: theme.muted }}>
              {fallbackDate.toLocaleTimeString('hi-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </>
        )}
      </>
    );
  }

  const [, year, month, day, hour, minute] = match;

  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);

  const ampm = hourNumber >= 12 ? 'pm' : 'am';
  const displayHour = hourNumber % 12 || 12;

const second = match[6] || '00';

const formattedTime = `${String(displayHour).padStart(2, '0')}:${String(
  minuteNumber
).padStart(2, '0')}:${String(second).padStart(2, '0')} ${ampm}`;

  return (
    <>
      {`${day}/${month}/${year}`}

      {showTime && (
        <>
          <br />
          <span style={{ fontSize: '0.8rem', color: theme.muted }}>
            {formattedTime}
          </span>
        </>
      )}
    </>
  );
};
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
<VolunteerActivismRounded sx={{ fontSize: 38, color: '#ffffff' }} />              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
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
                  fontWeight: 600,
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
                  fontWeight: 700,
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
                    background: '#0f7633',
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
                   <MenuItem value={OPEN_DEATH_CASES_VALUE}>
  सभी चालू सहायता केस
</MenuItem>

<MenuItem value="">
  सभी लाभार्थी
</MenuItem>




{beneficiaryOptions.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Box sx={{ mt: 2.5, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
  <Button
    variant="contained"
    startIcon={<Search />}
    onClick={handleSearch}
    disabled={loading}
    sx={{
      borderRadius: '14px',
      px: 3,
      py: 1,
      fontWeight: 950,
      textTransform: 'none',
      background: theme.main,
      boxShadow: '0 12px 28px rgba(111, 92, 194, 0.28)',
      '&:hover': {
        background: theme.dark,
        transform: 'translateY(-1px)',
      },
    }}
  >
    Search
  </Button>

  <Button
    variant="outlined"
    onClick={handleClearFilters}
    disabled={loading}
    sx={{
      borderRadius: '14px',
      px: 3,
      py: 1,
      fontWeight: 950,
      textTransform: 'none',
      borderColor: theme.main,
      color: theme.main,
      '&:hover': {
        borderColor: theme.dark,
        background: 'rgba(111, 92, 194, 0.08)',
      },
    }}
  >
    Clear
  </Button>
</Box>
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
                        <TableCell>लाभार्थी</TableCell>
                        <TableCell>रसीद अपलोड दिनांक</TableCell>
                        {isAdminUser && (
  <TableCell align="center">Action</TableCell>
)}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {donors.map((donor, index) => (
                        <TableRow
key={donor.receiptId || donor.registrationNumber || index}
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

                          <TableCell sx={{ fontWeight: '900 !important', color: `${'#0f7633'} !important` }}>
                            {donor.beneficiary || 'N/A'}
                          </TableCell>
<TableCell>
  {formatDateTime(donor.receiptUploadDate)}
</TableCell>
                          {isAdminUser && (
  <TableCell align="center">
    <Stack direction="row" spacing={1} justifyContent="center">
      <IconButton
        size="small"
        onClick={() => handleOpenEditDialog(donor)}
        disabled={!donor.receiptId}
        sx={{
          color: theme.main,
          background: 'rgba(111, 92, 194, 0.10)',
          border: '1px solid rgba(111, 92, 194, 0.22)',
          '&:hover': {
            background: 'rgba(111, 92, 194, 0.18)',
          },
        }}
      >
        <EditRounded fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        onClick={() => handleOpenDeleteDialog(donor)}
        disabled={!donor.receiptId}
        sx={{
          color: theme.red,
          background: 'rgba(180, 35, 24, 0.08)',
          border: '1px solid rgba(180, 35, 24, 0.18)',
          '&:hover': {
            background: 'rgba(180, 35, 24, 0.14)',
          },
        }}
      >
        <DeleteRounded fontSize="small" />
      </IconButton>
    </Stack>
  </TableCell>
)}
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

        <Dialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: '24px',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: theme.dark,
              color: '#fff',
              fontWeight: 900,
              fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            सहयोग रिकॉर्ड एडिट करें

            <IconButton onClick={handleCloseEditDialog} sx={{ color: '#fff' }}>
              <CloseRounded />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3, background: '#ffffff' }}>
            <Box sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  color: theme.dark,
                  mb: 0.5,
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                सदस्य
              </Typography>

              <Typography
                sx={{
                  color: theme.muted,
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                {selectedDonor?.name || 'N/A'} - {selectedDonor?.registrationNumber || 'N/A'}
              </Typography>
              <Grid item xs={12}>
  <Typography sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
    लाभार्थी / Death Case
  </Typography>

  <FormControl fullWidth size="small">
    <Select
      value={editForm.deathCaseId}
      onChange={(e) => handleEditFormChange('deathCaseId', e.target.value)}
      displayEmpty
      sx={inputSx}
    >
      <MenuItem value="">
        Death Case चुनें
      </MenuItem>

      {beneficiaryOptions.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                    राशि
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => handleEditFormChange('amount', e.target.value)}
                    placeholder="राशि दर्ज करें"
                    sx={inputSx}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                    भुगतान दिनांक
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={editForm.paymentDate}
                    onChange={(e) => handleEditFormChange('paymentDate', e.target.value)}
                    sx={inputSx}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                    Reference Name
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    value={editForm.referenceName}
                    onChange={(e) => handleEditFormChange('referenceName', e.target.value)}
                    placeholder="Reference name दर्ज करें"
                    sx={inputSx}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ mb: 1, fontWeight: 900, color: theme.dark }}>
                    UTR Number
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    value={editForm.utrNumber}
                    onChange={(e) => handleEditFormChange('utrNumber', e.target.value)}
                    placeholder="UTR number दर्ज करें"
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, background: '#f8f7ff' }}>
            <Button
              onClick={handleCloseEditDialog}
              disabled={actionLoading}
              sx={{
                borderRadius: '12px',
                fontWeight: 900,
                color: theme.muted,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleUpdateSahyogReceipt}
              disabled={actionLoading}
              startIcon={
                actionLoading ? <CircularProgress size={18} color="inherit" /> : <SaveRounded />
              }
              sx={{
                borderRadius: '12px',
                fontWeight: 900,
                background: theme.main,
                '&:hover': {
                  background: theme.dark,
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: '24px',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              background: theme.red,
              color: '#fff',
              fontWeight: 900,
              fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
            }}
          >
            सहयोग रिकॉर्ड हटाएं
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Typography
              sx={{
                color: theme.text,
                fontWeight: 750,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              क्या आप वाकई इस सहयोग रिकॉर्ड को हटाना चाहते हैं?
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                color: theme.muted,
                fontWeight: 700,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              {selectedDonor?.name || 'N/A'} - {selectedDonor?.registrationNumber || 'N/A'}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, background: '#fff7f7' }}>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={actionLoading}
              sx={{
                borderRadius: '12px',
                fontWeight: 900,
                color: theme.muted,
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSahyogReceipt}
              disabled={actionLoading}
              startIcon={
                actionLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteRounded />
              }
              sx={{
                borderRadius: '12px',
                fontWeight: 900,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default SahyogList;