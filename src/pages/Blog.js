import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";

import Layout from "../components/Layout/Layout";
import { publicAPI } from "../services/api";
import { usePortal } from "../portal/PortalContext";

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

/* =========================================================
   HELPERS
========================================================= */

const buildImageSrc = (blog) => {
  if (!blog?.imageBase64 || !blog?.imageContentType) {
    return null;
  }

  return `data:${blog.imageContentType};base64,${blog.imageBase64}`;
};

const formatDate = (value) => {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch (error) {
    return "";
  }
};

const Blog = () => {
  const { portal } = usePortal();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  /* =========================================================
     PORTAL COLORS
  ========================================================= */

  const colors = useMemo(() => {
    const tab2 = portal?.slug === "tab2";

    return {
      primary: tab2 ? "#0891b2" : "#6f5cc2",

      primaryDark: tab2
        ? "#0e7490"
        : "#4f3c9b",

      dark: tab2
        ? "#083344"
        : "#221b43",

      darker: tab2
        ? "#06252f"
        : "#18122f",

      soft: tab2
        ? "#f0fdff"
        : "#f8f6fd",

      verySoft: tab2
        ? "rgba(8,145,178,0.08)"
        : "rgba(111,92,194,0.08)",

      border: tab2
        ? "rgba(8,145,178,0.17)"
        : "rgba(111,92,194,0.15)",

      borderStrong: tab2
        ? "rgba(8,145,178,0.27)"
        : "rgba(111,92,194,0.25)",
    };
  }, [portal?.slug]);

  /* =========================================================
     LOAD BLOGS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await publicAPI.getBlogs();

        if (mounted) {
          setBlogs(
            Array.isArray(response.data)
              ? response.data
              : [],
          );
        }
      } catch (requestError) {
        console.error(
          "Unable to load blogs:",
          requestError,
        );

        if (mounted) {
          setError(
            "ब्लॉग अभी लोड नहीं हो पा रहे हैं। कृपया कुछ समय बाद पुनः प्रयास करें।",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     BLOG VIEW
  ========================================================= */

  const openBlog = (blog) => {
    setSelectedBlog(blog);
    setViewDialogOpen(true);
  };

  const closeBlog = () => {
    setViewDialogOpen(false);

    setTimeout(() => {
      setSelectedBlog(null);
    }, 200);
  };

  /* =========================================================
     FEATURED + OTHER POSTS
  ========================================================= */

  const featuredBlog =
    blogs.length > 0 ? blogs[0] : null;

  const otherBlogs =
    blogs.length > 1
      ? blogs.slice(1)
      : [];

  const selectedBlogImage =
    buildImageSrc(selectedBlog);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "75vh",

          background: `
            radial-gradient(
              circle at 10% 10%,
              ${colors.verySoft},
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 25%,
              ${colors.verySoft},
              transparent 25%
            ),
            #f8fafc
          `,
        }}
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            color: "#fff",

            background: `
              linear-gradient(
                125deg,
                ${colors.darker} 0%,
                ${colors.dark} 45%,
                ${colors.primaryDark} 100%
              )
            `,
          }}
        >
          {/* Decorative circle */}

          <Box
            sx={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",

              right: {
                xs: -230,
                md: -80,
              },

              top: -190,

              border:
                "80px solid rgba(255,255,255,0.045)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: "50%",
              left: -110,
              bottom: -150,

              bgcolor:
                "rgba(255,255,255,0.035)",
            }}
          />

          <Container maxWidth="lg">
            <Box
              sx={{
                position: "relative",
                zIndex: 1,

                py: {
                  xs: 6,
                  md: 8,
                },

                maxWidth: 820,
              }}
            >
              <Chip
                icon={
                  <AutoAwesomeRoundedIcon />
                }
                label="PMUMS Updates"
                sx={{
                  mb: 2.3,

                  px: 0.6,

                  color: "#fff",

                  fontFamily: FONT,
                  fontWeight: 800,

                  bgcolor:
                    "rgba(255,255,255,0.12)",

                  border:
                    "1px solid rgba(255,255,255,0.15)",

                  backdropFilter:
                    "blur(12px)",

                  "& .MuiChip-icon": {
                    color: "#fff",
                  },
                }}
              />

              <Typography
                component="h1"
                sx={{
                  fontFamily: FONT,
                  fontWeight: 900,

                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.35rem",
                  },

                  letterSpacing: "-0.025em",
                  lineHeight: 1.13,
                }}
              >
                Blog & Updates
              </Typography>

              <Typography
                sx={{
                  mt: 1.7,

                  maxWidth: 760,

                  fontFamily: FONT,

                  fontSize: {
                    xs: "0.95rem",
                    md: "1.05rem",
                  },

                  fontWeight: 500,

                  lineHeight: 1.9,

                  color:
                    "rgba(255,255,255,0.78)",
                }}
              >
                संगठन से संबंधित नवीन जानकारी,
                महत्वपूर्ण सूचनाएँ और उपयोगी लेख
                यहाँ उपलब्ध होंगे।
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <Container
          maxWidth="lg"
          sx={{
            py: {
              xs: 4,
              md: 6,
            },
          }}
        >
          {/* LOADING */}

          {loading ? (
            <Box
              sx={{
                minHeight: 360,

                display: "flex",
                flexDirection: "column",

                alignItems: "center",
                justifyContent: "center",

                gap: 1.5,
              }}
            >
              <CircularProgress
                size={42}
                sx={{
                  color: colors.primary,
                }}
              />

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: "#64748b",
                }}
              >
                Loading latest updates...
              </Typography>
            </Box>
          ) : error ? (
            /* ERROR */

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 3,
                  md: 5,
                },

                borderRadius: 4,

                textAlign: "center",

                border: `1px solid ${colors.border}`,

                bgcolor: "#fff",
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#b91c1c",
                  lineHeight: 1.7,
                }}
              >
                {error}
              </Typography>
            </Paper>
          ) : blogs.length === 0 ? (
            /* EMPTY */

            <Paper
              elevation={0}
              sx={{
                py: {
                  xs: 6,
                  md: 8,
                },

                px: 3,

                borderRadius: 5,

                textAlign: "center",

                border: `1px solid ${colors.border}`,

                bgcolor: "#fff",

                boxShadow:
                  "0 18px 50px rgba(15,23,42,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 78,
                  height: 78,

                  mx: "auto",
                  mb: 2,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "50%",

                  bgcolor:
                    colors.verySoft,

                  color:
                    colors.primary,
                }}
              >
                <NewspaperRoundedIcon
                  sx={{
                    fontSize: 40,
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  color: colors.dark,
                }}
              >
                अभी कोई ब्लॉग उपलब्ध नहीं है
              </Typography>

              <Typography
                sx={{
                  mt: 1,

                  fontFamily: FONT,
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                नई जानकारी प्रकाशित होने पर वह
                यहाँ दिखाई देगी।
              </Typography>
            </Paper>
          ) : (
            <>
              {/* =================================================
                  FEATURED BLOG
              ================================================= */}

              {featuredBlog && (
                <>
                  <Box
                    sx={{
                      mb: 2.3,

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontWeight: 900,

                          fontSize: {
                            xs: "1.3rem",
                            md: "1.55rem",
                          },

                          color: "#0f172a",
                        }}
                      >
                        Latest Update
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.3,
                          fontFamily: FONT,
                          color: "#64748b",
                        }}
                      >
                        नवीनतम प्रकाशित जानकारी
                      </Typography>
                    </Box>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      mb: {
                        xs: 5,
                        md: 7,
                      },

                      overflow: "hidden",

                      borderRadius: {
                        xs: 3.5,
                        md: 5,
                      },

                      bgcolor: "#fff",

                      border: `1px solid ${colors.border}`,

                      boxShadow:
                        "0 22px 65px rgba(15,23,42,0.09)",

                      transition:
                        "transform 0.25s ease, box-shadow 0.25s ease",

                      "&:hover": {
                        transform:
                          "translateY(-3px)",

                        boxShadow:
                          "0 28px 75px rgba(15,23,42,0.13)",
                      },
                    }}
                  >
                    <Grid container>
                      {/* FEATURED IMAGE */}

                      <Grid
                        item
                        xs={12}
                        md={6.3}
                      >
                        <Box
                          sx={{
                            height: "100%",

                            minHeight: {
                              xs: 290,
                              md: 430,
                            },

                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "center",

                            p: {
                              xs: 1,
                              md: 1.5,
                            },

                            bgcolor: "#f8fafc",
                          }}
                        >
                          {buildImageSrc(
                            featuredBlog,
                          ) ? (
                            <Box
                              component="img"
                              src={buildImageSrc(
                                featuredBlog,
                              )}
                              alt={
                                featuredBlog.title ||
                                "Blog image"
                              }
                              sx={{
                                width: "100%",
                                height: "100%",

                                maxHeight: 450,

                                objectFit:
                                  "contain",

                                objectPosition:
                                  "center",

                                display: "block",

                                borderRadius: {
                                  xs: 2.5,
                                  md: 3.5,
                                },
                              }}
                            />
                          ) : (
                            <ArticleRoundedIcon
                              sx={{
                                fontSize: 70,
                                color:
                                  "#cbd5e1",
                              }}
                            />
                          )}
                        </Box>
                      </Grid>

                      {/* FEATURED CONTENT */}

                      <Grid
                        item
                        xs={12}
                        md={5.7}
                      >
                        <Box
                          sx={{
                            height: "100%",

                            p: {
                              xs: 3,
                              md: 4.5,
                            },

                            display: "flex",
                            flexDirection:
                              "column",

                            justifyContent:
                              "center",
                          }}
                        >
                          <Chip
                            label="Latest"
                            size="small"
                            sx={{
                              alignSelf:
                                "flex-start",

                              mb: 1.8,

                              bgcolor:
                                colors.verySoft,

                              color:
                                colors.primaryDark,

                              fontFamily: FONT,
                              fontWeight: 900,
                            }}
                          />

                          {featuredBlog.createdAt && (
                            <Stack
                              direction="row"
                              spacing={0.7}
                              alignItems="center"
                              sx={{
                                mb: 1.5,
                                color:
                                  "#94a3b8",
                              }}
                            >
                              <CalendarMonthRoundedIcon
                                sx={{
                                  fontSize: 18,
                                }}
                              />

                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily:
                                    FONT,

                                  fontWeight:
                                    700,
                                }}
                              >
                                {formatDate(
                                  featuredBlog.createdAt,
                                )}
                              </Typography>
                            </Stack>
                          )}

                          <Typography
                            component="h2"
                            sx={{
                              color:
                                colors.dark,

                              fontFamily: FONT,

                              fontSize: {
                                xs: "1.45rem",
                                md: "1.9rem",
                              },

                              lineHeight: 1.4,

                              fontWeight: 900,

                              overflowWrap:
                                "anywhere",
                            }}
                          >
                            {featuredBlog.title}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 1.5,

                              color:
                                "#64748b",

                              fontFamily: FONT,

                              fontSize:
                                "0.97rem",

                              lineHeight: 1.85,

                              fontWeight: 500,

                              display:
                                "-webkit-box",

                              WebkitLineClamp: 5,

                              WebkitBoxOrient:
                                "vertical",

                              overflow: "hidden",

                              whiteSpace:
                                "pre-line",
                            }}
                          >
                            {featuredBlog.content}
                          </Typography>

                          <Button
                            onClick={() =>
                              openBlog(
                                featuredBlog,
                              )
                            }
                            endIcon={
                              <ArrowForwardRoundedIcon />
                            }
                            sx={{
                              mt: 3,

                              alignSelf:
                                "flex-start",

                              px: 2.3,
                              py: 1,

                              borderRadius: 3,

                              textTransform:
                                "none",

                              fontFamily: FONT,
                              fontWeight: 800,

                              color: "#fff",

                              background: `linear-gradient(
                                135deg,
                                ${colors.primary} 0%,
                                ${colors.primaryDark} 100%
                              )`,

                              boxShadow:
                                "0 8px 20px rgba(15,23,42,0.10)",

                              "&:hover": {
                                background: `linear-gradient(
                                  135deg,
                                  ${colors.primaryDark} 0%,
                                  ${colors.primary} 100%
                                )`,

                                transform:
                                  "translateX(2px)",
                              },
                            }}
                          >
                            Read Full Article
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </>
              )}

              {/* =================================================
                  MORE BLOGS
              ================================================= */}

              {otherBlogs.length > 0 && (
                <>
                  <Box
                    sx={{
                      mb: 2.5,

                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",

                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontWeight: 900,

                          color: "#0f172a",

                          fontSize: {
                            xs: "1.3rem",
                            md: "1.55rem",
                          },
                        }}
                      >
                        More Updates
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.3,
                          fontFamily: FONT,
                          color: "#64748b",
                        }}
                      >
                        अन्य समाचार एवं उपयोगी लेख
                      </Typography>
                    </Box>

                    <Chip
                      label={`${otherBlogs.length} Posts`}
                      size="small"
                      sx={{
                        fontFamily: FONT,
                        fontWeight: 800,

                        color:
                          colors.primaryDark,

                        bgcolor:
                          colors.verySoft,
                      }}
                    />
                  </Box>

                  <Grid
                    container
                    spacing={3}
                  >
                    {otherBlogs.map(
                      (blog) => {
                        const imageSrc =
                          buildImageSrc(
                            blog,
                          );

                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            key={blog.id}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                height:
                                  "100%",

                                overflow:
                                  "hidden",

                                borderRadius:
                                  4,

                                bgcolor:
                                  "#fff",

                                border: `1px solid ${colors.border}`,

                                boxShadow:
                                  "0 12px 35px rgba(15,23,42,0.065)",

                                display:
                                  "flex",

                                flexDirection:
                                  "column",

                                transition:
                                  "all 0.25s ease",

                                "&:hover": {
                                  transform:
                                    "translateY(-5px)",

                                  boxShadow:
                                    "0 20px 48px rgba(15,23,42,0.11)",

                                  borderColor:
                                    colors.borderStrong,
                                },
                              }}
                            >
                              {/* CARD IMAGE */}

                              <Box
                                sx={{
                                  height: 225,

                                  p: 1,

                                  bgcolor:
                                    "#f8fafc",

                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  justifyContent:
                                    "center",

                                  borderBottom:
                                    "1px solid #f1f5f9",
                                }}
                              >
                                {imageSrc ? (
                                  <Box
                                    component="img"
                                    src={
                                      imageSrc
                                    }
                                    alt={
                                      blog.title ||
                                      "Blog image"
                                    }
                                    sx={{
                                      width:
                                        "100%",

                                      height:
                                        "100%",

                                      display:
                                        "block",

                                      objectFit:
                                        "contain",

                                      objectPosition:
                                        "center",

                                      borderRadius:
                                        2.5,
                                    }}
                                  />
                                ) : (
                                  <ArticleRoundedIcon
                                    sx={{
                                      fontSize:
                                        55,

                                      color:
                                        "#cbd5e1",
                                    }}
                                  />
                                )}
                              </Box>

                              {/* CARD CONTENT */}

                              <Box
                                sx={{
                                  p: 2.5,

                                  display:
                                    "flex",

                                  flexDirection:
                                    "column",

                                  flexGrow: 1,
                                }}
                              >
                                {blog.createdAt && (
                                  <Stack
                                    direction="row"
                                    spacing={0.6}
                                    alignItems="center"
                                    sx={{
                                      mb: 1,

                                      color:
                                        "#94a3b8",
                                    }}
                                  >
                                    <CalendarMonthRoundedIcon
                                      sx={{
                                        fontSize:
                                          16,
                                      }}
                                    />

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontFamily:
                                          FONT,

                                        fontWeight:
                                          700,
                                      }}
                                    >
                                      {formatDate(
                                        blog.createdAt,
                                      )}
                                    </Typography>
                                  </Stack>
                                )}

                                <Typography
                                  component="h2"
                                  sx={{
                                    color:
                                      colors.dark,

                                    fontFamily:
                                      FONT,

                                    fontSize:
                                      "1.1rem",

                                    lineHeight:
                                      1.5,

                                    fontWeight:
                                      900,

                                    overflowWrap:
                                      "anywhere",

                                    display:
                                      "-webkit-box",

                                    WebkitLineClamp: 2,

                                    WebkitBoxOrient:
                                      "vertical",

                                    overflow:
                                      "hidden",
                                  }}
                                >
                                  {blog.title}
                                </Typography>

                                <Typography
                                  sx={{
                                    mt: 1,

                                    color:
                                      "#64748b",

                                    fontFamily:
                                      FONT,

                                    fontSize:
                                      "0.9rem",

                                    lineHeight:
                                      1.75,

                                    fontWeight:
                                      500,

                                    display:
                                      "-webkit-box",

                                    WebkitLineClamp: 3,

                                    WebkitBoxOrient:
                                      "vertical",

                                    overflow:
                                      "hidden",

                                    whiteSpace:
                                      "pre-line",

                                    flexGrow: 1,
                                  }}
                                >
                                  {blog.content}
                                </Typography>

                                <Divider
                                  sx={{
                                    my: 2,
                                  }}
                                />

                                <Button
                                  onClick={() =>
                                    openBlog(
                                      blog,
                                    )
                                  }
                                  endIcon={
                                    <ArrowForwardRoundedIcon />
                                  }
                                  sx={{
                                    alignSelf:
                                      "flex-start",

                                    px: 0,

                                    minWidth:
                                      "auto",

                                    textTransform:
                                      "none",

                                    fontFamily:
                                      FONT,

                                    fontWeight:
                                      800,

                                    color:
                                      colors.primaryDark,

                                    "&:hover": {
                                      bgcolor:
                                        "transparent",

                                      color:
                                        colors.primary,

                                      transform:
                                        "translateX(3px)",
                                    },
                                  }}
                                >
                                  Read Article
                                </Button>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      },
                    )}
                  </Grid>
                </>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* =====================================================
          FULL BLOG VIEW DIALOG
      ===================================================== */}

      <Dialog
  open={viewDialogOpen}
  onClose={closeBlog}
  maxWidth="md"
  fullWidth
  scroll="paper"
  PaperProps={{
    sx: {
      maxWidth: 900,
      maxHeight: "92vh",

      borderRadius: {
        xs: 2.5,
        sm: 4,
      },

      overflow: "hidden",

      bgcolor: "#fff",

      boxShadow:
        "0 30px 100px rgba(15,23,42,0.30)",
    },
  }}
>
  {selectedBlog && (
    <DialogContent
      sx={{
        p: 0,
        overflowY: "auto",

        /* Smooth scrollbar */
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 transparent",

        "&::-webkit-scrollbar": {
          width: 7,
        },

        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "&::-webkit-scrollbar-thumb": {
          background: "#cbd5e1",
          borderRadius: 10,
        },
      }}
    >
      {/* =====================================================
          ARTICLE IMAGE
      ===================================================== */}

      <Box
        sx={{
          position: "relative",
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",

          /* Important spacing between image and article */
          mb: 0,
        }}
      >
        {selectedBlogImage ? (
          <Box
            sx={{
              width: "100%",

              px: {
                xs: 1.5,
                sm: 2.5,
              },

              pt: {
                xs: 1.5,
                sm: 2.5,
              },

              pb: {
                xs: 2,
                sm: 3,
              },

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              bgcolor: "#f8fafc",
            }}
          >
            <Box
              component="img"
              src={selectedBlogImage}
              alt={selectedBlog.title || "Blog image"}
              sx={{
                width: "auto",
                maxWidth: "100%",

                height: "auto",
                maxHeight: {
                  xs: 360,
                  sm: 480,
                },

                objectFit: "contain",
                objectPosition: "center",

                display: "block",

                mx: "auto",

                borderRadius: {
                  xs: 2,
                  sm: 3,
                },

                bgcolor: "#fff",

                boxShadow:
                  "0 10px 32px rgba(15,23,42,0.08)",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: 240,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              color: "#cbd5e1",
            }}
          >
            <ArticleRoundedIcon
              sx={{
                fontSize: 70,
              }}
            />
          </Box>
        )}

        {/* Close Button */}

        <IconButton
          onClick={closeBlog}
          sx={{
            position: "absolute",

            top: {
              xs: 12,
              sm: 18,
            },

            right: {
              xs: 12,
              sm: 18,
            },

            width: 42,
            height: 42,

            color: "#fff",

            bgcolor: "rgba(15,23,42,0.72)",

            backdropFilter: "blur(8px)",

            boxShadow:
              "0 6px 20px rgba(15,23,42,0.20)",

            zIndex: 2,

            "&:hover": {
              bgcolor: "rgba(15,23,42,0.92)",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* =====================================================
          ARTICLE CONTENT
      ===================================================== */}

      <Box
        sx={{
          px: {
            xs: 2.5,
            sm: 4.5,
            md: 5,
          },

          pt: {
            xs: 3.5,
            sm: 4.5,
          },

          /* More bottom space so article doesn't look cramped */
          pb: {
            xs: 5,
            sm: 6,
          },

          bgcolor: "#fff",
        }}
      >
        <Chip
          label="PMUMS Update"
          size="small"
          sx={{
            mb: 1.8,

            bgcolor: colors.verySoft,

            color: colors.primaryDark,

            fontFamily: FONT,
            fontWeight: 800,
          }}
        />

        {selectedBlog.createdAt && (
          <Stack
            direction="row"
            spacing={0.7}
            alignItems="center"
            sx={{
              mb: 1.7,
              color: "#94a3b8",
            }}
          >
            <CalendarMonthRoundedIcon
              sx={{
                fontSize: 18,
              }}
            />

            <Typography
              variant="body2"
              sx={{
                fontFamily: FONT,
                fontWeight: 600,
              }}
            >
              {formatDate(selectedBlog.createdAt)}
            </Typography>
          </Stack>
        )}

        <Typography
          component="h1"
          sx={{
            fontFamily: FONT,

            fontWeight: 900,

            color: colors.dark,

            fontSize: {
              xs: "1.45rem",
              sm: "1.85rem",
              md: "2rem",
            },

            lineHeight: 1.4,

            overflowWrap: "anywhere",
          }}
        >
          {selectedBlog.title}
        </Typography>

        <Divider
          sx={{
            my: {
              xs: 2.5,
              sm: 3,
            },
          }}
        />

        <Typography
          component="div"
          sx={{
            fontFamily: FONT,

            fontSize: {
              xs: "0.95rem",
              sm: "1rem",
            },

            lineHeight: 2,

            fontWeight: 500,

            color: "#475569",

            whiteSpace: "pre-line",

            overflowWrap: "anywhere",
          }}
        >
          {selectedBlog.content}
        </Typography>

        {/* Footer Note */}

        <Box
          sx={{
            mt: 4.5,

            p: {
              xs: 2,
              sm: 2.5,
            },

            borderRadius: 3,

            bgcolor: colors.verySoft,

            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              display: "block",

              fontFamily: FONT,

              color: "#64748b",

              fontWeight: 600,

              lineHeight: 1.8,
            }}
          >
            यह जानकारी PMUMS द्वारा प्रकाशित की गई है। नवीनतम जानकारी के लिए
            वेबसाइट पर नियमित रूप से देखें।
          </Typography>
        </Box>
      </Box>
    </DialogContent>
  )}
</Dialog>
    </Layout>
  );
};

export default Blog;