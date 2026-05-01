import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Link,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  PersonAdd,
  Close,
  BadgeRounded,
  LocationOnRounded,
  WorkRounded,
  Diversity3Rounded,
  VerifiedUserRounded,
  AssignmentIndRounded,
} from "@mui/icons-material";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import MembershipCardPopup from "../../components/MembershipCardPopup";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://backend.pmums.com/api";

const theme = {
  dark: "#221b43",
  main: "#6f5cc2",
  light: "#b9a7ff",
  accent: "#0f766e",
  soft: "#f4f2fb",
  soft2: "#ffffff",
  softAccent: "#eef8f7",
  text: "#221b43",
  muted: "#4b5563",
  danger: "#b42318",
  success: "#0f766e",
  border: "#ded8f5",
};

const fontFamily = "Noto Sans Devanagari, Poppins, Arial, sans-serif";

const menuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      maxHeight: 320,
      borderRadius: "16px",
      boxShadow: "0 18px 45px rgba(34, 27, 67, 0.16)",
border: "1px solid rgba(111, 92, 194, 0.14)",
      "& .MuiMenuItem-root": {
        px: 2,
        py: 1.3,
        fontSize: "0.95rem",
        fontWeight: 700,
        fontFamily,
        whiteSpace: "normal",
      },
    },
  },
};

const labelSx = {
  color: theme.dark,
  fontWeight: 900,
  mb: 0.8,
  display: "block",
  fontSize: "0.92rem",
  fontFamily,
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "15px",
   background: "#ffffff",
    transition: "all 0.25s ease",
    "& fieldset": {
     borderColor: "rgba(111, 92, 194, 0.18)",
    },
    "&:hover fieldset": {
borderColor: "rgba(111, 92, 194, 0.42)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.main,
      borderWidth: "2px",
    },
    "&.Mui-disabled": {
     background: theme.soft,
    },
  },
  "& .MuiInputBase-input": {
    color: theme.text,
    fontWeight: 600,
    fontFamily,
  },
  "& input::placeholder": {
    color: "rgba(76, 29, 149, 0.55)",
    opacity: 1,
    fontWeight: 600,
  },
  "& .MuiFormHelperText-root": {
    fontWeight: 600,
    fontFamily,
    mx: 0.5,
  },
};

const selectSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "15px",
    background: "#ffffff",
    transition: "all 0.25s ease",
    "& fieldset": {
      borderColor: "rgba(111, 92, 194, 0.18)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(111, 92, 194, 0.42)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.main,
      borderWidth: "2px",
    },
    "&.Mui-disabled": {
      background: theme.soft,
    },
  },
  "& .MuiSelect-select": {
    color: theme.text,
    fontWeight: 600,
    fontFamily,
  },
  "& .MuiFormHelperText-root": {
    fontWeight: 600,
    fontFamily,
    mx: 0.5,
  },
};

const sectionCardSx = {
  mb: 4,
  p: { xs: 2, md: 3 },
  borderRadius: "24px",
background: "#ffffff",
border: "1px solid rgba(111, 92, 194, 0.16)",
boxShadow: "0 18px 55px rgba(34, 27, 67, 0.08)",
};

const SectionHeader = ({ icon, title, subtitle }) => (
  <Box
    sx={{
      mb: 2.3,
      p: { xs: 1.8, md: 2.2 },
      borderRadius: "22px",
      color: "#fff",
background: "linear-gradient(135deg, #221b43 0%, #30295c 48%, #3b3268 100%)",
boxShadow: "0 16px 36px rgba(34, 27, 67, 0.22)",      display: "flex",
      alignItems: "center",
      gap: 1.6,
      position: "relative",
      overflow: "hidden",
      
    }}
  >
    <Box
      sx={{
        width: 46,
        height: 46,
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.22)",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}
    >
      {icon}
    </Box>

    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 950,
          fontFamily,
          lineHeight: 1.25,
          fontSize: { xs: "1rem", md: "1.12rem" },
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            mt: 0.2,
            fontSize: "0.82rem",
            opacity: 0.9,
            fontWeight: 700,
            fontFamily,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

const [error, setError] = useState("");
const [notification, setNotification] = useState({
  open: false,
  message: "",
  severity: "error",
});
const [showSuccessPopup, setShowSuccessPopup] = useState(false);  const [registrationData, setRegistrationData] = useState(null);
  const [membershipCardOpen, setMembershipCardOpen] = useState(false);

  const [locationErrors, setLocationErrors] = useState({
    state: "",
    sambhag: "",
    district: "",
    block: "",
  });

  const [locationHierarchy, setLocationHierarchy] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedSambhag, setSelectedSambhag] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  const [availableSambhags, setAvailableSambhags] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
const {
  register,
  handleSubmit,
  watch,
  setValue,
  control,
  reset,
  formState: { errors },
} = useForm({
  mode: "onChange",
});
const showNotification = (message, severity = "error") => {
  setNotification({
    open: true,
    message,
    severity,
  });
};

const resetRegistrationForm = () => {
  reset();

  setSelectedSambhag("");
  setSelectedDistrict("");
  setSelectedBlock("");

  setAvailableDistricts([]);
  setAvailableBlocks([]);

  setLocationErrors({
    state: "",
    sambhag: "",
    district: "",
    block: "",
  });

  setError("");

  if (locationHierarchy?.states && locationHierarchy.states.length === 1) {
    const mpState = locationHierarchy.states[0];
    setSelectedState(mpState.id);
    setAvailableSambhags(mpState.sambhags || []);
  } else {
    setSelectedState("");
    setAvailableSambhags([]);
  }
};
const handleGoToDashboard = () => {
  setShowSuccessPopup(false);
  setMembershipCardOpen(false);
  resetRegistrationForm();
  navigate("/login", { replace: true });
};
  const watchedDateOfBirth = watch("dateOfBirth");

  const formatRetirementDateFromDob = (dobValue) => {
    if (!dobValue) return "";

    const date = new Date(`${dobValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "";

    date.setFullYear(date.getFullYear() + 62);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDobAsPassword = (dobValue) => {
    if (!dobValue) return "";

    const [year, month, day] = dobValue.split("-");
    if (!year || !month || !day) return "";

    return `${day}${month}${year}`;
  };

  useEffect(() => {
    const autoPassword = formatDobAsPassword(watchedDateOfBirth);
    const autoRetirementDate = formatRetirementDateFromDob(watchedDateOfBirth);

    setValue("password", autoPassword);
    setValue("confirmPassword", autoPassword);
    setValue("retirementDate", autoRetirementDate);
  }, [watchedDateOfBirth, setValue]);

  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setLoadingLocations(true);

        let locationData;

        try {
          const response = await axios.get(`${API_BASE_URL}/locations/hierarchy`);
          locationData = response.data;
        } catch (apiErr) {
          console.warn("Location API failed, using fallback data:", apiErr);

          locationData = {
            states: [
              {
                id: "MP",
                name: "मध्य प्रदेश",
                sambhags: [
                  {
                    id: "BHOPAL",
                    name: "भोपाल संभाग",
                    districts: [
                      {
                        id: "BHOPAL_DIST",
                        name: "भोपाल",
                        blocks: [
                          { id: "BHOPAL_BLOCK", name: "भोपाल" },
                          { id: "HUZUR", name: "हुजूर" },
                          { id: "BERASIA", name: "बैरसिया" },
                        ],
                      },
                      {
                        id: "RAISEN_DIST",
                        name: "रायसेन",
                        blocks: [
                          { id: "BEGUMGANJ", name: "बेगमगंज" },
                          { id: "GAIRATGANJ", name: "गैरतगंज" },
                          { id: "BARELI", name: "बारेली" },
                        ],
                      },
                    ],
                  },
                  {
                    id: "INDORE",
                    name: "इंदौर संभाग",
                    districts: [
                      {
                        id: "INDORE_DIST",
                        name: "इंदौर",
                        blocks: [
                          { id: "INDORE_BLOCK", name: "इंदौर" },
                          { id: "MHOW", name: "महू" },
                          { id: "SANWER", name: "सांवेर" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          };
        }

        setLocationHierarchy(locationData);

        if (locationData.states && locationData.states.length === 1) {
          const mpState = locationData.states[0];
          setSelectedState(mpState.id);
          setAvailableSambhags(mpState.sambhags || []);
        }

        console.log("Complete location hierarchy loaded:", locationData);
      } catch (err) {
        console.error("Error setting up location hierarchy:", err);
setError("स्थान डेटा लोड करने में त्रुटि। कृपया पुनः प्रयास करें।");
showNotification("स्थान डेटा लोड करने में त्रुटि। कृपया पुनः प्रयास करें।", "error");      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

  useEffect(() => {
    console.log("Location state changed:", {
      selectedState,
      selectedSambhag,
      selectedDistrict,
      selectedBlock,
      availableSambhags: availableSambhags?.length || 0,
      availableDistricts: availableDistricts?.length || 0,
      availableBlocks: availableBlocks?.length || 0,
      locationHierarchy: locationHierarchy ? "loaded" : "not loaded",
    });
  }, [
    selectedState,
    selectedSambhag,
    selectedDistrict,
    selectedBlock,
    availableSambhags,
    availableDistricts,
    availableBlocks,
    locationHierarchy,
  ]);

 const handleStateChange = (event) => {
  const stateId = event.target.value;
  setSelectedState(stateId);
  setSelectedSambhag("");
  setSelectedDistrict("");
  setSelectedBlock("");

  setLocationErrors((prev) => ({
    ...prev,
    state: "",
    sambhag: "",
    district: "",
    block: "",
  }));

  const state = locationHierarchy?.states?.find((s) => s.id === stateId);
  setAvailableSambhags(state?.sambhags || []);
  setAvailableDistricts([]);
  setAvailableBlocks([]);
};

  const handleSambhagChange = (event) => {
  const sambhagId = event.target.value;
  console.log("Sambhag changed to:", sambhagId);
  setSelectedSambhag(sambhagId);
  setSelectedDistrict("");
  setSelectedBlock("");

  setLocationErrors((prev) => ({
    ...prev,
    sambhag: "",
    district: "",
    block: "",
  }));

  const sambhag = availableSambhags.find((s) => s.id === sambhagId);
  console.log("Found sambhag:", sambhag);
  console.log("Districts in sambhag:", sambhag?.districts);
  setAvailableDistricts(sambhag?.districts || []);
  setAvailableBlocks([]);
};

 const handleDistrictChange = (event) => {
  const districtId = event.target.value;
  console.log("District changed to:", districtId);
  setSelectedDistrict(districtId);
  setSelectedBlock("");

  setLocationErrors((prev) => ({
    ...prev,
    district: "",
    block: "",
  }));

  const district = availableDistricts.find((d) => d.id === districtId);
  console.log("Found district:", district);
  console.log("Blocks in district:", district?.blocks);
  setAvailableBlocks(district?.blocks || []);
};
const handleBlockChange = (event) => {
  setSelectedBlock(event.target.value);

  setLocationErrors((prev) => ({
    ...prev,
    block: "",
  }));
};

  const splitFullName = (fullName) => {
    const cleaned = (fullName || "").trim().replace(/\s+/g, " ");
    if (!cleaned) return { name: "", surname: "" };

    const parts = cleaned.split(" ");
    if (parts.length === 1) {
      return { name: parts[0], surname: "" };
    }

    return {
      name: parts[0],
      surname: parts.slice(1).join(" "),
    };
  };

  const onSubmit = async (data) => {
    setLocationErrors({ state: "", sambhag: "", district: "", block: "" });

    const newLocationErrors = {};
    if (!selectedState) newLocationErrors.state = "राज्य चुनना आवश्यक है";
    if (!selectedSambhag) newLocationErrors.sambhag = "संभाग चुनना आवश्यक है";
    if (!selectedDistrict) newLocationErrors.district = "जिला चुनना आवश्यक है";
    if (!selectedBlock) newLocationErrors.block = "ब्लॉक चुनना आवश्यक है";

   if (Object.keys(newLocationErrors).length > 0) {
  setLocationErrors(newLocationErrors);
  const message = "कृपया सभी स्थान विवरण भरें (राज्य, संभाग, जिला, ब्लॉक)";
  setError(message);
  showNotification(message, "warning");
  return;
}

    try {
      setError("");

      const {
        confirmPassword,
        confirmEmail,
        confirmMobileNumber,
        agreeTerms,
        ...formData
      } = data;

      const state = locationHierarchy?.states?.find((s) => s.id === selectedState);
      const sambhag = availableSambhags.find((s) => s.id === selectedSambhag);
      const district = availableDistricts.find((d) => d.id === selectedDistrict);
      const block = availableBlocks.find((b) => b.id === selectedBlock);

      const genderMap = {
        male: "MALE",
        female: "FEMALE",
        other: "OTHER",
      };

      const maritalStatusMap = {
        single: "UNMARRIED",
        married: "MARRIED",
        divorced: "DIVORCED",
        widowed: "WIDOWED",
      };

      const { name, surname } = splitFullName(formData.fullName);

      const registrationData = {
        name: name,
        surname: surname,
        fatherName: formData.fatherName,
        countryCode: "+91",
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        pincode: formData.pinCode ? parseInt(formData.pinCode, 10) : null,
        gender: genderMap[formData.gender] || "OTHER",
        maritalStatus: maritalStatusMap[formData.maritalStatus] || "UNMARRIED",
        password: formData.password,
        homeAddress: formData.homeAddress || "",
        dateOfBirth: formData.dateOfBirth,
        schoolOfficeName: formData.schoolOfficeName || "",
        sankulName: formData.sankulName || "",
        joiningDate: formData.joiningDate || null,
        retirementDate: formData.retirementDate || null,
        department: formData.department || "",
        departmentUniqueId: formData.departmentUniqueId || "",
        departmentState: state?.name || "",
        departmentSambhag: sambhag?.name || "",
        departmentDistrict: district?.name || "",
        departmentBlock: block?.name || "",
        nominee1Name: formData.nominee1Name || "",
        nominee1Relation: formData.nominee1Relation || "",
        nominee2Name: formData.nominee2Name || "",
        nominee2Relation: formData.nominee2Relation || "",
        acceptedTerms: true,
      };

      const response = await registerUser(registrationData);

      console.log("Registration response:", response);

      const registrationNumber =
        response?.id ||
        response?.registrationNumber ||
        response?.employeeId ||
        response?.data?.id ||
        response?.data?.registrationNumber ||
        response?.data?.employeeId ||
        "PMUMS" + Date.now();

      console.log("Extracted registration number:", registrationNumber);

      setRegistrationData({
        fullName: formData.fullName,
        name: formData.fullName,
        registrationNumber,
        mobileNumber: formData.mobileNumber,
        department: formData.department,
        registrationDate: new Date().toISOString(),
        ...registrationData,
      });

      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.response?.data?.message || err.message);

   let errorMessage = "Registration failed. Please try again.";

const apiData = err.response?.data;

if (err.apiMessage) {
  errorMessage = err.apiMessage;
} else if (typeof apiData === "string") {
  errorMessage = apiData;
} else if (apiData?.message) {
  errorMessage = apiData.message;
} else if (apiData?.error) {
  errorMessage = apiData.error;
} else if (Array.isArray(apiData?.errors) && apiData.errors.length > 0) {
  errorMessage = apiData.errors.join(", ");
} else if (typeof apiData === "object" && apiData !== null) {
  errorMessage =
    Object.values(apiData)
      .flat()
      .filter(Boolean)
      .join(", ") || errorMessage;
} else if (err.message) {
  errorMessage = err.message;
}

setError(errorMessage);
showNotification(errorMessage, "error");
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "calc(100vh - 160px)",
          py: { xs: 4, md: 7 },
        background: theme.soft,
          position: "relative",
          overflow: "hidden",
        }}
      >
        

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.2, sm: 3, md: 4 },
              borderRadius: { xs: "28px", md: "38px" },
             background: "#ffffff",
border: "1px solid rgba(111, 92, 194, 0.16)",
boxShadow: "0 30px 90px rgba(34, 27, 67, 0.12)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 7,
background: theme.main,              },
             
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    width: 78,
                    height: 78,
                    borderRadius: "26px",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
background: theme.main,
boxShadow: "0 16px 36px rgba(111, 92, 194, 0.28)",                    color: "#fff",
                  
                  }}
                >
                  <PersonAdd sx={{ fontSize: 40 }} />
                </Box>

                <Typography
                  variant="overline"
                  sx={{
                    color: theme.main,
                    fontWeight: 950,
                    letterSpacing: "1.5px",
                    fontSize: "0.82rem",
                    fontFamily,
                  }}
                >
                  PMUMS MEMBER REGISTRATION
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    mt: 0.7,
                    fontWeight: 950,
                    color: theme.dark,
                    mb: 1.2,
                    fontSize: { xs: "2rem", md: "2.7rem" },
                    fontFamily,
                    lineHeight: 1.2,
                  }}
                >
                  नया पंजीकरण
                </Typography>

                <Box
                  sx={{
                    width: 105,
                    height: 5,
                    borderRadius: 99,
                    mx: "auto",
                    mb: 2,
background: theme.main,                  }}
                />

                <Typography
                  sx={{
                    color: theme.muted,
                    fontSize: { xs: "0.95rem", md: "1.03rem" },
                    fontWeight: 750,
                    lineHeight: 1.7,
                    fontFamily,
                    maxWidth: 780,
                    mx: "auto",
                  }}
                >
                  PMUMS में सदस्यता के लिए नीचे दी गई जानकारी भरें। सभी आवश्यक
                  जानकारी सही-सही दर्ज करें।
                </Typography>

                <Chip
                  label="All fields marked * are required"
                  sx={{
                    mt: 2,
                    color: theme.dark,
                    fontWeight: 700,
                    background:theme.softAccent,
                    border: "1px solid  rgba(185, 167, 255, 0.10)",
                    fontFamily,
                  }}
                />
              </Box>

             {error && (
  <Box
    sx={{
      mb: 3,
      p: 2,
      borderRadius: "18px",
      background:
        "linear-gradient(135deg, rgba(254,242,242,0.95), rgba(255,255,255,0.95))",
      border: "1px solid rgba(220, 38, 38, 0.18)",
      color: theme.danger,
      fontWeight: 850,
      fontFamily,
      boxShadow: "0 12px 30px rgba(220, 38, 38, 0.08)",
    }}
  >
    {error}
  </Box>
)}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <SectionHeader
                  icon={<BadgeRounded />}
                  title="1. मूल जानकारी (Basic Information)"
                  subtitle="Personal, contact and identity details"
                />

                <Box sx={sectionCardSx}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>पूरा नाम *</Typography>
                      <TextField
                        fullWidth
                        placeholder="Full Name"
                        {...register("fullName", {
                          required: "Full name is required",
                        })}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>पिता का नाम *</Typography>
                      <TextField
                        fullWidth
                        placeholder="Father Name"
                        {...register("fatherName", {
                          required: "Father name is required",
                        })}
                        error={!!errors.fatherName}
                        helperText={errors.fatherName?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>लिंग *</Typography>
                     <Controller
  name="gender"
  control={control}
  defaultValue=""
  rules={{ required: "कृपया लिंग चुनें" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.gender} sx={selectSx}>
      <Select {...field} displayEmpty MenuProps={menuProps}>
        <MenuItem value="">लिंग चुनें</MenuItem>
        <MenuItem value="male">पुरुष (Male)</MenuItem>
        <MenuItem value="female">महिला (Female)</MenuItem>
        <MenuItem value="other">अन्य (Other)</MenuItem>
      </Select>
      <FormHelperText>{errors.gender?.message}</FormHelperText>
    </FormControl>
  )}
/>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>वैवाहिक स्थिति *</Typography>
                     <Controller
  name="maritalStatus"
  control={control}
  defaultValue=""
  rules={{ required: "कृपया वैवाहिक स्थिति चुनें" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.maritalStatus} sx={selectSx}>
      <Select {...field} displayEmpty MenuProps={menuProps}>
        <MenuItem value="">वैवाहिक स्थिति चुनें</MenuItem>
        <MenuItem value="single">अविवाहित (Single)</MenuItem>
        <MenuItem value="married">विवाहित (Married)</MenuItem>
        <MenuItem value="divorced">तलाकशुदा (Divorced)</MenuItem>
        <MenuItem value="widowed">विधवा/विधुर (Widowed)</MenuItem>
      </Select>
      <FormHelperText>{errors.maritalStatus?.message}</FormHelperText>
    </FormControl>
  )}
/>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>जन्मतिथि *</Typography>
                      <TextField
                        fullWidth
                        type="date"
                        {...register("dateOfBirth", {
                          required: "Date of birth is required",
                        })}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <Typography sx={labelSx}>Country Code *</Typography>
                      <TextField fullWidth value="+91" disabled sx={inputSx} />
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Typography sx={labelSx}>मोबाइल नंबर *</Typography>
                      <TextField
                        fullWidth
                        placeholder="10 अंकों का नंबर"
                        {...register("mobileNumber", {
                          required: "Mobile number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Only 10 digits allowed",
                          },
                        })}
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber?.message}
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Typography sx={labelSx}>मोबाइल नंबर की पुष्टि *</Typography>
                      <TextField
                        fullWidth
                        placeholder="10 अंकों का नंबर"
                        {...register("confirmMobileNumber", {
                          required: "Please confirm mobile number",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Only 10 digits allowed",
                          },
                          validate: (value) => {
                            const mobileNumber = watch("mobileNumber");
                            return (
                              value === mobileNumber ||
                              "Mobile numbers do not match"
                            );
                          },
                        })}
                        error={!!errors.confirmMobileNumber}
                        helperText={errors.confirmMobileNumber?.message}
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>ईमेल आईडी *</Typography>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="example@email.com"
                        {...register("email", {
                          required: "ईमेल आवश्यक है",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "कृपया सही ईमेल दर्ज करें",
                          },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>ईमेल की पुष्टि करें *</Typography>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="ईमेल फिर से दर्ज करें"
                        {...register("confirmEmail", {
                          required: "कृपया ईमेल की पुष्टि करें",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "कृपया सही ईमेल दर्ज करें",
                          },
                          validate: (value) => {
                            const email = watch("email");
                            return value === email || "ईमेल मेल नहीं खाता";
                          },
                        })}
                        error={!!errors.confirmEmail}
                        helperText={errors.confirmEmail?.message}
                        sx={inputSx}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <SectionHeader
                  icon={<LocationOnRounded />}
                  title="2. पता विवरण (Address Details)"
                  subtitle="State, division, district, block and address"
                />

                <Box sx={sectionCardSx}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>राज्य *</Typography>
                      <FormControl
                        fullWidth
                        error={!!locationErrors.state}
                        sx={selectSx}
                      >
                        <Select
                          value={selectedState}
                          onChange={handleStateChange}
                          disabled={loadingLocations}
                          displayEmpty
                          MenuProps={menuProps}
                        >
                          {loadingLocations ? (
                            <MenuItem disabled>लोड हो रहा है...</MenuItem>
                          ) : (
                            locationHierarchy?.states?.map((state) => (
                              <MenuItem key={state.id} value={state.id}>
                                {state.name} {state.code ? `(${state.code})` : ""}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        <FormHelperText>{locationErrors.state}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>संभाग *</Typography>
                      <FormControl
                        fullWidth
                        disabled={!selectedState || loadingLocations}
                        error={!!locationErrors.sambhag}
                        sx={selectSx}
                      >
                        <Select
                          value={selectedSambhag}
                          onChange={handleSambhagChange}
                          displayEmpty
                          MenuProps={menuProps}
                        >
                          <MenuItem value="">संभाग चुनें... (Select Division)</MenuItem>
                          {availableSambhags && availableSambhags.length > 0 ? (
                            availableSambhags.map((sambhag) => (
                              <MenuItem key={sambhag.id} value={sambhag.id}>
                                {sambhag.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {loadingLocations
                                ? "लोड हो रहा है..."
                                : "कोई संभाग उपलब्ध नहीं"}
                            </MenuItem>
                          )}
                        </Select>
                        <FormHelperText>{locationErrors.sambhag}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>जिला *</Typography>
                      <FormControl
                        fullWidth
                        disabled={!selectedSambhag || loadingLocations}
                        error={!!locationErrors.district}
                        sx={selectSx}
                      >
                        <Select
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          displayEmpty
                          MenuProps={menuProps}
                        >
                          <MenuItem value="">जिला चुनें... (Select District)</MenuItem>
                          {availableDistricts && availableDistricts.length > 0 ? (
                            availableDistricts.map((district) => (
                              <MenuItem key={district.id} value={district.id}>
                                {district.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {!selectedSambhag
                                ? "पहले संभाग चुनें"
                                : "कोई जिला उपलब्ध नहीं"}
                            </MenuItem>
                          )}
                        </Select>
                        <FormHelperText>{locationErrors.district}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>ब्लॉक *</Typography>
                      <FormControl
                        fullWidth
                        disabled={!selectedDistrict || loadingLocations}
                        error={!!locationErrors.block}
                        sx={selectSx}
                      >
                        <Select
                          value={selectedBlock}
                          onChange={handleBlockChange}
                          displayEmpty
                          MenuProps={menuProps}
                        >
                          <MenuItem value="">ब्लॉक चुनें... (Select Block)</MenuItem>
                          {availableBlocks && availableBlocks.length > 0 ? (
                            availableBlocks.map((block) => (
                              <MenuItem key={block.id} value={block.id}>
                                {block.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {!selectedDistrict
                                ? "पहले जिला चुनें"
                                : "कोई ब्लॉक उपलब्ध नहीं"}
                            </MenuItem>
                          )}
                        </Select>
                        <FormHelperText>{locationErrors.block}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Typography sx={labelSx}>पूरा पता *</Typography>
                      <TextField
                        fullWidth
                        placeholder="House No, Street, Landmark..."
                        {...register("homeAddress", {
                          required: "Home address is required",
                        })}
                        error={!!errors.homeAddress}
                        helperText={errors.homeAddress?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>पिन कोड *</Typography>
                      <TextField
                        fullWidth
                        placeholder="6 अंकों का कोड"
                        {...register("pinCode", {
                          required: "Pin code is required",
                          pattern: {
                            value: /^[0-9]{6}$/,
                            message: "Invalid PIN code",
                          },
                        })}
                        error={!!errors.pinCode}
                        helperText={errors.pinCode?.message}
                        inputProps={{
                          maxLength: 6,
                          inputMode: "numeric",
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        sx={inputSx}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <SectionHeader
                  icon={<WorkRounded />}
                  title="3. व्यावसायिक विवरण (Professional Details)"
                  subtitle="Department, school, joining and retirement details"
                />

                <Box sx={sectionCardSx}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={4}>
                      <Typography sx={labelSx}>विभाग का नाम *</Typography>
                     <Controller
  name="department"
  control={control}
  defaultValue=""
  rules={{ required: "कृपया विभाग चुनें" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.department} sx={selectSx}>
      <Select {...field} displayEmpty MenuProps={menuProps}>
        <MenuItem value="">विभाग चुनें</MenuItem>
        <MenuItem value="शिक्षा विभाग">शिक्षा विभाग</MenuItem>
        <MenuItem value="आदिम जाति कल्याण विभाग">
          आदिम जाति कल्याण विभाग
        </MenuItem>
      </Select>
      <FormHelperText>{errors.department?.message}</FormHelperText>
    </FormControl>
  )}
/>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Typography sx={labelSx}>
                        पदस्थ स्कूल/कार्यालय का नाम *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Posted School/Office Name"
                        {...register("schoolOfficeName", {
                          required: "School/Office name is required",
                        })}
                        error={!!errors.schoolOfficeName}
                        helperText={errors.schoolOfficeName?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>
                        विभाग आईडी (Department Unique ID) *
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Unique ID"
                        {...register("departmentUniqueId", {
                          required: "Department unique ID is required",
                        })}
                        error={!!errors.departmentUniqueId}
                        helperText={errors.departmentUniqueId?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>संकुल का नाम *</Typography>
                      <TextField
                        fullWidth
                        placeholder="Sankul Name"
                        {...register("sankulName", {
                          required: "Sankul name is required",
                        })}
                        error={!!errors.sankulName}
                        helperText={errors.sankulName?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>नियुक्ति वर्ष *</Typography>
                      <TextField
                        fullWidth
                        type="date"
                        {...register("joiningDate", {
                          required: "Joining date is required",
                        })}
                        error={!!errors.joiningDate}
                        helperText={errors.joiningDate?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>सेवानिवृत्ति की तिथि *</Typography>
                      <TextField
                        fullWidth
                        type="date"
                        {...register("retirementDate", {
                          required: "जन्मतिथि + 62 वर्ष से स्वतः भरा जाएगा",
                        })}
                        error={!!errors.retirementDate}
                        helperText={
                          errors.retirementDate?.message ||
                          "जन्मतिथि + 62 वर्ष से स्वतः भरा जाएगा"
                        }
                        sx={inputSx}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <SectionHeader
                  icon={<Diversity3Rounded />}
                  title="4. नामांकित व्यक्ति का विवरण (Nominee Details)"
                  subtitle="First and second nominee information"
                />

                <Box sx={sectionCardSx}>
                  <Typography
                    sx={{
                      mb: 2,
                      fontWeight: 950,
                      color: theme.dark,
                      fontFamily,
                      fontSize: "1.05rem",
                    }}
                  >
                    पहला नामांकित (First Nominee)
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>नामांकित का नाम *</Typography>
                      <TextField
                        fullWidth
                        placeholder="Nominee Name"
                        {...register("nominee1Name", {
                          required: "First nominee name is required",
                        })}
                        error={!!errors.nominee1Name}
                        helperText={errors.nominee1Name?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>नामांकित का संबंध *</Typography>
                     <Controller
  name="nominee1Relation"
  control={control}
  defaultValue=""
  rules={{ required: "कृपया पहले नामांकित का संबंध चुनें" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.nominee1Relation} sx={selectSx}>
      <Select {...field} displayEmpty MenuProps={menuProps}>
        <MenuItem value="">संबंध चुनें</MenuItem>
        <MenuItem value="पिता">पिता (Father)</MenuItem>
        <MenuItem value="माता">माता (Mother)</MenuItem>
        <MenuItem value="भाई">भाई (Brother)</MenuItem>
        <MenuItem value="बहन">बहन (Sister)</MenuItem>
        <MenuItem value="पति">पति (Husband)</MenuItem>
        <MenuItem value="पत्नी">पत्नी (Wife)</MenuItem>
        <MenuItem value="पुत्र">पुत्र (Son)</MenuItem>
        <MenuItem value="पुत्री">पुत्री (Daughter)</MenuItem>
        <MenuItem value="दादा">दादा (Grandfather)</MenuItem>
        <MenuItem value="दादी">दादी (Grandmother)</MenuItem>
        <MenuItem value="अन्य">अन्य (Other)</MenuItem>
      </Select>
      <FormHelperText>{errors.nominee1Relation?.message}</FormHelperText>
    </FormControl>
  )}
/>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3, borderColor: "rgba(124,58,237,0.13)" }} />

                  <Typography
                    sx={{
                      mb: 2,
                      fontWeight: 950,
                      color: theme.dark,
                      fontFamily,
                      fontSize: "1.05rem",
                    }}
                  >
                    दूसरा नामांकित (Second Nominee)
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>नामांकित का नाम *</Typography>
                      <TextField
                        fullWidth
                        placeholder="Nominee Name"
                        {...register("nominee2Name", {
                          required: "Second nominee name is required",
                        })}
                        error={!!errors.nominee2Name}
                        helperText={errors.nominee2Name?.message}
                        sx={inputSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>नामांकित का संबंध *</Typography>
                     <Controller
  name="nominee2Relation"
  control={control}
  defaultValue=""
  rules={{ required: "कृपया दूसरे नामांकित का संबंध चुनें" }}
  render={({ field }) => (
    <FormControl fullWidth error={!!errors.nominee2Relation} sx={selectSx}>
      <Select {...field} displayEmpty MenuProps={menuProps}>
        <MenuItem value="">संबंध चुनें</MenuItem>
        <MenuItem value="पिता">पिता (Father)</MenuItem>
        <MenuItem value="माता">माता (Mother)</MenuItem>
        <MenuItem value="भाई">भाई (Brother)</MenuItem>
        <MenuItem value="बहन">बहन (Sister)</MenuItem>
        <MenuItem value="पति">पति (Husband)</MenuItem>
        <MenuItem value="पत्नी">पत्नी (Wife)</MenuItem>
        <MenuItem value="पुत्र">पुत्र (Son)</MenuItem>
        <MenuItem value="पुत्री">पुत्री (Daughter)</MenuItem>
        <MenuItem value="दादा">दादा (Grandfather)</MenuItem>
        <MenuItem value="दादी">दादी (Grandmother)</MenuItem>
        <MenuItem value="अन्य">अन्य (Other)</MenuItem>
      </Select>
      <FormHelperText>{errors.nominee2Relation?.message}</FormHelperText>
    </FormControl>
  )}
/>
                    </Grid>
                  </Grid>
                </Box>

                <SectionHeader
                  icon={<VerifiedUserRounded />}
                  title="5. खाता सत्यापन (Account Verification)"
                  subtitle="Password is generated automatically from date of birth"
                />

                <Box sx={sectionCardSx}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>पासवर्ड *</Typography>
                      <TextField
                        fullWidth
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                        value={formatDobAsPassword(watchedDateOfBirth)}
                        InputProps={{
                          readOnly: true,
                        }}
                        helperText="आपकी जन्मतिथि ही आपका पासवर्ड है"
                        sx={{
                          ...inputSx,
                          "& .MuiOutlinedInput-root": {
                            ...inputSx["& .MuiOutlinedInput-root"],
                            background: "rgba(245,243,255,0.88)",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={labelSx}>पासवर्ड की पुष्टि करें *</Typography>
                      <TextField
                        fullWidth
                        type="password"
                        {...register("confirmPassword", {
                          required: "Confirm password is required",
                        })}
                        value={formatDobAsPassword(watchedDateOfBirth)}
                        InputProps={{
                          readOnly: true,
                        }}
                        helperText="यह जन्मतिथि से स्वतः भरा जाएगा"
                        sx={{
                          ...inputSx,
                          "& .MuiOutlinedInput-root": {
                            ...inputSx["& .MuiOutlinedInput-root"],
                            background: "rgba(245,243,255,0.88)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    mb: 3,
                    p: { xs: 2, md: 2.5 },
                    borderRadius: "24px",
                  background: theme.softAccent,
border: "1px solid rgba(15, 118, 110, 0.18)",
                  }}
                >
                  <FormControlLabel
                    sx={{
                      alignItems: "flex-start",
                      m: 0,
                      "& .MuiFormControlLabel-label": {
                        pt: 0.1,
                      },
                    }}
                    control={
                      <Checkbox
                        {...register("agreeTerms", {
                          required: "Please accept terms and conditions",
                        })}
                        sx={{
                          color: theme.main,
                          "&.Mui-checked": {
                            color: theme.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontFamily,
                          fontWeight: 750,
                          color: theme.text,
                          lineHeight: 1.7,
                        }}
                      >
                        मैं घोषणा करता/करती हूं कि ऊपर दी गई सभी जानकारी सत्य है
                        और मैं PMUMS के नियमों और शर्तों को स्वीकार करता/करती हूं।
                      </Typography>
                    }
                  />

                  {errors.agreeTerms && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ mt: 1, fontWeight: 800, fontFamily }}
                    >
                      {errors.agreeTerms.message}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                    mt: 3,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    startIcon={!loading && <AssignmentIndRounded />}
                    sx={{
                      px: { xs: 3, md: 5 },
                      py: 1.45,
                      fontSize: "1.05rem",
                     
                      borderRadius: "16px",
                      textTransform: "none",
                      minWidth: { xs: "100%", sm: 285 },
                     fontWeight: 700,
background: theme.accent,
boxShadow: "0 16px 36px rgba(15, 118, 110, 0.30)",
"&:hover": {
  background: "#0b5f59",
  transform: "translateY(-2px)",
  boxShadow: "0 20px 45px rgba(15, 118, 110, 0.38)",
},
                      transition: "all 0.3s ease",
                      fontFamily,
                      
                      "&:disabled": {
                        background: "#c4b5fd",
                        color: "#fff",
                      },
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size={20}
                          sx={{ mr: 1, color: "white" }}
                        />
                        पंजीकरण पूरा करें (Submit)
                      </>
                    ) : (
                      "पंजीकरण पूरा करें (Submit)"
                    )}
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      px: { xs: 3, md: 5 },
                      py: 1.45,
                      fontSize: "1.05rem",
                      borderRadius: "16px",
                      textTransform: "none",
                      minWidth: { xs: "100%", sm: 220 },
                     
                      fontFamily,
                     fontWeight: 700,
borderColor: "rgba(111, 92, 194, 0.35)",
color: theme.main,
"&:hover": {
  borderColor: theme.main,
  background: "rgba(111, 92, 194, 0.08)",
},
                    }}
                    onClick={() => navigate("/login")}
                  >
                    लॉगिन पर जाएं
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  p: 2,
                  borderRadius: "22px",
                  background:
                    "linear-gradient(135deg, rgba(245,243,255,0.75), rgba(255,255,255,0.78))",
                  border: "1px solid rgba(124, 58, 237, 0.11)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.muted,
                    fontFamily,
                    fontWeight: 750,
                  }}
                >
                  पहले से खाता है?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: theme.main,
                      fontWeight: 950,
                      textDecoration: "none",
                      "&:hover": {
                        color: theme.dark,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    यहाँ लॉगिन करें
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>

        <Dialog
  open={showSuccessPopup}
  onClose={() => {
    setShowSuccessPopup(false);
    resetRegistrationForm();
  }}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "34px",
      overflow: "hidden",
     boxShadow: "0 35px 100px rgba(15, 118, 110, 0.22)",
background: "#ffffff",
      position: "relative",
    },
  }}
>
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
background: theme.accent,
      px: { xs: 2.5, md: 4 },
      pt: 4,
      pb: 5,
      textAlign: "center",
      color: "#fff",
      "&::before": {
        content: '""',
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: "50%",
        top: -120,
        right: -70,
        background: "rgba(255,255,255,0.18)",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: "50%",
        bottom: -105,
        left: -70,
        background: "rgba(255,255,255,0.14)",
      },
    }}
  >
    <IconButton
      onClick={() => {
        setShowSuccessPopup(false);
        resetRegistrationForm();
      }}
      sx={{
        position: "absolute",
        right: 14,
        top: 14,
        color: "#fff",
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(8px)",
        zIndex: 2,
        "&:hover": {
          background: "rgba(255,255,255,0.25)",
        },
      }}
    >
      <Close />
    </IconButton>

    <Box
      sx={{
        width: 82,
        height: 82,
        mx: "auto",
        mb: 2,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.95)",
        color: theme.success,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
        position: "relative",
        zIndex: 1,
        fontSize: "2.7rem",
        fontWeight: 950,
      }}
    >
      ✓
    </Box>

    <Typography
      variant="h4"
      sx={{
        fontWeight: 950,
        fontFamily,
        position: "relative",
        zIndex: 1,
        fontSize: { xs: "1.8rem", md: "2.2rem" },
      }}
    >
      पंजीकरण सफल
    </Typography>

    <Typography
      sx={{
        mt: 1,
        fontWeight: 750,
        opacity: 0.96,
        fontFamily,
        position: "relative",
        zIndex: 1,
      }}
    >
      आपका पंजीकरण सफलतापूर्वक पूर्ण हो गया है।
    </Typography>
  </Box>

  <DialogContent
    sx={{
      pt: 3,
      px: { xs: 2.4, md: 4 },
      pb: 1,
      textAlign: "center",
      background:
        "linear-gradient(180deg, #ffffff 0%, rgba(245,243,255,0.74) 100%)",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        mb: 1.5,
        color: theme.dark,
        fontWeight: 950,
        fontFamily,
      }}
    >
      प्रिय {registrationData?.name || "शिक्षक"} जी,
    </Typography>

    <Typography
      sx={{
        mb: 2.5,
        lineHeight: 1.8,
        color: theme.muted,
        fontWeight: 750,
        fontFamily,
      }}
    >
      आपका PMUMS शिक्षक संघ में पंजीकरण सफलतापूर्वक पूर्ण हो गया है।
      कृपया नीचे दी गई पंजीकरण संख्या भविष्य के लिए सुरक्षित रखें।
    </Typography>

    <Box
      sx={{
        my: 2,
        mx: "auto",
        p: 2.5,
        borderRadius: "24px",
       background: theme.soft,
border: "1px solid rgba(111, 92, 194, 0.18)",
boxShadow: "0 16px 40px rgba(34, 27, 67, 0.08)",
        maxWidth: 390,
       
      }}
    >
      <Typography
        sx={{
          mb: 1,
          fontWeight: 900,
          color: theme.text,
          fontFamily,
          fontSize: "0.95rem",
        }}
      >
        पंजीकरण संख्या
      </Typography>

      <Typography
        sx={{
          fontWeight: 950,
          color: theme.main,
          fontFamily,
          fontSize: { xs: "1.55rem", md: "1.85rem" },
          letterSpacing: "0.5px",
          wordBreak: "break-word",
        }}
      >
        {registrationData?.registrationNumber}
      </Typography>
    </Box>

    <Box
      sx={{
        mt: 2.5,
        p: 2,
        borderRadius: "20px",
        background: "rgba(245,243,255,0.88)",
        border: "1px solid rgba(124, 58, 237, 0.14)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          color: theme.dark,
          fontFamily,
          lineHeight: 1.7,
        }}
      >
        आपका पासवर्ड आपकी जन्मतिथि ही है।
      </Typography>

      <Typography
        sx={{
          mt: 0.7,
          color: theme.danger,
          fontWeight: 850,
          fontFamily,
          fontSize: "0.9rem",
        }}
      >
        कृपया अपनी पंजीकरण संख्या और पासवर्ड सुरक्षित रखें।
      </Typography>
    </Box>

    <Typography
      sx={{
        mt: 2.5,
        mb: 1,
        lineHeight: 1.8,
        color: theme.muted,
        fontWeight: 750,
        fontFamily,
      }}
    >
      आप अब कर्मचारी कल्याण कोष योजना से जुड़े सदस्य हैं।
    </Typography>

    <Typography
      sx={{
        mt: 1,
        fontWeight: 950,
        color: theme.main,
        fontFamily,
      }}
    >
      धन्यवाद
      <br />
      PMUMS शिक्षक संघ
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      justifyContent: "center",
      gap: 1.5,
      flexWrap: "wrap",
      px: { xs: 2.4, md: 4 },
      pt: 2,
      pb: 3,
      background: "rgba(245,243,255,0.74)",
    }}
  >
    <Button
      variant="outlined"
      onClick={() => setMembershipCardOpen(true)}
      sx={{
        borderColor: "rgba(124, 58, 237, 0.35)",
        color: theme.main,
        px: 3,
        py: 1.25,
        fontWeight: 950,
        borderRadius: "16px",
        textTransform: "none",
        fontFamily,
        minWidth: { xs: "100%", sm: 220 },
        "&:hover": {
          borderColor: theme.main,
          background: "rgba(124, 58, 237, 0.07)",
        },
      }}
    >
      ID Card देखें / डाउनलोड करें
    </Button>

    <Button
      variant="contained"
      onClick={handleGoToDashboard}
      sx={{
        px: 3,
        py: 1.25,
       
        borderRadius: "16px",
        textTransform: "none",
        fontFamily,
        minWidth: { xs: "100%", sm: 220 },
      fontWeight: 700,
background: theme.accent,
boxShadow: "0 16px 36px rgba(15, 118, 110, 0.30)",
"&:hover": {
  background: "#0b5f59",
  transform: "translateY(-2px)",
  boxShadow: "0 20px 45px rgba(15, 118, 110, 0.38)",
},
      }}
    >
     लॉगिन पर जाएं
    </Button>
  </DialogActions>
</Dialog>
<Snackbar
  open={notification.open}
  autoHideDuration={4500}
  onClose={() =>
    setNotification((prev) => ({
      ...prev,
      open: false,
    }))
  }
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() =>
      setNotification((prev) => ({
        ...prev,
        open: false,
      }))
    }
    severity={notification.severity}
    variant="filled"
    sx={{
      width: "100%",
      borderRadius: "14px",
      fontWeight: 850,
      fontFamily,
      boxShadow: "0 18px 45px rgba(76, 29, 149, 0.18)",
      alignItems: "center",
    }}
  >
    {notification.message}
  </Alert>
</Snackbar>
        <MembershipCardPopup
          open={membershipCardOpen}
          onClose={() => setMembershipCardOpen(false)}
          memberData={registrationData}
        />
      </Box>
    </Layout>
  );
};

export default Register;