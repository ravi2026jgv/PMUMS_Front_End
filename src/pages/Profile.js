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
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

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
          homeAddress: data.homeAddress,
          schoolOfficeName: data.schoolOfficeName,
          department: data.department,
          departmentUniqueId: data.departmentUniqueId,
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
                  <TextField
                    fullWidth
                    label="नाम"
                    defaultValue={profileData?.name || ''}
                    {...register('name', { required: 'नाम आवश्यक है' })}
                    disabled={!isEditing}
                    error={!!errors.name}
                    helperText={errors.name?.message}
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
                    label="उपनाम"
                    defaultValue={profileData?.surname || ''}
                    {...register('surname')}
                    disabled={!isEditing}
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
                    label="उपयोगकर्ता नाम"
                    value={profileData?.username || ''}
                    disabled={true}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={profileData?.gender || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>लिंग</InputLabel>
                        <Select
                          {...field}
                          label="लिंग"
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                          }}
                        >
                          <MenuItem value="male">पुरुष (Male)</MenuItem>
                          <MenuItem value="female">महिला (Female)</MenuItem>
                          <MenuItem value="other">अन्य (Other)</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    defaultValue={profileData?.maritalStatus || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>वैवाहिक स्थिति</InputLabel>
                        <Select
                          {...field}
                          label="वैवाहिक स्थिति"
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                          }}
                        >
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
                  <TextField
                    fullWidth
                    label="जन्मतिथि"
                    type="date"
                    defaultValue={profileData?.dateOfBirth || ''}
                    {...register('dateOfBirth')}
                    disabled={!isEditing}
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
                    defaultValue={profileData?.countryCode || '+91'}
                    {...register('countryCode')}
                    disabled={!isEditing}
                    placeholder="+91"
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
                    defaultValue={profileData?.phoneNumber || ''}
                    {...register('phoneNumber')}
                    disabled={!isEditing}
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
                    label="मोबाइल नंबर"
                    defaultValue={profileData?.mobileNumber || ''}
                    {...register('mobileNumber')}
                    disabled={!isEditing}
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
                    label="ईमेल"
                    type="email"
                    defaultValue={profileData?.email || ''}
                    {...register('email', { required: 'ईमेल आवश्यक है' })}
                    disabled={!isEditing}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
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
                  <TextField
                    fullWidth
                    label="पूरा पता"
                    multiline
                    rows={3}
                    defaultValue={profileData?.homeAddress || ''}
                    {...register('homeAddress')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
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
                  <TextField
                    fullWidth
                    label="विभाग का नाम"
                    defaultValue={profileData?.department || ''}
                    {...register('department')}
                    disabled={!isEditing}
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
                    label="स्कूल/कार्यालय का नाम"
                    defaultValue={profileData?.schoolOfficeName || ''}
                    {...register('schoolOfficeName')}
                    disabled={!isEditing}
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
                    defaultValue={profileData?.departmentUniqueId || ''}
                    {...register('departmentUniqueId')}
                    disabled={!isEditing}
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
                    label="राज्य"
                    defaultValue={profileData?.departmentState || ''}
                    {...register('departmentState')}
                    disabled={true}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="संभाग"
                    defaultValue={profileData?.departmentSambhag || ''}
                    {...register('departmentSambhag')}
                    disabled={true}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="जिला"
                    defaultValue={profileData?.departmentDistrict || ''}
                    {...register('departmentDistrict')}
                    disabled={true}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ब्लॉक"
                    defaultValue={profileData?.departmentBlock || ''}
                    {...register('departmentBlock')}
                    disabled={true}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: '#f5f5f5'
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
                  <TextField
                    fullWidth
                    label="नामांकित का नाम"
                    defaultValue={profileData?.nominee1Name || ''}
                    {...register('nominee1Name')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="nominee1Relation"
                    control={control}
                    defaultValue={profileData?.nominee1Relation || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>नामांकित का संबंध</InputLabel>
                        <Select
                          {...field}
                          label="नामांकित का संबंध"
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                          }}
                        >
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
                  <TextField
                    fullWidth
                    label="नामांकित का नाम"
                    defaultValue={profileData?.nominee2Name || ''}
                    {...register('nominee2Name')}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #ccc',
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="nominee2Relation"
                    control={control}
                    defaultValue={profileData?.nominee2Relation || ''}
                    render={({ field }) => (
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>नामांकित का संबंध</InputLabel>
                        <Select
                          {...field}
                          label="नामांकित का संबंध"
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                          }}
                        >
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
