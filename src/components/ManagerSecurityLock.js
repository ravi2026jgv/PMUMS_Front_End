import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../services/api';

const ManagerSecurityLock = ({ open, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    try {
      setVerifying(true);
      setError('');

      await api.reAuthenticate(password);

      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      sessionStorage.setItem('managerDashboardReAuth', 'true');
      sessionStorage.setItem('managerDashboardReAuthExpiresAt', String(expiresAt));

      setPassword('');
      onSuccess();
    } catch (err) {
      console.error('Re-authentication failed:', err);
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Invalid password. Please try again.'
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={verifying ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Lock color="primary" />
        Manager Dashboard Security
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            For extra security, please enter your password again to access the Manager Dashboard.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          autoFocus
          disabled={verifying}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleVerify();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  disabled={verifying}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} disabled={verifying}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleVerify}
          disabled={verifying}
          startIcon={verifying ? <CircularProgress size={18} color="inherit" /> : <Lock />}
        >
          {verifying ? 'Verifying...' : 'Unlock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManagerSecurityLock;