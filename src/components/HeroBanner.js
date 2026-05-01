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
        background: `
  linear-gradient(135deg, #221b43 0%, #30295c 48%, #3b3268 100%)
`,
        color: 'white',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
            background: '#ffffff',
border: '3px solid #c8bfff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <AccountCircle
              sx={{
                fontSize: 36,
              color: '#221b43'
              }}
            />
          </Box>
        </Box>

        {/* Main Heading */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#ffffff',
            mb: 1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            lineHeight: 1.2,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
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
          color: '#ffffff',
textShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
            mb: 3,
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
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
          color: '#f2f0ff',
textShadow: '0 2px 8px rgba(0, 0, 0, 0.30)',
            mb: 4,
            fontSize: { xs: '1rem', md: '1.2rem' },
            fontWeight: 500,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            textAlign: 'center',
            position: 'relative',
            display: 'inline-block',
            left: '50%',
            transform: 'translateX(-50%)',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: { xs: 24, md: 40 },
              height: 1,
            backgroundColor: '#c8bfff',
              transform: 'translateY(-50%)'
            },
            '&::before': {
              left: { xs: -36, md: -60 }
            },
            '&::after': {
              right: { xs: -36, md: -60 }
            }
          }}
        >
          "शिक्षकों का संगठन, शिक्षकों के लिए, शिक्षकों द्वारा"
        </Typography>

        {/* Description Box */}
        <Paper
          elevation={0}
          sx={{
            background: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4,
            color: '#2f2f3a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)'
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#3d3d48',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.8,
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
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
  background: '#0f7633',
  color: '#ffffff',
  fontWeight: 800,
  fontSize: '1.1rem',
  px: 4.5,
  py: 1.5,
  minWidth: 150,
  borderRadius: 3,
  textTransform: 'none',
  border: '2px solid #0f766e',
  boxShadow: '0 8px 20px rgba(15, 118, 110, 0.35)',
  '&:hover': {
    background: '#0b5f59',
    borderColor: '#0b5f59',
    boxShadow: '0 10px 24px rgba(15, 118, 110, 0.45)',
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
  background: '#ffffff',
  color: '#221b43',
  border: '2px solid #ffffff',
  fontWeight: 800,
  fontSize: '1.1rem',
  px: 4.5,
  py: 1.5,
  minWidth: 170,
  borderRadius: 3,
  textTransform: 'none',
  boxShadow: '0 8px 20px rgba(255, 255, 255, 0.18)',
  '&:hover': {
    background: '#f2f0ff',
    borderColor: '#f2f0ff',
    boxShadow: '0 10px 24px rgba(255, 255, 255, 0.25)',
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
          top: '12%',
          left: -120,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 0
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: -100,
          width: 220,
          height: 220,
          borderRadius: '50%',
         background: 'rgba(242, 214, 139, 0.08)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

export default HeroBanner;