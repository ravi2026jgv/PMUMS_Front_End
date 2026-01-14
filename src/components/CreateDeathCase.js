import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Close, CheckCircle, ExpandMore, AccountBalance, Person, CloudUpload, Delete } from '@mui/icons-material';
import api from '../services/api';

const CreateDeathCase = ({ open, onClose, onSuccess }) => {
  const currentDate = new Date();
  
  const initialFormData = {
    deceasedName: '',
    employeeCode: '',
    department: '',
    district: '',
    description: '', // Add description field
    // Nominee 1
    nominee1Name: '',
    // Nominee 2 (optional)
    nominee2Name: '',
    // Account 1 (required)
    account1: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
    },
    // Account 2 (optional)
    account2: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
    },
    // Account 3 (optional)
    account3: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
    },
    caseDate: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format for LocalDate
  };

  const [formData, setFormData] = useState(initialFormData);
  const [nominee1QrCodeFile, setNominee1QrCodeFile] = useState(null);
  const [nominee2QrCodeFile, setNominee2QrCodeFile] = useState(null);
  const [nominee1Preview, setNominee1Preview] = useState(null);
  const [nominee2Preview, setNominee2Preview] = useState(null);
  const [userImageFile, setUserImageFile] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleAccountChange = (accountKey, field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [accountKey]: {
        ...prev[accountKey],
        [field]: event.target.value
      }
    }));
    setError('');
  };

  const handleFileChange = (nomineeNumber) => (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('कृपया केवल इमेज फाइल अपलोड करें');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('फाइल का आकार 5MB से कम होना चाहिए');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (nomineeNumber === 1) {
          setNominee1QrCodeFile(file);
          setNominee1Preview(reader.result);
        } else {
          setNominee2QrCodeFile(file);
          setNominee2Preview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    setError('');
  };

  const handleRemoveFile = (nomineeNumber) => () => {
    if (nomineeNumber === 1) {
      setNominee1QrCodeFile(null);
      setNominee1Preview(null);
    } else {
      setNominee2QrCodeFile(null);
      setNominee2Preview(null);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('कृपया केवल इमेज फाइल अपलोड करें');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('फाइल का आकार 5MB से कम होना चाहिए');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImageFile(file);
        setUserImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setError('');
  };

  const handleRemovePhoto = () => {
    setUserImageFile(null);
    setUserImagePreview(null);
  };

  const validateForm = () => {
    if (!formData.deceasedName.trim()) {
      setError('दिवंगत का नाम आवश्यक है');
      return false;
    }
    if (!formData.employeeCode.trim()) {
      setError('कर्मचारी कोड आवश्यक है');
      return false;
    }
    if (!formData.nominee1Name.trim()) {
      setError('नॉमिनी 1 का नाम आवश्यक है');
      return false;
    }
    if (!formData.account1.accountNumber.trim()) {
      setError('खाता 1 का खाता नंबर आवश्यक है');
      return false;
    }
    if (!formData.account1.ifscCode.trim()) {
      setError('खाता 1 का IFSC कोड आवश्यक है');
      return false;
    }
    if (!formData.caseDate) {
      setError('केस की दिनांक आवश्यक है');
      return false;
    }
    return true;
  };

  const buildAccountData = (account) => {
    if (!account.accountNumber && !account.bankName && !account.ifscCode && !account.accountHolderName) {
      return null;
    }
    return {
      bankName: account.bankName.trim() || null,
      accountNumber: account.accountNumber.trim() || null,
      ifscCode: account.ifscCode.trim().toUpperCase() || null,
      accountHolderName: account.accountHolderName.trim() || null,
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const requestData = {
        deceasedName: formData.deceasedName.trim(),
        employeeCode: formData.employeeCode.trim(),
        department: formData.department.trim() || null,
        district: formData.district.trim() || null,
        description: formData.description.trim() || null,
        nominee1Name: formData.nominee1Name.trim(),
        nominee2Name: formData.nominee2Name.trim() || null,
        account1: {
          bankName: formData.account1.bankName.trim() || null,
          accountNumber: formData.account1.accountNumber.trim(),
          ifscCode: formData.account1.ifscCode.trim().toUpperCase(),
          accountHolderName: formData.account1.accountHolderName.trim() || null,
        },
        account2: buildAccountData(formData.account2),
        account3: buildAccountData(formData.account3),
        caseDate: formData.caseDate,
      };

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
      
      if (userImageFile) {
        formDataToSend.append('userImage', userImageFile);
      }
      if (nominee1QrCodeFile) {
        formDataToSend.append('nominee1QrCode', nominee1QrCodeFile);
      }
      if (nominee2QrCodeFile) {
        formDataToSend.append('nominee2QrCode', nominee2QrCodeFile);
      }

      await api.post('/death-cases', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(true);
      
      // Reset form after 2 seconds and close
      setTimeout(() => {
        setSuccess(false);
        setFormData(initialFormData);
        setNominee1QrCodeFile(null);
        setNominee2QrCodeFile(null);
        setNominee1Preview(null);
        setNominee2Preview(null);
        setUserImageFile(null);
        setUserImagePreview(null);
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error creating death case:', err);
      setError(err.response?.data?.message || 'मृत्यु केस बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Poppins' }}>
          नया मृत्यु केस दर्ज करें
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }} disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              मृत्यु केस सफलतापूर्वक दर्ज किया गया!
            </Typography>
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Deceased Details Section */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> दिवंगत का विवरण
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  दिवंगत का नाम <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="दिवंगत का पूरा नाम"
                  value={formData.deceasedName}
                  onChange={handleChange('deceasedName')}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  कर्मचारी कोड / पंजीकरण संख्या <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="जैसे: PMUMS20246261"
                  value={formData.employeeCode}
                  onChange={handleChange('employeeCode')}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  विभाग (वैकल्पिक)
                </Typography>
                <FormControl 
                  fullWidth
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }
                  }}>
                  <Select
                    value={formData.department}
                    onChange={handleChange('department')}
                    displayEmpty
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          minWidth: '400px',
                          width: 'auto',
                          '& .MuiMenuItem-root': {
                            padding: '12px 16px',
                            fontSize: '1rem',
                            whiteSpace: 'nowrap',
                            minHeight: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%'
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">विभाग चुनें</MenuItem>
                    <MenuItem value="शिक्षा विभाग">शिक्षा विभाग</MenuItem>
                    <MenuItem value="आदिम जाति कल्याण विभाग">आदिम जाति कल्याण विभाग</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  जिला (वैकल्पिक)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="जिले का नाम"
                  value={formData.district}
                  onChange={handleChange('district')}
                  disabled={loading}
                />
              </Grid>
              
              {/* Description */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  विवरण / संदेश (वैकल्पिक)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="दिवंगत व्यक्ति के बारे में विस्तृत जानकारी, परिवार के लिए संवेदना संदेश, या कोई अन्य महत्वपूर्ण जानकारी..."
                  value={formData.description}
                  onChange={handleChange('description')}
                  disabled={loading}
                  sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.95rem' } }}
                />
              </Grid>
              
              {/* Photo Upload */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
                  दिवंगत की फोटो (वैकल्पिक)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoChange}
                    disabled={loading}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                      sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                          borderColor: '#1565c0',
                          bgcolor: 'rgba(25, 118, 210, 0.04)'
                        }
                      }}
                    >
                      फोटो चुनें
                    </Button>
                  </label>
                  
                  {userImagePreview && (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={userImagePreview}
                        alt="फोटो पूर्वावलोकन"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={handleRemovePhoto}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: '#f44336',
                          color: 'white',
                          '&:hover': { bgcolor: '#d32f2f' },
                          width: 24,
                          height: 24
                        }}
                      >
                        <Delete sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                  समर्थित: JPG, PNG, GIF (अधिकतम 5MB)
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Nominee Details Section */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> नॉमिनी विवरण
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Nominee 1 */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  नॉमिनी 1 का नाम <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="नॉमिनी 1 का पूरा नाम"
                  value={formData.nominee1Name}
                  onChange={handleChange('nominee1Name')}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  नॉमिनी 1 QR कोड (वैकल्पिक)
                </Typography>
                <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center', position: 'relative' }}>
                  {nominee1Preview ? (
                    <Box sx={{ position: 'relative' }}>
                      <img src={nominee1Preview} alt="QR Preview" style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
                      <IconButton
                        onClick={handleRemoveFile(1)}
                        sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}
                        size="small"
                        disabled={loading}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      QR कोड अपलोड करें
                      <input type="file" hidden accept="image/*" onChange={handleFileChange(1)} />
                    </Button>
                  )}
                </Box>
              </Grid>
              {/* Nominee 2 */}
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  नॉमिनी 2 का नाम (वैकल्पिक)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="नॉमिनी 2 का पूरा नाम"
                  value={formData.nominee2Name}
                  onChange={handleChange('nominee2Name')}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  नॉमिनी 2 QR कोड (वैकल्पिक)
                </Typography>
                <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center', position: 'relative' }}>
                  {nominee2Preview ? (
                    <Box sx={{ position: 'relative' }}>
                      <img src={nominee2Preview} alt="QR Preview" style={{ maxWidth: '100%', maxHeight: 150, objectFit: 'contain' }} />
                      <IconButton
                        onClick={handleRemoveFile(2)}
                        sx={{ position: 'absolute', top: -10, right: -10, bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}
                        size="small"
                        disabled={loading}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      QR कोड अपलोड करें
                      <input type="file" hidden accept="image/*" onChange={handleFileChange(2)} />
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Account Details Section */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalance /> बैंक खाता विवरण
            </Typography>
            
            {/* Account 1 (Required) */}
            <Accordion defaultExpanded sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ backgroundColor: '#e3f2fd' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance color="primary" />
                  <Typography sx={{ fontWeight: 600 }}>
                    खाता 1 (प्राथमिक) <span style={{ color: 'red' }}>*</span>
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      बैंक का नाम
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="जैसे: State Bank of India"
                      value={formData.account1.bankName}
                      onChange={handleAccountChange('account1', 'bankName')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      खाता धारक का नाम
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="खाता धारक का पूरा नाम"
                      value={formData.account1.accountHolderName}
                      onChange={handleAccountChange('account1', 'accountHolderName')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      खाता नंबर <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="बैंक खाता नंबर"
                      value={formData.account1.accountNumber}
                      onChange={handleAccountChange('account1', 'accountNumber')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      IFSC कोड <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="जैसे: SBIN0001234"
                      value={formData.account1.ifscCode}
                      onChange={handleAccountChange('account1', 'ifscCode')}
                      disabled={loading}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Account 2 (Optional) */}
            <Accordion sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance color="action" />
                  <Typography sx={{ fontWeight: 600 }}>
                    खाता 2 (वैकल्पिक)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      बैंक का नाम
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="जैसे: State Bank of India"
                      value={formData.account2.bankName}
                      onChange={handleAccountChange('account2', 'bankName')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      खाता धारक का नाम
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="खाता धारक का पूरा नाम"
                      value={formData.account2.accountHolderName}
                      onChange={handleAccountChange('account2', 'accountHolderName')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      खाता नंबर
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="बैंक खाता नंबर"
                      value={formData.account2.accountNumber}
                      onChange={handleAccountChange('account2', 'accountNumber')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      IFSC कोड
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="जैसे: SBIN0001234"
                      value={formData.account2.ifscCode}
                      onChange={handleAccountChange('account2', 'ifscCode')}
                      disabled={loading}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Account 3 (Optional) */}
            <Accordion sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance color="action" />
                  <Typography sx={{ fontWeight: 600 }}>
                    खाता 3 (वैकल्पिक)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      बैंक का नाम
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="जैसे: State Bank of India"
                      value={formData.account3.bankName}
                      onChange={handleAccountChange('account3', 'bankName')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      खाता धारक का नाम
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="खाता धारक का पूरा नाम"
                      value={formData.account3.accountHolderName}
                      onChange={handleAccountChange('account3', 'accountHolderName')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      खाता नंबर
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="बैंक खाता नंबर"
                      value={formData.account3.accountNumber}
                      onChange={handleAccountChange('account3', 'accountNumber')}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                      IFSC कोड
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="जैसे: SBIN0001234"
                      value={formData.account3.ifscCode}
                      onChange={handleAccountChange('account3', 'ifscCode')}
                      disabled={loading}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 3 }} />

            {/* Case Date */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}>
              केस की दिनांक
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                  केस की दिनांक <span style={{ color: 'red' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.caseDate}
                  onChange={handleChange('caseDate')}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            sx={{ color: '#666' }}
          >
            रद्द करें
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 100%)',
              color: 'white',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #0d1642 0%, #b71c1c 100%)',
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                दर्ज हो रहा है...
              </>
            ) : (
              'मृत्यु केस दर्ज करें'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CreateDeathCase;
