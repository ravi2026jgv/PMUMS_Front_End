import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  console.log('Layout component is rendering');
  console.log('Children:', children);
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8f6f0 0%, #f5f3ed 100%)',
      width: '100%',
      position: 'relative'
    }}>
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
          position: 'relative'
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