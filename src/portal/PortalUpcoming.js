import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { ArrowBackRounded, ScheduleRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PortalUpcoming = ({ portal }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f4f2fb 0%, #f5f3ed 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: 'center',
            border: '1px solid #ded8f5',
            boxShadow: '0 24px 70px rgba(34, 27, 67, 0.14)',
          }}
        >
          <ScheduleRounded sx={{ fontSize: 78, color: '#6f5cc2' }} />
          <Typography variant="h3" sx={{ mt: 2, fontWeight: 900, color: '#221b43' }}>
            {portal.shortName}
          </Typography>
          <Typography sx={{ mt: 1.5, color: '#6b7280', fontWeight: 600 }}>
            यह पोर्टल अभी निर्माणाधीन है और जल्द उपलब्ध होगा।
          </Typography>
          <Button
            onClick={() => navigate('/')}
            startIcon={<ArrowBackRounded />}
            variant="contained"
            sx={{ mt: 4, borderRadius: 2.5, bgcolor: '#221b43' }}
          >
            Back to Portal Selection
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default PortalUpcoming;
