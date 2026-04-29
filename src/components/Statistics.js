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
  dark: '#3b0764',
  main: '#6d28d9',
  light: '#a855f7',
  gold: '#facc15',
  soft: '#f5f3ff',
  softGold: '#fffbeb',
  text: '#4c1d95',
  muted: '#5b5b6b',
};

const rulePoints = [
  'कृपया अपने लॉगिन में दिए गए निर्धारित परिवार के QR कोड पर ही सहयोग करें।',
  'व्हाट्सएप ग्रुप या अन्य किसी माध्यम से प्राप्त QR कोड पर सहयोग न करें।',
  'सहयोग केवल स्वयं / पति / पत्नी / पुत्र / पुत्री / नामांकित (Nominee) के खाते से ही करें। यदि इनमें से कोई UPI का उपयोग नहीं करता है, तो कृपया किसी एक की UPI ID अवश्य बनवा लें।',
  'यह योजना “सहयोग के बदले सहयोग” सिद्धांत पर आधारित है। यदि कोई सदस्य सहयोग नहीं करता है और भविष्य में उसके साथ कोई अप्रिय घटना होती है, तो उसे योजना का लाभ प्रदान नहीं किया जाएगा।',
  'सभी सदस्य अपनी प्रोफाइल अनिवार्य अपडेट कर लें। किसी भी समस्या के समाधान हेतु व्हाट्सएप नंबर पर मैसेज करें।',
];

const StatCard = ({ icon, value, label, variant = 'purple' }) => {
  const isGold = variant === 'gold';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '28px',
        p: { xs: 3, md: 3.5 },
        background: isGold
          ? 'linear-gradient(135deg, rgba(255,251,235,0.95) 0%, rgba(255,255,255,0.96) 100%)'
          : 'linear-gradient(135deg, rgba(245,243,255,0.96) 0%, rgba(255,255,255,0.96) 100%)',
        border: isGold
          ? '1px solid rgba(250, 204, 21, 0.35)'
          : '1px solid rgba(124, 58, 237, 0.18)',
        boxShadow: '0 18px 48px rgba(76, 29, 149, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 26px 70px rgba(76, 29, 149, 0.18)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -70,
          right: -70,
          width: 170,
          height: 170,
          borderRadius: '50%',
          background: isGold
            ? 'rgba(250, 204, 21, 0.18)'
            : 'rgba(168, 85, 247, 0.16)',
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
            background: isGold
              ? 'linear-gradient(135deg, #facc15, #a855f7)'
              : 'linear-gradient(135deg, #6d28d9, #a855f7)',
            color: '#fff',
            boxShadow: isGold
              ? '0 14px 32px rgba(250, 204, 21, 0.28)'
              : '0 14px 32px rgba(124, 58, 237, 0.25)',
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 950,
            background: isGold
              ? 'linear-gradient(135deg, #3b0764, #7c3aed, #facc15)'
              : 'linear-gradient(135deg, #3b0764, #7c3aed, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
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
            fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
        background: `
          radial-gradient(circle at top left, rgba(124, 58, 237, 0.13), transparent 30%),
          radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.16), transparent 32%),
          linear-gradient(135deg, #ffffff 0%, #fbfaff 42%, #f5f3ff 100%)
        `,
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
              fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
              background: 'linear-gradient(90deg, #7c3aed, #a855f7, #facc15)',
            }}
          />
        </Box>

        <Box
          sx={{
            borderRadius: { xs: '28px', md: '38px' },
            p: { xs: 2.4, sm: 3.5, md: 5 },
            background: 'rgba(255, 255, 255, 0.78)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            boxShadow: '0 28px 80px rgba(76, 29, 149, 0.13)',
            backdropFilter: 'blur(16px)',
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
              background: 'linear-gradient(90deg, #6d28d9, #a855f7, #facc15)',
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
                    fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                      color: theme.main,
                      fontWeight: 800,
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(124, 58, 237, 0.35)',
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
                            ? 'rgba(245, 243, 255, 0.72)'
                            : 'rgba(255, 251, 235, 0.72)',
                        border:
                          index % 2 === 0
                            ? '1px solid rgba(124, 58, 237, 0.12)'
                            : '1px solid rgba(250, 204, 21, 0.25)',
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
                          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          mt: 0.2,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Typography
                        sx={{
                          color: '#4b5563',
                          fontSize: { xs: '0.94rem', md: '1rem' },
                          lineHeight: 1.75,
                          fontWeight: 600,
                          fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.10), rgba(255,255,255,0.9))',
                    border: '1px solid rgba(34,197,94,0.20)',
                  }}
                >
                  <WhatsAppIcon sx={{ color: '#16a34a', fontSize: 30 }} />
                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 900,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
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
                  borderLeft: { md: '1px solid rgba(124, 58, 237, 0.12)' },
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
                  variant="gold"
                />

                <Box
                  sx={{
                    p: 2.2,
                    borderRadius: '22px',
                    background: 'linear-gradient(135deg, rgba(76,29,149,0.96), rgba(124,58,237,0.92))',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    boxShadow: '0 18px 45px rgba(76, 29, 149, 0.22)',
                  }}
                >
                  <CheckCircleRoundedIcon sx={{ color: theme.gold, fontSize: 30 }} />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'Noto Sans Devanagari, Poppins, Arial, sans-serif',
                      fontSize: { xs: '0.96rem', md: '1.03rem' },
                      lineHeight: 1.6,
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