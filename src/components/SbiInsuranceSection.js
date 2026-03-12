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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { publicAPI } from "../services/api";

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
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Card
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid #e6ecf5",
            boxShadow: "0 12px 35px rgba(16, 24, 40, 0.08)",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container justifyContent="center">
              <Grid item xs={12} md={10} lg={9}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                    mx: "auto",
                  }}
                >
                  <Typography
                    sx={{
                      display: "inline-block",
                      background: "rgba(25, 118, 210, 0.08)",
                      color: "#1976d2",
                      fontWeight: 700,
                      borderRadius: "999px",
                      px: 2,
                      py: 0.8,
                      mb: 2,
                      fontSize: "0.9rem",
                      fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
                    }}
                  >
                    SBI Life Insurance
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      color: "#173a8a",
                      mb: 2,
                      fontSize: { xs: "1.6rem", md: "2.2rem" },
                      lineHeight: 1.4,
                      fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
                    }}
                  >
                    अपनी आय की सुरक्षा के लिए SBI Life Insurance चुनें।
                  </Typography>

                  <Typography
                    sx={{
                      color: "#4b5563",
                      mb: 3,
                      fontSize: { xs: "1rem", md: "1.05rem" },
                      lineHeight: 1.9,
                      maxWidth: "760px",
                      mx: "auto",
                      fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
                    }}
                  >
                    अपने और अपने परिवार के भविष्य को सुरक्षित बनाने के लिए SBI
                    Life Insurance से जुड़ें। यदि आप बीमा योजना चुनना चाहते हैं,
                    तो नीचे दिए गए बटन पर क्लिक करके अपनी जानकारी साझा करें।
                  </Typography>

                  <Box
                    component="img"
                    src="/SBI.jpeg"
                    alt="SBI Life Insurance"
                    sx={{
                      width: "100%",
                      maxWidth: "850px",
                      maxHeight: 360,
                      objectFit: "cover",
                      borderRadius: 4,
                      border: "1px solid #e5e7eb",
                      mb: 3,
                    }}
                  />

                  <Button
                    type="button"
                    onClick={handleOpenForm}
                    sx={{
                      px: 3.5,
                      py: 1.4,
                      borderRadius: "999px",
                      background:
                        "linear-gradient(135deg, #ff8f1f 0%, #ff6b00 100%)",
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 10px 24px rgba(255, 107, 0, 0.28)",
                      fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #f57c00 0%, #e65100 100%)",
                      },
                    }}
                  >
                    बीमा चुनने वाले यहाँ क्लिक करें
                  </Button>
                </Box>
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
            borderRadius: 4,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 800,
            color: "#173a8a",
            fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
            position: "relative",
            pb: 1,
          }}
        >
          बीमा जानकारी फॉर्म

          <IconButton
            onClick={handleCloseForm}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#6b7280",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              textAlign: "center",
              color: "#6b7280",
              mb: 3,
              fontSize: "0.95rem",
              fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
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
              p: { xs: 1, md: 2 },
            }}
          >
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
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
            />

            <TextField
              fullWidth
              label="जिला"
              name="district"
              value={formData.district}
              onChange={handleChange}
              margin="normal"
              required
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #1976d2 0%, #1257a6 100%)",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(25, 118, 210, 0.25)",
                fontFamily: "Noto Sans Devanagari, Arial, sans-serif",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
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