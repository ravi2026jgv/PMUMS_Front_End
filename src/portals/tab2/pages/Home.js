import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AppRegistrationRounded,
  BusinessCenterRounded,
  CheckCircleRounded,
  Close,
  CurrencyRupeeRounded,
  PaymentsRounded,
  PersonRounded,
  Search,
  VerifiedRounded,
  VolunteerActivismRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

/* =========================================================
   TAB 2 HOME

   IMPORTANT:
   We are NOT touching TAB 1 / Teacher production Home.

   File:
   src/portals/tab2/pages/Home.js
   ========================================================= */

import Layout from "../../../components/Layout/Layout";

/*
 * TAB 2 specific Statistics
 */
import Statistics from "../components/Statistics";

/*
 * Shared functional component.
 * Portal API context keeps TAB1 / TAB2 data isolated.
 */
import DeathCase from "../../../components/DeathCase";

/*
 * IMPORTANT:
 * Use TAB 2 SelfDonation.
 */
import SelfDonation from "../../../components/SelfDonation";

import DeathCaseSupportView from "../../../components/DeathCaseSupportView";

import { useAuth } from "../../../context/AuthContext";

import { usePortal } from "../../../portal/PortalContext";
import Founders from "../components/Founders";
import { publicApi, receiptAPI } from "../../../services/api";

/* =========================================================
   TAB 2 THEME
   ========================================================= */

const TAB2 = {
  darkest: "#082f49",

  dark: "#083344",

  dark2: "#0e4f66",

  main: "#0891b2",

  mainDark: "#0e7490",

  light: "#22d3ee",

  lighter: "#67e8f9",

  blue: "#0284c7",

  soft: "#ecfeff",

  softBlue: "#f0f9ff",

  soft2: "#f8fdff",

  white: "#ffffff",

  text: "#16323d",

  muted: "#546873",

  green: "#15805d",

  greenDark: "#116149",

  red: "#b42318",

  border: "rgba(8,145,178,0.18)",
};

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

/* =========================================================
   COMMON INPUT STYLE
   ========================================================= */

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",

    background: "#ffffff",

    transition: "all 0.25s ease",

    "& fieldset": {
      borderColor: "rgba(8,145,178,0.24)",

      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: "rgba(8,145,178,0.52)",
    },

    "&.Mui-focused fieldset": {
      borderColor: TAB2.main,

      borderWidth: "2px",
    },
  },

  "& .MuiInputBase-input": {
    fontWeight: 700,

    color: TAB2.text,

    fontFamily: FONT,
  },
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Tab2Home = () => {
  const navigate = useNavigate();

  const { path } = usePortal();

  const { isAuthenticated } = useAuth();

  /* =======================================================
     PORTAL HOME CONTENT
     ======================================================= */

  const [homeDisplayContent, setHomeDisplayContent] = useState({
    homeNoticeHtml: "",

    statisticsContentHtml: "",
  });

  /* =======================================================
     PUBLIC MOBILE SEARCH
     ======================================================= */

  const [mobileSearch, setMobileSearch] = useState("");

  const [searchedMember, setSearchedMember] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);

  const [searchError, setSearchError] = useState("");

  /* =======================================================
     ACTIVE SAHYOG POOLS
     ======================================================= */

  const [activePoolAvailable, setActivePoolAvailable] = useState(false);

  const [activePoolLoading, setActivePoolLoading] = useState(true);

  const [activePools, setActivePools] = useState([]);

  /* =======================================================
     UTR
     ======================================================= */

  const [utrDialogOpen, setUtrDialogOpen] = useState(false);

  const [utrSubmitting, setUtrSubmitting] = useState(false);

  const [utrSuccess, setUtrSuccess] = useState("");

  const [utrError, setUtrError] = useState("");

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const [utrForm, setUtrForm] = useState({
    amount: "",

    referenceName: "",

    utrNumber: "",
  });

  /* =======================================================
     LOAD ACTIVE SAHYOG POOLS
     ======================================================= */

  useEffect(() => {
    const loadActivePools = async () => {
      try {
        setActivePoolLoading(true);

        const response = await publicApi.get("/death-cases/public");

        const pools = Array.isArray(response?.data) ? response.data : [];

        setActivePools(pools);

        setActivePoolAvailable(pools.length > 0);
      } catch (error) {
        console.error("Failed to load TAB2 active Sahyog pools:", error);

        setActivePools([]);

        setActivePoolAvailable(false);
      } finally {
        setActivePoolLoading(false);
      }
    };

    loadActivePools();
  }, []);

  /* =======================================================
     LOAD TAB 2 HOME CONTENT
     ======================================================= */

  useEffect(() => {
    const loadHomeDisplayContent = async () => {
      try {
        const response = await publicApi.getHomeDisplayContent();

        setHomeDisplayContent({
          homeNoticeHtml: response?.data?.homeNoticeHtml || "",

          statisticsContentHtml: response?.data?.statisticsContentHtml || "",
        });
      } catch (error) {
        console.error("Failed to load TAB2 home display content:", error);
      }
    };

    loadHomeDisplayContent();
  }, []);

  /* =======================================================
     NAVIGATION
     ======================================================= */

  const handleLogin = () => {
    navigate(path("/login"));
  };

  const handleRegister = () => {
    navigate(path("/register"));
  };

  const handleSahyogClick = () => {
    if (!isAuthenticated) {
      navigate(path("/login"), {
        state: {
          from: {
            pathname: path("/sahyog"),
          },
        },
      });

      return;
    }

    navigate(path("/sahyog"));
  };

  /* =======================================================
     PUBLIC MEMBER LOOKUP
     ======================================================= */

  const handleMobileSearchChange = async (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setMobileSearch(value);

    setSearchedMember(null);

    setSearchError("");

    setUtrSuccess("");

    setUtrError("");

    /*
     * Search only after complete
     * 10 digit mobile number.
     */
    if (value.length !== 10) {
      return;
    }

    /*
     * Public Sahyog lookup is required
     * only while active pool exists.
     */
    if (!activePoolAvailable) {
      setSearchError("अभी कोई सक्रिय सहायता पूल उपलब्ध नहीं है।");

      return;
    }

    try {
      setSearchLoading(true);

      /*
       * IMPORTANT:
       * Keep TAB2 lookup endpoint unchanged.
       */
      const response = await publicApi.get(
        `/users/lookup/filter?mobile=${value}&page=0&size=10`,
      );

      const users = response?.data?.content || [];

      if (!users.length) {
        setSearchError("इस मोबाइल नंबर से कोई सदस्य नहीं मिला।");

        return;
      }

      setSearchedMember(users[0]);
    } catch (error) {
      console.error("TAB2 mobile search failed:", error);

      setSearchError("मोबाइल नंबर से विवरण लोड करने में समस्या हुई।");
    } finally {
      setSearchLoading(false);
    }
  };

  /* =======================================================
     ASSIGNED SAHYOG CASE
     ======================================================= */

  const searchedDeathCase = searchedMember?.assignedDeathCaseId
    ? activePools.find(
        (pool) =>
          String(pool.id) === String(searchedMember.assignedDeathCaseId),
      )
    : null;

  /* =======================================================
     UTR HELPERS
     ======================================================= */

  const maskUtrNumber = (utrNumber) => {
    if (!utrNumber) {
      return null;
    }

    const cleanUtr = utrNumber.trim();

    if (cleanUtr.length <= 4) {
      return "****";
    }

    return `********${cleanUtr.slice(-4)}`;
  };

  const openUtrDialog = () => {
    if (!activePoolAvailable) {
      setUtrError("अभी कोई सक्रिय सहायता पूल उपलब्ध नहीं है।");

      return;
    }

    setUtrForm({
      amount: "",

      referenceName: "",

      utrNumber: "",
    });

    setUtrSuccess("");

    setUtrError("");

    setUtrDialogOpen(true);
  };

  const closeUtrDialog = () => {
    if (utrSubmitting) {
      return;
    }

    setUtrDialogOpen(false);

    setUtrForm({
      amount: "",

      referenceName: "",

      utrNumber: "",
    });
  };

  /* =======================================================
     PUBLIC UTR SUBMISSION
     ======================================================= */

  const handlePublicUtrSubmit = async () => {
    if (!searchedMember?.id) {
      setUtrError("कृपया पहले मोबाइल नंबर से सदस्य खोजें।");

      return;
    }

    const cleanUtrNumber = utrForm.utrNumber?.trim();

    if (!utrForm.amount || !cleanUtrNumber) {
      setUtrError("कृपया राशि और UTR Number भरें।");

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

        referenceName: utrForm.referenceName?.trim() || "",

        utrNumber: cleanUtrNumber,
      });

      setUtrSuccess("UTR सफलतापूर्वक सबमिट हो गया।");

      setSuccessSnackbarOpen(true);

      setSearchedMember((prev) => ({
        ...prev,

        utrUploaded: true,

        latestUtrNumber: maskUtrNumber(cleanUtrNumber),
      }));

      setTimeout(() => {
        closeUtrDialog();
      }, 900);
    } catch (error) {
      console.error("TAB2 public UTR upload failed:", error);

      setUtrError(
        error?.response?.data?.message || "UTR सबमिट करने में त्रुटि हुई।",
      );
    } finally {
      setUtrSubmitting(false);
    }
  };

  /* =========================================================
     UI
     ========================================================= */

  return (
    <Layout>
      {/* =================================================== */}
      {/* TAB 2 HERO
          SAME PAGE COMPOSITION AS TAB 1
      */}
      {/* =================================================== */}

      <Box
        sx={{
          position: "relative",

          overflow: "hidden",

          color: "#ffffff",

          py: {
            xs: 6,
            md: 8,
          },

          background: `
            radial-gradient(
              circle at 15% 20%,
              rgba(103,232,249,0.12),
              transparent 32%
            ),
            radial-gradient(
              circle at 86% 76%,
              rgba(255,255,255,0.07),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              ${TAB2.darkest} 0%,
              ${TAB2.dark} 44%,
              ${TAB2.mainDark} 100%
            )
          `,
        }}
      >
        {/* BACKGROUND DECORATION */}

        <Box
          sx={{
            position: "absolute",

            width: 300,
            height: 300,

            borderRadius: "50%",

            top: "10%",

            left: -160,

            background: "rgba(255,255,255,0.05)",
          }}
        />

        <Box
          sx={{
            position: "absolute",

            width: 250,
            height: 250,

            borderRadius: "50%",

            right: -120,

            bottom: -80,

            background: "rgba(34,211,238,0.08)",
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",

            zIndex: 1,
          }}
        >
          {/* =============================================== */}
          {/* HERO ICON */}
          {/* =============================================== */}

          <Box
            sx={{
              display: "flex",

              justifyContent: "center",

              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,

                borderRadius: "50%",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                color: "#ffffff",

                background: TAB2.mainDark,

                border: "1px solid rgba(255,255,255,0.25)",

                boxShadow: "0 8px 25px rgba(0,0,0,0.22)",
              }}
            >
              <BusinessCenterRounded
                sx={{
                  fontSize: 34,
                }}
              />
            </Box>
          </Box>

          {/* =============================================== */}
          {/* MAIN TITLE */}
          {/* =============================================== */}

          <Typography
            component="h1"
            sx={{
              textAlign: "center",

              color: "#ffffff",

              fontFamily: FONT,

              fontWeight: 900,

              fontSize: {
                xs: "1.9rem",

                sm: "2.45rem",

                md: "3rem",
              },

              lineHeight: 1.25,

              mb: 1,
            }}
          >
            कर्मचारी कल्याण कोष
          </Typography>

          {/* =============================================== */}
          {/* SUB TITLE */}
          {/* =============================================== */}

          <Typography
            sx={{
              textAlign: "center",

              color: TAB2.lighter,

              fontFamily: FONT,

              fontWeight: 700,

              fontSize: {
                xs: "1.05rem",

                sm: "1.28rem",

                md: "1.5rem",
              },

              lineHeight: 1.5,

              mb: 2.3,
            }}
          >
            अन्य समस्त शासकीय विभाग, उपक्रम एवं संस्थान
          </Typography>

          {/* =============================================== */}
          {/* TAG LINE */}
          {/* =============================================== */}

          <Typography
            sx={{
              position: "relative",

              display: "table",

              mx: "auto",

              mb: 4,

              px: {
                xs: 2,
                sm: 4,
              },

              textAlign: "center",

              color: "rgba(255,255,255,0.88)",

              fontFamily: FONT,

              fontStyle: "italic",

              fontWeight: 500,

              fontSize: {
                xs: "0.92rem",

                md: "1.08rem",
              },

              "&::before, &::after": {
                content: '""',

                position: "absolute",

                top: "50%",

                width: {
                  xs: 18,
                  sm: 35,
                },

                height: "1px",

                background: "rgba(103,232,249,0.55)",
              },

              "&::before": {
                left: {
                  xs: -15,
                  sm: -35,
                },
              },

              "&::after": {
                right: {
                  xs: -15,
                  sm: -35,
                },
              },
            }}
          >
            "सामूहिक सहयोग — संकट की घड़ी में परिवार का संबल"
          </Typography>

          {/* =============================================== */}
          {/* DESCRIPTION CARD
              SAME POSITION / CONCEPT AS TAB 1
          */}
          {/* =============================================== */}

          <Paper
            elevation={0}
            sx={{
              position: "relative",

              overflow: "hidden",

              background: "#ffffff",

              border: "1px solid rgba(255,255,255,0.28)",

              borderRadius: {
                xs: 4,
                md: 5,
              },

              p: {
                xs: 3,
                md: 4,
              },

              mb: 3.5,

              color: TAB2.text,

              boxShadow: "0 18px 48px rgba(0,0,0,0.20)",

              "&::before": {
                content: '""',

                position: "absolute",

                top: 0,
                left: 0,
                right: 0,

                height: "6px",

                background: `linear-gradient(
                    90deg,
                    ${TAB2.mainDark},
                    ${TAB2.main},
                    ${TAB2.light}
                  )`,
              },
            }}
          >
            {/* ================================================= */}
{/* ADMIN MANAGED RED BOX / HERO CONTENT */}
{/* statisticsContentHtml comes from Admin Portal */}
{/* ================================================= */}

{homeDisplayContent.statisticsContentHtml ? (
  <Box
    sx={{
      maxWidth: 980,
      mx: 'auto',

      color: '#374151',

      fontFamily: FONT,

      fontSize: {
        xs: '0.95rem',
        md: '1.07rem',
      },

      fontWeight: 600,
      lineHeight: 1.85,

      textAlign: 'center',

      /*
       * Admin editor may save:
       * p, strong, b, br, ul, li etc.
       */

      '& p': {
        marginTop: 0,
        marginBottom: '14px',
      },

      '& p:last-child': {
        marginBottom: 0,
      },

      '& strong, & b': {
        color: TAB2.dark,
        fontWeight: 900,
      },

      '& ul, & ol': {
        maxWidth: 850,
        mx: 'auto',
        textAlign: 'left',
        pl: 3,
      },

      '& li': {
        mb: 0.7,
      },

      '& a': {
        color: TAB2.mainDark,
        fontWeight: 800,
      },
    }}
    dangerouslySetInnerHTML={{
      __html:
        homeDisplayContent.statisticsContentHtml,
    }}
  />
) : (
  /*
   * Fallback only.
   * This appears until Admin content is configured.
   */
  <Box
    sx={{
      maxWidth: 980,
      mx: 'auto',
      textAlign: 'center',

      color: '#374151',

      fontFamily: FONT,

      fontSize: {
        xs: '0.95rem',
        md: '1.07rem',
      },

      fontWeight: 600,
      lineHeight: 1.85,
    }}
  >
    <Typography
      component="div"
      sx={{
        font: 'inherit',
        color: 'inherit',
        lineHeight: 'inherit',
      }}
    >
      <strong
        style={{
          color: TAB2.dark,
        }}
      >
        कर्मचारी कल्याण कोष
      </strong>{' '}

      मध्य प्रदेश के शिक्षा एवं जनजातीय कार्य विभाग को
      छोड़कर अन्य समस्त शासकीय विभागों, निगम-मंडलों,
      उपक्रमों, संस्थानों, बैंकों एवं अन्य पात्र
      व्यवस्थाओं में कार्यरत कर्मचारियों को सामूहिक
      सहयोग से जोड़ने का प्रयास है।

      <br />
      <br />

      नियमित अधिकारी एवं कर्मचारी, संविदा कर्मचारी,
      आउटसोर्स कर्मचारी, कंप्यूटर ऑपरेटर, आई.टी.
      कर्मचारी, आंगनवाड़ी कार्यकर्ता एवं सहायिका तथा
      अन्य पात्र कर्मचारी इस समूह के अंतर्गत निःशुल्क
      पंजीयन कर सकते हैं।

      <br />
      <br />

      <strong
        style={{
          color: TAB2.greenDark,
        }}
      >
        पंजीयन पूर्णतः निःशुल्क रहेगा।
      </strong>
    </Typography>
  </Box>
)}

            <Stack
              direction="row"
              spacing={0.8}
              justifyContent="center"
              alignItems="center"
              sx={{
                mt: 2.2,
              }}
            >
              <VerifiedRounded
                sx={{
                  color: TAB2.green,

                  fontSize: 21,
                }}
              />

              <Typography
                sx={{
                  color: TAB2.greenDark,

                  fontFamily: FONT,

                  fontWeight: 900,

                  fontSize: "0.86rem",
                }}
              >
                पंजीयन पूर्णतः निःशुल्क रहेगा।
              </Typography>
            </Stack>
          </Paper>
{/* ================================================= */}
{/* ELIGIBLE EMPLOYEE CATEGORIES */}
{/* ================================================= */}

<Box
  sx={{
    maxWidth: 980,
    mx: 'auto',
    mb: 3.5,
  }}
>
  <Paper
    elevation={0}
    sx={{
      position: 'relative',
      overflow: 'hidden',

      p: {
        xs: 2.4,
        sm: 3,
        md: 3.5,
      },

      borderRadius: {
        xs: 3.5,
        md: 4,
      },

      background:
        'linear-gradient(135deg, rgba(236,254,255,0.98) 0%, rgba(240,249,255,0.98) 100%)',

      border:
        '1px solid rgba(103,232,249,0.30)',

      boxShadow:
        '0 14px 38px rgba(0,0,0,0.16)',

      '&::before': {
        content: '""',

        position: 'absolute',

        top: 0,
        left: 0,

        width: '100%',
        height: 5,

        background: `linear-gradient(
          90deg,
          ${TAB2.mainDark},
          ${TAB2.main},
          ${TAB2.light}
        )`,
      },
    }}
  >
    {/* TOP INTRO */}

    <Box
      sx={{
        textAlign: 'center',
        mb: 2.5,
      }}
    >
      <Typography
        sx={{
          color: TAB2.dark,

          fontFamily: FONT,

          fontWeight: 900,

          fontSize: {
            xs: '1rem',
            sm: '1.08rem',
            md: '1.15rem',
          },

          lineHeight: 1.7,
        }}
      >
        शिक्षा एवं जनजातीय कार्य विभाग को छोड़कर अन्य सभी
        विभागों एवं संस्थानों के कर्मचारी यहाँ रजिस्ट्रेशन करें।
      </Typography>

      <Typography
        sx={{
          mt: 1,

          color: TAB2.mainDark,

          fontFamily: FONT,

          fontWeight: 900,

          fontSize: {
            xs: '0.9rem',
            md: '1rem',
          },
        }}
      >
        इस श्रेणी में शामिल हैं—
      </Typography>
    </Box>

    {/* ELIGIBILITY LIST */}

    <Grid
      container
      spacing={1.5}
    >
      {[
        'समस्त नियमित अधिकारी एवं कर्मचारी',

        'संविदा अधिकारी एवं कर्मचारी',

        'आउटसोर्स कर्मचारी',

        'कंप्यूटर ऑपरेटर एवं आई.टी. कर्मचारी',

        'आंगनवाड़ी कार्यकर्ता एवं सहायिका',

        'अन्य अस्थाई कर्मचारी',

        'विभागीय अथवा संस्थागत व्यवस्था के अंतर्गत कार्यरत अन्य कर्मचारी',
      ].map((item) => (
        <Grid
          key={item}
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Box
            sx={{
              height: '100%',

              display: 'flex',

              alignItems: 'flex-start',

              gap: 1.1,

              p: 1.5,

              borderRadius: 2.5,

              bgcolor: '#ffffff',

              border:
                `1px solid ${TAB2.border}`,

              boxShadow:
                '0 6px 18px rgba(8,47,73,0.05)',
            }}
          >
            <CheckCircleRounded
              sx={{
                mt: '2px',

                color: TAB2.green,

                fontSize: 20,

                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                color: TAB2.text,

                fontFamily: FONT,

                fontSize: {
                  xs: '0.82rem',
                  md: '0.88rem',
                },

                fontWeight: 700,

                lineHeight: 1.6,
              }}
            >
              {item}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>

    {/* BOTTOM REGISTRATION MESSAGE */}

    <Stack
      direction="row"
      spacing={0.8}
      justifyContent="center"
      alignItems="center"
      sx={{
        mt: 2.4,

        p: 1.3,

        borderRadius: 2.5,

        bgcolor: 'rgba(21,128,93,0.08)',

        border:
          '1px solid rgba(21,128,93,0.16)',
      }}
    >
      <VerifiedRounded
        sx={{
          color: TAB2.green,

          fontSize: 21,

          flexShrink: 0,
        }}
      />

      <Typography
        sx={{
          color: TAB2.greenDark,

          fontFamily: FONT,

          fontWeight: 900,

          fontSize: {
            xs: '0.8rem',
            md: '0.9rem',
          },

          textAlign: 'center',
        }}
      >
        पात्र कर्मचारी निःशुल्क Registration करके कर्मचारी
        कल्याण कोष से जुड़ सकते हैं।
      </Typography>
    </Stack>
  </Paper>
</Box>
          {/* =============================================== */}
          {/* LOGIN / REGISTRATION
              SAME POSITION AS TAB 1 HERO ACTIONS
          */}
          {/* =============================================== */}

          {!isAuthenticated && (
            <Stack
              direction={{
                xs: "column",

                sm: "row",
              }}
              spacing={1.5}
              justifyContent="center"
              sx={{
                mb: activePoolAvailable ? 4 : 0,
              }}
            >
              <Button
                variant="contained"
                startIcon={<PersonRounded />}
                onClick={handleLogin}
                sx={{
                  minWidth: 150,

                  minHeight: 48,

                  px: 4,

                  borderRadius: 3,

                  color: "#ffffff",

                  bgcolor: TAB2.mainDark,

                  border: "1px solid rgba(255,255,255,0.25)",

                  fontFamily: FONT,

                  fontWeight: 900,

                  textTransform: "none",

                  boxShadow: "0 10px 25px rgba(0,0,0,0.20)",

                  transition: "all 0.25s ease",

                  "&:hover": {
                    bgcolor: TAB2.main,

                    transform: "translateY(-2px)",
                  },
                }}
              >
                Login
              </Button>

              <Button
                variant="contained"
                startIcon={<AppRegistrationRounded />}
                onClick={handleRegister}
                sx={{
                  minWidth: 190,

                  minHeight: 48,

                  px: 4,

                  borderRadius: 3,

                  color: TAB2.dark,

                  bgcolor: "#a5f3fc",

                  fontFamily: FONT,

                  fontWeight: 900,

                  textTransform: "none",

                  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",

                  transition: "all 0.25s ease",

                  "&:hover": {
                    bgcolor: "#cffafe",

                    transform: "translateY(-2px)",
                  },
                }}
              >
                Registration
              </Button>
            </Stack>
          )}

          {/* =============================================== */}
          {/* PUBLIC MOBILE LOOKUP
              SAME AREA AS TAB 1
          */}
          {/* =============================================== */}

          {!isAuthenticated && !activePoolLoading && activePoolAvailable && (
            <Paper
              elevation={0}
              sx={{
                maxWidth: 850,

                mx: "auto",

                p: {
                  xs: 2.2,

                  md: 3,
                },

                borderRadius: 4,

                background: "rgba(8,47,73,0.92)",

                border: "1px solid rgba(103,232,249,0.30)",

                boxShadow: "0 18px 46px rgba(0,0,0,0.28)",

                backdropFilter: "blur(10px)",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{
                  mb: 0.8,
                }}
              >
                <Search
                  sx={{
                    color: TAB2.lighter,
                  }}
                />

                <Typography
                  sx={{
                    color: TAB2.lighter,

                    fontWeight: 900,

                    fontSize: {
                      xs: "1.02rem",

                      md: "1.18rem",
                    },

                    fontFamily: FONT,

                    textAlign: "center",
                  }}
                >
                  मोबाइल नंबर से सहयोग विवरण खोजें
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "#e0faff",

                  fontWeight: 600,

                  mb: 2,

                  fontFamily: FONT,

                  textAlign: "center",

                  fontSize: {
                    xs: "0.82rem",

                    md: "0.9rem",
                  },

                  lineHeight: 1.65,
                }}
              >
                10 अंकों का मोबाइल नंबर दर्ज करें। संबंधित सहायता प्रकरण, QR एवं
                UTR Upload विकल्प नीचे दिखाई देगा।
              </Typography>

              <TextField
                fullWidth
                value={mobileSearch}
                onChange={handleMobileSearchChange}
                placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
                inputProps={{
                  maxLength: 10,

                  inputMode: "numeric",
                }}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{
                          color: TAB2.main,
                        }}
                      />
                    </InputAdornment>
                  ),

                  endAdornment: searchLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress
                        size={22}
                        sx={{
                          color: TAB2.main,
                        }}
                      />
                    </InputAdornment>
                  ) : null,
                }}
              />

              {searchError && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,

                    borderRadius: 3,
                  }}
                >
                  {searchError}
                </Alert>
              )}

              {searchedMember && (
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  {searchedMember.utrUploaded ? (
                    <Alert
                      severity="success"
                      sx={{
                        borderRadius: 3,

                        fontWeight: 800,
                      }}
                    >
                      इस सदस्य का UTR पहले से जमा हो चुका है
                      {searchedMember.latestUtrNumber
                        ? ` - ${searchedMember.latestUtrNumber}`
                        : ""}
                      .
                    </Alert>
                  ) : searchedDeathCase ? (
                    <DeathCaseSupportView
                      deathCase={searchedDeathCase}
                      showAssignedBadge={false}
                      uploadButtonText="UTR Upload करें"
                      onUploadClick={openUtrDialog}
                      onQrError={(message) => setUtrError(message)}
                    />
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{
                        borderRadius: 3,

                        fontWeight: 800,
                      }}
                    >
                      इस सदस्य के लिए सहायता प्रकरण मिला, लेकिन उसका पूरा विवरण
                      लोड नहीं हो पाया।
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
          )}
        </Container>
      </Box>

      {/* =================================================== */}
      {/* SAHYOG CARD
          SAME SECTION ORDER AS TAB 1
      */}
      {/* =================================================== */}

      {!isAuthenticated && (
        <Box
          sx={{
            py: {
              xs: 5,

              md: 7,
            },

            background: TAB2.soft,

            position: "relative",

            overflow: "hidden",
          }}
        >
          <Container maxWidth="lg">
            <Card
              elevation={0}
              sx={{
                borderRadius: {
                  xs: 4,

                  md: 6,
                },

                border: `1px solid ${TAB2.border}`,

                background: "#ffffff",

                boxShadow: "0 24px 70px rgba(8,47,73,0.12)",

                overflow: "hidden",

                position: "relative",

                "&::before": {
                  content: '""',

                  position: "absolute",

                  top: 0,

                  left: 0,

                  right: 0,

                  height: "7px",

                  background: `linear-gradient(
                      90deg,
                      ${TAB2.dark},
                      ${TAB2.main},
                      ${TAB2.light}
                    )`,
                },

                "&::after": {
                  content: '""',

                  position: "absolute",

                  width: 220,

                  height: 220,

                  borderRadius: "50%",

                  right: -100,

                  bottom: -120,

                  background: "rgba(34,211,238,0.08)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 3,

                    md: 5,
                  },

                  textAlign: "center",

                  position: "relative",

                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 58,

                    height: 58,

                    mx: "auto",

                    mb: 1.5,

                    borderRadius: "50%",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    color: "#ffffff",

                    bgcolor: TAB2.green,

                    boxShadow: "0 10px 25px rgba(21,128,93,0.22)",
                  }}
                >
                  <VolunteerActivismRounded
                    sx={{
                      fontSize: 30,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: TAB2.dark,

                    fontFamily: FONT,

                    fontWeight: 900,

                    fontSize: {
                      xs: "1.6rem",

                      md: "2.1rem",
                    },

                    lineHeight: 1.3,
                  }}
                >
                  संकटग्रस्त परिवार के लिए सहयोग
                </Typography>

                <Box
                  sx={{
                    width: 90,

                    height: 5,

                    borderRadius: 99,

                    mx: "auto",

                    mt: 1.5,

                    mb: 3,

                    background: TAB2.main,
                  }}
                />

                {homeDisplayContent.homeNoticeHtml ? (
                  <Box
                    sx={{
                      color: TAB2.muted,

                      lineHeight: 1.85,

                      fontWeight: 650,

                      fontSize: {
                        xs: "0.95rem",

                        md: "1.05rem",
                      },

                      maxWidth: 900,

                      mx: "auto",

                      mb: 3,

                      fontFamily: FONT,

                      "& a": {
                        color: TAB2.mainDark,

                        fontWeight: 900,

                        textDecoration: "none",
                      },

                      "& b, & strong": {
                        color: TAB2.dark,

                        fontWeight: 900,
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: homeDisplayContent.homeNoticeHtml,
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: TAB2.muted,

                      lineHeight: 1.85,

                      fontWeight: 650,

                      fontSize: {
                        xs: "0.95rem",

                        md: "1.05rem",
                      },

                      maxWidth: 900,

                      mx: "auto",

                      mb: 3,

                      fontFamily: FONT,
                    }}
                  >
                    कर्मचारी कल्याण कोष के माध्यम से सक्रिय सहायता प्रकरण में
                    संबंधित संकटग्रस्त कर्मचारी परिवार को सामूहिक सहयोग प्रदान
                    किया जा सकता है।
                  </Typography>
                )}

                <Button
                  variant="contained"
                  startIcon={<VolunteerActivismRounded />}
                  onClick={handleSahyogClick}
                  sx={{
                    borderRadius: 3,

                    px: 4,

                    py: 1.25,

                    color: "#ffffff",

                    fontFamily: FONT,

                    fontWeight: 900,

                    fontSize: "1rem",

                    textTransform: "none",

                    bgcolor: TAB2.green,

                    boxShadow: "0 12px 28px rgba(21,128,93,0.24)",

                    transition: "all 0.3s ease",

                    "&:hover": {
                      bgcolor: TAB2.greenDark,

                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  सहयोग करें
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      )}

      {/* =================================================== */}
      {/* OBJECTIVE
          SAME STYLE / POSITION AS TAB 1
      */}
      {/* =================================================== */}

      <Box
        sx={{
          py: {
            xs: 5,

            md: 7,
          },

          background: TAB2.soft,

          position: "relative",

          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              position: "relative",

              overflow: "hidden",

              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fdff 55%, #ecfeff 100%)",

              border: `1px solid ${TAB2.border}`,

              borderRadius: {
                xs: 4,

                md: 6,
              },

              p: {
                xs: 3,

                sm: 4,

                md: 5,
              },

              color: TAB2.text,

              boxShadow: "0 24px 70px rgba(8,47,73,0.10)",

              "&::before": {
                content: '""',

                position: "absolute",

                top: 0,
                left: 0,
                right: 0,

                height: "7px",

                background: `linear-gradient(
                    90deg,
                    ${TAB2.dark},
                    ${TAB2.main},
                    ${TAB2.light}
                  )`,
              },

              "&::after": {
                content: '""',

                position: "absolute",

                width: 220,

                height: 220,

                borderRadius: "50%",

                right: -90,

                bottom: -100,

                background: "rgba(34,211,238,0.08)",
              },
            }}
          >
            <Box
              sx={{
                position: "relative",

                zIndex: 1,

                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: TAB2.dark,

                  fontWeight: 900,

                  mb: 1.5,

                  fontSize: {
                    xs: "1.35rem",

                    sm: "1.6rem",

                    md: "2rem",
                  },

                  lineHeight: 1.3,

                  fontFamily: FONT,
                }}
              >
                कर्मचारी कल्याण कोष का उद्देश्य
              </Typography>

              <Box
                sx={{
                  width: 90,

                  height: 5,

                  borderRadius: 99,

                  mx: "auto",

                  mb: 3,

                  background: `linear-gradient(
                      90deg,
                      ${TAB2.dark},
                      ${TAB2.main}
                    )`,
                }}
              />

              <Typography
                sx={{
                  color: "#374151",

                  fontSize: {
                    xs: "0.96rem",

                    md: "1.08rem",
                  },

                  lineHeight: 1.9,

                  fontWeight: 600,

                  fontFamily: FONT,

                  textAlign: "center",

                  maxWidth: 980,

                  mx: "auto",

                  "& strong": {
                    color: TAB2.dark,

                    fontWeight: 900,
                  },
                }}
              >
                <strong>कर्मचारी कल्याण कोष</strong> का उद्देश्य शिक्षा एवं
                जनजातीय कार्य विभाग के अतिरिक्त मध्य प्रदेश के अन्य सभी शासकीय
                विभागों, निगम-मंडलों, उपक्रमों, बैंकों तथा संस्थागत व्यवस्थाओं
                में कार्यरत पात्र कर्मचारियों को एक पारदर्शी एवं सामूहिक सहयोग
                व्यवस्था से जोड़ना है।
                <br />
                <br />
                इस व्यवस्था का मूल उद्देश्य यह है कि किसी कर्मचारी के परिवार पर
                आकस्मिक संकट आने की स्थिति में वह स्वयं को अकेला न महसूस करे और
                पंजीकृत सदस्य समय पर सामूहिक सहयोग के माध्यम से उस परिवार का
                आर्थिक एवं मानवीय संबल बनें।
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* =================================================== */}
      {/* LOGGED-IN ASSIGNED SAHYOG CASE */}
      {/* =================================================== */}

      {isAuthenticated && <DeathCase />}

      {/* =================================================== */}
      {/* TAB 2 STATISTICS */}
      {/* =================================================== */}

      <Statistics />

      {/* =================================================== */}
      {/* PMUMS LEADERSHIP / FOUNDERS */}
      {/* =================================================== */}

      <Founders />

      {/* =================================================== */}
      {/* TAB 2 SELF DONATION */}
      {/* =================================================== */}

      <Box
        sx={{
          background: TAB2.soft,
        }}
      >
        <SelfDonation />
      </Box>
      {/* =================================================== */}
      {/* UTR DIALOG */}
      {/* =================================================== */}

      <Dialog
        open={utrDialogOpen}
        onClose={utrSubmitting ? undefined : closeUtrDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "28px",

            overflow: "hidden",

            border: `1px solid ${TAB2.border}`,

            boxShadow: "0 28px 80px rgba(8,47,73,0.24)",

            background: "rgba(255,255,255,0.98)",

            position: "relative",
          },
        }}
      >
        {/* =============================================== */}
        {/* DIALOG HEADER */}
        {/* =============================================== */}

        <DialogTitle
          sx={{
            p: 0,

            position: "relative",

            color: "#ffffff",

            overflow: "hidden",

            background: `linear-gradient(
                135deg,
                ${TAB2.dark},
                ${TAB2.mainDark},
                ${TAB2.main}
              )`,
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

              background: "rgba(103,232,249,0.14)",
            }}
          />

          <Box
            sx={{
              p: {
                xs: 2.5,

                md: 3,
              },

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
              <PaymentsRounded
                sx={{
                  fontSize: 36,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontWeight: 900,

                fontSize: {
                  xs: "1.25rem",

                  md: "1.45rem",
                },

                fontFamily: FONT,
              }}
            >
              UTR विवरण जमा करें
            </Typography>

            <Typography
              sx={{
                mt: 0.8,

                color: "rgba(255,255,255,0.86)",

                fontWeight: 600,

                fontSize: "0.88rem",

                fontFamily: FONT,
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

              color: "#ffffff",

              background: "rgba(255,255,255,0.14)",

              zIndex: 2,

              "&:hover": {
                background: "rgba(255,255,255,0.22)",
              },
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        {/* =============================================== */}
        {/* DIALOG CONTENT */}
        {/* =============================================== */}

        <DialogContent
          sx={{
            mt: 2,

            px: {
              xs: 2.5,

              md: 3.5,
            },

            py: {
              xs: 3,

              md: 3.5,
            },

            background: "linear-gradient(180deg, #ffffff 0%, #f8fdff 100%)",
          }}
        >
          {/* SEARCHED MEMBER */}

          {searchedMember && (
            <Paper
              elevation={0}
              sx={{
                mb: 2.5,

                p: 2,

                borderRadius: "18px",

                background: TAB2.soft,

                border: `1px solid ${TAB2.border}`,
              }}
            >
              <Chip
                label="Member Details"
                size="small"
                sx={{
                  mb: 1.2,

                  color: TAB2.dark,

                  fontWeight: 900,

                  background: "#cffafe",

                  border: `1px solid ${TAB2.border}`,

                  fontFamily: FONT,
                }}
              />

              <Typography
                sx={{
                  mb: 0.7,

                  color: TAB2.muted,

                  fontWeight: 700,

                  fontSize: "0.86rem",

                  fontFamily: FONT,
                }}
              >
                <strong>सदस्य:</strong> {searchedMember.name}{" "}
                {searchedMember.surname}
              </Typography>

              <Typography
                sx={{
                  mb: 0.7,

                  color: TAB2.muted,

                  fontWeight: 700,

                  fontSize: "0.86rem",

                  fontFamily: FONT,
                }}
              >
                <strong>यूजर आईडी:</strong> {searchedMember.id || "N/A"}
              </Typography>

              <Typography
                sx={{
                  mb: 0.7,

                  color: TAB2.muted,

                  fontWeight: 700,

                  fontSize: "0.86rem",

                  fontFamily: FONT,
                }}
              >
                <strong>मोबाइल:</strong>{" "}
                {searchedMember.mobileNumber || mobileSearch}
              </Typography>

              <Typography
                sx={{
                  color: TAB2.muted,

                  fontWeight: 700,

                  fontSize: "0.86rem",

                  fontFamily: FONT,
                }}
              >
                <strong>सहायता प्रकरण:</strong>{" "}
                {searchedMember.assignedDeathCaseName || "N/A"}
              </Typography>
            </Paper>
          )}

          {/* ERROR */}

          {utrError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,

                borderRadius: "16px",

                fontWeight: 700,
              }}
            >
              {utrError}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* AMOUNT */}

            <Grid
              size={{
                xs: 12,

                sm: 6,
              }}
            >
              <Typography
                sx={{
                  color: TAB2.dark,

                  fontWeight: 900,

                  mb: 0.8,

                  fontSize: "0.92rem",

                  fontFamily: FONT,
                }}
              >
                राशि (₹) *
              </Typography>

              <TextField
                fullWidth
                type="number"
                value={utrForm.amount}
                onChange={(event) =>
                  setUtrForm((prev) => ({
                    ...prev,

                    amount: event.target.value,
                  }))
                }
                disabled={utrSubmitting}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeRounded
                        sx={{
                          color: TAB2.main,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* REFERENCE NAME */}

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Typography
                sx={{
                  color: TAB2.dark,

                  fontWeight: 900,

                  mb: 0.8,

                  fontSize: "0.92rem",

                  fontFamily: FONT,
                }}
              >
                Reference Name (Optional)
              </Typography>

              <TextField
                fullWidth
                value={utrForm.referenceName}
                onChange={(event) =>
                  setUtrForm((prev) => ({
                    ...prev,

                    referenceName: event.target.value,
                  }))
                }
                disabled={utrSubmitting}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded
                        sx={{
                          color: TAB2.main,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* UTR NUMBER */}

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Typography
                sx={{
                  color: TAB2.dark,

                  fontWeight: 900,

                  mb: 0.8,

                  fontSize: "0.92rem",

                  fontFamily: FONT,
                }}
              >
                UTR Number *
              </Typography>

              <TextField
                fullWidth
                value={utrForm.utrNumber}
                onChange={(event) =>
                  setUtrForm((prev) => ({
                    ...prev,

                    utrNumber: event.target.value,
                  }))
                }
                disabled={utrSubmitting}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentsRounded
                        sx={{
                          color: TAB2.main,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* SUCCESS */}

          {utrSuccess && (
            <Alert
              severity="success"
              sx={{
                mt: 2.5,

                borderRadius: "16px",

                fontWeight: 700,
              }}
            >
              {utrSuccess}
            </Alert>
          )}
        </DialogContent>

        {/* =============================================== */}
        {/* DIALOG ACTIONS */}
        {/* =============================================== */}

        <DialogActions
          sx={{
            px: {
              xs: 2.5,

              md: 3.5,
            },

            pb: 3,

            pt: 0,

            background: "#f8fdff",
          }}
        >
          <Button
            onClick={closeUtrDialog}
            disabled={utrSubmitting}
            sx={{
              color: TAB2.muted,

              fontWeight: 900,

              borderRadius: "14px",

              px: 2.5,

              textTransform: "none",

              fontFamily: FONT,
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

              minWidth: 145,

              color: "#ffffff",

              fontWeight: 900,

              textTransform: "none",

              fontFamily: FONT,

              background: `linear-gradient(
                  135deg,
                  ${TAB2.mainDark},
                  ${TAB2.main}
                )`,

              boxShadow: "0 12px 28px rgba(8,145,178,0.24)",

              "&:hover": {
                background: `linear-gradient(
                    135deg,
                    ${TAB2.dark},
                    ${TAB2.mainDark}
                  )`,

                transform: "translateY(-1px)",
              },

              "&:disabled": {
                background: "#94d8e5",

                color: "#ffffff",
              },
            }}
          >
            {utrSubmitting ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{
                    mr: 1,

                    color: "#ffffff",
                  }}
                />
                Submitting...
              </>
            ) : (
              <>
                <PaymentsRounded
                  sx={{
                    mr: 1,

                    fontSize: 20,
                  }}
                />
                Submit UTR
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================== */}
      {/* SUCCESS SNACKBAR */}
      {/* =================================================== */}

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "bottom",

          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessSnackbarOpen(false)}
          sx={{
            width: "100%",

            fontWeight: 800,
          }}
        >
          UTR सफलतापूर्वक सबमिट हो गया।
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Tab2Home;
