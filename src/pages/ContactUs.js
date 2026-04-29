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
  dark: '#3b0764',
  main: '#6d28d9',
  light: '#a855f7',
  gold: '#facc15',
  soft: '#f5f3ff',
  softGold: '#fffbeb',
  text: '#4c1d95',
  muted: '#5b5b6b',
  green: '#16a34a',
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
            fontWeight: 950,
            color: theme.dark,
            fontSize: { xs: '1.18rem', md: '1.35rem' },
            mb: 1,
          }}
        >
          📞 6262565803
        </Typography>

        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 700,
            lineHeight: 1.7,
            mb: 2,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
          }}
        >
          WhatsApp हेल्पलाइन — कृपया केवल WhatsApp पर ही संदेश करें, कॉल न करें।
        </Typography>

        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 650,
            lineHeight: 1.7,
            fontStyle: 'italic',
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
            fontWeight: 900,
            color: theme.dark,
            fontSize: { xs: '1rem', md: '1.05rem' },
            mb: 1.5,
            lineHeight: 1.7,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
          }}
        >
          रजिस्ट्रेशन नम्बर: 06/13/01/14617/23
        </Typography>

        <Typography
          sx={{
            color: theme.muted,
            fontWeight: 700,
            lineHeight: 1.8,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
            fontWeight: 700,
            mb: 0.8,
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
          }}
        >
          सहायता:
        </Typography>

        <Typography
          component="a"
          href="mailto:Info@pmums.com"
          sx={{
            fontWeight: 950,
            color: theme.main,
            fontSize: { xs: '1rem', md: '1.1rem' },
            textDecoration: 'none',
            wordBreak: 'break-word',
            borderBottom: '1px solid rgba(109, 40, 217, 0.35)',
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

const ContactCard = ({ item, index }) => (
  <Grid item xs={12} md={4}>
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: { xs: '26px', md: '32px' },
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(124, 58, 237, 0.15)',
        boxShadow: '0 22px 60px rgba(76, 29, 149, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.35s ease',

        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 30px 76px rgba(76, 29, 149, 0.20)',
          borderColor: 'rgba(124, 58, 237, 0.32)',
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: 150,
          height: 150,
          borderRadius: '50%',
          right: -70,
          bottom: -80,
          background:
            index % 2 === 0
              ? 'rgba(168, 85, 247, 0.12)'
              : 'rgba(250, 204, 21, 0.14)',
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
            color: '#fff',
            background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
            boxShadow: '0 14px 32px rgba(124, 58, 237, 0.26)',
          }}
        >
          {item.icon}
        </Box>

        <Chip
          label={item.chip}
          sx={{
            mb: 2,
            color: theme.dark,
            fontWeight: 900,
            background: '#fffbeb',
            border: '1px solid rgba(250, 204, 21, 0.35)',
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
          }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 950,
            mb: 2.5,
            color: theme.dark,
            fontSize: { xs: '1.25rem', md: '1.35rem' },
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
          }}
        >
          {item.title}
        </Typography>

        <Box sx={{ textAlign: 'center' }}>{item.content}</Box>
      </CardContent>
    </Card>
  </Grid>
);

const ContactUs = () => {
  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 6, md: 9 },
          background: `
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.13), transparent 30%),
            radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #fbfaff 45%, #f5f3ff 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            top: -170,
            left: -130,
            background: 'rgba(124, 58, 237, 0.10)',
            filter: 'blur(8px)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 310,
            height: 310,
            borderRadius: '50%',
            right: -120,
            bottom: -140,
            background: 'rgba(250, 204, 21, 0.16)',
            filter: 'blur(10px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={{ xs: 4, md: 5 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.main,
                fontWeight: 900,
                letterSpacing: '1.5px',
                fontSize: '0.82rem',
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
                fontWeight: 950,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
              }}
            />

            <Typography
              sx={{
                mt: 2.5,
                color: theme.muted,
                fontWeight: 700,
                lineHeight: 1.8,
                maxWidth: 760,
                mx: 'auto',
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              सहायता, पंजीकरण या संगठन से संबंधित जानकारी के लिए नीचे दिए गए माध्यमों से संपर्क करें।
            </Typography>
          </Box>

          <Grid container spacing={1}>
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
              background: 'rgba(255,255,255,0.86)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              boxShadow: '0 24px 70px rgba(76, 29, 149, 0.12)',
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
                background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
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
                color: '#fff',
                background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                boxShadow: '0 14px 32px rgba(124, 58, 237, 0.26)',
              }}
            >
              <AccessTimeRounded sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 950,
                mb: 2,
                color: theme.dark,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              कार्य समय
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Typography
                  sx={{
                    color: theme.muted,
                    fontWeight: 750,
                    lineHeight: 1.7,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                    fontWeight: 750,
                    lineHeight: 1.7,
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                    fontWeight: 750,
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
              background:
                'linear-gradient(135deg, rgba(255,251,235,0.92), rgba(255,255,255,0.88))',
              border: '1px solid rgba(250, 204, 21, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              textAlign: 'center',
              flexWrap: 'wrap',
            }}
          >
            <WhatsApp sx={{ color: theme.green, fontSize: 30 }} />

            <Typography
              sx={{
                color: theme.dark,
                fontWeight: 900,
                fontSize: { xs: '0.98rem', md: '1.05rem' },
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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