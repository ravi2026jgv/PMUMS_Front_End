import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import { publicAPI } from "../services/api";

const theme = {
  dark: "#3b0764",
  main: "#6d28d9",
  light: "#a855f7",
  gold: "#facc15",
  soft: "#f5f3ff",
  softGold: "#fffbeb",
  text: "#4c1d95",
  muted: "#5b5b6b",
};

const SbiInsuranceSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpenForm = () => {
    setShowForm(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyDigits,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (
      !formData.name.trim() ||
      !formData.district.trim() ||
      !formData.mobileNumber.trim()
    ) {
      setErrorMessage("कृपया सभी जानकारी भरें।");
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      setErrorMessage("मोबाइल नंबर 10 अंकों का होना चाहिए।");
      return;
    }

    try {
      setLoading(true);

      const response = await publicAPI.submitInsuranceInquiry({
        name: formData.name.trim(),
        district: formData.district.trim(),
        mobileNumber: formData.mobileNumber.trim(),
      });

      setSuccessMessage(
        response?.data?.message || "हमारी टीम जल्द ही आपसे सम्पर्क करेगी।"
      );

      setFormData({
        name: "",
        district: "",
        mobileNumber: "",
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "फॉर्म सबमिट नहीं हो पाया। कृपया पुनः प्रयास करें।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Card
          sx={{
            borderRadius: { xs: "28px", md: "38px" },
            overflow: "hidden",
            border: "1px solid rgba(124, 58, 237, 0.15)",
            boxShadow: "0 28px 80px rgba(76, 29, 149, 0.13)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(16px)",
            position: "relative",

            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 7,
              background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
            },

            "&::after": {
              content: '""',
              position: "absolute",
              width: 270,
              height: 270,
              borderRadius: "50%",
              right: -120,
              bottom: -140,
              background: "rgba(250, 204, 21, 0.14)",
            },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 5 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box textAlign="center" mb={{ xs: 3.5, md: 5 }}>
              <Typography
                variant="overline"
                sx={{
                  color: theme.main,
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  fontSize: "0.82rem",
                }}
              >
                SBI LIFE INSURANCE
              </Typography>

              <Typography
                variant="h4"
                component="h2"
                sx={{
                  mt: 0.7,
                  color: theme.dark,
                  fontWeight: 950,
                  fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                  fontSize: { xs: "1.75rem", md: "2.45rem" },
                  lineHeight: 1.3,
                }}
              >
                अपनी आय की सुरक्षा के लिए SBI Life Insurance चुनें।
              </Typography>

              <Box
                sx={{
                  width: 95,
                  height: 5,
                  borderRadius: 99,
                  mx: "auto",
                  mt: 2,
                  background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
                }}
              />
            </Box>

            <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "28px",
                    p: { xs: 2, md: 2.5 },
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)",
                    border: "1px solid rgba(124, 58, 237, 0.16)",
                    boxShadow: "0 18px 44px rgba(76, 29, 149, 0.10)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src="/SBI.jpeg"
                    alt="SBI Life Insurance"
                    sx={{
                      width: "100%",
                      height: { xs: 240, sm: 310, md: 360 },
                      objectFit: "cover",
                      borderRadius: "24px",
                      border: "1px solid rgba(124, 58, 237, 0.14)",
                      boxShadow: "0 14px 34px rgba(76, 29, 149, 0.12)",
                      background: "#fff",
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "28px",
                    p: { xs: 2.6, md: 4 },
                    background:
                      "linear-gradient(135deg, rgba(245,243,255,0.96), rgba(255,255,255,0.96))",
                    border: "1px solid rgba(124, 58, 237, 0.16)",
                    boxShadow: "0 18px 44px rgba(76, 29, 149, 0.10)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",

                    "&::before": {
                      content: '""',
                      position: "absolute",
                      width: 160,
                      height: 160,
                      borderRadius: "50%",
                      right: -75,
                      top: -75,
                      background: "rgba(168, 85, 247, 0.12)",
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
                        background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                        color: "#fff",
                        boxShadow: "0 14px 32px rgba(124, 58, 237, 0.25)",
                      }}
                    >
                      <ShieldRoundedIcon sx={{ fontSize: 36 }} />
                    </Box>

                    <Chip
                      label="Family Protection"
                      sx={{
                        mb: 2,
                        color: theme.dark,
                        fontWeight: 900,
                        background: "#fffbeb",
                        border: "1px solid rgba(250, 204, 21, 0.35)",
                      }}
                    />

                    <Typography
                      sx={{
                        color: theme.muted,
                        mb: 3,
                        fontSize: { xs: "0.98rem", md: "1.06rem" },
                        lineHeight: 1.9,
                        fontWeight: 700,
                        maxWidth: 560,
                        mx: "auto",
                        fontFamily:
                          "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                      }}
                    >
                      अपने और अपने परिवार के भविष्य को सुरक्षित बनाने के लिए SBI
                      Life Insurance से जुड़ें। यदि आप बीमा योजना चुनना चाहते हैं,
                      तो नीचे दिए गए बटन पर क्लिक करके अपनी जानकारी साझा करें।
                    </Typography>

                    <Button
                      type="button"
                      onClick={handleOpenForm}
                      startIcon={<ContactPhoneRoundedIcon />}
                      sx={{
                        px: 4,
                        py: 1.25,
                        borderRadius: "15px",
                        background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: 950,
                        textTransform: "none",
                        boxShadow: "0 14px 32px rgba(109, 40, 217, 0.30)",
                        fontFamily:
                          "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
                          transform: "translateY(-2px)",
                          boxShadow:
                            "0 18px 42px rgba(109, 40, 217, 0.40)",
                        },
                      }}
                    >
                      बीमा चुनने वाले यहाँ क्लिक करें
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Dialog
        open={showForm}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "28px",
            overflow: "hidden",
            border: "1px solid rgba(124, 58, 237, 0.16)",
            boxShadow: "0 28px 80px rgba(76, 29, 149, 0.22)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 950,
            color: theme.dark,
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
            position: "relative",
            pt: 3,
            pb: 1,
            background:
              "linear-gradient(180deg, rgba(245,243,255,0.95), rgba(255,255,255,1))",
          }}
        >
          बीमा जानकारी फॉर्म

          <IconButton
            onClick={handleCloseForm}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: theme.text,
              background: "rgba(124, 58, 237, 0.08)",
              "&:hover": {
                background: "rgba(124, 58, 237, 0.14)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            px: { xs: 2.5, md: 3.5 },
            pb: 3.5,
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: theme.muted,
              mb: 3,
              fontSize: "0.96rem",
              fontWeight: 700,
              fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
            }}
          >
            हमारी टीम जल्द ही आपसे सम्पर्क करेगी।
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 4,
            }}
          >
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                {errorMessage}
              </Alert>
            )}

            <TextField
              fullWidth
              label="नाम"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label="जिला"
              name="district"
              value={formData.district}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <TextField
              fullWidth
              label="मोबाइल नंबर"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ maxLength: 10 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.35,
                borderRadius: "15px",
                background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                fontSize: "1rem",
                fontWeight: 950,
                textTransform: "none",
                boxShadow: "0 12px 28px rgba(109, 40, 217, 0.28)",
                fontFamily:
                  "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
                },
              }}
            >
              {loading ? "सबमिट हो रहा है..." : "सबमिट"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SbiInsuranceSection;