import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Skeleton,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReceiptUpload from './ReceiptUpload';
import api, { publicApi } from '../services/api';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  soft2: '#ffffff',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  border: '#ded8f5'
};

const SectionTitle = ({ title, subtitle }) => (
  <Box textAlign="center" mb={{ xs: 3.5, md: 5 }}>
    <Typography
      variant="overline"
      sx={{
        color: theme.soft2,
        fontWeight: 900,
        letterSpacing: '1.5px',
        fontSize: '0.82rem',
        fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
      }}
    >
      NOMINEE SUPPORT
    </Typography>

    <Typography
      variant="h4"
      sx={{
        mt: 0.6,
        fontWeight: 950,
        color: theme.soft,
        fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
        fontSize: { xs: '1.75rem', md: '2.45rem' },
        lineHeight: 1.25
      }}
    >
      {title}
    </Typography>

    <Box
      sx={{
        width: 95,
        height: 5,
        borderRadius: 99,
        mx: 'auto',
        mt: 2,
        mb: subtitle ? 2.5 : 0,
        background: theme.accent
      }}
    />

    {subtitle && (
      <Box
        sx={{
          color: theme.soft,
          lineHeight: 1.9,
          fontWeight: 700,
          fontSize: { xs: '0.98rem', md: '1.08rem' },
          maxWidth: 900,
          mx: 'auto',
          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          '& p': {
            mt: 0,
            mb: 1.5
          },
          '& b, & strong': {
            color: theme.dark,
            fontWeight: 900
          },
          '& a': {
            color: theme.accent,
            fontWeight: 800,
            textDecoration: 'none',
            borderBottom: '1px solid rgba(15, 118, 110, 0.35)'
          }
        }}
        dangerouslySetInnerHTML={{ __html: subtitle || '' }}
      />
    )}
  </Box>
);

const InfoBox = ({ children, sx = {} }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: '24px',
      p: { xs: 2.2, md: 2.8 },
      background: '#ffffff',
      border: '1px solid rgba(111, 92, 194, 0.16)',
      boxShadow: '0 14px 38px rgba(34, 27, 67, 0.10)',
      ...sx
    }}
  >
    {children}
  </Paper>
);

const ActionButton = ({ children, sx = {}, ...props }) => (
  <Button
    variant="contained"
    {...props}
    sx={{
      borderRadius: '14px',
      px: 3.2,
      py: 1.1,
      color: '#ffffff',
      fontWeight: 600,
      textTransform: 'none',
      background: '#0f7633',
      boxShadow: '0 12px 28px rgba(15, 118, 110, 0.26)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#0b5f59',
        transform: 'translateY(-2px)',
        boxShadow: '0 16px 36px rgba(15, 118, 110, 0.36)'
      },
      ...sx
    }}
  >
    {children}
  </Button>
);

const QrCard = ({ qrCode, label, onDownload }) => (
  <Paper
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: '28px',
      p: 2.2,
      textAlign: 'center',
      background: '#ffffff',
      border: '1px solid rgba(111, 92, 194, 0.16)',
      boxShadow: '0 18px 44px rgba(34, 27, 67, 0.10)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.35s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 24px 62px rgba(34, 27, 67, 0.16)'
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: theme.main
      }
    }}
  >
    <Box
      sx={{
        mt: 1,
        mb: 1.8,
        p: 1.2,
        borderRadius: '22px',
        background: theme.soft,
        border: '1px solid rgba(111, 92, 194, 0.14)'
      }}
    >
      {qrCode ? (
        <Box
          component="img"
          src={qrCode}
          alt={label}
          sx={{
            width: '100%',
            height: 230,
            objectFit: 'contain',
            borderRadius: '18px',
            background: '#ffffff'
          }}
        />
      ) : (
        <Box
          sx={{
            height: 230,
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px dashed rgba(111, 92, 194, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography color={theme.text} fontWeight={900}>
            QR Not Available
          </Typography>
        </Box>
      )}
    </Box>

    <Chip
      label={label}
      sx={{
        mb: 1.8,
        maxWidth: '100%',
        color: theme.dark,
        fontWeight: 900,
        background: theme.soft,
        border: '1px solid rgba(111, 92, 194, 0.20)',
        fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
      }}
    />

    <ActionButton fullWidth size="small" onClick={onDownload} sx={{ py: 0.85 }}>
      Download QR
    </ActionButton>
  </Paper>
);

const BankDetailsCard = ({ title, account, fallbackName, onCopy }) => (
  <Paper
    elevation={0}
    sx={{
      height: '100%',
      minHeight: 270,
      borderRadius: '28px',
      p: 2.5,
      background: '#ffffff',
      border: '1px solid rgba(111, 92, 194, 0.16)',
      boxShadow: '0 18px 44px rgba(34, 27, 67, 0.10)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.35s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 24px 62px rgba(34, 27, 67, 0.16)'
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        background: theme.accent
      }
    }}
  >
    <Box>
      <Typography
        sx={{
          fontWeight: 950,
          color: theme.dark,
          mb: 2,
          fontSize: '1rem',
          textAlign: 'center',
          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
        }}
      >
        {title}
      </Typography>

      {[
        ['HOLDER', account?.accountHolderName || fallbackName],
        ['BANK', account?.bankName || 'BANK NAME'],
        ['ACC', account?.accountNumber || 'ACCOUNT NUMBER'],
        ['IFSC', account?.ifscCode || 'IFSC CODE']
      ].map(([label, value]) => (
        <Box
          key={label}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            py: 0.9,
            borderBottom: '1px solid rgba(111, 92, 194, 0.12)'
          }}
        >
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 950, color: theme.text }}>
            {label}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.84rem',
              fontWeight: 700,
              color: theme.muted,
              textAlign: 'right',
              wordBreak: 'break-word'
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}
    </Box>

    <ActionButton size="small" onClick={onCopy} sx={{ mt: 2, py: 0.85 }}>
      Copy Details
    </ActionButton>
  </Paper>
);

const DeathCase = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payDialogMessage, setPayDialogMessage] = useState('');
  const [receiptUploadOpen, setReceiptUploadOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [deathCases, setDeathCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [payLoading, setPayLoading] = useState('');
  const [payError, setPayError] = useState('');
  const [homeNoticeHtml, setHomeNoticeHtml] = useState('');

  const abortControllerRef = useRef(null);

  const showPayErrorDialog = (message) => {
    setPayDialogMessage(message || 'Unable to open UPI app.');
    setPayDialogOpen(true);
  };

  const getDownloadUrl = (imageUrl) => {
    if (!imageUrl) return '';

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('blob:') ||
      imageUrl.startsWith('data:')
    ) {
      return imageUrl;
    }

    const base = api.defaults?.baseURL || window.location.origin;

    if (imageUrl.startsWith('/')) {
      return `${base}${imageUrl}`;
    }

    return `${base}/${imageUrl}`;
  };

  const downloadQRCode = (imageUrl, fileName) => {
    if (!imageUrl) {
      showPayErrorDialog('QR Code not available.');
      return;
    }

    try {
      const finalUrl = getDownloadUrl(imageUrl);

      const link = document.createElement('a');
      link.href = finalUrl;
      link.download = fileName || 'qr-code.png';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      showPayErrorDialog(error?.message || 'QR download failed.');
    }
  };

  const handleUploadClick = async () => {
    if (!isAuthenticated) {
      setLoginAlertOpen(true);
      return;
    }

    try {
      const res = await api.get('/pools/my');
      setSelectedCase(res.data);
      setReceiptUploadOpen(true);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Assigned pool नहीं मिला।');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';

    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const copyBankDetails = (title, account, fallbackName) => {
    const bankDetails = `${title}
HOLDER: ${account?.accountHolderName || fallbackName}
BANK: ${account?.bankName || 'BANK NAME'}
ACC: ${account?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${account?.ifscCode || 'IFSC CODE'}`;

    navigator.clipboard.writeText(bankDetails).then(() => {
      alert('Bank details copied!');
    }).catch(() => {
      alert('Failed to copy');
    });
  };

  useEffect(() => {
    const loadHomeNotice = async () => {
      try {
        const response = await publicApi.getHomeDisplayContent();
        setHomeNoticeHtml(response?.data?.homeNoticeHtml || '');
      } catch (error) {
        console.error('Failed to load home notice content:', error);
      }
    };

    loadHomeNotice();
  }, []);

  useEffect(() => {
    const fetchAssignedOnly = async () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError('');

        if (!isAuthenticated) {
          setDeathCases([]);
          return;
        }

        const res = await api.get('/pools/my', {
          signal: abortControllerRef.current.signal
        });

        const assigned = res.data;
        setDeathCases(assigned ? [assigned] : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError(err.response?.data?.message || 'डेटा लोड करने में त्रुटि हुई है');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOnly();
    return () => abortControllerRef.current?.abort();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: theme.soft
        }}
      >
        <Container maxWidth="lg">
          <InfoBox sx={{ textAlign: 'center' }}>
            <SectionTitle
              title="नोमिनी सहयोग हेतु अपील"
              subtitle="सहयोग देखने और भुगतान प्रमाण अपलोड करने के लिए कृपया लॉगिन करें।"
            />

            <ActionButton onClick={() => navigate('/login')}>
              लॉगिन करें
            </ActionButton>
          </InfoBox>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 9 },
        background: '#342c60',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <SectionTitle title="नोमिनी सहयोग हेतु अपील" subtitle={homeNoticeHtml} />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {payError && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {payError}
          </Alert>
        )}

        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Card sx={{ borderRadius: 5, overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={280} />
                  <CardContent>
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && deathCases.length > 0 && (
          <Grid container spacing={4} justifyContent="center">
            {deathCases.map((dc, i) => (
              <Grid item xs={12} key={dc.id || i}>
                <Card
                  sx={{
                    borderRadius: { xs: '28px', md: '38px' },
                    background: '#ffffff',
                    border: '1px solid rgba(111, 92, 194, 0.16)',
                    boxShadow: '0 28px 80px #221b431f',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 7,
                      background: theme.main
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.4, md: 4.5 } }}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={3}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        mb: 4,
                        p: { xs: 2, md: 2.5 },
                        borderRadius: '26px',
                        background: theme.soft,
                        border: '1px solid rgba(111, 92, 194, 0.14)'
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems="center"
                        textAlign={{ xs: 'center', sm: 'left' }}
                      >
                        {dc.userImage ? (
                          <CardMedia
                            component="img"
                            image={dc.userImage}
                            sx={{
                              width: 96,
                              height: 96,
                              borderRadius: '50%',
                              border: '4px solid #ffffff',
                              boxShadow: '0 12px 30px rgba(34, 27, 67, 0.20)'
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 96,
                              height: 96,
                              background: theme.main,
                              fontWeight: 950,
                              fontSize: '1.6rem',
                              boxShadow: '0 12px 30px rgba(34, 27, 67, 0.20)'
                            }}
                          >
                            {dc.deceasedName?.charAt(0) || 'श्री'}
                          </Avatar>
                        )}

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 950,
                              color: theme.dark,
                              fontSize: { xs: '1.28rem', md: '1.58rem' },
                              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                            }}
                          >
                            {dc.deceasedName}
                          </Typography>

                          <Typography sx={{ color: theme.muted, fontWeight: 600, mt: 0.5 }}>
                            पंजीयन क्रमांक : {dc.employeeCode}
                          </Typography>

                          <Typography sx={{ color: theme.muted, fontWeight: 600 }}>
                            मृत्यु दिनांक : {formatDate(dc.caseDate)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label="Assigned Support Case"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 700,
                          background: theme.accent,
                          border: '1px solid rgba(15, 118, 110, 0.25)',
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                        }}
                      />
                    </Stack>

                    {dc.description && (
                      <InfoBox sx={{ mb: 4 }}>
                        <Typography
                          sx={{
                            color: theme.muted,
                            lineHeight: 1.9,
                            fontWeight: 650,
                            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                          }}
                        >
                          {dc.description}
                        </Typography>
                      </InfoBox>
                    )}

                    {dc.certificate1 && (
                      <Box sx={{ my: 4 }}>
                        <Typography
                          sx={{
                            fontWeight: 950,
                            mb: 2.5,
                            textAlign: 'center',
                            fontSize: { xs: '1.05rem', md: '1.18rem' },
                            color: theme.dark,
                            letterSpacing: '0.6px'
                          }}
                        >
                          DEATH CERTIFICATE
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box
                            component="img"
                            src={dc.certificate1}
                            alt="Death Certificate"
                            sx={{
                              maxWidth: { xs: '100%', sm: 270 },
                              maxHeight: 350,
                              objectFit: 'contain',
                              borderRadius: '22px',
                              border: '1px solid rgba(111, 92, 194, 0.18)',
                              boxShadow: '0 16px 42px rgba(34, 27, 67, 0.14)',
                              background: '#ffffff',
                              p: 1.2
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    <Divider sx={{ my: 4, borderColor: 'rgba(111, 92, 194, 0.14)' }} />

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 950,
                          textAlign: 'center',
                          mb: 3,
                          fontSize: { xs: '1.22rem', md: '1.42rem' },
                          color: theme.dark,
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                        }}
                      >
                        PAYMENT DETAILS
                      </Typography>

                      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                          <QrCard
                            qrCode={dc.nominee1QrCode}
                            label={dc.nominee1Name || dc.account1?.accountHolderName || 'Nominee 1'}
                            onDownload={() =>
                              downloadQRCode(dc.nominee1QrCode, `QR-Code-1-${dc.deceasedName || 'DeathCase'}.png`)
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <QrCard
                            qrCode={dc.nominee2QrCode}
                            label={dc.nominee2Name || dc.account2?.accountHolderName || 'Nominee 2'}
                            onDownload={() =>
                              downloadQRCode(dc.nominee2QrCode, `QR-Code-2-${dc.deceasedName || 'DeathCase'}.png`)
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                          <BankDetailsCard
                            title="BANK DETAILS 01"
                            account={dc.account1}
                            fallbackName="बाली अहीरवार"
                            onCopy={() => copyBankDetails('BANK DETAILS 01', dc.account1, 'बाली अहीरवार')}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <BankDetailsCard
                            title="BANK DETAILS 02"
                            account={dc.account2}
                            fallbackName="बाली अहीरवार"
                            onCopy={() => copyBankDetails('BANK DETAILS 02', dc.account2, 'बाली अहीरवार')}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <BankDetailsCard
                            title="BANK DETAILS 03"
                            account={dc.account3}
                            fallbackName="बाली अहीरवार"
                            onCopy={() => copyBankDetails('BANK DETAILS 03', dc.account3, 'बाली अहीरवार')}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box textAlign="center" mt={5}>
                      <ActionButton onClick={handleUploadClick} sx={{ px: 4, py: 1.2 }}>
                        Upload Payment Proof
                      </ActionButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && deathCases.length === 0 && (
          <InfoBox>
            <Typography
              textAlign="center"
              sx={{
                color: theme.text,
                fontWeight: 900,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
              }}
            >
              कोई सहायता अनुरोध उपलब्ध नहीं है।
            </Typography>
          </InfoBox>
        )}

        <ReceiptUpload
          open={receiptUploadOpen}
          onClose={() => setReceiptUploadOpen(false)}
          donationInfo={{
            caseId: selectedCase?.id,
            beneficiaryName: selectedCase?.deceasedName,
            registrationNumber: selectedCase?.employeeCode
          }}
        />

        <Dialog open={loginAlertOpen} onClose={() => setLoginAlertOpen(false)}>
          <DialogTitle>लॉगिन आवश्यक</DialogTitle>
          <DialogContent>
            सहयोग के लिए लॉगिन करें।
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/login')}>
              लॉगिन करें
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Payment Error</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {payDialogMessage}
            </Typography>
          </DialogContent>
          <DialogActions>
            <ActionButton onClick={() => setPayDialogOpen(false)}>
              OK
            </ActionButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DeathCase;