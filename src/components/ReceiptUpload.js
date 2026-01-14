import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    deathCaseId: 1, // Default value, should be passed as prop in real scenario
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    comment: ''
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('केवल JPG, PNG, WEBP या PDF फाइल अपलोड करें');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('फाइल का साइज 5MB से कम होना चाहिए');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('कृपया रसीद की फाइल चुनें');
      return;
    }

    if (!formData.amount || !formData.paymentDate) {
      setError('कृपया सभी आवश्यक फील्ड भरें (Amount और Payment Date)');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadData = new FormData();
      
      // Prepare the JSON payload for @RequestPart("data")
      const requestData = {
        deathCaseId: formData.deathCaseId,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        comment: formData.comment || null
      };
      
      // Add JSON data as string (matching @RequestPart("data") String data)
      uploadData.append('data', JSON.stringify(requestData));
      uploadData.append('file', selectedFile);
      
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
      };
      
      console.log('Request data:', requestData);
      console.log('Request headers:', headers);
      console.log('FormData contents:', Array.from(uploadData.entries()));
      console.log('Full URL:', `${API_BASE_URL}/receipts`);
      
      const response = await axios.post(`${API_BASE_URL}/receipts`, uploadData, {
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
    setSelectedFile(null);
    setFormData({
      deathCaseId: 1,
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      comment: ''
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
        📤 रसीद अपलोड करें
      </DialogTitle>

      <DialogContent>
        {uploadSuccess ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#4caf50', fontFamily: 'Poppins' }}>
              रसीद सफलतापूर्वक अपलोड हो गई!
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
                रसीद की जानकारी
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="राशि (₹) *"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Grid>

            <Grid item xs={6}>
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="टिप्पणी"
                multiline
                rows={2}
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                sx={{ fontFamily: 'Poppins' }}
              />
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Poppins' }}>
                रसीद अपलोड करें
              </Typography>
              
              <Paper
                sx={{
                  border: '2px dashed #1E3A8A',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <CloudUpload sx={{ fontSize: 48, color: '#1E3A8A', mb: 1 }} />
                
                {selectedFile ? (
                  <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                    {selectedFile.name}
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ fontFamily: 'Poppins', mb: 1 }}>
                      फाइल चुनने के लिए क्लिक करें
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      JPG, PNG, WEBP या PDF (Max 5MB)
                    </Typography>
                  </>
                )}
              </Paper>
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
              disabled={uploading || !selectedFile || !formData.amount || !formData.paymentDate}
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
                  अपलोड हो रहा है...
                </>
              ) : (
                <>
                  <Upload sx={{ mr: 1 }} />
                  अपलोड करें
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