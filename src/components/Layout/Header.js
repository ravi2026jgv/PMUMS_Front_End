import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
} from '@mui/material';
import {
  AccountCircle,
  Home,
  Login,
  PersonAdd,
  ExitToApp,
  Dashboard,
  Person,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleClose();
  };

  const navigationItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: "TEACHER'S LIST", path: '/teachers-list' },
    { label: 'SAHYOG LIST', path: '/sahyog-list' },
    { label: 'ASAHYOG LIST', path: '/asahyog-list' },
    { label: 'NIYAMAWALI', path: '/niyamawali' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <>
      {/* Top Header - Organization Info */}
      <Box
        sx={{
          background: '#ffffff',
          borderBottom: '2px solid #1E3A8A',
          py: 1
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#1E3A8A',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.2
            }}
          >
            प्राथमिक माध्यमिक उच्च माध्यमिक शिक्षक संघ म.प्र. पंजीयन क्रमांक : 06/13/01/14017/23 पता : सुभाष पुरम रोड, हेलीपेड के पीछे, टीकमगढ़ (म. प्र.)
          </Typography>
        </Container>
      </Box>

      {/* Main Navigation Header */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1E3A8A 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            px: 0, 
            py: 1, 
            minHeight: { xs: '60px', md: '70px' },
            justifyContent: 'space-evenly'
          }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Box sx={{ 
                width: { xs: 50, md: 60 }, 
                height: { xs: 50, md: 60 }, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#FFFFFF',
                borderRadius: '50%',
                p: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src="/pmums logo.png" 
                  alt="PMUMS Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: 0.5
            }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 1,
                    textTransform: 'uppercase',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Auth Buttons */}
              {isAuthenticated && (
                <>
                  <Button
                    component={Link}
                    to="/dashboard"
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                      textTransform: 'uppercase',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    DASHBOARD
                  </Button>
                  
                  {/* User Menu */}
                  <div>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                      sx={{
                        ml: 1
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem 
                        component={Link}
                        to="/profile"
                        onClick={handleClose}
                        sx={{ color: 'primary.main' }}
                      >
                        <AccountCircle sx={{ mr: 1 }} />
                        प्रोफाइल
                      </MenuItem>
                      <MenuItem 
                        onClick={handleLogout} 
                        sx={{ color: 'primary.main' }}
                      >
                        <ExitToApp sx={{ mr: 1 }} />
                        लॉगआउट
                      </MenuItem>
                    </Menu>
                  </div>
                </>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
              <IconButton
                size="large"
                aria-label="mobile menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenu}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
              >
                {navigationItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    component={Link} 
                    to={item.path} 
                    onClick={handleMobileMenuClose}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                {isAuthenticated && (
                  <>
                    <MenuItem component={Link} to="/dashboard" onClick={handleMobileMenuClose}>
                      DASHBOARD
                    </MenuItem>
                    <MenuItem component={Link} to="/profile" onClick={handleMobileMenuClose}>
                      PROFILE
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      LOGOUT
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;