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
  Divider,
  Stack,
} from '@mui/material';

import {
  AccountCircle,
  ExitToApp,
  Menu as MenuIcon,
  KeyboardArrowDown,
  SwapHorizRounded,
  SchoolRounded,
  BadgeRounded,
  BusinessCenterRounded,
} from '@mui/icons-material';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { usePortal } from '../../portal/PortalContext';

const FONT_FAMILY =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

const COLORS = {
  dark: '#21193f',
  dark2: '#30275b',

  primary: '#6f5cc2',
  primaryLight: '#b9a7ff',

  white: '#ffffff',

  softBackground: '#f6f4fb',
  softBorder: '#e2dcf3',

  text: '#221b43',
  textSecondary: '#625d75',
};

const portalIcons = {
  tab1: SchoolRounded,
  tab2: BusinessCenterRounded,
  tab3: BadgeRounded,
};

const Header = () => {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const {
    path,
    portal,
    isFeatureEnabled,
  } = usePortal();

  const [anchorEl, setAnchorEl] =
    React.useState(null);

  const [
    mobileMenuAnchor,
    setMobileMenuAnchor,
  ] = React.useState(null);

  const [
    listMenuAnchor,
    setListMenuAnchor,
  ] = React.useState(null);

  const [
    showSelfDonationNav,
    setShowSelfDonationNav,
  ] = React.useState(false);

  const PortalIcon =
    portalIcons[portal?.slug] ||
    SchoolRounded;

  const portalTheme =
    portal?.theme || {};

  const portalBackground =
    portalTheme.background ||
    'linear-gradient(135deg, #6f5cc2, #4f3c9b)';

  const portalTextColor =
    portalTheme.textColor ||
    '#ffffff';

  const portalDarkColor =
    portalTheme.darkColor ||
    '#6f5cc2';

  /*
   * We use landing labels when available so that
   * users see meaningful group names instead of
   * technical "Portal 1 / Portal 2" wording.
   *
   * This changes DISPLAY ONLY.
   * Routes and functionality remain untouched.
   */
  const portalGroupLabel =
    portal?.landingGroupLabel ||
    portal?.selectorLabel ||
    portal?.shortName ||
    'Portal';

  const portalDisplayTitle =
    portal?.landingTitle ||
    portal?.selectorCategory ||
    portal?.shortName ||
    '';

  React.useEffect(() => {
    const loadSelfDonationSetting =
      async () => {
        try {
          const response =
            await adminAPI.getPublicSelfDonationSettings();

          setShowSelfDonationNav(
            response.data
              ?.selfDonationVisible === true
          );
        } catch (error) {
          console.error(
            'Error loading self donation visibility:',
            error
          );

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

  const handleMobileMenu = (
    event
  ) => {
    setMobileMenuAnchor(
      event.currentTarget
    );
  };

  const handleMobileMenuClose =
    () => {
      setMobileMenuAnchor(null);
    };

  const handleListMenuOpen = (
    event
  ) => {
    setListMenuAnchor(
      event.currentTarget
    );
  };

  const handleListMenuClose =
    () => {
      setListMenuAnchor(null);
    };

  const handleLogout = async () => {
    await logout();

    handleClose();
    handleMobileMenuClose();
  };

  const handleSwitchPortal = () => {
    handleClose();
    handleMobileMenuClose();
    handleListMenuClose();

    /*
     * Go back to common landing page.
     */
    navigate('/');

    /*
     * Ensure selector opens from top.
     */
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    });
  };

  const mainNavigationItems = [
    {
      label: 'HOME',
      path: path('/'),
    },

    {
      label: 'ABOUT',
      path: path('/about'),
    },

    {
      label: 'BLOG',
      path: path('/blog'),
    },

    {
      label: 'NIYAMAWALI',
      path: path('/niyamawali'),
    },

    ...(
      showSelfDonationNav &&
      isFeatureEnabled(
        'selfDonation'
      )
        ? [
            {
              label:
                'SANSTHA SAHYOG',

              path: path(
                '/self-donation'
              ),
            },
          ]
        : []
    ),

    {
      label: 'CONTACT US',
      path: path('/contact-us'),
    },
  ];

  const listNavigationItems = [
    {
      label: 'OUR MEMBERS',
      path: path(
        '/teachers-list'
      ),
    },

    /*
     * Existing production rule:
     * Pending Profiles only in TAB 1.
     */
    ...(
      portal?.slug === 'tab1'
        ? [
            {
              label:
                'PENDING PROFILES',

              path: path(
                '/pending-profiles'
              ),
            },
          ]
        : []
    ),

   ...(portal?.slug === 'tab1'
  ? [
      {
        label: 'LATE TEACHERS LIST',
        path: 'https://pmums.in/death-case/',
        external: true,
      },
    ]
  : []),

    {
      label: 'SAHYOG LIST',
      path: path(
        '/sahyog-list'
      ),
    },

    {
      label: 'ASAHYOG LIST',
      path: path(
        '/asahyog-list'
      ),
    },

    {
      label: 'NO UTR LIST',
      path: path(
        '/zero-utr-list'
      ),
    },
  ];

  const isAdminUser =
    user?.role === 'SUPERADMIN' ||
    user?.role ===
      'ROLE_SUPERADMIN' ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_ADMIN';

  const isSuperAdmin =
    user?.role === 'SUPERADMIN' ||
    user?.role ===
      'ROLE_SUPERADMIN';

  const isManagerUser =
    user?.role ===
      'SAMBHAG_MANAGER' ||
    user?.role ===
      'ROLE_SAMBHAG_MANAGER' ||
    user?.role ===
      'DISTRICT_MANAGER' ||
    user?.role ===
      'ROLE_DISTRICT_MANAGER' ||
    user?.role ===
      'BLOCK_MANAGER' ||
    user?.role ===
      'ROLE_BLOCK_MANAGER';

  const navButtonSx = {
    minHeight: 38,

    px: {
      lg: 0.85,
      xl: 1.1,
    },

    py: 0.7,

    color: '#ffffff',

    borderRadius: '8px',

    fontWeight: 700,

    fontSize: {
      lg: '0.78rem',
      xl: '0.84rem',
    },

    letterSpacing: '0.15px',

    lineHeight: 1.2,

    textTransform: 'uppercase',

    whiteSpace: 'nowrap',

    fontFamily:
      FONT_FAMILY,

    transition:
      'all 0.2s ease',

    '&:hover': {
      color: '#ffffff',

      backgroundColor:
        'rgba(185,167,255,0.16)',
    },
  };

  const dashboardButtonSx = {
    minHeight: 39,

    ml: 0.4,

    px: {
      lg: 1,
      xl: 1.4,
    },

    py: 0.7,

    color: '#ffffff',

    backgroundColor:
      COLORS.primary,

    borderRadius: '8px',

    fontWeight: 800,

    fontSize: {
      lg: '0.74rem',
      xl: '0.8rem',
    },

    letterSpacing: '0.15px',

    lineHeight: 1.2,

    textTransform: 'uppercase',

    whiteSpace: 'nowrap',

    fontFamily:
      FONT_FAMILY,

    boxShadow:
      '0 4px 12px rgba(0,0,0,0.20)',

    '&:hover': {
      backgroundColor:
        '#5a48ad',

      boxShadow:
        '0 6px 16px rgba(0,0,0,0.25)',
    },
  };

  const menuItemSx = {
    minHeight: 44,

    color: '#252044',

    fontSize: '0.9rem',

    fontWeight: 600,

    fontFamily:
      FONT_FAMILY,

    '&:hover': {
      color:
        COLORS.dark,

      backgroundColor:
        '#f4f2fb',
    },
  };
const isTab2 = portal?.slug === 'tab2';

const headerBackground = isTab2
  ? 'linear-gradient(100deg, #083344 0%, #0e7490 55%, #0891b2 100%)'
  : 'linear-gradient(100deg, #21193f 0%, #28204d 55%, #30275b 100%)';

const headerBorderColor = isTab2
  ? '#22d3ee'
  : '#6f5cc2';
  const renderNavigationButton =
    (item) => {
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
    /*
     * IMPORTANT:
     *
     * Previously only AppBar was sticky.
     *
     * Now the complete header including:
     *
     * 1. Organization strip
     * 2. Main navigation
     *
     * remains together while scrolling.
     */
    <Box
      component="header"
      sx={{
        position: 'sticky',

        top: 0,

        zIndex: (theme) =>
          theme.zIndex.appBar +
          10,

        width: '100%',

        isolation: 'isolate',
      }}
    >
      {/* =============================================== */}
      {/* ORGANIZATION INFORMATION */}
      {/* =============================================== */}

      <Box
        sx={{
          py: {
            xs: 0.55,
            sm: 0.7,
          },

          px: 1,

          color:
            COLORS.text,

          backgroundColor:
            '#f7f5fc',

          borderBottom:
            '1px solid #ded8f5',
        }}
      >
        <Container maxWidth="xl">
          {/* Desktop organization line */}
          <Typography
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },

              textAlign: 'center',

              color:
                COLORS.text,

              fontWeight: 600,

              fontSize: {
                sm: '0.76rem',
                md: '0.84rem',
              },

              lineHeight: 1.45,

              fontFamily:
                FONT_FAMILY,
            }}
          >
            {isTab2 ? (
  <>
    कर्मचारी कल्याण कोष | द्वितीय समूह | मध्य प्रदेश
  </>
) : (
    <>
      प्राथमिक माध्यमिक उच्च माध्यमिक शिक्षक संघ
      म.प्र. | पंजीयन क्रमांक : 06/13/01/14017/23 |
      पता : सुभाष पुरम रोड, हेलीपेड के पीछे,
      टीकमगढ़ (म. प्र.)
    </>
  )}
          </Typography>

          {/* Mobile shorter organization line */}
          <Typography
            sx={{
              display: {
                xs: 'block',
                sm: 'none',
              },

              textAlign: 'center',

              color:
                COLORS.text,

              fontWeight: 700,

              fontSize: '0.68rem',

              lineHeight: 1.35,

              fontFamily:
                FONT_FAMILY,
            }}
          >
             {isTab2
    ? 'कर्मचारी कल्याण कोष — द्वितीय समूह'
    : 'प्राथमिक माध्यमिक उच्च माध्यमिक शिक्षक संघ, मध्य प्रदेश'}
          </Typography>
        </Container>
      </Box>

      {/* =============================================== */}
      {/* MAIN NAVIGATION */}
      {/* =============================================== */}

      <AppBar
  position="static"
  elevation={0}
  sx={{
    background: headerBackground,

    borderBottom:
      `3px solid ${headerBorderColor}`,

    boxShadow:
      '0 7px 22px rgba(18,13,40,0.22)',
  }}
>
        <Container
          maxWidth={false}
          sx={{
            px: {
              xs: 1.2,
              md: 2,
              xl: 3.5,
            },
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: '66px',
                md: '72px',
              },

              py: {
                xs: 0.65,
                md: 0.7,
              },

              gap: 1,

              justifyContent:
                'space-between',
            }}
          >
            {/* ========================================= */}
            {/* LOGO + ACTIVE GROUP */}
            {/* ========================================= */}

            <Box
              component={Link}
              to={path('/')}
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: {
                  xs: 0.8,
                  md: 1.1,
                },

                minWidth: 0,

                flexShrink: 0,

                color: 'inherit',

                textDecoration:
                  'none',
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 48,
                    md: 55,
                  },

                  height: {
                    xs: 48,
                    md: 55,
                  },

                  flexShrink: 0,

                  p: 0.6,

                  display: 'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  backgroundColor:
                    '#ffffff',

                  borderRadius:
                    '50%',

                  border:
                    '2px solid #b9a7ff',

                  boxShadow:
                    '0 5px 15px rgba(0,0,0,0.24)',
                }}
              >
                <img
                  src="/pmums logo.png"
                  alt="PMUMS Logo"
                  style={{
                    width: '100%',

                    height: '100%',

                    objectFit:
                      'contain',
                  }}
                />
              </Box>

              <Box
                sx={{
                  minWidth: 0,

                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                <Typography
  sx={{
    color:
      COLORS.white,

    fontWeight: 900,

    fontSize: {
      sm: '0.82rem',
      md: '0.9rem',
    },

    lineHeight: 1.2,

    whiteSpace:
      'nowrap',

    fontFamily:
      FONT_FAMILY,
  }}
>
  {isTab2
    ? 'कर्मचारी कल्याण कोष'
    : 'पी.एम.यू.एम.एस. कर्मचारी कल्याण कोष'}
</Typography>

             {/* Active portal / group identity */}

<Box
  sx={{
    mt: 0.45,

    display: 'flex',

    alignItems: 'center',

    gap: 0.8,
  }}
>
  <Box
    sx={{
      width: 27,

      height: 27,

      flexShrink: 0,

      display: 'flex',

      alignItems: 'center',

      justifyContent: 'center',

      color: isTab2
        ? '#083344'
        : portalTextColor,

      background: isTab2
        ? '#a5f3fc'
        : portalBackground,

      borderRadius: '8px',

      border:
        '1px solid rgba(255,255,255,0.25)',
    }}
  >
    <PortalIcon
      sx={{
        fontSize: 16,
      }}
    />
  </Box>

  <Box
    sx={{
      minWidth: 0,
    }}
  >
    <Typography
      sx={{
        color: isTab2
          ? '#a5f3fc'
          : '#d8d0ff',

        fontFamily:
          FONT_FAMILY,

        fontSize: {
          sm: '0.66rem',

          md: '0.7rem',
        },

        fontWeight: 900,

        lineHeight: 1.15,

        whiteSpace:
          'nowrap',
      }}
    >
      {isTab2
        ? 'द्वितीय समूह'
        : portalGroupLabel}
    </Typography>

    <Typography
      sx={{
        mt: 0.15,

        maxWidth: {
          sm: 240,

          md: 290,
        },

        overflow:
          'hidden',

        color:
          '#ffffff',

        fontFamily:
          FONT_FAMILY,

        fontSize: {
          sm: '0.68rem',

          md: '0.74rem',
        },

        fontWeight: 700,

        lineHeight: 1.2,

        textOverflow:
          'ellipsis',

        whiteSpace:
          'nowrap',
      }}
    >
      {isTab2
        ? 'अन्य विभाग एवं संस्थान'
        : portalDisplayTitle}
    </Typography>
  </Box>
</Box>

               
              </Box>

              {/* Mobile portal label */}

              <Box
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'none',
                  },

                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    color:
                      COLORS.white,

                    fontFamily:
                      FONT_FAMILY,

                    fontWeight: 900,

                    fontSize:
                      '0.78rem',

                    lineHeight: 1.15,
                  }}
                >
                  कल्याण कोष
                </Typography>

                <Typography
                  sx={{
                    mt: 0.15,

                    maxWidth: 120,

                    overflow:
                      'hidden',

                    color:
                      '#dcd4ff',

                    fontFamily:
                      FONT_FAMILY,

                    fontWeight: 700,

                    fontSize:
                      '0.61rem',

                    textOverflow:
                      'ellipsis',

                    whiteSpace:
                      'nowrap',
                  }}
                >
                  {portalGroupLabel}
                </Typography>
              </Box>
            </Box>

            {/* ========================================= */}
            {/* DESKTOP NAVIGATION */}
            {/* ========================================= */}

            <Box
              sx={{
                display: {
                  xs: 'none',
                  lg: 'flex',
                },

                minWidth: 0,

                ml: 'auto',

                alignItems:
                  'center',

                justifyContent:
                  'flex-end',

                gap: 0.1,
              }}
            >
              {mainNavigationItems.map(
                (item) =>
                  renderNavigationButton(
                    item
                  )
              )}

              {/* User services */}

              <Button
                onClick={
                  handleListMenuOpen
                }
                endIcon={
                  <KeyboardArrowDown />
                }
                sx={{
                  ...navButtonSx,

                  backgroundColor:
                    Boolean(
                      listMenuAnchor
                    )
                      ? 'rgba(185,167,255,0.18)'
                      : 'transparent',

                  color: Boolean(
                    listMenuAnchor
                  )
                    ? '#dcd4ff'
                    : '#ffffff',
                }}
              >
                USER SERVICES
              </Button>

              <Menu
                anchorEl={
                  listMenuAnchor
                }
                open={Boolean(
                  listMenuAnchor
                )}
                onClose={
                  handleListMenuClose
                }
                anchorOrigin={{
                  vertical:
                    'bottom',

                  horizontal:
                    'left',
                }}
                transformOrigin={{
                  vertical: 'top',

                  horizontal:
                    'left',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,

                    minWidth: 235,

                    overflow:
                      'hidden',

                    borderRadius: 2.5,

                    border:
                      '1px solid #ded8f5',

                    boxShadow:
                      '0 12px 32px rgba(22,16,48,0.20)',
                  },
                }}
              >
                {listNavigationItems.map(
                  (item) =>
                    item.external ? (
                      <MenuItem
                        key={
                          item.path
                        }
                        component="a"
                        href={
                          item.path
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={
                          handleListMenuClose
                        }
                        sx={
                          menuItemSx
                        }
                      >
                        {
                          item.label
                        }
                      </MenuItem>
                    ) : (
                      <MenuItem
                        key={
                          item.path
                        }
                        component={
                          Link
                        }
                        to={
                          item.path
                        }
                        onClick={
                          handleListMenuClose
                        }
                        sx={
                          menuItemSx
                        }
                      >
                        {
                          item.label
                        }
                      </MenuItem>
                    )
                )}
              </Menu>

              {/* ======================================= */}
              {/* SWITCH GROUP */}
              {/* ======================================= */}

              <Button
  onClick={
    handleSwitchPortal
  }
  startIcon={
    <SwapHorizRounded />
  }
  sx={{
    minHeight: 44,

    ml: 0.8,

    px: {
      lg: 1.4,
      xl: 1.7,
    },

    color:
      '#ffffff',

    backgroundColor:
      isTab2
        ? 'rgba(255,255,255,0.12)'
        : 'rgba(255,255,255,0.08)',

    border:
      isTab2
        ? '1px solid rgba(165,243,252,0.45)'
        : '1px solid rgba(255,255,255,0.20)',

    borderRadius:
      '10px',

    textTransform:
      'none',

    whiteSpace:
      'nowrap',

    fontFamily:
      FONT_FAMILY,

    transition:
      'all 0.2s ease',

    '&:hover': {
      backgroundColor:
        isTab2
          ? 'rgba(255,255,255,0.20)'
          : 'rgba(255,255,255,0.16)',

      borderColor:
        isTab2
          ? '#a5f3fc'
          : 'rgba(255,255,255,0.32)',

      transform:
        'translateY(-1px)',
    },

    '& .MuiButton-startIcon':
      {
        mr: 0.8,
      },
  }}
>
  <Box
    sx={{
      textAlign:
        'left',
    }}
  >
    <Typography
      sx={{
        color:
          '#ffffff',

        fontSize:
          '0.76rem',

        fontWeight:
          900,

        lineHeight: 1.15,

        fontFamily:
          FONT_FAMILY,
      }}
    >
      पोर्टल बदलें
    </Typography>

    <Typography
      sx={{
        mt: 0.18,

        color:
          isTab2
            ? '#a5f3fc'
            : '#dcd4ff',

        fontSize:
          '0.62rem',

        fontWeight:
          700,

        lineHeight: 1.15,

        fontFamily:
          FONT_FAMILY,
      }}
    >
      पोर्टल चयन पृष्ठ
    </Typography>
  </Box>
</Button>

              {/* ======================================= */}
              {/* AUTH / ROLE ACTIONS */}
              {/* ======================================= */}

              {isAuthenticated && (
                <>
                  {isAdminUser && (
                    <Button
                      component={
                        Link
                      }
                      to={path(
                        '/admin/dashboard'
                      )}
                      sx={
                        dashboardButtonSx
                      }
                    >
                      {isSuperAdmin
                        ? 'SUPER ADMIN'
                        : 'ADMIN'}
                    </Button>
                  )}

                  {isManagerUser && (
                    <Button
                      component={
                        Link
                      }
                      to={path(
                        '/manager/dashboard'
                      )}
                      sx={{
                        ...dashboardButtonSx,

                        backgroundColor:
                          '#5b4b8a',

                        '&:hover':
                          {
                            backgroundColor:
                              '#493b74',
                          },
                      }}
                    >
                      MANAGER
                    </Button>
                  )}

                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={
                      handleMenu
                    }
                    color="inherit"
                    sx={{
                      ml: 0.35,

                      p: 0.4,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 35,

                        height: 35,

                        color:
                          '#252044',

                        backgroundColor:
                          '#f4f2fb',

                        fontWeight:
                          800,

                        fontSize:
                          '0.9rem',
                      }}
                    >
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={
                      anchorEl
                    }
                    anchorOrigin={{
                      vertical:
                        'bottom',

                      horizontal:
                        'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical:
                        'top',

                      horizontal:
                        'right',
                    }}
                    open={Boolean(
                      anchorEl
                    )}
                    onClose={
                      handleClose
                    }
                    PaperProps={{
                      sx: {
                        mt: 1,

                        minWidth:
                          185,

                        borderRadius:
                          2.5,

                        border:
                          '1px solid #ded8f5',

                        boxShadow:
                          '0 12px 32px rgba(22,16,48,0.18)',
                      },
                    }}
                  >
                    <MenuItem
                      component={
                        Link
                      }
                      to={path(
                        '/profile'
                      )}
                      onClick={
                        handleClose
                      }
                      sx={{
                        ...menuItemSx,
                      }}
                    >
                      <AccountCircle
                        sx={{
                          mr: 1,
                        }}
                      />

                      प्रोफाइल
                    </MenuItem>

                    <MenuItem
                      onClick={
                        handleLogout
                      }
                      sx={{
                        ...menuItemSx,

                        color:
                          '#922f2f',
                      }}
                    >
                      <ExitToApp
                        sx={{
                          mr: 1,
                        }}
                      />

                      लॉगआउट
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* ========================================= */}
            {/* MOBILE/TABLET CONTROLS */}
            {/* ========================================= */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.7}
              sx={{
                display: {
                  xs: 'flex',
                  lg: 'none',
                },

                ml: 'auto',
              }}
            >
              {/* Quick group switch */}

              <IconButton
                aria-label="switch group"
                onClick={
                  handleSwitchPortal
                }
                sx={{
                  width: {
                    xs: 40,
                    sm: 43,
                  },

                  height: {
                    xs: 40,
                    sm: 43,
                  },

                  color:
                    portalTextColor,

                  background:
                    portalBackground,

                  border:
                    '1px solid rgba(255,255,255,0.26)',

                  boxShadow: `0 4px 12px ${
                    portalTheme.shadowColor ||
                    'rgba(0,0,0,0.18)'
                  }`,

                  '&:hover': {
                    filter:
                      'brightness(0.96)',
                  },
                }}
              >
                <SwapHorizRounded />
              </IconButton>

              <IconButton
                aria-label="mobile menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={
                  handleMobileMenu
                }
                sx={{
                  width: {
                    xs: 42,
                    sm: 45,
                  },

                  height: {
                    xs: 42,
                    sm: 45,
                  },

                  color: '#ffffff',

                  borderRadius:
                    '11px',

                  backgroundColor:
                    'rgba(255,255,255,0.09)',

                  border:
                    '1px solid rgba(255,255,255,0.17)',

                  '&:hover': {
                    backgroundColor:
                      'rgba(255,255,255,0.17)',
                  },
                }}
              >
                <MenuIcon
                  sx={{
                    fontSize: 28,
                  }}
                />
              </IconButton>
            </Stack>

            {/* ========================================= */}
            {/* MOBILE MENU */}
            {/* ========================================= */}

            <Menu
              id="mobile-menu"
              anchorEl={
                mobileMenuAnchor
              }
              anchorOrigin={{
                vertical: 'bottom',

                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',

                horizontal: 'right',
              }}
              open={Boolean(
                mobileMenuAnchor
              )}
              onClose={
                handleMobileMenuClose
              }
              PaperProps={{
                sx: {
                  mt: 1,

                  width:
                    'calc(100vw - 24px)',

                  maxWidth: 360,

                  maxHeight:
                    '80vh',

                  overflowY:
                    'auto',

                  borderRadius: 3,

                  border:
                    '1px solid #ded8f5',

                  boxShadow:
                    '0 16px 42px rgba(34,27,67,0.22)',
                },
              }}
            >
              {/* Active group */}

              <Box
                sx={{
                  m: 1,

                  p: 1.4,

                  color:
                    portalTextColor,

                  background:
                    portalBackground,

                  borderRadius: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',

                    alignItems:
                      'center',

                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,

                      height: 40,

                      flexShrink: 0,

                      display: 'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',

                      borderRadius:
                        1.7,

                      backgroundColor:
                        'rgba(255,255,255,0.22)',

                      border:
                        '1px solid rgba(255,255,255,0.28)',
                    }}
                  >
                    <PortalIcon
                      sx={{
                        fontSize: 24,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color:
                          'inherit',

                        fontSize:
                          '0.82rem',

                        fontWeight:
                          900,

                        lineHeight:
                          1.2,

                        fontFamily:
                          FONT_FAMILY,
                      }}
                    >
                      {portalGroupLabel}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,

                        color:
                          'inherit',

                        fontSize:
                          '0.68rem',

                        fontWeight:
                          700,

                        opacity: 0.88,

                        lineHeight:
                          1.4,

                        fontFamily:
                          FONT_FAMILY,
                      }}
                    >
                      {portalDisplayTitle}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Main links */}

              {mainNavigationItems.map(
                (item) =>
                  item.external ? (
                    <MenuItem
                      key={
                        item.path
                      }
                      component="a"
                      href={
                        item.path
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={
                        handleMobileMenuClose
                      }
                      sx={
                        menuItemSx
                      }
                    >
                      {
                        item.label
                      }
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={
                        item.path
                      }
                      component={Link}
                      to={
                        item.path
                      }
                      onClick={
                        handleMobileMenuClose
                      }
                      sx={
                        menuItemSx
                      }
                    >
                      {
                        item.label
                      }
                    </MenuItem>
                  )
              )}

              <Divider />

              {/* Services heading */}

              <MenuItem
                disabled
                sx={{
                  color:
                    '#6f5cc2 !important',

                  backgroundColor:
                    '#f4f2fb',

                  opacity:
                    '1 !important',

                  fontSize:
                    '0.73rem',

                  fontWeight: 900,

                  letterSpacing:
                    '0.45px',

                  textTransform:
                    'uppercase',

                  fontFamily:
                    FONT_FAMILY,
                }}
              >
                USER SERVICES
              </MenuItem>

              {listNavigationItems.map(
                (item) =>
                  item.external ? (
                    <MenuItem
                      key={
                        item.path
                      }
                      component="a"
                      href={
                        item.path
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={
                        handleMobileMenuClose
                      }
                      sx={{
                        ...menuItemSx,

                        pl: 3,
                      }}
                    >
                      {
                        item.label
                      }
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={
                        item.path
                      }
                      component={Link}
                      to={
                        item.path
                      }
                      onClick={
                        handleMobileMenuClose
                      }
                      sx={{
                        ...menuItemSx,

                        pl: 3,
                      }}
                    >
                      {
                        item.label
                      }
                    </MenuItem>
                  )
              )}

              <Divider />

              {/* Switch group */}

              <MenuItem
                onClick={
                  handleSwitchPortal
                }
                sx={{
                  mx: 1,

                  my: 1,

                  minHeight: 58,

                  gap: 1,

                  color:
                    portalDarkColor,

                  backgroundColor:
                    '#f7f5fc',

                  border:
                    '1px solid #e5e0f2',

                  borderRadius: 2.2,

                  fontWeight: 800,

                  fontFamily:
                    FONT_FAMILY,

                  '&:hover': {
                    backgroundColor:
                      '#eeeafd',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 38,

                    height: 38,

                    flexShrink: 0,

                    display: 'flex',

                    alignItems:
                      'center',

                    justifyContent:
                      'center',

                    color:
                      portalTextColor,

                    background:
                      portalBackground,

                    borderRadius:
                      1.7,
                  }}
                >
                  <PortalIcon
                    sx={{
                      fontSize: 21,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                 <Typography
  sx={{
    color:
      COLORS.dark,

    fontSize:
      '0.8rem',

    fontWeight:
      900,

    lineHeight:
      1.2,

    fontFamily:
      FONT_FAMILY,
  }}
>
  पोर्टल बदलें
</Typography>

                  <Typography
  sx={{
    mt: 0.2,

    color:
      portalDarkColor,

    fontSize:
      '0.65rem',

    fontWeight:
      700,

    fontFamily:
      FONT_FAMILY,
  }}
>
  पोर्टल चयन पृष्ठ पर जाएँ
</Typography>
                </Box>

                <SwapHorizRounded
                  sx={{
                    ml: 'auto',
                  }}
                />
              </MenuItem>

              {/* Authenticated mobile actions */}

              {isAuthenticated && (
                <>
                  <Divider />

                  {isAdminUser && (
                    <MenuItem
                      component={
                        Link
                      }
                      to={path(
                        '/admin/dashboard'
                      )}
                      onClick={
                        handleMobileMenuClose
                      }
                      sx={{
                        mx: 1,

                        my: 0.5,

                        color:
                          '#ffffff',

                        backgroundColor:
                          COLORS.primary,

                        borderRadius:
                          1.5,

                        fontWeight:
                          800,

                        fontFamily:
                          FONT_FAMILY,

                        '&:hover':
                          {
                            backgroundColor:
                              '#5a48ad',
                          },
                      }}
                    >
                      {isSuperAdmin
                        ? 'SUPER ADMIN DASHBOARD'
                        : 'ADMIN DASHBOARD'}
                    </MenuItem>
                  )}

                  {isManagerUser && (
                    <MenuItem
                      component={
                        Link
                      }
                      to={path(
                        '/manager/dashboard'
                      )}
                      onClick={
                        handleMobileMenuClose
                      }
                      sx={{
                        mx: 1,

                        my: 0.5,

                        color:
                          '#ffffff',

                        backgroundColor:
                          '#5b4b8a',

                        borderRadius:
                          1.5,

                        fontWeight:
                          800,

                        fontFamily:
                          FONT_FAMILY,

                        '&:hover':
                          {
                            backgroundColor:
                              '#493b74',
                          },
                      }}
                    >
                      MANAGER DASHBOARD
                    </MenuItem>
                  )}

                  <MenuItem
                    component={Link}
                    to={path(
                      '/profile'
                    )}
                    onClick={
                      handleMobileMenuClose
                    }
                    sx={
                      menuItemSx
                    }
                  >
                    <AccountCircle
                      sx={{
                        mr: 1,
                      }}
                    />

                    PROFILE
                  </MenuItem>

                  <MenuItem
                    onClick={
                      handleLogout
                    }
                    sx={{
                      ...menuItemSx,

                      color:
                        '#922f2f',
                    }}
                  >
                    <ExitToApp
                      sx={{
                        mr: 1,
                      }}
                    />

                    LOGOUT
                  </MenuItem>
                </>
              )}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Header;