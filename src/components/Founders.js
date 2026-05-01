import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Chip
} from '@mui/material';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  soft2: '#ffffff',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  border: '#ded8f5'
};

const foundersData = [
  {
    id: 1,
    name: 'श्री सतीश कुमार खरे',
    title: 'संस्थापक',
    image: '/admin3.jpeg',
    alt: 'श्री सतीश कुमार खरे'
  },
  {
    id: 2,
    name: 'श्री बृजेश कुमार असाटी',
    title: 'सह संस्थापक',
    image: '/admin1.png',
    alt: 'श्री बृजेश कुमार असाटी'
  },
  {
    id: 3,
    name: 'श्री मुरली मनोहर अरजरिया',
    title: 'सह संस्थापक',
    image: '/admin2.jpeg',
    alt: 'श्री मुरली मनोहर अरजरिया'
  }
];

const FounderCard = ({ founder, index }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        borderRadius: { xs: '26px', md: '32px' },
        overflow: 'hidden',
        position: 'relative',
        background: '#ffffff',
        border: '1px solid rgba(111, 92, 194, 0.16)',
        boxShadow: '0 20px 52px rgba(34, 27, 67, 0.10)',
        transition: 'all 0.35s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 30px 76px rgba(34, 27, 67, 0.16)',
          borderColor: 'rgba(111, 92, 194, 0.35)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '7px',
          background: index === 0 ? theme.accent : theme.main
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 150,
          height: 150,
          borderRadius: '50%',
          right: -75,
          bottom: -80,
          background:
            index === 0
              ? 'rgba(15, 118, 110, 0.08)'
              : 'rgba(111, 92, 194, 0.10)'
        }
      }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 2.4 },
          pb: 0,
          background: theme.soft,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: { xs: 275, sm: 285, md: 300 },
            borderRadius: '24px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid rgba(111, 92, 194, 0.14)',
            boxShadow: '0 14px 34px rgba(34, 27, 67, 0.10)'
          }}
        >
          <Box
            component="img"
            src={founder.image}
            alt={founder.alt}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              transition: 'all 0.45s ease',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.045)'
              }
            }}
          />
        </Box>
      </Box>

      <CardContent
        sx={{
          px: { xs: 2.5, md: 3 },
          pt: 3,
          pb: 4,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 950,
            color: theme.text,
            mb: 1.4,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            fontSize: { xs: '1.18rem', md: '1.3rem' },
            lineHeight: 1.35
          }}
        >
          {founder.name}
        </Typography>

        <Chip
          label={founder.title}
          sx={{
            px: 1.5,
            height: 36,
            fontWeight: 600,
            color: index === 0 ? '#ffffff' : theme.dark,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            background: index === 0 ? theme.accent : theme.soft,
            border: index === 0
              ? '1px solid rgba(15, 118, 110, 0.25)'
              : '1px solid rgba(111, 92, 194, 0.18)',
            boxShadow: '0 8px 20px rgba(34, 27, 67, 0.08)'
          }}
        />
      </CardContent>
    </Card>
  </Grid>
);

const Founders = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 9 },
        background: '#342c60',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            borderRadius: { xs: '28px', md: '38px' },
            p: { xs: 2.4, sm: 3.5, md: 5 },
            background: '#ffffff',
            border: '1px solid rgba(111, 92, 194, 0.16)',
            boxShadow: '0 28px 80px rgba(34, 27, 67, 0.12)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 7,
              background: theme.main
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                textAlign: 'center',
                mb: { xs: 4, md: 5 }
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: theme.main,
                  fontWeight: 900,
                  letterSpacing: '1.5px',
                  fontSize: '0.82rem',
                  fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                }}
              >
                PMUMS LEADERSHIP
              </Typography>

              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mt: 0.6,
                  color: theme.dark,
                  fontWeight: 950,
                  fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                  fontSize: { xs: '1.8rem', md: '2.45rem' },
                  lineHeight: 1.25
                }}
              >
                संस्थापक मंडल
              </Typography>

              <Box
                sx={{
                  width: 95,
                  height: 5,
                  borderRadius: 99,
                  mx: 'auto',
                  mt: 2,
                  background: theme.main
                }}
              />
            </Box>

            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="stretch">
              {foundersData.map((founder, index) => (
                <FounderCard key={founder.id} founder={founder} index={index} />
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Founders;