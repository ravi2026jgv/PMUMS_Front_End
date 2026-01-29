import React, { useState } from 'react';
import {
  Box,
  Fab,
  Tooltip,
  Zoom,
  Paper,
  Typography,
  IconButton,
  Fade
} from '@mui/material';
import {
  WhatsApp,
  Close,
  Send
} from '@mui/icons-material';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  // WhatsApp configuration
  const whatsappNumber = '+919876543210'; // Replace with your actual WhatsApp number
  const defaultMessage = 'Hi, I need help with PMUMS Front End!';
  const channelLink = 'https://whatsapp.com/channel/0029Vaw20ci5K3zZkmv3jV1g';
  
  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappNumber.replace(/\D/g, ''); // Remove non-digits
    const textMessage = defaultMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChannelClick = () => {
    window.open(channelLink, '_blank');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      handleWhatsAppClick();
      setMessage('');
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <Fade in={isOpen} timeout={300}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            width: 320,
            height: 400,
            zIndex: 9999,
            borderRadius: 3,
            overflow: 'hidden',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WhatsApp />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  PMUMS Support
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Typically replies within a minute
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={toggleChat}
              sx={{ color: 'white', p: 0.5 }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Chat Content */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              bgcolor: '#ECE5DD',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill-opacity="0.03"%3E%3Cpolygon fill="%23000" points="50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40"/%3E%3C/g%3E%3C/svg%3E")'
            }}
          >
            {/* Welcome Message */}
            <Box
              sx={{
                bgcolor: 'white',
                p: 2,
                borderRadius: '18px 18px 18px 4px',
                maxWidth: '80%',
                alignSelf: 'flex-start',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="body2">
                Hi, Welcome to PMUMS! 👋
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                How can we help you?
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#666',
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5
                }}
              >
                12:10 pm
              </Typography>
            </Box>

            {/* Channel Link */}
            <Box
              sx={{
                bgcolor: '#DCF8C6',
                p: 2,
                borderRadius: '18px 18px 4px 18px',
                maxWidth: '85%',
                alignSelf: 'flex-end',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#D4F4C4'
                }
              }}
              onClick={handleChannelClick}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                📢 Follow our WhatsApp Channel
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: '#0066cc' }}>
                पी एम यू एम कल्याण कोष
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#128C7E',
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  textDecoration: 'underline'
                }}
              >
                Click to join →
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Message Input Area */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'flex-end'
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  bgcolor: 'white',
                  borderRadius: '20px',
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    background: 'transparent',
                    color: '#333',
                    fontSize: '14px'
                  }}
                />
              </Box>
              <Fab
                size="small"
                onClick={handleSendMessage}
                sx={{
                  bgcolor: '#25D366',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#128C7E'
                  },
                  width: 40,
                  height: 40
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </Fab>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              py: 1,
              bgcolor: '#f5f5f5',
              borderTop: '1px solid #e0e0e0'
            }}
          >
            <Typography variant="caption" sx={{ color: '#666' }}>
              Powered by WhatsApp
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Floating Action Button */}
      <Zoom in={true} timeout={300}>
        <Tooltip
          title="Chat with us on WhatsApp"
          placement="left"
          arrow
        >
          <Fab
            onClick={handleWhatsAppClick}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 10000,
              bgcolor: '#25D366',
              color: 'white',
              width: 60,
              height: 60,
              '&:hover': {
                bgcolor: '#128C7E',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              animation: 'pulse 2s infinite'
            }}
          >
            <WhatsApp sx={{ fontSize: 32 }} />
          </Fab>
        </Tooltip>
      </Zoom>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          }
          50% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.8);
          }
          100% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingWhatsApp;