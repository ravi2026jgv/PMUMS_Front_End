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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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
        const response = await axios.get(`${API_BASE_URL}/locations/hierarchy`);
        setLocationHierarchy(response.data);
        
        // Auto-select Madhya Pradesh if it's the only state
        if (response.data.states && response.data.states.length === 1) {
          const mpState = response.data.states[0];
          setSelectedState(mpState.id);
          setAvailableSambhags(mpState.sambhags || []);
        }
      } catch (err) {
        console.error('Error fetching location hierarchy:', err);
        setError('स्थान डेटा लोड करने में त्रुटि। कृपया पुनः प्रयास करें।');
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

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
    setSelectedSambhag(sambhagId);
    setSelectedDistrict('');
    setSelectedBlock('');
    
    const sambhag = availableSambhags.find(s => s.id === sambhagId);
    setAvailableDistricts(sambhag?.districts || []);
    setAvailableBlocks([]);
  };

  // Handle District selection
  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setSelectedBlock('');
    
    const district = availableDistricts.find(d => d.id === districtId);
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
      
      // Remove confirmPassword and agreeTerms, prepare data according to backend RegisterRequest DTO
      const { confirmPassword, agreeTerms, ...formData } = data;
      
      // Get location names for department fields
      const state = locationHierarchy?.states?.find(s => s.id === selectedState);
      const sambhag = availableSambhags.find(s => s.id === selectedSambhag);
      const district = availableDistricts.find(d => d.id === selectedDistrict);
      const block = availableBlocks.find(b => b.id === selectedBlock);
      
      // Construct request matching RegisterRequest DTO exactly
      const registrationData = {
        name: formData.name,
        surname: formData.surname,
        countryCode: formData.countryCode || '+91',
        phoneNumber: formData.phoneNumber || '',
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        username: formData.username,
        password: formData.password,
        homeAddress: formData.homeAddress || '',
        dateOfBirth: formData.dateOfBirth,
        schoolOfficeName: formData.schoolOfficeName || '',
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

      console.log('Registration Data:', registrationData);
      await registerUser(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
                    <TextField
                      fullWidth
                      label="नाम"
                      placeholder="Name"
                      {...register('name', { required: 'Name is required' })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ 
                        fontFamily: 'Poppins',
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="उपनाम"
                      placeholder="Surname"
                      {...register('surname', { required: 'Surname is required' })}
                      error={!!errors.surname}
                      helperText={errors.surname?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="यूजरनेम"
                      placeholder="Username"
                      {...register('username', { required: 'Username is required' })}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth 
                      error={!!errors.gender}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 80px',
                          minHeight: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'left',
                          justifyContent: 'flex-start'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>लिंग</InputLabel>
                      <Select
                        {...register('gender', { required: 'Gender is required' })}
                        label="लिंग"
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
                    <FormControl 
                      fullWidth 
                      error={!!errors.maritalStatus}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',

                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 100px',
                          minHeight: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'left',
                          justifyContent: 'flex-start'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>वैवाहिक स्थिति</InputLabel>
                      <Select
                        {...register('maritalStatus', { required: 'Marital status is required' })}
                        label="वैवाहिक स्थिति"
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
                    <TextField
                      fullWidth
                      label="जन्मतिथि"
                      placeholder="yyyy-mm-dd"
                      type="date"
                      {...register('dateOfBirth', { required: 'Date of birth is required' })}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth?.message}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <TextField
                      fullWidth
                      label="Country Code"
                      placeholder="+91"
                      defaultValue="+91"
                      {...register('countryCode')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="फोन नंबर"
                      placeholder="Phone Number"
                      {...register('phoneNumber')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      label="मोबाइल नंबर"
                      placeholder="10 अंकों का नंबर"
                      {...register('mobileNumber', { 
                        required: 'Mobile number is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Invalid mobile number' }
                      })}
                      error={!!errors.mobileNumber}
                      helperText={errors.mobileNumber?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box>
                      <TextField
                        fullWidth
                        label="ईमेल आईडी"
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
                          '& .MuiOutlinedInput-root': {
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
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <TextField
                            label="ईमेल OTP"
                            placeholder="6 अंकों का OTP"
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            inputProps={{ maxLength: 6 }}
                            sx={{
                              flexGrow: 1,
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid #ccc',
                                borderRadius: '8px'
                              }
                            }}
                          />
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
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 14px',
                          minHeight: '20px',
                          overflow: 'visible',
                          textOverflow: 'clip'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>राज्य</InputLabel>
                      <Select 
                        label="राज्य" 
                        value={selectedState}
                        onChange={handleStateChange}
                        disabled={loadingLocations}
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
                    <FormControl 
                      fullWidth
                      disabled={!selectedState || loadingLocations}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 50px',
                          minHeight: '20px',
                          overflow: 'visible',
                          textOverflow: 'clip'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>संभाग</InputLabel>
                      <Select 
                        label="संभाग"
                        value={selectedSambhag}
                        onChange={handleSambhagChange}
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
                        {availableSambhags.map((sambhag) => (
                          <MenuItem key={sambhag.id} value={sambhag.id}>
                            {sambhag.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth
                      disabled={!selectedSambhag || loadingLocations}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 50px',
                          minHeight: '20px',
                          overflow: 'visible',
                          textOverflow: 'clip'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>जिला</InputLabel>
                      <Select 
                        label="जिला"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
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
                        {availableDistricts.map((district) => (
                          <MenuItem key={district.id} value={district.id}>
                            {district.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl 
                      fullWidth
                      disabled={!selectedDistrict || loadingLocations}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 50px',
                          minHeight: '20px',
                          overflow: 'visible',
                          textOverflow: 'clip'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>ब्लॉक</InputLabel>
                      <Select 
                        label="ब्लॉक"
                        value={selectedBlock}
                        onChange={handleBlockChange}
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
                        {availableBlocks.map((block) => (
                          <MenuItem key={block.id} value={block.id}>
                            {block.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="पूरा पता"
                      placeholder="House No, Street, Landmark..."
                      {...register('homeAddress')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="पिन कोड"
                      placeholder="6 अंकों का कोड"
                      {...register('pinCode', {
                        pattern: { value: /^[0-9]{6}$/, message: 'Invalid PIN code' }
                      })}
                      error={!!errors.pinCode}
                      helperText={errors.pinCode?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 90px',
                          minHeight: '20px',
                          overflow: 'visible',
                          textOverflow: 'clip'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem'
                        }
                      }}>
                      <InputLabel>विभाग का नाम</InputLabel>
                      <Select 
                        label="विभाग का नाम" 
                        {...register('department')}
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
                    <TextField
                      fullWidth
                      label="स्कूल/कार्यालय का नाम"
                      placeholder="School/Office Name"
                      {...register('schoolOfficeName')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="विभाग आईडी (Department Unique ID)"
                      placeholder="Unique ID"
                      {...register('departmentUniqueId')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                    <TextField
                      fullWidth
                      label="नामांकित का नाम"
                      placeholder="Nominee Name"
                      {...register('nominee1Name')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          minHeight: '30px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 150px',
                          fontSize: '1.1rem',
                          minHeight: '25px',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'left',
                          justifyContent: 'flex-start'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1.1rem',
                          fontWeight: 500
                        }
                      }}>
                      <InputLabel>नामांकित का संबंध</InputLabel>
                      <Select
                        {...register('nominee1Relation')}
                        label="नामांकित का संबंध"
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              minWidth: '10px',
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
                        <MenuItem value="" disabled>संबंध चुनें... (Select Relation)</MenuItem>
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
                    <TextField
                      fullWidth
                      label="नामांकित का नाम"
                      placeholder="Nominee Name"
                      {...register('nominee2Name')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          minHeight: '56px'
                        },
                        '& .MuiSelect-select': {
                          padding: '16px 150px',
                          fontSize: '1.1rem',
                          minHeight: '25px',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'left',
                          justifyContent: 'flex-start'
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1.1rem',
                          fontWeight: 500
                        }
                      }}>
                      <InputLabel>नामांकित का संबंध</InputLabel>
                      <Select
                        {...register('nominee2Relation')}
                        label="नामांकित का संबंध"
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              minWidth: '500px',
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
                        <MenuItem value="" disabled>संबंध चुनें... (Select Relation)</MenuItem>
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
                    <TextField
                      fullWidth
                      label="पासवर्ड बनाएं"
                      type="password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                      })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="पासवर्ड की पुष्टि करें"
                      type="password"
                      {...register('confirmPassword', { 
                        required: 'Confirm password is required',
                        validate: (value) => value === watch('password') || 'Passwords do not match'
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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