import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Stack,
  Paper,
  Divider,
  Typography
} from "@mui/material";

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
  border: "#ded8f5"
};

const InfoBox = ({ children, sx = {} }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: "24px",
      p: { xs: 2.2, md: 2.8 },
      background: "#ffffff",
      border: "1px solid rgba(111, 92, 194, 0.16)",
      boxShadow: "0 14px 38px rgba(34, 27, 67, 0.10)",
      ...sx
    }}
  >
    {children}
  </Paper>
);

const ActionButton = ({ children, sx = {}, ...props }) => (
  <Button
    variant="contained"
    {...props}
    sx={{
      borderRadius: "14px",
      px: 3.2,
      py: 1.1,
      color: "#ffffff",
      fontWeight: 600,
      textTransform: "none",
      background: "#0f7633",
      boxShadow: "0 12px 28px rgba(15, 118, 110, 0.26)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "#0b5f59",
        transform: "translateY(-2px)",
        boxShadow: "0 16px 36px rgba(15, 118, 110, 0.36)"
      },
      ...sx
    }}
  >
    {children}
  </Button>
);

const QrCard = ({ qrCode, label, onDownload }) => (
  <Paper
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: "28px",
      p: 2.2,
      textAlign: "center",
      background: "#ffffff",
      border: "1px solid rgba(111, 92, 194, 0.16)",
      boxShadow: "0 18px 44px rgba(34, 27, 67, 0.10)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.35s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 24px 62px rgba(34, 27, 67, 0.16)"
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: theme.main
      }
    }}
  >
    <Box
      sx={{
        mt: 1,
        mb: 1.8,
        p: 1.2,
        borderRadius: "22px",
        background: theme.soft,
        border: "1px solid rgba(111, 92, 194, 0.14)"
      }}
    >
      {qrCode ? (
        <Box
          component="img"
          src={qrCode}
          alt={label}
          sx={{
            width: "100%",
            height: 230,
            objectFit: "contain",
            borderRadius: "18px",
            background: "#ffffff"
          }}
        />
      ) : (
        <Box
          sx={{
            height: 230,
            borderRadius: "18px",
            background: "#ffffff",
            border: "1px dashed rgba(111, 92, 194, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography color={theme.text} fontWeight={900}>
            QR Not Available
          </Typography>
        </Box>
      )}
    </Box>

    <Chip
      label={label}
      sx={{
        mb: 1.8,
        maxWidth: "100%",
        color: theme.dark,
        fontWeight: 900,
        background: theme.soft,
        border: "1px solid rgba(111, 92, 194, 0.20)",
        fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
      }}
    />

    <ActionButton fullWidth size="small" onClick={onDownload} sx={{ py: 0.85 }}>
      Download QR
    </ActionButton>
  </Paper>
);

const BankDetailsCard = ({ title, account, fallbackName, onCopy }) => (
  <Paper
    elevation={0}
    sx={{
      height: "100%",
      minHeight: 270,
      borderRadius: "28px",
      p: 2.5,
      background: "#ffffff",
      border: "1px solid rgba(111, 92, 194, 0.16)",
      boxShadow: "0 18px 44px rgba(34, 27, 67, 0.10)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.35s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 24px 62px rgba(34, 27, 67, 0.16)"
      },
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 6,
        background: theme.accent
      }
    }}
  >
    <Box>
      <Typography
        sx={{
          fontWeight: 950,
          color: theme.dark,
          mb: 2,
          fontSize: "1rem",
          textAlign: "center",
          fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
        }}
      >
        {title}
      </Typography>

      {[
        ["HOLDER", account?.accountHolderName || fallbackName],
        ["BANK", account?.bankName || "BANK NAME"],
        ["ACC", account?.accountNumber || "ACCOUNT NUMBER"],
        ["IFSC", account?.ifscCode || "IFSC CODE"]
      ].map(([label, value]) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            py: 0.9,
            borderBottom: "1px solid rgba(111, 92, 194, 0.12)"
          }}
        >
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 950, color: theme.text }}>
            {label}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.84rem",
              fontWeight: 700,
              color: theme.muted,
              textAlign: "right",
              wordBreak: "break-word"
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}
    </Box>

    <ActionButton size="small" onClick={onCopy} sx={{ mt: 2, py: 0.85 }}>
      Copy Details
    </ActionButton>
  </Paper>
);

const formatDate = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const getNomineeQrCodes = (dc, nomineeNumber) => {
  const listField = nomineeNumber === 1 ? "nominee1QrCodes" : "nominee2QrCodes";
  const singleField = nomineeNumber === 1 ? "nominee1QrCode" : "nominee2QrCode";

  if (Array.isArray(dc?.[listField]) && dc[listField].length > 0) {
    return dc[listField].filter(Boolean);
  }

  if (dc?.[singleField]) {
    return [dc[singleField]];
  }

  return [];
};

const getDownloadUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("blob:") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
};

const DeathCaseSupportView = ({
  deathCase,
  showAssignedBadge = true,
  uploadButtonText = "Upload Payment Proof",
  onUploadClick,
  onQrError
}) => {
  if (!deathCase) return null;

  const downloadQRCode = (imageUrl, fileName) => {
    if (!imageUrl) {
      if (onQrError) onQrError("QR Code not available.");
      return;
    }

    try {
      const finalUrl = getDownloadUrl(imageUrl);

      const link = document.createElement("a");
      link.href = finalUrl;
      link.download = fileName || "qr-code.png";
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      if (onQrError) onQrError(error?.message || "QR download failed.");
    }
  };

  const copyBankDetails = (title, account, fallbackName) => {
    const bankDetails = `${title}
HOLDER: ${account?.accountHolderName || fallbackName}
BANK: ${account?.bankName || "BANK NAME"}
ACC: ${account?.accountNumber || "ACCOUNT NUMBER"}
IFSC: ${account?.ifscCode || "IFSC CODE"}`;

    navigator.clipboard.writeText(bankDetails).then(() => {
      alert("Bank details copied!");
    }).catch(() => {
      alert("Failed to copy");
    });
  };

  return (
    <Card
      sx={{
        borderRadius: { xs: "28px", md: "38px" },
        background: "#ffffff",
        border: "1px solid rgba(111, 92, 194, 0.16)",
        boxShadow: "0 28px 80px #221b431f",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          background: theme.main
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2.4, md: 4.5 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 4,
            p: { xs: 2, md: 2.5 },
            borderRadius: "26px",
            background: theme.soft,
            border: "1px solid rgba(111, 92, 194, 0.14)"
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            textAlign={{ xs: "center", sm: "left" }}
          >
            {deathCase.userImage ? (
              <CardMedia
                component="img"
                image={deathCase.userImage}
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  border: "4px solid #ffffff",
                  boxShadow: "0 12px 30px rgba(34, 27, 67, 0.20)"
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  background: theme.main,
                  fontWeight: 950,
                  fontSize: "1.6rem",
                  boxShadow: "0 12px 30px rgba(34, 27, 67, 0.20)"
                }}
              >
                {deathCase.deceasedName?.charAt(0) || "श्री"}
              </Avatar>
            )}

            <Box>
              <Typography
                sx={{
                  fontWeight: 950,
                  color: theme.dark,
                  fontSize: { xs: "1.28rem", md: "1.58rem" },
                  fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
                }}
              >
                {deathCase.deceasedName}
              </Typography>

              <Typography sx={{ color: theme.muted, fontWeight: 600, mt: 0.5 }}>
                पंजीयन क्रमांक : {deathCase.employeeCode}
              </Typography>

              <Typography sx={{ color: theme.muted, fontWeight: 600 }}>
                मृत्यु दिनांक : {formatDate(deathCase.caseDate)}
              </Typography>
            </Box>
          </Stack>

          {showAssignedBadge && (
            <Chip
              label="Assigned Support Case"
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                background: theme.accent,
                border: "1px solid rgba(15, 118, 110, 0.25)",
                fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
              }}
            />
          )}
        </Stack>

        {deathCase.description && (
          <InfoBox sx={{ mb: 4 }}>
            <Typography
              sx={{
                color: theme.muted,
                lineHeight: 1.9,
                fontWeight: 650,
                fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
              }}
            >
              {deathCase.description}
            </Typography>
          </InfoBox>
        )}

        {deathCase.certificate1 && (
          <Box sx={{ my: 4 }}>
            <Typography
              sx={{
                fontWeight: 950,
                mb: 2.5,
                textAlign: "center",
                fontSize: { xs: "1.05rem", md: "1.18rem" },
                color: theme.dark,
                letterSpacing: "0.6px"
              }}
            >
              DEATH CERTIFICATE
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src={deathCase.certificate1}
                alt="Death Certificate"
                sx={{
                  maxWidth: { xs: "100%", sm: 270 },
                  maxHeight: 350,
                  objectFit: "contain",
                  borderRadius: "22px",
                  border: "1px solid rgba(111, 92, 194, 0.18)",
                  boxShadow: "0 16px 42px rgba(34, 27, 67, 0.14)",
                  background: "#ffffff",
                  p: 1.2
                }}
              />
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 4, borderColor: "rgba(111, 92, 194, 0.14)" }} />

        <Box>
          <Typography
            sx={{
              fontWeight: 950,
              textAlign: "center",
              mb: 3,
              fontSize: { xs: "1.22rem", md: "1.42rem" },
              color: theme.dark,
              fontFamily: "Poppins, Noto Sans Devanagari, Arial, sans-serif"
            }}
          >
            PAYMENT DETAILS
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            {getNomineeQrCodes(deathCase, 1).map((qrCode, qrIndex) => (
              <Grid item xs={12} sm={6} md={4} key={`nominee1-qr-${qrIndex}`}>
                <QrCard
                  qrCode={qrCode}
                  label={`${deathCase.nominee1Name || deathCase.account1?.accountHolderName || "Nominee 1"} - QR ${qrIndex + 1}`}
                  onDownload={() =>
                    downloadQRCode(
                      qrCode,
                      `QR-Code-Nominee-1-${qrIndex + 1}-${deathCase.deceasedName || "DeathCase"}.png`
                    )
                  }
                />
              </Grid>
            ))}

            {getNomineeQrCodes(deathCase, 2).map((qrCode, qrIndex) => (
              <Grid item xs={12} sm={6} md={4} key={`nominee2-qr-${qrIndex}`}>
                <QrCard
                  qrCode={qrCode}
                  label={`${deathCase.nominee2Name || deathCase.account2?.accountHolderName || "Nominee 2"} - QR ${qrIndex + 1}`}
                  onDownload={() =>
                    downloadQRCode(
                      qrCode,
                      `QR-Code-Nominee-2-${qrIndex + 1}-${deathCase.deceasedName || "DeathCase"}.png`
                    )
                  }
                />
              </Grid>
            ))}

            {getNomineeQrCodes(deathCase, 1).length === 0 &&
              getNomineeQrCodes(deathCase, 2).length === 0 && (
                <Grid item xs={12} sm={6} md={4}>
                  <QrCard
                    qrCode={null}
                    label="QR Not Available"
                    onDownload={() => {
                      if (onQrError) onQrError("QR Code not available.");
                    }}
                  />
                </Grid>
              )}
          </Grid>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <BankDetailsCard
                title="BANK DETAILS 01"
                account={deathCase.account1}
                fallbackName={deathCase.nominee1Name || "Nominee"}
                onCopy={() =>
                  copyBankDetails(
                    "BANK DETAILS 01",
                    deathCase.account1,
                    deathCase.nominee1Name || "Nominee"
                  )
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <BankDetailsCard
                title="BANK DETAILS 02"
                account={deathCase.account2}
                fallbackName={deathCase.nominee2Name || "Nominee"}
                onCopy={() =>
                  copyBankDetails(
                    "BANK DETAILS 02",
                    deathCase.account2,
                    deathCase.nominee2Name || "Nominee"
                  )
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <BankDetailsCard
                title="BANK DETAILS 03"
                account={deathCase.account3}
                fallbackName={deathCase.nominee1Name || "Nominee"}
                onCopy={() =>
                  copyBankDetails(
                    "BANK DETAILS 03",
                    deathCase.account3,
                    deathCase.nominee1Name || "Nominee"
                  )
                }
              />
            </Grid>
          </Grid>
        </Box>

        {onUploadClick && (
          <Box textAlign="center" mt={5}>
            <ActionButton onClick={onUploadClick} sx={{ px: 4, py: 1.2 }}>
              {uploadButtonText}
            </ActionButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DeathCaseSupportView;