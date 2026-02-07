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

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('hi-IN') : 'N/A';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
          सहायता की आवश्यकता
        </Typography>
        <Typography color="#666">
          कठिन समय में आपका सहयोग आशा बनता है।
        </Typography>
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

                  <Box display="flex" gap={2} mb={2}>
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

                    <Box>
                      <Typography fontWeight="bold">
                        श्री {dc.deceasedName}
                      </Typography>
                      <Typography variant="body2">
                        Employee Code: {dc.employeeCode}
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
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        DEATH CERTIFICATE
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={dc.certificate1}
                          alt="Death Certificate"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '150px',
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
                    <Typography fontWeight="bold" textAlign="center" mb={2}>
                      PAYMENT DETAILS
                    </Typography>

                    {/* QR Codes Row */}
                    <Grid container spacing={2} mb={3}>
                      {/* QR Code 1 */}
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          {dc.nominee1QrCode ? (
                            <img
                              src={dc.nominee1QrCode}
                              alt="QR Code 1"
                              style={{
                                width: '120px',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '2px solid #333'
                              }}
                            />
                          ) : (
                            <Box sx={{
                              width: '120px',
                              height: '120px',
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
                            label={`QR-1 ${dc.nominee1Name || 'Nominee 1'}`}
                            size="small"
                            sx={{ bgcolor: '#ffcc80', color: '#333', fontSize: '0.7rem', mt: 1 }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              if (dc.nominee1QrCode) {
                                const link = document.createElement('a');
                                link.href = dc.nominee1QrCode;
                                link.download = `QR-Code-1-${dc.deceasedName || 'DeathCase'}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                alert('QR Code downloaded!');
                              } else {
                                alert('QR Code not available');
                              }
                            }}
                            sx={{ 
                              mt: 1, 
                              bgcolor: '#ffcc80', 
                              color: '#333', 
                              fontSize: '0.6rem',
                              display: 'block',
                              mx: 'auto',
                              '&:hover': { bgcolor: '#ffb74d' }
                            }}
                          >
                            DOWNLOAD QR
                          </Button>
                        </Box>
                      </Grid>

                      {/* QR Code 2 */}
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          {dc.nominee2QrCode ? (
                            <img
                              src={dc.nominee2QrCode}
                              alt="QR Code 2"
                              style={{
                                width: '120px',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '2px solid #333'
                              }}
                            />
                          ) : (
                            <Box sx={{
                              width: '120px',
                              height: '120px',
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
                            label={`QR-2 ${dc.nominee2Name || 'Nominee 2'}`}
                            size="small"
                            sx={{ bgcolor: '#ffcc80', color: '#333', fontSize: '0.7rem', mt: 1 }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              if (dc.nominee2QrCode) {
                                const link = document.createElement('a');
                                link.href = dc.nominee2QrCode;
                                link.download = `QR-Code-2-${dc.deceasedName || 'DeathCase'}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                alert('QR Code downloaded!');
                              } else {
                                alert('QR Code not available');
                              }
                            }}
                            sx={{ 
                              mt: 1, 
                              bgcolor: '#ffcc80', 
                              color: '#333', 
                              fontSize: '0.6rem',
                              display: 'block',
                              mx: 'auto',
                              '&:hover': { bgcolor: '#ffb74d' }
                            }}
                          >
                            DOWNLOAD QR
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Bank Details Row */}
                    <Grid container spacing={2}>
                      {/* Bank Details 1 */}
                      <Grid item xs={4}>
                        <Box bgcolor="#ffcc80" p={1} borderRadius={1} textAlign="center">
                          <Typography variant="caption" fontWeight="bold" display="block" fontSize="0.6rem">
                            BANK DETAILS 01:
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            ACCOUNT HOLDER: {dc.account1?.accountHolderName || 'बाली अहीरवार'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            BANK: {dc.account1?.bankName || 'BANK NAME'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            ACC NO: {dc.account1?.accountNumber || 'ACCOUNT NUMBER'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            IFSC: {dc.account1?.ifscCode || 'IFSC CODE'}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              const bankDetails = `BANK DETAILS 01:
ACCOUNT HOLDER: ${dc.account1?.accountHolderName || 'बाली अहीरवार'}
BANK: ${dc.account1?.bankName || 'BANK NAME'}
ACC NO: ${dc.account1?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${dc.account1?.ifscCode || 'IFSC CODE'}`;
                              
                              navigator.clipboard.writeText(bankDetails).then(() => {
                                alert('Bank details copied!');
                              }).catch(() => {
                                alert('Failed to copy');
                              });
                            }}
                            sx={{ 
                              mt: 1, 
                              bgcolor: '#ffcc80', 
                              color: '#333', 
                              fontSize: '0.5rem',
                              '&:hover': { bgcolor: '#ffb74d' }
                            }}
                          >
                            COPY
                          </Button>
                        </Box>
                      </Grid>

                      {/* Bank Details 2 */}
                      <Grid item xs={4}>
                        <Box bgcolor="#ffcc80" p={1} borderRadius={1} textAlign="center">
                          <Typography variant="caption" fontWeight="bold" display="block" fontSize="0.6rem">
                            BANK DETAILS 02:
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            ACCOUNT HOLDER: {dc.account2?.accountHolderName || 'बाली अहीरवार'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            BANK: {dc.account2?.bankName || 'BANK NAME'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            ACC NO: {dc.account2?.accountNumber || 'ACCOUNT NUMBER'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            IFSC: {dc.account2?.ifscCode || 'IFSC CODE'}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              const bankDetails = `BANK DETAILS 02:
ACCOUNT HOLDER: ${dc.account2?.accountHolderName || 'बाली अहीरवार'}
BANK: ${dc.account2?.bankName || 'BANK NAME'}
ACC NO: ${dc.account2?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${dc.account2?.ifscCode || 'IFSC CODE'}`;
                              
                              navigator.clipboard.writeText(bankDetails).then(() => {
                                alert('Bank details copied!');
                              }).catch(() => {
                                alert('Failed to copy');
                              });
                            }}
                            sx={{ 
                              mt: 1, 
                              bgcolor: '#ffcc80', 
                              color: '#333', 
                              fontSize: '0.5rem',
                              '&:hover': { bgcolor: '#ffb74d' }
                            }}
                          >
                            COPY
                          </Button>
                        </Box>
                      </Grid>

                      {/* Bank Details 3 */}
                      <Grid item xs={4}>
                        <Box bgcolor="#ffcc80" p={1} borderRadius={1} textAlign="center">
                          <Typography variant="caption" fontWeight="bold" display="block" fontSize="0.6rem">
                            BANK DETAILS 03:
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            ACCOUNT HOLDER: {dc.account3?.accountHolderName || 'बाली अहीरवार'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            BANK: {dc.account3?.bankName || 'BANK NAME'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            ACC NO: {dc.account3?.accountNumber || 'ACCOUNT NUMBER'}
                          </Typography>
                          <Typography variant="caption" display="block" fontSize="0.55rem">
                            IFSC: {dc.account3?.ifscCode || 'IFSC CODE'}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              const bankDetails = `BANK DETAILS 03:
ACCOUNT HOLDER: ${dc.account3?.accountHolderName || 'बाली अहीरवार'}
BANK: ${dc.account3?.bankName || 'BANK NAME'}
ACC NO: ${dc.account3?.accountNumber || 'ACCOUNT NUMBER'}
IFSC: ${dc.account3?.ifscCode || 'IFSC CODE'}`;
                              
                              navigator.clipboard.writeText(bankDetails).then(() => {
                                alert('Bank details copied!');
                              }).catch(() => {
                                alert('Failed to copy');
                              });
                            }}
                            sx={{ 
                              mt: 1, 
                              bgcolor: '#ffcc80', 
                              color: '#333', 
                              fontSize: '0.5rem',
                              '&:hover': { bgcolor: '#ffb74d' }
                            }}
                          >
                            COPY
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
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
          caseId: selectedCase?.id
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
