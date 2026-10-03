import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { usePortal } from './PortalContext';

const PortalNotFound = () => {
  const { path } = usePortal();

  return (
    <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 900, color: '#221b43' }}>
          404
        </Typography>
        <Typography sx={{ mt: 1, mb: 3, color: '#6b7280', fontWeight: 600 }}>
          Page not found in this portal.
        </Typography>
        <Button variant="contained" href={path('/')} sx={{ bgcolor: '#221b43' }}>
          Go to Portal Home
        </Button>
      </Box>
    </Box>
  );
};

export default PortalNotFound;
