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
  // const [deathCases, setDeathCases] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  // const [expandedDescriptions, setExpandedDescriptions] = useState({});
  
  // Prevent duplicate API calls
  // const abortControllerRef = useRef(null);

  // Fetch death cases from backend - COMMENTED OUT FOR NOW
  /*
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
          // Backend typically returns: OPEN, CLOSED, ACTIVE, INACTIVE
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
  */

  const handleUploadClick = (deathCase) => {
    if (!isAuthenticated) {
      setLoginAlertOpen(true);
      return;
    }
    // Hardcoded death case with only ID "1" - other details will come from UI form
    const hardcodedDeathCase = {
      id: "1"
    };
    setSelectedCase(hardcodedDeathCase);
    setReceiptUploadOpen(true);
  };

  const handleLoginRedirect = () => {
    setLoginAlertOpen(false);
    navigate('/login');
  };

  /* COMMENTED OUT - NOT NEEDED FOR UPLOAD ONLY VERSION
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
  */

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

      {/* Simple Upload Button - Only functionality needed */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleUploadClick()}
          sx={{
            bgcolor: '#FF9933',
            '&:hover': { bgcolor: '#e6851a' },
            py: 3,
            px: 6,
            fontSize: '1.2rem',
            fontWeight: 600,
            borderRadius: 3,
            fontFamily: 'Poppins',
            boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
          }}
        >
          Upload Payment Receipt
        </Button>
        <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
          सहयोग रसीद अपलोड करने के लिए क्लिक करें
        </Typography>
      </Box>

      {/* ALL THE COMPLEX UI IS COMMENTED OUT FOR NOW */}
      {/*
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

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
                ... (all the complex card content) ...
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
      )}
      */}

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