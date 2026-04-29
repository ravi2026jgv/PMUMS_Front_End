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
  GroupsRounded,
  HandshakeRounded
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import SelfDonation from '../components/SelfDonation';

const theme = {
  dark: '#3b0764',
  main: '#6d28d9',
  light: '#a855f7',
  gold: '#facc15',
  soft: '#f5f3ff',
  softGold: '#fffbeb',
  text: '#4c1d95',
  muted: '#5b5b6b',
};

const SectionHeading = ({ eyebrow, title, center = true }) => (
  <Box textAlign={center ? 'center' : 'left'} mb={{ xs: 3, md: 4 }}>
    {eyebrow && (
      <Typography
        variant="overline"
        sx={{
          color: theme.main,
          fontWeight: 900,
          letterSpacing: '1.5px',
          fontSize: '0.8rem',
        }}
      >
        {eyebrow}
      </Typography>
    )}

    <Typography
      variant="h4"
      sx={{
        mt: eyebrow ? 0.6 : 0,
        fontWeight: 950,
        color: theme.dark,
        fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
        background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
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
      background: highlight
        ? 'linear-gradient(135deg, rgba(255,251,235,0.92), rgba(255,255,255,0.88))'
        : 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(16px)',
      border: highlight
        ? '1px solid rgba(250, 204, 21, 0.35)'
        : '1px solid rgba(124, 58, 237, 0.15)',
      boxShadow: '0 24px 70px rgba(76, 29, 149, 0.12)',
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

      ...sx,
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
  </Paper>
);

const StyledList = ({ items, small = false, gold = false }) => (
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
              color: gold ? theme.gold : theme.main,
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
              fontWeight: 650,
              fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
          {/* Header Section */}
          <GlassCard
            sx={{
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(76,29,149,0.96), rgba(124,58,237,0.92))',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 30px 90px rgba(76, 29, 149, 0.22)',

              '&::before': {
                background: `linear-gradient(90deg, ${theme.gold}, #ffffff, ${theme.gold})`,
              },

              '&::after': {
                content: '""',
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                right: -110,
                bottom: -130,
                background: 'rgba(250, 204, 21, 0.14)',
              },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 950,
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
                fontWeight: 800,
                lineHeight: 1.6,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश
            </Typography>

            <Chip
              label="गैर-लाभकारी • सेवा-आधारित • पूर्णतः स्वैच्छिक संगठन"
              sx={{
                background: 'rgba(255,255,255,0.16)',
                color: '#fff',
                fontSize: { xs: '0.82rem', md: '1rem' },
                fontWeight: 900,
                px: { xs: 1, md: 2 },
                py: 1,
                height: 'auto',
                border: '1px solid rgba(255,255,255,0.24)',
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                fontWeight: 650,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                fontWeight: 650,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                fontWeight: 850,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                background: 'linear-gradient(135deg, rgba(255,251,235,0.9), rgba(255,255,255,0.9))',
                border: '1px solid rgba(250, 204, 21, 0.32)',
              }}
            >
              <Typography
                sx={{
                  mb: 1.5,
                  color: theme.dark,
                  fontWeight: 900,
                  fontSize: { xs: '1rem', md: '1.08rem' },
                  fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                }}
              >
                परिजनों को प्रशासनिक मार्गदर्शन देना, जैसे:
              </Typography>

              <StyledList items={adminGuidance} small gold />
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
                fontWeight: 650,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                fontWeight: 650,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                fontWeight: 650,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              PMUMS किसी भी प्रकार की बीमा योजना, निवेश योजना या लाभ-आधारित स्कीम नहीं है।
              यह स्पष्ट रूप से एक मानवीय एवं सहयोगात्मक संगठन है, जिसमें:
            </Typography>

            <StyledList items={notInsurance} gold />
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
                          ? 'linear-gradient(135deg, rgba(245,243,255,0.92), rgba(255,255,255,0.9))'
                          : 'linear-gradient(135deg, rgba(255,251,235,0.92), rgba(255,255,255,0.9))',
                      border:
                        index % 2 === 0
                          ? '1px solid rgba(124, 58, 237, 0.14)'
                          : '1px solid rgba(250, 204, 21, 0.30)',
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 18px 45px rgba(76, 29, 149, 0.12)',
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
                        color: '#fff',
                        background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                        boxShadow: '0 12px 26px rgba(124, 58, 237, 0.22)',
                      }}
                    >
                      {value.icon}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: theme.dark,
                          fontWeight: 900,
                          fontSize: '1.08rem',
                          mb: 0.5,
                          fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                        }}
                      >
                        {value.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: theme.muted,
                          fontWeight: 650,
                          lineHeight: 1.7,
                          fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
              background:
                'linear-gradient(135deg, rgba(76,29,149,0.96), rgba(124,58,237,0.92))',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',

              '&::before': {
                background: `linear-gradient(90deg, ${theme.gold}, #ffffff, ${theme.gold})`,
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
              <HandshakeRounded sx={{ fontSize: 38, color: theme.gold }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 950,
                mb: 2,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                fontSize: { xs: '1.6rem', md: '2.2rem' },
              }}
            >
              हमारा विश्वास
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 850,
                mb: 3,
                color: theme.gold,
                fontSize: { xs: '1.05rem', md: '1.35rem' },
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                fontWeight: 650,
                fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
              }}
            >
              PMUMS का विश्वास है कि जब शिक्षक एक-दूसरे के साथ खड़े होते हैं, तब कोई भी परिवार असहाय नहीं रहता। संगठन निरंतर इस दिशा में कार्यरत है कि शिक्षक समाज सुरक्षित, संगठित और समर्थ बने।
            </Typography>
          </GlassCard>
        </Container>
      </Box>

      <Box
        sx={{
          background: `
            radial-gradient(circle at top right, rgba(124, 58, 237, 0.10), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #fbfaff 45%, #f5f3ff 100%)
          `,
        }}
      >
        <SelfDonation />
      </Box>
    </Layout>
  );
};

export default About;