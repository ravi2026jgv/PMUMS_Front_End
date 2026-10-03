import React, {
  useEffect,
  useState,
} from 'react';

import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  CheckCircleRounded,
  GroupsRounded,
  VolunteerActivismRounded,
  WhatsApp,
} from '@mui/icons-material';

import {
  publicApi,
} from '../../../services/api';

/* =========================================================
   TAB 2 STATISTICS THEME
   ========================================================= */

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

const COLORS = {
  darkest: '#082f49',
  dark: '#083344',

  mainDark: '#0e7490',
  main: '#0891b2',

  light: '#67e8f9',
  cyan: '#22d3ee',

  green: '#15805d',
  greenDark: '#116149',

  soft: '#ecfeff',
  softBlue: '#f0f9ff',
  softGreen: '#edf9f4',

  white: '#ffffff',

  text: '#16323d',
  muted: '#526874',

  border:
    'rgba(8,145,178,0.18)',
};

/* =========================================================
   SUPPORT RULES
   ========================================================= */

const supportRules = [
  'सहयोग केवल अपने लॉगिन में प्रदर्शित निर्धारित परिवार / सहायता प्रकरण के QR कोड पर ही करें।',

  'व्हाट्सएप ग्रुप अथवा किसी अन्य माध्यम से प्राप्त अनधिकृत QR कोड पर सहयोग न करें।',

  'सहयोग स्वयं, पति / पत्नी, पुत्र / पुत्री अथवा नामांकित व्यक्ति के खाते से करना सुनिश्चित करें।',

  'यह व्यवस्था सामूहिक सहयोग की भावना पर आधारित है। प्रत्येक पात्र सदस्य से समय पर सहयोग अपेक्षित है।',

  'अपनी प्रोफाइल एवं आवश्यक जानकारी हमेशा अद्यतन रखें, ताकि आवश्यकता के समय प्रक्रिया में किसी प्रकार की समस्या न हो।',
];

/* =========================================================
   FORMAT NUMBER
   ========================================================= */

const formatNumber = (
  value
) => {
  const numberValue =
    Number(value || 0);

  if (
    Number.isNaN(
      numberValue
    )
  ) {
    return '0+';
  }

  return `${numberValue.toLocaleString(
    'en-IN'
  )}+`;
};

/* =========================================================
   STAT CARD
   Same layout philosophy as TAB 1
   ========================================================= */

const StatCard = ({
  icon,
  value,
  label,
  variant = 'primary',
}) => {
  const isGreen =
    variant === 'green';

  return (
    <Paper
      elevation={0}
      sx={{
        position:
          'relative',

        overflow:
          'hidden',

        borderRadius:
          '28px',

        p: {
          xs: 3,
          md: 3.5,
        },

        background:
          isGreen
            ? COLORS.softGreen
            : '#ffffff',

        border:
          isGreen
            ? '1px solid rgba(21,128,93,0.22)'
            : '1px solid rgba(8,145,178,0.20)',

        boxShadow:
          '0 18px 48px rgba(8,47,73,0.10)',

        transition:
          'all 0.35s ease',

        '&:hover': {
          transform:
            'translateY(-6px)',

          boxShadow:
            '0 26px 70px rgba(8,47,73,0.16)',
        },

        '&::before': {
          content: '""',

          position:
            'absolute',

          top: -70,
          right: -70,

          width: 170,
          height: 170,

          borderRadius:
            '50%',

          background:
            isGreen
              ? 'rgba(21,128,93,0.08)'
              : 'rgba(34,211,238,0.12)',
        },
      }}
    >
      <Box
        sx={{
          position:
            'relative',

          zIndex: 1,
        }}
      >
        {/* ICON */}

        <Box
          sx={{
            width: 58,
            height: 58,

            borderRadius:
              '18px',

            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            mb: 2.4,

            background:
              isGreen
                ? COLORS.green
                : COLORS.mainDark,

            color:
              '#ffffff',

            boxShadow:
              isGreen
                ? '0 14px 32px rgba(21,128,93,0.24)'
                : '0 14px 32px rgba(8,145,178,0.24)',
          }}
        >
          {icon}
        </Box>

        {/* VALUE */}

        <Typography
          component="div"
          sx={{
            color:
              isGreen
                ? COLORS.green
                : COLORS.dark,

            fontFamily:
              FONT,

            fontWeight:
              950,

            fontSize: {
              xs: '2.35rem',
              sm: '2.8rem',
              md: '3.15rem',
            },

            lineHeight: 1,

            letterSpacing:
              '-1.5px',

            wordBreak:
              'break-word',
          }}
        >
          {value}
        </Typography>

        {/* LABEL */}

        <Typography
          sx={{
            mt: 1.1,

            color:
              COLORS.text,

            fontFamily:
              FONT,

            fontWeight:
              900,

            fontSize: {
              xs: '0.98rem',
              md: '1.05rem',
            },

            lineHeight: 1.5,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const Tab2Statistics = () => {
  const [
    homeStats,
    setHomeStats,
  ] = useState({
    /*
     * IMPORTANT:
     *
     * Backend property name is still
     * registeredTeachersCount.
     *
     * Do NOT rename this unless
     * backend API is also changed.
     */
    registeredTeachersCount:
      0,

    emergencyHelpCount:
      0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =======================================================
     LOAD LIVE STATS
     ======================================================= */

  useEffect(() => {
    const loadStats =
      async () => {
        try {
          setLoading(
            true
          );

          const response =
            await publicApi
              .getHomeStats();

          setHomeStats({
            registeredTeachersCount:
              response?.data
                ?.registeredTeachersCount ||
              0,

            emergencyHelpCount:
              response?.data
                ?.emergencyHelpCount ||
              0,
          });
        } catch (
          error
        ) {
          console.error(
            'Failed to load TAB2 statistics:',
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadStats();
  }, []);

  /* =======================================================
     UI
     ======================================================= */

  return (
    <Box
      sx={{
        position:
          'relative',

        overflow:
          'hidden',

        py: {
          xs: 6,
          md: 9,
        },

        /*
         * Same strong section concept as TAB1,
         * but TAB2 cyan/teal identity.
         */
        background:
          `linear-gradient(
            135deg,
            ${COLORS.darkest} 0%,
            ${COLORS.dark} 48%,
            ${COLORS.mainDark} 100%
          )`,
      }}
    >
      {/* ================================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================================= */}

      <Box
        sx={{
          position:
            'absolute',

          width: 420,
          height: 420,

          top: -220,
          right: -180,

          borderRadius:
            '50%',

          background:
            'rgba(34,211,238,0.08)',
        }}
      />

      <Box
        sx={{
          position:
            'absolute',

          width: 340,
          height: 340,

          bottom: -200,
          left: -170,

          borderRadius:
            '50%',

          background:
            'rgba(103,232,249,0.05)',
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
        {/* ================================================= */}
        {/* SECTION HEADING */}
        {/* ================================================= */}

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
                COLORS.light,

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
            कर्मचारी सहयोग व्यवस्था
          </Typography>

          <Typography
            component="h2"
            sx={{
              mt: 0.6,

              color:
                '#ffffff',

              fontFamily:
                FONT,

              fontWeight:
                950,

              fontSize: {
                xs: '1.8rem',
                md: '2.45rem',
              },

              lineHeight:
                1.25,
            }}
          >
            आज का सहयोग — कल किसी परिवार का संबल
          </Typography>

          <Typography
            sx={{
              maxWidth: 780,

              mx: 'auto',

              mt: 1.1,

              color:
                'rgba(255,255,255,0.78)',

              fontFamily:
                FONT,

              fontSize: {
                xs: '0.84rem',
                md: '0.92rem',
              },

              lineHeight:
                1.7,

              fontWeight:
                500,
            }}
          >
            अन्य विभागों एवं संस्थानों के कर्मचारियों को
            एक पारदर्शी एवं सामूहिक सहायता व्यवस्था से
            जोड़ने का प्रयास।
          </Typography>

          <Box
            sx={{
              width: 95,

              height: 5,

              borderRadius:
                99,

              mx: 'auto',

              mt: 2,

              background:
                COLORS.cyan,
            }}
          />
        </Box>

        {/* ================================================= */}
        {/* MAIN WHITE CONTAINER - SAME AS TAB 1 */}
        {/* ================================================= */}

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
              '1px solid rgba(34,211,238,0.18)',

            boxShadow:
              '0 28px 80px rgba(0,0,0,0.20)',
          }}
        >
          {/* TOP LINE */}

          <Box
            sx={{
              position:
                'absolute',

              top: 0,
              left: 0,
              right: 0,

              height: 7,

              background:
                `linear-gradient(
                  90deg,
                  ${COLORS.mainDark},
                  ${COLORS.main},
                  ${COLORS.cyan}
                )`,
            }}
          />

          {/* ================================================= */}
          {/* IMPORTANT:
              Grid size syntax same as TAB 1.
              This fixes current alignment problem.
          */}
          {/* ================================================= */}

          <Grid
            container
            spacing={{
              xs: 4,
              md: 5,
            }}
            alignItems="stretch"
          >
            {/* ============================================= */}
            {/* LEFT - RULES */}
            {/* ============================================= */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  height:
                    '100%',

                  pr: {
                    md: 2,
                  },
                }}
              >
                {/* RULES HEADING */}

                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  sx={{
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,

                      flexShrink: 0,

                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      borderRadius:
                        '15px',

                      bgcolor:
                        COLORS.dark,

                      color:
                        '#ffffff',

                      boxShadow:
                        '0 10px 26px rgba(8,47,73,0.18)',
                    }}
                  >
                    <VolunteerActivismRounded />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color:
                          COLORS.dark,

                        fontFamily:
                          FONT,

                        fontSize:
                          '1.02rem',

                        fontWeight:
                          900,

                        lineHeight:
                          1.4,
                      }}
                    >
                      सहयोग करते समय ध्यान रखें
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,

                        color:
                          COLORS.muted,

                        fontFamily:
                          FONT,

                        fontSize:
                          '0.76rem',

                        lineHeight:
                          1.5,
                      }}
                    >
                      सुरक्षित एवं सही सहयोग प्रक्रिया
                    </Typography>
                  </Box>
                </Stack>

                {/* RULE ITEMS */}

                <Stack
                  spacing={1.5}
                >
                  {supportRules.map(
                    (
                      item,
                      index
                    ) => (
                      <Box
                        key={
                          index
                        }
                        sx={{
                          display:
                            'flex',

                          gap: 1.5,

                          alignItems:
                            'flex-start',

                          p: {
                            xs: 1.6,
                            md: 1.8,
                          },

                          borderRadius:
                            '18px',

                          background:
                            index %
                              2 ===
                            0
                              ? COLORS.softBlue
                              : COLORS.soft,

                          border:
                            index %
                              2 ===
                            0
                              ? '1px solid rgba(8,145,178,0.16)'
                              : '1px solid rgba(21,128,93,0.14)',
                        }}
                      >
                        {/* RULE NUMBER */}

                        <Box
                          sx={{
                            minWidth: 30,

                            width: 30,
                            height: 30,

                            borderRadius:
                              '50%',

                            display:
                              'flex',

                            alignItems:
                              'center',

                            justifyContent:
                              'center',

                            background:
                              index %
                                2 ===
                              0
                                ? COLORS.mainDark
                                : COLORS.green,

                            color:
                              '#ffffff',

                            fontFamily:
                              FONT,

                            fontWeight:
                              900,

                            fontSize:
                              '0.85rem',

                            mt: 0.2,
                          }}
                        >
                          {index +
                            1}
                        </Box>

                        {/* RULE TEXT */}

                        <Typography
                          sx={{
                            color:
                              '#374151',

                            fontFamily:
                              FONT,

                            fontSize: {
                              xs: '0.90rem',
                              md: '0.96rem',
                            },

                            lineHeight:
                              1.7,

                            fontWeight:
                              600,
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    )
                  )}
                </Stack>

                {/* WHATSAPP */}

                <Box
                  sx={{
                    mt: 2.2,

                    p: 2,

                    borderRadius:
                      '18px',

                    display:
                      'flex',

                    alignItems:
                      'center',

                    gap: 1.5,

                    background:
                      COLORS.softGreen,

                    border:
                      '1px solid rgba(21,128,93,0.22)',
                  }}
                >
                  <WhatsApp
                    sx={{
                      color:
                        COLORS.green,

                      fontSize:
                        30,
                    }}
                  />

                  <Typography
                    sx={{
                      color:
                        COLORS.greenDark,

                      fontFamily:
                        FONT,

                      fontWeight:
                        900,

                      fontSize: {
                        xs: '0.92rem',
                        md: '1rem',
                      },
                    }}
                  >
                    WhatsApp Helpline: 6262565803
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* ============================================= */}
            {/* RIGHT - STATS */}
            {/* ============================================= */}

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Box
                sx={{
                  height:
                    '100%',

                  pl: {
                    md: 2,
                  },

                  borderLeft: {
                    md:
                      '1px solid rgba(8,145,178,0.16)',
                  },

                  display:
                    'flex',

                  flexDirection:
                    'column',

                  justifyContent:
                    'center',

                  gap: 3,
                }}
              >
                {/* REGISTERED EMPLOYEES */}

                <StatCard
                  icon={
                    <GroupsRounded
                      sx={{
                        fontSize:
                          32,
                      }}
                    />
                  }
                  value={
                    loading
                      ? '...'
                      : formatNumber(
                          homeStats
                            .registeredTeachersCount
                        )
                  }
                  label="से ज्यादा पंजीकृत कर्मचारी"
                />

                {/* EMERGENCY SUPPORT */}

                <StatCard
                  icon={
                    <VolunteerActivismRounded
                      sx={{
                        fontSize:
                          32,
                      }}
                    />
                  }
                  value={
                    loading
                      ? '...'
                      : formatNumber(
                          homeStats
                            .emergencyHelpCount
                        )
                  }
                  label="आकस्मिक सहायता"
                  variant="green"
                />

                {/* BOTTOM STATEMENT */}

                <Box
                  sx={{
                    p: 2.2,

                    borderRadius:
                      '22px',

                    background:
                      COLORS.dark,

                    color:
                      '#ffffff',

                    display:
                      'flex',

                    alignItems:
                      'center',

                    gap: 1.5,

                    boxShadow:
                      '0 18px 45px rgba(8,47,73,0.22)',
                  }}
                >
                  <CheckCircleRounded
                    sx={{
                      color:
                        COLORS.light,

                      fontSize:
                        30,

                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    sx={{
                      color:
                        '#ffffff',

                      fontFamily:
                        FONT,

                      fontWeight:
                        600,

                      fontSize: {
                        xs: '0.92rem',
                        md: '1rem',
                      },

                      lineHeight:
                        1.6,
                    }}
                  >
                    सामूहिक सहयोग से संकटग्रस्त कर्मचारी
                    परिवारों को समय पर आर्थिक संबल प्रदान
                    करने का प्रयास।
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Tab2Statistics;