import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { PersonAdd, CloudUpload } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend.pmums.com/api';

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  // Location hierarchy state
  const [locationHierarchy, setLocationHierarchy] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedSambhag, setSelectedSambhag] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  // Filtered options for cascading dropdowns
  const [availableSambhags, setAvailableSambhags] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  // Fetch location hierarchy on component mount
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setLoadingLocations(true);
        
        // Try to fetch from API first
        let locationData;
        try {
          const response = await axios.get(`${API_BASE_URL}/locations/hierarchy`);
          locationData = response.data;
        } catch (apiErr) {
          console.warn('Location API failed, using fallback data:', apiErr);
          
          // Fallback MP data structure
          locationData = {
            states: [{
              id: 'MP',
              name: 'मध्य प्रदेश',
              sambhags: [
                {
                  id: 'BHOPAL',
                  name: 'भोपाल संभाग',
                  districts: [
                    {
                      id: 'BHOPAL_DIST',
                      name: 'भोपाल',
                      blocks: [
                        { id: 'BHOPAL_BLOCK', name: 'भोपाल' },
                        { id: 'HUZUR', name: 'हुजूर' },
                        { id: 'BERASIA', name: 'बैरसिया' }
                      ]
                    },
                    {
                      id: 'RAISEN_DIST',
                      name: 'रायसेन',
                      blocks: [
                        { id: 'BEGUMGANJ', name: 'बेगमगंज' },
                        { id: 'GAIRATGANJ', name: 'गैरतगंज' },
                        { id: 'BARELI', name: 'बारेली' }
                      ]
                    }
                  ]
                },
                {
                  id: 'INDORE',
                  name: 'इंदौर संभाग',
                  districts: [
                    {
                      id: 'INDORE_DIST',
                      name: 'इंदौर',
                      blocks: [
                        { id: 'INDORE_BLOCK', name: 'इंदौर' },
                        { id: 'MHOW', name: 'महू' },
                        { id: 'SANWER', name: 'सांवेर' }
                      ]
                    }
                  ]
                }
              ]
            }]
          };
        }
        
        setLocationHierarchy(locationData);
        
        // Auto-select Madhya Pradesh if it's the only state
        if (locationData.states && locationData.states.length === 1) {
          const mpState = locationData.states[0];
          console.log('Auto-selecting MP state:', mpState);
          console.log('Available sambhags:', mpState.sambhags);
          setSelectedState(mpState.id);
          setAvailableSambhags(mpState.sambhags || []);
        }
        
        // Debug: Log the complete location data
        console.log('Complete location hierarchy loaded:', locationData);
      } catch (err) {
        console.error('Error setting up location hierarchy:', err);
        setError('स्थान डेटा लोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

  // Debug useEffect to track location state changes
  useEffect(() => {
    console.log('Location state changed:', {
      selectedState,
      selectedSambhag,
      selectedDistrict,
      selectedBlock,
      availableSambhags: availableSambhags?.length || 0,
      availableDistricts: availableDistricts?.length || 0,
      availableBlocks: availableBlocks?.length || 0,
      locationHierarchy: locationHierarchy ? 'loaded' : 'not loaded'
    });
  }, [selectedState, selectedSambhag, selectedDistrict, selectedBlock, availableSambhags, availableDistricts, availableBlocks, locationHierarchy]);

  // Handle State selection
  const handleStateChange = (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    setSelectedSambhag('');
    setSelectedDistrict('');
    setSelectedBlock('');
    
    const state = locationHierarchy?.states?.find(s => s.id === stateId);
    setAvailableSambhags(state?.sambhags || []);
    setAvailableDistricts([]);
    setAvailableBlocks([]);
  };

  // Handle Sambhag selection
  const handleSambhagChange = (event) => {
    const sambhagId = event.target.value;
    console.log('Sambhag changed to:', sambhagId);
    setSelectedSambhag(sambhagId);
    setSelectedDistrict('');
    setSelectedBlock('');
    
    const sambhag = availableSambhags.find(s => s.id === sambhagId);
    console.log('Found sambhag:', sambhag);
    console.log('Districts in sambhag:', sambhag?.districts);
    setAvailableDistricts(sambhag?.districts || []);
    setAvailableBlocks([]);
  };

  // Handle District selection
  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    console.log('District changed to:', districtId);
    setSelectedDistrict(districtId);
    setSelectedBlock('');
    
    const district = availableDistricts.find(d => d.id === districtId);
    console.log('Found district:', district);
    console.log('Blocks in district:', district?.blocks);
    setAvailableBlocks(district?.blocks || []);
  };

  // Handle Block selection
  const handleBlockChange = (event) => {
    setSelectedBlock(event.target.value);
  };

  const onSubmit = async (data) => {
    if (!emailVerified) {
      setError('कृपया पहले अपना ईमेल सत्यापित करें');
      return;
    }

    // Validate location selection
    if (!selectedState || !selectedSambhag || !selectedDistrict) {
      setError('कृपया सभी स्थान विवरण भरें (राज्य, संभाग, जिला)');
      return;
    }

    try {
      setError('');
      
      // Remove confirmPassword, agreeTerms, and confirmMobileNumber, prepare data according to backend RegisterRequest DTO
      const { confirmPassword, agreeTerms, confirmMobileNumber, ...formData } = data;
      
      // Get location names for department fields
      const state = locationHierarchy?.states?.find(s => s.id === selectedState);
      const sambhag = availableSambhags.find(s => s.id === selectedSambhag);
      const district = availableDistricts.find(d => d.id === selectedDistrict);
      const block = availableBlocks.find(b => b.id === selectedBlock);
      
      // Convert frontend form values to backend enum format
      const genderMap = {
        'male': 'MALE',
        'female': 'FEMALE', 
        'other': 'OTHER'
      };
      
      const maritalStatusMap = {
        'single': 'UNMARRIED',
        'married': 'MARRIED',
        'divorced': 'DIVORCED',
        'widowed': 'WIDOWED'
      };
      
      // Construct request matching RegisterRequest DTO exactly
      const registrationData = {
        name: formData.name,
        surname: formData.surname,
        fatherName: formData.fatherName,
        countryCode: '+91', // Fixed country code
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        pincode: formData.pinCode ? parseInt(formData.pinCode, 10) : null, // Convert to Integer for backend
        gender: genderMap[formData.gender] || 'OTHER', // Convert to enum
        maritalStatus: maritalStatusMap[formData.maritalStatus] || 'UNMARRIED', // Convert to enum
        password: formData.password,
        homeAddress: formData.homeAddress || '',
        dateOfBirth: formData.dateOfBirth,
        schoolOfficeName: formData.schoolOfficeName || '',
        sankulName: formData.sankulName || '',
        joiningDate: formData.joiningDate || null,
        retirementDate: formData.retirementDate || null,
        department: formData.department || '',
        departmentUniqueId: formData.departmentUniqueId || '',
        departmentState: state?.name || '',
        departmentSambhag: sambhag?.name || '',
        departmentDistrict: district?.name || '',
        departmentBlock: block?.name || '',
        nominee1Name: formData.nominee1Name || '',
        nominee1Relation: formData.nominee1Relation || '',
        nominee2Name: formData.nominee2Name || '',
        nominee2Relation: formData.nominee2Relation || '',
        acceptedTerms: true
      };


      await registerUser(registrationData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.response?.data?.message || err.message);
      
      // Better error handling
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please contact support if this continues.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid data provided. Please check all fields and try again.';
      }
      
      setError(errorMessage);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const sendEmailOtp = async () => {
    const email = watch('email');
    if (!email || !/^\S+@\S+$/i.test(email)) {
      setError('कृपया वैध ईमेल पता दर्ज करें');
      return;
    }

    try {
      setSendingOtp(true);
      setError('');
      const { authService } = await import('../../services/auth.service');
      await authService.sendEmailOtp(email);
      setEmailOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'ईमेल OTP भेजने में त्रुटि हुई');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyEmailOtp = async () => {
    const email = watch('email');
    if (!emailOtp || emailOtp.length !== 6) {
      setError('कृपया 6 अंकों का OTP दर्ज करें');
      return;
    }

    try {
      setVerifyingOtp(true);
      setError('');
      const { authService } = await import('../../services/auth.service');
      await authService.verifyEmailOtp(email, emailOtp);
      setEmailVerified(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'ईमेल सत्यापन में त्रुटि हुई');
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Paper 
            elevation={10} 
            sx={{ 
              p: { xs: 2, md: 4 },
              borderRadius: 3,
              background: '#FFFFFF',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: '#1E3A8A',
                mb: 1,
                fontFamily: 'Poppins'
              }}>
                नया पंजीकरण (Registration)
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', fontFamily: 'Poppins' }}>
                PMUMS में सदस्यता के लिए पंजीयन करें
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Section 1: Basic Information */}
              <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
                  1. मूल जानकारी (Basic Information)
                </Typography>
              </Paper>
              
              <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नाम</Typography>
                    <TextField
                      fullWidth
                      placeholder="Name"
                      {...register('name', { required: 'Name is required' })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ 
                        fontFamily: 'Poppins',
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>उपनाम</Typography>
                    <TextField
                      fullWidth
                      placeholder="Surname"
                      {...register('surname', { required: 'Surname is required' })}
                      error={!!errors.surname}
                      helperText={errors.surname?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पिता का नाम (वैकल्पिक)</Typography>
                    <TextField
                      fullWidth
                      placeholder="Father Name (Optional)"
                      {...register('fatherName')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>लिंग</Typography>
                    <FormControl 
                      fullWidth 
                      error={!!errors.gender}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        {...register('gender', { required: 'Gender is required' })}
                        displayEmpty
                        defaultValue=""
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
                        <MenuItem value="male">पुरुष (Male)</MenuItem>
                        <MenuItem value="female">महिला (Female)</MenuItem>
                        <MenuItem value="other">अन्य (Other)</MenuItem>
                      </Select>
                      <FormHelperText>{errors.gender?.message}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>वैवाहिक स्थिति</Typography>
                    <FormControl 
                      fullWidth 
                      error={!!errors.maritalStatus}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        {...register('maritalStatus', { required: 'Marital status is required' })}
                        displayEmpty
                        defaultValue=""
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
                        <MenuItem value="single">अविवाहित (Single)</MenuItem>
                        <MenuItem value="married">विवाहित (Married)</MenuItem>
                        <MenuItem value="divorced">तलाकशुदा (Divorced)</MenuItem>
                        <MenuItem value="widowed">विधवा/विधुर (Widowed)</MenuItem>
                      </Select>
                      <FormHelperText>{errors.maritalStatus?.message}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>जन्मतिथि</Typography>
                    <TextField
                      fullWidth
                      placeholder="yyyy-mm-dd"
                      type="date"
                      {...register('dateOfBirth', { required: 'Date of birth is required' })}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>Country Code</Typography>
                    <TextField
                      fullWidth
                      value="+91"
                      disabled
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          bgcolor: '#f5f5f5'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>मोबाइल नंबर</Typography>
                    <TextField
                      fullWidth
                      placeholder="10 अंकों का नंबर"
                      {...register('mobileNumber', { 
                        required: 'Mobile number is required',
                        pattern: { 
                          value: /^[0-9]{10}$/, 
                          message: 'Only 10 digits allowed' 
                        }
                      })}
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      inputProps={{ 
                        maxLength: 10,
                        inputMode: 'numeric'
                      }}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>मोबाइल नंबर की पुष्टि</Typography>
                    <TextField
                      fullWidth
                      placeholder="10 अंकों का नंबर"
                      {...register('confirmMobileNumber', { 
                        required: 'Please confirm mobile number',
                        pattern: { 
                          value: /^[0-9]{10}$/, 
                          message: 'Only 10 digits allowed' 
                        },
                        validate: (value) => {
                          const mobileNumber = watch('mobileNumber');
                          return value === mobileNumber || 'Mobile numbers do not match';
                        }
                      })}
                      error={!!errors.confirmMobileNumber}
                      helperText={errors.confirmMobileNumber?.message}
                      inputProps={{ 
                        maxLength: 10,
                        inputMode: 'numeric'
                      }}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>ईमेल आईडी</Typography>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="example@email.com"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={emailVerified}
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            bgcolor: emailVerified ? '#f0f9ff' : 'white'
                          }
                        }}
                      />
                      
                      {!emailVerified && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={sendEmailOtp}
                            disabled={sendingOtp || !watch('email') || !/^\S+@\S+$/i.test(watch('email') || '')}
                            sx={{
                              borderColor: '#1E3A8A',
                              color: '#1E3A8A',
                              '&:hover': {
                                borderColor: '#1E3A8A',
                                bgcolor: '#f5f5f5'
                              }
                            }}
                          >
                            {sendingOtp ? (
                              <CircularProgress size={20} sx={{ color: '#1E3A8A' }} />
                            ) : (
                              emailOtpSent ? 'OTP पुनः भेजें' : 'OTP भेजें'
                            )}
                          </Button>
                        </Box>
                      )}
                      
                      {emailOtpSent && !emailVerified && (
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>ईमेल OTP</Typography>
                            <TextField
                              fullWidth
                              placeholder="6 अंकों का OTP"
                              value={emailOtp}
                              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              inputProps={{ maxLength: 6 }}
                              sx={{
                                '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                                  border: '1px solid #ccc',
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          </Box>
                          <Button
                            variant="contained"
                            onClick={verifyEmailOtp}
                            disabled={verifyingOtp || emailOtp.length !== 6}
                            sx={{
                              bgcolor: '#1a237e',
                              '&:hover': {
                                bgcolor: '#303f9f'
                              },
                              minWidth: '100px'
                            }}
                          >
                            {verifyingOtp ? (
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                            ) : (
                              'सत्यापित करें'
                            )}
                          </Button>
                        </Box>
                      )}
                      
                      {emailVerified && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          color: '#4caf50', 
                          bgcolor: '#f1f8e9', 
                          p: 2, 
                          borderRadius: 1,
                          border: '1px solid #c8e6c9'
                        }}>
                          <Typography variant="body2" sx={{ fontFamily: 'Poppins' }}>
                            ✓ ईमेल सत्यापित हो गया है
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        bgcolor: '#FF9933', 
                        '&:hover': { bgcolor: '#e6851a' },
                        height: '56px',
                        fontFamily: 'Poppins'
                      }}
                    >
                      Verify Your Email
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Section 2: Address Details */}
              <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
                  2. पता विवरण (Address Details)
                </Typography>
              </Paper>
              
              <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>राज्य</Typography>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        value={selectedState}
                        onChange={handleStateChange}
                        disabled={loadingLocations}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              minWidth: '350px',
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
                        {loadingLocations ? (
                          <MenuItem disabled>लोड हो रहा है...</MenuItem>
                        ) : (
                          locationHierarchy?.states?.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                              {state.name} ({state.code})
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>संभाग</Typography>
                    <FormControl 
                      fullWidth
                      disabled={!selectedState || loadingLocations}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        value={selectedSambhag}
                        onChange={handleSambhagChange}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              minWidth: '380px',
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
                        <MenuItem value="">संभाग चुनें... (Select Division)</MenuItem>
                        {availableSambhags && availableSambhags.length > 0 ? (
                          availableSambhags.map((sambhag) => (
                            <MenuItem key={sambhag.id} value={sambhag.id}>
                              {sambhag.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            {loadingLocations ? 'लोड हो रहा है...' : 'कोई संभाग उपलब्ध नहीं'}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>जिला</Typography>
                    <FormControl 
                      fullWidth
                      disabled={!selectedSambhag || loadingLocations}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              minWidth: '380px',
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
                        <MenuItem value="">जिला चुनें... (Select District)</MenuItem>
                        {availableDistricts && availableDistricts.length > 0 ? (
                          availableDistricts.map((district) => (
                            <MenuItem key={district.id} value={district.id}>
                              {district.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            {!selectedSambhag ? 'पहले संभाग चुनें' : 'कोई जिला उपलब्ध नहीं'}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>ब्लॉक</Typography>
                    <FormControl 
                      fullWidth
                      disabled={!selectedDistrict || loadingLocations}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        value={selectedBlock}
                        onChange={handleBlockChange}
                        displayEmpty
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              minWidth: '380px',
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
                        <MenuItem value="">ब्लॉक चुनें... (Select Block)</MenuItem>
                        {availableBlocks && availableBlocks.length > 0 ? (
                          availableBlocks.map((block) => (
                            <MenuItem key={block.id} value={block.id}>
                              {block.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            {!selectedDistrict ? 'पहले जिला चुनें' : 'कोई ब्लॉक उपलब्ध नहीं'}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पूरा पता</Typography>
                    <TextField
                      fullWidth
                      placeholder="House No, Street, Landmark..."
                      {...register('homeAddress')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पिन कोड</Typography>
                    <TextField
                      fullWidth
                      placeholder="6 अंकों का कोड"
                      {...register('pinCode', {
                        pattern: { value: /^[0-9]{6}$/, message: 'Invalid PIN code' }
                      })}
                      error={!!errors.pinCode}
                      helperText={errors.pinCode?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Section 3: Professional Details */}
              <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
                  3. व्यावसायिक विवरण (Professional Details)
                </Typography>
              </Paper>
              
              <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>विभाग का नाम</Typography>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        {...register('department')}
                        displayEmpty
                        defaultValue=""
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
                        <MenuItem value="शिक्षा विभाग">शिक्षा विभाग</MenuItem>
                        <MenuItem value="आदिम जाति कल्याण विभाग">आदिम जाति कल्याण विभाग</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पदस्थ स्कूल/कार्यालय का नाम</Typography>
                    <TextField
                      fullWidth
                      placeholder="Posted School/Office Name"
                      {...register('schoolOfficeName')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>विभाग आईडी (Department Unique ID)</Typography>
                    <TextField
                      fullWidth
                      placeholder="Unique ID"
                      {...register('departmentUniqueId')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>संकुल का नाम (वैकल्पिक)</Typography>
                    <TextField
                      fullWidth
                      placeholder="Sankul Name (Optional)"
                      {...register('sankulName')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नियुक्ति वर्ष (वैकल्पिक)</Typography>
                    <TextField
                      fullWidth
                      type="date"
                      placeholder="Joining Date (Optional)"
                      {...register('joiningDate')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>सेवानिवृत्ति की तिथि (वैकल्पिक)</Typography>
                    <TextField
                      fullWidth
                      type="date"
                      placeholder="Retirement Date (Optional)"
                      {...register('retirementDate')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Section 4: Nominee Details */}
              <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
                  4. नामांकित व्यक्ति का विवरण (Nominee Details)
                </Typography>
              </Paper>
              
              <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1a237e', fontFamily: 'Poppins' }}>
                  पहला नामांकित (First Nominee)
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नामांकित का नाम</Typography>
                    <TextField
                      fullWidth
                      placeholder="Nominee Name"
                      {...register('nominee1Name')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नामांकित का संबंध</Typography>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        {...register('nominee1Relation')}
                        displayEmpty
                        defaultValue=""
                      >
                        <MenuItem value="">संबंध चुनें</MenuItem>
                        <MenuItem value="पिता">पिता (Father)</MenuItem>
                        <MenuItem value="माता">माता (Mother)</MenuItem>
                        <MenuItem value="भाई">भाई (Brother)</MenuItem>
                        <MenuItem value="बहन">बहन (Sister)</MenuItem>
                        <MenuItem value="पति">पति (Husband)</MenuItem>
                        <MenuItem value="पत्नी">पत्नी (Wife)</MenuItem>
                        <MenuItem value="पुत्र">पुत्र (Son)</MenuItem>
                        <MenuItem value="पुत्री">पुत्री (Daughter)</MenuItem>
                        <MenuItem value="दादा">दादा (Grandfather)</MenuItem>
                        <MenuItem value="दादी">दादी (Grandmother)</MenuItem>
                        <MenuItem value="अन्य">अन्य (Other)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#1a237e', fontFamily: 'Poppins' }}>
                  दूसरा नामांकित (Second Nominee)
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नामांकित का नाम</Typography>
                    <TextField
                      fullWidth
                      placeholder="Nominee Name"
                      {...register('nominee2Name')}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नामांकित का संबंध</Typography>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}>
                      <Select
                        {...register('nominee2Relation')}
                        displayEmpty
                        defaultValue=""
                      >
                        <MenuItem value="">संबंध चुनें</MenuItem>
                        <MenuItem value="पिता">पिता (Father)</MenuItem>
                        <MenuItem value="माता">माता (Mother)</MenuItem>
                        <MenuItem value="भाई">भाई (Brother)</MenuItem>
                        <MenuItem value="बहन">बहन (Sister)</MenuItem>
                        <MenuItem value="पति">पति (Husband)</MenuItem>
                        <MenuItem value="पत्नी">पत्नी (Wife)</MenuItem>
                        <MenuItem value="पुत्र">पुत्र (Son)</MenuItem>
                        <MenuItem value="पुत्री">पुत्री (Daughter)</MenuItem>
                        <MenuItem value="दादा">दादा (Grandfather)</MenuItem>
                        <MenuItem value="दादी">दादी (Grandmother)</MenuItem>
                        <MenuItem value="अन्य">अन्य (Other)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Section 5: Account Verification */}
              <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
                  5. खाता सत्यापन (Account Verification)
                </Typography>
              </Paper>
              
              <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पासवर्ड बनाएं</Typography>
                    <TextField
                      fullWidth
                      type="password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                      })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पासवर्ड की पुष्टि करें</Typography>
                    <TextField
                      fullWidth
                      type="password"
                      {...register('confirmPassword', { 
                        required: 'Confirm password is required',
                        validate: (value) => value === watch('password') || 'Passwords do not match'
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 2, fontFamily: 'Poppins' }}>
                      प्रोफाइल फोटो अपलोड करें
                    </Typography>
                    <Box sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f9f9f9' }
                    }}>
                      <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins' }}>
                        फोटो अपलोड करने के लिए क्लिक करें
                        <br />
                        JPG, PNG (MAX. 2MB)
                      </Typography>
                    </Box>
                  </Grid> */}
                </Grid>
              </Box>

              {/* Terms and Submit */}
              <Box sx={{ mb: 3, p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <FormControlLabel
                  control={<Checkbox {...register('agreeTerms', { required: 'Please accept terms and conditions' })} />}
                  label={
                    <Typography variant="body2" sx={{ fontFamily: 'Poppins' }}>
                      मैं घोषणा करता/करती हूं कि ऊपर दी गई सभी जानकारी सत्य है और मैं PMUMS के नियमों और शर्तों को स्वीकार करता/करती हूं।
                    </Typography>
                  }
                />
                {errors.agreeTerms && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors.agreeTerms.message}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  startIcon={!loading && <PersonAdd />}
                  sx={{
                    bgcolor: '#FF9933',
                    '&:hover': { bgcolor: '#e6851a' },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    fontFamily: 'Poppins',
                    minWidth: 250
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      पंजीकरण पूरा करें (Submit)
                    </>
                  ) : (
                    'पंजीकरण पूरा करें (Submit)'
                  )}
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontFamily: 'Poppins',
                    minWidth: 200
                  }}
                  onClick={() => navigate('/login')}
                >
                  लॉगिन पर जाएं
                </Button>
              </Box>
            </form>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" sx={{ color: '#666', fontFamily: 'Poppins' }}>
                पहले से खाता है?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: '#1a237e',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  यहाँ लॉगिन करें
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Register;
