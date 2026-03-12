import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress
} from '@mui/material';

const Niyamawali = () => {
  // Redirect to external Niyamawali page
  useEffect(() => {
    window.location.href = 'https://pmums.in/niyamawali/';
  }, []);

  // Show loading while redirecting
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#1a237e', fontFamily: 'Poppins' }}>
          नियमावली पेज पर रीडायरेक्ट हो रहा है...
        </Typography>
      </Box>
    </Container>
  );
};

export default Niyamawali;
