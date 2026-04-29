import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8f6f0 0%, #f5f3ed 100%)',
        width: '100%',
        position: 'relative',

        // ✅ Make full app view 90%
        zoom: '90%',

        // Optional fallback for Firefox
        '@supports not (zoom: 1)': {
          transform: 'scale(0.9)',
          transformOrigin: 'top center',
          width: '111.11%',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1100 }}>
        <Header />
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          position: 'relative',
        }}
      >
        {children}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1000 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;