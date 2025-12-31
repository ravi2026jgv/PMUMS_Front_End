import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
} from '@mui/material';
import {
  People,
  Favorite,
  Security,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import HeroBanner from '../components/HeroBanner';
import Statistics from '../components/Statistics';
import Founders from '../components/Founders';
import Mission from '../components/Mission';
import DeathCase from '../components/DeathCase';
import SelfDonation from '../components/SelfDonation';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <Layout>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Statistics Section */}
      <Statistics />

     {/* Founders Section */}
      <Box sx={{ py: 2, background: '#f8f9fa' }}>
        <Founders />
      </Box>
      
      {/* Death Case Section */}
      <Box sx={{ py: 8, background: '#FFF8F0' }}>
        <DeathCase />
      </Box>

      {/* Self Donation Section */}
      <Box sx={{ py: 8, background: '#FFF8F0' }}>
        <SelfDonation />
      </Box>
    </Layout>
  );
};

export default Home;