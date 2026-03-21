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
import api, { publicApi } from '../services/api';
import { BrowserQRCodeReader } from '@zxing/browser';

const DeathCase = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL.'));
    reader.readAsDataURL(blob);
  });
  // Download QR code using canvas approach (bypasses CORS properly)
const downloadQRCode = async (imageUrl, fileName) => {
  if (!imageUrl) {
    alert('QR Code not available');
    return;
  }

  try {
    const blob = await getQrImageBlob(imageUrl);

    if (!blob.type.startsWith('image/')) {
      throw new Error(`QR file is not an image. Content-Type: ${blob.type || 'unknown'}`);
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    showPayErrorDialog(error?.message || 'QR download failed.');
  }
};
const isMobileDevice = () => {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
};
const getAbsoluteQrUrl = (imageUrl) => {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  const base = api.defaults?.baseURL || window.location.origin;

  if (imageUrl.startsWith('/')) {
    return `${base}${imageUrl}`;
  }

  return `${base}/${imageUrl}`;
};

const loadImageFromBlobUrl = (blobUrl) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('QR image load failed'));
    img.src = blobUrl;
  });

  const getQrImageBlob = async (imageUrl) => {
  const finalUrl = getAbsoluteQrUrl(imageUrl);

  const errors = [];

  // 1) Try authenticated axios instance first
  try {
    const response = await api.get(finalUrl, {
      responseType: 'blob'
    });

    if (response?.data instanceof Blob) {
      return response.data;
    }
  } catch (err) {
    errors.push(`api.get failed: ${err?.message || 'unknown error'}`);
  }

  // 2) Try public axios instance
  try {
    const response = await publicApi.get(finalUrl, {
      responseType: 'blob'
    });

    if (response?.data instanceof Blob) {
      return response.data;
    }
  } catch (err) {
    errors.push(`publicApi.get failed: ${err?.message || 'unknown error'}`);
  }

  // 3) Last fallback to browser fetch
  try {
    const response = await fetch(finalUrl, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    if (blob instanceof Blob) {
      return blob;
    }
  } catch (err) {
    errors.push(`fetch failed: ${err?.message || 'unknown error'}`);
  }

  throw new Error(
    `QR image could not be loaded.\nURL: ${finalUrl}\n\nTried:\n${errors.join('\n')}`
  );
};

const decodeQrFromImage = async (imageUrl) => {
  if (!imageUrl) {
    throw new Error('QR image URL not found.');
  }

  let objectUrl = null;

  try {
    const blob = await getQrImageBlob(imageUrl);

    if (!blob.type.startsWith('image/')) {
      throw new Error(`QR URL did not return an image. Received content type: ${blob.type || 'unknown'}`);
    }

    objectUrl = URL.createObjectURL(blob);

    const img = await loadImageFromBlobUrl(objectUrl);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas context could not be created.');
    }

    const fullWidth = img.naturalWidth || img.width;
    const fullHeight = img.naturalHeight || img.height;

    // Step 1: try full image with ZXing
    const fullDataUrl = await blobToDataUrl(blob);
    const reader = new BrowserQRCodeReader();

    try {
      const result = await reader.decodeFromImageUrl(fullDataUrl);
      const text = result?.getText?.() || result?.text || '';
      if (text) return text.trim();
    } catch (e) {
      // continue to cropped attempts
    }

    // Step 2: try cropped center area (most payment posters keep QR in center)
    const cropAttempts = [
      { x: 0.15, y: 0.18, w: 0.70, h: 0.62 },
      { x: 0.18, y: 0.22, w: 0.64, h: 0.56 },
      { x: 0.20, y: 0.24, w: 0.60, h: 0.52 },
      { x: 0.22, y: 0.26, w: 0.56, h: 0.48 }
    ];

    for (const crop of cropAttempts) {
      const sx = Math.floor(fullWidth * crop.x);
      const sy = Math.floor(fullHeight * crop.y);
      const sw = Math.floor(fullWidth * crop.w);
      const sh = Math.floor(fullHeight * crop.h);

      canvas.width = sw;
      canvas.height = sh;

      context.clearRect(0, 0, sw, sh);
      context.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      const croppedDataUrl = canvas.toDataURL('image/png');

      try {
        const result = await reader.decodeFromImageUrl(croppedDataUrl);
        const text = result?.getText?.() || result?.text || '';
        if (text) return text.trim();
      } catch (e) {
        // continue next crop
      }
    }

    throw new Error('QR code could not be decoded from this image.');
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
};
const handlePayNow = async (qrImageUrl, nomineeLabel = 'UPI') => {
  if (!qrImageUrl) {
    showPayErrorDialog('QR Code not available.');
    return;
  }

  if (!isMobileDevice()) {
    showPayErrorDialog('UPI payment app can be opened only on mobile devices.');
    return;
  }

  try {
    setPayError('');
    setPayLoading(nomineeLabel);

    const decodedValue = await decodeQrFromImage(qrImageUrl);

    if (!decodedValue.toLowerCase().startsWith('upi://pay')) {
      throw new Error(`Decoded QR is not a valid UPI payment link. Value: ${decodedValue}`);
    }

    setTimeout(() => {
      window.location.href = decodedValue;
    }, 100);
  } catch (err) {
    console.error('UPI payment open failed:', err);
    const exactMessage = err?.message || 'Unable to open UPI app.';
    setPayError(exactMessage);
    showPayErrorDialog(exactMessage);
  } finally {
    setPayLoading('');
  }
};
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
  const abortControllerRef = useRef(null);

  const showPayErrorDialog = (message) => {
  setPayDialogMessage(message || 'Unable to open UPI app.');
  setPayDialogOpen(true);
};

useEffect(() => {
  const fetchAssignedOnly = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

      // ✅ If not logged in -> don't show this section
      if (!isAuthenticated) {
        setDeathCases([]);
        return;
      }

      // ✅ Logged-in -> show ONLY assigned pool case
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

const handleUploadClick = async () => {
  if (!isAuthenticated) {
    setLoginAlertOpen(true);
    return;
  }

  try {
    // Always use assigned pool (backend rule)
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
if (!isAuthenticated) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
         नोमिनी सहयोग हेतु अपील
        </Typography>
        <Typography color="#666">
          सहयोग देखने और भुगतान प्रमाण अपलोड करने के लिए कृपया लॉगिन करें।
        </Typography>
      </Box>

      <Box textAlign="center" mt={3}>
        <Button variant="contained" onClick={() => navigate('/login')}>
          लॉगिन करें
        </Button>
      </Box>
    </Container>
  );
}
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
         नोमिनी सहयोग हेतु अपील
        </Typography>
        <Typography color="#666">
सभी सम्मानित सदस्यों से निवेदन है कि
दिवंगत सदस्य के परिवार (नोमिनी) की आर्थिक सहायता हेतु
₹100 का अनिवार्य सहयोग निर्धारित किया गया है।
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
<br />📅 सहयोग अवधि : 18 मार्च 2026 से 28 मार्च 2026 तक <br />

⚠️ भुगतान के बाद अपना UTR नंबर दर्ज करें।
UTR दर्ज होने पर ही आपका सहयोग सफल माना जाएगा।<br />

🔶 नोट : निर्धारित अवधि के बाद सहयोग स्वीकार नहीं किया जाएगा।
          </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
{payError && <Alert severity="warning" sx={{ mt: 2 }}>{payError}</Alert>}
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
                            objectFit: 'contain',
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
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                      <Grid container spacing={{ xs: 2, sm: 4, md: 10 }} sx={{ px: { xs: 1, sm: 4, md: 12 }, justifyContent: 'center' }}>
                        {/* QR Code 1 */}
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            width: { xs: '250px', sm: '220px' },
                            maxWidth: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1, justifyContent: 'center'}}>
                              {dc.nominee1QrCode ? (
                                <img
                                  src={dc.nominee1QrCode}
                                  alt="QR Code 1"
                                  style={{
                                    width: '200px',
                                    height: '250px',
                                    objectFit: 'contain',
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
                              onClick={() => downloadQRCode(dc.nominee1QrCode, `QR-Code-1-${dc.deceasedName || 'DeathCase'}.png`)}
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
                            {dc.nominee1QrCode && (
  <Button
    variant="contained"
    size="small"
    onClick={() => handlePayNow(dc.nominee1QrCode, 'nominee1')}
    disabled={payLoading === 'nominee1'}
    sx={{
      bgcolor: '#2e7d32',
      borderRadius: 3,
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      px: 2,
      '&:hover': { bgcolor: '#1b5e20' }
    }}
  >
    {payLoading === 'nominee1' ? 'OPENING...' : 'PAY NOW'}
  </Button>
)}
                            </Box>
                          </Box>
                        </Grid>

                        {/* QR Code 2 */}
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box sx={{ 
                            bgcolor: '#ffcc80', 
                            p: 2.5, 
                            borderRadius: 4, 
                            textAlign: 'center',
                            minHeight: '300px',
                            width: { xs: '250px', sm: '220px' },
                            maxWidth: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{display: 'grid', gap: 1, justifyContent: 'center'}}>
                              {dc.nominee2QrCode ? (
                                <img
                                  src={dc.nominee2QrCode}
                                  alt="QR Code 2"
                                  style={{
                                    width: '200px',
                                    height: '250px',
                                    objectFit: 'contain',
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
                              onClick={() => downloadQRCode(dc.nominee2QrCode, `QR-Code-2-${dc.deceasedName || 'DeathCase'}.png`)}
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
                            {dc.nominee2QrCode && (
  <Button
    variant="contained"
    size="small"
    onClick={() => handlePayNow(dc.nominee2QrCode, 'nominee2')}
    disabled={payLoading === 'nominee2'}
    sx={{
      bgcolor: '#2e7d32',
      borderRadius: 3,
      color: 'white',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      px: 2,
      '&:hover': { bgcolor: '#1b5e20' }
    }}
  >
    {payLoading === 'nominee2' ? 'OPENING...' : 'PAY NOW'}
  </Button>
)}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Bank Details Row */}
                    <Box sx={{ mb: 4, justifyContent: 'center', display: 'flex' }}>
                      <Grid container spacing={10} sx={{ px: 12,justifyContent: 'center' }}>
                        {/* Bank Details 1 */}
                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}  >
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
                            <Box sx={{display: 'grid', gap: 1, justifyContent: 'center'}}>
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
                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                            <Box sx={{display: 'grid', gap: 1, justifyContent: 'center'}}>
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
                        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                            <Box sx={{display: 'grid', gap: 1, justifyContent: 'center'}}>
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
                      onClick={() => handleUploadClick()}
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
      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Payment Error</DialogTitle>
  <DialogContent>
    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {payDialogMessage}
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setPayDialogOpen(false)} variant="contained">
      OK
    </Button>
  </DialogActions>
</Dialog>
    </Container>
    
  );
};

export default DeathCase;
