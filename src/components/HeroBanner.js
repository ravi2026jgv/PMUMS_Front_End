import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  AccountCircle
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeroBanner = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f8f6f0 0%, #f5f3ed 100%)',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        {/* User Icon */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
            }}
          >
            <AccountCircle 
              sx={{ 
                fontSize: 36, 
                color: 'white' 
              }} 
            />
          </Box>
        </Box>

        {/* Main Heading */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            mb: 1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.2,
            fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
            textAlign: 'center'
          }}
        >
          प्राथमिक माध्यमिक उच्च माध्यमिक शिक्षक संघ म.प्र.
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#ff9800',
            mb: 3,
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
            textAlign: 'center'
          }}
        >
          (पी.एम.यू.एम.एस.)
        </Typography>

        {/* Tagline */}
        <Typography
          variant="h6"
          sx={{
            fontStyle: 'italic',
            color: '#555',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 500,
            fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
            textAlign: 'center',
            position: 'relative',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: 40,
              height: 1,
              backgroundColor: '#ddd',
              transform: 'translateY(-50%)'
            },
            '&::before': {
              left: -60
            },
            '&::after': {
              right: -60
            }
          }}
        >
          "शिक्षकों का संगठन, शिक्षकों के लिए, शिक्षकों द्वारा"
        </Typography>

        {/* Description Box */}
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4,
            border: '1px solid rgba(25, 118, 210, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.8,
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
              textAlign: 'center'
            }}
          >
            PMUMS एक गैर-लाभकारी, सेवा-आधारित संगठन है, जो मध्यप्रदेश राज्य के शिक्षा विभाग एवं जनजातीय कार्य विभाग के अंतर्गत कार्यरत शासकीय शिक्षकों एवं कर्मचारियों के कल्याण, सम्मान, एकजुटता एवं पारस्परिक सहयोग के उद्देश्य से निरंतर सक्रिय है।
            <br /><br />
            इस संगठन का मूल संकल्प यह है कि किसी भी शिक्षक अथवा कर्मचारी के आकस्मिक निधन या कठिन परिस्थितियों में उनके परिवार को आर्थिक एवं सामाजिक रूप से अकेला न रहना पड़े, और सभी सदस्य सामूहिक सहयोग के माध्यम से एक-दूसरे का संबल बनें।
          </Typography>
        </Paper>

        {/* Action Buttons - Only show when not authenticated */}
        {!isAuthenticated && (
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Registration
              </Button>
            </Box>
        )}
      </Container>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: -100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(25, 118, 210, 0.05)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: -100,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 152, 0, 0.05)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

export default HeroBanner;