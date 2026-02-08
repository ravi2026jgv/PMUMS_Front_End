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
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReceiptUpload from './ReceiptUpload';
import api from '../services/api';

const DeathCase = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [receiptUploadOpen, setReceiptUploadOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [deathCases, setDeathCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchDeathCases = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError('');

        let response;
        try {
          response = await api.get('/death-cases', {
            signal: abortControllerRef.current.signal
          });
        } catch {
          const publicApi = api.defaults.baseURL;
          const res = await fetch(`${publicApi}/death-cases/public`);
          if (!res.ok) throw new Error('Public API failed');
          const data = await res.json();
          response = { data };
        }

        const cases = Array.isArray(response.data) ? response.data : [];

        const visibleCases = cases.filter(dc =>
          (dc.status === 'OPEN' || dc.status === 'ACTIVE') &&
          dc.isHidden !== true
        );

        setDeathCases(visibleCases.slice(0, 6));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('डेथ केस लोड करने में त्रुटि हुई है');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeathCases();

    return () => abortControllerRef.current?.abort();
  }, []);

  const handleUploadClick = (deathCase) => {
    if (!isAuthenticated) {
      setLoginAlertOpen(true);
      return;
    }
    setSelectedCase(deathCase);
    setReceiptUploadOpen(true);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
          सहयोग सूचना एवं विनम्र अपील
        </Typography>
        <Typography color="#666">
इस दुःखद घड़ी में आपका प्रत्येक सहयोग शोकाकुल परिवार के लिए आशा, संबल एवं विश्वास का आधार बनता है। आइए, हम सब मिलकर मानवीय कर्तव्य निभाएँ और परिवार को इस कठिन समय में सहारा प्रदान करें।
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
सहयोग प्रारंभ दिनांक: 08 फरवरी 2026 — सहयोग समापन दिनांक: 20 फरवरी 2026 तक        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Grid container spacing={3}>
          {[1,2,3,4,5,6].map(i => (
            <Grid item xs={12} md={6} key={i}>
              <Card>
                <Skeleton height={300} />
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
        <Grid container spacing={3}>
          {deathCases.map((dc, i) => (
            <Grid item xs={12} md={6} key={dc.id || i}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>

                  <Box display="flex" gap={2} mb={2} sx={{justifyContent:'center'}}>
                    {dc.userImage ? (
                      <CardMedia
                        component="img"
                        image={dc.userImage}
                        sx={{ width: 80, height: 80, borderRadius: '50%' }}
                      />
                    ) : (
                      <Avatar sx={{ width: 80, height: 80 }}>
                        {dc.deceasedName?.charAt(0) || 'श्री'}
                      </Avatar>
                    )}

                    <Box sx={{justifyContent:'center'}}>
                      <Typography fontWeight="bold">
                      {dc.deceasedName}
                      </Typography>
                      <Typography variant="body2">
                        पंजीयन क्रमांक : {dc.employeeCode}
                      </Typography>
                      <Typography variant="body2">
                        मृत्यु दिनांक: {formatDate(dc.caseDate)}
                      </Typography>
                    </Box>
                  </Box>

                  {dc.description && (
                    <Typography variant="body2" color="text.secondary">
                      {dc.description}
                    </Typography>
                  )}

                  {/* Death Certificate Section */}
                  {dc.certificate1 && (
                    <Box sx={{ mb: 2, justifyContent:'center'}}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center',fontSize: '1rem'}}>
                        DEATH CERTIFICATE
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={dc.certificate1}
                          alt="Death Certificate"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #ddd'
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Payment Details */}
                  <Box mt={2}>
                    <Typography fontWeight="bold" textAlign="center" mb={2} sx={{ fontSize: '1.1rem'}}>
                      PAYMENT DETAILS
                    </Typography>

                    {/* QR Codes Row */}
                    <Box sx={{ mb: 4, justifyContent: 'center', display: 'flex' }}>
                      <Grid container spacing={10} sx={{ px: 12 }}>
                        {/* QR Code 1 */}
                        <Grid item xs={6}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            minWidth: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1}}>
                              {dc.nominee1QrCode ? (
                                <img
                                  src={dc.nominee1QrCode}
                                  alt="QR Code 1"
                                  style={{
                                    width: '200px',
                                    height: '250px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '2px solid #333',
                                    margin: '0 auto'
                                  }}
                                />
                              ) : (
                                <Box sx={{
                                  width: '200px',
                                  height: '250px',
                                  bgcolor: '#f5f5f5',
                                  border: '2px solid #333',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mx: 'auto'
                                }}>
                                  <Typography variant="caption">QR-1</Typography>
                                </Box>
                              )}
                              <Chip
                                label={dc.nominee1Name || dc.account1?.accountHolderName || 'Nominee 1'}
                                size="small"
                                sx={{ bgcolor: '#ff9800', color: 'white', fontSize: '0.9rem', alignSelf: 'center' }}
                              />
                              <Button
                              variant="contained"
                              size="small"
                              onClick={async () => {
                                if (dc.nominee1QrCode) {
                                  try {
                                    // Use CORS proxy to fetch the image
                                    const proxyUrl = 'https://corsproxy.io/?';
                                    const response = await fetch(proxyUrl + encodeURIComponent(dc.nominee1QrCode));
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `QR-Code-1-${dc.deceasedName || 'DeathCase'}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  } catch (error) {
                                    console.error('Download failed:', error);
                                    // Final fallback: create downloadable link
                                    const link = document.createElement('a');
                                    link.href = dc.nominee1QrCode;
                                    link.download = `QR-Code-1-${dc.deceasedName || 'DeathCase'}.png`;
                                    link.target = '_blank';
                                    link.click();
                                  }
                                } else {
                                  alert('QR Code not available');
                                }
                              }}
                              sx={{ 
                                bgcolor: '#ff9800', 
                                borderRadius: 3,
                                color: 'white', 
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                px: 2,
                                '&:hover': { bgcolor: '#f57c00' }
                              }}
                            >
                              DOWNLOAD QR
                            </Button>
                            </Box>
                          </Box>
                        </Grid>

                        {/* QR Code 2 */}
                        <Grid item xs={6}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            minWidth: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1}}>
                              {dc.nominee2QrCode ? (
                                <img
                                  src={dc.nominee2QrCode}
                                  alt="QR Code 2"
                                  style={{
                                    width: '200px',
                                    height: '250px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '2px solid #333',
                                    margin: '0 auto'
                                  }}
                                />
                              ) : (
                                <Box sx={{
                                  width: '200px',
                                  height: '250px',
                                  bgcolor: '#f5f5f5',
                                  border: '2px solid #333',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mx: 'auto'
                                }}>
                                  <Typography variant="caption">QR-2</Typography>
                                </Box>
                              )}
                              <Chip
                                label={dc.nominee2Name || dc.account2?.accountHolderName || 'Nominee 2'}
                                size="small"
                                sx={{ bgcolor: '#ff9800', color: 'white', fontSize: '0.9rem', alignSelf: 'center' }}
                              />
                               <Button
                              variant="contained"
                              size="small"
                              onClick={async () => {
                                if (dc.nominee2QrCode) {
                                  try {
                                    // Use CORS proxy to fetch the image
                                    const proxyUrl = 'https://corsproxy.io/?';
                                    const response = await fetch(proxyUrl + encodeURIComponent(dc.nominee2QrCode));
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `QR-Code-2-${dc.deceasedName || 'DeathCase'}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  } catch (error) {
                                    console.error('Download failed:', error);
                                    // Final fallback: create downloadable link
                                    const link = document.createElement('a');
                                    link.href = dc.nominee2QrCode;
                                    link.download = `QR-Code-2-${dc.deceasedName || 'DeathCase'}.png`;
                                    link.target = '_blank';
                                    link.click();
                                  }
                                } else {
                                  alert('QR Code not available');
                                }
                              }}
                              sx={{ 
                                bgcolor: '#ff9800', 
                                borderRadius: 3,
                                color: 'white', 
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                px: 2,
                                '&:hover': { bgcolor: '#f57c00' }
                              }}
                            >
                              DOWNLOAD QR
                            </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Bank Details Row */}
                    <Box sx={{ mb: 4, justifyContent: 'center', display: 'flex' }}>
                      <Grid container spacing={10} sx={{ px: 12 }}>
                        {/* Bank Details 1 */}
                        <Grid item xs={4}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            minWidth: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1}}>
                              <Typography variant="caption" fontWeight="bold" display="block" fontSize="1.2rem" sx={{ mb: 1 }}>
                                BANK DETAILS 01:
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>HOLDER:</strong> {dc.account1?.accountHolderName || 'बाली अहीरवार'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>BANK:</strong> {dc.account1?.bankName || 'BANK NAME'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>ACC:</strong> {dc.account1?.accountNumber || 'ACCOUNT NUMBER'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 1 }}>
                                <strong>IFSC:</strong> {dc.account1?.ifscCode || 'IFSC CODE'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                const bankDetails = `BANK DETAILS 01:
HOLDER: ${dc.account1?.accountHolderName || 'बाली अहीरवार'}
BANK: ${dc.account1?.bankName || 'BANK NAME'}
ACC: ${dc.account1?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${dc.account1?.ifscCode || 'IFSC CODE'}`;
                                
                                navigator.clipboard.writeText(bankDetails).then(() => {
                                  alert('Bank details copied!');
                                }).catch(() => {
                                  alert('Failed to copy');
                                });
                              }}
                              sx={{ 
                                bgcolor: '#ff9800', 
                                color: 'white', 
                                fontSize: '0.55rem',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#f57c00' }
                              }}
                            >
                              COPY
                            </Button>
                          </Box>
                        </Grid>

                        {/* Bank Details 2 */}
                        <Grid item xs={4}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            minWidth: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1}}>
                              <Typography variant="caption" fontWeight="bold" display="block" fontSize="1.2rem" sx={{ mb: 1 }}>
                                BANK DETAILS 02:
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>HOLDER:</strong> {dc.account2?.accountHolderName || 'बाली अहीरवार'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>BANK:</strong> {dc.account2?.bankName || 'BANK NAME'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>ACC:</strong> {dc.account2?.accountNumber || 'ACCOUNT NUMBER'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 1 }}>
                                <strong>IFSC:</strong> {dc.account2?.ifscCode || 'IFSC CODE'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                const bankDetails = `BANK DETAILS 02:
HOLDER: ${dc.account2?.accountHolderName || 'बाली अहीरवार'}
BANK: ${dc.account2?.bankName || 'BANK NAME'}
ACC: ${dc.account2?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${dc.account2?.ifscCode || 'IFSC CODE'}`;
                                
                                navigator.clipboard.writeText(bankDetails).then(() => {
                                  alert('Bank details copied!');
                                }).catch(() => {
                                  alert('Failed to copy');
                                });
                              }}
                              sx={{ 
                                bgcolor: '#ff9800', 
                                color: 'white', 
                                fontSize: '0.55rem',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#f57c00' }
                              }}
                            >
                              COPY
                            </Button>
                          </Box>
                        </Grid>

                        {/* Bank Details 3 */}
                        <Grid item xs={4}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            minWidth: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1}}>
                              <Typography variant="caption" fontWeight="bold" display="block" fontSize="1.2rem" sx={{ mb: 1 }}>
                                BANK DETAILS 03:
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>HOLDER:</strong> {dc.account3?.accountHolderName || 'बाली अहीरवार'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>BANK:</strong> {dc.account3?.bankName || 'BANK NAME'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 0.5 }}>
                                <strong>ACC:</strong> {dc.account3?.accountNumber || 'ACCOUNT NUMBER'}
                              </Typography>
                              <Typography variant="caption" display="block" fontSize=".9rem" sx={{ mb: 1 }}>
                                <strong>IFSC:</strong> {dc.account3?.ifscCode || 'IFSC CODE'}
                              </Typography>
                            </Box>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                const bankDetails = `BANK DETAILS 03:
HOLDER: ${dc.account3?.accountHolderName || 'बाली अहीरवार'}
BANK: ${dc.account3?.bankName || 'BANK NAME'}
ACC: ${dc.account3?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${dc.account3?.ifscCode || 'IFSC CODE'}`;
                                
                                navigator.clipboard.writeText(bankDetails).then(() => {
                                  alert('Bank details copied!');
                                }).catch(() => {
                                  alert('Failed to copy');
                                });
                              }}
                              sx={{ 
                                bgcolor: '#ff9800', 
                                color: 'white', 
                                fontSize: '0.55rem',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#f57c00' }
                              }}
                            >
                              COPY
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  <Box textAlign="center" mt={3}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleUploadClick(dc)}
                    >
                      UPLOAD PAYMENT PROOF
                    </Button>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && deathCases.length === 0 && (
        <Typography textAlign="center">
          कोई सहायता अनुरोध उपलब्ध नहीं है।
        </Typography>
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
    </Container>
  );
};

export default DeathCase;
