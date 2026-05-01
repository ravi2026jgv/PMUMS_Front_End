import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import {
  Payment,
  VolunteerActivismRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import Layout from "../components/Layout/Layout";
import { adminAPI, FILE_BASE_URL } from "../services/api";

const theme = {
  dark: "#221b43",
  main: "#6f5cc2",
  light: "#b9a7ff",
  accent: "#0f766e",
  soft: "#f4f2fb",
  softAccent: "#eef8f7",
  text: "#221b43",
  muted: "#4b5563",
  border: "#ded8f5",
  warningBg: "#fff7ed",
  warningBorder: "#fed7aa",
  warningText: "#7c2d12",
  warningIcon: "#c2410c",
};

const SelfDonationPage = () => {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await adminAPI.getPublicSelfDonationSettings();
        setQrUrl(response.data?.qrUrl || "");
      } catch (error) {
        console.error("Error loading self donation settings:", error);
        setQrUrl("");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const resolvedQrUrl = qrUrl
    ? qrUrl.startsWith("http")
      ? qrUrl
      : `${FILE_BASE_URL}${qrUrl}`
    : "/qr-code.png";

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          py: { xs: 6, md: 9 },
          background: "#eef8f7",
          position: "relative",
          overflow: "hidden",
         
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: { xs: "28px", md: "38px" },
              p: { xs: 2.5, sm: 3.5, md: 5 },
              background: "#ffffff",
              border: "1px solid rgba(15, 118, 110, 0.18)",
              boxShadow: "0 28px 80px rgba(34, 27, 67, 0.12)",
              position: "relative",
              overflow: "hidden",

              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 7,
                background: theme.accent,
              },

              "&::after": {
                content: '""',
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                right: -110,
                bottom: -130,
                background: "rgba(15, 118, 110, 0.08)",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box textAlign="center" mb={{ xs: 3.5, md: 5 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: theme.accent,
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    fontSize: "0.82rem",
                    fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                  }}
                >
                  PMUMS ORGANIZATION SUPPORT
                </Typography>

                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    mt: 0.7,
                    color: theme.dark,
                    fontWeight: 950,
                    fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                    fontSize: { xs: "1.9rem", md: "3rem" },
                    lineHeight: 1.25,
                  }}
                >
                  सहयोग केवल संस्था के लिए
                </Typography>

                <Box
                  sx={{
                    width: 95,
                    height: 5,
                    borderRadius: 99,
                    mx: "auto",
                    mt: 2,
                    background: theme.accent,
                  }}
                />
              </Box>

              <Box
                sx={{
                  mb: 4,
                  p: { xs: 2, md: 2.4 },
                  borderRadius: "22px",
                  background: theme.warningBg,
                  border: `1px solid ${theme.warningBorder}`,
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <WarningAmberRounded
                  sx={{
                    color: theme.warningIcon,
                    fontSize: 30,
                    mt: 0.2,
                  }}
                />

                <Typography
                  sx={{
                    color: theme.warningText,
                    fontWeight: 850,
                    fontSize: { xs: "0.96rem", md: "1.05rem" },
                    lineHeight: 1.8,
                    fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                  }}
                >
                  कृपया ध्यान दें: यहाँ प्रदर्शित QR कोड अथवा “Pay” बटन के माध्यम से किया गया सहयोग केवल संस्था के लिए मान्य होगा,
                  इसे व्यक्तिगत/नॉमिनी सहयोग के रूप में स्वीकार नहीं किया जाएगा।
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: theme.muted,
                  fontSize: { xs: "0.98rem", md: "1.05rem" },
                  lineHeight: 1.9,
                  fontWeight: 650,
                  fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                  textAlign: { xs: "left", md: "center" },
                  maxWidth: 980,
                  mx: "auto",
                  mb: 4,
                }}
              >
                प्राथमिक-माध्यमिक-उच्च-माध्यमिक शिक्षक संघ, मध्यप्रदेश (PMUMS) एक गैर-लाभकारी, सेवा-आधारित संगठन है।
                <br />
                इस पृष्ठ के माध्यम से आप PMUMS की वेबसाइट संचालन, तकनीकी रखरखाव एवं संगठनात्मक गतिविधियों के लिए स्वेच्छा से आर्थिक सहयोग प्रदान कर सकते हैं।
                <br />
                यह सहयोग पूरी तरह वैकल्पिक है और किसी भी प्रकार की सदस्यता, लाभ या दावा से जुड़ा नहीं है।
              </Typography>

              <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      minHeight: 350,
                      borderRadius: "28px",
                      p: { xs: 2.3, md: 3 },
                      background: "#ffffff",
                      border: "1px solid rgba(111, 92, 194, 0.16)",
                      boxShadow: "0 18px 44px rgba(34, 27, 67, 0.10)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Chip
                      label="Scan QR Code"
                      sx={{
                        mb: 2,
                        color: "#ffffff",
                        fontWeight: 900,
                        background: theme.main,
                        border: "1px solid rgba(111, 92, 194, 0.25)",
                        fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                      }}
                    />

                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "24px",
                        background: theme.soft,
                        border: "1px solid rgba(111, 92, 194, 0.14)",
                        boxShadow: "0 12px 32px rgba(34, 27, 67, 0.10)",
                        minWidth: { xs: 250, md: 290 },
                        minHeight: { xs: 250, md: 290 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {loading ? (
                        <CircularProgress sx={{ color: theme.main }} />
                      ) : (
                        <Box
                          component="img"
                          src={resolvedQrUrl}
                          alt="QR Code for Payment"
                          sx={{
                            width: { xs: 230, md: 260 },
                            height: { xs: 230, md: 260 },
                            objectFit: "contain",
                            borderRadius: "18px",
                            display: "block",
                            background: "#ffffff",
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      minHeight: 350,
                      borderRadius: "28px",
                      p: { xs: 2.6, md: 4 },
                      background: theme.softAccent,
                      border: "1px solid rgba(15, 118, 110, 0.16)",
                      boxShadow: "0 18px 44px rgba(34, 27, 67, 0.10)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",

                      "&::before": {
                        content: '""',
                        position: "absolute",
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        right: -70,
                        top: -70,
                        background: "rgba(15, 118, 110, 0.10)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box
                        sx={{
                          width: 66,
                          height: 66,
                          borderRadius: "22px",
                          mx: "auto",
                          mb: 2.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: theme.accent,
                          color: "#ffffff",
                          boxShadow: "0 14px 32px rgba(15, 118, 110, 0.25)",
                        }}
                      >
                        <VolunteerActivismRounded sx={{ fontSize: 36 }} />
                      </Box>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 950,
                          color: theme.dark,
                          mb: 1.5,
                          fontSize: { xs: "1.45rem", md: "1.85rem" },
                          fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                        }}
                      >
                        भुगतान करें
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.muted,
                          mb: 3,
                          fontWeight: 700,
                          fontSize: { xs: "0.94rem", md: "1rem" },
                          fontFamily: "Poppins, Arial, sans-serif",
                        }}
                      >
                        Pay Now by PhonePe, Google Pay or any UPI App
                      </Typography>

                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Payment />}
                        onClick={() =>
                          window.open("https://pages.razorpay.com/pmums", "_blank")
                        }
                        sx={{
                          borderRadius: "15px",
                          px: 4,
                          py: 1.25,
                          color: "#ffffff",
                          fontWeight: 950,
                          fontSize: "1rem",
                          textTransform: "none",
                          fontFamily:
                            "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                          background: theme.accent,
                          boxShadow: "0 14px 32px rgba(15, 118, 110, 0.30)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "#0b5f59",
                            transform: "translateY(-2px)",
                            boxShadow: "0 18px 42px rgba(15, 118, 110, 0.40)",
                          },
                        }}
                      >
                        अभी भुगतान करें (Pay Now)
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default SelfDonationPage;