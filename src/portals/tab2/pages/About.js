import React from 'react';

import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  BusinessCenterRounded,
  CheckCircleRounded,
  GroupsRounded,
  HandshakeRounded,
  SecurityRounded,
  VisibilityRounded,
  VolunteerActivismRounded,
} from '@mui/icons-material';

import Layout from '../../../components/Layout/Layout';

/*
 * TAB 2 specific Self Donation.
 * Do not use the Teacher/common component here.
 */
import SelfDonation from '../../../components/SelfDonation';

/* =========================================================
   TAB 2 ABOUT PAGE

   File:
   src/portals/tab2/pages/About.js

   TAB 1 / Teacher About remains untouched.
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

  softGreen: '#edf9f4',

  background: '#f8fdff',

  white: '#ffffff',

  text: '#16323d',

  muted: '#526874',

  border:
    'rgba(8,145,178,0.18)',
};

/* =========================================================
   CLIENT CONTENT - ELIGIBLE EMPLOYEES
   ========================================================= */

const eligibleEmployees = [
  'नियमित अधिकारी एवं कर्मचारी',

  'संविदा अधिकारी एवं कर्मचारी',

  'आउटसोर्स कर्मचारी',

  'अस्थाई कर्मचारी',

  'कंप्यूटर ऑपरेटर एवं आई.टी. कर्मचारी',

  'आंगनवाड़ी कार्यकर्ता एवं सहायिका',

  'विभागीय अथवा संस्थागत व्यवस्था के अंतर्गत कार्यरत अन्य पात्र कर्मचारी',
];

/* =========================================================
   PORTAL / WORKING METHOD POINTS
   ========================================================= */

const workingMethodItems = [
  'योजना से संबंधित आवश्यक एवं विश्वसनीय जानकारी एक ही स्थान पर उपलब्ध कराना।',

  'पात्रता एवं लागू प्रावधानों की जानकारी सरल रूप में उपलब्ध कराना।',

  'आवश्यक दस्तावेजों एवं प्रक्रिया से संबंधित जानकारी उपलब्ध कराना।',

  'पंजीयन एवं सहायता से संबंधित प्रक्रिया को सरल और व्यवस्थित बनाना।',

  'सहायता प्रक्रिया में पारदर्शिता एवं स्पष्टता बनाए रखने का प्रयास करना।',
];

/* =========================================================
   PRIORITIES
   ========================================================= */

const priorities = [
  {
    icon:
      <CheckCircleRounded />,

    title:
      'सरल प्रक्रिया',

    description:
      'कर्मचारी को योजना एवं आवश्यक प्रक्रिया आसानी से समझ में आए।',
  },

  {
    icon:
      <VisibilityRounded />,

    title:
      'पारदर्शिता',

    description:
      'पात्रता, प्रक्रिया एवं सहायता से संबंधित जानकारी स्पष्ट रहे।',
  },

  {
    icon:
      <SecurityRounded />,

    title:
      'विश्वसनीय जानकारी',

    description:
      'कर्मचारियों तक सही एवं व्यवस्थित जानकारी पहुँचाने का प्रयास।',
  },

  {
    icon:
      <GroupsRounded />,

    title:
      'कर्मचारी-केंद्रित सेवा',

    description:
      'पूरी व्यवस्था कर्मचारी एवं उसके परिवार की सुविधा को ध्यान में रखकर विकसित की जाए।',
  },
];

/* =========================================================
   SECTION HEADING
   ========================================================= */

const SectionHeading = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <Box
      sx={{
        maxWidth: 900,

        mx: 'auto',

        mb: {
          xs: 3,
          md: 4,
        },

        textAlign: 'center',
      }}
    >
      {eyebrow && (
        <Typography
          sx={{
            color:
              COLORS.mainDark,

            fontFamily:
              FONT,

            fontSize:
              '0.78rem',

            fontWeight:
              900,

            letterSpacing:
              '1.4px',
          }}
        >
          {eyebrow}
        </Typography>
      )}

      <Typography
        component="h2"
        sx={{
          mt:
            eyebrow
              ? 0.7
              : 0,

          color:
            COLORS.dark,

          fontFamily:
            FONT,

          fontWeight:
            950,

          fontSize: {
            xs: '1.55rem',
            sm: '1.8rem',
            md: '2.15rem',
          },

          lineHeight:
            1.35,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          width:
            90,

          height:
            5,

          borderRadius:
            99,

          mx:
            'auto',

          mt:
            1.7,

          background:
            `linear-gradient(
              90deg,
              ${COLORS.mainDark},
              ${COLORS.main},
              ${COLORS.cyan}
            )`,
        }}
      />

      {description && (
        <Typography
          sx={{
            maxWidth:
              820,

            mx:
              'auto',

            mt:
              1.6,

            color:
              COLORS.muted,

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
          {description}
        </Typography>
      )}
    </Box>
  );
};

/* =========================================================
   STANDARD CONTENT CARD
   ========================================================= */

const ContentCard = ({
  children,
  green = false,
  sx = {},
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position:
          'relative',

        overflow:
          'hidden',

        mb: {
          xs: 3,
          md: 4,
        },

        p: {
          xs: 2.7,
          sm: 3.5,
          md: 5,
        },

        borderRadius: {
          xs: '24px',
          md: '32px',
        },

        bgcolor:
          green
            ? COLORS.softGreen
            : '#ffffff',

        border:
          green
            ? '1px solid rgba(21,128,93,0.18)'
            : `1px solid ${COLORS.border}`,

        boxShadow:
          '0 22px 60px rgba(8,47,73,0.09)',

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
            green
              ? COLORS.green
              : `linear-gradient(
                  90deg,
                  ${COLORS.dark},
                  ${COLORS.main},
                  ${COLORS.cyan}
                )`,
        },

        ...sx,
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
        {children}
      </Box>
    </Paper>
  );
};

/* =========================================================
   CHECK LIST
   ========================================================= */

const CheckList = ({
  items,
}) => {
  return (
    <Stack
      spacing={1.3}
    >
      {items.map(
        (
          item,
          index
        ) => (
          <Box
            key={
              item
            }
            sx={{
              display:
                'flex',

              alignItems:
                'flex-start',

              gap:
                1.2,

              p:
                1.5,

              borderRadius:
                2.5,

              bgcolor:
                index % 2 === 0
                  ? COLORS.softBlue
                  : COLORS.soft,

              border:
                `1px solid ${COLORS.border}`,
            }}
          >
            <CheckCircleRounded
              sx={{
                mt:
                  '2px',

                color:
                  index % 2 === 0
                    ? COLORS.mainDark
                    : COLORS.green,

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
                  md: '0.96rem',
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
   ABOUT PAGE
   ========================================================= */

const Tab2About = () => {
  return (
    <Layout>
      <Box
        sx={{
          minHeight:
            '100vh',

          position:
            'relative',

          overflow:
            'hidden',

          py: {
            xs: 5,
            md: 7,
          },

          background: `
            radial-gradient(
              circle at top left,
              rgba(34,211,238,0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(21,128,93,0.07),
              transparent 32%
            ),
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f8fdff 48%,
              #ecfeff 100%
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
              360,

            height:
              360,

            top:
              -180,

            left:
              -160,

            borderRadius:
              '50%',

            bgcolor:
              'rgba(34,211,238,0.06)',
          }}
        />

        <Box
          sx={{
            position:
              'absolute',

            width:
              300,

            height:
              300,

            bottom:
              -160,

            right:
              -140,

            borderRadius:
              '50%',

            bgcolor:
              'rgba(21,128,93,0.05)',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position:
              'relative',

            zIndex:
              1,
          }}
        >
          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <Paper
            elevation={0}
            sx={{
              position:
                'relative',

              overflow:
                'hidden',

              mb: {
                xs: 3,
                md: 4,
              },

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
                md: '36px',
              },

              background: `
                linear-gradient(
                  135deg,
                  ${COLORS.darkest} 0%,
                  ${COLORS.dark} 46%,
                  ${COLORS.mainDark} 100%
                )
              `,

              border:
                '1px solid rgba(103,232,249,0.20)',

              boxShadow:
                '0 28px 78px rgba(8,47,73,0.22)',

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
                    ${COLORS.main},
                    ${COLORS.cyan},
                    ${COLORS.light}
                  )`,
              },

              '&::after': {
                content:
                  '""',

                position:
                  'absolute',

                width:
                  280,

                height:
                  280,

                borderRadius:
                  '50%',

                right:
                  -120,

                bottom:
                  -150,

                bgcolor:
                  'rgba(103,232,249,0.08)',
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
                <BusinessCenterRounded
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
                    '0.82rem',

                  fontWeight:
                    900,

                  letterSpacing:
                    '1.6px',
                }}
              >
                ABOUT PMUMS
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
                    xs: '2rem',
                    sm: '2.5rem',
                    md: '3rem',
                  },

                  lineHeight:
                    1.25,
                }}
              >
                PMUMS के बारे में
              </Typography>

              <Typography
                sx={{
                  maxWidth:
                    850,

                  mx:
                    'auto',

                  mt:
                    1.5,

                  color:
                    '#d9f8ff',

                  fontFamily:
                    FONT,

                  fontSize: {
                    xs: '1rem',
                    md: '1.2rem',
                  },

                  fontWeight:
                    800,

                  lineHeight:
                    1.65,
                }}
              >
                PMUMS शिक्षक संघ की कर्मचारी कल्याण कोष योजना
              </Typography>

              <Chip
                label="द्वितीय समूह • अन्य शासकीय विभाग एवं संस्थान"
                sx={{
                  mt:
                    2.5,

                  height:
                    'auto',

                  py:
                    0.5,

                  px:
                    1,

                  color:
                    '#ffffff',

                  bgcolor:
                    'rgba(255,255,255,0.10)',

                  border:
                    '1px solid rgba(103,232,249,0.25)',

                  fontFamily:
                    FONT,

                  fontWeight:
                    800,

                  '& .MuiChip-label':
                    {
                      whiteSpace:
                        'normal',

                      textAlign:
                        'center',

                      lineHeight:
                        1.5,
                    },
                }}
              />
            </Box>
          </Paper>

          {/* ================================================= */}
          {/* ABOUT */}
          {/* ================================================= */}

          <ContentCard>
            <SectionHeading
              eyebrow="ABOUT THE INITIATIVE"
              title="कर्मचारी-केंद्रित कल्याणकारी पहल"
            />

            <Typography
              sx={{
                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              PMUMS शिक्षक संघ की कर्मचारी कल्याण कोष योजना
              एक कर्मचारी-केंद्रित कल्याणकारी पहल है, जिसका
              उद्देश्य मध्य प्रदेश के विभिन्न शासकीय विभागों
              एवं संस्थानों में कार्यरत नियमित, अस्थाई, संविदा
              एवं आउटसोर्स कर्मचारियों को एक सरल, सुव्यवस्थित
              एवं पारदर्शी माध्यम से सुरक्षा एवं सहायता संबंधी
              सुविधाओं से जोड़ना है।
            </Typography>

            <Typography
              sx={{
                mt:
                  2.5,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              PMUMS का उद्देश्य कर्मचारियों एवं उनके परिवारों
              को आवश्यकता के समय सहायता एवं सहयोग उपलब्ध कराने
              की दिशा में एक व्यवस्थित कर्मचारी कल्याण व्यवस्था
              स्थापित करना है।
            </Typography>
          </ContentCard>

          {/* ================================================= */}
          {/* OBJECTIVE */}
          {/* ================================================= */}

          <ContentCard>
            <SectionHeading
              eyebrow="OUR OBJECTIVE"
              title="हमारा उद्देश्य"
              description="संकट की घड़ी में पात्र सदस्य के परिवार तक सामूहिक सहयोग एवं आर्थिक संबल पहुँचाना।"
            />

            <Typography
              sx={{
                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              यह योजना किसी पात्र सदस्य के दिवंगत हो जाने की
              स्थिति में उसके परिवार को संवेदनशील सामाजिक एवं
              आर्थिक सुरक्षा प्रदान करने के उद्देश्य से
              संचालित की जाती है। योजना का मुख्य उद्देश्य
              दिवंगत सदस्य के परिवार को कठिन समय में आर्थिक
              मजबूती प्रदान करना तथा उन्हें आत्मनिर्भर बनने में
              सहयोग देना है।
            </Typography>

            <Typography
              sx={{
                mt:
                  2.4,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              योजना से जुड़े किसी पात्र सदस्य के दिवंगत होने
              पर योजना के सभी सदस्यों द्वारा संस्थापक मंडल
              द्वारा निर्धारित सहयोग राशि दिवंगत परिवार को
              प्रदान की जाती है। प्रत्येक सदस्य द्वारा दी जाने
              वाली सहयोग राशि भले ही अल्प हो, लेकिन सभी
              सदस्यों के सामूहिक सहयोग से दिवंगत परिवार को एक
              मजबूत आर्थिक सहारा प्राप्त होता है।
            </Typography>

            {/* COLLECTIVE SUPPORT HIGHLIGHT */}

            <Paper
              elevation={0}
              sx={{
                mt:
                  3,

                p: {
                  xs: 2.3,
                  md: 3,
                },

                borderRadius:
                  3,

                bgcolor:
                  COLORS.softGreen,

                border:
                  '1px solid rgba(21,128,93,0.20)',
              }}
            >
              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={2}
                alignItems="center"
              >
                <Box
                  sx={{
                    width:
                      54,

                    height:
                      54,

                    flexShrink:
                      0,

                    display:
                      'flex',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',

                    borderRadius:
                      '18px',

                    bgcolor:
                      COLORS.green,

                    color:
                      '#ffffff',
                  }}
                >
                  <VolunteerActivismRounded
                    sx={{
                      fontSize:
                        30,
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color:
                        COLORS.greenDark,

                      fontFamily:
                        FONT,

                      fontWeight:
                        900,

                      fontSize: {
                        xs: '1rem',
                        md: '1.15rem',
                      },
                    }}
                  >
                    “सामूहिक सहयोग से सामाजिक सुरक्षा”
                  </Typography>

                  <Typography
                    sx={{
                      mt:
                        0.6,

                      color:
                        COLORS.muted,

                      fontFamily:
                        FONT,

                      fontWeight:
                        600,

                      fontSize:
                        '0.9rem',

                      lineHeight:
                        1.75,
                    }}
                  >
                    प्रत्येक सदस्य का छोटा-सा योगदान किसी
                    जरूरतमंद परिवार के लिए बड़ी सहायता का
                    माध्यम बनता है।
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Typography
              sx={{
                mt:
                  3,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              योजना का उद्देश्य केवल आर्थिक सहयोग प्रदान करना
              ही नहीं, बल्कि दिवंगत सदस्य के परिवार को यह
              विश्वास दिलाना भी है कि कठिन परिस्थिति में पूरा
              सदस्य परिवार उनके साथ खड़ा है।
            </Typography>

            <Typography
              sx={{
                mt:
                  2.2,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              यह योजना आपसी सहयोग, संवेदनशीलता और सामाजिक
              उत्तरदायित्व की भावना को मजबूत करते हुए प्रत्येक
              सदस्य एवं उसके परिवार को विपरीत परिस्थितियों में
              एक सुरक्षित एवं सहयोगात्मक वातावरण प्रदान करने
              का प्रयास करती है।
            </Typography>
          </ContentCard>

          {/* ================================================= */}
          {/* EMPLOYEE COVERAGE */}
          {/* ================================================= */}

          <ContentCard>
            <SectionHeading
              eyebrow="ELIGIBILITY"
              title="किन कर्मचारियों को सम्मिलित किया गया है?"
              description="PMUMS के अंतर्गत पात्रता एवं लागू नियमों के अनुसार विभिन्न श्रेणियों में कार्यरत कर्मचारियों को सम्मिलित किया गया है।"
            />

            <Grid
              container
              spacing={1.5}
            >
              {eligibleEmployees.map(
                (
                  employee
                ) => (
                  <Grid
                    key={
                      employee
                    }
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Box
                      sx={{
                        height:
                          '100%',

                        display:
                          'flex',

                        alignItems:
                          'flex-start',

                        gap:
                          1.1,

                        p:
                          1.7,

                        borderRadius:
                          2.5,

                        bgcolor:
                          COLORS.soft,

                        border:
                          `1px solid ${COLORS.border}`,
                      }}
                    >
                      <CheckCircleRounded
                        sx={{
                          mt:
                            '2px',

                          color:
                            COLORS.mainDark,

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

                          fontSize:
                            '0.9rem',

                          fontWeight:
                            700,

                          lineHeight:
                            1.65,
                        }}
                      >
                        {employee}
                      </Typography>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </ContentCard>

          {/* ================================================= */}
          {/* KEY PURPOSE */}
          {/* ================================================= */}

          <ContentCard green>
            <SectionHeading
              eyebrow="EMPLOYEE WELFARE"
              title="कर्मचारी कल्याण को सरल एवं प्रभावी बनाना"
            />

            <Typography
              sx={{
                maxWidth:
                  950,

                mx:
                  'auto',

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'center',
              }}
            >
              PMUMS का प्रमुख उद्देश्य विभिन्न श्रेणियों में
              कार्यरत कर्मचारियों तक कर्मचारी कल्याण, सुरक्षा
              एवं सहायता की व्यवस्था को सरल, प्रभावी एवं
              पारदर्शी तरीके से पहुँचाना है।
            </Typography>

            <Typography
              sx={{
                maxWidth:
                  950,

                mx:
                  'auto',

                mt:
                  2,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'center',
              }}
            >
              हमारा प्रयास है कि कर्मचारी को योजना से संबंधित
              जानकारी, पात्रता, आवश्यक दस्तावेज, सहायता एवं
              प्रक्रिया की जानकारी एक ही स्थान पर आसानी से
              उपलब्ध हो सके।
            </Typography>
          </ContentCard>

          {/* ================================================= */}
          {/* WORKING METHOD */}
          {/* ================================================= */}

          <ContentCard>
            <SectionHeading
              eyebrow="WORKING METHOD"
              title="हमारी कार्यप्रणाली"
              description="कर्मचारी कल्याण से संबंधित जानकारी एवं सहायता प्रक्रिया को सरल, सुव्यवस्थित और पारदर्शी बनाने का प्रयास।"
            />

            <Typography
              sx={{
                mb:
                  2.5,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.95rem',
                  md: '1.06rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.9,

                textAlign:
                  'justify',
              }}
            >
              योजना के अंतर्गत पात्र कर्मचारियों को उनकी
              पात्रता एवं लागू प्रावधानों के अनुसार आवश्यक
              जानकारी एवं सहायता उपलब्ध कराने का प्रयास किया
              जाता है। पोर्टल के माध्यम से कर्मचारी योजना की
              जानकारी, पात्रता, आवश्यक दस्तावेज, पंजीयन एवं
              सहायता से संबंधित जानकारी आसानी से प्राप्त कर
              सकते हैं।
            </Typography>

            <CheckList
              items={
                workingMethodItems
              }
            />
          </ContentCard>

          {/* ================================================= */}
          {/* PRIORITIES */}
          {/* ================================================= */}

          <ContentCard>
            <SectionHeading
              eyebrow="OUR PRIORITIES"
              title="हमारी प्राथमिकताएँ"
              description="सरल प्रक्रिया | पारदर्शिता | विश्वसनीय जानकारी | कर्मचारी-केंद्रित सेवा"
            />

            <Grid
              container
              spacing={2}
            >
              {priorities.map(
                (
                  item,
                  index
                ) => (
                  <Grid
                    key={
                      item.title
                    }
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height:
                          '100%',

                        display:
                          'flex',

                        gap:
                          1.7,

                        alignItems:
                          'flex-start',

                        p: {
                          xs: 2,
                          md: 2.5,
                        },

                        borderRadius:
                          3,

                        bgcolor:
                          index % 2 === 0
                            ? COLORS.softBlue
                            : COLORS.softGreen,

                        border:
                          index % 2 === 0
                            ? `1px solid ${COLORS.border}`
                            : '1px solid rgba(21,128,93,0.18)',

                        transition:
                          'all 0.25s ease',

                        '&:hover': {
                          transform:
                            'translateY(-4px)',

                          boxShadow:
                            '0 16px 35px rgba(8,47,73,0.08)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          minWidth:
                            48,

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
                            '16px',

                          color:
                            '#ffffff',

                          bgcolor:
                            index % 2 === 0
                              ? COLORS.mainDark
                              : COLORS.green,
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            color:
                              COLORS.dark,

                            fontFamily:
                              FONT,

                            fontSize:
                              '1rem',

                            fontWeight:
                              900,
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt:
                              0.6,

                            color:
                              COLORS.muted,

                            fontFamily:
                              FONT,

                            fontSize:
                              '0.86rem',

                            fontWeight:
                              600,

                            lineHeight:
                              1.65,
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )
              )}
            </Grid>

            <Typography
              sx={{
                maxWidth:
                  920,

                mx:
                  'auto',

                mt:
                  3,

                color:
                  COLORS.muted,

                fontFamily:
                  FONT,

                fontSize: {
                  xs: '0.92rem',
                  md: '1rem',
                },

                fontWeight:
                  600,

                lineHeight:
                  1.85,

                textAlign:
                  'center',
              }}
            >
              हमारा उद्देश्य ऐसी व्यवस्था विकसित करना है जिसमें
              कर्मचारी को आवश्यक जानकारी एवं सहायता प्राप्त
              करने में सुविधा हो तथा पूरी प्रक्रिया स्पष्ट और
              व्यवस्थित हो।
            </Typography>
          </ContentCard>

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
                  ${COLORS.dark} 46%,
                  ${COLORS.mainDark} 100%
                )
              `,

              border:
                '1px solid rgba(103,232,249,0.20)',

              boxShadow:
                '0 25px 70px rgba(8,47,73,0.20)',

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
                <HandshakeRounded
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

                  fontWeight:
                    950,

                  fontSize: {
                    xs: '1.55rem',
                    md: '2.1rem',
                  },
                }}
              >
                हमारा संकल्प
              </Typography>

              <Typography
                sx={{
                  maxWidth:
                    850,

                  mx:
                    'auto',

                  mt:
                    2,

                  color:
                    COLORS.light,

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  fontSize: {
                    xs: '1rem',
                    md: '1.25rem',
                  },

                  lineHeight:
                    1.7,
                }}
              >
                “कर्मचारी का सम्मान, सुरक्षा का भरोसा और सहायता
                की सरल व्यवस्था।”
              </Typography>

              <Typography
                sx={{
                  maxWidth:
                    900,

                  mx:
                    'auto',

                  mt:
                    2.2,

                  color:
                    '#e0faff',

                  fontFamily:
                    FONT,

                  fontSize: {
                    xs: '0.92rem',
                    md: '1.02rem',
                  },

                  fontWeight:
                    550,

                  lineHeight:
                    1.9,
                }}
              >
                PMUMS के माध्यम से हमारा संकल्प है कि कर्मचारियों
                के कल्याण एवं सुरक्षा के लिए एक ऐसी विश्वसनीय और
                सुव्यवस्थित व्यवस्था विकसित की जाए, जो आवश्यकता
                के समय कर्मचारियों और उनके परिवारों के लिए सहयोग
                का माध्यम बन सके।
              </Typography>

              <Typography
                sx={{
                  mt:
                    3,

                  color:
                    '#ffffff',

                  fontFamily:
                    FONT,

                  fontWeight:
                    900,

                  fontSize: {
                    xs: '0.95rem',
                    md: '1.08rem',
                  },
                }}
              >
                PMUMS — कर्मचारी कल्याण के लिए समर्पित एक पहल
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* =================================================== */}
      {/* TAB 2 SELF DONATION */}
      {/* Same page ending concept as TAB 1 About */}
      {/* =================================================== */}

      <Box
        sx={{
          background:
            COLORS.soft,
        }}
      >
        <SelfDonation />
      </Box>
    </Layout>
  );
};

export default Tab2About;