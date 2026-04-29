import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { Close, Announcement } from '@mui/icons-material';

const POPUP_STORAGE_KEY = 'pmums_announcement_closed_v1';

const AnnouncementPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already closed the popup
    const hasClosedPopup = localStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasClosedPopup) {
      // Show popup after a small delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Save to localStorage so it won't show again
    localStorage.setItem(POPUP_STORAGE_KEY, 'true');
  };

  const fontFamily = 'Noto Sans Devanagari, Poppins, Arial, sans-serif';

  const theme = {
    dark: '#3b0764',
    main: '#6d28d9',
    light: '#a855f7',
    gold: '#facc15',
    soft: '#f5f3ff',
    text: '#3b2464',
    muted: '#6b5d80',
    danger: '#dc2626',
    warning: '#f59e0b',
    success: '#16a34a',
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: { xs: '24px', md: '32px' },
          overflow: 'hidden',
          maxWidth: '650px',
          width: '95%',
          background: 'rgba(255,255,255,0.96)',
          boxShadow: '0 30px 90px rgba(76, 29, 149, 0.28)',
          border: '1px solid rgba(124, 58, 237, 0.18)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(30, 10, 70, 0.42)',
          backdropFilter: 'blur(6px)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background:
            'radial-gradient(circle at top left, rgba(250,204,21,0.25), transparent 35%), linear-gradient(135deg, #3b0764 0%, #6d28d9 58%, #a855f7 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: { xs: 2, md: 2.3 },
          px: { xs: 2, md: 3 },
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.26)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              flexShrink: 0,
            }}
          >
            <Announcement sx={{ fontSize: 28 }} />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 950,
                fontFamily,
                lineHeight: 1.2,
                fontSize: { xs: '1.05rem', md: '1.25rem' },
              }}
            >
              महत्वपूर्ण सूचना
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: '0.82rem',
                opacity: 0.88,
                fontWeight: 700,
                fontFamily,
              }}
            >
              PMUMS शिक्षक संघ / कर्मचारी कल्याण कोष
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            color: 'white',
            width: 40,
            height: 40,
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.18)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.22)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 0,
          background:
            'radial-gradient(circle at bottom right, rgba(250,204,21,0.13), transparent 32%), linear-gradient(180deg, #ffffff 0%, #fbfaff 48%, #f5f3ff 100%)',
        }}
      >
        <Box sx={{ p: { xs: 2.2, md: 3 } }}>
          <Box
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(124, 58, 237, 0.12)',
              boxShadow: '0 16px 42px rgba(76, 29, 149, 0.08)',
              mb: 2.2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.9,
                color: theme.text,
                fontFamily,
                fontSize: { xs: '0.95rem', md: '1rem' },
                textAlign: 'justify',
                fontWeight: 700,
              }}
            >
              PMUMS शिक्षक संघ की वेबसाइट पर सभी नए एवं पुराने सदस्यों से अनुरोध है कि वे अपनी
              रजिस्ट्रेशन आईडी/नंबर एवं पासवर्ड के माध्यम से लॉगिन करके अपनी प्रोफाइल तुरंत
              अपडेट करें।
            </Typography>
          </Box>

          {/* Special Notice Box */}
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(255,251,235,0.98), rgba(254,243,199,0.78))',
              border: '1px solid rgba(245, 158, 11, 0.36)',
              borderLeft: `6px solid ${theme.warning}`,
              borderRadius: '22px',
              p: { xs: 2, md: 2.3 },
              mb: 2,
              boxShadow: '0 14px 34px rgba(245, 158, 11, 0.10)',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 950,
                color: '#92400e',
                fontFamily,
                fontSize: '1rem',
                mb: 1,
              }}
            >
              विशेष सूचना:
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.text,
                fontFamily,
                fontSize: '0.96rem',
                lineHeight: 1.85,
                fontWeight: 700,
              }}
            >
              14 दिसंबर 2025 (सुबह तक) किए गए सभी रजिस्ट्रेशन का डिफ़ॉल्ट पासवर्ड:{' '}
              <Box
                component="strong"
                sx={{
                  color: theme.danger,
                  background: '#fff',
                  px: 1,
                  py: 0.25,
                  borderRadius: '8px',
                  border: '1px solid rgba(220,38,38,0.15)',
                  whiteSpace: 'nowrap',
                }}
              >
                Shub@123
              </Box>{' '}
              है। कृपया अपने रजिस्ट्रेशन नंबर और इस पासवर्ड का उपयोग करके लॉगिन करें।
            </Typography>
          </Box>

          {/* Warning Box */}
          <Box
            sx={{
              background:
                'linear-gradient(135deg, rgba(254,242,242,0.98), rgba(255,228,230,0.74))',
              border: '1px solid rgba(220, 38, 38, 0.24)',
              borderLeft: `6px solid ${theme.danger}`,
              borderRadius: '22px',
              p: { xs: 2, md: 2.3 },
              mb: 2,
              boxShadow: '0 14px 34px rgba(220, 38, 38, 0.08)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#991b1b',
                fontFamily,
                fontSize: '0.96rem',
                lineHeight: 1.85,
                fontWeight: 850,
              }}
            >
              लॉगिन के बाद कृपया अपना पासवर्ड तुरंत बदलकर सुरक्षित करें (नया पासवर्ड किसी के साथ
              साझा न करें)।
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 2, md: 2.3 },
              borderRadius: '22px',
              background: 'rgba(245,243,255,0.78)',
              border: '1px solid rgba(124, 58, 237, 0.12)',
              mb: 2.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.text,
                fontFamily,
                fontSize: '0.96rem',
                lineHeight: 1.9,
                fontWeight: 700,
                textAlign: 'justify',
              }}
            >
              कृपया अपना रजिस्ट्रेशन नंबर व पासवर्ड सुरक्षित रखें। साथ ही संभाग, जिला, ब्लॉक,
              संकुल/संस्था, मोबाइल नंबर, पद, वर्तमान कार्यस्थल आदि सभी महत्वपूर्ण जानकारी सही-सही
              भरें, ताकि भविष्य में किसी भी प्रकार की समस्या या असुविधा न हो।
            </Typography>
          </Box>

          {/* Signature */}
          <Box
            sx={{
              borderTop: '1px solid rgba(124, 58, 237, 0.14)',
              pt: 2,
              textAlign: 'right',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.muted,
                fontFamily,
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              सादर,
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontWeight: 950,
                color: theme.dark,
                fontFamily,
                fontSize: '1.05rem',
                mt: 0.3,
              }}
            >
              सतीश खरे
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.muted,
                fontFamily,
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              संस्थापक
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.main,
                fontWeight: 950,
                fontFamily,
                fontSize: '0.92rem',
              }}
            >
              PMUMS शिक्षक संघ / कर्मचारी कल्याण कोष
            </Typography>
          </Box>
        </Box>

        {/* Footer Button */}
        <Box
          sx={{
            p: { xs: 2, md: 2.3 },
            background: 'rgba(245,243,255,0.95)',
            borderTop: '1px solid rgba(124, 58, 237, 0.14)',
            textAlign: 'center',
          }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              background: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)',
              color: 'white',
              fontWeight: 950,
              px: 5,
              py: 1.2,
              borderRadius: '16px',
              fontFamily,
              textTransform: 'none',
              boxShadow: '0 14px 34px rgba(109, 40, 217, 0.28)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 100%)',
                boxShadow: '0 18px 42px rgba(109, 40, 217, 0.36)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            समझ गया (OK)
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementPopup;