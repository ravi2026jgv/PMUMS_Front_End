import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Phone,
  Email,
  Home,
  Work,
  LocationOn,
  CalendarToday,
  Security,
  PersonAdd,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import api from '../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);

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
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Watch email field for changes
  const watchedEmail = watch('email');

  // Fetch location hierarchy on component mount
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setLoadingLocations(true);
        
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
                    { id: 'BHOPAL_DIST', name: 'भोपाल', blocks: [{ id: 'BHOPAL_BLOCK', name: 'भोपाल' }, { id: 'HUZUR', name: 'हुजूर' }, { id: 'BERASIA', name: 'बैरसिया' }] },
                    { id: 'RAISEN_DIST', name: 'रायसेन', blocks: [{ id: 'BEGUMGANJ', name: 'बेगमगंज' }, { id: 'GAIRATGANJ', name: 'गैरतगंज' }] },
                    { id: 'VIDISHA_DIST', name: 'विदिशा', blocks: [{ id: 'VIDISHA_BLOCK', name: 'विदिशा' }, { id: 'SIRONJ', name: 'सिरोंज' }] },
                    { id: 'SEHORE_DIST', name: 'सीहोर', blocks: [{ id: 'SEHORE_BLOCK', name: 'सीहोर' }, { id: 'ASHTA', name: 'आष्टा' }] }
                  ]
                },
                {
                  id: 'INDORE',
                  name: 'इंदौर संभाग',
                  districts: [
                    { id: 'INDORE_DIST', name: 'इंदौर', blocks: [{ id: 'INDORE_BLOCK', name: 'इंदौर' }, { id: 'MHOW', name: 'महू' }, { id: 'SANWER', name: 'सांवेर' }] },
                    { id: 'DHAR_DIST', name: 'धार', blocks: [{ id: 'DHAR_BLOCK', name: 'धार' }, { id: 'BADNAWAR', name: 'बदनावर' }] },
                    { id: 'UJJAIN_DIST', name: 'उज्जैन', blocks: [{ id: 'UJJAIN_BLOCK', name: 'उज्जैन' }, { id: 'NAGDA', name: 'नागदा' }] }
                  ]
                },
                {
                  id: 'GWALIOR',
                  name: 'ग्वालियर संभाग',
                  districts: [
                    { id: 'GWALIOR_DIST', name: 'ग्वालियर', blocks: [{ id: 'GWALIOR_BLOCK', name: 'ग्वालियर' }, { id: 'DABRA', name: 'डबरा' }] },
                    { id: 'SHIVPURI_DIST', name: 'शिवपुरी', blocks: [{ id: 'SHIVPURI_BLOCK', name: 'शिवपुरी' }, { id: 'PICHHORE', name: 'पिछोर' }] }
                  ]
                },
                {
                  id: 'JABALPUR',
                  name: 'जबलपुर संभाग',
                  districts: [
                    { id: 'JABALPUR_DIST', name: 'जबलपुर', blocks: [{ id: 'JABALPUR_BLOCK', name: 'जबलपुर' }, { id: 'SIHORA', name: 'सिहोरा' }] },
                    { id: 'KATNI_DIST', name: 'कटनी', blocks: [{ id: 'KATNI_BLOCK', name: 'कटनी' }, { id: 'VIJAYRAGHAVGARH', name: 'विजयराघवगढ़' }] }
                  ]
                },
                {
                  id: 'SAGAR',
                  name: 'सागर संभाग',
                  districts: [
                    { id: 'SAGAR_DIST', name: 'सागर', blocks: [{ id: 'SAGAR_BLOCK', name: 'सागर' }, { id: 'KHURAI', name: 'खुरई' }] },
                    { id: 'TIKAMGARH_DIST', name: 'टीकमगढ़', blocks: [{ id: 'TIKAMGARH_BLOCK', name: 'टीकमगढ़' }, { id: 'JATARA', name: 'जतारा' }] }
                  ]
                }
              ]
            }]
          };
        }
        
        setLocationHierarchy(locationData);
        
        // Auto-select Madhya Pradesh
        if (locationData.states && locationData.states.length >= 1) {
          const mpState = locationData.states[0];
          setSelectedState(mpState.id);
          setAvailableSambhags(mpState.sambhags || []);
        }
      } catch (err) {
        console.error('Error setting up location hierarchy:', err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

  // Initialize location dropdowns when profile data loads
  useEffect(() => {
    if (profileData && locationHierarchy && availableSambhags.length > 0) {
      // Find and set sambhag
      const sambhag = availableSambhags.find(s => s.name === profileData.departmentSambhag);
      if (sambhag) {
        setSelectedSambhag(sambhag.id);
        setAvailableDistricts(sambhag.districts || []);
        
        // Find and set district
        const district = sambhag.districts?.find(d => d.name === profileData.departmentDistrict);
        if (district) {
          setSelectedDistrict(district.id);
          setAvailableBlocks(district.blocks || []);
          
          // Find and set block
          const block = district.blocks?.find(b => b.name === profileData.departmentBlock);
          if (block) {
            setSelectedBlock(block.id);
          }
        }
      }
    }
  }, [profileData, locationHierarchy, availableSambhags]);

  // Handle Sambhag selection
  const handleSambhagChange = (sambhagId) => {
    setSelectedSambhag(sambhagId);
    setSelectedDistrict('');
    setSelectedBlock('');
    
    const sambhag = availableSambhags.find(s => s.id === sambhagId);
    setAvailableDistricts(sambhag?.districts || []);
    setAvailableBlocks([]);
    
    // Set form value with name
    setValue('departmentSambhag', sambhag?.name || '');
    setValue('departmentDistrict', '');
    setValue('departmentBlock', '');
  };

  // Handle District selection
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedBlock('');
    
    const district = availableDistricts.find(d => d.id === districtId);
    setAvailableBlocks(district?.blocks || []);
    
    // Set form value with name
    setValue('departmentDistrict', district?.name || '');
    setValue('departmentBlock', '');
  };

  // Handle Block selection
  const handleBlockChange = (blockId) => {
    setSelectedBlock(blockId);
    
    const block = availableBlocks.find(b => b.id === blockId);
    setValue('departmentBlock', block?.name || '');
  };

  useEffect(() => {
    // Use user data from AuthContext if profileData is not loaded
    if (user && user.id && !profileData) {
      setProfileData(user);
      reset(user);
    }
    loadProfileData();
  }, [user]);

  // Reset form when profileData changes
  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get user ID from context or localStorage - should always be available now
      const userId = user?.id || JSON.parse(localStorage.getItem('user') || '{}')?.id;
      
      if (userId) {
        // Fetch latest user data by ID
        const response = await api.get(`/users/${userId}`);
        setProfileData(response.data);
        reset(response.data);
      } else {
        // Should not happen with new login flow, but keep as fallback
        throw new Error('User ID not found. Please login again.');
      }
    } catch (error) {
      console.error('Failed to load profile from API:', error);
      // Use user data from context as fallback
      if (user && typeof user === 'object' && user.id) {
        setProfileData(user);
        reset(user);
      } else {
        setError('प्रोफाइल लोड करने में त्रुटि हुई है। कृपया पुनः लॉगिन करें।');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If cancelling edit, reset form to original data
      reset(profileData);
      setEmailChanged(false);
    }
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Get user ID from context or localStorage - should always be available now
      const userId = user?.id || JSON.parse(localStorage.getItem('user') || '{}')?.id;
      
      if (userId) {
        // Filter data to match UpdateUserRequest fields only
        const updatePayload = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode,
          mobileNumber: data.mobileNumber,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          dateOfBirth: data.dateOfBirth,
          homeAddress: data.homeAddress,
          schoolOfficeName: data.schoolOfficeName,
          department: data.department,
          departmentUniqueId: data.departmentUniqueId,
          departmentState: data.departmentState,
          departmentSambhag: data.departmentSambhag,
          departmentDistrict: data.departmentDistrict,
          departmentBlock: data.departmentBlock,
          nominee1Name: data.nominee1Name,
          nominee1Relation: data.nominee1Relation,
          nominee2Name: data.nominee2Name,
          nominee2Relation: data.nominee2Relation,
        };

        console.log('Sending update payload:', updatePayload);
        const response = await api.put(`/users/${userId}`, updatePayload);
        setProfileData(response.data);
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(response.data));
        setIsEditing(false);
        setSuccess('प्रोफाइल सफलतापूर्वक अपडेट हो गया');
        toast.success('प्रोफाइल सफलतापूर्वक अपडेट हो गया');
      } else {
        throw new Error('User ID not found. Please login again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'प्रोफाइल अपडेट करने में त्रुटि हुई है';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSuccess = (message) => {
    setSuccess(message);
    toast.success(message);
  };

  if (loading && !profileData) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EFE7 100%)',
        py: 1
      }}>
        <Container maxWidth="lg">
          {/* Profile Header Card */}
          <Paper 
            elevation={10} 
            sx={{ 
              mb: 4,
              p: 4,
              borderRadius: 3,
              background: '#FFFFFF',
              textAlign: 'center'
            }}
          >
            <Avatar sx={{ 
              width: 100, 
              height: 100,
              margin: '0 auto',
              mb: 2,
              background: 'linear-gradient(135deg, #1E3A8A 0%, #5c6bc0 100%)',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              boxShadow: '0 8px 20px rgba(26, 35, 126, 0.3)'
            }}>
              {(profileData?.name || user?.name || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              color: '#1E3A8A',
              mb: 1
            }}>
              {(profileData?.name && profileData?.surname) 
                ? `${profileData.name} ${profileData.surname}` 
                : profileData?.name || user?.name || user?.username || 'उपयोगकर्ता'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
              {profileData?.department || 'शिक्षा विभाग'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
              <Chip 
                icon={<Email />} 
                label={profileData?.email || 'ईमेल अनुपलब्ध'} 
                sx={{ bgcolor: '#e3f2fd', color: '#1E3A8A' }}
              />
              {profileData?.mobileNumber && (
                <Chip 
                  icon={<Phone />} 
                  label={profileData.mobileNumber} 
                  sx={{ bgcolor: '#e3f2fd', color: '#1E3A8A' }}
                />
              )}
            </Box>
            <Button
              variant={isEditing ? "outlined" : "contained"}
              onClick={handleEditToggle}
              startIcon={isEditing ? <Cancel /> : <Edit />}
              sx={{
                background: isEditing ? 'transparent' : 'linear-gradient(135deg, #1E3A8A 0%, #5c6bc0 100%)',
                color: isEditing ? '#1E3A8A' : 'white',
                borderColor: isEditing ? '#1E3A8A' : 'transparent',
                '&:hover': {
                  background: isEditing ? 'rgba(26, 35, 126, 0.05)' : 'linear-gradient(135deg, #000051 0%, #3949ab 100%)',
                },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600
              }}
            >
              {isEditing ? 'रद्द करें' : 'प्रोफाइल संपादित करें'}
            </Button>
          </Paper>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Section 1: Personal Information */}
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> 1. व्यक्तिगत जानकारी (Personal Information)
              </Typography>
            </Paper>
            
            <Paper sx={{ mb: 4, p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नाम</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.name || ''}
                    {...register('name', { required: 'नाम आवश्यक है' })}
                    disabled={!isEditing}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{
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
                    defaultValue={profileData?.surname || ''}
                    {...register('surname')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पिता/पति का नाम (Father/Husband Name) <span style={{ color: '#999', fontWeight: 400 }}>(वैकल्पिक)</span></Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.fatherName || ''}
                    {...register('fatherName')}
                    disabled={!isEditing}
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
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={profileData?.gender || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <Select
                          {...field}
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: '1px solid #ccc',
                              borderRadius: '8px'
                            }
                          }}
                        >
                          <MenuItem value="">लिंग चुनें</MenuItem>
                          <MenuItem value="male">पुरुष (Male)</MenuItem>
                          <MenuItem value="female">महिला (Female)</MenuItem>
                          <MenuItem value="other">अन्य (Other)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>वैवाहिक स्थिति</Typography>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    defaultValue={profileData?.maritalStatus || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <Select
                          {...field}
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: '1px solid #ccc',
                              borderRadius: '8px'
                            }
                          }}
                        >
                          <MenuItem value="">वैवाहिक स्थिति चुनें</MenuItem>
                          <MenuItem value="single">अविवाहित (Single)</MenuItem>
                          <MenuItem value="married">विवाहित (Married)</MenuItem>
                          <MenuItem value="divorced">तलाकशुदा (Divorced)</MenuItem>
                          <MenuItem value="widowed">विधवा/विधुर (Widowed)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>जन्मतिथि</Typography>
                  <TextField
                    fullWidth
                    type="date"
                    defaultValue={profileData?.dateOfBirth || ''}
                    {...register('dateOfBirth')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>Country Code</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.countryCode || '+91'}
                    {...register('countryCode')}
                    disabled={!isEditing}
                    placeholder="+91"
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>फोन नंबर</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.phoneNumber || ''}
                    {...register('phoneNumber')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>मोबाइल नंबर</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.mobileNumber || ''}
                    {...register('mobileNumber')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>ईमेल</Typography>
                  <TextField
                    fullWidth
                    type="email"
                    defaultValue={profileData?.email || ''}
                    {...register('email', { 
                      required: 'ईमेल आवश्यक है',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'कृपया सही ईमेल दर्ज करें'
                      }
                    })}
                    disabled={!isEditing}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                {isEditing && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>ईमेल पुष्टि करें (Confirm Email)</Typography>
                    <TextField
                      fullWidth
                      type="email"
                      {...register('confirmEmail', { 
                        required: 'कृपया ईमेल की पुष्टि करें',
                        validate: value => value === watchedEmail || 'ईमेल मेल नहीं खाता'
                      })}
                      error={!!errors.confirmEmail}
                      helperText={errors.confirmEmail?.message || 'ईमेल की पुष्टि करें'}
                      sx={{
                        '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Section 2: Address Details */}
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn /> 2. पता विवरण (Address Details)
              </Typography>
            </Paper>
            
            <Paper sx={{ mb: 4, p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>पूरा पता</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    defaultValue={profileData?.homeAddress || ''}
                    {...register('homeAddress')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Section 3: Professional Details */}
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Work /> 3. व्यावसायिक विवरण (Professional Details)
              </Typography>
            </Paper>
            
            <Paper sx={{ mb: 4, p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>विभाग का नाम</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.department || ''}
                    {...register('department')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>स्कूल/कार्यालय का नाम</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.schoolOfficeName || ''}
                    {...register('schoolOfficeName')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>विभाग आईडी (Department Unique ID)</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.departmentUniqueId || ''}
                    {...register('departmentUniqueId')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>राज्य</Typography>
                  <TextField
                    fullWidth
                    value="मध्य प्रदेश"
                    disabled={true}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                  <input type="hidden" {...register('departmentState')} value="मध्य प्रदेश" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>संभाग</Typography>
                  <FormControl fullWidth disabled={!isEditing || loadingLocations}>
                    <Select
                      value={selectedSambhag}
                      displayEmpty
                      onChange={(e) => handleSambhagChange(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e'
                        }
                      }}
                    >
                      <MenuItem value="">संभाग चुनें</MenuItem>
                      {availableSambhags.map((sambhag) => (
                        <MenuItem key={sambhag.id} value={sambhag.id}>
                          {sambhag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <input type="hidden" {...register('departmentSambhag')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>जिला</Typography>
                  <FormControl fullWidth disabled={!isEditing || !selectedSambhag}>
                    <Select
                      value={selectedDistrict}
                      displayEmpty
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e'
                        }
                      }}
                    >
                      <MenuItem value="">जिला चुनें</MenuItem>
                      {availableDistricts.map((district) => (
                        <MenuItem key={district.id} value={district.id}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <input type="hidden" {...register('departmentDistrict')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>ब्लॉक</Typography>
                  <FormControl fullWidth disabled={!isEditing || !selectedDistrict}>
                    <Select
                      value={selectedBlock}
                      displayEmpty
                      onChange={(e) => handleBlockChange(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid #ccc',
                          borderRadius: '8px'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e'
                        }
                      }}
                    >
                      <MenuItem value="">ब्लॉक चुनें</MenuItem>
                      {availableBlocks.map((block) => (
                        <MenuItem key={block.id} value={block.id}>
                          {block.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <input type="hidden" {...register('departmentBlock')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>संकुल का नाम (Sankul Name) <span style={{ color: '#999', fontWeight: 400 }}>(वैकल्पिक)</span></Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.sankulName || ''}
                    {...register('sankulName')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नियुक्ति तिथि (Joining Date) <span style={{ color: '#999', fontWeight: 400 }}>(वैकल्पिक)</span></Typography>
                  <TextField
                    fullWidth
                    type="date"
                    defaultValue={profileData?.joiningDate || ''}
                    {...register('joiningDate')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>सेवानिवृत्ति तिथि (Retirement Date) <span style={{ color: '#999', fontWeight: 400 }}>(वैकल्पिक)</span></Typography>
                  <TextField
                    fullWidth
                    type="date"
                    defaultValue={profileData?.retirementDate || ''}
                    {...register('retirementDate')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': { '& input::placeholder': { color: '#000', opacity: 1 }, '& textarea::placeholder': { color: '#000', opacity: 1 },
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Section 4: Nominee Details */}
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonAdd /> 4. नामांकित व्यक्ति का विवरण (Nominee Details)
              </Typography>
            </Paper>
            
            <Paper sx={{ mb: 4, p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                पहला नामांकित (First Nominee)
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नामांकित का नाम</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.nominee1Name || ''}
                    {...register('nominee1Name')}
                    disabled={!isEditing}
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
                  <Controller
                    name="nominee1Relation"
                    control={control}
                    defaultValue={profileData?.nominee1Relation || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <Select
                          {...field}
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: '1px solid #ccc',
                              borderRadius: '8px'
                            }
                          }}
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
                    )}
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                दूसरा नामांकित (Second Nominee)
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.95rem' }}>नामांकित का नाम</Typography>
                  <TextField
                    fullWidth
                    defaultValue={profileData?.nominee2Name || ''}
                    {...register('nominee2Name')}
                    disabled={!isEditing}
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
                  <Controller
                    name="nominee2Relation"
                    control={control}
                    defaultValue={profileData?.nominee2Relation || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <Select
                          {...field}
                          displayEmpty
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: '1px solid #ccc',
                              borderRadius: '8px'
                            }
                          }}
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
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Section 5: Account Security */}
            <Paper sx={{ mb: 3, p: 2, bgcolor: '#1a237e', color: 'white', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security /> 5. खाता सुरक्षा (Account Security)
              </Typography>
            </Paper>
            
            <Paper sx={{ mb: 4, p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    अपना पासवर्ड बदलने के लिए नीचे दिए गए बटन पर क्लिक करें
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordDialog(true)}
                    startIcon={<Security />}
                    sx={{
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      '&:hover': {
                        borderColor: '#000051',
                        bgcolor: 'rgba(26, 35, 126, 0.05)'
                      }
                    }}
                  >
                    पासवर्ड बदलें
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Submit Button */}
            {isEditing && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<Save />}
                  sx={{
                    background: 'linear-gradient(135deg, #FF9933 0%, #f57c00 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e6851a 0%, #ef6c00 100%)'
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    minWidth: 200
                  }}
                >
                  {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'प्रोफाइल सेव करें'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleEditToggle}
                  sx={{
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    minWidth: 150
                  }}
                >
                  रद्द करें
                </Button>
              </Box>
            )}
          </form>

          {/* Change Password Dialog */}
          <ChangePasswordDialog
            open={showPasswordDialog}
            onClose={() => setShowPasswordDialog(false)}
            onSuccess={handlePasswordChangeSuccess}
          />
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;
