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
                दिवंगत साथी<br />
स्व. श्री रेवाराम अलोने जी (जिला धार)<br />
सदस्यता क्रमांक: PMUMS 202411574<br />
सदस्यता दिनांक: 18/09/2025<br />
मृत्यु दिनांक: 20/12/2025<br />
स्व. श्री महेंद्र सिंह मुवेल जी (जिला धार)<br />
सदस्यता क्रमांक: PMUMS 20248814<br />
सदस्यता दिनांक: 12/09/2025<br />
मृत्यु दिनांक: 25/12/2025<br /><br />
              <b>  ⚠️ सहयोग हेतु महत्वपूर्ण निर्देश</b>
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
                1.कृपया अपने लॉगिन में दिए गए निर्धारित परिवार के QR कोड पर ही सहयोग करें।<br />
2.व्हाट्सएप ग्रुप या अन्य किसी माध्यम से प्राप्त QR कोड पर सहयोग न करें।<br />
3.
सहयोग केवल स्वयं / पति / पत्नी / पुत्र / पुत्री / नामांकित (Nominee) के खाते से ही करें।
यदि इनमें से कोई UPI का उपयोग नहीं करता है, तो कृपया किसी एक की UPI ID अवश्य बनवा लें।<br />
4.
यह योजना “सहयोग के बदले सहयोग” सिद्धांत पर आधारित है।
यदि कोई सदस्य सहयोग नहीं करता है और भविष्य में उसके साथ कोई अप्रिय घटना होती है, तो उसे योजना का लाभ (सहयोग) प्रदान नहीं किया जाएगा।<br />
5.
सभी सदस्य अपनी प्रोफाइल अनिवार्य अपडेट कर लें
किसी भी समस्या के समाधान हेतु व्हाट्सएप नंबर.... पर मेसेज करें.<br/>
<b>WhatsApp helpline 6262565803 </b>
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
                 100000+
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
                  10000000+
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