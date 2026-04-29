import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  LoginRounded,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout/Layout";

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

const inputSx = {
  mb: 3,
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.92)",
    transition: "all 0.25s ease",
    "& fieldset": {
      borderColor: "rgba(124, 58, 237, 0.18)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(124, 58, 237, 0.40)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.main,
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    fontWeight: 650,
    color: theme.text,
  },
  "& .MuiFormHelperText-root": {
    fontWeight: 600,
  },
};

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const redirectTo =
    location.state?.from?.pathname ||
    location.state?.from ||
    "/";

  const onSubmit = async (data) => {
    try {
      setError("");

      const credentials = {
        userId: data.employeeId,
        password: data.password,
      };

      await login(credentials);

      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
    } catch (err) {
      let errorMessage = "लॉगिन में त्रुटि हुई है";

      if (err.response?.status === 403) {
        errorMessage = "लॉगिन की अनुमति नहीं है। कृपया अपनी ID और पासवर्ड जाँच लें।";
      } else if (err.response?.status === 401) {
        errorMessage = "गलत ID या पासवर्ड। कृपया पुनः कोशिश करें।";
      }

      setError(err.response?.data?.message || errorMessage);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "calc(100vh - 160px)",
          py: { xs: 6, md: 9 },
          display: "flex",
          alignItems: "center",
          background: `
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.13), transparent 30%),
            radial-gradient(circle at bottom right, rgba(250, 204, 21, 0.16), transparent 32%),
            linear-gradient(180deg, #ffffff 0%, #fbfaff 45%, #f5f3ff 100%)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            top: -170,
            left: -130,
            background: "rgba(124, 58, 237, 0.10)",
            filter: "blur(8px)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 310,
            height: 310,
            borderRadius: "50%",
            right: -120,
            bottom: -140,
            background: "rgba(250, 204, 21, 0.16)",
            filter: "blur(10px)",
          }}
        />

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 4.5 },
              borderRadius: { xs: "28px", md: "36px" },
              background: "rgba(255,255,255,0.84)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(124, 58, 237, 0.16)",
              boxShadow: "0 30px 90px rgba(76, 29, 149, 0.16)",
              position: "relative",
              overflow: "hidden",

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
                width: 220,
                height: 220,
                borderRadius: "50%",
                right: -100,
                bottom: -120,
                background: "rgba(250, 204, 21, 0.14)",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "24px",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                    color: "#fff",
                    boxShadow: "0 14px 32px rgba(124, 58, 237, 0.26)",
                  }}
                >
                  <LoginRounded sx={{ fontSize: 38 }} />
                </Box>

                <Typography
                  variant="overline"
                  sx={{
                    color: theme.main,
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    fontSize: "0.82rem",
                  }}
                >
                  PMUMS MEMBER LOGIN
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    mt: 0.7,
                    fontWeight: 950,
                    color: theme.dark,
                    mb: 1.2,
                    fontSize: { xs: "2rem", md: "2.65rem" },
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  Login
                </Typography>

                <Box
                  sx={{
                    width: 90,
                    height: 5,
                    borderRadius: 99,
                    mx: "auto",
                    mb: 2,
                    background: `linear-gradient(90deg, ${theme.main}, ${theme.light}, ${theme.gold})`,
                  }}
                />

                <Typography
                  sx={{
                    color: theme.muted,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    fontWeight: 700,
                    lineHeight: 1.7,
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                  }}
                >
                  Enter the details to login to your account
                </Typography>

                <Chip
                  label="Registration Number required"
                  sx={{
                    mt: 2,
                    color: theme.dark,
                    fontWeight: 900,
                    background: "#fffbeb",
                    border: "1px solid rgba(250, 204, 21, 0.35)",
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                  }}
                />
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "16px",
                    fontWeight: 700,
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontWeight: 900,
                    color: theme.dark,
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                  }}
                >
                  Registration Number
                </Typography>

                <TextField
                  fullWidth
                  type="text"
                  placeholder="Enter Registration Number"
                  {...register("employeeId", {
                    required: "Registration Number is required",
                  })}
                  error={!!errors.employeeId}
                  helperText={errors.employeeId?.message}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: theme.main }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    fontWeight: 900,
                    color: theme.dark,
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                  }}
                >
                  Password
                </Typography>

                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password", { required: "पासवर्ड आवश्यक है" })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    ...inputSx,
                    mb: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: theme.main }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: theme.text,
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ textAlign: "right", mb: 3 }}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{
                      color: theme.main,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      "&:hover": {
                        color: theme.dark,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.45,
                    mb: 3,
                    fontSize: "1.05rem",
                    fontWeight: 950,
                    borderRadius: "15px",
                    textTransform: "none",
                    background: `linear-gradient(135deg, ${theme.main}, ${theme.light})`,
                    boxShadow: "0 14px 32px rgba(109, 40, 217, 0.30)",
                    transition: "all 0.3s ease",
                    fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",

                    "&:hover": {
                      background: `linear-gradient(135deg, ${theme.dark}, ${theme.main})`,
                      transform: "translateY(-2px)",
                      boxShadow: "0 18px 42px rgba(109, 40, 217, 0.40)",
                    },

                    "&:disabled": {
                      background: "#c4b5fd",
                      color: "#fff",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                </Button>

                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, rgba(245,243,255,0.85), rgba(255,255,255,0.88))",
                    border: "1px solid rgba(124, 58, 237, 0.12)",
                  }}
                >
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{
                      color: theme.main,
                      textDecoration: "none",
                      fontSize: "0.92rem",
                      fontWeight: 900,
                      mb: 2,
                      display: "block",
                      fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                      "&:hover": {
                        color: theme.dark,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    पासवर्ड भूल गए? (Forgot Password?)
                  </Link>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.muted,
                      mb: 2,
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                    }}
                  >
                    New User?
                  </Typography>

                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    fullWidth
                    sx={{
                      py: 1.15,
                      fontSize: "1rem",
                      fontWeight: 950,
                      borderRadius: "15px",
                      textTransform: "none",
                      borderColor: "rgba(124, 58, 237, 0.35)",
                      color: theme.main,
                      fontFamily: "Noto Sans Devanagari, Poppins, Arial, sans-serif",
                      "&:hover": {
                        borderColor: theme.main,
                        background: "rgba(124, 58, 237, 0.07)",
                      },
                    }}
                  >
                    Registration
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Login;