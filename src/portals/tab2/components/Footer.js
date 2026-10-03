import React from 'react';

import {
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';

import {
  EmailRounded,
  LocationOnRounded,
  PhoneRounded,
  VolunteerActivismRounded,
} from '@mui/icons-material';

import {
  Link as RouterLink,
} from 'react-router-dom';

import {
  usePortal,
} from '../../../portal/PortalContext';

/* =========================================================
   TAB 2 FOOTER

   Same structure / information pattern as TAB 1.
   Only TAB 2 teal/cyan visual identity is different.

   TAB 1 remains untouched.
   ========================================================= */

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

const COLORS = {
  darkest: '#082f49',

  dark: '#083344',

  dark2: '#0e4f66',

  mainDark: '#0e7490',

  main: '#0891b2',

  cyan: '#22d3ee',

  light: '#67e8f9',

  white: '#ffffff',

  lightText: 'rgba(255,255,255,0.86)',

  mutedText: 'rgba(255,255,255,0.70)',

  border:
    'rgba(103,232,249,0.16)',
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Tab2Footer = () => {
  const {
    path,
  } = usePortal();

  /*
   * Keep copyright year automatic
   * so it does not need manual updates.
   */
  const currentYear =
    new Date().getFullYear();

  /* =======================================================
     IMPORTANT LINKS
     Portal-aware so TAB2 routing remains isolated.
     ======================================================= */

  const importantLinks = [
    {
      text:
        'हमारे बारे में',

      href:
        path('/about'),
    },

    {
      text:
        'सदस्य सूची',

      href:
        path('/teachers-list'),
    },

    {
      text:
        'Sahyog करें',

      href:
        path('/sahyog'),
    },

    {
      text:
        'नियमावली',

      href:
        path('/niyamawali'),
    },

    {
      text:
        'संपर्क करें',

      href:
        path('/contact-us'),
    },
  ];

  /* =======================================================
     SUPPORT LINKS
     Same concept as TAB1.
     ======================================================= */

  const supportLinks = [
    {
      text:
        'सहयोग सहायता',

      href:
        path('/sahyog'),
    },

    {
      text:
        'Sahyog List',

      href:
        path('/sahyog-list'),
    },
  ];

  /* =======================================================
     COMMON FOOTER LINK STYLE
     ======================================================= */

  const footerLinkSx = {
    display:
      'block',

    width:
      'fit-content',

    color:
      COLORS.lightText,

    textDecoration:
      'none',

    fontFamily:
      FONT,

    fontSize:
      '0.88rem',

    fontWeight:
      600,

    lineHeight:
      1.65,

    transition:
      'all 0.25s ease',

    '&:hover': {
      color:
        '#ffffff',

      transform:
        'translateX(4px)',
    },
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <Box
      component="footer"
      sx={{
        mt:
          'auto',

        width:
          '100%',

        position:
          'relative',

        overflow:
          'hidden',

        color:
          COLORS.white,

        borderTop:
          `4px solid ${COLORS.cyan}`,

        background: `
          radial-gradient(
            circle at 20% 30%,
            rgba(103,232,249,0.10),
            transparent 36%
          ),
          radial-gradient(
            circle at 82% 75%,
            rgba(255,255,255,0.06),
            transparent 34%
          ),
          linear-gradient(
            135deg,
            ${COLORS.darkest} 0%,
            ${COLORS.dark} 44%,
            ${COLORS.mainDark} 100%
          )
        `,
      }}
    >
      {/* ================================================= */}
      {/* DECORATIVE BACKGROUND */}
      {/* ================================================= */}

      <Box
        sx={{
          position:
            'absolute',

          width:
            280,

          height:
            280,

          borderRadius:
            '50%',

          top:
            -180,

          right:
            -130,

          background:
            'rgba(34,211,238,0.07)',

          pointerEvents:
            'none',
        }}
      />

      <Box
        sx={{
          position:
            'absolute',

          width:
            220,

          height:
            220,

          borderRadius:
            '50%',

          bottom:
            -150,

          left:
            -100,

          background:
            'rgba(255,255,255,0.04)',

          pointerEvents:
            'none',
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position:
            'relative',

          zIndex:
            1,

          px: {
            xs: 2,
            md: 4,
          },

          pt: {
            xs: 4,
            md: 4.5,
          },

          pb: 0,
        }}
      >
        {/* ================================================= */}
        {/* MAIN FOOTER CONTENT */}
        {/* ================================================= */}

        <Grid
          container
          spacing={{
            xs: 4,
            md: 4,
          }}
        >
          {/* =============================================== */}
          {/* 1. LOGO / DESCRIPTION */}
          {/* Same column concept as TAB 1 */}
          {/* =============================================== */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                mb: 2,
              }}
            >
              {/* LOGO */}

              <Box
                sx={{
                  width:
                    62,

                  height:
                    62,

                  flexShrink:
                    0,

                  p:
                    0.7,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  bgcolor:
                    '#ffffff',

                  borderRadius:
                    '50%',

                  border:
                    '2px solid rgba(103,232,249,0.65)',

                  boxShadow:
                    '0 8px 24px rgba(0,0,0,0.24)',
                }}
              >
                <Box
                  component="img"

                  src="/pmums logo.png"

                  alt="PMUMS कर्मचारी कल्याण कोष"

                  sx={{
                    width:
                      '100%',

                    height:
                      '100%',

                    display:
                      'block',

                    objectFit:
                      'contain',
                  }}
                />
              </Box>

              {/* BRAND */}

              <Box>
                <Typography
                  sx={{
                    color:
                      COLORS.light,

                    fontFamily:
                      FONT,

                    fontWeight:
                      900,

                    fontSize: {
                      xs: '1rem',
                      md: '1.08rem',
                    },

                    lineHeight:
                      1.3,
                  }}
                >
                  कर्मचारी कल्याण कोष
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.3,

                    color:
                      COLORS.lightText,

                    fontFamily:
                      FONT,

                    fontWeight:
                      700,

                    fontSize:
                      '0.78rem',

                    lineHeight:
                      1.5,
                  }}
                >
                  अन्य विभाग एवं संस्थान — द्वितीय समूह
                </Typography>
              </Box>
            </Stack>

            {/* DESCRIPTION 1 */}

            <Typography
              sx={{
                color:
                  COLORS.lightText,

                fontFamily:
                  FONT,

                fontSize:
                  '0.86rem',

                fontWeight:
                  500,

                lineHeight:
                  1.75,

                textAlign: {
                  xs: 'left',
                  md: 'justify',
                },

                mb:
                  1.4,
              }}
            >
              हमारा उद्देश्य मध्य प्रदेश के अन्य शासकीय
              विभागों एवं संस्थानों के पात्र कर्मचारियों के
              लिए एक सहयोगी तंत्र विकसित करना है, जिससे किसी
              भी संकट के समय कोई भी कर्मचारी परिवार स्वयं को
              अकेला महसूस न करे।
            </Typography>

            {/* DESCRIPTION 2 */}

            <Typography
              sx={{
                color:
                  COLORS.lightText,

                fontFamily:
                  FONT,

                fontSize:
                  '0.86rem',

                fontWeight:
                  500,

                lineHeight:
                  1.75,

                textAlign: {
                  xs: 'left',
                  md: 'justify',
                },
              }}
            >
              यह व्यवस्था कर्मचारी एकता, मानवीय सेवा एवं
              पारस्परिक सहयोग की भावना पर आधारित है।
            </Typography>

            {/* SUPPORT MESSAGE */}

            <Box
              sx={{
                mt:
                  2,

                p:
                  1.5,

                borderRadius:
                  2.5,

                bgcolor:
                  'rgba(34,211,238,0.07)',

                border:
                  '1px solid rgba(103,232,249,0.15)',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <VolunteerActivismRounded
                  sx={{
                    mt:
                      '2px',

                    color:
                      COLORS.light,

                    fontSize:
                      20,

                    flexShrink:
                      0,
                  }}
                />

                <Typography
                  sx={{
                    color:
                      '#e6fbff',

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.78rem',

                    fontWeight:
                      700,

                    lineHeight:
                      1.65,
                  }}
                >
                  “आप अकेले नहीं हैं, आपका पूरा कर्मचारी
                  परिवार आपके साथ है।”
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* =============================================== */}
          {/* 2. SUPPORT */}
          {/* Matches TAB 1 hierarchy */}
          {/* =============================================== */}

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.5,
            }}
          >
            <Typography
              sx={{
                mb:
                  2,

                color:
                  COLORS.light,

                fontFamily:
                  FONT,

                fontSize:
                  '1.02rem',

                fontWeight:
                  900,
              }}
            >
              सहयोग (Support)
            </Typography>

            <Stack
              spacing={0.9}
            >
              {supportLinks.map(
                (link) => (
                  <Link
                    key={
                      link.text
                    }

                    component={
                      RouterLink
                    }

                    to={
                      link.href
                    }

                    sx={
                      footerLinkSx
                    }
                  >
                    • {link.text}
                  </Link>
                )
              )}
            </Stack>
          </Grid>

          {/* =============================================== */}
          {/* 3. IMPORTANT LINKS */}
          {/* =============================================== */}

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.5,
            }}
          >
            <Typography
              sx={{
                mb:
                  2,

                color:
                  COLORS.light,

                fontFamily:
                  FONT,

                fontSize:
                  '1.02rem',

                fontWeight:
                  900,
              }}
            >
              महत्वपूर्ण लिंक
            </Typography>

            <Stack
              spacing={0.9}
            >
              {importantLinks.map(
                (link) => (
                  <Link
                    key={
                      link.text
                    }

                    component={
                      RouterLink
                    }

                    to={
                      link.href
                    }

                    sx={
                      footerLinkSx
                    }
                  >
                    • {link.text}
                  </Link>
                )
              )}
            </Stack>
          </Grid>

          {/* =============================================== */}
          {/* 4. CONTACT DETAILS */}
          {/* Same details pattern as TAB 1 */}
          {/* =============================================== */}

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Typography
              sx={{
                mb:
                  2,

                color:
                  COLORS.light,

                fontFamily:
                  FONT,

                fontSize:
                  '1.02rem',

                fontWeight:
                  900,
              }}
            >
              संपर्क विवरण
            </Typography>

            <Stack
              spacing={1.8}
            >
              {/* REGISTERED OFFICE */}

              <Stack
                direction="row"
                spacing={1.1}
                alignItems="flex-start"
              >
                <LocationOnRounded
                  sx={{
                    mt:
                      0.2,

                    color:
                      COLORS.light,

                    fontSize:
                      20,

                    flexShrink:
                      0,
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      color:
                        '#ffffff',

                      fontFamily:
                        FONT,

                      fontSize:
                        '0.84rem',

                      fontWeight:
                        800,

                      lineHeight:
                        1.5,
                    }}
                  >
                    पंजीकृत कार्यालय : 06/13/01/14617/23
                  </Typography>

                  <Typography
                    sx={{
                      mt:
                        0.45,

                      color:
                        COLORS.lightText,

                      fontFamily:
                        FONT,

                      fontSize:
                        '0.81rem',

                      fontWeight:
                        500,

                      lineHeight:
                        1.6,
                    }}
                  >
                    सुभाष पुरम रोड, हेलिपैड के पीछे,
                    टीकमगढ़, मध्यप्रदेश 472001
                  </Typography>
                </Box>
              </Stack>

              {/* WHATSAPP */}

              <Stack
                direction="row"
                spacing={1.1}
                alignItems="flex-start"
              >
                <PhoneRounded
                  sx={{
                    mt:
                      0.2,

                    color:
                      COLORS.light,

                    fontSize:
                      19,

                    flexShrink:
                      0,
                  }}
                />

                <Typography
                  sx={{
                    color:
                      COLORS.lightText,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.81rem',

                    fontWeight:
                      500,

                    lineHeight:
                      1.65,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color:
                        '#ffffff',

                      fontWeight:
                        800,
                    }}
                  >
                    6262565803
                  </Box>

                  <br />

                  WhatsApp हेल्पलाइन — कृपया केवल WhatsApp
                  पर ही संदेश करें, कॉल न करें।
                </Typography>
              </Stack>

              {/* EMAIL */}

              <Stack
                direction="row"
                spacing={1.1}
                alignItems="center"
              >
                <EmailRounded
                  sx={{
                    color:
                      COLORS.light,

                    fontSize:
                      19,

                    flexShrink:
                      0,
                  }}
                />

                <Link
                  href="mailto:Info@pmums.com"
                  sx={{
                    color:
                      COLORS.lightText,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.81rem',

                    fontWeight:
                      600,

                    textDecoration:
                      'none',

                    '&:hover': {
                      color:
                        '#ffffff',

                      textDecoration:
                        'underline',
                    },
                  }}
                >
                  Info@pmums.com
                </Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

   {/* ================================================= */}
{/* COPYRIGHT SECTION */}
{/* Same as TAB 1 with Jyoti Global Ventures link */}
{/* ================================================= */}

<Box
  sx={{
    mt: {
      xs: 3.5,
      md: 4,
    },

    pt: 2.2,
    pb: 2.4,

    borderTop:
      `1px solid ${COLORS.border}`,

    textAlign: 'center',
  }}
>
  <Typography
    sx={{
      color: COLORS.mutedText,

      fontFamily: FONT,

      fontSize: {
        xs: '0.72rem',
        sm: '0.8rem',
      },

      fontWeight: 500,

      lineHeight: 1.7,
    }}
  >
    © {currentYear} PMUMS | All Rights Reserved | Managed by{' '}

    <Box
      component="a"
      href="https://jyotiglobalventures.com/"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: '#ffffff',

        fontFamily: FONT,

        fontWeight: 800,

        textDecoration: 'none',

        transition:
          'all 0.2s ease',

        '&:hover': {
          color: COLORS.light,

          textDecoration:
            'underline',
        },
      }}
    >
      Jyoti Global Ventures
    </Box>
  </Typography>
</Box>
      </Container>
    </Box>
  );
};

export default Tab2Footer;