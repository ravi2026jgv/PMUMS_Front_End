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
                  नोमिनी के लिए सहयोग
                </Typography>
{/* 
                <Typography color="#666" sx={{ mb: 2, lineHeight: 1.7 }}>
                 सभी सम्मानित सदस्यों से निवेदन है कि
दिवंगत सदस्य के परिवार (नोमिनी) की आर्थिक सहायता हेतु
₹100 का अनिवार्य सहयोग निर्धारित किया गया है।
                </Typography> */}
 {/* <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
<br />📅 सहयोग अवधि : 18 मार्च 2026 से 28 मार्च 2026 तक <br />

⚠️ भुगतान के बाद अपना UTR नंबर दर्ज करें।
UTR दर्ज होने पर ही आपका सहयोग सफल माना जाएगा।<br />

🔶 नोट : निर्धारित अवधि के बाद सहयोग स्वीकार नहीं किया जाएगा। <br />
          </Typography> */}
          <Typography variant="h4" fontWeight="bold" color="#1E3A8A">
            
          </Typography>
                 <Typography variant="h4" fontWeight="bold" color="#666">
<br />📢 महत्वपूर्ण सूचना – सहयोग संबंधी<br />

सभी सम्मानित सदस्यों को सूचित किया जाता है कि स्व. श्री रेवाराम अलोने जी (जिला धार) एवं स्व. श्री महेंद्र सिंह मुवेल जी (जिला धार)
के परिवारों हेतु चल रही सहयोग प्रक्रिया में, परिवार के बैंक खाते / QR में तकनीकी समस्या के कारण भुगतान में कठिनाई आ रही है।<br />

👉 साथ ही बैंक अवकाश के कारण समस्या का समाधान संभव नहीं हो पा रहा है।<br /><br />

📅 अतः वर्तमान सहयोग कार्यक्रम को 2 अप्रैल 2026 तक स्थगित किया जाता है। 📌 दिनांक 2 अप्रैल 2026 से पुनः सहयोग प्रक्रिया प्रारंभ की जाएगी।<br />

👉 इस बीच सभी सदस्य अपनी प्रोफाइल अवश्य अपडेट कर लें।<br />

🙏 धन्यवाद।<br />
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
      <SelfDonation />

<Box sx={{ py: 4, background: "#f8f9fa" }}>
  <SbiInsuranceSection />
</Box>
    </Layout>
  );
};

export default Home;