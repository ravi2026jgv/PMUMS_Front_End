import React, { useState, useEffect } from 'react';
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

  // Fetch death cases from backend
  useEffect(() => {
    const fetchDeathCases = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Test if fallback images are accessible
        const testImages = ['/Profile photo.png', '/sapna_Ahirwar_QR_1.png', '/Boby_Ahirwar_QR_2.png'];
        testImages.forEach(imagePath => {
          const img = new Image();
          img.onload = () => console.log(`✓ Image loaded successfully: ${imagePath}`);
          img.onerror = () => console.log(`✗ Image failed to load: ${imagePath}`);
          img.src = imagePath;
        });
        
        // Try to fetch from authenticated endpoint first
        let response;
        try {
          response = await api.get('/death-cases');
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
        setDeathCases(cases.slice(0, 6)); // Show latest 6 cases on home page
        
      } catch (err) {
        console.error('Error fetching death cases:', err);
        setError('डेथ केस लोड करने में त्रुटि हुई है');
        console.log('Using fallback data due to API error');
        // Use fallback data if API fails
        setDeathCases([{
          id: 1,
          deceasedName: 'श्री राकेश कुमार अहिरवार',
          employeeCode: 'PMUMS20246261',
          department: 'शिक्षा विभाग',
          district: 'भोपाल',
          caseDate: '2025-08-31',
          userImage: '/Profile photo.png',
          nominee1Name: 'श्रीमती सपना अहिरवार',
          nominee2Name: 'बॉबी अहिरवार',
          nominee1QrCode: '/sapna_Ahirwar_QR_1.png',
          nominee2QrCode: '/Boby_Ahirwar_QR_2.png',
          account1: {
            accountHolderName: 'श्रीमती सपना अहिरवार',
            accountNumber: '44472186841',
            ifscCode: 'SBIN0062229',
            bankName: 'SBI Bank'
          },
          account2: {
            accountHolderName: 'बॉबी अहिरवार',
            accountNumber: '44547141657',
            ifscCode: 'SBIN0062229',
            bankName: 'SBI Bank'
          },
          account3: {
            accountHolderName: 'रश्मि अहिरवार',
            accountNumber: '40670606893',
            ifscCode: 'SBIN0062229',
            bankName: 'SBI Bank'
          },
          description: 'PMUMS मध्यप्रदेश के पंजीकृत शिक्षक श्री राकेश कुमार अहिरवार का दिनांक 05/12/2025 को स्वास्थ्य कारणों से आकस्मिक देहावसान हो गया। परिवार को इस कठिन समय में आर्थिक सहायता की आवश्यकता है।',
          status: 'ACTIVE',
          createdAt: '2025-08-31T10:30:00Z'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeathCases();
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Skeleton variant="rectangular" height={200} />
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

      {/* Death Cases Grid */}
      {!loading && deathCases.length > 0 && (
        <Grid container spacing={3}>
          {deathCases.map((deathCase, index) => (
            <Grid size={{ xs: 12 }} key={deathCase.id || index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <Box sx={{ 
                  bgcolor: '#1E3A8A', 
                  color: 'white', 
                  p: 2, 
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  सहयोग
                </Box>

                {/* First Section - User Info, Description, Nominees */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="flex-start">
                    {/* User Photo */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {deathCase.userImage ? (
                          <img
                            src={deathCase.userImage}
                            alt={deathCase.deceasedName}
                            style={{
                              width: '200px',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '12px',
                              border: '3px solid #e0e0e0'
                            }}
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                              const fallback = e.target.parentNode.querySelector('.fallback-avatar');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <Box
                          className="fallback-avatar"
                          sx={{
                            width: '200px',
                            height: '200px',
                            display: deathCase.userImage ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#1E3A8A',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            backgroundImage: 'linear-gradient(135deg, #1E3A8A 0%, #3f51b5 100%)'
                          }}
                        >
                          {deathCase.deceasedName?.charAt(0) || '👤'}
                        </Box>
                      </Box>
                      
                      {/* Basic Info */}
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Name:</strong> {deathCase.deceasedName || 'नाम उपलब्ध नहीं'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Registration Number:</strong> {deathCase.employeeCode || 'N/A'}
                        </Typography>
                        {/* <Typography variant="body1">
                          <strong>Registration Date:</strong> {formatDate(deathCase.caseDate)}
                        </Typography> */}
                      </Box>
                    </Grid>

                    {/* Description and Nominees */}
                    <Grid size={{ xs: 12, md: 8 }}>
                      {/* Description */}
                      {deathCase.description && (
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              lineHeight: 1.6,
                              color: '#333',
                              textAlign: 'justify'
                            }}
                          >
                            {deathCase.description}
                          </Typography>
                        </Box>
                      )}

                      {/* Nominees Section */}
                      <Grid container spacing={2}>
                        {/* Nominee 1 */}
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Box sx={{ 
                            bgcolor: '#f5f5f5', 
                            p: 2, 
                            borderRadius: 2, 
                            textAlign: 'center',
                            mb: 1
                          }}>
                            <Typography variant="body1" sx={{ color: '#999', fontWeight: 500 }}>
                              {deathCase.nominee1Name || 'Nominees name 1'}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            bgcolor: '#f5f5f5', 
                            p: 2, 
                            borderRadius: 2, 
                            textAlign: 'center'
                          }}>
                            <Typography variant="body1" sx={{ color: '#999', fontWeight: 500 }}>
                              Nominees Relation
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Nominee 2 */}
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Box sx={{ 
                            bgcolor: '#f5f5f5', 
                            p: 2, 
                            borderRadius: 2, 
                            textAlign: 'center',
                            mb: 1
                          }}>
                            <Typography variant="body1" sx={{ color: '#999', fontWeight: 500 }}>
                              {deathCase.nominee2Name || 'Nominees name 2'}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            bgcolor: '#f5f5f5', 
                            p: 2, 
                            borderRadius: 2, 
                            textAlign: 'center'
                          }}>
                            <Typography variant="body1" sx={{ color: '#999', fontWeight: 500 }}>
                              Nominees Relation
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                {/* Second Section - QR Codes */}
                <Box sx={{ 
                  bgcolor: '#f8f9fa', 
                  p: 3, 
                  borderTop: '1px solid #e0e0e0' 
                }}>
                  <Typography variant="h6" sx={{ 
                    textAlign: 'center', 
                    mb: 3, 
                    color: '#1E3A8A',
                    fontWeight: 'bold'
                  }}>
                    कृपया परिवार के लिए सहयोग करें
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    textAlign: 'center', 
                    mb: 3, 
                    color: '#666'
                  }}>
                    "Pay Now by PhonePe, Google Pay or any UPI App"
                  </Typography>

                  <Grid container spacing={3} justifyContent="center">
                    {/* Nominee 1 QR */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        {/* QR Code Placeholder */}
                        <Box sx={{
                          width: '200px',
                          height: '200px',
                          bgcolor: '#e0e0e0',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          border: '2px solid #ccc'
                        }}>
                          {deathCase.nominee1QrCode ? (
                            <img 
                              src={deathCase.nominee1QrCode} 
                              alt="Nominee 1 QR Code"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                              onError={(e) => {
                                console.log('QR1 Image failed to load:', e.target.src);
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<div style="color: #999; font-size: 4rem; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">QR</div>';
                              }}
                            />
                          ) : (
                            <Typography variant="h1" sx={{ color: '#999', fontSize: '4rem' }}>
                              QR
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                          {deathCase.nominee1Name || 'Nominee Name'}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: '#FF9933',
                            '&:hover': { bgcolor: '#e6851a' },
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 2
                          }}
                        >
                          Download QR
                        </Button>
                      </Box>
                    </Grid>

                    {/* Nominee 2 QR */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        {/* QR Code Placeholder */}
                        <Box sx={{
                          width: '200px',
                          height: '200px',
                          bgcolor: '#e0e0e0',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          border: '2px solid #ccc'
                        }}>
                          {deathCase.nominee2QrCode ? (
                            <img 
                              src={deathCase.nominee2QrCode} 
                              alt="Nominee 2 QR Code"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                              onError={(e) => {
                                console.log('QR2 Image failed to load:', e.target.src);
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = '<div style="color: #999; font-size: 4rem; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">QR</div>';
                              }}
                            />
                          ) : (
                            <Typography variant="h1" sx={{ color: '#999', fontSize: '4rem' }}>
                              QR
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                          {deathCase.nominee2Name || 'Nominee Name'}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: '#FF9933',
                            '&:hover': { bgcolor: '#e6851a' },
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 2
                          }}
                        >
                          Download QR
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Third Section - Account Details */}
                {(deathCase.account1 || deathCase.account2 || deathCase.account3) && (
                  <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ 
                      mb: 3, 
                      color: '#1E3A8A',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      📊 खाता विवरण
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {[deathCase.account1, deathCase.account2, deathCase.account3]
                        .filter(account => account && account.accountNumber)
                        .map((account, index) => (
                          <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Box sx={{ 
                              p: 2, 
                              bgcolor: '#f8f9ff', 
                              borderRadius: 2, 
                              border: '1px solid #e0e4ff',
                              height: '100%'
                            }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                color: '#1E3A8A',
                                mb: 1,
                                textAlign: 'center'
                              }}>
                                खाता {index + 1}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>खाता धारक:</strong> {account.accountHolderName || 'N/A'}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>खाता नंबर:</strong> {account.accountNumber}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>IFSC कोड:</strong> {account.ifscCode}
                              </Typography>
                              {account.bankName && (
                                <Typography variant="body2">
                                  <strong>बैंक:</strong> {account.bankName}
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        ))
                      }
                    </Grid>
                  </Box>
                )}

                {/* Final Support Button */}
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleUploadClick(deathCase)}
                    sx={{
                      bgcolor: '#FF9933',
                      '&:hover': { bgcolor: '#e6851a' },
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      fontFamily: 'Poppins'
                    }}
                  >
                    Upload payment receipt
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Data State */}
      {!loading && deathCases.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
            वर्तमान में कोई सहायता अनुरोध उपलब्ध नहीं है।
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            नए अनुरोधों के लिए कृपया बाद में जांचें।
          </Typography>
        </Box>
      )}

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