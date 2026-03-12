// import React from 'react';
// import {
//   Box,
// } from '@mui/material';
// import Layout from '../components/Layout/Layout';
// import HeroBanner from '../components/HeroBanner';
// import Statistics from '../components/Statistics';
// import Founders from '../components/Founders';
// import DeathCase from '../components/DeathCase';
// import SelfDonation from '../components/SelfDonation';

// const Home = () => {
//   return (
//     <Layout>
//       {/* Hero Banner */}
//       <HeroBanner />
//       {/* Statistics Section */}
//       <Statistics />

//       {/* Death Case Section - TEMPORARILY HIDDEN */}
//       <Box sx={{ py: 8, background: '#FFF8F0' }}>
//         <DeathCase /> 
//       </Box>

//      {/* Founders Section */}
//       <Box sx={{ py: 2, background: '#f8f9fa' }}>
//         <Founders />
//       </Box>

//       {/* Self Donation Section - Payment Interface - TEMPORARILY HIDDEN */}
//       <Box sx={{ py: 8, background: '#FFF8F0' }}>
//          <SelfDonation />
//       </Box>
//     </Layout>
//   );
// };

// export default Home;
// src/pages/Home.jsx
import React from "react";
import { Box, Container, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import HeroBanner from "../components/HeroBanner";
import Statistics from "../components/Statistics";
import Founders from "../components/Founders";
import DeathCase from "../components/DeathCase";
import { useAuth } from "../context/AuthContext";
import SelfDonation from "../components/SelfDonation";
import SbiInsuranceSection from "../components/SbiInsuranceSection";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSahyogClick = () => {
    // ✅ if not logged in → go login and come back to /sahyog after login
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/sahyog" } } });
      return;
    }
    // ✅ logged in → go directly
    navigate("/sahyog");
  };

  return (
    <Layout>
      <HeroBanner />
      <Statistics />

      {/* ✅ SAHYOG CARD: ONLY WHEN LOGGED OUT */}
      {!isAuthenticated && (
        <Box sx={{ py: 4, background: "#FFF8F0" }}>
          <Container maxWidth="lg">
            <Card
              sx={{
                borderRadius: 4,
                border: "1px solid #FFE0B2",
                background: "linear-gradient(135deg, #FFF3E0, #FFFFFF)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" color="#1E3A8A" sx={{ mb: 1 }}>
                  संस्था के लिए सहयोग
                </Typography>

                <Typography color="#666" sx={{ mb: 2, lineHeight: 1.7 }}>
                  सहयोग देखने और भुगतान प्रमाण (Receipt/UTR) जमा करने के लिए “सहयोग करें” पर क्लिक करें।
                  लॉगिन के बाद सिस्टम आपको अपने आप आपके Assigned Pool Case पर ले जाएगा।
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleSahyogClick}
                    sx={{
                      bgcolor: "#FF9933",
                      fontWeight: "bold",
                      borderRadius: 3,
                      px: 3,
                      "&:hover": { bgcolor: "#e6851f" },
                    }}
                  >
                    सहयोग करें
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      )}

      {/* ✅ Home page shows assigned pool section ONLY WHEN LOGGED IN */}
      {isAuthenticated && (
        <Box sx={{ py: 4, background: "#FFF8F0" }}>
          <DeathCase />
        </Box>
      )}

      <Box sx={{ py: 2, background: "#f8f9fa" }}>
        <Founders />
      </Box>
       <Box sx={{ py: 4, background: "#FFF8F0" }}>
    
       <SbiInsuranceSection />
    </Box>
    <Box sx={{ py: 4, background: "#f8f9fa" }}>
   <SelfDonation />
</Box>
    </Layout>
  );
};

export default Home;