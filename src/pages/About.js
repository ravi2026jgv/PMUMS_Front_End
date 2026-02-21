import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Favorite,
  People,
  Security,
  Visibility
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import SelfDonation from '../components/SelfDonation';

const About = () => {
  const objectives = [
    'दिवंगत शिक्षक/कर्मचारी के परिवार को आर्थिक सहयोग उपलब्ध कराना',
    'संकट की घड़ी में मानवीय संवेदना और नैतिक संबल प्रदान करना',
    'शिक्षक समाज में एकता, विश्वास और सहयोग की भावना को मजबूत करना',
    'परिजनों को प्रशासनिक मार्गदर्शन देना'
  ];

  const adminGuidance = [
    'अनुकम्पा नियुक्ति से संबंधित जानकारी',
    'आवश्यक दस्तावेज़ों की प्रक्रिया',
    'विभागीय दावों/क्लेम्स के संबंध में सहयोग'
  ];

  const workingPrinciples = [
    'सहायता प्रक्रिया नियमावली के अनुरूप हो',
    'किसी भी प्रकार का भेदभाव या पक्षपात न हो',
    'पूरी प्रक्रिया पारदर्शी और उत्तरदायी बनी रहे'
  ];

  const notInsurance = [
    'किसी भी सदस्य से कोई शुल्क नहीं लिया जाता',
    'कोई व्यावसायिक लाभ नहीं कमाया जाता',
    'संगठन पूर्णतः सेवा और सहयोग के सिद्धांत पर आधारित है'
  ];

  const coreValues = [
    { icon: <Favorite />, title: 'सेवा भावना', desc: 'निस्वार्थ भाव से सहयोग' },
    { icon: <Visibility />, title: 'पारदर्शिता', desc: 'हर प्रक्रिया स्पष्ट और जवाबदेह' },
    { icon: <People />, title: 'एकता', desc: 'शिक्षक समाज की सामूहिक शक्ति' },
    { icon: <Favorite />, title: 'मानवीय संवेदना', desc: 'दुख में साथ खड़े रहना' },
    { icon: <Security />, title: 'विश्वास', desc: 'संगठन और सदस्यों के बीच मजबूत भरोसा' }
  ];

  return (
    <Layout>
      <Box sx={{ py: 1, minHeight: '100vh', background: '#FFF8F0' }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 1, 
              mb: 6, 
              background: 'linear-gradient(135deg, #1E3A8A 0%, #3949ab 100%)',
              color: 'white',
              borderRadius: 4,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                fontFamily: 'Poppins'
              }}
            >
              PMUMS
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 600,
                fontFamily: 'Poppins'
              }}
            >
              प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश
            </Typography>
            <Chip
              label="गैर-लाभकारी • सेवा-आधारित • पूर्णतः स्वैच्छिक संगठन"
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                fontFamily: 'Poppins'
              }}
            />
          </Paper>

          {/* About Us Section */}
          <Paper sx={{ mb: 6, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Box sx={{ p: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#1E3A8A',
                  textAlign: 'center',
                  fontFamily: 'Poppins'
                }}
              >
                हमारे बारे में (About Us)
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mb: 3,
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश (PMUMS) एक गैर-लाभकारी, सेवा-आधारित एवं पूर्णतः स्वैच्छिक संगठन है, जिसकी स्थापना मध्यप्रदेश राज्य के शिक्षा विभाग एवं जनजातीय कार्य विभाग में कार्यरत शासकीय शिक्षकों एवं कर्मचारियों के कल्याण, एकता तथा पारस्परिक सहयोग के उद्देश्य से की गई है।
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                PMUMS का गठन इस मूल भावना के साथ किया गया है कि किसी भी शिक्षक अथवा कर्मचारी की आकस्मिक एवं दुःखद मृत्यु की स्थिति में उसका परिवार स्वयं को अकेला न महसूस करे। संगठन निरंतर यह प्रयास करता है कि ऐसी विषम परिस्थितियों में दिवंगत सदस्य के नामिनी अथवा परिजनों को निःशुल्क, निष्पक्ष, पारदर्शी एवं समयबद्ध सहयोग उपलब्ध कराया जा सके, जिससे उन्हें आर्थिक एवं मानसिक संबल प्राप्त हो सके।
              </Typography>
            </Box>
          </Paper>

          {/* Our Objectives */}
          <Paper sx={{ mb: 6, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Box sx={{ p: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#1E3A8A',
                  textAlign: 'center',
                  fontFamily: 'Poppins'
                }}
              >
                हमारा उद्देश्य
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                PMUMS का प्रमुख उद्देश्य है —
              </Typography>
              <List>
                {objectives.map((objective, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#FF9933' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={objective}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '1rem',
                          fontFamily: 'Poppins'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  mb: 2,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                परिजनों को प्रशासनिक मार्गदर्शन देना, जैसे:
              </Typography>
              <List sx={{ ml: 3 }}>
                {adminGuidance.map((guidance, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#4caf50', fontSize: '1rem' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={guidance}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.95rem',
                          fontFamily: 'Poppins'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>

          {/* Working Method */}
          <Paper sx={{ mb: 6, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Box sx={{ p: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#1E3A8A',
                  textAlign: 'center',
                  fontFamily: 'Poppins'
                }}
              >
                हमारी कार्यप्रणाली
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mb: 3,
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                PMUMS राज्य स्तर से लेकर संभाग, जिला और ब्लॉक स्तर तक संगठित ढांचे के माध्यम से कार्य करता है। प्रत्येक स्तर पर समन्वय बनाकर यह सुनिश्चित किया जाता है कि:
              </Typography>
              <List>
                {workingPrinciples.map((principle, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#FF9933' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={principle}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '1rem',
                          fontFamily: 'Poppins'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mt: 3,
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                संगठन द्वारा की जाने वाली सभी गतिविधियाँ सेवा-भाव से प्रेरित होती हैं और इनका उद्देश्य केवल शिक्षक-परिवार का कल्याण होता है।
              </Typography>
            </Box>
          </Paper>

          {/* Not Insurance */}
          <Paper sx={{ mb: 6, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', bgcolor: '#fff3e0' }}>
            <Box sx={{ p: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#e65100',
                  textAlign: 'center',
                  fontFamily: 'Poppins'
                }}
              >
                न बीमा, न व्यवसाय
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mb: 3,
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                PMUMS किसी भी प्रकार की बीमा योजना, निवेश योजना या लाभ-आधारित स्कीम नहीं है।
                यह स्पष्ट रूप से एक मानवीय एवं सहयोगात्मक संगठन है, जिसमें:
              </Typography>
              <List>
                {notInsurance.map((point, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: '#e65100' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={point}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '1rem',
                          fontFamily: 'Poppins'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>

          {/* Core Values */}
          <Paper sx={{ mb: 6, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Box sx={{ p: 5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#1E3A8A',
                  textAlign: 'center',
                  fontFamily: 'Poppins'
                }}
              >
                हमारे मूल्य (Our Core Values)
              </Typography>
              <List>
                {coreValues.map((value, index) => (
                  <ListItem key={index} sx={{ py: 2 }}>
                    <ListItemIcon>
                      <Box sx={{ color: '#FF9933' }}>
                        {value.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={value.title}
                      secondary={value.desc}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          fontFamily: 'Poppins'
                        },
                        '& .MuiListItemText-secondary': {
                          fontSize: '1rem',
                          fontFamily: 'Poppins'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>

          {/* Our Belief */}
          <Paper sx={{ mb: 6, borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', bgcolor: '#e8f5e8' }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#2e7d32',
                  fontFamily: 'Poppins'
                }}
              >
                हमारा विश्वास
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: '#1E3A8A',
                  fontFamily: 'Poppins'
                }}
              >
                सेवा, सहयोग और शिक्षक-कल्याण — यही PMUMS की पहचान है।
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  textAlign: 'justify',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins'
                }}
              >
                PMUMS का विश्वास है कि जब शिक्षक एक-दूसरे के साथ खड़े होते हैं, तब कोई भी परिवार असहाय नहीं रहता। संगठन निरंतर इस दिशा में कार्यरत है कि शिक्षक समाज सुरक्षित, संगठित और समर्थ बने।
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
        <Box sx={{ py: 8, background: '#FFF8F0' }}>
               <SelfDonation />
            </Box>
    </Layout>
  );
};

export default About;