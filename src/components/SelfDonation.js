import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
  Button
} from '@mui/material';

const SelfDonation = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          border: '2px solid #1E3A8A',
          borderRadius: 3,
          p: 4,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '1200px'
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
            color: '#1E3A8A',
            fontSize: { xs: '2.5rem', md: '3rem' },
            fontFamily: 'Poppins'
          }}
        >
          सहयोग
        </Typography>

        <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
          {/* Left Image Section */}
          <Grid item xs={4} md={3}>
            <Box
              component="img"
              src="/profile.jpg"
              alt="Ashok Kumar"
              sx={{
                width: '100%',
                height: 160,
                objectFit: 'cover',
                border: '2px solid #ddd',
                borderRadius: 1,
                mb: 1
              }}
            />
            <Box sx={{ fontSize: '1rem', color: '#333' }}>
              <Typography sx={{ mb: 0.5, fontFamily: 'Poppins' }}>
                <strong>Name :</strong> Ashok Kumar
              </Typography>
              <Typography sx={{ mb: 0.5, fontFamily: 'Poppins' }}>
                <strong>Registration Number :</strong> PMUMS20245896
              </Typography>
              <Typography sx={{ fontFamily: 'Poppins' }}>
                <strong>Registration Date :</strong> 02/05/2024
              </Typography>
            </Box>
          </Grid>

          {/* Right Content */}
          <Grid item xs={8} md={9}>
            <Typography
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 2
              }}
            >
              PMUMS के सुचारू संचालन के लिए आपका सहयोग महत्वपूर्ण है।
              संस्था के दैनिक संचालन, तकनीकी प्रबंधन, दस्तावेजीकरण,
              वेबसाइट/डेटाबेस, सर्वर, मीटिंग, आयोजन एवं संचालन से
              जुड़े अन्य प्रशासनिक खर्चों को पूरा करने के लिए
              संचालन सहयोग (Operational Donation) की आवश्यकता होती है।
            </Typography>

            {/* Nominee Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              {/* First Row - 2 buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  sx={{
                    py: 2,
                    px: 4,
                    backgroundColor: '#1E3A8A',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins',
                    '&:hover': {
                      backgroundColor: '#152b6b'
                    }
                  }}
                >
                  श्रीमती सपना अहिरवार (Wife)
                </Button>
                
                <Button
                  variant="contained"
                  sx={{
                    py: 2,
                    px: 4,
                    backgroundColor: '#1E3A8A',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins',
                    '&:hover': {
                      backgroundColor: '#152b6b'
                    }
                  }}
                >
                  बॉबी अहिरवार (Son)
                </Button>
              </Box>

              {/* Second Row - 2 buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  sx={{
                    py: 2,
                    px: 4,
                    borderColor: '#1E3A8A',
                    color: '#1E3A8A',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins',
                    '&:hover': {
                      borderColor: '#152b6b',
                      backgroundColor: 'rgba(30, 58, 138, 0.04)'
                    }
                  }}
                >
                  Nominee 3
                </Button>
                
                <Button
                  variant="outlined"
                  sx={{
                    py: 2,
                    px: 4,
                    borderColor: '#1E3A8A',
                    color: '#1E3A8A',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins',
                    '&:hover': {
                      borderColor: '#152b6b',
                      backgroundColor: 'rgba(30, 58, 138, 0.04)'
                    }
                  }}
                >
                  Nominee 4
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SelfDonation;
