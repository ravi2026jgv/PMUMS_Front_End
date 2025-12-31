import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container
} from '@mui/material';

const foundersData = [
  {
    id: 1,
    name: 'श्री सतीश कुमार खरे',
    title: 'संस्थापक',
    image: '/admin3.jpeg',
    alt: 'श्री सतीश कुमार खरे'
  },
  {
    id: 2,
    name: 'श्री बृजेश कुमार असाटी',
    title: 'सह संस्थापक',
    image: '/admin1.png',
    alt: 'श्री बृजेश कुमार असाटी'
  },
  {
    id: 3,
    name: 'श्री मुरली मनोहर अरजरिया',
    title: 'सह संस्थापक',
    image: '/admin2.jpeg',
    alt: 'श्री मुरली मनोहर अरजरिया'
  }
];

const FounderCard = ({ founder }) => (
  <Grid item xs={12} sm={4} md={4}>
    <Card
      sx={{
        textAlign: 'center',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Box
        component="img"
        src={founder.image}
        alt={founder.alt}
        sx={{
          width: '100%',
          height: 280,
          objectFit: 'cover',
          backgroundColor: '#FFFFFF'
        }}
      />
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1E3A8A',
            mb: 2,
            fontFamily: 'Poppins',
            fontSize: '1.3rem'
          }}
        >
          {founder.name}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#666',
            fontFamily: 'Poppins',
            fontSize: '1rem'
          }}
        >
          {founder.title}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const Founders = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 3,
          p: 4,
          backgroundColor: '#fafafa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Blue Header */}
        <Box
          sx={{
            backgroundColor: '#1E3A8A',
            borderRadius: 2,
            py: 3,
            mb: 4,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            संस्थापक एवं मार्गदर्शक मंडल
          </Typography>
        </Box>

        <Grid container spacing={6} justifyContent="center" alignItems="stretch">
          {foundersData.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Founders;