import React, { useState } from 'react';
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
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReceiptUpload from './ReceiptUpload';

const DeathCase = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [receiptUploadOpen, setReceiptUploadOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);

  const donationInfo = {
    beneficiaryName: 'देवेंद्र कुमार अहिरवार'
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      setLoginAlertOpen(true);
      return;
    }
    setReceiptUploadOpen(true);
  };

  const handleLoginRedirect = () => {
    setLoginAlertOpen(false);
    navigate('/login');
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          border: '2px solid #1E3A8A',
          borderRadius: 3,
          p: 1,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '1200px'
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
            fontSize: '30.6px',
            fontFamily: 'Poppins'
          }}
        >
          सहयोग
        </Typography>

        {/* Main Content */}
        <Grid container spacing={2} sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Left Side - Photo and Details */}
        <Grid item xs={12} md={5} lg={5}>
          {/* Photo */}
          <Box
            component="img"
            src="/Profile photo.png"
            alt="Ashok Kumar"
            sx={{
              width: '100%',
              maxWidth: '250px',
              height: 250,
              objectFit: 'cover',
              border: '2px solid #ddd',
              borderRadius: 1,
              mb: 1,
              mx: { xs: 'auto', md: 0 },
              display: 'block'
            }}
          />
          
          {/* Personal Details */}
          <Box sx={{ 
            fontSize: '1rem', 
            color: '#333',
            textAlign: { xs: 'center', md: 'left' },
            mt: { xs: 2, md: 0 }
          }}>
            <Typography sx={{ 
              mb: 0.5, 
              fontFamily: 'Poppins',
              fontSize: '13.6px'
            }}>
              <strong>Name :</strong> श्री राकेश कुमार अहिरवार
            </Typography>
            <Typography sx={{ 
              mb: 0.5, 
              fontFamily: 'Poppins',
              fontSize: '13.6px'
            }}>
              <strong>Registration Number :</strong> PMUMS20246261
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Poppins',
              fontSize: '13.6px'
            }}>
              <strong>Registration Date :</strong> 31/08/2025 (10:40 AM)
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Description and Table */}
        <Grid item xs={12} md={7} lg={7}>
          {/* Description Text */}
          <Box>
            <Typography
              sx={{
                fontSize: '13.6px',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 1.2
              }}
            >
              PMUMS मध्यप्रदेश के पंजीकृत शिक्षक श्री राकेश कुमार अहिरवार का दिनांक 05/12/2025 को स्वास्थ्य कारणों से आकस्मिक देहावसान हो गया।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '13.6px',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 1.2
              }}
            >
              यह घटना PMUMS परिवार के लिए अत्यंत दुःखद एवं अपूरणीय क्षति है। दिवंगत साथी एक सरल, कर्मठ एवं सेवाभावी शिक्षक थे।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '13.6px',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 1.2
              }}
            >
              उनके नॉमिनी – पत्नी श्रीमती सपना अहिरवार, पुत्र बॉबी अहिरवार एवं पुत्री रश्मि अहिरवार के प्रति PMUMS परिवार अपनी गहरी संवेदना व्यक्त करता है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '13.6px',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 1.2
              }}
            >
              PMUMS मध्यप्रदेश परिवार की ओर से दिवंगत आत्मा को विनम्र श्रद्धांजलि अर्पित की जाती है।
            </Typography>
            
            <Typography
              sx={{
                fontSize: '13.6px',
                lineHeight: 1.4,
                color: '#333',
                textAlign: 'justify',
                fontFamily: 'Poppins',
                mb: 2
              }}
            >
              ईश्वर से प्रार्थना है कि शोकाकुल परिवार को यह दुःख सहन करने की शक्ति प्रदान करें।
            </Typography>
          </Box>

          {/* Nominees Table */}
          <TableContainer sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '8px', backgroundColor: 'transparent' }}>
              <TableBody>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      borderRadius: '8px',
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      width: '50%'
                    }}
                  >
                  <Button
                    sx={{
                      width: '100%',
                      minWidth: '200px',
                      height: '50px',
                      textTransform: 'none',
                      backgroundColor: '#EEEEEE',
                      border: '1px solid #EEEEEE',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      color: '#333',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: '#DDDDDD',
                        borderColor: '#DDDDDD',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    श्रीमती सपना अहिरवार
                  </Button>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      borderRadius: '8px',
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      width: '50%'
                    }}
                  >
                    <Button
                      sx={{
                        width: '100%',
                        minWidth: '200px',
                        height: '50px',
                        textTransform: 'none',
                        backgroundColor: '#EEEEEE',
                        border: '1px solid #EEEEEE',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        color: '#333',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: '#DDDDDD',
                          borderColor: '#DDDDDD',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      Wife
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      width: '50%'
                    }}
                  >
                  <Button
                    sx={{
                      width: '100%',
                      minWidth: '200px',
                      height: '50px',
                      textTransform: 'none',
                      backgroundColor: '#EEEEEE',
                      border: '1px solid #EEEEEE',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      color: '#333',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: '#DDDDDD',
                        borderColor: '#DDDDDD',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                  बॉबी अहिरवार
                  </Button>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      width: '50%'
                    }}
                  >
                    <Button
                      sx={{
                        width: '100%',
                        minWidth: '200px',
                        height: '50px',
                        textTransform: 'none',
                        backgroundColor: '#EEEEEE',
                        border: '1px solid #EEEEEE',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        color: '#333',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: '#DDDDDD',
                          borderColor: '#DDDDDD',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                        }
                      }}
                    >
                      Son
                    </Button>
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
          maxWidth: '1200px',
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
                component="img"
                src="/sapna_Ahirwar_QR_1.png"
                alt="Sapna Ahirwar QR Code"
                sx={{
                  width: 250,
                  height: 250,
                  backgroundColor: '#ffffff',
                  border: '2px solid #ccc',
                  borderRadius: 2,
                  margin: '0 auto',
                  mb: 3,
                  objectFit: 'contain'
                }}
              />
f
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
                श्रीमती सपना अहिरवार
              </Typography>

              {/* Download Button */}
              <Button
                variant="contained"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/sapna_Ahirwar_QR_1.png';
                  link.download = 'Sapna_Ahirwar_QR.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
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
                component="img"
                src="/Boby_Ahirwar_QR_2.png"
                alt="Boby Ahirwar QR Code"
                sx={{
                  width: 250,
                  height: 250,
                  backgroundColor: '#ffffff',
                  border: '2px solid #ccc',
                  borderRadius: 2,
                  margin: '0 auto',
                  mb: 3,
                  objectFit: 'contain'
                }}
              />

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
                बॉबी अहिरवार
              </Typography>

              {/* Download Button */}
              <Button
                variant="contained"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Boby_Ahirwar_QR_2.png';
                  link.download = 'Boby_Ahirwar_QR.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
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
          maxWidth: '1200px',
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
        <Box sx={{ p: 2 }}>
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
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>44472186841</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>IFSC: SBIN0062229</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '0.9rem', fontFamily: 'Poppins' }}>
                  Sapna Ahirwar
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
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>44547141657</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>IFSC: SBIN0062229</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '0.9rem', fontFamily: 'Poppins' }}>
                  Boby Ahirwar
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
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>40670606893</Typography>
                <Typography sx={{ mb: 1, fontSize: '0.9rem', fontFamily: 'Poppins' }}>IFSC: SBIN0062229</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#1E3A8A', fontSize: '0.9rem', fontFamily: 'Poppins' }}>
                  Rashmi Ahirwar
                </Typography>
                <Typography sx={{ position: 'absolute', top: 8, right: 8, fontSize: '1.2rem', fontWeight: 'bold' }}>3</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Upload Receipt Button */}
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleUploadClick}
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

      {/* Receipt Upload Dialog */}
      <ReceiptUpload
        open={receiptUploadOpen}
        onClose={() => setReceiptUploadOpen(false)}
        donationInfo={donationInfo}
      />

      {/* Login Required Dialog */}
      <Dialog
        open={loginAlertOpen}
        onClose={() => setLoginAlertOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            color: '#1E3A8A',
            fontWeight: 'bold',
            fontFamily: 'Poppins'
          }}
        >
          लॉगिन आवश्यक (Login Required)
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            रसीद अपलोड करने के लिए कृपया पहले लॉगिन करें।
            <br />
            Please login first to upload receipt.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setLoginAlertOpen(false)}
            sx={{ mr: 2, color: '#666' }}
          >
            रद्द करें (Cancel)
          </Button>
          <Button
            variant="contained"
            onClick={handleLoginRedirect}
            sx={{
              backgroundColor: '#1E3A8A',
              '&:hover': {
                backgroundColor: '#1E3A8A'
              }
            }}
          >
            लॉगिन करें (Login)
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeathCase;