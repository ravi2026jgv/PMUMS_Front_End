import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';

/* =========================================================
   TAB 2 FOUNDERS

   Same founder data as TAB 1.
   Only TAB 2 presentation/theme is different.

   TAB 1 shared Founders remains untouched.
   ========================================================= */

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

const COLORS = {
  darkest: '#082f49',

  dark: '#083344',

  mainDark: '#0e7490',

  main: '#0891b2',

  cyan: '#22d3ee',

  light: '#67e8f9',

  green: '#15805d',

  greenDark: '#116149',

  soft: '#ecfeff',

  softBlue: '#f0f9ff',

  white: '#ffffff',

  text: '#16323d',

  muted: '#526874',

  border:
    'rgba(8,145,178,0.18)',
};

/* =========================================================
   SAME FOUNDERS AS MAIN PORTAL
   ========================================================= */

const foundersData = [
  {
    id: 1,

    name:
      'श्री सतीश कुमार खरे',

    title:
      'संस्थापक',

    image:
      '/admin3.jpeg',

    alt:
      'श्री सतीश कुमार खरे',
  },

  {
    id: 2,

    name:
      'श्री बृजेश कुमार असाटी',

    title:
      'सह संस्थापक',

    image:
      '/admin1.png',

    alt:
      'श्री बृजेश कुमार असाटी',
  },

  {
    id: 3,

    name:
      'श्री मुरली मनोहर अरजरिया',

    title:
      'सह संस्थापक',

    image:
      '/admin2.jpeg',

    alt:
      'श्री मुरली मनोहर अरजरिया',
  },
];

/* =========================================================
   FOUNDER CARD
   ========================================================= */

const FounderCard = ({
  founder,
  index,
}) => {
  const isPrimary =
    index === 0;

  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 4,
      }}
    >
      <Card
        elevation={0}
        sx={{
          height:
            '100%',

          position:
            'relative',

          overflow:
            'hidden',

          textAlign:
            'center',

          background:
            '#ffffff',

          borderRadius: {
            xs: '26px',
            md: '32px',
          },

          border:
            `1px solid ${COLORS.border}`,

          boxShadow:
            '0 20px 52px rgba(8,47,73,0.10)',

          transition:
            'all 0.35s ease',

          '&:hover': {
            transform:
              'translateY(-8px)',

            boxShadow:
              '0 30px 76px rgba(8,47,73,0.16)',

            borderColor:
              'rgba(8,145,178,0.38)',
          },

          /* CARD TOP ACCENT */

          '&::before': {
            content:
              '""',

            position:
              'absolute',

            top: 0,
            left: 0,
            right: 0,

            height:
              '7px',

            background:
              isPrimary
                ? COLORS.green
                : COLORS.main,
          },

          /* DECORATIVE CIRCLE */

          '&::after': {
            content:
              '""',

            position:
              'absolute',

            width:
              150,

            height:
              150,

            borderRadius:
              '50%',

            right:
              -75,

            bottom:
              -80,

            background:
              isPrimary
                ? 'rgba(21,128,93,0.07)'
                : 'rgba(34,211,238,0.09)',
          },
        }}
      >
        {/* =============================================== */}
        {/* IMAGE */}
        {/* =============================================== */}

        <Box
          sx={{
            p: {
              xs: 2,
              md: 2.4,
            },

            pb: 0,

            position:
              'relative',

            zIndex: 1,

            background:
              isPrimary
                ? '#edf9f4'
                : COLORS.soft,
          }}
        >
          <Box
            sx={{
              width:
                '100%',

              height: {
                xs: 275,
                sm: 285,
                md: 300,
              },

              overflow:
                'hidden',

              borderRadius:
                '24px',

              background:
                '#ffffff',

              border:
                isPrimary
                  ? '1px solid rgba(21,128,93,0.18)'
                  : '1px solid rgba(8,145,178,0.18)',

              boxShadow:
                '0 14px 34px rgba(8,47,73,0.10)',
            }}
          >
            <Box
              component="img"

              src={
                founder.image
              }

              alt={
                founder.alt
              }

              sx={{
                width:
                  '100%',

                height:
                  '100%',

                objectFit:
                  'cover',

                objectPosition:
                  'center top',

                transition:
                  'all 0.45s ease',

                '.MuiCard-root:hover &':
                  {
                    transform:
                      'scale(1.045)',
                  },
              }}
            />
          </Box>
        </Box>

        {/* =============================================== */}
        {/* FOUNDER INFORMATION */}
        {/* =============================================== */}

        <CardContent
          sx={{
            px: {
              xs: 2.5,
              md: 3,
            },

            pt: 3,

            pb: 4,

            position:
              'relative',

            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color:
                COLORS.dark,

              fontFamily:
                FONT,

              fontWeight:
                950,

              fontSize: {
                xs: '1.18rem',
                md: '1.3rem',
              },

              lineHeight:
                1.35,

              mb:
                1.4,
            }}
          >
            {founder.name}
          </Typography>

          <Chip
            label={
              founder.title
            }

            sx={{
              px:
                1.5,

              height:
                36,

              fontFamily:
                FONT,

              fontWeight:
                900,

              color:
                '#ffffff',

              background:
                isPrimary
                  ? COLORS.green
                  : COLORS.mainDark,

              border:
                isPrimary
                  ? '1px solid rgba(21,128,93,0.26)'
                  : '1px solid rgba(8,145,178,0.28)',

              boxShadow:
                isPrimary
                  ? '0 8px 20px rgba(21,128,93,0.16)'
                  : '0 8px 20px rgba(8,145,178,0.16)',
            }}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

/* =========================================================
   MAIN FOUNDERS SECTION
   ========================================================= */

const Tab2Founders = () => {
  return (
    <Box
      sx={{
        py: {
          xs: 6,
          md: 9,
        },

        position:
          'relative',

        overflow:
          'hidden',

        /*
         * TAB2 cyan background.
         * Removes purple area shown in screenshot.
         */
        background: `
          radial-gradient(
            circle at top left,
            rgba(34,211,238,0.10),
            transparent 32%
          ),
          radial-gradient(
            circle at bottom right,
            rgba(21,128,93,0.07),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            #ecfeff 0%,
            #f8fdff 100%
          )
        `,
      }}
    >
      {/* BACKGROUND DECORATION */}

      <Box
        sx={{
          position:
            'absolute',

          width:
            300,

          height:
            300,

          borderRadius:
            '50%',

          right:
            -160,

          top:
            -160,

          background:
            'rgba(34,211,238,0.08)',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position:
            'relative',

          zIndex: 1,
        }}
      >
        {/* =============================================== */}
        {/* MAIN WHITE PANEL */}
        {/* =============================================== */}

        <Box
          sx={{
            position:
              'relative',

            overflow:
              'hidden',

            borderRadius: {
              xs: '28px',
              md: '38px',
            },

            p: {
              xs: 2.4,
              sm: 3.5,
              md: 5,
            },

            background:
              '#ffffff',

            border:
              `1px solid ${COLORS.border}`,

            boxShadow:
              '0 28px 80px rgba(8,47,73,0.12)',
          }}
        >
          {/* TOP ACCENT */}

          <Box
            sx={{
              position:
                'absolute',

              top: 0,
              left: 0,
              right: 0,

              height:
                7,

              background:
                `linear-gradient(
                  90deg,
                  ${COLORS.dark},
                  ${COLORS.main},
                  ${COLORS.cyan}
                )`,
            }}
          />

          <Box
            sx={{
              position:
                'relative',

              zIndex:
                1,
            }}
          >
            {/* =========================================== */}
            {/* HEADING */}
            {/* =========================================== */}

            <Box
              sx={{
                textAlign:
                  'center',

                mb: {
                  xs: 4,
                  md: 5,
                },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color:
                    COLORS.mainDark,

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  letterSpacing:
                    '1.5px',

                  fontSize:
                    '0.82rem',
                }}
              >
                PMUMS LEADERSHIP
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

                  fontWeight:
                    550,

                  fontSize: {
                    xs: '1.8rem',
                    md: '2.45rem',
                  },

                  lineHeight:
                    1.25,
                }}
              >
                संस्थापक मंडल
              </Typography>

              <Box
                sx={{
                  width:
                    95,

                  height:
                    5,

                  borderRadius:
                    99,

                  mx:
                    'auto',

                  mt:
                    2,

                  background:
                    `linear-gradient(
                      90deg,
                      ${COLORS.mainDark},
                      ${COLORS.main},
                      ${COLORS.cyan}
                    )`,
                }}
              />
            </Box>

            {/* =========================================== */}
            {/* FOUNDER CARDS */}
            {/* =========================================== */}

            <Grid
              container

              spacing={{
                xs: 3,
                md: 4,
              }}

              justifyContent="center"

              alignItems="stretch"
            >
              {foundersData.map(
                (
                  founder,
                  index
                ) => (
                  <FounderCard
                    key={
                      founder.id
                    }

                    founder={
                      founder
                    }

                    index={
                      index
                    }
                  />
                )
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Tab2Founders;