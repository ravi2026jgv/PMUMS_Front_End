import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import { Upload, CloudUpload, CheckCircle, Error } from '@mui/icons-material';
import axios from 'axios';

const ReceiptUpload = ({ open, onClose, donationInfo }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    deathCaseId: donationInfo?.caseId || 1,
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    referenceName: '',
    utrNumber: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = async () => {
    if (!formData.amount || !formData.utrNumber) {
      setError('कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const requestData = {
        deathCaseId: formData.deathCaseId,
        amount: parseFloat(formData.amount),
        referenceName: formData.referenceName,
        utrNumber: formData.utrNumber
      };
      
      // Get authorization token
      const token = localStorage.getItem('authToken');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        setError('प्राधिकरण टोकन नहीं मिला। कृपया पुनः लॉगिन करें।');
        setUploading(false);
        return;
      }
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || '';
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      console.log('Request data:', requestData);
      console.log('Request headers:', headers);
      console.log('Full URL:', `${API_BASE_URL}/receipts`);
      
      const response = await axios.post(`${API_BASE_URL}/receipts`, requestData, {
        headers: headers,
      });

      if (response.status === 200 || response.status === 201) {
        setUploadSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'अपलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      deathCaseId: donationInfo?.caseId,
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      referenceName: '',
      utrNumber: ''
    });
    setUploadSuccess(false);
    setError('');
    setUploading(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        color: '#1E3A8A',
        fontFamily: 'Poppins',
        pb: 1
      }}>
        � पेमेंट की जानकारी दर्ज करें
      </DialogTitle>

      <DialogContent>
        {uploadSuccess ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#4caf50', fontFamily: 'Poppins' }}>
              पेमेंट की जानकारी सफलतापूर्वक दर्ज हो गई!
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              धन्यवाद! आपका योगदान दर्ज हो गया है।
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Donor Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Poppins' }}>
                पेमेंट की जानकारी
              </Typography>
              {donationInfo?.caseId && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  डेथ केस ID: {donationInfo.caseId}
                  {donationInfo.beneficiaryName && ` - ${donationInfo.beneficiaryName}`}
                  {donationInfo.registrationNumber && ` (${donationInfo.registrationNumber})`}
                </Alert>
              )}
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>राशि (₹) *</Typography>
              <TextField
                fullWidth
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Grid>

            {/* <Grid item xs={6}>
              <TextField
                fullWidth
                label="भुगतान की तारीख *"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Grid> */}


            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>UTR संख्या (UTR Number) *</Typography>
              <TextField
                fullWidth
                value={formData.utrNumber}
                onChange={(e) => handleInputChange('utrNumber', e.target.value)}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>Reference Name(यदि किसी अन्य व्यक्ति के नाम से भुगतान किया हो)</Typography>
              <TextField
                fullWidth
                value={formData.referenceName}
                onChange={(e) => handleInputChange('referenceName', e.target.value)}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        {!uploadSuccess && (
          <>
            <Button 
              onClick={handleClose} 
              sx={{ 
                color: '#666',
                fontFamily: 'Poppins'
              }}
            >
              रद्द करें
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !formData.amount || !formData.utrNumber}
              variant="contained"
              sx={{
                backgroundColor: '#FF9933',
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: '#e6851f'
                }
              }}
            >
              {uploading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  सबमिट हो रहा है...
                </>
              ) : (
                <>
                  <Upload sx={{ mr: 1 }} />
                  सबमिट करें
                </>
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptUpload;