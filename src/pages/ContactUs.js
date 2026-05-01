import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  AccessTimeRounded,
  WhatsApp,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  border: '#ded8f5',
};

const contactCards = [
  {
    title: 'फोन नंबर',
    icon: <Phone sx={{ fontSize: 36 }} />,
    chip: 'WhatsApp Helpline',
    content: (
      <>
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.dark,
            fontSize: { xs: '1.18rem', md: '1.35rem' },
            mb: 1,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          }}
        >
          📞 6262565803
        </Typography>

        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 600,
            lineHeight: 1.7,
            mb: 2,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          }}
        >
          WhatsApp हेल्पलाइन — कृपया केवल WhatsApp पर ही संदेश करें, कॉल न करें।
        </Typography>

        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 600,
            lineHeight: 1.7,
            fontStyle: 'italic',
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          }}
        >
          सहायता/पंजीकरण के लिए व्हाट्सऐप द्वारा संपर्क करें।
        </Typography>
      </>
    ),
  },
  {
    title: 'पंजीकृत कार्यालय',
    icon: <LocationOn sx={{ fontSize: 36 }} />,
    chip: 'Registered Office',
    content: (
      <>
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.dark,
            fontSize: { xs: '1rem', md: '1.05rem' },
            mb: 1.5,
            lineHeight: 1.7,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          }}
        >
          रजिस्ट्रेशन नम्बर: 06/13/01/14617/23
        </Typography>

        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 600,
            lineHeight: 1.8,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          }}
        >
          सुभाष पुरम रोड, हेलिपैड के पीछे,
          <br />
          टीकमगढ़, मध्यप्रदेश - 472001
        </Typography>
      </>
    ),
  },
  {
    title: 'ईमेल',
    icon: <Email sx={{ fontSize: 36 }} />,
    chip: 'Support Email',
    content: (
      <>
        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 600,
            mb: 0.8,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
          }}
        >
          सहायता:
        </Typography>

        <Typography
          component="a"
          href="mailto:Info@pmums.com"
          sx={{
            fontWeight: 700,
            color: theme.accent,
            fontSize: { xs: '1rem', md: '1.1rem' },
            textDecoration: 'none',
            wordBreak: 'break-word',
            borderBottom: '1px solid rgba(15, 118, 110, 0.35)',
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            '&:hover': {
              color: theme.dark,
            },
          }}
        >
          Info@pmums.com
        </Typography>
      </>
    ),
  },
];

const ContactCard = ({ item, index }) => {
  const isAccent = index % 2 !== 0;

  return (
    <Grid item xs={10} md={6}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: { xs: '26px', md: '32px' },
          background: '#ffffff',
          border: isAccent
            ? '1px solid rgba(15, 118, 110, 0.18)'
            : '1px solid rgba(111, 92, 194, 0.16)',
          boxShadow: '0 22px 60px rgba(34, 27, 67, 0.10)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.35s ease',

          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 30px 76px rgba(34, 27, 67, 0.16)',
            borderColor: isAccent
              ? 'rgba(15, 118, 110, 0.32)'
              : 'rgba(111, 92, 194, 0.32)',
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 7,
            background: isAccent ? theme.accent : theme.main,
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: '50%',
            right: -70,
            bottom: -80,
            background: isAccent
              ? 'rgba(15, 118, 110, 0.08)'
              : 'rgba(111, 92, 194, 0.10)',
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, md: 3.5 },
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '22px',
              mx: 'auto',
              mb: 2.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              background: isAccent ? theme.accent : theme.main,
              boxShadow: isAccent
                ? '0 14px 32px rgba(15, 118, 110, 0.24)'
                : '0 14px 32px rgba(111, 92, 194, 0.24)',
            }}
          >
            {item.icon}
          </Box>

          <Chip
            label={item.chip}
            sx={{
              mb: 2,
              color: isAccent ? '#ffffff' : theme.dark,
              fontWeight: 700,
              background: isAccent ? theme.accent : theme.soft,
              border: isAccent
                ? '1px solid rgba(15, 118, 110, 0.25)'
                : '1px solid rgba(111, 92, 194, 0.20)',
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 2.5,
              color: theme.dark,
              fontSize: { xs: '1.25rem', md: '1.35rem' },
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            }}
          >
            {item.title}
          </Typography>

          <Box sx={{ textAlign: 'center' }}>{item.content}</Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

const ContactUs = () => {
  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 6, md: 9 },
          background: theme.soft,
          position: 'relative',
          overflow: 'hidden',

         
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.main,
                fontWeight: 700,
                letterSpacing: '1.5px',
                fontSize: '0.82rem',
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              CONTACT PMUMS
            </Typography>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                mt: 0.6,
                color: theme.dark,
                fontWeight: 700,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                fontSize: { xs: '2rem', md: '3rem' },
                lineHeight: 1.25,
              }}
            >
              संपर्क करें
            </Typography>

            <Box
              sx={{
                width: 95,
                height: 5,
                borderRadius: 99,
                mx: 'auto',
                mt: 2,
                background: theme.main,
              }}
            />

            <Typography
              sx={{
                mt: 2.5,
                color: theme.muted,
                fontWeight: 600,
                lineHeight: 1.8,
                maxWidth: 760,
                mx: 'auto',
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              सहायता, पंजीकरण या संगठन से संबंधित जानकारी के लिए नीचे दिए गए माध्यमों से संपर्क करें।
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {contactCards.map((item, index) => (
              <ContactCard key={item.title} item={item} index={index} />
            ))}
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mt: 4,
              borderRadius: { xs: '26px', md: '32px' },
              background: '#ffffff',
              border: '1px solid rgba(111, 92, 194, 0.16)',
              boxShadow: '0 24px 70px rgba(34, 27, 67, 0.10)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',

              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 7,
                background: theme.main,
              },
            }}
          >
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '22px',
                mx: 'auto',
                mb: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                background: theme.main,
                boxShadow: '0 14px 32px rgba(111, 92, 194, 0.24)',
              }}
            >
              <AccessTimeRounded sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.dark,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              कार्य समय
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Typography
                  sx={{
                    color: theme.muted,
                    fontWeight: 600,
                    lineHeight: 1.7,
                    fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                  }}
                >
                  सोमवार से शुक्रवार
                  <br />
                  सुबह 9:00 बजे से शाम 6:00 बजे तक
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  sx={{
                    color: theme.muted,
                    fontWeight: 600,
                    lineHeight: 1.7,
                    fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                  }}
                >
                  शनिवार
                  <br />
                  सुबह 10:00 बजे से दोपहर 2:00 बजे तक
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  sx={{
                    color: theme.muted,
                    fontWeight: 600,
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                  }}
                >
                  रविवार और राष्ट्रीय अवकाश के दिन बंद
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: { xs: 2.5, md: 3 },
              borderRadius: '24px',
              background: theme.softAccent,
              border: '1px solid rgba(15, 118, 110, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              textAlign: 'center',
              flexWrap: 'wrap',
            }}
          >
            <WhatsApp sx={{ color: theme.accent, fontSize: 30 }} />

            <Typography
              sx={{
                color: theme.dark,
                fontWeight: 700,
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              कृपया WhatsApp हेल्पलाइन पर केवल संदेश भेजें, कॉल न करें।
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ContactUs;