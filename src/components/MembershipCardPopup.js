import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import {
  Close,
  Download,
  Person,
  Badge,
  PhoneAndroid,
  AccountBalance,
  CalendarMonth,
  Shield,
  Verified
} from '@mui/icons-material';
import html2canvas from 'html2canvas';

const formatDate = (value) => {
  if (!value) return new Date().toLocaleDateString('en-IN');

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px 118px 1fr',
        alignItems: 'center',
        gap: 1,
        py: 0.75,
        borderBottom: '1px solid rgba(6, 30, 73, 0.13)'
      }}
    >
      <Box
        sx={{
          width: 34,
height: 34,
          bgcolor: '#06275A',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          clipPath:
            'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)',
          flexShrink: 0
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: 12.5,
          color: '#102A56',
          fontWeight: 700,
          lineHeight: 1.2,
          borderRight: '2px solid rgba(6, 30, 73, 0.18)',
          pr: 1
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          color: '#061E49',
          fontWeight: 900,
          lineHeight: 1.25,
          wordBreak: 'break-word'
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  );
};

const MembershipCardPopup = ({ open, onClose, memberData }) => {
  const cardRef = useRef(null);

  const fullName =
    memberData?.fullName ||
    memberData?.name ||
    [memberData?.firstName, memberData?.surname].filter(Boolean).join(' ') ||
    'शिक्षक';

  const registrationNumber =
    memberData?.registrationNumber ||
    memberData?.id ||
    '-';

  const mobileNumber = memberData?.mobileNumber || '-';
  const department = memberData?.department || '-';

  const registrationDate = formatDate(
    memberData?.registrationDate ||
      memberData?.createdAt ||
      memberData?.registrationDateOverride
  );

  const firstLetter = String(fullName || 'शिक्षक').charAt(0).toUpperCase();

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      backgroundColor: '#ffffff',
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    });

    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `membership-card-${registrationNumber || 'member'}.png`;
    link.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
     PaperProps={{
  sx: {
    borderRadius: 4,
    overflow: 'hidden',
    bgcolor: '#F3F6FB',
    maxHeight: '100vh'
  }
}}
    >
      <DialogTitle
        sx={{
          bgcolor: '#061E49',
          color: '#fff',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.6
        }}
      >
        Membership Card Preview

        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
  sx={{
    p: { xs: 1, sm: 1.5 },
    bgcolor: '#EEF3FA',
    overflow: 'hidden'
  }}
>
        <Box
          ref={cardRef}
        sx={{
  width: '100%',
  maxWidth: 430,
  mx: 'auto',
  bgcolor: '#fff',
  borderRadius: '26px',
  overflow: 'hidden',
  position: 'relative',
  border: '3px solid #E5E7EB',
  boxShadow: '0 18px 40px rgba(2, 12, 32, 0.22)'
}}
        >
          {/* Header */}
          <Box
            sx={{
              position: 'relative',
              height: 165,
              bgcolor: '#061E49',
              color: '#fff',
              textAlign: 'center',
             px: 2,
pt: 2.5,
              overflow: 'hidden',
              background:
                'linear-gradient(135deg, #03142F 0%, #06275A 58%, #041A3E 100%)'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.18,
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.38) 1px, transparent 1px)',
                backgroundSize: '18px 18px'
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: -65,
                left: -80,
                width: 210,
                height: 210,
                bgcolor: 'rgba(255,255,255,0.06)',
                transform: 'rotate(38deg)',
                borderRadius: 4
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: -80,
                right: -70,
                width: 210,
                height: 210,
                bgcolor: 'rgba(255,255,255,0.06)',
                transform: 'rotate(-38deg)',
                borderRadius: 4
              }}
            />

            <Typography
              sx={{
                position: 'relative',
                zIndex: 2,
               fontSize: { xs: 25, sm: 32 },
                fontWeight: 950,
                lineHeight: 1.05,
                letterSpacing: '-1px',
                textShadow: '0 7px 20px rgba(0,0,0,0.28)'
              }}
            >
              PMUMS शिक्षक संघ
            </Typography>

            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
              mt: 1.3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1.2
              }}
            >
<Box sx={{ width: 45, height: 2, bgcolor: '#FF8A00' }} />              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF8A00' }} />

              <Typography
                sx={{
                  fontSize: { xs: 15, sm: 17 },
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                Membership / ID Card
              </Typography>

              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF8A00' }} />
<Box sx={{ width: 45, height: 2, bgcolor: '#FF8A00' }} />            </Box>

            {/* Wave bottom */}
            <Box
              sx={{
                position: 'absolute',
                left: -45,
                right: -45,
                bottom: -58,
                height: 118,
                bgcolor: '#FF8A00',
                borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                transform: 'rotate(-2deg)'
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                left: -50,
                right: -50,
                bottom: -78,
                height: 122,
                bgcolor: '#fff',
                borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                transform: 'rotate(2deg)'
              }}
            />
          </Box>

          {/* Body */}
          <Box
            sx={{
              position: 'relative',
              px: { xs: 2.3, sm: 4 },
            pt: 7.5,
pb: 1.3,
              bgcolor: '#fff',
              backgroundImage:
                'radial-gradient(circle at 5% 40%, rgba(6,39,90,0.06) 0 1px, transparent 2px), radial-gradient(circle at 95% 70%, rgba(255,138,0,0.05) 0 1px, transparent 2px)',
              backgroundSize: '18px 18px'
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                position: 'absolute',
                
                left: '50%',
                transform: 'translateX(-50%)',
                top: -58,
width: 118,
height: 118,
                borderRadius: '50%',
                bgcolor: '#fff',
                border: '5px solid #06275A',
                boxShadow: '0 14px 35px rgba(6, 39, 90, 0.28)',
                p: '7px',
                zIndex: 5
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid #FF8A00',
                  bgcolor:
                    'linear-gradient(145deg, #F4F6FA 0%, #D7DEE9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  sx={{
                    fontSize: 44,
                    fontWeight: 950,
                    color: '#061E49',
                    opacity: 0.82
                  }}
                >
                  {firstLetter}
                </Typography>
              </Box>
            </Box>

            {/* Seal */}
            <Box
              sx={{
                position: 'absolute',
                top: 28,
                right: { xs: 16, sm: 32 },
                width: 78,
                height: 78,
                borderRadius: '50%',
                border: '4px solid #06275A',
                bgcolor: '#fff',
                color: '#06275A',
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px rgba(6,39,90,0.18)'
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  border: '2px dashed #FF8A00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Verified sx={{ fontSize: 24, color: '#FF8A00' }} />
                <Typography sx={{ fontSize: 10, fontWeight: 900 }}>
                  PMUMS
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 950,
                color: '#061E49',
                lineHeight: 1.2
              }}
            >
              {fullName}
            </Typography>

            <Typography
              sx={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 800,
                color: '#FF8A00',
                letterSpacing: '0.4px',
                mt: 0.5,
                mb: 1
              }}
            >
              सदस्यता प्रमाण पत्र
            </Typography>

            <Box>
              <InfoRow
                icon={<Person sx={{ fontSize: 19 }} />}
                label="Full Name"
                value={fullName}
              />

              <InfoRow
                icon={<Badge sx={{ fontSize: 23 }} />}
                label="Registration No."
                value={registrationNumber}
              />

              <InfoRow
                icon={<PhoneAndroid sx={{ fontSize: 23 }} />}
                label="Mobile No."
                value={mobileNumber}
              />

              <InfoRow
                icon={<AccountBalance sx={{ fontSize: 23 }} />}
                label="Department"
                value={department}
              />

              <InfoRow
                icon={<CalendarMonth sx={{ fontSize: 23 }} />}
                label="Registration Date"
                value={registrationDate}
              />
            </Box>

            <Box
              sx={{
                mt: 2.3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.2
              }}
            >
<Box sx={{ width: 45, height: 2, bgcolor: '#FF8A00' }} />              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '3px solid #06275A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#fff'
                }}
              >
                <Shield sx={{ color: '#06275A', fontSize: 25 }} />
              </Box>
<Box sx={{ width: 45, height: 2, bgcolor: '#FF8A00' }} />            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              position: 'relative',
              bgcolor: '#061E49',
              color: '#fff',
              px: 3,
              py: 2.1,
              textAlign: 'center',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: -30,
                right: -30,
                top: -58,
                height: 74,
                bgcolor: '#FF8A00',
                borderRadius: '0 0 50% 50% / 0 0 100% 100%'
              }}
            />

            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap'
              }}
            >
              <Shield sx={{ color: '#FF8A00', fontSize: 22 }} />

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1.4
                }}
              >
                यह कार्ड PMUMS शिक्षक संघ की सदस्यता जानकारी हेतु है।
              </Typography>
            </Box>
          </Box>
        </Box>

       
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            color: '#061E49',
            fontWeight: 800
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{
            bgcolor: '#061E49',
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            fontWeight: 900,
            boxShadow: '0 8px 20px rgba(6, 30, 73, 0.25)',
            '&:hover': {
              bgcolor: '#041735'
            }
          }}
        >
          Download Card
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipCardPopup;