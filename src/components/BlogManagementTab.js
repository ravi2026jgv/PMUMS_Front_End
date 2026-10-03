import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  Article,
  CalendarMonth,
  CheckCircle,
  Close,
  CloudUpload,
  Delete,
  Edit,
  ImageOutlined,
  Public,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import toast from "react-hot-toast";
import { adminAPI } from "../services/api";
import { usePortal } from "../portal/PortalContext";

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const FONT =
  'Poppins, "Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif';

const emptyForm = {
  title: "",
  content: "",
  active: true,
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const buildStoredImageSrc = (blog) => {
  if (!blog?.imageBase64 || !blog?.imageContentType) {
    return "";
  }

  return `data:${blog.imageContentType};base64,${blog.imageBase64}`;
};

const formatDate = (value) => {
  if (!value) return "Not available";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Not available";
  }
};

const BlogManagementTab = () => {
  const { portal } = usePortal();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [localImagePreview, setLocalImagePreview] = useState("");

  const portalLabel =
    portal?.landingGroupLabel ||
    portal?.selectorLabel ||
    portal?.shortName ||
    "Current Portal";

  const accent = useMemo(
    () => (portal?.slug === "tab2" ? "#0891b2" : "#6f5cc2"),
    [portal?.slug],
  );

  const accentDark = useMemo(
    () => (portal?.slug === "tab2" ? "#0e7490" : "#5847a8"),
    [portal?.slug],
  );

  const accentLight = useMemo(
    () =>
      portal?.slug === "tab2"
        ? "rgba(8,145,178,0.10)"
        : "rgba(111,92,194,0.10)",
    [portal?.slug],
  );

  const totalBlogs = blogs.length;

  const activeBlogs = useMemo(
    () => blogs.filter((blog) => blog?.active !== false).length,
    [blogs],
  );

  const hiddenBlogs = totalBlogs - activeBlogs;

  const loadBlogs = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getBlogs();

      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Unable to load admin blogs:", error);

      toast.error(
        getErrorMessage(error, "Unable to load blogs"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    return () => {
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
    };
  }, [localImagePreview]);

  const resetDialog = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }

    setEditingBlog(null);
    setForm(emptyForm);
    setImageFile(null);
    setLocalImagePreview("");
  };

  const openCreateDialog = () => {
    resetDialog();
    setDialogOpen(true);
  };

  const openEditDialog = (blog) => {
    resetDialog();

    setEditingBlog(blog);

    setForm({
      title: blog?.title || "",
      content: blog?.content || "",
      active: blog?.active !== false,
    });

    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setDialogOpen(false);
    resetDialog();
  };

  const openViewDialog = (blog) => {
    setViewingBlog(blog);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setViewingBlog(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be 3 MB or smaller");
      return;
    }

    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }

    setImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title) {
      toast.error("Please enter blog title");
      return;
    }

    if (!content) {
      toast.error("Please enter blog content");
      return;
    }

    if (!editingBlog && !imageFile) {
      toast.error("Please select a blog image");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("isActive", String(form.active));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setSaving(true);

      if (editingBlog) {
        await adminAPI.updateBlog(
          editingBlog.id,
          formData,
        );

        toast.success("Blog updated successfully");
      } else {
        await adminAPI.createBlog(formData);

        toast.success("Blog published successfully");
      }

      setDialogOpen(false);
      resetDialog();

      await loadBlogs();
    } catch (error) {
      console.error("Unable to save blog:", error);

      toast.error(
        getErrorMessage(error, "Unable to save blog"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog?.title || ""}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await adminAPI.deleteBlog(blog.id);

      toast.success("Blog deleted successfully");

      await loadBlogs();
    } catch (error) {
      console.error("Unable to delete blog:", error);

      toast.error(
        getErrorMessage(error, "Unable to delete blog"),
      );
    }
  };

  const previewSrc =
    localImagePreview ||
    (editingBlog
      ? buildStoredImageSrc(editingBlog)
      : "");

  const viewingImageSrc =
    buildStoredImageSrc(viewingBlog);

  const summaryCardSx = {
    flex: 1,
    minWidth: { xs: "100%", sm: 150 },
    px: 2,
    py: 1.6,
    borderRadius: 3,
    border: "1px solid #e2e8f0",
    bgcolor: "#ffffff",
    boxShadow: "0 6px 20px rgba(15,23,42,0.04)",
  };

  const dialogSectionSx = {
    borderRadius: 3.5,
    border: "1px solid #e2e8f0",
    bgcolor: "#ffffff",
    p: { xs: 2, sm: 2.5 },
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(226,232,240,0.95)",
          boxShadow:
            "0 18px 44px rgba(15,23,42,0.08)",
          bgcolor: "#fff",
        }}
      >
        {/* =========================================================
            HEADER
        ========================================================= */}

        <Box
          sx={{
            px: { xs: 2.2, md: 3.2 },
            py: { xs: 2.5, md: 3 },
            background: `
              radial-gradient(
                circle at top right,
                ${accentLight},
                transparent 38%
              ),
              linear-gradient(
                135deg,
                #ffffff 0%,
                #f8fafc 100%
              )
            `,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "stretch",
                md: "center",
              },
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.7,
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3.2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  background: `linear-gradient(
                    135deg,
                    ${accent} 0%,
                    ${accentDark} 100%
                  )`,
                  boxShadow: `0 10px 28px ${accentLight}`,
                }}
              >
                <Article sx={{ fontSize: 28 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    color: "#0f172a",
                    fontSize: {
                      xs: "1.15rem",
                      md: "1.35rem",
                    },
                  }}
                >
                  Blog Management
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.35,
                    fontFamily: FONT,
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                >
                  Manage public news, updates and blog
                  content for{" "}
                  <Box
                    component="span"
                    sx={{
                      color: accent,
                      fontWeight: 800,
                    }}
                  >
                    {portalLabel}
                  </Box>
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateDialog}
              sx={{
                minHeight: 46,
                px: 2.7,
                borderRadius: 3,
                fontFamily: FONT,
                fontWeight: 800,
                textTransform: "none",
                fontSize: "0.92rem",
                background: `linear-gradient(
                  135deg,
                  ${accent} 0%,
                  ${accentDark} 100%
                )`,
                boxShadow:
                  "0 10px 24px rgba(15,23,42,0.12)",
                "&:hover": {
                  background: `linear-gradient(
                    135deg,
                    ${accentDark} 0%,
                    ${accent} 100%
                  )`,
                  boxShadow:
                    "0 14px 30px rgba(15,23,42,0.16)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Add New Blog
            </Button>
          </Box>

          {/* =====================================================
              SUMMARY CARDS
          ===================================================== */}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 2.5 }}
          >
            <Box sx={summaryCardSx}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#94a3b8",
                }}
              >
                TOTAL BLOGS
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "1.45rem",
                  color: "#0f172a",
                }}
              >
                {totalBlogs}
              </Typography>
            </Box>

            <Box sx={summaryCardSx}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#94a3b8",
                }}
              >
                PUBLISHED
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "1.45rem",
                  color: "#16a34a",
                }}
              >
                {activeBlogs}
              </Typography>
            </Box>

            <Box sx={summaryCardSx}>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#94a3b8",
                }}
              >
                HIDDEN
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: "1.45rem",
                  color: "#64748b",
                }}
              >
                {hiddenBlogs}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* =========================================================
            BLOG LIST
        ========================================================= */}

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            bgcolor: "#f8fafc",
            minHeight: 320,
          }}
        >
          {loading ? (
            <Box
              sx={{
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <CircularProgress
                size={38}
                sx={{ color: accent }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontFamily: FONT,
                  fontWeight: 600,
                }}
              >
                Loading blogs...
              </Typography>
            </Box>
          ) : blogs.length === 0 ? (
            <Box
              sx={{
                minHeight: 300,
                px: 2,
                py: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "#ffffff",
                border: "1px dashed #cbd5e1",
              }}
            >
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  bgcolor: accentLight,
                  color: accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Article sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  color: "#0f172a",
                  fontSize: "1.1rem",
                }}
              >
                No blog posts yet
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.7,
                  mb: 2,
                  maxWidth: 430,
                  color: "#64748b",
                  fontFamily: FONT,
                  lineHeight: 1.7,
                }}
              >
                Publish news, updates or important
                information that should be visible on the
                public Blog page.
              </Typography>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openCreateDialog}
                sx={{
                  borderRadius: 3,
                  px: 2.5,
                  textTransform: "none",
                  fontFamily: FONT,
                  fontWeight: 800,
                  bgcolor: accent,
                  "&:hover": {
                    bgcolor: accentDark,
                  },
                }}
              >
                Create First Blog
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {blogs.map((blog) => {
                const imageSrc =
                  buildStoredImageSrc(blog);

                return (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    xl={4}
                    key={blog.id}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 4,
                        overflow: "hidden",
                        border:
                          "1px solid rgba(226,232,240,0.95)",
                        bgcolor: "#fff",
                        transition:
                          "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",

                        "&:hover": {
                          transform:
                            "translateY(-4px)",
                          boxShadow:
                            "0 18px 40px rgba(15,23,42,0.10)",
                          borderColor:
                            "rgba(148,163,184,0.55)",
                        },
                      }}
                    >
                      {/* IMAGE */}

                      <Box
                        sx={{
                          position: "relative",
                          height: 210,
                          bgcolor: "#e2e8f0",
                          overflow: "hidden",
                        }}
                      >
                        {imageSrc ? (
                          <Box
                            component="img"
                            src={imageSrc}
                            alt={
                              blog.title || "Blog"
                            }
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                              transition:
                                "transform 0.35s ease",

                              ".MuiPaper-root:hover &":
                                {
                                  transform:
                                    "scale(1.025)",
                                },
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                "center",
                              color: "#94a3b8",
                            }}
                          >
                            <ImageOutlined
                              sx={{
                                fontSize: 52,
                              }}
                            />
                          </Box>
                        )}

                        <Box
                          sx={{
                            position: "absolute",
                            top: 14,
                            left: 14,
                          }}
                        >
                          <Chip
                            size="small"
                            icon={
                              blog.active ? (
                                <CheckCircle />
                              ) : (
                                <VisibilityOff />
                              )
                            }
                            label={
                              blog.active
                                ? "Published"
                                : "Hidden"
                            }
                            sx={{
                              fontFamily: FONT,
                              fontWeight: 800,
                              bgcolor:
                                blog.active
                                  ? "rgba(22,163,74,0.94)"
                                  : "rgba(51,65,85,0.92)",
                              color: "#fff",
                              backdropFilter:
                                "blur(10px)",

                              "& .MuiChip-icon":
                                {
                                  color: "#fff",
                                  fontSize: 16,
                                },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* CONTENT */}

                      <Box
                        sx={{
                          p: 2.3,
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.6,
                            mb: 1,
                            color: "#94a3b8",
                          }}
                        >
                          <CalendarMonth
                            sx={{ fontSize: 16 }}
                          />

                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: FONT,
                              fontWeight: 600,
                            }}
                          >
                            {formatDate(
                              blog.createdAt ||
                                blog.updatedAt,
                            )}
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontFamily: FONT,
                            fontWeight: 900,
                            color: "#0f172a",
                            fontSize: "1.04rem",
                            lineHeight: 1.45,
                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {blog.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1,
                            color: "#64748b",
                            fontFamily: FONT,
                            lineHeight: 1.7,
                            display:
                              "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient:
                              "vertical",
                            overflow: "hidden",
                            whiteSpace: "pre-line",
                            flexGrow: 1,
                          }}
                        >
                          {blog.content}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* ACTIONS */}

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            startIcon={
                              <Visibility />
                            }
                            onClick={() =>
                              openViewDialog(blog)
                            }
                            sx={{
                              borderRadius: 2.5,
                              px: 1.5,
                              textTransform:
                                "none",
                              fontFamily: FONT,
                              fontWeight: 800,
                              color: accent,
                              bgcolor:
                                accentLight,

                              "&:hover": {
                                bgcolor:
                                  accentLight,
                              },
                            }}
                          >
                            View
                          </Button>

                          <Stack
                            direction="row"
                            spacing={0.7}
                          >
                            <Tooltip title="Edit Blog">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  openEditDialog(
                                    blog,
                                  )
                                }
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 2.3,
                                  color:
                                    "#2563eb",
                                  bgcolor:
                                    "#eff6ff",

                                  "&:hover": {
                                    bgcolor:
                                      "#dbeafe",
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Blog">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleDelete(
                                    blog,
                                  )
                                }
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 2.3,
                                  color:
                                    "#dc2626",
                                  bgcolor:
                                    "#fef2f2",

                                  "&:hover": {
                                    bgcolor:
                                      "#fee2e2",
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* ===========================================================
          ADD / EDIT BLOG DIALOG
      =========================================================== */}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 1080,
            maxHeight: "92vh",
            borderRadius: {
              xs: 2.5,
              sm: 4,
            },
            overflow: "hidden",
            boxShadow:
              "0 30px 90px rgba(15,23,42,0.26)",
            bgcolor: "#f8fafc",
          },
        }}
      >
        {/* DIALOG HEADER */}

        <DialogTitle
          sx={{
            p: 0,
            position: "relative",
          }}
        >
          <Box
            sx={{
              px: { xs: 2.3, sm: 3.2 },
              py: 2.5,
              color: "#fff",
              background: `linear-gradient(
                135deg,
                ${accentDark} 0%,
                ${accent} 100%
              )`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.8,
                  bgcolor:
                    "rgba(255,255,255,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    "1px solid rgba(255,255,255,0.24)",
                }}
              >
                <Article />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: {
                      xs: "1rem",
                      sm: "1.25rem",
                    },
                  }}
                >
                  {editingBlog
                    ? "Edit Blog Post"
                    : "Create New Blog Post"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.2,
                    fontFamily: FONT,
                    opacity: 0.86,
                    fontWeight: 500,
                  }}
                >
                  {editingBlog
                    ? "Update your blog content, image and visibility."
                    : "Create content that will appear on the public Blog page."}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={closeDialog}
              disabled={saving}
              sx={{
                color: "#fff",
                bgcolor:
                  "rgba(255,255,255,0.12)",

                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,0.22)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            p: {
              xs: 2,
              sm: 3,
            },
            bgcolor: "#f8fafc",
          }}
        >
          <Grid
            container
            spacing={2.5}
            sx={{ mt: 0 }}
          >
            {/* =====================================================
                LEFT SIDE
            ===================================================== */}

            <Grid item xs={12} md={7.5}>
              <Stack spacing={2.5}>
                {/* BASIC CONTENT */}

                <Box sx={dialogSectionSx}>
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2,
                        bgcolor: accentLight,
                        color: accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                      }}
                    >
                      <Article
                        sx={{ fontSize: 19 }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontWeight: 900,
                          color: "#0f172a",
                        }}
                      >
                        Blog Information
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: FONT,
                          color: "#64748b",
                        }}
                      >
                        Enter the heading and main
                        content of your post.
                      </Typography>
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    label="Blog Title"
                    placeholder="Enter a clear blog title"
                    value={form.title}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        title:
                          event.target.value,
                      }))
                    }
                    inputProps={{
                      maxLength: 255,
                    }}
                    helperText={`${form.title.length}/255 characters`}
                    sx={{
                      "& .MuiOutlinedInput-root":
                        {
                          borderRadius: 2.5,
                          bgcolor: "#fff",
                        },
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={11}
                    label="Blog Content"
                    placeholder="Write your blog content here..."
                    value={form.content}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        content:
                          event.target.value,
                      }))
                    }
                    sx={{
                      mt: 2.2,

                      "& .MuiOutlinedInput-root":
                        {
                          borderRadius: 2.5,
                          bgcolor: "#fff",
                          alignItems:
                            "flex-start",
                        },
                    }}
                    helperText={`${form.content.length} characters`}
                  />
                </Box>
              </Stack>
            </Grid>

            {/* =====================================================
                RIGHT SIDE
            ===================================================== */}

            <Grid item xs={12} md={4.5}>
              <Stack spacing={2.5}>
                {/* IMAGE UPLOAD */}

                <Box sx={dialogSectionSx}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.8,
                    }}
                  >
                    <ImageOutlined
                      sx={{
                        color: accent,
                        fontSize: 22,
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily: FONT,
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      Featured Image
                    </Typography>
                  </Box>

                  <Button
                    component="label"
                    sx={{
                      width: "100%",
                      p: 0,
                      display: "block",
                      textTransform: "none",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                 <Box
  sx={{
    width: "100%",
    minHeight: 250,
    borderRadius: 3,

    border: previewSrc
      ? "1px solid #e2e8f0"
      : `2px dashed ${accent}`,

    bgcolor: previewSrc
      ? "#ffffff"
      : accentLight,

    overflow: "hidden",
    position: "relative",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    cursor: "pointer",

    p: previewSrc ? 1 : 0,
  }}
>
                      {previewSrc ? (
                        <>
                         <Box
  component="img"
  src={previewSrc}
  alt="Blog preview"
  sx={{
    width: "100%",
    height: "auto",
    maxHeight: 360,
    objectFit: "contain",
    objectPosition: "center",
    display: "block",
    mx: "auto",
    bgcolor: "#ffffff",
  }}
/>

                          <Box
                            sx={{
                              position:
                                "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems:
                                "flex-end",
                              justifyContent:
                                "center",
                              p: 1.5,
                              background:
                                "linear-gradient(to top, rgba(15,23,42,0.75), transparent 55%)",
                            }}
                          >
                            <Box
                              sx={{
                                px: 1.8,
                                py: 0.8,
                                borderRadius: 2.5,
                                bgcolor:
                                  "rgba(255,255,255,0.92)",
                                color:
                                  "#334155",
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: 0.8,
                                fontFamily:
                                  FONT,
                                fontWeight:
                                  800,
                                fontSize:
                                  "0.8rem",
                              }}
                            >
                              <CloudUpload
                                sx={{
                                  fontSize:
                                    18,
                                }}
                              />
                              Change Image
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <Box
                          sx={{
                            p: 3,
                            textAlign: "center",
                            color: accent,
                          }}
                        >
                          <Box
                            sx={{
                              width: 62,
                              height: 62,
                              mx: "auto",
                              mb: 1.5,
                              borderRadius:
                                "50%",
                              bgcolor: "#fff",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              boxShadow:
                                "0 8px 24px rgba(15,23,42,0.08)",
                            }}
                          >
                            <CloudUpload
                              sx={{
                                fontSize: 30,
                              }}
                            />
                          </Box>

                          <Typography
                            sx={{
                              fontFamily: FONT,
                              fontWeight: 900,
                              color:
                                "#334155",
                            }}
                          >
                            Upload Blog Image
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.6,
                              fontFamily: FONT,
                              color:
                                "#64748b",
                              lineHeight: 1.6,
                            }}
                          >
                            Click here to select JPG,
                            PNG or WEBP image.
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <input
                      hidden
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageChange
                      }
                    />
                  </Button>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1.2,
                      color: "#94a3b8",
                      fontFamily: FONT,
                      lineHeight: 1.5,
                    }}
                  >
                    Recommended landscape image •
                    JPG, PNG or WEBP • Maximum size
                    3 MB
                  </Typography>

                  {imageFile && (
                    <Chip
                      size="small"
                      icon={<CheckCircle />}
                      label={imageFile.name}
                      sx={{
                        mt: 1.2,
                        maxWidth: "100%",
                        fontFamily: FONT,
                        fontWeight: 700,
                        color: "#166534",
                        bgcolor: "#f0fdf4",

                        "& .MuiChip-icon": {
                          color: "#16a34a",
                        },
                      }}
                    />
                  )}
                </Box>

                {/* PUBLISH SETTINGS */}

                <Box sx={dialogSectionSx}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.8,
                    }}
                  >
                    <Public
                      sx={{
                        color: accent,
                        fontSize: 22,
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily: FONT,
                        fontWeight: 900,
                        color: "#0f172a",
                      }}
                    >
                      Publishing
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      borderRadius: 3,
                      p: 1.7,
                      bgcolor: form.active
                        ? "#f0fdf4"
                        : "#f8fafc",
                      border: form.active
                        ? "1px solid #bbf7d0"
                        : "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      gap: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: FONT,
                          fontWeight: 800,
                          color: form.active
                            ? "#166534"
                            : "#475569",
                          fontSize: "0.9rem",
                        }}
                      >
                        {form.active
                          ? "Visible on Blog Page"
                          : "Hidden from Blog Page"}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.25,
                          fontFamily: FONT,
                          color: "#64748b",
                          lineHeight: 1.5,
                        }}
                      >
                        {form.active
                          ? "Visitors can see this blog post."
                          : "Only administrators can see this post."}
                      </Typography>
                    </Box>

                    <Switch
                      checked={form.active}
                      onChange={(event) =>
                        setForm(
                          (previous) => ({
                            ...previous,
                            active:
                              event.target
                                .checked,
                          }),
                        )
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked":
                          {
                            color:
                              "#16a34a",
                          },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            bgcolor:
                              "#16a34a",
                          },
                      }}
                    />
                  </Box>
                </Box>

                {/* PORTAL INFO */}

                <Box
                  sx={{
                    borderRadius: 3.5,
                    p: 2,
                    bgcolor: accentLight,
                    border: `1px solid ${accentLight}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: FONT,
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    PUBLISHING TO
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontFamily: FONT,
                      fontWeight: 900,
                      color: accentDark,
                    }}
                  >
                    {portalLabel}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.3,
                      display: "block",
                      fontFamily: FONT,
                      color: "#64748b",
                    }}
                  >
                    This blog will only belong to
                    the currently selected portal.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        {/* DIALOG FOOTER */}

        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderTop: "1px solid #e2e8f0",
            bgcolor: "#fff",
            gap: 1,
          }}
        >
          <Button
            onClick={closeDialog}
            disabled={saving}
            sx={{
              borderRadius: 2.7,
              px: 2.3,
              py: 1,
              color: "#64748b",
              textTransform: "none",
              fontFamily: FONT,
              fontWeight: 800,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={
              saving ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : editingBlog ? (
                <Save />
              ) : (
                <Public />
              )
            }
            sx={{
              minWidth: 150,
              borderRadius: 2.7,
              px: 2.8,
              py: 1,
              textTransform: "none",
              fontFamily: FONT,
              fontWeight: 900,
              background: `linear-gradient(
                135deg,
                ${accent} 0%,
                ${accentDark} 100%
              )`,

              "&:hover": {
                background: `linear-gradient(
                  135deg,
                  ${accentDark} 0%,
                  ${accent} 100%
                )`,
              },
            }}
          >
            {saving
              ? "Saving..."
              : editingBlog
                ? "Update Blog"
                : "Publish Blog"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===========================================================
          VIEW BLOG DIALOG
      =========================================================== */}

      <Dialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: {
              xs: 2.5,
              md: 4,
            },
            overflow: "hidden",
            maxHeight: "92vh",
            boxShadow:
              "0 30px 90px rgba(15,23,42,0.28)",
          },
        }}
      >
        {viewingBlog && (
          <>
            {/* VIEW IMAGE */}

           <Box
  sx={{
    position: "relative",
    bgcolor: "#ffffff",
    overflow: "hidden",
  }}
>
           {viewingImageSrc ? (
  <Box
    sx={{
      width: "100%",
      bgcolor: "#ffffff",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      px: { xs: 1, sm: 2 },
      py: { xs: 1, sm: 2 },

      minHeight: { xs: 220, sm: 280 },
      maxHeight: { xs: 360, sm: 500 },

      overflow: "hidden",
    }}
  >
    <Box
      component="img"
      src={viewingImageSrc}
      alt={viewingBlog.title || "Blog"}
      sx={{
        width: "auto",
        maxWidth: "100%",

        height: "auto",
        maxHeight: { xs: 340, sm: 470 },

        objectFit: "contain",
        objectPosition: "center",

        display: "block",
        mx: "auto",
      }}
    />
  </Box>
              ) : (
                <Box
                  sx={{
                    height: 230,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                  }}
                >
                  <ImageOutlined
                    sx={{ fontSize: 60 }}
                  />
                </Box>
              )}

              <IconButton
                onClick={closeViewDialog}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#fff",
                  bgcolor:
                    "rgba(15,23,42,0.62)",
                  backdropFilter: "blur(8px)",

                  "&:hover": {
                    bgcolor:
                      "rgba(15,23,42,0.82)",
                  },
                }}
              >
                <Close />
              </IconButton>

              <Chip
                icon={
                  viewingBlog.active ? (
                    <CheckCircle />
                  ) : (
                    <VisibilityOff />
                  )
                }
                label={
                  viewingBlog.active
                    ? "Published"
                    : "Hidden"
                }
                sx={{
                  position: "absolute",
                  left: 18,
                  bottom: 18,
                  bgcolor: viewingBlog.active
                    ? "rgba(22,163,74,0.94)"
                    : "rgba(51,65,85,0.94)",
                  color: "#fff",
                  fontFamily: FONT,
                  fontWeight: 800,

                  "& .MuiChip-icon": {
                    color: "#fff",
                  },
                }}
              />
            </Box>

            {/* VIEW CONTENT */}

            <DialogContent
              sx={{
                px: { xs: 2.4, sm: 4 },
                py: { xs: 2.5, sm: 3.5 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  color: "#94a3b8",
                  mb: 1.2,
                }}
              >
                <CalendarMonth
                  sx={{ fontSize: 18 }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: FONT,
                    fontWeight: 600,
                  }}
                >
                  {formatDate(
                    viewingBlog.createdAt ||
                      viewingBlog.updatedAt,
                  )}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  color: "#0f172a",
                  fontSize: {
                    xs: "1.35rem",
                    sm: "1.75rem",
                  },
                  lineHeight: 1.35,
                  overflowWrap: "anywhere",
                }}
              >
                {viewingBlog.title}
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: "0.98rem",
                  lineHeight: 1.9,
                  color: "#475569",
                  whiteSpace: "pre-line",
                  overflowWrap: "anywhere",
                }}
              >
                {viewingBlog.content}
              </Typography>
            </DialogContent>

            <DialogActions
              sx={{
                px: { xs: 2.4, sm: 4 },
                py: 2,
                bgcolor: "#f8fafc",
                borderTop:
                  "1px solid #e2e8f0",
              }}
            >
              <Button
                onClick={closeViewDialog}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontFamily: FONT,
                  fontWeight: 800,
                  color: "#64748b",
                }}
              >
                Close
              </Button>

              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => {
                  const blog = viewingBlog;

                  closeViewDialog();
                  openEditDialog(blog);
                }}
                sx={{
                  borderRadius: 2.5,
                  px: 2.3,
                  textTransform: "none",
                  fontFamily: FONT,
                  fontWeight: 800,
                  bgcolor: accent,

                  "&:hover": {
                    bgcolor: accentDark,
                  },
                }}
              >
                Edit Blog
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default BlogManagementTab;