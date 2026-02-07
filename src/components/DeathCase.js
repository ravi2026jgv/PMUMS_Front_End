import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardMedia,
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
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  
  // Prevent duplicate API calls
  const abortControllerRef = useRef(null);

  // Fetch death cases from backend
  useEffect(() => {
    const fetchDeathCases = async () => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new AbortController
      abortControllerRef.current = new AbortController();
      
      try {
        setLoading(true);
        setError('');
        
        // Try to fetch from authenticated endpoint first
        let response;
        try {
          response = await api.get('/death-cases', {
            signal: abortControllerRef.current.signal
          });
        } catch (authError) {
          console.log('Authenticated fetch failed, trying public endpoint:', authError.message);
          // If authenticated fails, try public endpoint
          const publicApi = api.defaults.baseURL;
          response = await fetch(`${publicApi}/death-cases/public`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          response = { data };
        }
        
        const cases = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched death cases:', cases);
        
        // Filter to show only active/open and non-hidden cases on home page
        const visibleCases = cases.filter(deathCase => {
          // Check if case is open/active (show on homepage) and not hidden
          const isActiveOrOpen = deathCase.status === 'OPEN' || deathCase.status === 'ACTIVE';
          // Handle missing isHidden field from backend - only hide if explicitly true
          const isNotHidden = deathCase.isHidden !== true;
          
          console.log(`Death case ${deathCase.deceasedName}: status=${deathCase.status}, isHidden=${deathCase.isHidden}, showing=${isActiveOrOpen && isNotHidden}`);
          
          return isActiveOrOpen && isNotHidden;
        });
        
        console.log(`Showing ${visibleCases.length} out of ${cases.length} death cases on home page`);
        setDeathCases(visibleCases.slice(0, 6)); // Show latest 6 visible cases on home page
        
      } catch (err) {
        // Ignore abortion errors
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          return;
        }
        console.error('Error fetching death cases:', err);
        setError('डेथ केस लोड करने में त्रुटि हुई है');
        console.log('Using fallback data due to API error');
        // Use fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchDeathCases();
    
    // Cleanup function to abort any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleUploadClick = (deathCase) => {
    if (!isAuthenticated) {
      setLoginAlertOpen(true);
      return;
    }
    setSelectedCase(deathCase);
    setReceiptUploadOpen(true);
  };

  const handleLoginRedirect = () => {
    setLoginAlertOpen(false);
    navigate('/login');
  };

  const toggleDescription = (caseId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [caseId]: !prev[caseId]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('hi-IN');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Section Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1E3A8A',
            mb: 2,
            fontFamily: 'Poppins'
          }}
        >
          सहायता की आवश्यकता
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#666', maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
        >
          हमारे सदस्य परिवारों के कठिन समय में आपका सहयोग उनके लिए आशा की किरण बनता है।
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Skeleton variant="rectangular" height={400} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="90%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && deathCases.length > 0 && (
        <Grid container spacing={3}>
          {deathCases.map((deathCase, index) => (
            <Grid item xs={12} md={6} key={deathCase.id || index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0'
                }}
              >
                {/* Header with dates */}
                <Box sx={{ 
                  bgcolor: '#f5f5f5', 
                  p: 2, 
                  borderBottom: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    DEATH CASE FORMAT
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    सहायोग प्रारंभ {formatDate(deathCase.createdAt)} सहायोग समाप्त {formatDate(deathCase.caseDate)}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {/* Deceased Information with Photo */}
                  <Box sx={{ 
                    bgcolor: '#ffebee', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 2,
                    border: '1px solid #ffcdd2'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Photo */}
                      <Box sx={{ flexShrink: 0 }}>
                        {deathCase.userImage ? (
                          <CardMedia
                            component="img"
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '3px solid #2196f3'
                            }}
                            image={deathCase.userImage}
                            alt={deathCase.deceasedName}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: '#2196f3',
                              fontSize: '2rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {deathCase.deceasedName?.charAt(0) || 'श्री'}
                          </Avatar>
                        )}
                      </Box>

                      {/* Details */}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                          श्री {deathCase.deceasedName}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          • प्राथमिक शाला {deathCase.district || 'बंगपुरा, जिला दतिया (म.प्र.)'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          • PMUMS पंजीयन क्रमांक: <strong>{deathCase.employeeCode}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          • पंजीयन दिनांक: {formatDate(deathCase.createdAt)}
                        </Typography>
                        <Typography variant="body2">
                          • मृत्यु दिनांक: {formatDate(deathCase.caseDate)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    {deathCase.description && (
                      <Typography variant="body2" sx={{ mt: 2, color: '#555', lineHeight: 1.5 }}>
                        {deathCase.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Death Certificate Section */}
                  {deathCase.certificate1 && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          DEATH CERTIFICATE
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                          src={deathCase.certificate1}
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

                  {/* Nominee Details */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      NOMINEE DETAILS
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`श्रीमती ${deathCase.nominee1Name || 'सरपना अहीरवार'}`}
                        sx={{ bgcolor: '#ffcc80', color: '#333', fontWeight: 'bold' }}
                      />
                      {deathCase.nominee2Name && (
                        <Chip
                          label={`${deathCase.nominee2Name}`}
                          sx={{ bgcolor: '#ffcc80', color: '#333', fontWeight: 'bold' }}
                        />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip label="बाली अहीरवार" sx={{ bgcolor: '#a5d6a7', color: '#333' }} />
                      <Chip label="पुत्र" sx={{ bgcolor: '#a5d6a7', color: '#333' }} />
                    </Box>
                  </Box>

                  {/* Payment Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                      PAYMENT DETAILS
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {/* Account 1 QR Code */}
                      {deathCase.account1 && (
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            {deathCase.nominee1QrCode ? (
                              <img
                                src={deathCase.nominee1QrCode}
                                alt="QR Code 1"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #333'
                                }}
                              />
                            ) : (
                              <Box sx={{
                                width: '100px',
                                height: '100px',
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
                              label="QR-1 बाली अहीरवार"
                              sx={{ bgcolor: '#ffcc80', color: '#333', fontSize: '0.7rem', mt: 1 }}
                              size="small"
                            />
                          </Box>
                        </Grid>
                      )}

                      {/* Account 2 QR Code */}
                      {deathCase.account2 && (
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            {deathCase.nominee2QrCode ? (
                              <img
                                src={deathCase.nominee2QrCode}
                                alt="QR Code 2"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #333'
                                }}
                              />
                            ) : (
                              <Box sx={{
                                width: '100px',
                                height: '100px',
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
                              label="QR-2 बाली अहीरवार"
                              sx={{ bgcolor: '#ffcc80', color: '#333', fontSize: '0.7rem', mt: 1 }}
                              size="small"
                            />
                          </Box>
                        </Grid>
                      )}

                      {/* Account 3 QR Code */}
                      {deathCase.account3 && (
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{
                              width: '100px',
                              height: '100px',
                              bgcolor: '#f5f5f5',
                              border: '2px solid #333',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto'
                            }}>
                              <Typography variant="caption">QR-3</Typography>
                            </Box>
                            <Chip
                              label="QR-3 बाली अहीरवार"
                              sx={{ bgcolor: '#ffcc80', color: '#333', fontSize: '0.7rem', mt: 1 }}
                              size="small"
                            />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  {/* Upload Payment Proof Button */}
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleUploadClick(deathCase)}
                      sx={{
                        bgcolor: '#ff9800',
                        '&:hover': { bgcolor: '#f57c00' },
                        py: 1.5,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        fontFamily: 'Poppins',
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                      }}
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
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            वर्तमान में कोई सहायता अनुरोध उपलब्ध नहीं है।
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            नए अनुरोधों के लिए कृपया बाद में जांचें।
          </Typography>
        </Box>
      )}}

      {/* Receipt Upload Dialog */}
      <ReceiptUpload
        open={receiptUploadOpen}
        onClose={() => {
          setReceiptUploadOpen(false);
          setSelectedCase(null);
        }}
        donationInfo={{
          beneficiaryName: selectedCase?.name || 'सदस्य',
          caseId: selectedCase?.id,
          registrationNumber: selectedCase?.registrationNumber
        }}
      />

      {/* Login Required Dialog */}
      <Dialog open={loginAlertOpen} onClose={() => setLoginAlertOpen(false)}>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', textAlign: 'center' }}>
          लॉगिन आवश्यक
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1">
            सहयोग करने के लिए कृपया पहले लॉगिन करें।
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            onClick={handleLoginRedirect}
            variant="contained"
            sx={{
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            लॉगिन करें
          </Button>
          <Button
            onClick={() => setLoginAlertOpen(false)}
            variant="outlined"
            sx={{ ml: 2 }}
          >
            रद्द करें
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeathCase;