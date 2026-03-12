import React, { useState,useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  InputAdornment,
} from '@mui/material';
import { Email, Lock, Verified,Phone } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { publicApi } from '../../services/api';
import Layout from '../../components/Layout/Layout';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
 const [mobileInput, setMobileInput] = useState('');
const [mobileOtpEnabled, setMobileOtpEnabled] = useState(false);
const [loadingMode, setLoadingMode] = useState(true);
const [email, setEmail] = useState('');
const [emailInput, setEmailInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  useEffect(() => {
  const fetchRecoveryMode = async () => {
    try {
      setLoadingMode(true);
     const response = await publicApi.get('/auth/password/recovery-mode');
      setMobileOtpEnabled(response.data?.mobileOtpEnabled === true);
    } catch (err) {
      console.error('Failed to load mobile OTP setting:', err);
      setMobileOtpEnabled(false); // fallback = email mode
    } finally {
      setLoadingMode(false);
    }
  };

  fetchRecoveryMode();
}, []);
  // Step 1: Send OTP to email
  // const handleSendOTP = async (data) => {
  //   console.log('🚀 handleSendOTP called with data:', data);
    
  //   if (!data.email) {
  //     console.log('❌ No email provided');
  //     setError('Please enter a valid email address');
  //     return;
  //   }
    
  //   try {
  //     console.log('⏳ Starting OTP send process...');
  //     setLoading(true);
  //     setError('');
  //     setSuccess('');
      
  //     // Send request to generate OTP using the correct endpoint
  //     const response = await publicApi.post('/auth/password/send-otp', {
  //       email: data.email
  //     });
      
  //     console.log('API response:', response);
  //     console.log('Response status:', response.status);
  //     console.log('Response data:', response.data);
      
  //     setEmail(data.email);
  //     setOtpSent(true);
  //     setActiveStep(1);
  //     setSuccess('OTP sent successfully to your email address');
      
  //   } catch (err) {
  //     console.error('Send OTP error:', err);
  //     console.error('Error response:', err.response);
  //     console.error('Error status:', err.response?.status);
  //     console.error('Error data:', err.response?.data);
  //     console.error('Error message:', err.response?.data?.message);
      
  //     // Handle different error scenarios
  //     if (err.code === 'NETWORK_ERROR') {
  //       setError('Network error. Please check your internet connection.');
  //     } else if (err.response?.status === 404) {
  //       setError('Reset password service is not available. Please try again later.');
  //     } else if (err.response?.status === 400) {
  //       setError('Invalid email address. Please check and try again.');
  //     } else {
  //       setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
 const handleSendOTP = async () => {
  try {
    setLoading(true);
    setError('');
    setSuccess('');

    if (mobileOtpEnabled) {
      if (!mobileInput || mobileInput.length !== 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }

      await publicApi.post('/auth/password/send-otp', {
        mobileNumber: mobileInput
      });

      setMobileNumber(mobileInput);
      setSuccess('OTP sent successfully to your mobile number');
    } else {
      if (!emailInput || !/^\S+@\S+\.\S+$/.test(emailInput)) {
        setError('Please enter a valid email address');
        return;
      }

      await publicApi.post('/auth/password/send-otp', {
        email: emailInput
      });

      setEmail(emailInput);
      setSuccess('OTP sent successfully to your email');
    }

    setOtpSent(true);
    setActiveStep(1);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};
  // Step 2: Reset password with OTP
  // const handleResetPassword = async (data) => {
  //   try {
  //     setLoading(true);
  //     setError('');

  //     const resetData = {
  //       email: email,
  //       otp: data.otp,
  //       newPassword: data.newPassword
  //     };

  //     const response = await publicApi.post('/auth/password/reset', resetData);
      
  //     setSuccess('Password reset successfully! You can now login with your new password.');
  //     setActiveStep(2);
      
  //     // Redirect to login after 3 seconds
  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 3000);
      
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP and try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleResetPassword = async (data) => {
  try {
    setLoading(true);
    setError('');

    const resetData = mobileOtpEnabled
      ? {
          mobileNumber,
          otp: data.otp,
          newPassword: data.newPassword
        }
      : {
          email,
          otp: data.otp,
          newPassword: data.newPassword
        };

    await publicApi.post('/auth/password/reset', resetData);

    setSuccess('Password reset successfully! You can now login with your new password.');
    setActiveStep(2);

    setTimeout(() => navigate('/login'), 3000);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP and try again.');
  } finally {
    setLoading(false);
  }
};
const steps = [
  mobileOtpEnabled ? 'Enter your mobile number' : 'Enter your email address',
  'Enter OTP and new password',
  'Password reset complete'
];

if (loadingMode) {
  return (
    <Layout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    </Layout>
  );
}
  return (
    <Layout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              background: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '3px solid #ff9800'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#1a237e',
                  mb: 1
                }}
              >
                पासवर्ड रीसेट करें
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#1a237e',
                  mb: 2
                }}
              >
                Reset Password
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#666' }}
              >
                अपना पासवर्ड रीसेट करने के लिए नीचे दिए गए चरणों का पालन करें
              </Typography>
            </Box>

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

            <Stepper activeStep={activeStep} orientation="vertical">
              {/* Step 1: Email Input */}
              <Step>
                <StepLabel>
                  <Typography variant="h6" sx={{ color: '#1a237e' }}>
              {mobileOtpEnabled ? 'मोबाइल नंबर दर्ज करें' : 'ईमेल दर्ज करें'}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box>
                   
                   {mobileOtpEnabled ? (
  <TextField
    fullWidth
    placeholder="10 अंकों का मोबाइल नंबर"
    value={mobileInput}
    onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
    error={!!mobileInput && mobileInput.length !== 10}
    helperText={
      !mobileInput ? 'मोबाइल नंबर आवश्यक है' :
      mobileInput.length !== 10 ? 'मोबाइल नंबर 10 अंक का होना चाहिए' : ''
    }
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Phone sx={{ color: '#1a237e' }} />
        </InputAdornment>
      ),
    }}
    sx={{ mb: 3 }}
  />
) : (
  <TextField
    fullWidth
    type="email"
    placeholder="your-email@example.com"
    value={emailInput}
    onChange={(e) => setEmailInput(e.target.value)}
    error={!!emailInput && !/^\S+@\S+\.\S+$/.test(emailInput)}
    helperText={
      !emailInput ? 'ईमेल आवश्यक है' :
      !/^\S+@\S+\.\S+$/.test(emailInput) ? 'कृपया सही ईमेल दर्ज करें' : ''
    }
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Email sx={{ color: '#1a237e' }} />
        </InputAdornment>
      ),
    }}
    sx={{ mb: 3 }}
  />
)}
                    <Box sx={{ mb: 2 }}>
                     <Button
  variant="contained"
  disabled={
    loading ||
    (mobileOtpEnabled
      ? !mobileInput || mobileInput.length !== 10
      : !emailInput || !/^\S+@\S+\.\S+$/.test(emailInput))
  }
  onClick={handleSendOTP}
  sx={{
    py: 1.2,
    px: 4,
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: 2,
    background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
    },
    mr: 1
  }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'OTP भेजें'}
</Button>
                      <Button
                        component={RouterLink}
                        to="/login"
                        sx={{ mt: 1, ml: 1 }}
                      >
                        लॉगिन पर वापस जाएं
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>

              {/* Step 2: OTP and New Password */}
              <Step>
                <StepLabel>
                  <Typography variant="h6" sx={{ color: '#1a237e' }}>
                    OTP और नया पासवर्ड दर्ज करें
                  </Typography>
                </StepLabel>
                <StepContent>
                  <form onSubmit={handleSubmit(handleResetPassword)}>
                    {/* <TextField
                      fullWidth
                      placeholder="6 अंकों का OTP"
                      {...register('otp', {
                        required: 'OTP आवश्यक है',
                        minLength: {
                          value: 6,
                          message: 'OTP कम से कम 6 अंक का होना चाहिए'
                        }
                      })}
                      error={!!errors.otp}
                      helperText={errors.otp?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Verified sx={{ color: '#1a237e' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          }
                        }
                      }}
                    /> */}
<TextField
  fullWidth
  placeholder="4 अंकों का OTP"
  {...register('otp', {
    required: 'OTP आवश्यक है',
    pattern: { value: /^[0-9]{4}$/, message: 'OTP 4 अंक का होना चाहिए' }
  })}
  error={!!errors.otp}
  helperText={errors.otp?.message}
/>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="नया पासवर्ड"
                      {...register('newPassword', {
                        required: 'नया पासवर्ड आवश्यक है',
                        minLength: {
                          value: 6,
                          message: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए'
                        }
                      })}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#1a237e' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          }
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      type="password"
                      placeholder="पासवर्ड की पुष्टि करें"
                      {...register('confirmPassword', {
                        required: 'पासवर्ड की पुष्टि आवश्यक है',
                        validate: (value) => 
                          value === newPassword || 'पासवर्ड मेल नहीं खाता'
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#1a237e' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#1a237e',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1a237e',
                          }
                        }
                      }}
                    />
                    
                    <Box sx={{ mb: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          py: 1.2,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                          },
                          mr: 1
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'पासवर्ड रीसेट करें'}
                      </Button>
                      <Button
                        onClick={() => {
                          setActiveStep(0);
                          setOtpSent(false);
                          setError('');
                          setSuccess('');
                        }}
                        sx={{ mt: 1, ml: 1 }}
                      >
                        वापस जाएं
                      </Button>
                    </Box>
                  </form>
                </StepContent>
              </Step>

              {/* Step 3: Success */}
              <Step>
                <StepLabel>
                  <Typography variant="h6" sx={{ color: '#1a237e' }}>
                    पासवर्ड सफलतापूर्वक रीसेट हो गया
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: '#4caf50' }}>
                      आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है। आप अब अपने नए पासवर्ड से लॉगिन कर सकते हैं।
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="contained"
                      sx={{
                        py: 1.2,
                        px: 4,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                        }
                      }}
                    >
                      लॉगिन करें
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ForgotPassword;