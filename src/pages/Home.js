import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import {
  Search,
  Close,
  UploadFileRounded,
  QrCode2Rounded,
  PersonSearchRounded,
  PaymentsRounded,
  CurrencyRupeeRounded,
  ReceiptLongRounded,
  PersonRounded
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import HeroBanner from "../components/HeroBanner";
import Statistics from "../components/Statistics";
import Founders from "../components/Founders";
import DeathCase from "../components/DeathCase";
import { useAuth } from "../context/AuthContext";
import SelfDonation from "../components/SelfDonation";
import SbiInsuranceSection from "../components/SbiInsuranceSection";
import { publicApi, receiptAPI, FILE_BASE_URL } from "../services/api";
const theme = {
  dark: "#221b43",
  main: "#6f5cc2",
  light: "#b9a7ff",
  accent: "#0f766e",
  soft: "#f4f2fb",
  soft2: "#ffffff",
  softAccent: "#eef8f7",
  text: "#221b43",
  muted: "#374151",
  green: "#0f766e",
  red: "#b42318"
};
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "#ffffff",
    transition: "all 0.25s ease",
    "& fieldset": {
      borderColor: "rgba(111, 92, 194, 0.22)",
      borderWidth: "1px"
    },
    "&:hover fieldset": {
      borderColor: "rgba(111, 92, 194, 0.48)"
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.main,
      borderWidth: "2px"
    }
  },
  "& .MuiInputBase-input": {
    fontWeight: 700,
    color: theme.text,
    fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
  }
};
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [homeDisplayContent, setHomeDisplayContent] = useState({
    homeNoticeHtml: "",
    statisticsContentHtml: "",
  });
const [mobileSearch, setMobileSearch] = useState("");
const [searchedMember, setSearchedMember] = useState(null);
const [searchLoading, setSearchLoading] = useState(false);
const [searchError, setSearchError] = useState("");
const [activePoolAvailable, setActivePoolAvailable] = useState(false);
const [activePoolLoading, setActivePoolLoading] = useState(true);
const [utrDialogOpen, setUtrDialogOpen] = useState(false);
const [utrForm, setUtrForm] = useState({
  amount: "",
  referenceName: "",
  utrNumber: ""
});
const [utrSubmitting, setUtrSubmitting] = useState(false);
const [utrSuccess, setUtrSuccess] = useState("");
const [utrError, setUtrError] = useState("");
  const handleSahyogClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/sahyog" } } });
      return;
    }

    navigate("/sahyog");
  };
const getQrImageUrl = (qrPath) => {
  if (!qrPath) return "";

  if (qrPath.startsWith("http://") || qrPath.startsWith("https://")) {
    return qrPath;
  }

  return `${FILE_BASE_URL}${qrPath.startsWith("/") ? qrPath : `/${qrPath}`}`;
};
useEffect(() => {
  const loadActivePools = async () => {
    try {
      setActivePoolLoading(true);

      const response = await publicApi.get("/death-cases/public");
      const activePools = Array.isArray(response?.data) ? response.data : [];

      setActivePoolAvailable(activePools.length > 0);
    } catch (error) {
      console.error("Failed to load active death case pools:", error);
      setActivePoolAvailable(false);
    } finally {
      setActivePoolLoading(false);
    }
  };

  loadActivePools();
}, []);

const handleMobileSearchChange = async (event) => {
  const value = event.target.value.replace(/\D/g, "").slice(0, 10);

  setMobileSearch(value);
  setSearchedMember(null);
  setSearchError("");
  setUtrSuccess("");
  setUtrError("");

  if (value.length !== 10) {
    return;
  }
if (!activePoolAvailable) {
  setSearchError("अभी कोई सक्रिय मृत्यु सहायता पूल उपलब्ध नहीं है।");
  return;
}

  try {
    setSearchLoading(true);

    const response = await publicApi.get(
      `/users/filter?mobile=${value}&page=0&size=10`
    );

    const users = response?.data?.content || [];

    if (!users.length) {
      setSearchError("इस मोबाइल नंबर से कोई सदस्य नहीं मिला।");
      return;
    }

    setSearchedMember(users[0]);
  } catch (error) {
    console.error("Mobile search failed:", error);
    setSearchError("मोबाइल नंबर से विवरण लोड करने में समस्या हुई।");
  } finally {
    setSearchLoading(false);
  }
};

const openUtrDialog = () => {
   if (!activePoolAvailable) {
    setUtrError("अभी कोई सक्रिय मृत्यु सहायता पूल उपलब्ध नहीं है।");
    return;
  }
  setUtrForm({
    amount: "",
    referenceName: "",
    utrNumber: ""
  });
  setUtrSuccess("");
  setUtrError("");
  setUtrDialogOpen(true);
};

const closeUtrDialog = () => {
  if (utrSubmitting) return;

  setUtrDialogOpen(false);
  setUtrForm({
    amount: "",
    referenceName: "",
    utrNumber: ""
  });
};

const handlePublicUtrSubmit = async () => {
  if (!searchedMember?.id) {
    setUtrError("कृपया पहले मोबाइल नंबर से सदस्य खोजें।");
    return;
  }

  if (!utrForm.amount || !utrForm.referenceName || !utrForm.utrNumber) {
    setUtrError("कृपया सभी UTR विवरण भरें।");
    return;
  }

  try {
    setUtrSubmitting(true);
    setUtrError("");
    setUtrSuccess("");

    await receiptAPI.uploadPublicReceipt({
      userId: searchedMember.id,
      mobileNumber: searchedMember.mobileNumber || mobileSearch,
      amount: Number(utrForm.amount),
      referenceName: utrForm.referenceName,
      utrNumber: utrForm.utrNumber
    });

    setUtrSuccess("UTR सफलतापूर्वक सबमिट हो गया।");

    setSearchedMember((prev) => ({
      ...prev,
      utrUploaded: true,
      latestUtrNumber: utrForm.utrNumber
    }));

    setTimeout(() => {
      closeUtrDialog();
    }, 900);
  } catch (error) {
    console.error("Public UTR upload failed:", error);
    setUtrError(error?.response?.data?.message || "UTR सबमिट करने में त्रुटि हुई।");
  } finally {
    setUtrSubmitting(false);
  }
};
  useEffect(() => {
    const loadHomeDisplayContent = async () => {
      try {
        const response = await publicApi.getHomeDisplayContent();

        setHomeDisplayContent({
          homeNoticeHtml: response?.data?.homeNoticeHtml || "",
          statisticsContentHtml: response?.data?.statisticsContentHtml || "",
        });
      } catch (error) {
        console.error("Failed to load home display content:", error);
      }
    };

    loadHomeDisplayContent();
  }, []);

  return (
    <Layout>
      <HeroBanner />

      <Statistics />

      {/* SAHYOG CARD: ONLY WHEN LOGGED OUT */}
      {!isAuthenticated && (
        <Box
          sx={{
            py: { xs: 5, md: 7 },
            background: '#342c60',
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container maxWidth="lg">
            <Card
              sx={{
                borderRadius: { xs: 4, md: 6 },
              border: "1px solid rgba(200, 191, 255, 0.28)",
background: "#ffffff",
boxShadow: "0 28px 80px rgba(0, 0, 0, 0.22)",
                overflow: "hidden",
                position: "relative",

              }}
            >
              <CardContent
                sx={{
                  p: { xs: 3, md: 5 },
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: theme.dark,
                    mb: 1.5,
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                    fontSize: { xs: "1.7rem", md: "2.25rem" },
                    lineHeight: 1.25,
                  }}
                >
                  नोमिनी के लिए सहयोग
                </Typography>

                <Box
                  sx={{
                    width: 90,
                    height: 5,
                    borderRadius: 99,
                    mx: "auto",
                    mb: 3,
                    background: '#6f5cc2',
                  }}
                />

                <Box
                  sx={{
                    color: theme.muted,
                    lineHeight: 1.85,
                    fontWeight: 700,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    maxWidth: 900,
                    mx: "auto",
                    mb: 3,
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",

                   "& a": {
  color: theme.accent,
  fontWeight: 800,
  textDecoration: "none",
  borderBottom: "1px solid rgba(15, 118, 110, 0.35)",
},

                    "& b, & strong": {
                      color: theme.dark,
                      fontWeight: 900,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: homeDisplayContent.homeNoticeHtml || "",
                  }}
                />
    {!activePoolLoading && activePoolAvailable && (            
<Paper
  elevation={0}
  sx={{
    maxWidth: 850,
    mx: "auto",
    mb: 3,
    p: { xs: 2, md: 3 },
    borderRadius: 4,
   background: theme.soft,
border: "1px solid rgba(111, 92, 194, 0.18)",
boxShadow: "0 18px 46px rgba(34, 27, 67, 0.10)"
  }}
>
  <Typography
    sx={{
      color: theme.dark,
      fontWeight: 950,
      mb: 1,
      fontSize: { xs: "1.05rem", md: "1.2rem" },
      fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
    }}
  >
    मोबाइल नंबर से सहयोग विवरण खोजें
  </Typography>

  <Typography
    sx={{
      color: theme.muted,
      fontWeight: 700,
      mb: 2,
      fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
    }}
  >
    10 अंकों का मोबाइल नंबर दर्ज करें। विवरण, QR और UTR Upload विकल्प नीचे दिखाई देगा।
  </Typography>

  <TextField
    fullWidth
    value={mobileSearch}
    onChange={handleMobileSearchChange}
    placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
    inputProps={{ maxLength: 10 }}
    sx={inputSx}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search sx={{ color: theme.main }} />
        </InputAdornment>
      ),
      endAdornment: searchLoading ? (
        <InputAdornment position="end">
          <CircularProgress size={22} sx={{ color: theme.main }} />
        </InputAdornment>
      ) : null
    }}
  />

  {searchError && (
    <Alert severity="warning" sx={{ mt: 2, borderRadius: 3 }}>
      {searchError}
    </Alert>
  )}

 {searchedMember && (
  <Card
    elevation={0}
    sx={{
      mt: 3,
      borderRadius: 5,
      overflow: "hidden",
    border: "1px solid rgba(111, 92, 194, 0.16)",
background: "#ffffff",
boxShadow: "0 22px 58px rgba(34, 27, 67, 0.12)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
background: theme.main      }
    }}
  >
    <CardContent sx={{ p: { xs: 2.2, md: 3 } }}>
      <Grid container spacing={3} alignItems="stretch">
        {/* LEFT MEMBER DETAILS */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              height: "100%",
              p: { xs: 2, md: 2.5 },
              borderRadius: 4,
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(124, 58, 237, 0.12)"
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mb: 2.2
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
background: theme.main,
boxShadow: "0 12px 28px rgba(111, 92, 194, 0.25)"
,                    color: "#fff",
                  }}
                >
                  <PersonSearchRounded sx={{ fontSize: 30 }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 950,
                      fontSize: { xs: "1.15rem", md: "1.35rem" },
                      lineHeight: 1.25,
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    {searchedMember.name || ""} {searchedMember.surname || ""}
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.muted,
                      fontWeight: 750,
                      fontSize: "0.9rem",
                      mt: 0.3,
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    सदस्य विवरण
                  </Typography>
                </Box>
              </Box>

              {searchedMember.utrUploaded ? (
                <Chip
                  label={`UTR जमा हो चुका है${
                    searchedMember.latestUtrNumber
                      ? ` - ${searchedMember.latestUtrNumber}`
                      : ""
                  }`}
                  sx={{
                    color: "#166534",
                    fontWeight: 950,
                    background: "rgba(22, 163, 74, 0.12)",
                    border: "1px solid rgba(22, 163, 74, 0.24)",
                    borderRadius: "12px",
                    height: 34,
                    fontFamily:
                      "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                  }}
                />
              ) : (
                <Chip
                  label="UTR Pending"
                  sx={{
                    color: "#991b1b",
                    fontWeight: 950,
                    background: "rgba(220, 38, 38, 0.10)",
                    border: "1px solid rgba(220, 38, 38, 0.20)",
                    borderRadius: "12px",
                    height: 34,
                    fontFamily:
                      "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                  }}
                />
              )}
            </Box>

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 1.6,
                    borderRadius: 3,
                    background: theme.soft,
border: "1px solid rgba(111, 92, 194, 0.14)"                  }}
                >
                  <Typography
                    sx={{
                      color: theme.muted,
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      mb: 0.4,
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    यूजर आईडी
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 950,
                      fontSize: "0.98rem",
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    {searchedMember.id || "N/A"}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 1.6,
                    borderRadius: 3,
background: theme.softAccent,
border: "1px solid rgba(15, 118, 110, 0.16)"                  }}
                >
                  <Typography
                    sx={{
                      color: theme.muted,
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      mb: 0.4,
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    मोबाइल नंबर
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 500,
                      fontSize: "0.98rem",
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    {searchedMember.mobileNumber || mobileSearch}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 1.6,
                    borderRadius: 3,
                  background: theme.soft,
border: "1px solid rgba(111, 92, 194, 0.14)"
}}
                >
                  <Typography
                    sx={{
                      color: theme.muted,
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      mb: 0.4,
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    मृत्यु प्रकरण
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.dark,
                      fontWeight: 950,
                      fontSize: "0.98rem",
                      lineHeight: 1.5,
                      fontFamily:
                        "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                    }}
                  >
                    {searchedMember.assignedDeathCaseName || "N/A"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {!searchedMember.utrUploaded && (
              <Box
                sx={{
                  mt: 2.5,
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" }
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<UploadFileRounded />}
                  onClick={openUtrDialog}
                  sx={{
                    borderRadius: "16px",
                    px: 3.2,
                    py: 1.15,
                    color: "#fff",
                    fontWeight: 950,
                    textTransform: "none",
                    fontFamily:
                      "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                   background: theme.red,
boxShadow: "0 14px 32px rgba(180, 35, 24, 0.25)",
"&:hover": {
  background: "#8f1d14",
  transform: "translateY(-1px)",
  boxShadow: "0 18px 42px rgba(180, 35, 24, 0.32)"
}
                  }}
                >
                  UTR Upload करें
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* RIGHT QR SECTION */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              height: "100%",
              minHeight: 250,
              p: { xs: 2, md: 2.5 },
              borderRadius: 4,
background: theme.softAccent,
border: "1px solid rgba(15, 118, 110, 0.16)",              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center"
            }}
          >
            {!searchedMember.utrUploaded && searchedMember.allocatedQrCode ? (
              <Box>
                <Box
                  sx={{
                    width: 184,
                    height: 184,
                    mx: "auto",
                    mb: 1.6,
                    p: 1.4,
                    borderRadius: "26px",
                    background: "#fff",
border: "1px solid rgba(111, 92, 194, 0.16)",
boxShadow: "0 18px 42px rgba(34, 27, 67, 0.12)"                  }}
                >
                  <Box
                    component="img"
                    src={getQrImageUrl(searchedMember.allocatedQrCode)}
                    alt="Assigned QR"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "18px"
                    }}
                  />
                </Box>

                <Chip
                  icon={<QrCode2Rounded />}
                  label="QR Scan करके भुगतान करें"
                  sx={{
                   color: "#ffffff",
fontWeight: 900,
background: theme.accent,
border: "1px solid rgba(15, 118, 110, 0.25)",
                    borderRadius: "14px",
                    fontFamily:
                      "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                   "& .MuiChip-icon": {
  color: "#ffffff"
}
                  }}
                />
              </Box>
            ) : (
              <Box>
                <Box
                  sx={{
                    width: 82,
                    height: 82,
                    mx: "auto",
                    mb: 1.5,
                    borderRadius: "26px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(15, 118, 110, 0.10)",
color: theme.accent
                  }}
                >
                  <QrCode2Rounded sx={{ fontSize: 48 }} />
                </Box>

                <Typography
                  sx={{
                    color: theme.dark,
                    fontWeight: 950,
                    mb: 0.5,
                    fontFamily:
                      "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                  }}
                >
                  QR उपलब्ध नहीं
                </Typography>

                <Typography
                  sx={{
                    color: theme.muted,
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    lineHeight: 1.5,
                    fontFamily:
                      "Noto Sans Devanagari, Poppins, Arial, sans-serif"
                  }}
                >
                  QR Code उपलब्ध होने पर यहाँ दिखाई देगा।
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)}
</Paper>
)}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={handleSahyogClick}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.25,
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: "1rem",
                      textTransform: "none",
                      background: '#0f7633',
                      boxShadow: "0 12px 28px rgba(109, 40, 217, 0.28)",
                      transition: "all 0.3s ease",

                      '&:hover': {
    background: '#0b5f59',
    borderColor: '#0b5f59',
    boxShadow: '0 10px 24px rgba(15, 118, 110, 0.45)',
    transform: 'translateY(-2px)'
  },
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

      {/* ASSIGNED POOL SECTION: ONLY WHEN LOGGED IN */}
      {isAuthenticated && <DeathCase />}

      <Founders />

      <Box
        sx={{
          background:'#eef8f7',
        }}
      >
        <SelfDonation />
      </Box>

            <Box
        sx={{
          background: '#eef8f7',
          position: "relative",
          overflow: "hidden",
        }}
      >
        <SbiInsuranceSection />
      </Box>

     <Dialog
  open={utrDialogOpen}
  onClose={utrSubmitting ? undefined : closeUtrDialog}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: "28px",
      overflow: "hidden",
      border: "1px solid rgba(124, 58, 237, 0.16)",
      boxShadow: "0 28px 80px rgba(76, 29, 149, 0.22)",
      background: "rgba(255,255,255,0.96)",
      position: "relative"
    }
  }}
>
  <DialogTitle
    sx={{
      p: 0,
      position: "relative",
      background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
      color: "#fff",
      overflow: "hidden"
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
        background: "rgba(250, 204, 21, 0.16)"
      }}
    />

    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        textAlign: "center",
        position: "relative",
        zIndex: 1
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
          color: theme.gold
        }}
      >
        <PaymentsRounded sx={{ fontSize: 36 }} />
      </Box>

      <Typography
        sx={{
          fontWeight: 950,
          fontSize: { xs: "1.25rem", md: "1.45rem" },
          fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
        }}
      >
        UTR विवरण जमा करें
      </Typography>

      <Typography
        sx={{
          mt: 0.8,
          color: "rgba(255,255,255,0.86)",
          fontWeight: 650,
          fontSize: "0.92rem",
          fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
        }}
      >
        कृपया राशि, Reference Name और UTR Number सही भरें
      </Typography>
    </Box>

    <IconButton
      onClick={closeUtrDialog}
      disabled={utrSubmitting}
      sx={{
        position: "absolute",
        right: 12,
        top: 12,
        color: "#fff",
        background: "rgba(255,255,255,0.14)",
        zIndex: 2,
        "&:hover": {
          background: "rgba(255,255,255,0.22)"
        }
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent
    sx={{
      marginTop:2,
      px: { xs: 2.5, md: 3.5 },
      py: { xs: 3, md: 3.5 },
      background: `
        radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.10), transparent 32%),
        linear-gradient(180deg, #ffffff 0%, #fbfaff 100%)
      `
    }}
  >
    {searchedMember && (
      <Paper
        elevation={0}
        sx={{
          mb: 2.5,
          p: 2,
          borderRadius: "18px",
          background:
            "linear-gradient(135deg, rgba(255,251,235,0.92), rgba(255,255,255,0.90))",
          border: "1px solid rgba(250, 204, 21, 0.35)"
        }}
      >
        <Chip
          label="Member Details"
          size="small"
          sx={{
            mb: 1.2,
            color: theme.dark,
            fontWeight: 900,
            background: "#fffbeb",
            border: "1px solid rgba(250, 204, 21, 0.35)",
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        />

        <Typography
          variant="body2"
          sx={{
            mb: 0.7,
            color: theme.muted,
            fontWeight: 750,
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          <strong>यूजर:</strong> {searchedMember.name} {searchedMember.surname}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 0.7,
            color: theme.muted,
            fontWeight: 750,
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          <strong>यूजर आईडी:</strong> {searchedMember.id || "N/A"}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 0.7,
            color: theme.muted,
            fontWeight: 750,
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          <strong>मोबाइल:</strong> {searchedMember.mobileNumber || mobileSearch}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.muted,
            fontWeight: 750,
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          <strong>मृत्यु प्रकरण:</strong>{" "}
          {searchedMember.assignedDeathCaseName || "N/A"}
        </Typography>
      </Paper>
    )}

    {utrError && (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: "16px",
          fontWeight: 700
        }}
      >
        {utrError}
      </Alert>
    )}

    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}>
        <Typography
          variant="body2"
          sx={{
            color: theme.dark,
            fontWeight: 900,
            mb: 0.8,
            display: "block",
            fontSize: "0.94rem",
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          राशि (₹) *
        </Typography>

        <TextField
          fullWidth
          type="number"
          value={utrForm.amount}
          onChange={(e) =>
            setUtrForm((prev) => ({ ...prev, amount: e.target.value }))
          }
          disabled={utrSubmitting}
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupeeRounded sx={{ color: theme.main }} />
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="body2"
          sx={{
            color: theme.dark,
            fontWeight: 900,
            mb: 0.8,
            display: "block",
            fontSize: "0.94rem",
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          Reference Name *
        </Typography>

        <TextField
          fullWidth
          value={utrForm.referenceName}
          onChange={(e) =>
            setUtrForm((prev) => ({
              ...prev,
              referenceName: e.target.value
            }))
          }
          disabled={utrSubmitting}
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRounded sx={{ color: theme.main }} />
              </InputAdornment>
            )
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="body2"
          sx={{
            color: theme.dark,
            fontWeight: 900,
            mb: 0.8,
            display: "block",
            fontSize: "0.94rem",
            fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
          }}
        >
          UTR Number *
        </Typography>

        <TextField
          fullWidth
          value={utrForm.utrNumber}
          onChange={(e) =>
            setUtrForm((prev) => ({ ...prev, utrNumber: e.target.value }))
          }
          disabled={utrSubmitting}
          sx={inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ReceiptLongRounded sx={{ color: theme.main }} />
              </InputAdornment>
            )
          }}
        />
      </Grid>
    </Grid>

    {utrSuccess && (
      <Alert
        severity="success"
        sx={{
          mt: 2.5,
          borderRadius: "16px",
          fontWeight: 700
        }}
      >
        {utrSuccess}
      </Alert>
    )}
  </DialogContent>

  <DialogActions
    sx={{
      px: { xs: 2.5, md: 3.5 },
      pb: 3,
      pt: 0,
      background: "#fbfaff"
    }}
  >
    <Button
      onClick={closeUtrDialog}
      disabled={utrSubmitting}
      sx={{
        color: theme.muted,
        fontWeight: 900,
        borderRadius: "14px",
        px: 2.5,
        textTransform: "none",
        fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif"
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handlePublicUtrSubmit}
      disabled={utrSubmitting}
      sx={{
        borderRadius: "14px",
        px: 3,
        py: 1,
        fontWeight: 950,
        textTransform: "none",
        fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
        background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
        boxShadow: "0 12px 28px rgba(109, 40, 217, 0.28)",
        "&:hover": {
          background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
          transform: "translateY(-1px)"
        },
        "&:disabled": {
          background: "#c4b5fd",
          color: "#fff"
        }
      }}
    >
      {utrSubmitting ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
          Submitting...
        </>
      ) : (
        <>
          <UploadFileRounded sx={{ mr: 1 }} />
          Submit UTR
        </>
      )}
    </Button>
  </DialogActions>
</Dialog>
    </Layout> );
};

export default Home;