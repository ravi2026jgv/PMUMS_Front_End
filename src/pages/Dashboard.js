import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Dialog,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  People,
  AccountBalance,
  Notifications,
  PersonOff,
  Add,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import DeathCase from '../components/DeathCase';
import CreateDeathCase from '../components/CreateDeathCase';

const Dashboard = () => {
  const [openDeathCase, setOpenDeathCase] = useState(false);
  const [openCreateDeathCase, setOpenCreateDeathCase] = useState(false);

  const handleOpenDeathCase = () => {
    setOpenDeathCase(true);
  };

  const handleCloseDeathCase = () => {
    setOpenDeathCase(false);
  };

  const handleOpenCreateDeathCase = () => {
    setOpenCreateDeathCase(true);
  };

  const handleCloseCreateDeathCase = () => {
    setOpenCreateDeathCase(false);
  };

  const statsCards = [
    {
      title: 'कुल सदस्य',
      value: '1,234',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1a237e',
      growth: '+12%'
    },
    {
      title: 'कुल फंड',
      value: '₹12,34,567',
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      color: '#3949ab',
      growth: '+8%'
    },
    {
      title: 'सक्रिय योजनाएं',
      value: '45',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#5c6bc0',
      growth: '+5%'
    },
    {
      title: 'नई अधिसूचनाएं',
      value: '23',
      icon: <Notifications sx={{ fontSize: 40 }} />,
      color: '#7986cb',
      growth: '+15%'
    },
  ];

  return (
    <Layout>
      {/* Modern Fluid Background */}
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5c6bc0 75%, #7986cb 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4
      }}>
        {/* Floating Elements */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50% 40% 60% 30%',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(15deg)' }
          }
        }} />
        
        <Box sx={{
          position: 'absolute',
          top: '50%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '60% 30% 50% 40%',
          background: 'linear-gradient(225deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          animation: 'float 10s ease-in-out infinite reverse',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Dashboard Header */}
          <Paper 
            elevation={24} 
            sx={{ 
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(26, 35, 126, 0.3)',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <DashboardIcon sx={{ 
                  fontSize: 48,
                  color: '#1a237e'
                }} />
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}>
                    डैशबोर्ड
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#666' }}>
                    शिक्षक कल्याण कोष प्रबंधन सिस्टम
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={12}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 15px 30px rgba(26, 35, 126, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(26, 35, 126, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}80 100%)`,
                          color: 'white',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#4caf50',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                        }}
                      >
                        {card.growth}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold', 
                      color: card.color,
                      mb: 1 
                    }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Death Case Section */}
          <Paper 
            elevation={24} 
            sx={{ 
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(26, 35, 126, 0.3)',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonOff sx={{ 
                    fontSize: 40,
                    color: '#d32f2f'
                  }} />
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold',
                      color: '#1a237e',
                      mb: 0.5
                    }}>
                      मृत्यु सहायता केस
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      परिवार के लिए सहायता प्रबंधन
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenCreateDeathCase}
                  sx={{
                    background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                      boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                    }
                  }}
                >
                  नया केस बनाएं
                </Button>
              </Box>

              <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                किसी सदस्य या परिवार के सदस्य की मृत्यु होने पर सहायता राशि के लिए नया केस बनाएं।
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        12
                      </Typography>
                      <Typography variant="body2">
                        कुल मृत्यु केस
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        5
                      </Typography>
                      <Typography variant="body2">
                        लंबित केस
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ₹5,60,000
                      </Typography>
                      <Typography variant="body2">
                        कुल सहायता राशि
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Coming Soon Section */}
          <Paper 
            elevation={24} 
            sx={{ 
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(26, 35, 126, 0.3)',
            }}
          >
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold',
                color: '#1a237e',
                mb: 3
              }}>
                अधिक सुविधाएं जल्द ही आ रही हैं...
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                हम आपके लिए और भी बेहतरीन सुविधाओं पर काम कर रहे हैं। कृपया धैर्य रखें।
              </Typography>
              
              {/* Progress Indicators */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#1a237e', fontWeight: 600 }}>
                      रिपोर्ट्स और एनालिटिक्स
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ 
                        mt: 1, 
                        borderRadius: 1,
                        height: 8,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #1a237e 0%, #5c6bc0 100%)'
                        }
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      75% पूर्ण
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#1a237e', fontWeight: 600 }}>
                      सदस्य प्रबंधन
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={60} 
                      sx={{ 
                        mt: 1, 
                        borderRadius: 1,
                        height: 8,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #3949ab 0%, #7986cb 100%)'
                        }
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      60% पूर्ण
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#1a237e', fontWeight: 600 }}>
                      फंड ट्रैकिंग
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={45} 
                      sx={{ 
                        mt: 1, 
                        borderRadius: 1,
                        height: 8,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #5c6bc0 0%, #9c27b0 100%)'
                        }
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      45% पूर्ण
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>

        {/* Death Case Dialog */}
        <Dialog 
          open={openDeathCase} 
          onClose={handleCloseDeathCase}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              maxHeight: '90vh',
            }
          }}
        >
          <DeathCase />
        </Dialog>

        {/* Create Death Case Dialog */}
        <CreateDeathCase
          open={openCreateDeathCase}
          onClose={handleCloseCreateDeathCase}
          onSuccess={() => console.log('Death case created successfully')}
        />
      </Box>
    </Layout>
  );
};

export default Dashboard;