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
import { red } from '@mui/material/colors';

const HeroBanner = ({ children }) => {
  const { isAuthenticated } = useAuth();
const channelLink = 'https://whatsapp.com/channel/0029Vaw20ci5K3zZkmv3jV1g';

const handleChannelClick = () => {
  window.open(channelLink, '_blank');
};
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
  onClick={handleChannelClick}
  sx={{
    px: { xs: 1.1, sm: 1.8 },
    py: { xs: 0.75, sm: 1 },
    borderRadius: { xs: '14px', sm: '18px' },
    bgcolor: '#ffffff',
    color: '#1f2937',
    border: '1px solid rgba(37, 211, 102, 0.25)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
    fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
    display: 'block',
    maxWidth: { xs: 185, sm: 'none' },
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 28px rgba(27, 92, 51, 0.28)',
      borderColor: '#25D366'
    }
  }}
>
  <Typography
    sx={{
      fontSize: { xs: '0.68rem', sm: '0.82rem' },
      fontWeight: 800,
      lineHeight: 1.25,
      whiteSpace: 'normal'

    }}
  >
    Join this WhatsApp Channel
  </Typography>

  <Typography
    sx={{
     textAlign: 'center',
      fontSize: { xs: '0.62rem', sm: '0.72rem' },
      fontWeight: 700,
      color: '#128C7E',
      lineHeight: 1.25,
      whiteSpace: 'normal'
    }}
  >
    पी एम यू एम कल्याण कोष
  </Typography>
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
<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    mb: 4,
    mt: 1,
  }}
>
  <Typography
    sx={{
      color: '#b91c1c',
      background: '#fff1f2',
      border: '1px solid #fecdd3',
      borderRadius: '14px',
      px: { xs: 2, sm: 3 },
      py: { xs: 1.3, sm: 1.5 },
      maxWidth: 850,
      textAlign: 'center',
      fontWeight: 800,
      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
      lineHeight: 1.7,
      fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
      boxShadow: '0 8px 24px rgba(185, 28, 28, 0.18)',
    }}
  >
प्रिय साथियों, PMUMS कर्मचारी कल्याण कोष की सहयोग प्रक्रिया प्रारंभ हो चुकी है। <br/>सहयोग अवधि दिनांक 05 जून 2026 से 20 जून 2026 तक निर्धारित की गई है तथा सहयोग राशि ₹180 मात्र है। <br/>सभी सम्मानित सदस्यों से निवेदन है कि निर्धारित अवधि के भीतर अपना सहयोग अवश्य पूर्ण करें एवं सहयोग के पश्चात UTR नंबर दर्ज करना न भूलें। आपका सहयोग दिवंगत साथी कर्मचारियों के परिवारों को आर्थिक संबल प्रदान करने में महत्वपूर्ण भूमिका निभाएगा।
  </Typography>
</Box>
        {/* Description Box */}
       

        {/* Action Buttons - Only show when not authenticated */}
        {!isAuthenticated && (
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              mb:4,
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
        {children && (
  <Box
    sx={{
      mt: { xs: 1, md: 1 },
      mb: 4,
    }}
  >
    {children}
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