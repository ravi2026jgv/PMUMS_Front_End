import React, { useState } from 'react';
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
import { Email, Lock, Verified } from '@mui/icons-material';
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
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  // Step 1: Send OTP to email
  const handleSendOTP = async (data) => {
    if (!data.email) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Send request to generate OTP using the correct endpoint
      const response = await publicApi.post('/auth/password/send-otp', {
        email: data.email
      });
      
      console.log('API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      setEmail(data.email);
      setOtpSent(true);
      setActiveStep(1);
      setSuccess('OTP sent successfully to your email address');
      
    } catch (err) {
      console.error('Send OTP error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      console.error('Error message:', err.response?.data?.message);
      
      // Handle different error scenarios
      if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection.');
      } else if (err.response?.status === 404) {
        setError('Reset password service is not available. Please try again later.');
      } else if (err.response?.status === 400) {
        setError('Invalid email address. Please check and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with OTP
  const handleResetPassword = async (data) => {
    try {
      setLoading(true);
      setError('');

      const resetData = {
        email: email,
        otp: data.otp,
        newPassword: data.newPassword
      };

      const response = await publicApi.post('/auth/password/reset', resetData);
      
      setSuccess('Password reset successfully! You can now login with your new password.');
      setActiveStep(2);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Enter your email address',
    'Enter OTP and new password',
    'Password reset complete'
  ];

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
                    ईमेल पता दर्ज करें
                  </Typography>
                </StepLabel>
                <StepContent>
                  <form onSubmit={handleSubmit(handleSendOTP)}>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="your-email@example.com"
                      {...register('email', {
                        required: 'ईमेल आवश्यक है',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'कृपया सही ईमेल दर्ज करें'
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#1a237e' }} />
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
                        onClick={() => {
                          console.log('Button clicked - Form should submit');
                        }}
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
                      
                      {/* Test button for debugging */}
                      <Button
                        variant="outlined"
                        onClick={async () => {
                          console.log('🔧 TEST: Direct API call without form');
                          const testEmail = document.querySelector('input[type="email"]')?.value;
                          console.log('📧 Test email:', testEmail);
                          if (testEmail) {
                            await handleSendOTP({ email: testEmail });
                          } else {
                            console.log('❌ No email found in input');
                          }
                        }}
                        sx={{ mt: 1, ml: 1, color: '#ff5722' }}
                      >
                        Test API Call
                      </Button>
                    </Box>
                  </form>
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
                    <TextField
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