import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Avatar,
  Button
} from '@mui/material';
import {
  Payment
} from '@mui/icons-material';

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
        {/* Blue Section Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            py: 2,
            px: 4,
            borderRadius: 2,
            mb: 3,
            mt: 3
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
              textAlign: 'center'
            }}
          >
            सहयोग केवल संस्था के लिए
          </Typography>
        </Box>

  <Typography
            variant="h6"
            sx={{
              color: 'red',
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
              textAlign: 'center'
            }}
          >
कृपया ध्यान दें: यहाँ प्रदर्शित QR कोड अथवा “Pay” बटन के माध्यम से किया गया सहयोग केवल संस्था के लिए मान्य होगा, इसे व्यक्तिगत/नॉमिनी सहयोग के रूप में स्वीकार नहीं किया जाएगा।          </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.8,
            fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
            textAlign: 'justify',
            mb: 4,
            px: { xs: 2, md: 4 }
          }}
        >
          प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश (PMUMS) एक गैर-लाभकारी, सेवा-आधारित संगठन है।
          <br />
          इस पृष्ठ के माध्यम से आप PMUMS की वेबसाइट संचालन, तकनीकी रखरखाव एवं संगठनात्मक गतिविधियों के लिए स्वेच्छा से आर्थिक सहयोग प्रदान कर सकते हैं।
          <br />
          यह सहयोग पूरी तरह वैकल्पिक है और किसी भी प्रकार की सदस्यता, लाभ या दावा से जुड़ा नहीं है।
        </Typography>

        {/* Payment Section */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            {/* QR Code Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                border: '2px solid #e0e0e0',
                borderRadius: 3,
                backgroundColor: '#f5f5f5'
              }}
            >
              <Box
                component="img"
                src="/qr-code.png"
                alt="QR Code for Payment"
                sx={{
                  width: 250,
                  height: 250,
                  objectFit: 'contain',
                  borderRadius: 2
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Payment Options */}
            <Box sx={{ textAlign: 'center' }}>
          
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                  fontFamily: 'Noto Sans Devanagari, Arial, sans-serif'
                }}
              >
                भुगतान करें
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  mb: 3,
                  fontSize: '0.9rem',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                "Pay Now by PhonePe, Google Pay or any UPI App"
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<Payment />}
                onClick={() => window.open('https://pages.razorpay.com/pmums', '_blank')}
                sx={{
                  background: '#4caf50',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#45a049'
                  }
                }}
              >
                अभी भुगतान करें (Pay Now)
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SelfDonation;
