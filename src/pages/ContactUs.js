import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';

const ContactUs = () => {
  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">

          <Grid container spacing={4}>
            {/* Phone Numbers */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)'
                  }}>
                    <Phone sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e' }}>
                    फोन नंबर
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                      📞 6262565803 
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    ( WhatsApp हेल्पलाइन कृपया केवल WhatsApp पर ही संदेश करें, कॉल न करें )
                    </Typography>
                    {/* <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                      📞 9713450451
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      ( सुबह 8 से 10 तक और शाम 5 से 9 तक )
                    </Typography> */}
                    <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                      सहायता/पंजीकरण के लिए कॉल करें या व्हाट्सऐप आदि व्दारा संपर्क करें
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Registered Office */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 16px rgba(255, 152, 0, 0.3)'
                  }}>
                    <LocationOn sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e' }}>
                    पंजीकृत कार्यालय
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#e65100', mb: 1 }}>
                      रजिस्ट्रेशन नम्बर: 06/13/01/14617/23
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6, mb: 1 }}>
                      सुभाष पुरम रोड, हेलिपैड के पीछे,
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.6 }}>
                      टीकमगढ़, मध्यप्रदेश - 472001
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)'
                  }}>
                    <Email sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e' }}>
                    ईमेल
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        सहायता:
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600, 
                          color: '#1976d2',
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        component="a"
                        href="mailto:Info@pmums.com"
                      >
                        Info@pmums.com
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Additional Information */}
          <Paper
            elevation={4}
            sx={{
              p: 4,
              mt: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
              कार्य समय
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
              सोमवार से शुक्रवार: सुबह 9:00 बजे से शाम 6:00 बजे तक
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
              शनिवार: सुबह 10:00 बजे से दोपहर 2:00 बजे तक
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
              रविवार और राष्ट्रीय अवकाश के दिन बंद
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default ContactUs;