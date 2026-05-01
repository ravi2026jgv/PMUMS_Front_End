import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Paper
} from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { publicApi } from '../services/api';

const theme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  border: '#ded8f5',
};

const rulePoints = [
  'कृपया अपने लॉगिन में दिए गए निर्धारित परिवार के QR कोड पर ही सहयोग करें।',
  'व्हाट्सएप ग्रुप या अन्य किसी माध्यम से प्राप्त QR कोड पर सहयोग न करें।',
  'सहयोग केवल स्वयं / पति / पत्नी / पुत्र / पुत्री / नामांकित (Nominee) के खाते से ही करें। यदि इनमें से कोई UPI का उपयोग नहीं करता है, तो कृपया किसी एक की UPI ID अवश्य बनवा लें।',
  'यह योजना “सहयोग के बदले सहयोग” सिद्धांत पर आधारित है। यदि कोई सदस्य सहयोग नहीं करता है और भविष्य में उसके साथ कोई अप्रिय घटना होती है, तो उसे योजना का लाभ प्रदान नहीं किया जाएगा।',
  'सभी सदस्य अपनी प्रोफाइल अनिवार्य अपडेट कर लें। किसी भी समस्या के समाधान हेतु व्हाट्सएप नंबर पर मैसेज करें।',
];

const StatCard = ({ icon, value, label, variant = 'purple' }) => {
  const isAccent = variant === 'accent';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '28px',
        p: { xs: 3, md: 3.5 },
        background: isAccent ? '#eef8f7' : '#ffffff',
        border: isAccent
          ? '1px solid rgba(15, 118, 110, 0.22)'
          : '1px solid rgba(111, 92, 194, 0.18)',
        boxShadow: '0 18px 48px rgba(34, 27, 67, 0.10)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 26px 70px rgba(34, 27, 67, 0.16)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -70,
          right: -70,
          width: 170,
          height: 170,
          borderRadius: '50%',
          background: isAccent
            ? 'rgba(15, 118, 110, 0.10)'
            : 'rgba(111, 92, 194, 0.12)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.4,
            background: isAccent ? '#0f766e' : '#6f5cc2',
            color: '#ffffff',
            boxShadow: isAccent
              ? '0 14px 32px rgba(15, 118, 110, 0.24)'
              : '0 14px 32px rgba(111, 92, 194, 0.24)',
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 950,
            color: isAccent ? '#0f766e' : '#221b43',
            mb: 1,
            fontSize: { xs: '2.45rem', sm: '3rem', md: '3.45rem' },
            lineHeight: 1,
            letterSpacing: '-1.5px',
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            color: theme.text,
            fontWeight: 800,
            fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            fontSize: { xs: '1rem', md: '1.08rem' },
            lineHeight: 1.5,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

const Statistics = () => {
  const [statisticsContentHtml, setStatisticsContentHtml] = useState('');

  useEffect(() => {
    const loadStatisticsContent = async () => {
      try {
        const response = await publicApi.getHomeDisplayContent();
        setStatisticsContentHtml(response?.data?.statisticsContentHtml || '');
      } catch (error) {
        console.error('Failed to load statistics content:', error);
      }
    };

    loadStatisticsContent();
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 9 },
        background: '#eef8f7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 4, md: 5 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: theme.main,
              fontWeight: 900,
              letterSpacing: '1.5px',
              fontSize: '0.82rem',
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
            }}
          >
            PMUMS SUPPORT SYSTEM
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              mt: 0.6,
              color: theme.dark,
              fontWeight: 950,
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
              fontSize: { xs: '1.8rem', md: '2.45rem' },
              lineHeight: 1.25,
            }}
          >
            आज का सहयोग — कल का संबल
          </Typography>

          <Box
            sx={{
              width: 95,
              height: 5,
              borderRadius: 99,
              mx: 'auto',
              mt: 2,
              background: '#6f5cc2',
            }}
          />
        </Box>

        <Box
          sx={{
            borderRadius: { xs: '28px', md: '38px' },
            p: { xs: 2.4, sm: 3.5, md: 5 },
            background: '#ffffff',
            border: '1px solid rgba(111, 92, 194, 0.16)',
            boxShadow: '0 28px 80px rgba(34, 27, 67, 0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 7,
              background: '#6f5cc2',
            }}
          />

          <Grid container spacing={{ xs: 4, md: 5 }} alignItems="stretch">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: '100%',
                  pr: { md: 2 },
                }}
              >
                <Box
                  sx={{
                    color: theme.muted,
                    fontSize: { xs: '0.98rem', md: '1.05rem' },
                    lineHeight: 1.9,
                    fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                    mb: statisticsContentHtml ? 3 : 0,
                    '& b, & strong': {
                      fontWeight: 850,
                      color: theme.dark,
                    },
                    '& p': {
                      marginTop: 0,
                      marginBottom: '14px',
                    },
                    '& a': {
                      color: '#0f766e',
                      fontWeight: 800,
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(15, 118, 110, 0.35)',
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: statisticsContentHtml || '',
                  }}
                />

                <Stack spacing={1.5}>
                  {rulePoints.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'flex-start',
                        p: { xs: 1.6, md: 1.8 },
                        borderRadius: '18px',
                        background:
                          index % 2 === 0
                            ? '#f4f2fb'
                            : '#eef8f7',
                        border:
                          index % 2 === 0
                            ? '1px solid rgba(111, 92, 194, 0.14)'
                            : '1px solid rgba(15, 118, 110, 0.16)',
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 30,
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: index % 2 === 0 ? '#6f5cc2' : '#0f766e',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          mt: 0.2,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Typography
                        sx={{
                          color: '#374151',
                          fontSize: { xs: '0.94rem', md: '1rem' },
                          lineHeight: 1.75,
                          fontWeight: 600,
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Box
                  sx={{
                    mt: 2.2,
                    p: 2,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    background: '#eef8f7',
                    border: '1px solid rgba(15, 118, 110, 0.22)',
                  }}
                >
                  <WhatsAppIcon sx={{ color: '#0f766e', fontSize: 30 }} />

                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 900,
                      fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                      fontSize: { xs: '0.98rem', md: '1.05rem' },
                    }}
                  >
                    WhatsApp Helpline: 6262565803
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: '100%',
                  pl: { md: 2 },
                  borderLeft: { md: '1px solid rgba(111, 92, 194, 0.16)' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 3,
                }}
              >
                <StatCard
                  icon={<GroupsRoundedIcon sx={{ fontSize: 32 }} />}
                  value="100000+"
                  label="से ज्यादा पंजीकृत शिक्षक"
                />

                <StatCard
                  icon={<VolunteerActivismRoundedIcon sx={{ fontSize: 32 }} />}
                  value="10000000+"
                  label="आकस्मिक मदद"
                  variant="accent"
                />

                <Box
                  sx={{
                    p: 2.2,
                    borderRadius: '22px',
                    background: '#221b43',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    boxShadow: '0 18px 45px rgba(34, 27, 67, 0.22)',
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ color: '#b9a7ff', fontSize: 30 }} />

                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                      fontSize: { xs: '0.96rem', md: '1.03rem' },
                      lineHeight: 1.6,
                      color:"#ffffff"
                    }}
                  >
                    सामूहिक सहयोग से शिक्षक परिवारों को समय पर आर्थिक संबल प्रदान करने का प्रयास।
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

export default Statistics;