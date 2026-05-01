import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid
} from '@mui/material';
import {
  CheckCircle,
  Favorite,
  People,
  Security,
  Visibility,
  VolunteerActivismRounded,
  HandshakeRounded
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import SelfDonation from '../components/SelfDonation';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  border: '#ded8f5'
};

const SectionHeading = ({ eyebrow, title, center = true }) => (
  <Box textAlign={center ? 'center' : 'left'} mb={{ xs: 3, md: 4 }}>
    {eyebrow && (
      <Typography
        variant="overline"
        sx={{
          color: theme.main,
          fontWeight: 700,
          letterSpacing: '1.5px',
          fontSize: '0.8rem',
          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
        }}
      >
        {eyebrow}
      </Typography>
    )}

    <Typography
      variant="h4"
      sx={{
        mt: eyebrow ? 0.6 : 0,
        fontWeight: 700,
        color: theme.dark,
        fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
        fontSize: { xs: '1.55rem', md: '2.15rem' },
        lineHeight: 1.3,
      }}
    >
      {title}
    </Typography>

    <Box
      sx={{
        width: 90,
        height: 5,
        borderRadius: 99,
        mt: 2,
        mx: center ? 'auto' : 0,
        background: theme.main,
      }}
    />
  </Box>
);

const GlassCard = ({ children, sx = {}, highlight = false }) => (
  <Paper
    elevation={0}
    sx={{
      mb: 4,
      borderRadius: { xs: '24px', md: '32px' },
      p: { xs: 2.5, sm: 3.5, md: 5 },
      background: highlight ? theme.softAccent : '#ffffff',
      border: highlight
        ? '1px solid rgba(15, 118, 110, 0.18)'
        : '1px solid rgba(111, 92, 194, 0.16)',
      boxShadow: '0 24px 70px rgba(34, 27, 67, 0.10)',
      position: 'relative',
      overflow: 'hidden',

      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 7,
        background: highlight ? theme.accent : theme.main,
      },

      ...sx,
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
  </Paper>
);

const StyledList = ({ items, small = false, accent = false }) => (
  <List sx={{ p: 0 }}>
    {items.map((item, index) => (
      <ListItem
        key={index}
        sx={{
          px: 0,
          py: small ? 0.7 : 1,
          alignItems: 'flex-start',
        }}
      >
        <ListItemIcon sx={{ minWidth: 38, mt: 0.2 }}>
          <CheckCircle
            sx={{
              color: accent ? theme.accent : theme.main,
              fontSize: small ? 20 : 24,
            }}
          />
        </ListItemIcon>

        <ListItemText
          primary={item}
          sx={{
            m: 0,
            '& .MuiListItemText-primary': {
              color: theme.muted,
              fontSize: small ? '0.96rem' : '1.05rem',
              lineHeight: 1.75,
              fontWeight: 600,
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            },
          }}
        />
      </ListItem>
    ))}
  </List>
);

const About = () => {
  const objectives = [
    'दिवंगत शिक्षक/कर्मचारी के परिवार को आर्थिक सहयोग उपलब्ध कराना',
    'संकट की घड़ी में मानवीय संवेदना और नैतिक संबल प्रदान करना',
    'शिक्षक समाज में एकता, विश्वास और सहयोग की भावना को मजबूत करना',
    'परिजनों को प्रशासनिक मार्गदर्शन देना'
  ];

  const adminGuidance = [
    'अनुकम्पा नियुक्ति से संबंधित जानकारी',
    'आवश्यक दस्तावेज़ों की प्रक्रिया',
    'विभागीय दावों/क्लेम्स के संबंध में सहयोग'
  ];

  const workingPrinciples = [
    'सहायता प्रक्रिया नियमावली के अनुरूप हो',
    'किसी भी प्रकार का भेदभाव या पक्षपात न हो',
    'पूरी प्रक्रिया पारदर्शी और उत्तरदायी बनी रहे'
  ];

  const notInsurance = [
    'किसी भी सदस्य से कोई शुल्क नहीं लिया जाता',
    'कोई व्यावसायिक लाभ नहीं कमाया जाता',
    'संगठन पूर्णतः सेवा और सहयोग के सिद्धांत पर आधारित है'
  ];

  const coreValues = [
    { icon: <Favorite />, title: 'सेवा भावना', desc: 'निस्वार्थ भाव से सहयोग' },
    { icon: <Visibility />, title: 'पारदर्शिता', desc: 'हर प्रक्रिया स्पष्ट और जवाबदेह' },
    { icon: <People />, title: 'एकता', desc: 'शिक्षक समाज की सामूहिक शक्ति' },
    { icon: <VolunteerActivismRounded />, title: 'मानवीय संवेदना', desc: 'दुख में साथ खड़े रहना' },
    { icon: <Security />, title: 'विश्वास', desc: 'संगठन और सदस्यों के बीच मजबूत भरोसा' }
  ];

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 5, md: 8 },
          background: theme.soft,
          position: 'relative',
          overflow: 'hidden',

        

         
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section */}
          <GlassCard
            sx={{
              textAlign: 'center',
              background: `
                linear-gradient(135deg, #221b43 0%, #30295c 48%, #3b3268 100%)
              `,
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 30px 90px rgba(34, 27, 67, 0.22)',

              '&::before': {
                background: theme.main,
              },

              '&::after': {
                content: '""',
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                right: -110,
                bottom: -130,
                background: 'rgba(185, 167, 255, 0.12)',
              },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                fontSize: { xs: '2.2rem', md: '3.6rem' },
                fontFamily: 'Poppins, Arial, sans-serif',
                letterSpacing: '-1px',
              }}
            >
              PMUMS
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.45rem' },
                fontWeight: 700,
                lineHeight: 1.6,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश
            </Typography>

            <Chip
              label="गैर-लाभकारी • सेवा-आधारित • पूर्णतः स्वैच्छिक संगठन"
              sx={{
                background: 'rgba(255,255,255,0.16)',
                color: '#ffffff',
                fontSize: { xs: '0.82rem', md: '1rem' },
                fontWeight: 700,
                px: { xs: 1, md: 2 },
                py: 1,
                height: 'auto',
                border: '1px solid rgba(255,255,255,0.24)',
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  lineHeight: 1.6,
                },
              }}
            />
          </GlassCard>

          {/* About Us Section */}
          <GlassCard>
            <SectionHeading eyebrow="ABOUT PMUMS" title="हमारे बारे में" />

            <Typography
              sx={{
                lineHeight: 1.9,
                mb: 3,
                textAlign: 'justify',
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: theme.muted,
                fontWeight: 600,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश (PMUMS) एक गैर-लाभकारी, सेवा-आधारित एवं पूर्णतः स्वैच्छिक संगठन है, जिसकी स्थापना मध्यप्रदेश राज्य के शिक्षा विभाग एवं जनजातीय कार्य विभाग में कार्यरत शासकीय शिक्षकों एवं कर्मचारियों के कल्याण, एकता तथा पारस्परिक सहयोग के उद्देश्य से की गई है।
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.9,
                textAlign: 'justify',
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: theme.muted,
                fontWeight: 600,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              PMUMS का गठन इस मूल भावना के साथ किया गया है कि किसी भी शिक्षक अथवा कर्मचारी की आकस्मिक एवं दुःखद मृत्यु की स्थिति में उसका परिवार स्वयं को अकेला न महसूस करे। संगठन निरंतर यह प्रयास करता है कि ऐसी विषम परिस्थितियों में दिवंगत सदस्य के नामिनी अथवा परिजनों को निःशुल्क, निष्पक्ष, पारदर्शी एवं समयबद्ध सहयोग उपलब्ध कराया जा सके, जिससे उन्हें आर्थिक एवं मानसिक संबल प्राप्त हो सके।
            </Typography>
          </GlassCard>

          {/* Objectives */}
          <GlassCard>
            <SectionHeading eyebrow="OUR OBJECTIVE" title="हमारा उद्देश्य" />

            <Typography
              sx={{
                mb: 2,
                color: theme.text,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 700,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              PMUMS का प्रमुख उद्देश्य है —
            </Typography>

            <StyledList items={objectives} />

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: { xs: 2, md: 2.5 },
                borderRadius: '22px',
                background: theme.softAccent,
                border: '1px solid rgba(15, 118, 110, 0.18)',
              }}
            >
              <Typography
                sx={{
                  mb: 1.5,
                  color: theme.dark,
                  fontWeight: 700,
                  fontSize: { xs: '1rem', md: '1.08rem' },
                  fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                }}
              >
                परिजनों को प्रशासनिक मार्गदर्शन देना, जैसे:
              </Typography>

              <StyledList items={adminGuidance} small accent />
            </Paper>
          </GlassCard>

          {/* Working Method */}
          <GlassCard>
            <SectionHeading eyebrow="WORKING METHOD" title="हमारी कार्यप्रणाली" />

            <Typography
              sx={{
                lineHeight: 1.9,
                mb: 3,
                textAlign: 'justify',
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: theme.muted,
                fontWeight: 600,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              PMUMS राज्य स्तर से लेकर संभाग, जिला और ब्लॉक स्तर तक संगठित ढांचे के माध्यम से कार्य करता है। प्रत्येक स्तर पर समन्वय बनाकर यह सुनिश्चित किया जाता है कि:
            </Typography>

            <StyledList items={workingPrinciples} />

            <Typography
              sx={{
                lineHeight: 1.9,
                mt: 3,
                textAlign: 'justify',
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: theme.muted,
                fontWeight: 600,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              संगठन द्वारा की जाने वाली सभी गतिविधियाँ सेवा-भाव से प्रेरित होती हैं और इनका उद्देश्य केवल शिक्षक-परिवार का कल्याण होता है।
            </Typography>
          </GlassCard>

          {/* Not Insurance */}
          <GlassCard highlight>
            <SectionHeading eyebrow="IMPORTANT CLARIFICATION" title="न बीमा, न व्यवसाय" />

            <Typography
              sx={{
                lineHeight: 1.9,
                mb: 3,
                textAlign: 'justify',
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: theme.muted,
                fontWeight: 600,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              PMUMS किसी भी प्रकार की बीमा योजना, निवेश योजना या लाभ-आधारित स्कीम नहीं है।
              यह स्पष्ट रूप से एक मानवीय एवं सहयोगात्मक संगठन है, जिसमें:
            </Typography>

            <StyledList items={notInsurance} accent />
          </GlassCard>

          {/* Core Values */}
          <GlassCard>
            <SectionHeading eyebrow="OUR CORE VALUES" title="हमारे मूल्य" />

            <Grid container spacing={3}>
              {coreValues.map((value, index) => (
                <Grid item xs={12} sm={6} md={index === 4 ? 12 : 6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      p: { xs: 2.2, md: 2.6 },
                      borderRadius: '22px',
                      background:
                        index % 2 === 0
                          ? theme.soft
                          : theme.softAccent,
                      border:
                        index % 2 === 0
                          ? '1px solid rgba(111, 92, 194, 0.16)'
                          : '1px solid rgba(15, 118, 110, 0.18)',
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 18px 45px rgba(34, 27, 67, 0.12)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 48,
                        width: 48,
                        height: 48,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        background: index % 2 === 0 ? theme.main : theme.accent,
                        boxShadow:
                          index % 2 === 0
                            ? '0 12px 26px rgba(111, 92, 194, 0.22)'
                            : '0 12px 26px rgba(15, 118, 110, 0.22)',
                      }}
                    >
                      {value.icon}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: theme.dark,
                          fontWeight: 700,
                          fontSize: '1.08rem',
                          mb: 0.5,
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                        }}
                      >
                        {value.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: theme.muted,
                          fontWeight: 600,
                          lineHeight: 1.7,
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                        }}
                      >
                        {value.desc}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </GlassCard>

          {/* Our Belief */}
          <GlassCard
            sx={{
              textAlign: 'center',
              background: `
                linear-gradient(135deg, #221b43 0%, #30295c 48%, #3b3268 100%)
              `,
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.18)',

              '&::before': {
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
                background: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <HandshakeRounded sx={{ fontSize: 38, color: '#ffffff' }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                fontSize: { xs: '1.6rem', md: '2.2rem' },
              }}
            >
              हमारा विश्वास
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: '#f2f0ff',
                fontSize: { xs: '1.05rem', md: '1.35rem' },
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              सेवा, सहयोग और शिक्षक-कल्याण — यही PMUMS की पहचान है।
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.9,
                textAlign: 'center',
                maxWidth: 900,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.08rem' },
                fontWeight: 600,
                fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              }}
            >
              PMUMS का विश्वास है कि जब शिक्षक एक-दूसरे के साथ खड़े होते हैं, तब कोई भी परिवार असहाय नहीं रहता। संगठन निरंतर इस दिशा में कार्यरत है कि शिक्षक समाज सुरक्षित, संगठित और समर्थ बने।
            </Typography>
          </GlassCard>
        </Container>
      </Box>

      <Box
        sx={{
          background: theme.soft,
        }}
      >
        <SelfDonation />
      </Box>
    </Layout>
  );
};

export default About;