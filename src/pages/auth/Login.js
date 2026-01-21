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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout/Layout';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    try {
      setError('');
      
      // Map employeeId to userId for backend compatibility
      const credentials = {
        userId: data.employeeId,
        password: data.password
      };
      
      const response = await login(credentials);
      
      // Get user data from response
      const userData = response.user || response.data?.user;
      const userRole = userData?.role || userData?.roles;
      
      // Redirect based on role
      if (userRole === 'ADMIN' || (Array.isArray(userRole) && userRole.includes('ADMIN'))) {
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 100);
      } else {
        setTimeout(() => {
          navigate(from === '/admin/dashboard' ? '/' : from, { replace: true });
        }, 100);
      }
      
    } catch (err) {
      let errorMessage = 'लॉगिन में त्रुटि हुई है';
      
      if (err.response?.status === 403) {
        errorMessage = 'लॉगिन की अनुमति नहीं है। कृपया अपनी ID और पासवर्ड जाँच लें।';
      } else if (err.response?.status === 401) {
        errorMessage = 'गलत ID या पासवर्ड। कृपया पुनः कोशिश करें।';
      }
      
      setError(err.response?.data?.message || errorMessage);
    }
  };

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
        <Container maxWidth="sm">
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
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#1565c0',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Login
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontSize: '1rem'
                }}
              >
                Enter the details to login to your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  fontWeight: '600',
                  color: '#333'
                }}
              >
                Registration Number
              </Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter Registration Number"
                {...register('employeeId', {
                  required: 'Registration Number is required'
                })}
                error={!!errors.employeeId}
                helperText={errors.employeeId?.message}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff9800'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9800',
                      borderWidth: 2
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#ff9800' }} />
                    </InputAdornment>
                  )
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  mb: 1,
                  fontWeight: '600',
                  color: '#333'
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                {...register('password', {
                  required: 'पासवर्ड आवश्यक है'
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#ff9800'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9800',
                      borderWidth: 2
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#ff9800' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                {/* TEMPORARILY HIDDEN - Forgot password link commented out due to issues */}
                 <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{
                    color: '#1565c0',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
                  },
                  '&:disabled': {
                    background: '#ccc'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                 <Link
                  component={RouterLink}
                  to="/forgot-password"
                  sx={{
                    color: '#1a237e',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    mb: 3,
                    display: 'block',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  पासवर्ड भूल गए? (Forgot Password?)
                </Link> 
                
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    mb: 2,
                    fontSize: '0.9rem'
                  }}
                >
                  New User?
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    borderColor: '#1565c0',
                    color: '#1565c0',
                    '&:hover': {
                      borderColor: '#1565c0',
                      background: 'rgba(21, 101, 192, 0.05)'
                    }
                  }}
                >
                  Registration
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Login;