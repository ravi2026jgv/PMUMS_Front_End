import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Paper,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Upload,
  CheckCircle,
  CloseRounded,
  PaymentsRounded,
  CurrencyRupeeRounded,
  ReceiptLongRounded,
  PersonRounded,
} from "@mui/icons-material";
import api from "../services/api";

const theme = {
  dark: "#221b43",
  main: "#6f5cc2",
  light: "#b9a7ff",
  accent: "#0f766e",
  soft: "#f4f2fb",
  softAccent: "#eef8f7",
  text: "#221b43",
  muted: "#4b5563",
  green: "#0f766e",
  border: "#ded8f5",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#ffffff",
    transition: "all 0.25s ease",
    "& fieldset": {
      borderColor: "rgba(111, 92, 194, 0.22)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(111, 92, 194, 0.48)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.main,
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    fontWeight: 700,
    color: theme.text,
    fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
  },
};

const FieldLabel = ({ children }) => (
  <Typography
    variant="body2"
    sx={{
      color: theme.dark,
      fontWeight: 700,
      mb: 0.8,
      display: "block",
      fontSize: "0.94rem",
      fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
    }}
  >
    {children}
  </Typography>
);

const ReceiptUpload = ({ open, onClose, donationInfo }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [assignedPool, setAssignedPool] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    referenceName: "",
    utrNumber: "",
  });

  useEffect(() => {
    const loadAssignedPool = async () => {
      if (!open) return;

      try {
        setError("");
        const res = await api.get("/pools/my");
        setAssignedPool(res.data || null);
      } catch (e) {
        setAssignedPool(null);
        setError(
          e.response?.data?.message ||
            "Assigned pool load नहीं हो पाया। कृपया पुनः प्रयास करें।"
        );
      }
    };

    loadAssignedPool();
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpload = async () => {
    if (!formData.amount || !formData.utrNumber) {
      setError("कृपया सभी आवश्यक फील्ड भरें (Amount + UTR)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const requestData = {
        amount: parseFloat(formData.amount),
        referenceName: formData.referenceName || null,
        utrNumber: formData.utrNumber,
      };

      const response = await api.post("/receipts", requestData);

      if (response.status === 200 || response.status === 201) {
        setUploadSuccess(true);

        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || "अपलोड में त्रुटि हुई। कृपया पुनः प्रयास करें।"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      referenceName: "",
      utrNumber: "",
    });
    setUploadSuccess(false);
    setError("");
    setUploading(false);
    setAssignedPool(null);
    onClose?.();
  };

  const displayCaseId = assignedPool?.id ?? donationInfo?.caseId ?? null;

  const displayName =
    assignedPool?.deceasedName ||
    assignedPool?.nominee1Name ||
    donationInfo?.beneficiaryName ||
    "";

  const displayRegNo =
    assignedPool?.employeeCode || donationInfo?.registrationNumber || "";

  return (
    <Dialog
      open={open}
      onClose={uploading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "28px",
          overflow: "hidden",
          border: "1px solid rgba(111, 92, 194, 0.16)",
          boxShadow: "0 28px 80px rgba(34, 27, 67, 0.22)",
          background: "#ffffff",
          position: "relative",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          position: "relative",
          background: theme.dark,
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(185, 167, 255, 0.16)",
          }}
        />

        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "22px",
              mx: "auto",
              mb: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#ffffff",
            }}
          >
            <PaymentsRounded sx={{ fontSize: 36 }} />
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              color:"#fff",
              fontSize: { xs: "1.25rem", md: "1.45rem" },
              fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
            }}
          >
            पेमेंट की जानकारी दर्ज करें
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              color: "rgba(255,255,255,0.88)",
              fontWeight: 500,
              fontSize: "0.92rem",
              fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
            }}
          >
            कृपया Amount और UTR Number सही भरें
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          disabled={uploading}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#ffffff",
            background: "rgba(255,255,255,0.14)",
            zIndex: 2,
            "&:hover": {
              background: "rgba(255,255,255,0.22)",
            },
          }}
        >
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          marginTop: 2,
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          background: "#ffffff",
        }}
      >
        {uploadSuccess ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box
              sx={{
                width: 82,
                height: 82,
                borderRadius: "28px",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                background: theme.accent,
                boxShadow: "0 16px 38px rgba(15, 118, 110, 0.28)",
              }}
            >
              <CheckCircle sx={{ fontSize: 48 }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: theme.dark,
                fontWeight: 950,
                fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
              }}
            >
              पेमेंट की जानकारी सफलतापूर्वक दर्ज हो गई!
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: theme.muted,
                fontWeight: 700,
                fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
              }}
            >
              धन्यवाद! आपका योगदान दर्ज हो गया है।
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: theme.dark,
                  fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                }}
              >
                पेमेंट की जानकारी
              </Typography>

              {(displayCaseId || displayName || displayRegNo) && (
                <Paper
                  elevation={0}
                  sx={{
                    mb: 2.5,
                    p: 2,
                    borderRadius: "18px",
                    background: theme.soft,
                    border: "1px solid rgba(111, 92, 194, 0.16)",
                  }}
                >
                  <Chip
                    label="Assigned Support Case"
                    size="small"
                    sx={{
                      mb: 1.2,
                      color: "#ffffff",
                      fontWeight: 700,
                      background: theme.main,
                      border: "1px solid rgba(111, 92, 194, 0.25)",
                      fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                    }}
                  />

                  <Typography
                    sx={{
                      color: theme.text,
                      fontWeight: 800,
                      lineHeight: 1.7,
                      fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                    }}
                  >
                    {displayCaseId ? (
                      <>
                        डेथ केस ID: {displayCaseId}
                        {displayName ? ` - ${displayName}` : ""}
                        {displayRegNo ? ` (${displayRegNo})` : ""}
                      </>
                    ) : (
                      <>
                        {displayName ? `Name: ${displayName}` : "Details"}
                        {displayRegNo ? ` (${displayRegNo})` : ""}
                      </>
                    )}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FieldLabel>राशि (₹) *</FieldLabel>

              <TextField
                fullWidth
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                disabled={uploading}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeRounded sx={{ color: theme.main }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FieldLabel>UTR संख्या (UTR Number) *</FieldLabel>

              <TextField
                fullWidth
                value={formData.utrNumber}
                onChange={(e) => handleInputChange("utrNumber", e.target.value)}
                disabled={uploading}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptLongRounded sx={{ color: theme.main }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FieldLabel>
                Reference Name (यदि किसी अन्य व्यक्ति के नाम से भुगतान किया हो)
              </FieldLabel>

              <TextField
                fullWidth
                value={formData.referenceName}
                onChange={(e) =>
                  handleInputChange("referenceName", e.target.value)
                }
                disabled={uploading}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded sx={{ color: theme.main }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert
                  severity="error"
                  sx={{
                    mt: 1,
                    borderRadius: "16px",
                    fontWeight: 700,
                  }}
                >
                  {error}
                </Alert>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, md: 3.5 },
          pb: 3,
          pt: 0,
          background: "#ffffff",
        }}
      >
        {!uploadSuccess && (
          <>
            <Button
              onClick={handleClose}
              disabled={uploading}
              sx={{
                color: theme.muted,
                fontWeight: 700,
                borderRadius: "14px",
                px: 2.5,
                textTransform: "none",
                fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
              }}
            >
              रद्द करें
            </Button>

            <Button
              onClick={handleUpload}
              disabled={uploading || !formData.amount || !formData.utrNumber}
              variant="contained"
              sx={{
                borderRadius: "14px",
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
                fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif",
                background:  '#0f7633',
                boxShadow: "0 12px 28px rgba(15, 118, 110, 0.28)",
                "&:hover": {
                  background: "#0b5f59",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "#9ca3af",
                  color: "#ffffff",
                },
              }}
            >
              {uploading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                  सबमिट हो रहा है...
                </>
              ) : (
                <>
                  <Upload sx={{ mr: 1 }} />
                  सबमिट करें
                </>
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReceiptUpload;