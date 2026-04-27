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
  ExitToApp,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
const [showSelfDonationNav, setShowSelfDonationNav] = React.useState(false);


React.useEffect(() => {
  const loadSelfDonationSetting = async () => {
    try {
      const response = await adminAPI.getPublicSelfDonationSettings();
      setShowSelfDonationNav(response.data?.selfDonationVisible === true);
    } catch (error) {
      console.error('Error loading self donation visibility:', error);
      setShowSelfDonationNav(false);
    }
  };

  loadSelfDonationSetting();
}, []);
  console.log('Header component rendering');
  console.log('User:', user);
  console.log('Is authenticated:', isAuthenticated);

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
  { label: 'OUR MEMBERS', path: '/teachers-list' },
   { label: 'PENDING PROFILES', path: '/pending-profiles' },
  { label: 'LATE TEACHERS LIST', path: 'https://pmums.in/death-case/', external: true },
  { label: 'SAHYOG LIST', path: '/sahyog-list' },
  { label: 'ASAHYOG LIST', path: '/asahyog-list' },
 { label: 'NO UTR LIST', path: '/zero-utr-list' },
  { label: 'NIYAMAWALI', path: '/niyamawali' },
  { label: 'CONTACT US', path: '/contact-us' },
  //  ...(showSelfDonationNav ? [{ label: 'SANSTHA SAHYOG', path: '/self-donation' }] : []),
  { label: 'SANSTHA SAHYOG', path: '/self-donation' }
];

  return (
    <>
      {/* Top Header - Organization Info */}
      <Box
        sx={{
background: 'linear-gradient(90deg, #f5f3ff, #fdf4ff)',
color: '#4c1d95',borderBottom: '1px solid rgba(0,0,0,0.08)',
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
  position="sticky"
  elevation={0} 
  sx={{ 
background: `
  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 40%),
  radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1), transparent 40%),
  linear-gradient(135deg, #3b0764 0%, #6d28d9 40%, #9333ea 70%, #c084fc 100%)
`,    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
  }}
>
  <Box sx={{ width: '100%', px: { xs: 2, md: 4 } }}>
          <Toolbar sx={{ 
            px: 0, 
            py: 1, 
            minHeight: { xs: '60px', md: '70px' },
justifyContent: 'space-between',
px: { xs: 2, md: 3 },          }}>
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
               bgcolor: 'rgba(255,255,255,0.9)',
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
gap: 1.5,
ml: 3,
            }}>
              {navigationItems.map((item) => (
                item.external ? (
                  <Button
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                   sx={{
  color: 'white',
  fontWeight: 500,
  fontSize: '0.8rem',
  px: 2,
  py: 0.8,
  borderRadius: '8px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  transition: 'all 0.25s ease',

  '&:hover': {
    background: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-1px)',
  }
}}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
  color: 'white',
  fontWeight: 500,
  fontSize: '0.8rem',
  px: 2,
  py: 0.8,
  borderRadius: '8px',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  transition: 'all 0.25s ease',

  '&:hover': {
    background: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-1px)',
  }
}}
                  >
                    {item.label}
                  </Button>
                )
              ))}

              {/* Auth Buttons */}
              {isAuthenticated && (
                <>
                  {/* Role-based Dashboard Links */}
                 {(user?.role === 'SUPERADMIN' || user?.role === 'ROLE_SUPERADMIN' ||
  user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') && (
  <Button
    component={Link}
    to="/admin/dashboard"
sx={{
  position: 'relative',
  overflow: 'hidden',

  background: user?.role === '' || user?.role === ''
    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
    : 'linear-gradient(135deg, #ef4444, #f87171)',

  color: '#fff',
  fontWeight: 600,
  fontSize: '0.8rem',

  px: 3,
  py: 1.1,
  ml: 2,

  borderRadius: '14px',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',

  backdropFilter: 'blur(6px)',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: user?.role === '' || user?.role === ''
    ? '0 6px 20px rgba(124, 58, 237, 0.5)'
    : '0 6px 20px rgba(239, 68, 68, 0.5)',

  transition: 'all 0.35s ease',

  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: user?.role === '' || user?.role === ''
      ? '0 10px 30px rgba(124, 58, 237, 0.7)'
      : '0 10px 30px rgba(239, 68, 68, 0.7)',
  },

  '&:active': {
    transform: 'scale(0.96)',
  },

  // ✨ Shine animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent)',
    transition: 'all 0.6s ease',
  },

  '&:hover::before': {
    left: '100%',
  },
}}  >
    {user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
      ? 'SUPER ADMIN DASHBOARD'
      : 'ADMIN DASHBOARD'}
  </Button>
)}
                  {/* Manager Dashboard - For Manager Roles */}
                  {(user?.role === 'SAMBHAG_MANAGER' || user?.role === 'ROLE_SAMBHAG_MANAGER' || 
                    user?.role === 'DISTRICT_MANAGER' || user?.role === 'ROLE_DISTRICT_MANAGER' || 
                    user?.role === 'BLOCK_MANAGER' || user?.role === 'ROLE_BLOCK_MANAGER') && (
                    <Button
                      component={Link}
                      to="/manager/dashboard"
                     sx={{
  position: 'relative',
  overflow: 'hidden',

  background: user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
    : 'linear-gradient(135deg, #ef4444, #f87171)',

  color: '#fff',
  fontWeight: 600,
  fontSize: '0.8rem',

  px: 3,
  py: 1.1,
  ml: 2,

  borderRadius: '14px',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',

  backdropFilter: 'blur(6px)',
  border: '1px solid rgba(255,255,255,0.15)',

  boxShadow: user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
    ? '0 6px 20px rgba(124, 58, 237, 0.5)'
    : '0 6px 20px rgba(239, 68, 68, 0.5)',

  transition: 'all 0.35s ease',

  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
      ? '0 10px 30px rgba(124, 58, 237, 0.7)'
      : '0 10px 30px rgba(239, 68, 68, 0.7)',
  },

  '&:active': {
    transform: 'scale(0.96)',
  },

  // ✨ Shine animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent)',
    transition: 'all 0.6s ease',
  },

  '&:hover::before': {
    left: '100%',
  },
}}
                    >
                      MANAGER DASHBOARD
                    </Button>
                  )}

                  
                  {/* User Menu */}
                  <>
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
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.25)' }}>
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
                  </>
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
                  item.external ? (
                    <MenuItem 
                      key={item.path}
                      component="a"
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleMobileMenuClose}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {item.label}
                    </MenuItem>
                  ) : (
                    <MenuItem 
                      key={item.path}
                      component={Link} 
                      to={item.path} 
                      onClick={handleMobileMenuClose}
                    >
                      {item.label}
                    </MenuItem>
                  )
                ))}
                {isAuthenticated && (
                  <>
                    {/* Role-based Dashboard Links for Mobile */}
                    {(user?.role === 'SUPERADMIN' || user?.role === 'ROLE_SUPERADMIN' ||
  user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') && (
  <Button
    component={Link}
    to="/admin/dashboard"
    sx={{
      bgcolor: user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN' ? '#7c3aed' : '#dc2626',
      color: 'white',
      fontWeight: 600,
      fontSize: '0.9rem',
      px: 2,
      py: 1,
      textTransform: 'uppercase',
      '&:hover': {
        bgcolor: user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN' ? '#6d28d9' : '#b91c1c'
      }
    }}
  >
    {user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
      ? 'SUPER ADMIN DASHBOARD'
      : 'ADMIN DASHBOARD'}
  </Button>
)}
                    
                    {/* Manager Dashboard - Unified for all manager roles */}
                    {(user?.role === 'SAMBHAG_MANAGER' || user?.role === 'ROLE_SAMBHAG_MANAGER' || 
                      user?.role === 'DISTRICT_MANAGER' || user?.role === 'ROLE_DISTRICT_MANAGER' ||
                      user?.role === 'BLOCK_MANAGER' || user?.role === 'ROLE_BLOCK_MANAGER') && (
                      <MenuItem 
                        component={Link} 
                        to="/manager/dashboard" 
                        onClick={handleMobileMenuClose}
                        sx={{ 
                          bgcolor: '#7c3aed', 
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#6d28d9'
                          }
                        }}
                      >
                        MANAGER DASHBOARD
                      </MenuItem>
                    )}
                    
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
        </Box>
      </AppBar>
    </>
  );
};

export default Header;