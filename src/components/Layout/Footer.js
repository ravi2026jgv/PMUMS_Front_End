import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
} from '@mui/material';
import {
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
     borderTop: '3px solid #6f5cc2',
background: `
  linear-gradient(135deg, #221b43 0%, #30295c 50%, #3b3268 100%)
`,
color: '#ffffff',
        mt: 'auto',
        width: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false} sx={{ px: 2 }}>
        <Grid container spacing={4}>
          {/* Logo and Description Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
border: '2px solid #c8bfff',
p: 1
                }}
              >
                <img 
                  src="/pmums logo.png" 
                  alt="PMUMS Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                  color: '#f2f0ff',
                  fontSize: '1.1rem',
                  lineHeight: 1.2
                }}>
                  प्राथमिक शिक्षक संघ (PMUMS)
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#d8d1ff',
                  fontSize: '0.9rem',
                  fontFamily: 'Noto Sans Devanagari, Arial, sans-serif'
                }}>
                  शिक्षकों का संगठन — शिक्षकों के लिए, शिक्षकों द्वारा
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ 
                color: '#e8e4ff',
                fontSize: '0.9rem',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                lineHeight: 1.6,
                textAlign: 'justify',
                mb: 1.5
              }}>
                हमारा उद्देश्य मध्यप्रदेश के शिक्षकों के लिए एक सहयोगी तंत्र विकसित करना है, जिससे किसी भी संकट के समय कोई भी शिक्षक परिवार स्वयं को अकेला महसूस न करे।
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#e8e4ff',
                fontSize: '0.9rem',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                lineHeight: 1.6,
                textAlign: 'justify'
              }}>
                संगठन शिक्षक एकता, मानवीय सेवा एवं पारस्परिक सहयोग की भावना पर आधारित है।
              </Typography>
            </Box>
          </Grid>

          {/* Support Section */}
          <Grid item xs={12} md={2.5}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#f2f0ff',
              fontSize: '1.1rem',
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif'
            }}>
              सहयोग (Support)
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1
            }}>
              <Link href="#" sx={{ 
                color: '#e8e4ff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                transition: 'all 0.3s ease',
            '&:hover': {
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  transform: 'translateX(4px)',
  borderRadius: '6px',
  paddingLeft: '6px'
}
              }}>
                • सहयोग सहायता
              </Link>
              <Link href="#" sx={{ 
                color: '#e8e4ff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.3s ease',
              '&:hover': {
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  transform: 'translateX(4px)',
  borderRadius: '6px',
  paddingLeft: '6px'
}
              }}>
                • Sahyog List
              </Link>
            </Box>
          </Grid>

          {/* Important Links Section */}
          <Grid item xs={12} md={2.5}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#f2f0ff',
              fontSize: '1.1rem',
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif'
            }}>
              महत्वपूर्ण लिंक
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1
            }}>
              {[
                { text: '• हमारे बारे में', href: '/about' },
                { text: '• शिक्षक सूची', href: '/teachers' },
                { text: '• Sahyog करें', href: '/donate' },
                { text: '• नियमावली', href: '/rules' },
                { text: '• संपर्क करें', href: '/contact' }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  
                  sx={{ 
                    color: '#e8e4ff',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.25s ease',
                    fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                    transition: 'all 0.3s ease',
                '&:hover': {
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  transform: 'translateX(4px)',
  borderRadius: '6px',
  paddingLeft: '6px'
}

                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Details Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#f2f0ff',
              fontSize: '1.1rem',
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif'
            }}>
              संपर्क विवरण
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5
            }}>
              {/* Office Address */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ 
                  color: '#f2f0ff',
                  fontSize: '1.2rem',
                  mt: 0.2
                }} />
                <Box>
                  <Typography variant="body2" sx={{ 
                    color: '#e8e4ff',
                    fontSize: '0.9rem',
                    fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                    fontWeight: 600,
                    mb: 0.5
                  }}>
                    पंजीकृत कार्यालय : 06/13/01/14617/23
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#e8e4ff',
                    fontSize: '0.85rem',
                    fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                    lineHeight: 1.4
                  }}>
                    सुभाष पुरम रोड, हेलिपैड के पीछे, टीकमगढ़, मध्यप्रदेश 472001
                  </Typography>
                </Box>
              </Box>

              {/* Phone */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ 
                  color: '#e8e4ff',
                  fontSize: '0.9rem',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  📞 6262565803 ( WhatsApp हेल्पलाइन कृपया केवल WhatsApp पर ही संदेश करें, कॉल न करें )
                </Typography>
                {/* <Typography variant="body2" sx={{ 
                  color: '#e8e4ff',
                  fontSize: '0.9rem',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  📞 9713450451 ( सुबह 8 से 10 तक और शाम 5 से 9 तक )
                </Typography> */}
              </Box>

              {/* Email */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ 
                  color: '#e8e4ff',
                  fontSize: '0.9rem',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  📧 ईमेल : Info@pmums.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
  sx={{
    borderTop: '1px solid rgba(200, 191, 255, 0.25)',
    mt: 3,
    pt: 2,
    textAlign: 'center'
  }}
>
  <Typography
    variant="body2"
    sx={{
      color: '#cbc3f5',
      fontSize: '0.85rem',
      fontFamily: 'Arial, sans-serif'
    }}
  >
    © 2025 PMUMS | All Rights Reserved Managed by{' '}
    <Box
      component="a"
      href="https://jyotiglobalventures.com/"
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: '#ffffff',
        fontWeight: 600,
        textDecoration: 'none',
        '&:hover': {
          color: '#cbc3f5',
          textDecoration: 'underline'
        }
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

export default Footer;