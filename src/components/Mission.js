import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Target,
  Favorite,
  Security,
  Group,
  AccountBalance,
  Support,
  Visibility,
  NetworkCheck
} from '@mui/icons-material';

const Mission = () => {
  const features = [
    {
      icon: <Favorite sx={{ color: '#e91e63' }} />,
      text: 'यह कोई बीमा योजना नहीं है'
    },
    {
      icon: <Security sx={{ color: '#4caf50' }} />,
      text: 'शुल्क/फीस नहीं लिया जाता'
    },
    {
      icon: <Visibility sx={{ color: '#2196f3' }} />,
      text: 'पूरी प्रक्रिया निष्पक्ष, पारदर्शी और नियम आधारित'
    },
    {
      icon: <NetworkCheck sx={{ color: '#ff9800' }} />,
      text: 'संघ राज्य से ब्लॉक स्तर तक संरचित नेटवर्क के माध्यम से कार्य करता है'
    },
    {
      icon: <Group sx={{ color: '#9c27b0' }} />,
      text: 'सभी सहयोग मानवीय संवेदना एवं शिक्षक एकता पर आधारित'
    }
  ];

  const supportTypes = [
    'अनुकंपा नियुक्ति संबंधी मार्गदर्शन',
    'बीमा/क्लेम/दस्तावेज़ी सहयोग',
    'प्रशासनिक सहायता',
    'भावनात्मक एवं नैतिक समर्थन'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Main Mission Title */}
      <Typography
        variant="h3"
        component="h2"
        align="center"
        sx={{
          mb: 6,
          fontWeight: 'bold',
          color: '#1a237e',
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        हमारा उद्देश्य
      </Typography>

      {/* Mission Statement */}
      <Card
        sx={{
          mb: 6,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          boxShadow: '0 15px 35px rgba(26, 35, 126, 0.3)'
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography
            variant="h6"
            sx={{
              lineHeight: 1.8,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              textAlign: 'justify',
              fontWeight: 400
            }}
          >
            किसी सदस्य की आकस्मिक या दुःखद मृत्यु की स्थिति में उसके नामिनी/परिवार को पारदर्शी व नि:शुल्क सहयोग उपलब्ध कराना, ताकि संकट की घड़ी में परिवार को सहारा मिल सके और वे जीवन के अगले चरण की ओर सुरक्षित बढ़ सकें।
          </Typography>
        </CardContent>
      </Card>

      {/* Support Areas */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: '#1a237e',
            textAlign: 'center'
          }}
        >
          हमारा कार्यक्षेत्र केवल आर्थिक सहयोग तक सीमित नहीं — बल्कि
        </Typography>
        
        <Grid container spacing={3}>
          {supportTypes.map((support, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '2px solid #f8f9fa',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: '#1a237e',
                    boxShadow: '0 10px 25px rgba(26, 35, 126, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Support sx={{ fontSize: 40, color: '#1a237e', mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#333',
                      lineHeight: 1.4
                    }}
                  >
                    {support}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why PMUMS is Special */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: '#1a237e',
            textAlign: 'center',
            fontSize: { xs: '1.8rem', md: '2.2rem' }
          }}
        >
          PMUMS क्यों विशेष है?
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {feature.icon}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      {feature.text}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Working Process */}
      <Card
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EFE7 100%)',
          border: '2px solid #e3f2fd'
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#1a237e',
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.2rem' }
            }}
          >
            हमारी कार्यप्रणाली
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#1a237e',
                fontSize: { xs: '1.1rem', md: '1.2rem' }
              }}
            >
              PMUMS मध्यप्रदेश के समस्त शिक्षकों को जोड़ते हुए,
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
              {['राज्य', 'संभाग', 'जिला', 'ब्लॉक'].map((level, index) => (
                <React.Fragment key={level}>
                  <Chip
                    label={level}
                    sx={{
                      background: '#1a237e',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      px: 2,
                      py: 1
                    }}
                  />
                  {index < 3 && (
                    <Typography
                      variant="h6"
                      sx={{ 
                        color: '#1a237e', 
                        fontWeight: 'bold',
                        alignSelf: 'center'
                      }}
                    >
                      →
                    </Typography>
                  )}
                </React.Fragment>
              ))}
            </Box>
            
            <Typography
              variant="body1"
              sx={{
                color: '#1a237e',
                fontWeight: 600,
                textAlign: 'center',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              स्तर पर समन्वय के माध्यम से सहयोग प्रदान करता है।
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: '#666',
              lineHeight: 1.8,
              textAlign: 'justify',
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 400
            }}
          >
            जब किसी शिक्षक के परिवार पर संकट आता है, संघ के सदस्य त्वरित जानकारी एकत्रित करते हुए सहायता प्रक्रिया को सक्रिय करते हैं और परिवार तक हर संभव सहयोग पहुँचाया जाता है।
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Mission;