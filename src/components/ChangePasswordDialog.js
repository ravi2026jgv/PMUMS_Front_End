import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close,
  Security,
  Save,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const ChangePasswordDialog = ({ open, onClose, onSuccess }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch('newPassword');

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Get user ID from localStorage
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
      
      if (!userId) {
        setError('उपयोगकर्ता आईडी नहीं मिली। कृपया पुनः लॉगिन करें।');
        return;
      }
      
      await api.put(`/admin/users/${userId}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      onSuccess('पासवर्ड सफलतापूर्वक बदल दिया गया');
      handleClose();
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'पासवर्ड बदलने में त्रुटि हुई है। कृपया पुनः प्रयास करें।'
      );
    } finally {
      setLoading(false);
    }
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
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(26, 35, 126, 0.3)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security />
          पासवर्ड बदलें
        </Box>
        <IconButton 
          onClick={handleClose} 
          sx={{ 
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ px: 3, py: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Current Password */}
            <TextField
              fullWidth
              type={showCurrentPassword ? 'text' : 'password'}
              label="वर्तमान पासवर्ड"
              {...register('currentPassword', {
                required: 'वर्तमान पासवर्ड आवश्यक है'
              })}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#1a237e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1a237e',
                  },
                },
              }}
            />

            {/* New Password */}
            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              label="नया पासवर्ड"
              {...register('newPassword', {
                required: 'नया पासवर्ड आवश्यक है',
                minLength: {
                  value: 6,
                  message: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'पासवर्ड में कम से कम एक छोटा अक्षर, एक बड़ा अक्षर और एक संख्या होनी चाहिए'
                }
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#1a237e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1a237e',
                  },
                },
              }}
            />

            {/* Confirm New Password */}
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="नया पासवर्ड पुष्टि करें"
              {...register('confirmPassword', {
                required: 'पासवर्ड पुष्टि आवश्यक है',
                validate: value =>
                  value === newPassword || 'पासवर्ड मेल नहीं खाते हैं'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#1a237e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1a237e',
                  },
                },
              }}
            />
          </Box>

          <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
            <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
              <li>पासवर्ड कम से कम 6 अक्षरों का होना चाहिए</li>
              <li>एक छोटा अक्षर (a-z) होना चाहिए</li>
              <li>एक बड़ा अक्षर (A-Z) होना चाहिए</li>
              <li>कम से कम एक संख्या (0-9) होनी चाहिए</li>
            </Box>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: '#666',
              borderColor: '#666',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                borderColor: '#333',
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            रद्द करें
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #5c6bc0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #000051 0%, #3949ab 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(26, 35, 126, 0.3)'
              },
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'बदला जा रहा है...' : 'पासवर्ड बदलें'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordDialog;