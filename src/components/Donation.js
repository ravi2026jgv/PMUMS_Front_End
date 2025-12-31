import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button
} from '@mui/material';

const Donation = () => {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          border: '2px solid #1E3A8A',
          borderRadius: 3,
          p: 1,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '1000px'
        }}
      >
        {/* Main Title */}
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

        {/* Main Content */}
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
        {/* Left Side - Photo and Details */}
        <Grid item xs={4} md={3}>
          {/* Photo */}
          <Box
            component="img"
            src="/admin3.jpeg"
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
          
          {/* Personal Details */}
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

        {/* Right Side - Description and Table */}
        <Grid item xs={8} md={9}>
          {/* Description Text */}
          <Box>
            <Typography
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 0.8
              }}
            >
              PMUMS के सुचारू संचालन के लिए आपका सहयोग महत्वपूर्ण है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 0.8
              }}
            >
              संस्था के दैनिक संचालन में तकनीकी प्रबंधन की आवश्यकता होती है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 0.8
              }}
            >
              दस्तावेज़ीकरण, वेबसाइट/डेटाबेस का रखरखाव आवश्यक है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 0.8
              }}
            >
              संचार, मीटिंग, आयोजन एवं अन्य प्रशासनिक कार्यों की व्यवस्था करनी होती है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 0.8
              }}
            >
              इन सभी खर्चों के लिए संचालन सहयोग (Operational Donation) की आवश्यकता रहती है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 0.8
              }}
            >
              यह सहायता किसी शिक्षक/परिवार मृत्यु सहायता से अलग है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '0.9rem',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 2
              }}
            >
              इस राशि का उपयोग केवल संगठन को व्यवस्थित चलाने, सिस्टम मजबूत करने एवं सेवा प्रक्रिया के संचालन के लिए किया जाता है।
            </Typography>
          </Box>

          {/* Nominees Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      fontWeight: 'bold',
                      fontFamily: 'Poppins',
                      border: '1px solid #ddd',
                      color: '#666',
                      fontSize: '0.85rem',
                      py: 1
                    }}
                  >
                    Nominees name 1
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f5f5f5', 
                      fontWeight: 'bold',
                      fontFamily: 'Poppins',
                      border: '1px solid #ddd',
                      color: '#666',
                      fontSize: '0.85rem',
                      py: 1
                    }}
                  >
                    Nominees Relation
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f9f9f9',
                      fontFamily: 'Poppins',
                      border: '1px solid #ddd',
                      color: '#666',
                      fontSize: '0.85rem',
                      py: 1
                    }}
                  >
                    Nominees name 2
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: '#f9f9f9',
                      fontFamily: 'Poppins',
                      border: '1px solid #ddd',
                      color: '#666',
                      fontSize: '0.85rem',
                      py: 1
                    }}
                  >
                    Nominees Relation
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      </Box>

      {/* Payment QR Section */}
      <Box
        sx={{
          border: '2px solid #1E3A8A',
          borderRadius: 3,
          p: 1,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '1000px',
          mt: 4
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          component="h3"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 'bold',
            color: '#1E3A8A',
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            fontFamily: 'Poppins'
          }}
        >
          कृपया परिवार के लिए सहयोग करें
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            textAlign: 'center',
            mb: 4,
            color: '#666',
            fontSize: '1.1rem',
            fontFamily: 'Poppins'
          }}
        >
          "Pay Now by PhonePe, Google Pay or any UPI App"
        </Typography>

        {/* QR Codes Section */}
        <Grid container spacing={4} justifyContent="center">
          {/* First QR Code */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: '#f5f5f5',
                borderRadius: 3,
                border: '1px solid #ddd',
                textAlign: 'center'
              }}
            >
              {/* QR Code Placeholder */}
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  backgroundColor: '#ffffff',
                  border: '2px solid #ccc',
                  borderRadius: 2,
                  margin: '0 auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#999'
                }}
              >
                QR Code
              </Box>

              {/* Nominee Name */}
              <Typography
                sx={{
                  mb: 3,
                  color: '#666',
                  fontSize: '1.2rem',
                  fontFamily: 'Poppins',
                  fontWeight: 500
                }}
              >
                Nominee Name
              </Typography>

              {/* Download Button */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF9933',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins',
                  '&:hover': {
                    backgroundColor: '#e6851f'
                  }
                }}
              >
                Download QR
              </Button>
            </Paper>
          </Grid>

          {/* Second QR Code */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: '#f5f5f5',
                borderRadius: 3,
                border: '1px solid #ddd',
                textAlign: 'center'
              }}
            >
              {/* QR Code Placeholder */}
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  backgroundColor: '#ffffff',
                  border: '2px solid #ccc',
                  borderRadius: 2,
                  margin: '0 auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  color: '#999'
                }}
              >
                QR Code
              </Box>

              {/* Nominee Name */}
              <Typography
                sx={{
                  mb: 3,
                  color: '#666',
                  fontSize: '1.2rem',
                  fontFamily: 'Poppins',
                  fontWeight: 500
                }}
              >
                Nominee Name
              </Typography>

              {/* Download Button */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#FF9933',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins',
                  '&:hover': {
                    backgroundColor: '#e6851f'
                  }
                }}
              >
                Download QR
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Nominee Details Section */}
      <Box
        sx={{
          border: '2px solid #1E3A8A',
          borderRadius: 3,
          p: 0,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '1000px',
          mt: 4,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#1E3A8A',
            color: 'white',
            py: 2,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              fontFamily: 'Poppins'
            }}
          >
            Nominee के विवरण
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 1 }}>
          {/* Account Cards */}
          <Grid container spacing={3} justifyContent="space-evenly" sx={{ mb: 4 }}>
            {/* Account 1 */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9',
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '1.1rem', fontFamily: 'Poppins' }}>
                    Account 1
                  </Typography>
                  <Box sx={{ fontSize: '1.2rem' }}>📋</Box>
                </Box>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>SBI Bank</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>XXXX-XXXX-XXXX-123</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>IFSC: SBIN0001234</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '0.9rem', fontFamily: 'Poppins' }}>
                  Acc holder name
                </Typography>
                <Typography sx={{ position: 'absolute', top: 8, right: 8, fontSize: '1.2rem', fontWeight: 'bold' }}>1</Typography>
              </Paper>
            </Grid>

            {/* Account 2 */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9',
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '1.1rem', fontFamily: 'Poppins' }}>
                    Account 2
                  </Typography>
                  <Box sx={{ fontSize: '1.2rem' }}>📋</Box>
                </Box>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>SBI Bank</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>XXXX-XXXX-XXXX-123</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>IFSC: SBIN0001234</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '0.9rem', fontFamily: 'Poppins' }}>
                  Acc holder name
                </Typography>
                <Typography sx={{ position: 'absolute', top: 8, right: 8, fontSize: '1.2rem', fontWeight: 'bold' }}>2</Typography>
              </Paper>
            </Grid>

            {/* Account 3 */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9',
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '1.1rem', fontFamily: 'Poppins' }}>
                    Account 3
                  </Typography>
                  <Box sx={{ fontSize: '1.2rem' }}>📋</Box>
                </Box>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>SBI Bank</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>XXXX-XXXX-XXXX-123</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>IFSC: SBIN0001234</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '0.9rem', fontFamily: 'Poppins' }}>
                  Acc holder name
                </Typography>
                <Typography sx={{ position: 'absolute', top: 8, right: 8, fontSize: '1.2rem', fontWeight: 'bold' }}>3</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Upload Receipt Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#1E3A8A',
                color: '#1E3A8A',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontFamily: 'Poppins',
                '&:hover': {
                  borderColor: '#1E3A8A',
                  backgroundColor: 'rgba(30, 58, 138, 0.04)'
                }
              }}
            >
              📤 रसीद अपलोड करें (Upload Receipt)
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Donation;