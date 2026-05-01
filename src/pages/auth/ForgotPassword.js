import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  InputAdornment,
} from '@mui/material';
import { Email, Lock, Verified, Phone, PasswordRounded } from '@mui/icons-material';
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
          mobileNumber: mobileInput,
        });

        setMobileNumber(mobileInput);
        setSuccess('OTP sent successfully to your mobile number');
      } else {
        if (!emailInput || !/^\S+@\S+\.\S+$/.test(emailInput)) {
          setError('Please enter a valid email address');
          return;
        }

        await publicApi.post('/auth/password/send-otp', {
          email: emailInput,
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

  const handleResetPassword = async (data) => {
    try {
      setLoading(true);
      setError('');

      const resetData = mobileOtpEnabled
        ? {
            mobileNumber,
            otp: data.otp,
            newPassword: data.newPassword,
          }
        : {
            email,
            otp: data.otp,
            newPassword: data.newPassword,
          };

      await publicApi.post('/auth/password/reset', resetData);

      setSuccess('Password reset successfully! You can now login with your new password.');
      setActiveStep(2);

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to reset password. Please check your OTP and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    mobileOtpEnabled ? 'Enter your mobile number' : 'Enter your email address',
    'Enter OTP and new password',
    'Password reset complete',
  ];

  const fontFamily = 'Noto Sans Devanagari, Poppins, Arial, sans-serif';

  const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  soft2: '#ffffff',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  green: '#0f766e',
  red: '#b42318',
  border: '#ded8f5',
};

 const inputSx = {
  mb: 3,
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: '#ffffff',
    transition: 'all 0.25s ease',
    '& fieldset': {
      borderColor: 'rgba(111, 92, 194, 0.18)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(111, 92, 194, 0.42)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: theme.text,
    fontWeight: 600,
    fontFamily,
  },
  '& .MuiFormHelperText-root': {
    fontWeight: 600,
    fontFamily,
  },
};

  const primaryButtonSx = {
  py: 1.25,
  px: 4,
  fontSize: '1rem',
  fontWeight: 700,
  borderRadius: '16px',
  textTransform: 'none',
  fontFamily,
  color: '#fff',
  background: theme.accent,
  boxShadow: '0 14px 32px rgba(15, 118, 110, 0.28)',
  transition: 'all 0.25s ease',
  '&:hover': {
    background: '#0b5f59',
    transform: 'translateY(-2px)',
    boxShadow: '0 18px 42px rgba(15, 118, 110, 0.36)',
  },
  '&:disabled': {
    background: '#9ca3af',
    color: '#fff',
  },
};

  const outlineButtonSx = {
  py: 1.15,
  px: 3,
  fontWeight: 700,
  borderRadius: '16px',
  textTransform: 'none',
  fontFamily,
  color: theme.main,
  borderColor: 'rgba(111, 92, 194, 0.35)',
  '&:hover': {
    borderColor: theme.main,
    background: 'rgba(111, 92, 194, 0.08)',
  },
};

  if (loadingMode) {
    return (
      <Layout>
        <Box
          sx={{
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
           background: theme.soft,  }}
        >
          <CircularProgress sx={{ color: theme.main }} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 200px)',
         background: theme.soft,  display: 'flex',
          alignItems: 'center',
          py: { xs: 5, md: 7 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              borderRadius: { xs: '28px', md: '36px' },
             background: '#ffffff',
boxShadow: '0 30px 90px rgba(34, 27, 67, 0.12)',
border: '1px solid rgba(111, 92, 194, 0.16)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 8,
background: theme.main,              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
              <Box
                sx={{
                  width: 78,
                  height: 78,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '26px',
background: theme.main,
boxShadow: '0 16px 38px rgba(111, 92, 194, 0.28)',                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PasswordRounded sx={{ fontSize: 40 }} />
              </Box>

              <Typography
                variant="overline"
                sx={{
                  color: theme.main,
                  fontWeight: 950,
                  letterSpacing: '1.5px',
                  fontSize: '0.8rem',
                  fontFamily,
                }}
              >
                ACCOUNT RECOVERY
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 950,
                  color: theme.dark,
                  mt: 0.6,
                  mb: 0.8,
                  fontFamily,
                  fontSize: { xs: '1.9rem', md: '2.35rem' },
                }}
              >
                पासवर्ड रीसेट करें
              </Typography>

              <Typography
                sx={{
                  color: theme.muted,
                  mb: 2,
                  fontWeight: 800,
                  fontFamily,
                  fontSize: { xs: '0.96rem', md: '1rem' },
                }}
              >
                Reset Password
              </Typography>

              <Box
                sx={{
                  width: 96,
                  height: 5,
                  borderRadius: 99,
                  mx: 'auto',
                  mb: 2,
                  background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: theme.muted,
                  fontWeight: 700,
                  fontFamily,
                  lineHeight: 1.7,
                }}
              >
                अपना पासवर्ड रीसेट करने के लिए नीचे दिए गए चरणों का पालन करें
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontFamily,
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontFamily,
                }}
              >
                {success}
              </Alert>
            )}

            <Box
              sx={{
                p: { xs: 1, md: 2 },
                borderRadius: '26px',
                background: theme.soft,
border: '1px solid rgba(111, 92, 194, 0.14)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                sx={{
                  '& .MuiStepLabel-label': {
                    fontFamily,
                  },
                  '& .MuiStepIcon-root': {
                    color: 'rgba(124,58,237,0.24)',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: theme.main,
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: theme.green,
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: 'rgba(124,58,237,0.18)',
                  },
                }}
              >
                {/* Step 1 */}
                <Step>
                  <StepLabel>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.dark,
                        fontWeight: 950,
                        fontFamily,
                        fontSize: { xs: '1rem', md: '1.15rem' },
                      }}
                    >
                      {mobileOtpEnabled ? 'मोबाइल नंबर दर्ज करें' : 'ईमेल दर्ज करें'}
                    </Typography>
                  </StepLabel>

                  <StepContent>
                    <Box sx={{ pt: 1 }}>
                      {mobileOtpEnabled ? (
                        <TextField
                          fullWidth
                          placeholder="10 अंकों का मोबाइल नंबर"
                          value={mobileInput}
                          onChange={(e) =>
                            setMobileInput(e.target.value.replace(/\D/g, '').slice(0, 10))
                          }
                          error={!!mobileInput && mobileInput.length !== 10}
                          helperText={
                            !mobileInput
                              ? 'मोबाइल नंबर आवश्यक है'
                              : mobileInput.length !== 10
                              ? 'मोबाइल नंबर 10 अंक का होना चाहिए'
                              : ''
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: theme.main }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
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
                            !emailInput
                              ? 'ईमेल आवश्यक है'
                              : !/^\S+@\S+\.\S+$/.test(emailInput)
                              ? 'कृपया सही ईमेल दर्ज करें'
                              : ''
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: theme.main }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={inputSx}
                        />
                      )}

                      <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
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
                            ...primaryButtonSx,
                            minWidth: { xs: '100%', sm: 150 },
                          }}
                        >
                          {loading ? <CircularProgress size={22} color="inherit" /> : 'OTP भेजें'}
                        </Button>

                        <Button
                          component={RouterLink}
                          to="/login"
                          variant="outlined"
                          sx={{
                            ...outlineButtonSx,
                            minWidth: { xs: '100%', sm: 170 },
                          }}
                        >
                          लॉगिन पर वापस जाएं
                        </Button>
                      </Box>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 2 */}
                <Step>
                  <StepLabel>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.dark,
                        fontWeight: 950,
                        fontFamily,
                        fontSize: { xs: '1rem', md: '1.15rem' },
                      }}
                    >
                      OTP और नया पासवर्ड दर्ज करें
                    </Typography>
                  </StepLabel>

                  <StepContent>
                    <Box component="form" onSubmit={handleSubmit(handleResetPassword)} sx={{ pt: 1 }}>
                      <TextField
                        fullWidth
                        placeholder="4 अंकों का OTP"
                        {...register('otp', {
                          required: 'OTP आवश्यक है',
                          pattern: { value: /^[0-9]{4}$/, message: 'OTP 4 अंक का होना चाहिए' },
                        })}
                        error={!!errors.otp}
                        helperText={errors.otp?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Verified sx={{ color: theme.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        type="password"
                        placeholder="नया पासवर्ड"
                        {...register('newPassword', {
                          required: 'नया पासवर्ड आवश्यक है',
                          minLength: {
                            value: 6,
                            message: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
                          },
                        })}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: theme.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      <TextField
                        fullWidth
                        type="password"
                        placeholder="पासवर्ड की पुष्टि करें"
                        {...register('confirmPassword', {
                          required: 'पासवर्ड की पुष्टि आवश्यक है',
                          validate: (value) => value === newPassword || 'पासवर्ड मेल नहीं खाता',
                        })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: theme.main }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />

                      <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            ...primaryButtonSx,
                            minWidth: { xs: '100%', sm: 210 },
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={22} color="inherit" />
                          ) : (
                            'पासवर्ड रीसेट करें'
                          )}
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={() => {
                            setActiveStep(0);
                            setOtpSent(false);
                            setError('');
                            setSuccess('');
                          }}
                          sx={{
                            ...outlineButtonSx,
                            minWidth: { xs: '100%', sm: 130 },
                          }}
                        >
                          वापस जाएं
                        </Button>
                      </Box>
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 3 */}
                <Step>
                  <StepLabel>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.dark,
                        fontWeight: 950,
                        fontFamily,
                        fontSize: { xs: '1rem', md: '1.15rem' },
                      }}
                    >
                      पासवर्ड सफलतापूर्वक रीसेट हो गया
                    </Typography>
                  </StepLabel>

                  <StepContent>
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 3,
                        px: 2,
                        borderRadius: '22px',
                        background:
                          'linear-gradient(135deg, rgba(240,253,244,0.96), rgba(255,255,255,0.92))',
                        border: '1px solid rgba(22, 163, 74, 0.16)',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          color: '#166534',
                          fontWeight: 850,
                          fontFamily,
                          lineHeight: 1.7,
                        }}
                      >
                        आपका पासवर्ड सफलतापूर्वक रीसेट हो गया है। आप अब अपने नए पासवर्ड से
                        लॉगिन कर सकते हैं।
                      </Typography>

                      <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        sx={{
                          ...primaryButtonSx,
                          background: `linear-gradient(135deg, ${theme.green}, #22c55e)`,
                          boxShadow: '0 14px 32px rgba(22, 163, 74, 0.24)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #166534, #16a34a)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 18px 42px rgba(22, 163, 74, 0.34)',
                          },
                        }}
                      >
                        लॉगिन करें
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ForgotPassword;