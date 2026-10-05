import React from 'react';

import {
  ArrowForwardRounded,
  BusinessCenterRounded,
  CheckCircleRounded,
  FavoriteRounded,
  GroupsRounded,
  KeyboardArrowDownRounded,
  SchoolRounded,
  VerifiedRounded,
  VolunteerActivismRounded,
} from '@mui/icons-material';

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import {
  alpha,
} from '@mui/material/styles';

import {
  useNavigate,
} from 'react-router-dom';

import {
  PORTALS,
} from './portalConfig';

import {
  setActivePortalSlug,
} from './portalStorage';

const DEVANAGARI_FONT =
  '"Poppins", "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

const BRAND = {
  dark: '#21193f',

  dark2: '#2a2250',

  dark3: '#3b316c',

  primary: '#6f5cc2',

  primaryLight: '#b9a7ff',

  primaryExtraLight:
    '#eee9ff',

  cream: '#f7f5ef',

  creamLight: '#fffdf9',

  white: '#ffffff',

  text: '#21193f',

  textSecondary:
    '#606475',

  border: '#e6e0ef',

  success: '#16815d',

  successLight:
    '#edf9f4',

  yellow: '#f5c842',

  yellowLight:
    '#fff7cf',
};

const impactItems = [
  {
    value: '₹5 करोड़+',

    label:
      'अब तक सहायता',

    description:
      'दिवंगत एवं पीड़ित साथियों के परिवारों तक सामूहिक सहयोग।',

    icon:
      VolunteerActivismRounded,
  },

  {
    value: 'औसतन 5',

    label:
      'परिवार प्रति माह',

    description:
      'हर माह संकटग्रस्त परिवारों के साथ कर्मचारी परिवार खड़ा है।',

    icon:
      GroupsRounded,
  },

  {
    value:
      '₹25–26 लाख',

    label:
      'मासिक औसत सहायता',

    description:
      'प्रति माह पात्र दिवंगत परिवारों तक पहुंचने वाला सामूहिक सहयोग।',

    icon:
      FavoriteRounded,
  },
];

const departmentNames = [
  'स्वास्थ्य',

  'राजस्व',

  'बैंक',

  'पंचायत एवं ग्रामीण विकास',

  'सुरक्षा बल',

  'शासकीय उपक्रम',

  'अन्य विभाग',
];

const getPortalIcon = (
  slug
) => {
  if (slug === 'tab1') {
    return SchoolRounded;
  }

  return BusinessCenterRounded;
};

const SectionHeading = ({
  eyebrow,

  title,

  description,

  align = 'center',
}) => {
  return (
    <Box
      sx={{
        maxWidth: 900,

        mx:
          align === 'center'
            ? 'auto'
            : 0,

        textAlign: align,
      }}
    >
      {eyebrow && (
        <Typography
          sx={{
            mb: 0.8,

            color:
              BRAND.primary,

            fontFamily:
              DEVANAGARI_FONT,

            fontSize: {
              xs: '0.75rem',

              md: '0.82rem',
            },

            fontWeight: 900,

            letterSpacing:
              '0.04em',
          }}
        >
          {eyebrow}
        </Typography>
      )}

      <Typography
        component="h2"
        sx={{
          color:
            BRAND.text,

          fontFamily:
            DEVANAGARI_FONT,

          fontSize: {
            xs: '1.55rem',

            sm: '1.9rem',

            md: '2.3rem',
          },

          fontWeight: 900,

          lineHeight: 1.35,

          letterSpacing:
            '-0.01em',
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            mt: 1.3,

            color:
              BRAND.textSecondary,

            fontFamily:
              DEVANAGARI_FONT,

            fontSize: {
              xs: '0.92rem',

              md: '1rem',
            },

            fontWeight: 500,

            lineHeight: 1.9,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

const PortalSelector = () => {
  const navigate =
    useNavigate();

  const [upcomingPortal, setUpcomingPortal] = React.useState(null);

  /*
   * Keep upcoming groups visible on the landing page so users
   * can understand the planned structure. Disabled groups cannot
   * be entered; selecting them opens the Coming Soon dialog.
   */
  const visiblePortals =
    PORTALS.filter(
      (portal) =>
        portal.showOnLanding ===
          true
    );

  React.useEffect(() => {
    /*
     * When landing page itself mounts,
     * always begin from top.
     */
    window.scrollTo({
      top: 0,

      left: 0,

      behavior: 'auto',
    });
  }, []);

  const scrollToPortalSelection =
    () => {
      const section =
        document.getElementById(
          'portal-selection'
        );

      if (!section) {
        return;
      }

      section.scrollIntoView({
        behavior: 'smooth',

        block: 'start',
      });
    };

  const openPortal = (
    portal
  ) => {
    if (!portal?.enabled) {
      setUpcomingPortal(portal);
      return;
    }

    setActivePortalSlug(
      portal.slug
    );

    /*
     * Reset page before route switch.
     */
    window.scrollTo({
      top: 0,

      left: 0,

      behavior: 'auto',
    });

    navigate(
      `/portal/${portal.slug}`
    );

    /*
     * React Router can retain scroll
     * position until new layout renders,
     * so reset once more after render.
     */
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,

        left: 0,

        behavior: 'auto',
      });
    });
  };

  return (
    <Box
      sx={{
        minHeight:
          '100vh',

        bgcolor:
          BRAND.cream,

        color:
          BRAND.text,

        fontFamily:
          DEVANAGARI_FONT,
      }}
    >
      {/* ============================================= */}
      {/* STICKY LANDING NAVIGATION */}
      {/* ============================================= */}

      <Box
        component="header"
        sx={{
          position: 'sticky',

          top: 0,

          zIndex: 1300,

          width: '100%',

          color:
            BRAND.white,

          background:
            'rgba(33,25,63,0.97)',

          backdropFilter:
            'blur(14px)',

          WebkitBackdropFilter:
            'blur(14px)',

          borderBottom:
            '1px solid rgba(255,255,255,0.12)',

          boxShadow:
            '0 8px 26px rgba(16,11,37,0.17)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: {
                xs: 68,

                sm: 72,

                md: 76,
              },

              py: 0.9,

              display: 'flex',

              alignItems:
                'center',

              justifyContent:
                'space-between',

              gap: 2,
            }}
          >
            {/* Brand */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={{
                xs: 1,

                sm: 1.3,
              }}
              sx={{
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 49,

                    sm: 54,
                  },

                  height: {
                    xs: 49,

                    sm: 54,
                  },

                  p: 0.5,

                  flexShrink: 0,

                  bgcolor:
                    BRAND.white,

                  borderRadius:
                    '50%',

                  border:
                    '2px solid rgba(185,167,255,0.9)',

                  boxShadow:
                    '0 6px 18px rgba(0,0,0,0.22)',
                }}
              >
                <Box
                  component="img"
                  src="/pmums logo.png"
                  alt="PMUMS कर्मचारी कल्याण कोष"
                  sx={{
                    width: '100%',

                    height: '100%',

                    display:
                      'block',

                    objectFit:
                      'contain',
                  }}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color:
                      '#cfc5ff',

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize: {
                      xs: '0.58rem',

                      sm: '0.68rem',
                    },

                    fontWeight:
                      800,

                    lineHeight: 1.2,
                  }}
                >
                  पी.एम.यू.एम.एस.
                </Typography>

                <Typography
                  sx={{
                    mt: 0.2,

                    color:
                      BRAND.white,

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize: {
                      xs: '0.9rem',

                      sm: '1.06rem',

                      md: '1.18rem',
                    },

                    fontWeight:
                      900,

                    lineHeight: 1.25,

                    whiteSpace: {
                      xs: 'normal',

                      sm: 'nowrap',
                    },
                  }}
                >
                  कर्मचारी कल्याण कोष
                </Typography>
              </Box>
            </Stack>

            {/* Header actions */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                flexShrink: 0,
              }}
            >
              <Chip
                icon={
                  <VerifiedRounded />
                }
                label="पंजीयन पूर्णतः निःशुल्क"
                sx={{
                  display: {
                    xs: 'none',

                    md: 'flex',
                  },

                  height: 35,

                  color:
                    BRAND.white,

                  bgcolor:
                    'rgba(255,255,255,0.08)',

                  border:
                    '1px solid rgba(255,255,255,0.16)',

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontWeight:
                    800,

                  '& .MuiChip-icon':
                    {
                      color:
                        '#bfead8',
                    },
                }}
              />

              <Button
                variant="contained"
                onClick={
                  scrollToPortalSelection
                }
                endIcon={
                  <KeyboardArrowDownRounded />
                }
                sx={{
                  minHeight: {
                    xs: 39,

                    sm: 42,
                  },

                  px: {
                    xs: 1.3,

                    sm: 1.8,
                  },

                  color:
                    '#302600',

                  bgcolor:
                    '#ffe16a',

                  borderRadius:
                    2.2,

                  textTransform:
                    'none',

                  whiteSpace:
                    'nowrap',

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontSize: {
                    xs: '0.72rem',

                    sm: '0.82rem',
                  },

                  fontWeight:
                    900,

                  boxShadow:
                    '0 5px 14px rgba(0,0,0,0.17)',

                  '&:hover': {
                    bgcolor:
                      '#f7d54b',

                    transform:
                      'translateY(-1px)',
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: 'none',

                      sm: 'inline',
                    },
                  }}
                >
                  अपना समूह चुनें
                </Box>

                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: 'inline',

                      sm: 'none',
                    },
                  }}
                >
                  समूह
                </Box>
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ============================================= */}
      {/* HERO */}
      {/* ============================================= */}

      <Box
        component="section"
        sx={{
          position:
            'relative',

          overflow:
            'hidden',

          color:
            BRAND.white,

          background: `
            linear-gradient(
              135deg,
              #21193f 0%,
              #2b2352 48%,
              #433778 100%
            )
          `,

          borderBottom:
            `4px solid ${BRAND.primary}`,
        }}
      >
        {/* Decorations */}

        <Box
          sx={{
            position:
              'absolute',

            top: -190,

            left: -130,

            width: 430,

            height: 430,

            borderRadius:
              '50%',

            background:
              'radial-gradient(circle, rgba(185,167,255,0.26), transparent 68%)',

            pointerEvents:
              'none',
          }}
        />

        <Box
          sx={{
            position:
              'absolute',

            right: -170,

            bottom: -260,

            width: 540,

            height: 540,

            borderRadius:
              '50%',

            background:
              'radial-gradient(circle, rgba(149,127,235,0.22), transparent 69%)',

            pointerEvents:
              'none',
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position:
              'relative',

            zIndex: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: 1000,

              mx: 'auto',

              py: {
                xs: 5,

                sm: 6,

                md: 8,
              },

              textAlign:
                'center',
            }}
          >
            <Chip
              icon={
                <VerifiedRounded />
              }
              label="कर्मचारी कल्याण की साझा पहल"
              sx={{
                mb: 2.2,

                px: 0.6,

                color:
                  '#382c00',

                bgcolor:
                  '#ffe16a',

                border:
                  '1px solid rgba(255,255,255,0.38)',

                fontFamily:
                  DEVANAGARI_FONT,

                fontWeight:
                  900,

                boxShadow:
                  '0 8px 22px rgba(0,0,0,0.17)',

                '& .MuiChip-icon':
                  {
                    color:
                      '#665000',
                  },
              }}
            />

            <Typography
              component="h1"
              sx={{
                maxWidth: 980,

                mx: 'auto',

                color:
                  BRAND.white,

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '2rem',

                  sm: '2.7rem',

                  md: '3.55rem',
                },

                fontWeight:
                  900,

                lineHeight:
                  1.22,

                letterSpacing:
                  '-0.025em',
              }}
            >
              एक-दूसरे का सहारा,

              <Box
                component="span"
                sx={{
                  display:
                    'block',

                  mt: 2.5,

                  color:
                    '#d8d0ff',
                }}
              >
                एक परिवार की भावना
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 820,

                mx: 'auto',

                mt: 2.3,

                color:
                  '#eeeaff',

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '0.93rem',

                  sm: '1.03rem',

                  md: '1.1rem',
                },

                fontWeight:
                  500,

                lineHeight:
                  1.9,
              }}
            >
              मध्य प्रदेश के कर्मचारी साथियों एवं उनके
              परिवारों के लिए संकट की घड़ी में
              एक-दूसरे के साथ खड़े होने की मानवीय,
              पारदर्शी एवं सामूहिक पहल।
            </Typography>

            <Stack
              direction={{
                xs: 'column',

                sm: 'row',
              }}
              justifyContent="center"
              alignItems="center"
              spacing={1.5}
              sx={{
                mt: 3.5,
              }}
            >
              <Button
                variant="contained"
                onClick={
                  scrollToPortalSelection
                }
                endIcon={
                  <ArrowForwardRounded />
                }
                sx={{
                  minHeight: 48,

                  px: 3,

                  color:
                    '#2d2400',

                  bgcolor:
                    '#ffe16a',

                  borderRadius:
                    2.5,

                  textTransform:
                    'none',

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontWeight:
                    900,

                  boxShadow:
                    '0 9px 24px rgba(0,0,0,0.20)',

                  transition:
                    'all 0.2s ease',

                  '&:hover': {
                    bgcolor:
                      '#f7d54b',

                    transform:
                      'translateY(-2px)',
                  },
                }}
              >
                अपना समूह चुनें
              </Button>

              <Stack
                direction="row"
                alignItems="center"
                spacing={0.7}
              >
                <VerifiedRounded
                  sx={{
                    color:
                      '#a9ead0',

                    fontSize: 19,
                  }}
                />

                <Typography
                  sx={{
                    color:
                      '#e7e2f6',

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize:
                      '0.84rem',

                    fontWeight:
                      700,
                  }}
                >
                  पंजीयन हेतु कोई शुल्क नहीं
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="main">
        {/* =========================================== */}
        {/* FOUNDER MESSAGE */}
        {/* =========================================== */}

        <Container
          maxWidth="lg"
          sx={{
            py: {
              xs: 4.5,

              md: 6.5,
            },
          }}
        >
          <Card
            elevation={0}
            sx={{
              position:
                'relative',

              overflow:
                'hidden',

              borderRadius: {
                xs: 3,

                md: 4.5,
              },

              border:
                `1px solid ${BRAND.border}`,

              bgcolor:
                BRAND.creamLight,

              boxShadow:
                '0 20px 52px rgba(34,27,67,0.08)',
            }}
          >
            {/* Top accent */}

            <Box
              sx={{
                height: 5,

                background:
                  'linear-gradient(90deg, #6f5cc2, #b9a7ff, #f5c842)',
              }}
            />

            <Box
              sx={{
                p: {
                  xs: 2.5,

                  sm: 3.5,

                  md: 5,
                },
              }}
            >
              <Stack
                direction={{
                  xs: 'column',

                  sm: 'row',
                }}
                alignItems={{
                  xs: 'flex-start',

                  sm: 'center',
                }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography
                    sx={{
                      color:
                        BRAND.primary,

                      fontFamily:
                        DEVANAGARI_FONT,

                      fontSize:
                        '0.78rem',

                      fontWeight:
                        900,

                      letterSpacing:
                        '0.03em',
                    }}
                  >
                    संस्थापक का संदेश
                  </Typography>

                  <Typography
                    component="h2"
                    sx={{
                      mt: 0.6,

                      color:
                        BRAND.text,

                      fontFamily:
                        DEVANAGARI_FONT,

                      fontSize: {
                        xs: '1.35rem',

                        md: '1.75rem',
                      },

                      fontWeight:
                        900,
                    }}
                  >
                    मेरे सभी सम्माननीय कर्मचारी साथियों,
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.45,

                      color:
                        BRAND.text,

                      fontFamily:
                        DEVANAGARI_FONT,

                      fontWeight:
                        800,
                    }}
                  >
                    सादर जय हिंद एवं नमस्कार।
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display:
                      'flex',

                    alignItems:
                      'center',

                    gap: 1,

                    px: 1.5,

                    py: 0.9,

                    bgcolor:
                      BRAND.primaryExtraLight,

                    color:
                      BRAND.primary,

                    borderRadius: 2,

                    border:
                      '1px solid #dcd3ff',
                  }}
                >
                  <FavoriteRounded
                    sx={{
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily:
                        DEVANAGARI_FONT,

                      fontSize:
                        '0.78rem',

                      fontWeight:
                        900,
                    }}
                  >
                    एक कर्मचारी परिवार
                  </Typography>
                </Box>
              </Stack>

              <Typography
                sx={{
                  mt: 2.4,

                  color:
                    BRAND.textSecondary,

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontSize: {
                    xs: '0.94rem',

                    md: '1rem',
                  },

                  lineHeight: 2,
                }}
              >
                आज मैं आप सभी से किसी पद, विभाग या
                संवर्ग के प्रतिनिधि के रूप में नहीं,
                बल्कि एक परिवार के सदस्य के रूप में बात
                कर रहा हूँ। हम अलग-अलग विभागों में कार्य
                करते हैं—शिक्षा, पुलिस, स्वास्थ्य,
                राजस्व, पंचायत, बैंक, संविदा,
                आउटसोर्स, कंप्यूटर ऑपरेटर, आंगनवाड़ी
                एवं अन्य व्यवस्थाओं में। हमारी नियुक्तियां
                और सेवा शर्तें भले ही अलग हों, लेकिन हम
                सभी में एक बात समान है—हम अपने परिवार और
                समाज के लिए ईमानदारी से काम करने वाले
                कर्मचारी हैं।
              </Typography>

              <Typography
                sx={{
                  mt: 2,

                  color:
                    BRAND.textSecondary,

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontSize: {
                    xs: '0.94rem',

                    md: '1rem',
                  },

                  lineHeight: 2,
                }}
              >
                जीवन का सबसे कठिन समय वह होता है, जब
                परिवार का कोई सदस्य असमय हमसे बिछड़ जाता
                है। उस समय परिवार केवल अपना प्रियजन ही
                नहीं खोता, बल्कि कई बार आर्थिक सहारा भी
                खो देता है। ऐसे समय में केवल “ॐ शांति”
                लिख देना या दुःख व्यक्त करना पर्याप्त
                नहीं है।
              </Typography>

              {/* Quote */}

              <Box
                sx={{
                  mt: 3,

                  px: {
                    xs: 2,

                    md: 4,
                  },

                  py: {
                    xs: 2.4,

                    md: 3,
                  },

                  textAlign:
                    'center',

                  borderRadius: 3,

                  background:
                    'linear-gradient(135deg, #f1edff 0%, #fffdf9 100%)',

                  border:
                    '1px solid #dcd4ff',
                }}
              >
                <Typography
                  sx={{
                    color:
                      BRAND.text,

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize: {
                      xs: '1.18rem',

                      sm: '1.4rem',

                      md: '1.65rem',
                    },

                    fontWeight:
                      900,

                    lineHeight:
                      1.6,
                  }}
                >
                  सच्ची संवेदना तब है, जब हम उस
                  परिवार का हाथ पकड़कर कहें—
                </Typography>

                <Typography
                  sx={{
                    mt: 0.7,

                    color:
                      BRAND.primary,

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize: {
                      xs: '1.3rem',

                      sm: '1.55rem',

                      md: '1.9rem',
                    },

                    fontWeight:
                      900,

                    lineHeight:
                      1.5,
                  }}
                >
                  “आप अकेले नहीं हैं, हम आपके साथ हैं।”
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.6,

                  color:
                    BRAND.textSecondary,

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontSize: {
                    xs: '0.94rem',

                    md: '1rem',
                  },

                  lineHeight: 2,
                }}
              >
                इसी भावना से कर्मचारी कल्याण कोष की
                शुरुआत की गई। शिक्षा एवं जनजातीय कार्य
                विभाग में इस सामूहिक प्रयास के माध्यम से
                अब तक ₹5 करोड़ से अधिक की सहायता दिवंगत
                एवं पीड़ित साथियों के परिवारों तक पहुंचाई
                जा चुकी है। वर्तमान में हर माह औसतन 5
                दिवंगत परिवारों को ₹25 से ₹26 लाख तक की
                सहायता दी जा रही है।
              </Typography>
            </Box>
          </Card>
        </Container>

        {/* =========================================== */}
        {/* IMPACT */}
        {/* =========================================== */}

        <Box
          sx={{
            py: {
              xs: 5,

              md: 7,
            },

            bgcolor:
              BRAND.white,

            borderTop:
              `1px solid ${BRAND.border}`,

            borderBottom:
              `1px solid ${BRAND.border}`,
          }}
        >
          <Container maxWidth="lg">
            <SectionHeading
              eyebrow="हमारा सामूहिक प्रभाव"
              title="ये केवल आंकड़े नहीं हैं"
              description="इनके पीछे किसी बच्चे की पढ़ाई, किसी माँ की चिंता और किसी परिवार के भविष्य को संभालने की उम्मीद है।"
            />

            <Box
              sx={{
                mt: 4,

                display: 'grid',

                gridTemplateColumns: {
                  xs: '1fr',

                  sm:
                    'repeat(3, minmax(0,1fr))',
                },

                gap: 2.4,
              }}
            >
              {impactItems.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <Card
                      key={
                        item.label
                      }
                      elevation={0}
                      sx={{
                        height:
                          '100%',

                        p: {
                          xs: 2.5,

                          md: 3,
                        },

                        textAlign:
                          'center',

                        bgcolor:
                          '#fffdf9',

                        border:
                          `1px solid ${BRAND.border}`,

                        borderRadius:
                          3.5,

                        transition:
                          'all 0.22s ease',

                        '&:hover':
                          {
                            transform:
                              'translateY(-5px)',

                            boxShadow:
                              '0 18px 38px rgba(34,27,67,0.10)',

                            borderColor:
                              '#d5cdf1',
                          },
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,

                          height: 52,

                          mx: 'auto',

                          display:
                            'flex',

                          alignItems:
                            'center',

                          justifyContent:
                            'center',

                          borderRadius:
                            '50%',

                          bgcolor:
                            '#f0ecff',

                          color:
                            BRAND.primary,
                        }}
                      >
                        <Icon
                          sx={{
                            fontSize: 27,
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          mt: 1.6,

                          color:
                            BRAND.primary,

                          fontFamily:
                            DEVANAGARI_FONT,

                          fontSize: {
                            xs: '1.7rem',

                            md: '2rem',
                          },

                          fontWeight:
                            900,
                        }}
                      >
                        {
                          item.value
                        }
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.3,

                          color:
                            BRAND.text,

                          fontFamily:
                            DEVANAGARI_FONT,

                          fontSize:
                            '0.96rem',

                          fontWeight:
                            900,
                        }}
                      >
                        {
                          item.label
                        }
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,

                          color:
                            BRAND.textSecondary,

                          fontFamily:
                            DEVANAGARI_FONT,

                          fontSize:
                            '0.86rem',

                          lineHeight:
                            1.75,
                        }}
                      >
                        {
                          item.description
                        }
                      </Typography>
                    </Card>
                  );
                }
              )}
            </Box>
          </Container>
        </Box>

        {/* =========================================== */}
        {/* EXPANSION STORY */}
        {/* =========================================== */}

        <Box
          sx={{
            py: {
              xs: 5,

              md: 7,
            },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',

                gridTemplateColumns: {
                  xs: '1fr',

                  md:
                    '0.95fr 1.05fr',
                },

                gap: {
                  xs: 3,

                  md: 5,
                },

                alignItems:
                  'center',
              }}
            >
              <Box>
                <SectionHeading
                  align="left"
                  eyebrow="एक बड़े कर्मचारी परिवार की ओर"
                  title="शिक्षा विभाग से पूरे मध्य प्रदेश के कर्मचारी परिवार तक"
                />

                <Typography
                  sx={{
                    mt: 2,

                    color:
                      BRAND.textSecondary,

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize: {
                      xs: '0.94rem',

                      md: '1rem',
                    },

                    lineHeight: 2,
                  }}
                >
                  जब अन्य विभागों के कर्मचारियों ने देखा
                  कि शिक्षा विभाग के कर्मचारी संकट की घड़ी
                  में अपने दिवंगत साथियों के परिवारों के
                  साथ आर्थिक रूप से खड़े हो रहे हैं, तो
                  स्वास्थ्य, राजस्व, बैंक, पंचायत एवं
                  ग्रामीण विकास सहित अनेक विभागों के
                  कर्मचारियों ने स्वयं संपर्क कर इसी प्रकार
                  की व्यवस्था अपने विभाग में भी लागू करने
                  की मांग की।
                </Typography>

                <Box
                  sx={{
                    mt: 2.4,

                    display:
                      'flex',

                    flexWrap:
                      'wrap',

                    gap: 1,
                  }}
                >
                  {departmentNames.map(
                    (
                      department
                    ) => (
                      <Chip
                        key={
                          department
                        }
                        label={
                          department
                        }
                        sx={{
                          bgcolor:
                            BRAND.white,

                          color:
                            BRAND.text,

                          border:
                            `1px solid ${BRAND.border}`,

                          fontFamily:
                            DEVANAGARI_FONT,

                          fontWeight:
                            700,
                        }}
                      />
                    )
                  )}
                </Box>
              </Box>

              <Card
                elevation={0}
                sx={{
                  position:
                    'relative',

                  overflow:
                    'hidden',

                  p: {
                    xs: 3,

                    md: 4,
                  },

                  color:
                    BRAND.white,

                  background:
                    'linear-gradient(145deg, #21193f 0%, #382e69 100%)',

                  borderRadius: 4,

                  boxShadow:
                    '0 22px 48px rgba(34,27,67,0.17)',
                }}
              >
                <Box
                  sx={{
                    position:
                      'absolute',

                    width: 210,

                    height: 210,

                    right: -90,

                    top: -90,

                    borderRadius:
                      '50%',

                    bgcolor:
                      'rgba(185,167,255,0.10)',
                  }}
                />

                <Typography
                  sx={{
                    color:
                      '#cfc5ff',

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize:
                      '0.78rem',

                    fontWeight:
                      900,
                  }}
                >
                  कर्मचारियों की भावना
                </Typography>

                <Typography
                  sx={{
                    mt: 1.3,

                    position:
                      'relative',

                    color:
                      BRAND.white,

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize: {
                      xs: '1.18rem',

                      md: '1.45rem',
                    },

                    fontWeight:
                      900,

                    lineHeight:
                      1.75,
                  }}
                >
                  “जब शिक्षा विभाग के कर्मचारी एक-दूसरे के
                  परिवार का सहारा बन सकते हैं, तो ऐसी
                  व्यवस्था हमारे विभाग में भी होनी चाहिए।”
                </Typography>

                <Divider
                  sx={{
                    my: 2.3,

                    borderColor:
                      'rgba(255,255,255,0.12)',
                  }}
                />

                <Typography
                  sx={{
                    color:
                      '#e8e4f7',

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize:
                      '0.91rem',

                    lineHeight:
                      1.9,
                  }}
                >
                  लंबे समय से अन्य विभागों के कर्मचारी
                  अपने-अपने विभाग में भी इसी प्रकार की
                  व्यवस्था लागू करने की मांग कर रहे थे।
                  हमने उनकी मांग को केवल एक मांग के रूप
                  में नहीं, बल्कि एक विश्वास और बड़े
                  कर्मचारी परिवार के निर्माण की भावना के
                  रूप में देखा।
                </Typography>
              </Card>
            </Box>
          </Container>
        </Box>

        {/* =========================================== */}
        {/* LAUNCH ANNOUNCEMENT */}
        {/* =========================================== */}

        <Container maxWidth="lg">
          <Box
            sx={{
              position:
                'relative',

              overflow:
                'hidden',

              px: {
                xs: 2.5,

                md: 5,
              },

              py: {
                xs: 3.5,

                md: 4.5,
              },

              textAlign:
                'center',

              color:
                '#302600',

              background:
                'linear-gradient(135deg, #fff7c7 0%, #ffe16a 54%, #f5c842 100%)',

              border:
                '1px solid #e6c64d',

              borderRadius: {
                xs: 3,

                md: 4,
              },

              boxShadow:
                '0 18px 40px rgba(154,115,0,0.12)',
            }}
          >
            <Typography
              sx={{
                fontFamily:
                  DEVANAGARI_FONT,

                fontSize:
                  '0.8rem',

                fontWeight:
                  900,
              }}
            >
              सामूहिक सहयोग के साथ
            </Typography>

            <Typography
              component="h2"
              sx={{
                mt: 0.5,

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '1.7rem',

                  sm: '2.15rem',

                  md: '2.6rem',
                },

                fontWeight:
                  900,

                lineHeight:
                  1.3,
              }}
            >
              कल्याण व्यवस्था का नया विस्तार
            </Typography>

            <Typography
              sx={{
                maxWidth: 900,

                mx: 'auto',

                mt: 1.4,

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '0.93rem',

                  md: '1.03rem',
                },

                fontWeight:
                  700,

                lineHeight:
                  1.9,
              }}
            >
              इसी विश्वास को सम्मान देते हुए अब इस
              कल्याणकारी व्यवस्था का विस्तार मध्य प्रदेश
              के अन्य विभागों एवं कर्मचारी वर्गों तक किया
              जा रहा है। व्यवस्था दो स्पष्ट एवं पृथक
              समूहों के माध्यम से संचालित होगी।
            </Typography>
          </Box>
        </Container>

        {/* =========================================== */}
        {/* PORTAL/GROUP SELECTION */}
        {/* =========================================== */}

        <Box
          id="portal-selection"
          sx={{
            scrollMarginTop: {
              xs: '85px',

              md: '95px',
            },

            py: {
              xs: 6,

              md: 8,
            },
          }}
        >
          <Container maxWidth="lg">
            <SectionHeading
              eyebrow="अपना सही समूह चुनें"
              title="योजना के दो मुख्य स्वरूप"
              description="अपने विभाग एवं कर्मचारी श्रेणी के अनुसार संबंधित समूह में प्रवेश करें। दोनों समूहों की व्यवस्था पृथक रहेगी ताकि प्रत्येक समूह अपने संकटग्रस्त परिवारों के साथ सीधे खड़ा हो सके।"
            />

            <Box
              sx={{
                mt: {
                  xs: 4,

                  md: 5,
                },

                display: 'grid',

                gridTemplateColumns: {
                  xs: '1fr',

                  md:
                    'repeat(2, minmax(0, 1fr))',
                },

                gap: {
                  xs: 3,

                  md: 3.5,
                },

                alignItems:
                  'stretch',
              }}
            >
              {visiblePortals.map(
                (portal) => {
                  const PortalIcon =
                    getPortalIcon(
                      portal.slug
                    );

                  const portalTheme =
                    portal.theme ||
                    {};

                  const isTab1 =
                    portal.slug ===
                    'tab1';

                  return (
                    <Card
                      key={
                        portal.slug
                      }
                      elevation={0}
                      sx={{
                        position:
                          'relative',

                        overflow:
                          'hidden',

                        height:
                          '100%',

                        display:
                          'flex',

                        flexDirection:
                          'column',

                        bgcolor:
                          BRAND.white,

                        border:
                          `1px solid ${
                            isTab1
                              ? '#e6cc5b'
                              : '#b7dce8'
                          }`,

                        borderRadius: {
                          xs: 3.5,

                          md: 4.5,
                        },

                        boxShadow:
                          isTab1
                            ? '0 20px 44px rgba(182,137,0,0.11)'
                            : '0 20px 44px rgba(2,132,199,0.10)',

                        transition:
                          'all 0.22s ease',

                        '&:hover':
                          {
                            transform:
                              'translateY(-6px)',

                            boxShadow:
                              isTab1
                                ? '0 27px 58px rgba(182,137,0,0.17)'
                                : '0 27px 58px rgba(2,132,199,0.16)',
                          },
                      }}
                    >
                      {/* Portal visual header */}

                      <Box
                        sx={{
                          position:
                            'relative',

                          overflow:
                            'hidden',

                          p: {
                            xs: 2.5,

                            sm: 3,
                          },

                          minHeight: 178,

                          color:
                            portalTheme.textColor ||
                            BRAND.white,

                          background:
                            portalTheme.background ||
                            'linear-gradient(135deg,#6f5cc2,#21193f)',
                        }}
                      >
                        <Box
                          sx={{
                            position:
                              'absolute',

                            width: 180,

                            height: 180,

                            borderRadius:
                              '50%',

                            top: -85,

                            right: -55,

                            bgcolor:
                              'rgba(255,255,255,0.14)',
                          }}
                        />

                        <Box
                          sx={{
                            position:
                              'absolute',

                            width: 90,

                            height: 90,

                            borderRadius:
                              '50%',

                            bottom: -45,

                            left: -25,

                            bgcolor:
                              'rgba(255,255,255,0.10)',
                          }}
                        />

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={2}
                          sx={{
                            position:
                              'relative',

                            zIndex: 1,
                          }}
                        >
                          <Box>
                            {!portal.enabled && (
                              <Chip
                                size="small"
                                label="COMING SOON"
                                sx={{
                                  mb: 1,
                                  color: portalTheme.darkColor || BRAND.text,
                                  bgcolor: 'rgba(255,255,255,0.92)',
                                  border: '1px solid rgba(255,255,255,0.70)',
                                  fontFamily: DEVANAGARI_FONT,
                                  fontWeight: 900,
                                  letterSpacing: '0.04em',
                                }}
                              />
                            )}
                            <Typography
                              sx={{
                                fontFamily:
                                  DEVANAGARI_FONT,

                                fontSize:
                                  '0.76rem',

                                fontWeight:
                                  900,

                                opacity:
                                  0.9,
                              }}
                            >
                              {
                                portal.landingGroupLabel
                              }
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.65,

                                maxWidth:
                                  410,

                                fontFamily:
                                  DEVANAGARI_FONT,

                                fontSize: {
                                  xs: '1.28rem',

                                  sm: '1.5rem',
                                },

                                fontWeight:
                                  900,

                                lineHeight:
                                  1.45,
                              }}
                            >
                              {
                                portal.landingTitle
                              }
                            </Typography>

                            <Typography
                              sx={{
                                mt: 1,

                                maxWidth:
                                  400,

                                fontFamily:
                                  DEVANAGARI_FONT,

                                fontSize:
                                  '0.75rem',

                                fontWeight:
                                  800,

                                lineHeight:
                                  1.5,

                                opacity:
                                  0.8,
                              }}
                            >
                              {
                                portal.landingEnglishTitle
                              }
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: 54,

                              height: 54,

                              flexShrink:
                                0,

                              display:
                                'flex',

                              alignItems:
                                'center',

                              justifyContent:
                                'center',

                              borderRadius:
                                2.5,

                              bgcolor:
                                'rgba(255,255,255,0.22)',

                              border:
                                '1px solid rgba(255,255,255,0.30)',

                              boxShadow:
                                '0 6px 16px rgba(0,0,0,0.10)',
                            }}
                          >
                            <PortalIcon
                              sx={{
                                fontSize:
                                  30,
                              }}
                            />
                          </Box>
                        </Stack>
                      </Box>

                      {/* Portal content */}

                      <Box
                        sx={{
                          p: {
                            xs: 2.5,

                            sm: 3,
                          },

                          flex: 1,

                          display:
                            'flex',

                          flexDirection:
                            'column',
                        }}
                      >
                        <Chip
                          size="small"
                          label={
                            portal.landingCategory
                          }
                          sx={{
                            alignSelf:
                              'flex-start',

                            maxWidth:
                              '100%',

                            height:
                              'auto',

                            py: 0.25,

                            bgcolor:
                              alpha(
                                portalTheme.darkColor ||
                                  BRAND.primary,
                                0.08
                              ),

                            color:
                              portalTheme.darkColor ||
                              BRAND.primary,

                            fontFamily:
                              DEVANAGARI_FONT,

                            fontWeight:
                              900,

                            '& .MuiChip-label':
                              {
                                whiteSpace:
                                  'normal',

                                lineHeight:
                                  1.4,
                              },
                          }}
                        />

                        <Typography
                          sx={{
                            mt: 1.8,

                            color:
                              BRAND.textSecondary,

                            fontFamily:
                              DEVANAGARI_FONT,

                            fontSize:
                              '0.9rem',

                            lineHeight:
                              1.85,
                          }}
                        >
                          {
                            portal.landingDescription
                          }
                        </Typography>

                        <Typography
                          sx={{
                            mt: 2.2,

                            color:
                              BRAND.text,

                            fontFamily:
                              DEVANAGARI_FONT,

                            fontSize:
                              '0.9rem',

                            fontWeight:
                              900,
                          }}
                        >
                          इस समूह में सम्मिलित:
                        </Typography>

                        <Stack
                          spacing={1}
                          sx={{
                            mt: 1.4,

                            mb: 3,
                          }}
                        >
                          {portal.landingEligibility?.map(
                            (
                              item
                            ) => (
                              <Stack
                                key={
                                  item
                                }
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                              >
                                <CheckCircleRounded
                                  sx={{
                                    mt: '2px',

                                    flexShrink:
                                      0,

                                    fontSize:
                                      18,

                                    color:
                                      portalTheme.darkColor ||
                                      BRAND.success,
                                  }}
                                />

                                <Typography
                                  sx={{
                                    color:
                                      BRAND.textSecondary,

                                    fontFamily:
                                      DEVANAGARI_FONT,

                                    fontSize:
                                      '0.84rem',

                                    lineHeight:
                                      1.6,
                                  }}
                                >
                                  {
                                    item
                                  }
                                </Typography>
                              </Stack>
                            )
                          )}
                        </Stack>

                        <Box
                          sx={{
                            mt: 'auto',
                          }}
                        >
                          {isTab1 && (
                            <Box
                              sx={{
                                mb: 1.5,

                                px: 1.4,

                                py: 1,

                                display:
                                  'flex',

                                alignItems:
                                  'center',

                                gap: 0.8,

                                bgcolor:
                                  '#fff9db',

                                border:
                                  '1px solid #e7d16c',

                                borderRadius:
                                  2,
                              }}
                            >
                              <VerifiedRounded
                                sx={{
                                  color:
                                    '#725600',

                                  fontSize:
                                    18,
                                }}
                              />

                              <Typography
                                sx={{
                                  color:
                                    '#604900',

                                  fontFamily:
                                    DEVANAGARI_FONT,

                                  fontSize:
                                    '0.74rem',

                                  fontWeight:
                                    900,
                                }}
                              >
                                स्थापित शिक्षा परिवार पोर्टल
                              </Typography>
                            </Box>
                          )}

                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() =>
                              openPortal(
                                portal
                              )
                            }
                            endIcon={
                              <ArrowForwardRounded />
                            }
                            sx={{
                              minHeight:
                                51,

                              px: 2,

                              borderRadius:
                                2.5,

                              textTransform:
                                'none',

                              fontFamily:
                                DEVANAGARI_FONT,

                              fontSize:
                                '0.88rem',

                              fontWeight:
                                900,

                              color:
                                portalTheme.textColor ||
                                BRAND.white,

                              background:
                                portalTheme.background,

                              boxShadow:
                                isTab1
                                  ? '0 7px 18px rgba(175,128,0,0.15)'
                                  : '0 7px 18px rgba(2,132,199,0.16)',

                              transition:
                                'all 0.2s ease',

                              '&:hover':
                                {
                                  background:
                                    portalTheme.background,

                                  filter:
                                    'brightness(0.96)',

                                  transform:
                                    'translateY(-1px)',
                                },
                            }}
                          >
                            {portal.enabled
                              ? portal.landingButtonText || 'समूह में प्रवेश करें'
                              : 'जल्द उपलब्ध होगा'}
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  );
                }
              )}
            </Box>

            {/* Free registration */}

            <Box
              sx={{
                mt: 3,

                p: {
                  xs: 2,

                  md: 2.4,
                },

                display:
                  'flex',

                flexDirection: {
                  xs: 'column',

                  sm: 'row',
                },

                alignItems:
                  'center',

                justifyContent:
                  'center',

                gap: 1,

                textAlign:
                  'center',

                bgcolor:
                  BRAND.successLight,

                border:
                  '1px solid #b7e3d1',

                borderRadius:
                  3,
              }}
            >
              <CheckCircleRounded
                sx={{
                  color:
                    BRAND.success,
                }}
              />

              <Typography
                sx={{
                  color:
                    '#115b42',

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontSize: {
                    xs: '0.92rem',

                    md: '1rem',
                  },

                  fontWeight:
                    900,

                  lineHeight:
                    1.6,
                }}
              >
                पंजीयन पूर्णतः निःशुल्क रहेगा।
                अपने संबंधित विभाग एवं संवर्ग के अनुसार
                उचित समूह का चयन करें।
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* =========================================== */}
        {/* GROUP EXPLANATION */}
        {/* =========================================== */}

        <Box
          sx={{
            py: {
              xs: 5,

              md: 6.5,
            },

            bgcolor:
              BRAND.white,

            borderTop:
              `1px solid ${BRAND.border}`,
          }}
        >
          <Container maxWidth="md">
            <SectionHeading
              eyebrow="पृथक व्यवस्था, एक समान उद्देश्य"
              title="हर समूह अपने परिवारों के साथ खड़ा होगा"
              description="शिक्षा एवं जनजातीय कार्य विभाग के साथियों के लिए पृथक समूह तथा अन्य विभागों और क्षेत्रों के साथियों के लिए अलग समूह की व्यवस्था रहेगी, ताकि प्रत्येक समूह के साथी अपने समूह के संकटग्रस्त परिवारों के साथ खड़े हो सकें।"
            />
          </Container>
        </Box>

        {/* =========================================== */}
        {/* FINAL PLEDGE */}
        {/* =========================================== */}

        <Box
          sx={{
            position:
              'relative',

            overflow:
              'hidden',

            py: {
              xs: 6,

              md: 8,
            },

            color:
              BRAND.white,

            background:
              'linear-gradient(140deg, #21193f 0%, #33295f 52%, #493b82 100%)',
          }}
        >
          <Box
            sx={{
              position:
                'absolute',

              width: 430,

              height: 430,

              borderRadius:
                '50%',

              right: -220,

              top: -170,

              bgcolor:
                'rgba(185,167,255,0.08)',
            }}
          />

          <Container
            maxWidth="md"
            sx={{
              position:
                'relative',

              zIndex: 2,

              textAlign:
                'center',
            }}
          >
            <FavoriteRounded
              sx={{
                mb: 1,

                color:
                  '#cfc5ff',

                fontSize: 34,
              }}
            />

            <Typography
              sx={{
                color:
                  '#cfc5ff',

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize:
                  '0.82rem',

                fontWeight:
                  900,
              }}
            >
              हमारा संकल्प
            </Typography>

            <Typography
              sx={{
                mt: 1.2,

                color:
                  BRAND.white,

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '1.35rem',

                  sm: '1.8rem',

                  md: '2.15rem',
                },

                fontWeight:
                  900,

                lineHeight:
                  1.65,
              }}
            >
              “आज हम किसी के परिवार के साथ खड़े होंगे,
              तो कल हमारे संकट में कोई हमारे परिवार के
              साथ खड़ा होगा।”
            </Typography>

            <Typography
              sx={{
                mt: 2.6,

                color:
                  '#e9e5f7',

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '0.92rem',

                  md: '1rem',
                },

                lineHeight: 2,
              }}
            >
              हम किसी परिवार का दुःख समाप्त नहीं कर सकते,
              लेकिन उसके दुःख का बोझ थोड़ा कम जरूर कर
              सकते हैं। हम किसी दिवंगत साथी को वापस नहीं
              ला सकते, लेकिन उसके परिवार को यह विश्वास
              जरूर दिला सकते हैं कि—
            </Typography>

            <Box
              sx={{
                maxWidth: 720,

                mx: 'auto',

                mt: 3,

                px: {
                  xs: 2,

                  md: 4,
                },

                py: 2.5,

                bgcolor:
                  'rgba(255,255,255,0.08)',

                border:
                  '1px solid rgba(255,255,255,0.15)',

                borderRadius:
                  3,
              }}
            >
              <Typography
                sx={{
                  color:
                    '#fff0a0',

                  fontFamily:
                    DEVANAGARI_FONT,

                  fontSize: {
                    xs: '1.12rem',

                    md: '1.4rem',
                  },

                  fontWeight:
                    900,

                  lineHeight:
                    1.75,
                }}
              >
                “आप अकेले नहीं हैं, आपका पूरा कर्मचारी
                परिवार आपके साथ है।”
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 3,

                color:
                  '#e9e5f7',

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize: {
                  xs: '0.9rem',

                  md: '0.98rem',
                },

                lineHeight:
                  1.9,
              }}
            >
              इसी भावना के साथ आप सभी से आग्रह है कि
              अपने संबंधित संवर्ग में निःशुल्क पंजीयन कराएं
              और इस मानवीय पहल का हिस्सा बनें।
            </Typography>
          </Container>
        </Box>

        <Dialog
          open={Boolean(upcomingPortal)}
          onClose={() => setUpcomingPortal(null)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: 'hidden',
              fontFamily: DEVANAGARI_FONT,
            },
          }}
        >
          <DialogTitle
            sx={{
              px: 3,
              pt: 3,
              pb: 1,
              color: BRAND.text,
              fontFamily: DEVANAGARI_FONT,
              fontWeight: 900,
              textAlign: 'center',
            }}
          >
            Coming Soon
          </DialogTitle>

          <DialogContent sx={{ px: 3, pb: 1, textAlign: 'center' }}>
            <Typography
              sx={{
                color: BRAND.text,
                fontFamily: DEVANAGARI_FONT,
                fontSize: '1.08rem',
                fontWeight: 900,
                lineHeight: 1.6,
              }}
            >
              {upcomingPortal?.landingTitle || 'यह समूह'}
            </Typography>

            <Typography
              sx={{
                mt: 1.2,
                color: BRAND.textSecondary,
                fontFamily: DEVANAGARI_FONT,
                fontSize: '0.92rem',
                lineHeight: 1.8,
              }}
            >
              यह पोर्टल अभी जारी नहीं किया गया है। यह सुविधा जल्द उपलब्ध होगी।
              फिलहाल कृपया उपलब्ध शिक्षा परिवार पोर्टल का उपयोग करें।
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => setUpcomingPortal(null)}
              sx={{
                minWidth: 140,
                borderRadius: 2.5,
                textTransform: 'none',
                fontFamily: DEVANAGARI_FONT,
                fontWeight: 900,
                bgcolor: BRAND.primary,
                '&:hover': { bgcolor: BRAND.dark2 },
              }}
            >
              ठीक है
            </Button>
          </DialogActions>
        </Dialog>

        {/* =========================================== */}
        {/* FOOTER */}
        {/* =========================================== */}

        <Box
          component="footer"
          sx={{
            py: {
              xs: 4,

              md: 4.5,
            },

            bgcolor:
              '#17122f',

            color:
              BRAND.white,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display:
                  'flex',

                flexDirection: {
                  xs: 'column',

                  sm: 'row',
                },

                alignItems: {
                  xs: 'center',

                  sm: 'flex-end',
                },

                justifyContent:
                  'space-between',

                gap: 3,

                textAlign: {
                  xs: 'center',

                  sm: 'left',
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.3}
              >
                <Box
                  sx={{
                    width: 50,

                    height: 50,

                    p: 0.5,

                    bgcolor:
                      BRAND.white,

                    borderRadius:
                      '50%',
                  }}
                >
                  <Box
                    component="img"
                    src="/pmums logo.png"
                    alt="PMUMS Logo"
                    sx={{
                      width: '100%',

                      height: '100%',

                      display:
                        'block',

                      objectFit:
                        'contain',
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color:
                        BRAND.white,

                      fontFamily:
                        DEVANAGARI_FONT,

                      fontWeight:
                        900,
                    }}
                  >
                    कर्मचारी कल्याण कोष
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.2,

                      color:
                        '#aaa2c9',

                      fontFamily:
                        DEVANAGARI_FONT,

                      fontSize:
                        '0.73rem',
                    }}
                  >
                    एक-दूसरे के परिवार का सहारा
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  textAlign: {
                    xs: 'center',

                    sm: 'right',
                  },
                }}
              >
                <Typography
                  sx={{
                    color:
                      '#bdb5d7',

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize:
                      '0.76rem',

                    fontWeight:
                      600,
                  }}
                >
                  सस्नेह एवं सेवा में समर्पित
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,

                    color:
                      BRAND.white,

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize:
                      '1.2rem',

                    fontWeight:
                      900,
                  }}
                >
                  सतीश खरे
                </Typography>

                <Typography
                  sx={{
                    color:
                      '#cfc5ff',

                    fontFamily:
                      DEVANAGARI_FONT,

                    fontSize:
                      '0.78rem',

                    fontWeight:
                      700,
                  }}
                >
                  संस्थापक
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                my: 2.8,

                borderColor:
                  'rgba(255,255,255,0.08)',
              }}
            />

            <Typography
              sx={{
                textAlign:
                  'center',

                color:
                  '#8f87ac',

                fontFamily:
                  DEVANAGARI_FONT,

                fontSize:
                  '0.7rem',
              }}
            >
              पी.एम.यू.एम.एस. कर्मचारी कल्याण कोष
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PortalSelector;