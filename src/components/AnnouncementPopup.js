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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          maxWidth: '600px',
          width: '95%',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #303f9f 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Announcement sx={{ fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
            महत्वपूर्ण सूचना
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.9,
              color: '#333',
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
              fontSize: '1rem',
              textAlign: 'justify',
              mb: 2
            }}
          >
            PMUMS शिक्षक संघ की वेबसाइट पर सभी नए एवं पुराने सदस्यों से अनुरोध है कि वे अपनी रजिस्ट्रेशन आईडी/नंबर एवं पासवर्ड के माध्यम से लॉगिन करके अपनी प्रोफाइल तुरंत अपडेट करें।
          </Typography>

          {/* Special Notice Box */}
          <Box
            sx={{
              backgroundColor: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: 2,
              p: 2,
              mb: 2
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#e65100',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '0.95rem',
                mb: 1
              }}
            >
              विशेष सूचना:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#333',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '0.95rem',
                lineHeight: 1.8
              }}
            >
              14 दिसंबर 2025 (सुबह तक) किए गए सभी रजिस्ट्रेशन का डिफ़ॉल्ट पासवर्ड: <strong style={{ color: '#d32f2f' }}>Shub@123</strong> है। कृपया अपने रजिस्ट्रेशन नंबर और इस पासवर्ड का उपयोग करके लॉगिन करें।
            </Typography>
          </Box>

          {/* Warning Box */}
          <Box
            sx={{
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: 2,
              p: 2,
              mb: 2
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#c62828',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '0.95rem',
                lineHeight: 1.8
              }}
            >
              लॉगिन के बाद कृपया अपना पासवर्ड तुरंत बदलकर सुरक्षित करें (नया पासवर्ड किसी के साथ साझा न करें)।
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#333',
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              mb: 3
            }}
          >
            कृपया अपना रजिस्ट्रेशन नंबर व पासवर्ड सुरक्षित रखें। साथ ही संभाग, जिला, ब्लॉक, संकुल/संस्था, मोबाइल नंबर, पद, वर्तमान कार्यस्थल आदि सभी महत्वपूर्ण जानकारी सही-सही भरें, ताकि भविष्य में किसी भी प्रकार की समस्या या असुविधा न हो।
          </Typography>

          {/* Signature */}
          <Box
            sx={{
              borderTop: '1px solid #e0e0e0',
              pt: 2,
              textAlign: 'right'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '0.9rem'
              }}
            >
              सादर,
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: '#1a237e',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '1rem'
              }}
            >
              सतीश खरे
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '0.9rem'
              }}
            >
              संस्थापक
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#FF9933',
                fontWeight: 600,
                fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
                fontSize: '0.9rem'
              }}
            >
              PMUMS शिक्षक संघ / कर्मचारी कल्याण कोष
            </Typography>
          </Box>
        </Box>

        {/* Footer Button */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f5f5f5',
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center'
          }}
        >
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              background: 'linear-gradient(135deg, #FF9933 0%, #f57c00 100%)',
              color: 'white',
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: 2,
              fontFamily: 'Noto Sans Devanagari, Arial, sans-serif',
              '&:hover': {
                background: 'linear-gradient(135deg, #e6851a 0%, #ef6c00 100%)'
              }
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
