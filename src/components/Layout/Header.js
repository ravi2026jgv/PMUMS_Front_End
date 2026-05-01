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
  Divider
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Menu as MenuIcon,
  KeyboardArrowDown
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [listMenuAnchor, setListMenuAnchor] = React.useState(null);
  const [mobileListMenuAnchor, setMobileListMenuAnchor] = React.useState(null);
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
    setMobileListMenuAnchor(null);
  };

  const handleListMenuOpen = (event) => {
    setListMenuAnchor(event.currentTarget);
  };

  const handleListMenuClose = () => {
    setListMenuAnchor(null);
  };

  const handleMobileListMenuOpen = (event) => {
    setMobileListMenuAnchor(event.currentTarget);
  };

  const handleMobileListMenuClose = () => {
    setMobileListMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleClose();
    handleMobileMenuClose();
  };

  const mainNavigationItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'NIYAMAWALI', path: '/niyamawali' },
    { label: 'SANSTHA SAHYOG', path: '/self-donation' },
    { label: 'CONTACT US', path: '/contact-us' }
  ];

  const listNavigationItems = [
    { label: 'OUR MEMBERS', path: '/teachers-list' },
    { label: 'PENDING PROFILES', path: '/pending-profiles' },
    { label: 'LATE TEACHERS LIST', path: 'https://pmums.in/death-case/', external: true },
    { label: 'SAHYOG LIST', path: '/sahyog-list' },
    { label: 'ASAHYOG LIST', path: '/asahyog-list' },
    { label: 'NO UTR LIST', path: '/zero-utr-list' }
  ];

const navButtonSx = {
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '0.82rem',
  px: 1.8,
  py: 0.9,
  borderRadius: '6px',
  letterSpacing: '0.3px',
  textTransform: 'uppercase',
  fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: 'rgba(185, 167, 255, 0.18)',
    color: '#dcd4ff'
  }
};
 const dashboardButtonSx = {
  backgroundColor: '#6f5cc2',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '0.8rem',
  px: 2.5,
  py: 1,
  ml: 1.5,
  borderRadius: '8px',
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
  fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)',
  '&:hover': {
    backgroundColor: '#5a48ad',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.28)'
  }
};

  const renderNavigationButton = (item) => {
    if (item.external) {
      return (
        <Button
          key={item.path}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          sx={navButtonSx}
        >
          {item.label}
        </Button>
      );
    }

    return (
      <Button
        key={item.path}
        component={Link}
        to={item.path}
        sx={navButtonSx}
      >
        {item.label}
      </Button>
    );
  };

  return (
    <>
      {/* Top Header - Organization Info */}
      <Box
        sx={{
  backgroundColor: '#f4f2fb',
  color: '#221b43',
  borderBottom: '1px solid #ded8f5',
  py: 0.8
}}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
             color: '#221b43',
              fontWeight: 600,
              fontSize: { xs: '0.78rem', sm: '0.88rem', md: '0.98rem' },
              lineHeight: 1.45,
              fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
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
  backgroundColor: '#221b43',
  borderBottom: '3px solid #6f5cc2',
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.20)'
}}
      >
        <Box sx={{ width: '100%', px: { xs: 1.5, md: 4 } }}>
          <Toolbar
            sx={{
              px: { xs: 1, md: 2 },
              py: 1,
              minHeight: { xs: '62px', md: '72px' },
              justifyContent: 'space-between'
            }}
          >
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
              <Box
                sx={{
                  width: { xs: 52, md: 62 },
                  height: { xs: 52, md: 62 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  p: 1,
                 border: '2px solid #b9a7ff',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.22)'
                }}
              >
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
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                ml: 3
              }}
            >
              {mainNavigationItems.map((item) => renderNavigationButton(item))}

              {/* Lists Dropdown */}
              <Button
                onClick={handleListMenuOpen}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  ...navButtonSx,
backgroundColor: Boolean(listMenuAnchor)
  ? 'rgba(185, 167, 255, 0.18)'
  : 'transparent',
color: Boolean(listMenuAnchor) ? '#dcd4ff' : '#ffffff'                }}
              >
                User Services
              </Button>

              <Menu
                anchorEl={listMenuAnchor}
                open={Boolean(listMenuAnchor)}
                onClose={handleListMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 230,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #ded8f5',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.20)'
                  }
                }}
              >
                {listNavigationItems.map((item) =>
                  item.external ? (
                    <MenuItem
                      key={item.path}
                      component="a"
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleListMenuClose}
                      sx={{
                        fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                        fontSize: '0.9rem',
                        color: '#2f2f3a',
                        py: 1.2,
                        '&:hover': {
  backgroundColor: '#f4f2fb',
  color: '#221b43'
}
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={item.path}
                      component={Link}
                      to={item.path}
                      onClick={handleListMenuClose}
                      sx={{
                        fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif',
                        fontSize: '0.9rem',
                        color: '#2f2f3a',
                        py: 1.2,
                       '&:hover': {
  backgroundColor: '#f4f2fb',
  color: '#221b43'
}
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  )
                )}
              </Menu>

              {/* Auth Buttons */}
              {isAuthenticated && (
                <>
                  {(user?.role === 'SUPERADMIN' ||
                    user?.role === 'ROLE_SUPERADMIN' ||
                    user?.role === 'ADMIN' ||
                    user?.role === 'ROLE_ADMIN') && (
                    <Button
                      component={Link}
                      to="/admin/dashboard"
                      sx={dashboardButtonSx}
                    >
                      {user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
                        ? 'SUPER ADMIN DASHBOARD'
                        : 'ADMIN DASHBOARD'}
                    </Button>
                  )}

                  {(user?.role === 'SAMBHAG_MANAGER' ||
                    user?.role === 'ROLE_SAMBHAG_MANAGER' ||
                    user?.role === 'DISTRICT_MANAGER' ||
                    user?.role === 'ROLE_DISTRICT_MANAGER' ||
                    user?.role === 'BLOCK_MANAGER' ||
                    user?.role === 'ROLE_BLOCK_MANAGER') && (
                    <Button
                      component={Link}
                      to="/manager/dashboard"
                      sx={{
                        ...dashboardButtonSx,
                        backgroundColor: '#5b4b8a',
                        '&:hover': {
                          backgroundColor: '#493b74'
                        }
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
                      sx={{ ml: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          backgroundColor: '#f4f2fb',
                          color: '#252044',
                          fontWeight: 700
                        }}
                      >
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </IconButton>

                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          borderRadius: 2,
                          minWidth: 180,
                          border: '1px solid #ddd1b2'
                        }
                      }}
                    >
                      <MenuItem
                        component={Link}
                        to="/profile"
                        onClick={handleClose}
                        sx={{
                          color: '#252044',
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                        }}
                      >
                        <AccountCircle sx={{ mr: 1 }} />
                        प्रोफाइल
                      </MenuItem>

                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          color: '#922f2f',
                          fontFamily: 'Poppins, Noto Sans Devanagari, Arial, sans-serif'
                        }}
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
                sx={{ color: '#ffffff' }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 260,
                    borderRadius: 2,
                    border: '1px solid #ddd1b2'
                  }
                }}
              >
                {mainNavigationItems.map((item) =>
                  item.external ? (
                    <MenuItem
                      key={item.path}
                      component="a"
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleMobileMenuClose}
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
                )}

                <Divider />

                <MenuItem
                  onClick={handleMobileListMenuOpen}
                  sx={{
                    fontWeight: 700,
                    color: '#252044'
                  }}
                >
                  LISTS
                  <KeyboardArrowDown sx={{ ml: 1 }} />
                </MenuItem>

                <Menu
                  anchorEl={mobileListMenuAnchor}
                  open={Boolean(mobileListMenuAnchor)}
                  onClose={handleMobileListMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  PaperProps={{
                    sx: {
                      minWidth: 240,
                      borderRadius: 2,
                      border: '1px solid #ddd1b2'
                    }
                  }}
                >
                  {listNavigationItems.map((item) =>
                    item.external ? (
                      <MenuItem
                        key={item.path}
                        component="a"
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          handleMobileListMenuClose();
                          handleMobileMenuClose();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ) : (
                      <MenuItem
                        key={item.path}
                        component={Link}
                        to={item.path}
                        onClick={() => {
                          handleMobileListMenuClose();
                          handleMobileMenuClose();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    )
                  )}
                </Menu>

                {isAuthenticated && (
                  <>
                    <Divider />

                    {(user?.role === 'SUPERADMIN' ||
                      user?.role === 'ROLE_SUPERADMIN' ||
                      user?.role === 'ADMIN' ||
                      user?.role === 'ROLE_ADMIN') && (
                      <MenuItem
                        component={Link}
                        to="/admin/dashboard"
                        onClick={handleMobileMenuClose}
                        sx={{
                          backgroundColor: '#b33a3a',
                          color: '#ffffff',
                          fontWeight: 700,
                          '&:hover': {
                            backgroundColor: '#922f2f'
                          }
                        }}
                      >
                        {user?.role === 'ROLE_SUPERADMIN' || user?.role === 'SUPERADMIN'
                          ? 'SUPER ADMIN DASHBOARD'
                          : 'ADMIN DASHBOARD'}
                      </MenuItem>
                    )}

                    {(user?.role === 'SAMBHAG_MANAGER' ||
                      user?.role === 'ROLE_SAMBHAG_MANAGER' ||
                      user?.role === 'DISTRICT_MANAGER' ||
                      user?.role === 'ROLE_DISTRICT_MANAGER' ||
                      user?.role === 'BLOCK_MANAGER' ||
                      user?.role === 'ROLE_BLOCK_MANAGER') && (
                      <MenuItem
                        component={Link}
                        to="/manager/dashboard"
                        onClick={handleMobileMenuClose}
                        sx={{
                          backgroundColor: '#5b4b8a',
                          color: '#ffffff',
                          fontWeight: 700,
                          '&:hover': {
                            backgroundColor: '#493b74'
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