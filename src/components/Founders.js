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
  dark: '#3b0764',
  main: '#6d28d9',
  light: '#a855f7',
  gold: '#facc15',
  soft: '#f5f3ff',
  soft2: '#faf5ff',
  text: '#4c1d95',
  muted: '#5b5b6b'
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
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(124, 58, 237, 0.16)',
        boxShadow: '0 20px 52px rgba(76, 29, 149, 0.12)',
        transition: 'all 0.35s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 30px 76px rgba(76, 29, 149, 0.2)',
          borderColor: 'rgba(124, 58, 237, 0.35)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '7px',
          background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`
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
              ? 'rgba(250, 204, 21, 0.12)'
              : 'rgba(168, 85, 247, 0.12)'
        }
      }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 2.4 },
          pb: 0,
          background:
            'linear-gradient(180deg, rgba(245,243,255,0.96) 0%, rgba(255,255,255,0) 100%)',
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
            background: '#fff',
            border: '1px solid rgba(124, 58, 237, 0.14)',
            boxShadow: '0 14px 34px rgba(76, 29, 149, 0.11)'
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
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
            fontWeight: 900,
            color: theme.main,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
            background: 'linear-gradient(135deg, #f5f3ff, #fffbeb)',
            border: '1px solid rgba(124, 58, 237, 0.18)',
            boxShadow: '0 8px 20px rgba(76, 29, 149, 0.08)'
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
        background: `
          radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 30%),
          radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.15), transparent 34%),
          linear-gradient(180deg, #f5f3ff 0%, #fbfaff 42%, #ffffff 100%)
        `,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
   

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            borderRadius: { xs: '28px', md: '38px' },
            p: { xs: 2.4, sm: 3.5, md: 5 },
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            boxShadow: '0 28px 80px rgba(76, 29, 149, 0.13)',
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
              background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`
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
                  fontSize: '0.82rem'
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
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                  background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`
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