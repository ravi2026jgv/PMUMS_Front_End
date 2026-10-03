import React from 'react';

import {
  Box,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  AccountBalanceRounded,
  CheckCircleRounded,
  DescriptionRounded,
  FamilyRestroomRounded,
  GavelRounded,
  GroupsRounded,
  InfoRounded,
  LockClockRounded,
  NotificationsActiveRounded,
  PercentRounded,
  RestartAltRounded,
  SecurityRounded,
  TaskAltRounded,
  VerifiedRounded,
  VolunteerActivismRounded,
  WarningAmberRounded,
} from '@mui/icons-material';

import Layout from '../../../components/Layout/Layout';

/* =========================================================
   TAB 2 - NIYAMAWALI

   File:
   src/portals/tab2/pages/Niyamawali.js

   IMPORTANT:
   - TAB 1 remains untouched.
   - TAB 1 can continue using its existing external redirect.
   - TAB 2 gets this internal page.
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

  red: '#b42318',

  orange: '#b54708',

  soft: '#ecfeff',

  softBlue: '#f0f9ff',

  softGreen: '#edf9f4',

  softRed: '#fff4f2',

  softOrange: '#fff8eb',

  background: '#f8fdff',

  white: '#ffffff',

  text: '#16323d',

  muted: '#526874',

  border:
    'rgba(8,145,178,0.18)',
};

/* =========================================================
   QUICK NAVIGATION
   ========================================================= */

const navigationItems = [
  {
    id: 'rule-1',
    label: 'योजना का उद्देश्य',
  },

  {
    id: 'rule-2',
    label: 'सम्मिलित कर्मचारी',
  },

  {
    id: 'rule-3',
    label: 'सहयोग पात्रता',
  },

  {
    id: 'rule-4',
    label: 'सदस्य का योगदान',
  },

  {
    id: 'rule-5',
    label: 'सहयोग निरंतरता',
  },

  {
    id: 'rule-6',
    label: 'पारंपरिक चूक नियम',
  },

  {
    id: 'rule-7',
    label: '90% सहभागिता',
  },

  {
    id: 'rule-8',
    label: 'पुनः पात्रता',
  },

  {
    id: 'rule-9',
    label: 'माता-पिता सहयोग',
  },

  {
    id: 'rule-10',
    label: 'अपात्रता एवं अनुशासन',
  },

  {
    id: 'rule-11',
    label: 'विवादित प्रकरण',
  },

  {
    id: 'rule-12',
    label: 'शिक्षक नेतृत्व',
  },

  {
    id: 'rule-13',
    label: 'आधिकारिक सूचना',
  },

  {
    id: 'rule-14',
    label: 'सदस्य का दायित्व',
  },

  {
    id: 'rule-15',
    label: 'नामिनी सहयोग',
  },

  {
    id: 'rule-16',
    label: 'सहयोग राशि',
  },

  {
    id: 'rule-17',
    label: 'नियमों की व्याख्या',
  },

  {
    id: 'rule-18',
    label: 'अंतिम निर्देश',
  },
];

/* =========================================================
   DATA LISTS
   ========================================================= */

const employeeCategories = [
  'नियमित अधिकारी एवं कर्मचारी',

  'संविदा अधिकारी एवं कर्मचारी',

  'आउटसोर्स कर्मचारी',

  'अस्थाई कर्मचारी',

  'कंप्यूटर ऑपरेटर एवं आई.टी. कर्मचारी',

  'आंगनवाड़ी कार्यकर्ता एवं सहायिका',

  'विभागीय अथवा संस्थागत व्यवस्था के अंतर्गत कार्यरत अन्य पात्र कर्मचारी',
];

const parentConditions = [
  'दिवंगत सदस्य अपने माता-पिता से पृथक निवास करता हो।',

  'दिवंगत सदस्य ने अपने माता-पिता को नोमिनी के रूप में नामित न किया हो।',

  'माता-पिता आर्थिक रूप से कमजोर हों तथा उन्हें सहयोग की आवश्यकता हो।',
];

const disqualificationItems = [
  'फर्जी स्क्रीनशॉट, गलत दस्तावेज अथवा भ्रामक जानकारी प्रस्तुत करना।',

  'योजना के निर्धारित नियमों के अनुसार सहयोग न करना।',

  'सहयोग अपील में लगातार दो बार निर्धारित सहयोग न करना।',

  'सहयोग में निरंतरता नहीं रखना एवं बार-बार चूक करना।',

  'दिवंगत सदस्य के नामिनी को निर्धारित सहयोग प्रदान न करना।',

  'किसी अन्य समान संगठन/टीम का प्रचार करना अथवा उसके पदाधिकारी के रूप में कार्य करना।',

  'संस्था के पदाधिकारियों के साथ अभद्र व्यवहार करना।',

  'पदाधिकारियों को डराना-धमकाना अथवा अनुचित आचरण करना।',

  'योजना की व्यवस्था, नियमों अथवा संस्था की गरिमा को जानबूझकर प्रभावित करने वाला कोई कार्य करना।',
];

const officialChannels = [
  'संस्था की आधिकारिक वेबसाइट',

  'आधिकारिक WhatsApp चैनल',

  'आधिकारिक YouTube चैनल',

  'आधिकारिक Telegram चैनल',
];

const memberResponsibilities = [
  'योजना के सभी नियमों एवं शर्तों का पालन करे।',

  'निर्धारित सहयोग समय पर करे।',

  'सहयोग अपील में निरंतर सहभागिता बनाए रखे।',

  'अपनी सदस्यता एवं व्यक्तिगत जानकारी सही रखे।',

  'योजना से संबंधित आधिकारिक सूचनाओं का पालन करे।',

  'किसी पात्र सदस्य के दिवंगत होने की स्थिति में उसके नामिनी के सहयोग में सहभागिता करे।',

  'संस्था एवं उसके पदाधिकारियों के साथ अनुशासन एवं सम्मानजनक व्यवहार बनाए रखे।',
];

/* =========================================================
   SHARED LIST
   ========================================================= */

const RuleList = ({
  items,
  tone = 'primary',
}) => {
  const isDanger =
    tone === 'danger';

  const isGreen =
    tone === 'green';

  return (
    <Stack
      spacing={1.2}
    >
      {items.map(
        (
          item,
          index
        ) => (
          <Box
            key={`${item}-${index}`}
            sx={{
              display:
                'flex',

              alignItems:
                'flex-start',

              gap:
                1.2,

              p: {
                xs: 1.4,
                md: 1.6,
              },

              borderRadius:
                2.5,

              bgcolor:
                isDanger
                  ? COLORS.softRed
                  : isGreen
                    ? COLORS.softGreen
                    : index % 2 === 0
                      ? COLORS.softBlue
                      : COLORS.soft,

              border:
                isDanger
                  ? '1px solid rgba(180,35,24,0.15)'
                  : isGreen
                    ? '1px solid rgba(21,128,93,0.16)'
                    : `1px solid ${COLORS.border}`,
            }}
          >
            <CheckCircleRounded
              sx={{
                mt:
                  '2px',

                color:
                  isDanger
                    ? COLORS.red
                    : isGreen
                      ? COLORS.green
                      : COLORS.mainDark,

                fontSize:
                  21,

                flexShrink:
                  0,
              }}
            />

            <Typography
              sx={{
                color:
                  COLORS.text,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.86rem',
                  md: '0.95rem',
                },

                fontWeight:
                  650,

                lineHeight:
                  1.7,
              }}
            >
              {item}
            </Typography>
          </Box>
        )
      )}
    </Stack>
  );
};

/* =========================================================
   RULE CARD
   ========================================================= */

const RuleCard = ({
  id,
  number,
  title,
  icon,
  children,
  tone = 'primary',
}) => {
  const isDanger =
    tone === 'danger';

  const isGreen =
    tone === 'green';

  const isWarning =
    tone === 'warning';

  const accent =
    isDanger
      ? COLORS.red
      : isGreen
        ? COLORS.green
        : isWarning
          ? COLORS.orange
          : COLORS.main;

  const softBackground =
    isDanger
      ? COLORS.softRed
      : isGreen
        ? COLORS.softGreen
        : isWarning
          ? COLORS.softOrange
          : '#ffffff';

  return (
    <Paper
      id={id}
      elevation={0}
      sx={{
        position:
          'relative',

        overflow:
          'hidden',

        scrollMarginTop:
          '120px',

        mb: {
          xs: 2.5,
          md: 3,
        },

        p: {
          xs: 2.4,
          sm: 3,
          md: 3.7,
        },

        borderRadius: {
          xs: '22px',
          md: '28px',
        },

        bgcolor:
          softBackground,

        border:
          isDanger
            ? '1px solid rgba(180,35,24,0.18)'
            : isGreen
              ? '1px solid rgba(21,128,93,0.18)'
              : isWarning
                ? '1px solid rgba(181,71,8,0.18)'
                : `1px solid ${COLORS.border}`,

        boxShadow:
          '0 18px 46px rgba(8,47,73,0.075)',

        '&::before': {
          content:
            '""',

          position:
            'absolute',

          top: 0,
          left: 0,
          bottom: 0,

          width:
            6,

          bgcolor:
            accent,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        sx={{
          mb:
            2.2,
        }}
      >
        <Box
          sx={{
            width:
              48,

            height:
              48,

            minWidth:
              48,

            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            color:
              '#ffffff',

            bgcolor:
              accent,

            borderRadius:
              '15px',

            boxShadow:
              `0 10px 25px ${accent}33`,
          }}
        >
          {icon}
        </Box>

        <Box
          sx={{
            flex:
              1,
          }}
        >
          <Typography
            sx={{
              color:
                accent,

              fontFamily:
                FONT,

              fontSize:
                '0.75rem',

              fontWeight:
                900,

              letterSpacing:
                '0.7px',
            }}
          >
            नियम {number}
          </Typography>

          <Typography
            component="h2"
            sx={{
              mt:
                0.25,

              color:
                COLORS.dark,

              fontFamily:
                FONT,

              fontSize: {
                xs: '1.08rem',
                md: '1.3rem',
              },

              fontWeight:
                900,

              lineHeight:
                1.45,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          pl: {
            xs: 0,
            md: 0.5,
          },

          color:
            COLORS.muted,

          '& p': {
            m: 0,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

/* =========================================================
   BODY TEXT
   ========================================================= */

const BodyText = ({
  children,
  mt = 0,
  mb = 0,
  bold = false,
}) => (
  <Typography
    sx={{
      mt,
      mb,

      color:
        COLORS.muted,

      fontFamily:
        FONT,

      fontSize: {
        xs: '0.9rem',
        md: '1rem',
      },

      fontWeight:
        bold
          ? 800
          : 600,

      lineHeight:
        1.85,

      textAlign:
        'justify',
    }}
  >
    {children}
  </Typography>
);

/* =========================================================
   PAGE
   ========================================================= */

const Tab2Niyamawali = () => {
  const scrollToRule =
    (
      id
    ) => {
      const element =
        document.getElementById(
          id
        );

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior:
          'smooth',

        block:
          'start',
      });
    };

  return (
    <Layout>
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <Box
        sx={{
          position:
            'relative',

          overflow:
            'hidden',

          py: {
            xs: 5,
            md: 7,
          },

          color:
            '#ffffff',

          background: `
            radial-gradient(
              circle at 10% 20%,
              rgba(103,232,249,0.12),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              ${COLORS.darkest} 0%,
              ${COLORS.dark} 48%,
              ${COLORS.mainDark} 100%
            )
          `,

          borderBottom:
            `4px solid ${COLORS.cyan}`,
        }}
      >
        <Box
          sx={{
            position:
              'absolute',

            width:
              320,

            height:
              320,

            right:
              -150,

            top:
              -160,

            borderRadius:
              '50%',

            bgcolor:
              'rgba(34,211,238,0.07)',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position:
              'relative',

            zIndex:
              1,

            textAlign:
              'center',
          }}
        >
          <Box
            sx={{
              width:
                70,

              height:
                70,

              mx:
                'auto',

              mb:
                2,

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              borderRadius:
                '22px',

              bgcolor:
                'rgba(255,255,255,0.12)',

              border:
                '1px solid rgba(255,255,255,0.20)',
            }}
          >
            <GavelRounded
              sx={{
                color:
                  COLORS.light,

                fontSize:
                  40,
              }}
            />
          </Box>

          <Typography
            sx={{
              color:
                COLORS.light,

              fontFamily:
                FONT,

              fontSize:
                '0.8rem',

              fontWeight:
                900,

              letterSpacing:
                '1.5px',
            }}
          >
            PMUMS EMPLOYEE WELFARE RULES
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt:
                0.7,

              color:
                '#ffffff',

              fontFamily:
                FONT,

              fontWeight:
                950,

              fontSize: {
                xs: '1.85rem',
                sm: '2.35rem',
                md: '2.9rem',
              },

              lineHeight:
                1.25,
            }}
          >
            PMUMS कर्मचारी कल्याण कोष योजना
          </Typography>

          <Typography
            sx={{
              mt:
                0.8,

              color:
                '#ffffff',

              fontFamily:
                FONT,

              fontSize: {
                xs: '1.2rem',
                md: '1.55rem',
              },

              fontWeight:
                900,
            }}
          >
            नियमावली
          </Typography>

          <Typography
            sx={{
              maxWidth:
                900,

              mx:
                'auto',

              mt:
                1.6,

              color:
                '#d9f8ff',

              fontFamily:
                FONT,

              fontSize: {
                xs: '0.9rem',
                md: '1rem',
              },

              fontWeight:
                650,

              lineHeight:
                1.8,
            }}
          >
            स्कूल शिक्षा विभाग एवं आदिम जाति कल्याण विभाग को
            छोड़कर अन्य सभी विभागों के लिए।
          </Typography>

          <Chip
            icon={
              <VerifiedRounded />
            }
            label="द्वितीय समूह"
            sx={{
              mt:
                2.5,

              color:
                '#ffffff',

              bgcolor:
                'rgba(255,255,255,0.10)',

              border:
                '1px solid rgba(103,232,249,0.28)',

              fontFamily:
                FONT,

              fontWeight:
                900,

              '& .MuiChip-icon':
                {
                  color:
                    COLORS.light,
                },
            }}
          />
        </Container>
      </Box>

      {/* ================================================= */}
      {/* PAGE BODY */}
      {/* ================================================= */}

      <Box
        sx={{
          py: {
            xs: 4,
            md: 6,
          },

          minHeight:
            '100vh',

          background: `
            radial-gradient(
              circle at top right,
              rgba(34,211,238,0.07),
              transparent 25%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              ${COLORS.background} 45%,
              ${COLORS.soft} 100%
            )
          `,
        }}
      >
        <Container maxWidth="lg">
          {/* ============================================= */}
          {/* प्रस्तावना */}
          {/* ============================================= */}

          <Paper
            elevation={0}
            sx={{
              position:
                'relative',

              overflow:
                'hidden',

              mb:
                4,

              p: {
                xs: 2.7,
                md: 4,
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
                '0 20px 55px rgba(8,47,73,0.08)',

              '&::before': {
                content:
                  '""',

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
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                mb:
                  2,
              }}
            >
              <Box
                sx={{
                  width:
                    48,

                  height:
                    48,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  borderRadius:
                    '15px',

                  bgcolor:
                    COLORS.mainDark,

                  color:
                    '#ffffff',
                }}
              >
                <DescriptionRounded />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color:
                      COLORS.mainDark,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.75rem',

                    fontWeight:
                      900,

                    letterSpacing:
                      '1px',
                  }}
                >
                  INTRODUCTION
                </Typography>

                <Typography
                  sx={{
                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize: {
                      xs: '1.25rem',
                      md: '1.55rem',
                    },

                    fontWeight:
                      950,
                  }}
                >
                  प्रस्तावना
                </Typography>
              </Box>
            </Stack>

            <BodyText>
              PMUMS (संघ की कर्मचारी कल्याण कोष योजना) एक
              कर्मचारी-केंद्रित कल्याणकारी पहल है। इसका उद्देश्य
              विभिन्न शासकीय विभागों एवं संस्थानों में कार्यरत
              कर्मचारियों तथा उनके परिवारों को आवश्यकता की स्थिति
              में सामूहिक सहयोग एवं सहायता उपलब्ध कराना है।
            </BodyText>

            <BodyText mt={2}>
              यह योजना पारस्परिक सहयोग, मानवीय संवेदना, सामाजिक
              उत्तरदायित्व, अनुशासन, पारदर्शिता एवं सामूहिक
              सहभागिता की भावना पर आधारित है।
            </BodyText>
          </Paper>

          {/* ============================================= */}
          {/* IMPORTANT QUICK SUMMARY */}
          {/* ============================================= */}

          <Grid
            container
            spacing={2}
            sx={{
              mb:
                4,
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  height:
                    '100%',

                  p:
                    2.3,

                  borderRadius:
                    3,

                  bgcolor:
                    COLORS.softBlue,

                  border:
                    `1px solid ${COLORS.border}`,
                }}
              >
                <LockClockRounded
                  sx={{
                    color:
                      COLORS.mainDark,

                    fontSize:
                      30,
                  }}
                />

                <Typography
                  sx={{
                    mt:
                      1,

                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize:
                      '1.15rem',

                    fontWeight:
                      900,
                  }}
                >
                  06 माह / 180 दिवस
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.5,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.82rem',

                    fontWeight:
                      600,

                    lineHeight:
                      1.6,
                  }}
                >
                  नवीन सदस्य की निर्धारित लॉकिंग अवधि।
                </Typography>
              </Paper>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  height:
                    '100%',

                  p:
                    2.3,

                  borderRadius:
                    3,

                  bgcolor:
                    COLORS.softGreen,

                  border:
                    '1px solid rgba(21,128,93,0.17)',
                }}
              >
                <PercentRounded
                  sx={{
                    color:
                      COLORS.green,

                    fontSize:
                      30,
                  }}
                />

                <Typography
                  sx={{
                    mt:
                      1,

                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize:
                      '1.15rem',

                    fontWeight:
                      900,
                  }}
                >
                  न्यूनतम 90%
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.5,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.82rem',

                    fontWeight:
                      600,

                    lineHeight:
                      1.6,
                  }}
                >
                  निर्धारित सहयोग अपीलों में आवश्यक सहभागिता।
                </Typography>
              </Paper>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  height:
                    '100%',

                  p:
                    2.3,

                  borderRadius:
                    3,

                  bgcolor:
                    COLORS.softOrange,

                  border:
                    '1px solid rgba(181,71,8,0.17)',
                }}
              >
                <TaskAltRounded
                  sx={{
                    color:
                      COLORS.orange,

                    fontSize:
                      30,
                  }}
                />

                <Typography
                  sx={{
                    mt:
                      1,

                    color:
                      COLORS.dark,

                    fontFamily:
                      FONT,

                    fontSize:
                      '1.15rem',

                    fontWeight:
                      900,
                  }}
                >
                  सहयोग में निरंतरता
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.5,

                    color:
                      COLORS.muted,

                    fontFamily:
                      FONT,

                    fontSize:
                      '0.82rem',

                    fontWeight:
                      600,

                    lineHeight:
                      1.6,
                  }}
                >
                  पात्रता बनाए रखने के लिए नियमित सहभागिता आवश्यक।
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ============================================= */}
          {/* QUICK NAVIGATION */}
          {/* ============================================= */}

          <Paper
            elevation={0}
            sx={{
              mb:
                4,

              p: {
                xs: 2.4,
                md: 3,
              },

              borderRadius:
                3.5,

              bgcolor:
                '#ffffff',

              border:
                `1px solid ${COLORS.border}`,

              boxShadow:
                '0 14px 35px rgba(8,47,73,0.05)',
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                mb:
                  2,
              }}
            >
              <InfoRounded
                sx={{
                  color:
                    COLORS.mainDark,
                }}
              />

              <Typography
                sx={{
                  color:
                    COLORS.dark,

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  fontSize:
                    '1rem',
                }}
              >
                नियमावली में सीधे जाएँ
              </Typography>
            </Stack>

            <Box
              sx={{
                display:
                  'flex',

                flexWrap:
                  'wrap',

                gap:
                  1,
              }}
            >
              {navigationItems.map(
                (
                  item,
                  index
                ) => (
                  <Chip
                    key={
                      item.id
                    }
                    label={`${index + 1}. ${item.label}`}
                    onClick={() =>
                      scrollToRule(
                        item.id
                      )
                    }
                    clickable
                    sx={{
                      height:
                        'auto',

                      py:
                        0.35,

                      bgcolor:
                        COLORS.soft,

                      color:
                        COLORS.dark,

                      border:
                        `1px solid ${COLORS.border}`,

                      fontFamily:
                        FONT,

                      fontWeight:
                        750,

                      fontSize:
                        '0.75rem',

                      '&:hover': {
                        bgcolor:
                          '#cffafe',

                        borderColor:
                          'rgba(8,145,178,0.40)',
                      },

                      '& .MuiChip-label':
                        {
                          whiteSpace:
                            'normal',

                          py:
                            0.4,
                        },
                    }}
                  />
                )
              )}
            </Box>
          </Paper>

          {/* ================================================= */}
          {/* RULE 1 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-1"
            number="1"
            title="योजना का उद्देश्य"
            icon={
              <VolunteerActivismRounded />
            }
          >
            <BodyText>
              PMUMS कर्मचारी कल्याण कोष योजना का प्रमुख उद्देश्य
              पात्र सदस्यों एवं उनके परिवारों को आवश्यकता की
              स्थिति में सामूहिक सहयोग उपलब्ध कराना तथा
              कर्मचारियों के बीच परस्पर सहयोग, सामाजिक सुरक्षा
              एवं भाईचारे की भावना को मजबूत करना है।
            </BodyText>

            <BodyText mt={1.7}>
              योजना का प्रयास है कि किसी पात्र सदस्य के साथ
              आकस्मिक घटना होने की स्थिति में उसके परिवार को
              निर्धारित नियमों के अनुसार सामूहिक सहयोग उपलब्ध
              कराया जा सके।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 2 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-2"
            number="2"
            title="योजना में सम्मिलित कर्मचारी"
            icon={
              <GroupsRounded />
            }
          >
            <BodyText mb={2}>
              PMUMS के अंतर्गत पात्रता एवं निर्धारित नियमों के
              अनुसार विभिन्न शासकीय विभागों, निगम-मंडलों,
              शासकीय उपक्रमों, बैंकों एवं सुरक्षा बलों में
              कार्यरत अधिकारी एवं कर्मचारी सम्मिलित हो सकते हैं।
            </BodyText>

            <Typography
              sx={{
                mb:
                  1.5,

                color:
                  COLORS.dark,

                fontFamily:
                  FONT,

                fontSize:
                  '0.95rem',

                fontWeight:
                  900,
              }}
            >
              प्रमुख रूप से निम्न कर्मचारी श्रेणियाँ सम्मिलित हैं—
            </Typography>

            <RuleList
              items={
                employeeCategories
              }
            />

            <BodyText mt={2} bold>
              सदस्यता एवं पात्रता योजना के निर्धारित नियमों एवं
              शर्तों के अधीन होगी।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 3 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-3"
            number="3"
            title="सहयोग की अपील हेतु पात्रता"
            icon={
              <VerifiedRounded />
            }
          >
            <BodyText mb={2}>
              PMUMS कर्मचारी कल्याण कोष योजना के अंतर्गत किसी
              सदस्य के लिए सहयोग की अपील जारी करने एवं उसके
              नामिनी को सहयोग प्रदान करने हेतु निम्नलिखित पात्रता
              एवं शर्तें लागू होंगी।
            </BodyText>

            <Paper
              elevation={0}
              sx={{
                mb:
                  2,

                p:
                  2,

                borderRadius:
                  2.5,

                bgcolor:
                  COLORS.softBlue,

                border:
                  `1px solid ${COLORS.border}`,
              }}
            >
              <Typography
                sx={{
                  color:
                    COLORS.mainDark,

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  mb:
                    0.8,
                }}
              >
                3.1 नवीन सदस्य की पात्रता
              </Typography>

              <BodyText>
                नवीन सदस्य को सहयोग प्राप्त करने की पात्रता हेतु
                सदस्यता की लॉकिंग अवधि 06 माह (180 दिवस) निर्धारित
                होगी।
              </BodyText>

              <BodyText mt={1.3}>
                सदस्यता के 180 दिवस पूर्ण होने के पश्चात घटित होने
                वाली पात्र घटना के संबंध में ही संबंधित सदस्य के
                नामिनी हेतु सहयोग की अपील की जा सकेगी।
              </BodyText>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p:
                  2,

                borderRadius:
                  2.5,

                bgcolor:
                  COLORS.softOrange,

                border:
                  '1px solid rgba(181,71,8,0.18)',
              }}
            >
              <Typography
                sx={{
                  color:
                    COLORS.orange,

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  mb:
                    0.8,
                }}
              >
                3.2 लॉकिंग अवधि पूर्ण न होने की स्थिति
              </Typography>

              <BodyText>
                यदि सदस्य की निर्धारित 06 माह (180 दिवस) की
                लॉकिंग अवधि पूर्ण नहीं हुई है, तो उस अवधि के
                दौरान घटित घटना के संबंध में सहयोग की अपील स्वीकार
                नहीं की जाएगी।
              </BodyText>

              <BodyText mt={1.3}>
                ऐसे सदस्य अथवा उनके नामिनी द्वारा पूर्व में किए
                गए सहयोग के आधार पर लॉकिंग अवधि पूर्ण होने से
                पूर्व किसी प्रकार के सहयोग अथवा लाभ का दावा नहीं
                किया जा सकेगा।
              </BodyText>
            </Paper>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 4 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-4"
            number="4"
            title="सहयोग प्रारंभ होने के बाद सदस्य का योगदान"
            icon={
              <TaskAltRounded />
            }
            tone="green"
          >
            <BodyText>
              किसी सदस्य के लिए सहयोग की प्रक्रिया प्रारंभ होने
              के पश्चात संबंधित सदस्य द्वारा निर्धारित सहयोग करना
              अनिवार्य होगा।
            </BodyText>

            <BodyText mt={1.5}>
              यदि कोई सदस्य निर्धारित सहयोग नहीं करता है, तो वह
              भविष्य में सहयोग प्राप्त करने हेतु अपात्र हो जाता
              है।
            </BodyText>

            <BodyText mt={1.5} bold>
              सदस्यता का आधार केवल लाभ प्राप्त करना नहीं, बल्कि
              योजना की सामूहिक सहयोग व्यवस्था में नियमित
              सहभागिता करना है।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 5 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-5"
            number="5"
            title="सहयोग में निरंतरता की अनिवार्यता"
            icon={
              <AccountBalanceRounded />
            }
          >
            <BodyText>
              सहयोग प्रक्रिया में सम्मिलित होने के पश्चात प्रत्येक
              सदस्य के लिए निर्धारित सहयोग में निरंतर भाग लेना
              आवश्यक होगा।
            </BodyText>

            <BodyText mt={1.5}>
              सदस्य द्वारा लगातार 06 सहयोग अपील क्रमांक में सहयोग
              पूर्ण करने के बाद यदि किसी एक सहयोग अपील क्रमांक में
              सहयोग नहीं किया जाता है, तो सदस्य की सहयोग प्राप्त
              करने की पात्रता बनी रहेगी।
            </BodyText>

            <BodyText mt={1.5}>
              किन्तु यदि सदस्य द्वारा लगातार 02 सहयोग अपील क्रमांक
              में निर्धारित सहयोग नहीं किया जाता है अथवा सहयोग में
              निरंतरता नहीं रखी जाती और सहयोग में चूक की जाती है,
              तो संबंधित सदस्य सहयोग प्राप्त करने हेतु अपात्र हो
              जाएगा।
            </BodyText>

            <Paper
              elevation={0}
              sx={{
                mt:
                  2,

                p:
                  1.8,

                borderRadius:
                  2.5,

                bgcolor:
                  COLORS.softOrange,

                border:
                  '1px solid rgba(181,71,8,0.16)',
              }}
            >
              <BodyText bold>
                अर्थात, लगातार दो सहयोग अपील क्रमांक में सहयोग न
                करने अथवा सहयोग में निरंतरता नहीं रखने पर सदस्य की
                सहयोग प्राप्त करने की पात्रता समाप्त हो जाएगी।
              </BodyText>
            </Paper>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 6 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-6"
            number="6"
            title="पारंपरिक चूक नियम"
            icon={
              <WarningAmberRounded />
            }
            tone="warning"
          >
            <BodyText>
              यदि कोई सदस्य लगातार 05 सहयोग पूर्ण कर चुका है और
              उसके पश्चात किसी कारणवश अगला सहयोग नहीं कर पाता तथा
              उसी सहयोग प्रक्रिया के अंतराल में सदस्य की मृत्यु
              हो जाती है, तो ऐसी विशेष परिस्थिति में भी उसके
              नामिनी हेतु सहयोग की अपील की जाएगी।
            </BodyText>

            <BodyText mt={1.5}>
              यह प्रावधान उस स्थिति में लागू होगा जब सदस्य ने
              पूर्व में निर्धारित 05 लगातार सहयोग पूर्ण किए हों
              तथा उसकी मृत्यु सहयोग प्रक्रिया के निर्धारित अंतराल
              के दौरान हुई हो।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 7 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-7"
            number="7"
            title="90% सहभागिता नियम"
            icon={
              <PercentRounded />
            }
            tone="green"
          >
            <BodyText>
              प्रत्येक सदस्य को अपनी पंजीकरण तिथि के पश्चात होने
              वाले कुल निर्धारित सहयोगों में से न्यूनतम 90% सहयोग
              अपील क्रमांक करना अनिवार्य होगा।
            </BodyText>

            <BodyText mt={1.5}>
              यदि किसी सदस्य द्वारा निर्धारित कुल सहयोगों में
              90% से कम सहभागिता की जाती है, तो संबंधित सदस्य का
              नामिनी सहयोग लाभ हेतु अपात्र माना जाएगा।
            </BodyText>

            <BodyText mt={1.5} bold>
              इस विषय में कोई अपील अथवा विशेष अनुरोध स्वीकार्य
              नहीं होगा।
            </BodyText>

            <Paper
              elevation={0}
              sx={{
                mt:
                  2.2,

                p: {
                  xs: 2,
                  md: 2.4,
                },

                borderRadius:
                  2.5,

                bgcolor:
                  '#ffffff',

                border:
                  '1px solid rgba(21,128,93,0.20)',
              }}
            >
              <Typography
                sx={{
                  color:
                    COLORS.greenDark,

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  mb:
                    1,
                }}
              >
                उदाहरण
              </Typography>

              <BodyText>
                यदि सदस्य की पंजीकरण तिथि के पश्चात 10 सहयोग
                अपील निर्धारित होते हैं, तो सदस्य द्वारा न्यूनतम
                09 सहयोग अपील करना अनिवार्य होगा। इसी प्रकार, यदि
                सदस्य की पंजीकरण तिथि के पश्चात 20 सहयोग अपील
                निर्धारित होते हैं, तो सदस्य द्वारा न्यूनतम 18
                सहयोग अपील करना अनिवार्य होगा।
              </BodyText>

              <BodyText mt={1.3}>
                आगे भी सहयोग अपील की निर्धारित संख्या के अनुसार
                सदस्य द्वारा न्यूनतम निर्धारित सहयोग अपील करना
                अनिवार्य होगा। निर्धारित न्यूनतम सहयोग अपील पूर्ण
                नहीं करने की स्थिति में सदस्य अपात्र हो सकता है।
              </BodyText>
            </Paper>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 8 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-8"
            number="8"
            title="पुनः पात्रता के नियम"
            icon={
              <RestartAltRounded />
            }
          >
            <BodyText mb={2}>
              यदि कोई सदस्य लगातार दो या दो से अधिक सहयोग अपील
              क्रमांक में निर्धारित सहयोग नहीं करने अथवा सहयोग में
              निरंतरता नहीं रख पाने के कारण अपात्र हो जाता है, तो
              ऐसी स्थिति में उसकी सदस्यता की लॉकिंग अवधि पुनः 06
              माह (180 दिवस) निर्धारित होगी।
            </BodyText>

            <Typography
              sx={{
                mb:
                  1.4,

                color:
                  COLORS.dark,

                fontFamily:
                  FONT,

                fontWeight:
                  900,
              }}
            >
              यदि वह सदस्य पुनः योजना के लाभों में सम्मिलित होना
              चाहता है, तो निम्न शर्तें लागू होंगी—
            </Typography>

            <RuleList
              items={[
                'उसे पुनः लगातार 05 सहयोग अपील क्रमांक में निर्धारित सहयोग करना अनिवार्य होगा।',

                'लगातार 05 सहयोग अपील पूर्ण करने के पश्चात ही सदस्य की पुनः पात्रता/सदस्यता मान्य मानी जाएगी।',

                'पुनः पात्रता प्राप्त करने के लिए सदस्य को योजना के सभी निर्धारित नियमों एवं शर्तों का पालन करना अनिवार्य होगा।',
              ]}
            />
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 9 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-9"
            number="9"
            title="माता-पिता के लिए संवेदनशील सहयोग प्रावधान"
            icon={
              <FamilyRestroomRounded />
            }
            tone="green"
          >
            <BodyText>
              दिवंगत सदस्य के परिवार—अर्थात उसकी पत्नी, पुत्र,
              पुत्री अथवा सदस्य द्वारा नामित नोमिनी—को सहयोग
              प्रदान करते समय यह भी विचार किया जाएगा कि दिवंगत
              सदस्य के माता-पिता जीवित हैं अथवा नहीं।
            </BodyText>

            <BodyText mt={1.5}>
              यदि दिवंगत सदस्य के माता-पिता जीवित हैं, उनकी
              आर्थिक स्थिति कमजोर है तथा उनकी आय का कोई स्थायी
              स्रोत उपलब्ध नहीं है, तो ऐसी परिस्थिति में, यदि
              संस्थापक मंडल को यह उचित प्रतीत होता है कि
              माता-पिता को भी सहयोग प्रदान किया जाना चाहिए, तो
              संस्थापक मंडल दिवंगत सदस्य के नोमिनी के साथ-साथ
              उसके माता-पिता के सहयोग हेतु भी सहयोग की अपील जारी
              कर सकेगा।
            </BodyText>

            <Typography
              sx={{
                mt:
                  2,

                mb:
                  1.4,

                color:
                  COLORS.greenDark,

                fontFamily:
                  FONT,

                fontWeight:
                  900,
              }}
            >
              यह प्रावधान निम्न परिस्थितियों में भी लागू किया जा
              सकेगा—
            </Typography>

            <RuleList
              items={
                parentConditions
              }
              tone="green"
            />

            <BodyText mt={2}>
              माता-पिता को सहयोग प्रदान करने का निर्णय उनकी
              वास्तविक परिस्थिति एवं उपलब्ध तथ्यों के आधार पर
              संस्थापक मंडल के विवेक एवं निर्णय से लिया जाएगा।
            </BodyText>

            <BodyText mt={1.5} bold>
              यह प्रावधान योजना की संवेदनशीलता, पारिवारिक
              उत्तरदायित्व एवं मानवीय मूल्यों का प्रतीक है।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 10 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-10"
            number="10"
            title="अपात्रता एवं अनुशासन संबंधी नियम"
            icon={
              <SecurityRounded />
            }
            tone="danger"
          >
            <BodyText mb={2}>
              योजना की पारदर्शिता, अनुशासन एवं विश्वसनीयता बनाए
              रखने हेतु निम्न परिस्थितियों में सदस्य को अपात्र
              घोषित किया जा सकता है—
            </BodyText>

            <RuleList
              items={
                disqualificationItems
              }
              tone="danger"
            />

            <BodyText mt={2}>
              ऐसे मामलों में उपलब्ध तथ्यों एवं परिस्थितियों के
              आधार पर संस्था/संस्थापक मंडल द्वारा उचित निर्णय
              लिया जा सकेगा।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 11 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-11"
            number="11"
            title="आत्महत्या, अपराध एवं विवादित प्रकरण"
            icon={
              <WarningAmberRounded />
            }
            tone="danger"
          >
            <BodyText>
              सामान्यतः आत्महत्या अथवा अत्यंत विवादित परिस्थितियों
              में सहयोग की अपील नहीं की जाएगी।
            </BodyText>

            <BodyText mt={1.5}>
              हत्या, बलात्कार जैसे जघन्य अपराधों के मामलों में
              मुख्य आरोपी को योजना के अंतर्गत कोई लाभ प्रदान नहीं
              किया जाएगा।
            </BodyText>

            <BodyText mt={1.5}>
              ऐसे संवेदनशील अथवा विवादित मामलों को संबंधित जिले
              के सदस्यों के समक्ष प्रस्तुत किया जा सकेगा।
            </BodyText>

            <BodyText mt={1.5}>
              उपलब्ध तथ्यों, परिस्थितियों एवं प्रकरण की गंभीरता
              के आधार पर जिले द्वारा लिया गया निर्णय योजना के
              अंतर्गत अंतिम एवं मान्य माना जाएगा, विषयगत कानूनों
              एवं सक्षम प्राधिकारी के आदेशों के अधीन।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 12 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-12"
            number="12"
            title="शिक्षक नेतृत्व का महत्व"
            icon={
              <GroupsRounded />
            }
          >
            <BodyText>
              शिक्षक राष्ट्र निर्माता एवं समाज के मार्गदर्शक होते
              हैं।
            </BodyText>

            <BodyText mt={1.5}>
              सेवा, पारदर्शिता, अनुशासन एवं संवेदनशील नेतृत्व की
              भावना को ध्यान में रखते हुए PMUMS कर्मचारी कल्याण
              कोष योजना का संचालन शिक्षक नेतृत्व में किया जाता है।
            </BodyText>

            <BodyText mt={1.5}>
              शिक्षक नेतृत्व का उद्देश्य संगठन में विश्वास,
              पारदर्शिता, अनुशासन एवं मानवीय संवेदनाओं को बनाए
              रखना है, ताकि योजना का संचालन निष्पक्ष एवं
              कर्मचारी-केंद्रित भावना के साथ किया जा सके।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 13 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-13"
            number="13"
            title="आधिकारिक सूचना माध्यम"
            icon={
              <NotificationsActiveRounded />
            }
          >
            <BodyText mb={2}>
              योजना से संबंधित सभी आधिकारिक सूचनाएँ केवल संस्था
              द्वारा निर्धारित आधिकारिक माध्यमों से ही जारी की
              जाएँगी।
            </BodyText>

            <Typography
              sx={{
                mb:
                  1.4,

                color:
                  COLORS.dark,

                fontFamily:
                  FONT,

                fontWeight:
                  900,
              }}
            >
              प्रमुख आधिकारिक माध्यम—
            </Typography>

            <RuleList
              items={
                officialChannels
              }
            />

            <BodyText mt={2}>
              सभी सदस्यों से अपेक्षा की जाती है कि वे संस्था के
              आधिकारिक सूचना माध्यमों को Follow/Subscribe करें
              तथा योजना से संबंधित महत्वपूर्ण सूचनाओं एवं
              घोषणाओं से स्वयं को अपडेट रखें।
            </BodyText>

            <BodyText mt={1.5} bold>
              किसी अनधिकृत व्यक्ति, समूह अथवा माध्यम से प्राप्त
              सूचना को संस्था की आधिकारिक सूचना नहीं माना जाएगा।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 14 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-14"
            number="14"
            title="सदस्य का दायित्व"
            icon={
              <TaskAltRounded />
            }
            tone="green"
          >
            <Typography
              sx={{
                mb:
                  1.4,

                color:
                  COLORS.greenDark,

                fontFamily:
                  FONT,

                fontWeight:
                  900,
              }}
            >
              प्रत्येक सदस्य का दायित्व होगा कि वह—
            </Typography>

            <RuleList
              items={
                memberResponsibilities
              }
              tone="green"
            />
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 15 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-15"
            number="15"
            title="दिवंगत सदस्य के नामिनी हेतु सहयोग"
            icon={
              <VolunteerActivismRounded />
            }
          >
            <BodyText>
              किसी पात्र सदस्य के दिवंगत होने की स्थिति में,
              योजना के निर्धारित नियमों के अनुसार उसके द्वारा
              नामित नोमिनी के लिए सहयोग की अपील जारी की जाएगी।
            </BodyText>

            <BodyText mt={1.5}>
              सहयोग की अपील सदस्य की पात्रता, सदस्यता अवधि,
              सहयोग में सहभागिता, लॉकिंग पीरियड एवं अन्य लागू
              नियमों के आधार पर की जाएगी।
            </BodyText>

            <BodyText mt={1.5}>
              यदि योजना के विशेष प्रावधानों के अनुसार दिवंगत
              सदस्य के माता-पिता को भी सहयोग हेतु पात्र माना जाता
              है, तो संस्थापक मंडल द्वारा उनके लिए भी पृथक अथवा
              संयुक्त सहयोग अपील जारी की जा सकेगी।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 16 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-16"
            number="16"
            title="सहयोग राशि एवं अपील प्रक्रिया"
            icon={
              <AccountBalanceRounded />
            }
          >
            <BodyText>
              सहयोग राशि, सहयोग अपील की प्रक्रिया, अपील की अवधि
              तथा संबंधित अन्य व्यवस्थाएँ PMUMS कर्मचारी कल्याण
              कोष योजना के निर्धारित प्रावधानों के अनुसार होंगी।
            </BodyText>

            <BodyText mt={1.5}>
              किसी सदस्य की पात्रता अथवा सहयोग संबंधी निर्णय
              उपलब्ध अभिलेखों, सदस्यता विवरण एवं योजना के लागू
              नियमों के आधार पर किया जाएगा।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 17 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-17"
            number="17"
            title="नियमों की व्याख्या एवं विशेष परिस्थितियों में निर्णय"
            icon={
              <GavelRounded />
            }
            tone="warning"
          >
            <BodyText>
              योजना के नियमों की व्याख्या, विशेष परिस्थितियों में
              निर्णय तथा ऐसे मामलों में जिनका स्पष्ट उल्लेख
              नियमावली में नहीं है, संस्थापक मंडल द्वारा उपलब्ध
              तथ्यों एवं परिस्थितियों के आधार पर निर्णय लिया जा
              सकेगा।
            </BodyText>

            <BodyText mt={1.5} bold>
              योजना के संचालन में पारदर्शिता, निष्पक्षता, मानवीय
              संवेदना एवं सामूहिक हित को प्राथमिकता दी जाएगी।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* RULE 18 */}
          {/* ================================================= */}

          <RuleCard
            id="rule-18"
            number="18"
            title="अंतिम निर्देश"
            icon={
              <VerifiedRounded />
            }
            tone="green"
          >
            <BodyText>
              सभी सदस्यों से अपेक्षा की जाती है कि कर्मचारी
              कल्याण कोष के किसी पात्र सदस्य के दिवंगत होने की
              स्थिति में उसके नामिनी के सहयोग में योजना के
              निर्धारित नियमों के अनुसार अनिवार्य रूप से
              सहभागिता करें।
            </BodyText>

            <BodyText mt={1.5}>
              सदस्यता केवल व्यक्तिगत लाभ प्राप्त करने का माध्यम
              नहीं, बल्कि पारस्परिक सहयोग, सामूहिक उत्तरदायित्व
              और सामाजिक संवेदना की भावना पर आधारित है।
            </BodyText>
          </RuleCard>

          {/* ================================================= */}
          {/* FINAL COMMITMENT */}
          {/* ================================================= */}

          <Paper
            elevation={0}
            sx={{
              position:
                'relative',

              overflow:
                'hidden',

              mt:
                4,

              p: {
                xs: 3,
                sm: 4,
                md: 5,
              },

              textAlign:
                'center',

              color:
                '#ffffff',

              borderRadius: {
                xs: '26px',
                md: '34px',
              },

              background: `
                linear-gradient(
                  135deg,
                  ${COLORS.darkest} 0%,
                  ${COLORS.dark} 48%,
                  ${COLORS.mainDark} 100%
                )
              `,

              border:
                '1px solid rgba(103,232,249,0.20)',

              boxShadow:
                '0 26px 70px rgba(8,47,73,0.20)',

              '&::before': {
                content:
                  '""',

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
                    ${COLORS.green},
                    ${COLORS.cyan},
                    ${COLORS.light}
                  )`,
              },
            }}
          >
            <Box
              sx={{
                position:
                  'relative',

                zIndex:
                  1,
              }}
            >
              <Box
                sx={{
                  width:
                    68,

                  height:
                    68,

                  mx:
                    'auto',

                  mb:
                    2,

                  display:
                    'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  borderRadius:
                    '22px',

                  bgcolor:
                    'rgba(255,255,255,0.12)',

                  border:
                    '1px solid rgba(255,255,255,0.20)',
                }}
              >
                <VolunteerActivismRounded
                  sx={{
                    color:
                      COLORS.light,

                    fontSize:
                      38,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color:
                    COLORS.light,

                  fontFamily:
                    FONT,

                  fontSize:
                    '0.8rem',

                  fontWeight:
                    900,

                  letterSpacing:
                    '1.5px',
                }}
              >
                OUR COMMITMENT
              </Typography>

              <Typography
                component="h2"
                sx={{
                  mt:
                    0.7,

                  color:
                    '#ffffff',

                  fontFamily:
                    FONT,

                  fontSize: {
                    xs: '1.45rem',
                    md: '1.9rem',
                  },

                  fontWeight:
                    950,
                }}
              >
                हमारा संकल्प
              </Typography>

              <Typography
                sx={{
                  maxWidth:
                    900,

                  mx:
                    'auto',

                  mt:
                    2,

                  color:
                    COLORS.light,

                  fontFamily:
                    FONT,

                  fontSize: {
                    xs: '1rem',
                    md: '1.25rem',
                  },

                  fontWeight:
                    900,

                  lineHeight:
                    1.7,
                }}
              >
                “एक सदस्य की विपत्ति में पूरा संगठन साथ खड़ा
                हो—यही PMUMS की मूल भावना है।”
              </Typography>

              <Divider
                sx={{
                  maxWidth:
                    180,

                  mx:
                    'auto',

                  my:
                    2.5,

                  borderColor:
                    'rgba(103,232,249,0.25)',
                }}
              />

              <Typography
                sx={{
                  maxWidth:
                    900,

                  mx:
                    'auto',

                  color:
                    '#e0faff',

                  fontFamily:
                    FONT,

                  fontSize: {
                    xs: '0.9rem',
                    md: '1rem',
                  },

                  fontWeight:
                    550,

                  lineHeight:
                    1.9,
                }}
              >
                यह योजना केवल आर्थिक सहायता का माध्यम नहीं, बल्कि
                मानवीय संवेदना, सामाजिक एकजुटता, अनुशासन,
                पारिवारिक उत्तरदायित्व एवं पारस्परिक विश्वास का
                प्रतीक है।
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Tab2Niyamawali;