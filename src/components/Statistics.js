import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper
} from '@mui/material';

const Statistics = () => {
  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        background: '#ffffff'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            border: '2px solid #e0e0e0',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            background: '#fafafa',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Grid container spacing={8} alignItems="center" justifyContent="center">
          {/* Left side - Description */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              sx={{ 
                pr: { md: 14 },
                pl: { xs: 0, md: 3 },
                borderRight: { md: '3px solid #ddd' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: { md: '300px' }
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '30.6px',
                  lineHeight: '40px',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  color: '#333',
                  mb: 4
                }}
              >
                आज का सहयोग — कल का संबल
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#555',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                  fontFamily: 'Poppins, Arial, sans-serif',
                  mb: 3
                }}
              >
                सहयोग की हर राशि किसी परिवार की उम्मीद बनती है।
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#555',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                  fontFamily: 'Poppins, Arial, sans-serif'
                }}
              >
                PMUMS द्वारा अब तक अनेक शिक्षक परिवारों को सहयोग व<br />
                सहायता प्रदान की जा चुकी है हमारा उद्देश्य है कि कोई भी<br />
                शिक्षक परिवार कठिन समय में अकेला न रहे और उसे तुरंत<br />
                मानवीय सहयोग मिल सके।
              </Typography>
            </Box>
          </Grid>

          {/* Right side - Statistics */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                pl: { md: 4 },
                gap: 4
              }}
            >
              {/* Stat 1 - Registered Teachers */}
              <Box 
                sx={{ 
                  borderLeft: '4px solid #1976d2',
                  pl: 3,
                  py: 2
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    mb: 1,
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    lineHeight: 1,
                    display: 'block'
                  }}
                >
                  62000+
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    fontFamily: 'Poppins, Arial, sans-serif',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    display: 'block',
                    mt: 1
                  }}
                >
                  में ज्यादा पंजीकृत शिक्षक
                </Typography>
              </Box>

              {/* Stat 2 - Emergency Support */}
              <Box 
                sx={{ 
                  borderLeft: '4px solid #1976d2',
                  pl: 3,
                  py: 2
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1976d2',
                    mb: 1,
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    lineHeight: 1,
                    display: 'block'
                  }}
                >
                  4000000+
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    fontFamily: 'Poppins, Arial, sans-serif',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    display: 'block',
                    mt: 1
                  }}
                >
                  आकस्मिक मदद
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