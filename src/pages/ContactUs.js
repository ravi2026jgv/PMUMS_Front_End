import React from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  AccessTimeRounded,
  EmailRounded,
  LanguageRounded,
  LocationOnRounded,
  OpenInNewRounded,
  PhoneRounded,
  ScheduleRounded,
  SupportAgentRounded,
  VerifiedRounded,
  WhatsApp,
} from '@mui/icons-material';

import Layout from '../components/Layout/Layout';

/* =========================================================
   SHARED CONTACT US

   Used by BOTH:
   /portal/tab1/contact-us
   /portal/tab2/contact-us

   IMPORTANT:
   Do not create a TAB2-specific Contact page.
   ========================================================= */

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

/*
 * Common PMUMS palette.
 *
 * Purple represents the existing PMUMS identity,
 * while teal works naturally with the employee portal.
 *
 * Because Contact Us is common to both portals,
 * this page intentionally uses both accents.
 */
const COLORS = {
  darkest: '#17132f',

  dark: '#221b43',

  purple: '#6f5cc2',

  purpleLight: '#b9a7ff',

  tealDark: '#0f766e',

  teal: '#0d9488',

  tealLight: '#5eead4',

  green: '#15805d',

  softPurple: '#f7f5ff',

  softTeal: '#eefaf8',

  soft: '#f8fafc',

  white: '#ffffff',

  text: '#25233a',

  muted: '#5f6472',

  border: '#e5e2ef',

  purpleBorder:
    'rgba(111,92,194,0.18)',

  tealBorder:
    'rgba(15,118,110,0.18)',
};

/* =========================================================
   COMMON LINKS
   ========================================================= */

const WHATSAPP_NUMBER =
  '916262565803';

const WHATSAPP_DISPLAY =
  '6262565803';

const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_NUMBER}`;

const EMAIL =
  'Info@pmums.com';

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Subhash+Puram+Road+Helipad+Tikamgarh+Madhya+Pradesh+472001';

/* =========================================================
   CONTACT CARD
   ========================================================= */

const ContactCard = ({
  icon,
  eyebrow,
  title,
  children,
  action,
  accent = 'purple',
}) => {
  const isTeal =
    accent === 'teal';

  const accentColor =
    isTeal
      ? COLORS.tealDark
      : COLORS.purple;

  const softColor =
    isTeal
      ? COLORS.softTeal
      : COLORS.softPurple;

  const borderColor =
    isTeal
      ? COLORS.tealBorder
      : COLORS.purpleBorder;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',

        position: 'relative',

        overflow: 'hidden',

        borderRadius: {
          xs: '24px',
          md: '30px',
        },

        bgcolor:
          '#ffffff',

        border:
          `1px solid ${borderColor}`,

        boxShadow:
          '0 18px 50px rgba(31,26,65,0.08)',

        transition:
          'all 0.3s ease',

        '&:hover': {
          transform:
            'translateY(-6px)',

          boxShadow:
            '0 27px 68px rgba(31,26,65,0.14)',
        },

        '&::before': {
          content: '""',

          position: 'absolute',

          top: 0,
          left: 0,
          right: 0,

          height: 6,

          bgcolor:
            accentColor,
        },

        '&::after': {
          content: '""',

          position: 'absolute',

          width: 160,
          height: 160,

          right: -80,
          bottom: -95,

          borderRadius:
            '50%',

          bgcolor:
            isTeal
              ? 'rgba(15,118,110,0.06)'
              : 'rgba(111,92,194,0.07)',

          pointerEvents:
            'none',
        },
      }}
    >
      <CardContent
        sx={{
          height: '100%',

          position: 'relative',

          zIndex: 1,

          p: {
            xs: 2.6,
            md: 3.2,
          },

          display: 'flex',

          flexDirection:
            'column',

          alignItems:
            'center',

          textAlign:
            'center',
        }}
      >
        {/* ICON */}

        <Box
          sx={{
            width: 64,
            height: 64,

            mb: 1.8,

            display: 'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            borderRadius:
              '20px',

            color:
              '#ffffff',

            bgcolor:
              accentColor,

            boxShadow:
              isTeal
                ? '0 13px 28px rgba(15,118,110,0.20)'
                : '0 13px 28px rgba(111,92,194,0.20)',
          }}
        >
          {icon}
        </Box>

        {/* SMALL LABEL */}

        <Chip
          label={eyebrow}
          size="small"
          sx={{
            mb: 1.5,

            color:
              accentColor,

            bgcolor:
              softColor,

            border:
              `1px solid ${borderColor}`,

            fontFamily:
              FONT,

            fontSize:
              '0.72rem',

            fontWeight:
              900,
          }}
        />

        {/* TITLE */}

        <Typography
          component="h2"
          sx={{
            color:
              COLORS.dark,

            fontFamily:
              FONT,

            fontSize: {
              xs: '1.08rem',
              md: '1.2rem',
            },

            fontWeight:
              900,

            lineHeight:
              1.4,
          }}
        >
          {title}
        </Typography>

        {/* CONTENT */}

        <Box
          sx={{
            width:
              '100%',

            flex:
              1,

            mt:
              1.5,
          }}
        >
          {children}
        </Box>

        {/* ACTION */}

        {action && (
          <Box
            sx={{
              width:
                '100%',

              mt:
                2.3,
            }}
          >
            {React.cloneElement(
              action,
              {
                sx: {
                  width:
                    '100%',

                  minHeight:
                    44,

                  borderRadius:
                    2.5,

                  textTransform:
                    'none',

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  bgcolor:
                    accentColor,

                  color:
                    '#ffffff',

                  boxShadow:
                    'none',

                  '&:hover':
                    {
                      bgcolor:
                        isTeal
                          ? '#0b665f'
                          : '#5e4cac',

                      boxShadow:
                        'none',
                    },

                  ...(action.props
                    .sx ||
                    {}),
                },
              }
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/* =========================================================
   CONTACT US
   ========================================================= */

const ContactUs = () => {
  return (
    <Layout>
      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <Box
        sx={{
          position:
            'relative',

          overflow:
            'hidden',

          py: {
            xs: 5,
            md: 6.5,
          },

          background: `
            radial-gradient(
              circle at 10% 20%,
              rgba(185,167,255,0.18),
              transparent 31%
            ),
            radial-gradient(
              circle at 88% 76%,
              rgba(94,234,212,0.13),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              ${COLORS.darkest} 0%,
              ${COLORS.dark} 52%,
              #2b3153 100%
            )
          `,

          borderBottom:
            `4px solid ${COLORS.teal}`,
        }}
      >
        {/* DECORATION */}

        <Box
          sx={{
            position:
              'absolute',

            width: 310,
            height: 310,

            top: -190,
            right: -120,

            borderRadius:
              '50%',

            bgcolor:
              'rgba(255,255,255,0.035)',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position:
              'relative',

            zIndex: 1,

            textAlign:
              'center',
          }}
        >
          {/* HERO ICON */}

          <Box
            sx={{
              width: 70,
              height: 70,

              mx: 'auto',
              mb: 2,

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              borderRadius:
                '22px',

              bgcolor:
                'rgba(255,255,255,0.10)',

              border:
                '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <SupportAgentRounded
              sx={{
                color:
                  COLORS.tealLight,

                fontSize: 40,
              }}
            />
          </Box>

          <Typography
            sx={{
              color:
                COLORS.purpleLight,

              fontFamily:
                FONT,

              fontSize:
                '0.8rem',

              fontWeight:
                900,

              letterSpacing:
                '1.6px',
            }}
          >
            CONTACT PMUMS
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt: 0.6,

              color:
                '#ffffff',

              fontFamily:
                FONT,

              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem',
              },

              fontWeight:
                950,

              lineHeight:
                1.25,
            }}
          >
            संपर्क करें
          </Typography>

          <Box
            sx={{
              width: 95,
              height: 5,

              mx: 'auto',

              mt: 1.7,

              borderRadius:
                99,

              background:
                `linear-gradient(
                  90deg,
                  ${COLORS.purpleLight},
                  ${COLORS.tealLight}
                )`,
            }}
          />

          <Typography
            sx={{
              maxWidth:
                780,

              mx:
                'auto',

              mt:
                2.2,

              color:
                'rgba(255,255,255,0.84)',

              fontFamily:
                FONT,

              fontSize: {
                xs: '0.9rem',
                md: '1rem',
              },

              fontWeight:
                550,

              lineHeight:
                1.8,
            }}
          >
            सहायता, पंजीकरण अथवा PMUMS से संबंधित जानकारी
            के लिए नीचे दिए गए आधिकारिक माध्यमों से संपर्क
            करें।
          </Typography>

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{
              mt: 2.5,
            }}
          >
            <Chip
              icon={
                <VerifiedRounded />
              }
              label="आधिकारिक संपर्क माध्यम"
              sx={{
                color:
                  '#ffffff',

                bgcolor:
                  'rgba(255,255,255,0.08)',

                border:
                  '1px solid rgba(255,255,255,0.16)',

                fontFamily:
                  FONT,

                fontWeight:
                  800,

                '& .MuiChip-icon':
                  {
                    color:
                      COLORS.tealLight,
                  },
              }}
            />

            <Chip
              icon={
                <WhatsApp />
              }
              label="WhatsApp Support"
              sx={{
                color:
                  '#ffffff',

                bgcolor:
                  'rgba(21,128,93,0.20)',

                border:
                  '1px solid rgba(94,234,212,0.18)',

                fontFamily:
                  FONT,

                fontWeight:
                  800,

                '& .MuiChip-icon':
                  {
                    color:
                      '#86efac',
                  },
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* ================================================== */}
      {/* CONTACT BODY */}
      {/* ================================================== */}

      <Box
        sx={{
          minHeight:
            '70vh',

          py: {
            xs: 5,
            md: 7,
          },

          background: `
            radial-gradient(
              circle at top left,
              rgba(111,92,194,0.055),
              transparent 28%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(15,118,110,0.055),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #fafbff 45%,
              #f3faf9 100%
            )
          `,
        }}
      >
        <Container maxWidth="lg">
          {/* ================================================= */}
          {/* INTRO */}
          {/* ================================================= */}

          <Box
            sx={{
              maxWidth:
                850,

              mx:
                'auto',

              mb: {
                xs: 3.5,
                md: 4.5,
              },

              textAlign:
                'center',
            }}
          >
            <Typography
              sx={{
                color:
                  COLORS.tealDark,

                fontFamily:
                  FONT,

                fontSize:
                  '0.76rem',

                fontWeight:
                  900,

                letterSpacing:
                  '1.3px',
              }}
            >
              GET IN TOUCH
            </Typography>

            <Typography
              component="h2"
              sx={{
                mt:
                  0.6,

                color:
                  COLORS.dark,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '1.45rem',
                  md: '1.9rem',
                },

                fontWeight:
                  950,

                lineHeight:
                  1.35,
              }}
            >
              हम आपकी सहायता के लिए उपलब्ध हैं
            </Typography>

            <Typography
              sx={{
                mt:
                  1.2,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.88rem',
                  md: '0.96rem',
                },

                fontWeight:
                  550,

                lineHeight:
                  1.75,
              }}
            >
              कृपया अपनी आवश्यकता के अनुसार WhatsApp, ईमेल या
              पंजीकृत कार्यालय के माध्यम से संपर्क करें।
            </Typography>
          </Box>

          {/* ================================================= */}
          {/* 3 CONTACT CARDS */}
          {/* ================================================= */}

          <Grid
            container
            spacing={2.5}
            alignItems="stretch"
          >
            {/* ============================================= */}
            {/* WHATSAPP */}
            {/* ============================================= */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <ContactCard
                icon={
                  <WhatsApp
                    sx={{
                      fontSize: 32,
                    }}
                  />
                }
                eyebrow="WHATSAPP HELPLINE"
                title="WhatsApp सहायता"
                accent="teal"
                action={
                  <Button
                    component="a"
                    href={
                      WHATSAPP_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={
                      <WhatsApp />
                    }
                  >
                    WhatsApp पर संदेश भेजें
                  </Button>
                }
              >
                <Typography
                  sx={{
                    color:
                      COLORS.tealDark,

                    fontFamily:
                      FONT,

                    fontSize: {
                      xs: '1.25rem',
                      md: '1.42rem',
                    },

                    fontWeight:
                      950,
                  }}
                >
                  {WHATSAPP_DISPLAY}
                </Typography>

                <Typography
                  sx={{
                    mt:
                      1.2,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.84rem',

                    fontWeight:
                      600,

                    lineHeight:
                      1.7,
                  }}
                >
                  सहायता एवं पंजीकरण संबंधी जानकारी के लिए
                  WhatsApp के माध्यम से संपर्क करें।
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    mt:
                      1.7,

                    p:
                      1.3,

                    borderRadius:
                      2,

                    bgcolor:
                      COLORS.softTeal,

                    border:
                      `1px solid ${COLORS.tealBorder}`,
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        COLORS.tealDark,

                      fontFamily:
                        FONT,

                      fontSize:
                        '0.76rem',

                      fontWeight:
                        800,

                      lineHeight:
                        1.6,
                    }}
                  >
                    कृपया केवल WhatsApp पर संदेश करें, कॉल न
                    करें।
                  </Typography>
                </Paper>
              </ContactCard>
            </Grid>

            {/* ============================================= */}
            {/* REGISTERED OFFICE */}
            {/* ============================================= */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <ContactCard
                icon={
                  <LocationOnRounded
                    sx={{
                      fontSize: 32,
                    }}
                  />
                }
                eyebrow="REGISTERED OFFICE"
                title="पंजीकृत कार्यालय"
                accent="purple"
                action={
                  <Button
                    component="a"
                    href={
                      MAP_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={
                      <LocationOnRounded />
                    }
                    endIcon={
                      <OpenInNewRounded
                        sx={{
                          fontSize:
                            '16px !important',
                        }}
                      />
                    }
                  >
                    Map पर देखें
                  </Button>
                }
              >
                <Typography
                  sx={{
                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.86rem',

                    fontWeight:
                      900,

                    lineHeight:
                      1.6,
                  }}
                >
                  रजिस्ट्रेशन नम्बर
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.4,

                    color:
                      COLORS.purple,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.94rem',

                    fontWeight:
                      900,
                  }}
                >
                  06/13/01/14617/23
                </Typography>

                <Typography
                  sx={{
                    mt:
                      1.5,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.84rem',

                    fontWeight:
                      600,

                    lineHeight:
                      1.75,
                  }}
                >
                  सुभाष पुरम रोड,
                  <br />

                  हेलिपैड के पीछे,
                  <br />

                  टीकमगढ़, मध्यप्रदेश - 472001
                </Typography>
              </ContactCard>
            </Grid>

            {/* ============================================= */}
            {/* EMAIL */}
            {/* ============================================= */}

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <ContactCard
                icon={
                  <EmailRounded
                    sx={{
                      fontSize: 32,
                    }}
                  />
                }
                eyebrow="SUPPORT EMAIL"
                title="ईमेल सहायता"
                accent="teal"
                action={
                  <Button
                    component="a"
                    href={`mailto:${EMAIL}`}
                    startIcon={
                      <EmailRounded />
                    }
                  >
                    ईमेल भेजें
                  </Button>
                }
              >
                <Typography
                  sx={{
                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.84rem',

                    fontWeight:
                      600,

                    lineHeight:
                      1.7,
                  }}
                >
                  सहायता, पंजीकरण अथवा अन्य आधिकारिक जानकारी
                  के लिए हमें ईमेल करें।
                </Typography>

                <Link
                  href={`mailto:${EMAIL}`}
                  underline="none"
                  sx={{
                    display:
                      'inline-block',

                    mt:
                      1.7,

                    color:
                      COLORS.tealDark,

                    fontFamily:
                      FONT,

                    fontSize: {
                      xs: '1rem',
                      md: '1.08rem',
                    },

                    fontWeight:
                      900,

                    wordBreak:
                      'break-word',

                    borderBottom:
                      '1px solid rgba(15,118,110,0.28)',

                    '&:hover': {
                      color:
                        COLORS.dark,
                    },
                  }}
                >
                  {EMAIL}
                </Link>
              </ContactCard>
            </Grid>
          </Grid>

          {/* ================================================= */}
          {/* WORKING HOURS */}
          {/* ================================================= */}

          <Paper
            elevation={0}
            sx={{
              mt: {
                xs: 3,
                md: 4,
              },

              position:
                'relative',

              overflow:
                'hidden',

              p: {
                xs: 2.7,
                md: 3.5,
              },

              borderRadius: {
                xs: '24px',
                md: '30px',
              },

              bgcolor:
                '#ffffff',

              border:
                `1px solid ${COLORS.border}`,

              boxShadow:
                '0 18px 50px rgba(31,26,65,0.075)',

              '&::before': {
                content:
                  '""',

                position:
                  'absolute',

                top: 0,
                left: 0,
                right: 0,

                height:
                  6,

                background:
                  `linear-gradient(
                    90deg,
                    ${COLORS.purple},
                    ${COLORS.teal}
                  )`,
              },
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}
              alignItems="center"
              justifyContent="center"
              sx={{
                mb:
                  3,
              }}
            >
              <Box
                sx={{
                  width:
                    52,

                  height:
                    52,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  borderRadius:
                    '17px',

                  color:
                    '#ffffff',

                  bgcolor:
                    COLORS.dark,
                }}
              >
                <AccessTimeRounded
                  sx={{
                    fontSize:
                      28,
                  }}
                />
              </Box>

              <Box
                sx={{
                  textAlign: {
                    xs: 'center',
                    sm: 'left',
                  },
                }}
              >
                <Typography
                  sx={{
                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize: {
                      xs: '1.1rem',
                      md: '1.25rem',
                    },

                    fontWeight:
                      950,
                  }}
                >
                  कार्य समय
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.25,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.78rem',

                    fontWeight:
                      600,
                  }}
                >
                  सहायता टीम से संपर्क करने का सामान्य समय
                </Typography>
              </Box>
            </Stack>

            <Grid
              container
              spacing={2}
            >
              {/* MONDAY - FRIDAY */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Box
                  sx={{
                    height:
                      '100%',

                    p:
                      2,

                    textAlign:
                      'center',

                    borderRadius:
                      2.5,

                    bgcolor:
                      COLORS.softPurple,

                    border:
                      `1px solid ${COLORS.purpleBorder}`,
                  }}
                >
                  <ScheduleRounded
                    sx={{
                      color:
                        COLORS.purple,

                      fontSize:
                        26,
                    }}
                  />

                  <Typography
                    sx={{
                      mt:
                        0.7,

                      color:
                        COLORS.dark,

                      fontFamily:
                        FONT,

                      fontWeight:
                        900,

                      fontSize:
                        '0.88rem',
                    }}
                  >
                    सोमवार से शुक्रवार
                  </Typography>

                  <Typography
                    sx={{
                      mt:
                        0.5,

                      color:
                        COLORS.muted,

                      fontFamily:
                        FONT,

                      fontWeight:
                        600,

                      fontSize:
                        '0.82rem',

                      lineHeight:
                        1.6,
                    }}
                  >
                    सुबह 9:00 बजे से शाम 6:00 बजे तक
                  </Typography>
                </Box>
              </Grid>

              {/* SATURDAY */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Box
                  sx={{
                    height:
                      '100%',

                    p:
                      2,

                    textAlign:
                      'center',

                    borderRadius:
                      2.5,

                    bgcolor:
                      COLORS.softTeal,

                    border:
                      `1px solid ${COLORS.tealBorder}`,
                  }}
                >
                  <ScheduleRounded
                    sx={{
                      color:
                        COLORS.tealDark,

                      fontSize:
                        26,
                    }}
                  />

                  <Typography
                    sx={{
                      mt:
                        0.7,

                      color:
                        COLORS.dark,

                      fontFamily:
                        FONT,

                      fontWeight:
                        900,

                      fontSize:
                        '0.88rem',
                    }}
                  >
                    शनिवार
                  </Typography>

                  <Typography
                    sx={{
                      mt:
                        0.5,

                      color:
                        COLORS.muted,

                      fontFamily:
                        FONT,

                      fontWeight:
                        600,

                      fontSize:
                        '0.82rem',

                      lineHeight:
                        1.6,
                    }}
                  >
                    सुबह 10:00 बजे से दोपहर 2:00 बजे तक
                  </Typography>
                </Box>
              </Grid>

              {/* SUNDAY */}

              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
              >
                <Box
                  sx={{
                    height:
                      '100%',

                    p:
                      2,

                    textAlign:
                      'center',

                    borderRadius:
                      2.5,

                    bgcolor:
                      '#f8fafc',

                    border:
                      '1px solid #e5e7eb',
                  }}
                >
                  <AccessTimeRounded
                    sx={{
                      color:
                        '#64748b',

                      fontSize:
                        26,
                    }}
                  />

                  <Typography
                    sx={{
                      mt:
                        0.7,

                      color:
                        COLORS.dark,

                      fontFamily:
                        FONT,

                      fontWeight:
                        900,

                      fontSize:
                        '0.88rem',
                    }}
                  >
                    रविवार / राष्ट्रीय अवकाश
                  </Typography>

                  <Typography
                    sx={{
                      mt:
                        0.5,

                      color:
                        COLORS.muted,

                      fontFamily:
                        FONT,

                      fontWeight:
                        600,

                      fontStyle:
                        'italic',

                      fontSize:
                        '0.82rem',
                    }}
                  >
                    कार्यालय बंद रहेगा
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ================================================= */}
          {/* IMPORTANT WHATSAPP NOTICE */}
          {/* ================================================= */}

          <Paper
            elevation={0}
            sx={{
              mt:
                3,

              p: {
                xs: 2,
                md: 2.5,
              },

              borderRadius:
                3,

              bgcolor:
                COLORS.softTeal,

              border:
                `1px solid ${COLORS.tealBorder}`,

              boxShadow:
                '0 10px 28px rgba(15,118,110,0.05)',
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}
              justifyContent="center"
              alignItems="center"
              sx={{
                textAlign:
                  'center',
              }}
            >
              <WhatsApp
                sx={{
                  color:
                    COLORS.green,

                  fontSize:
                    31,

                  flexShrink:
                    0,
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize: {
                      xs: '0.88rem',
                      md: '0.96rem',
                    },

                    fontWeight:
                      900,

                    lineHeight:
                      1.6,
                  }}
                >
                  WhatsApp हेल्पलाइन पर कृपया केवल संदेश भेजें,
                  कॉल न करें।
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.25,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.76rem',

                    fontWeight:
                      600,
                  }}
                >
                  इससे सहायता टीम आपके अनुरोध को व्यवस्थित रूप से
                  देख और उत्तर दे सकेगी।
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* ================================================= */}
          {/* FINAL SUPPORT STRIP */}
          {/* ================================================= */}

          <Paper
            elevation={0}
            sx={{
              mt:
                3,

              position:
                'relative',

              overflow:
                'hidden',

              p: {
                xs: 2.5,
                md: 3,
              },

              borderRadius:
                3.5,

              color:
                '#ffffff',

              background:
                `linear-gradient(
                  135deg,
                  ${COLORS.darkest},
                  ${COLORS.dark}
                )`,

              boxShadow:
                '0 18px 46px rgba(31,26,65,0.15)',
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                md: 'row',
              }}
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack
                direction="row"
                spacing={1.4}
                alignItems="center"
              >
                <SupportAgentRounded
                  sx={{
                    color:
                      COLORS.tealLight,

                    fontSize:
                      34,
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      color:
                        '#ffffff',

                      fontFamily:
                        FONT,

                      fontWeight:
                        900,

                      fontSize:
                        '0.95rem',
                    }}
                  >
                    PMUMS सहायता
                  </Typography>

                  <Typography
                    sx={{
                      mt:
                        0.2,

                      color:
                        'rgba(255,255,255,0.72)',

                      fontFamily:
                        FONT,

                      fontSize:
                        '0.76rem',

                      fontWeight:
                        550,
                    }}
                  >
                    सही जानकारी के लिए केवल आधिकारिक संपर्क
                    माध्यमों का उपयोग करें।
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={1}
              >
                <Button
                  component="a"
                  href={
                    WHATSAPP_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={
                    <WhatsApp />
                  }
                  variant="contained"
                  sx={{
                    minHeight:
                      43,

                    px:
                      2.5,

                    borderRadius:
                      2.5,

                    bgcolor:
                      COLORS.green,

                    color:
                      '#ffffff',

                    textTransform:
                      'none',

                    fontFamily:
                      FONT,

                    fontWeight:
                      900,

                    boxShadow:
                      'none',

                    '&:hover': {
                      bgcolor:
                        '#116149',

                      boxShadow:
                        'none',
                    },
                  }}
                >
                  WhatsApp
                </Button>

                <Button
                  component="a"
                  href={`mailto:${EMAIL}`}
                  startIcon={
                    <EmailRounded />
                  }
                  variant="contained"
                  sx={{
                    minHeight:
                      43,

                    px:
                      2.5,

                    borderRadius:
                      2.5,

                    color:
                      '#ffffff',

                    borderColor:
                      'rgba(255,255,255,0.30)',

                    textTransform:
                      'none',

                    fontFamily:
                      FONT,

                    fontWeight:
                      900,

                    '&:hover': {
                      borderColor:
                        COLORS.tealLight,

                      bgcolor:
                        'rgba(255,255,255,0.06)',
                    },
                  }}
                >
                  Email
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ContactUs;