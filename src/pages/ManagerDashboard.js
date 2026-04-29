import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  TablePagination,
  Avatar,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Dashboard,
  People,
  Assignment,
  Support,
  Block,
  LockOpen,
  ManageAccounts,
  Delete,
  Add,
  Edit,
  Visibility,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  LocationOn,
  BusinessCenter,
  Escalator,
  AssignmentInd,
  QueryStats,
  TrendingUp,
  Schedule,
  PriorityHigh,
  LockReset,
  Download,
  Settings,
  DeleteForever,
  Chat,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { managerAPI, adminAPI, api } from "../services/api";
import Layout from "../components/Layout/Layout";
import {
  CreateQueryDialog,
  ResolveQueryDialog,
} from "../components/QueryDialogs";
import TicketSystemTab from "../components/TicketSystemTab";
import ManagerSecurityLock from "../components/ManagerSecurityLock";

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [managerUnlocked, setManagerUnlocked] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [createQueryOpen, setCreateQueryOpen] = useState(false);
  const [resolveQueryOpen, setResolveQueryOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteRequestsOpen, setDeleteRequestsOpen] = useState(false);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [deleteRequestsLoading, setDeleteRequestsLoading] = useState(false);
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
  // Pagination states
  const [usersPage, setUsersPage] = useState(0);
  const [queriesPage, setQueriesPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [overviewManagedUsers, setOverviewManagedUsers] = useState(0);
  const [totalQueries, setTotalQueries] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState("");
  const [exportMode, setExportMode] = useState("all");
  const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
  const [exportYear, setExportYear] = useState(new Date().getFullYear());
  const [exportBeneficiary, setExportBeneficiary] = useState("");
  const [deathCases, setDeathCases] = useState([]);
  const [managerScope, setManagerScope] = useState(null);
  const [locationHierarchy, setLocationHierarchy] = useState([]);
  const [sambhagOptions, setSambhagOptions] = useState([]);
  const [userDistrictOptions, setUserDistrictOptions] = useState([]);
  const [userBlockOptions, setUserBlockOptions] = useState([]);

  const [exportDistrictOptions, setExportDistrictOptions] = useState([]);
  const [exportBlockOptions, setExportBlockOptions] = useState([]);
  const [exportLocationFilters, setExportLocationFilters] = useState({
    sambhagId: "",
    districtId: "",
    blockId: "",
  });
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [
    districtManagerExportMobileEnabled,
    setDistrictManagerExportMobileEnabled,
  ] = useState(false);
  const [blockManagerExportMobileEnabled, setBlockManagerExportMobileEnabled] =
    useState(false);
  // Filter states
  const [userFilters, setUserFilters] = useState({
    search: "",
    role: "ROLE_USER",
    status: "ACTIVE",
    sambhagId: "",
    districtId: "",
    blockId: "",
  });
  const [queryFilters, setQueryFilters] = useState({
    status: "",
    priority: "",
    type: "assigned",
  });
  const [dateExportDialogOpen, setDateExportDialogOpen] = useState(false);
  const [dateExportType, setDateExportType] = useState("");
  const [dateExportFromDate, setDateExportFromDate] = useState("");
  const [dateExportToDate, setDateExportToDate] = useState("");
  const [managedLocationCounts, setManagedLocationCounts] = useState({});
  // Manager role levels and permissions
  const isSuperAdmin = user?.role === "ROLE_SUPERADMIN";
  const isAdmin = user?.role === "ROLE_ADMIN";
  const isSambhagManager = user?.role === "ROLE_SAMBHAG_MANAGER";
  const isDistrictManager = user?.role === "ROLE_DISTRICT_MANAGER";
  const isBlockManager = user?.role === "ROLE_BLOCK_MANAGER";
  const canDeleteUsers = isSambhagManager;
  const canManageUsers =
    isSuperAdmin || isAdmin || isSambhagManager || isDistrictManager;
  const canAssignQueries =
    isSuperAdmin || isAdmin || isSambhagManager || isDistrictManager;
  const canEscalateQueries =
    isSuperAdmin || isSambhagManager || isDistrictManager || isBlockManager;
  const canChangeRoles = isSuperAdmin || isAdmin;
  const getAny = (obj, keys) => {
    for (const key of keys) {
      if (obj?.[key] !== undefined && obj?.[key] !== null) {
        return obj[key];
      }
    }
    return undefined;
  };
  const isManagerReAuthValid = () => {
    const unlocked =
      sessionStorage.getItem("managerDashboardReAuth") === "true";
    const expiresAt = Number(
      sessionStorage.getItem("managerDashboardReAuthExpiresAt") || 0,
    );

    return unlocked && expiresAt > Date.now();
  };
  useEffect(() => {
    if (isManagerReAuthValid()) {
      setManagerUnlocked(true);
      setSecurityDialogOpen(false);
    } else {
      setManagerUnlocked(false);
      setSecurityDialogOpen(true);
    }
  }, []);
  const normalizeHierarchy = (data) => {
    const states = Array.isArray(data?.states)
      ? data.states
      : Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

    const sambhags = [];

    states.forEach((state) => {
      const sambhagList =
        state?.sambhags || state?.sambhagList || state?.divisions || [];

      sambhagList.forEach((sambhag) => {
        const districtsRaw =
          sambhag?.districts ||
          sambhag?.districtList ||
          sambhag?.districtResponses ||
          [];

        sambhags.push({
          id: String(
            sambhag.id || sambhag.sambhagId || sambhag.locationId || "",
          ),
          name:
            sambhag.name ||
            sambhag.sambhagName ||
            sambhag.locationName ||
            "Unnamed Sambhag",
          stateId: String(state.id || ""),
          stateName: state.name || "",
          original: sambhag,

          districts: districtsRaw
            .map((district) => {
              const blocksRaw =
                district?.blocks ||
                district?.blockList ||
                district?.blockResponses ||
                [];

              return {
                id: String(
                  district.id ||
                    district.districtId ||
                    district.locationId ||
                    "",
                ),
                name:
                  district.name ||
                  district.districtName ||
                  district.locationName ||
                  "Unnamed District",
                sambhagId: String(sambhag.id || ""),
                original: district,

                blocks: blocksRaw
                  .map((block) => ({
                    id: String(
                      block.id || block.blockId || block.locationId || "",
                    ),
                    name:
                      block.name ||
                      block.blockName ||
                      block.locationName ||
                      "Unnamed Block",
                    districtId: String(district.id || ""),
                    original: block,
                  }))
                  .filter((block) => block.id),
              };
            })
            .filter((district) => district.id),
        });
      });
    });

    return sambhags.filter((sambhag) => sambhag.id);
  };
  const buildAssignedHierarchyFromScope = (fullHierarchy, scope) => {
    if (isAdmin || isSuperAdmin) {
      return fullHierarchy;
    }

    const managedLocations = scope?.managedLocations || [];

    const assignedSambhagIds = managedLocations
      .filter((x) => x.locationType === "SAMBHAG")
      .map((x) => String(x.locationId));

    const assignedDistrictIds = managedLocations
      .filter((x) => x.locationType === "DISTRICT")
      .map((x) => String(x.locationId));

    const assignedBlockIds = managedLocations
      .filter((x) => x.locationType === "BLOCK")
      .map((x) => String(x.locationId));

    return fullHierarchy
      .map((sambhag) => {
        const sambhagExplicitlyAssigned = assignedSambhagIds.includes(
          String(sambhag.id),
        );

        const districts = (sambhag.districts || [])
          .map((district) => {
            const districtExplicitlyAssigned = assignedDistrictIds.includes(
              String(district.id),
            );

            const blocks = (district.blocks || []).filter((block) =>
              assignedBlockIds.includes(String(block.id)),
            );

            if (districtExplicitlyAssigned || blocks.length > 0) {
              return {
                ...district,
                blocks,
              };
            }

            return null;
          })
          .filter(Boolean);

        if (sambhagExplicitlyAssigned || districts.length > 0) {
          return {
            ...sambhag,
            districts,
          };
        }

        return null;
      })
      .filter(Boolean);
  };
  const openDateExportDialog = (type) => {
    setDateExportType(type);
    setDateExportFromDate("");
    setDateExportToDate("");
    setDateExportDialogOpen(true);
  };
  const getAssignedLocationIds = () => {
    const locations = managerScope?.managedLocations || [];

    return {
      sambhagIds: locations
        .filter((x) => x.locationType === "SAMBHAG")
        .map((x) => String(x.locationId)),

      districtIds: locations
        .filter((x) => x.locationType === "DISTRICT")
        .map((x) => String(x.locationId)),

      blockIds: locations
        .filter((x) => x.locationType === "BLOCK")
        .map((x) => String(x.locationId)),
    };
  };
  const handleManagerDateRelatedExport = async () => {
    try {
      setExportLoading(true);

      const areaParams = getCurrentExportAreaParams();
      const params = {
        ...areaParams,
        fromDate: dateExportFromDate || null,
        toDate: dateExportToDate || null,
      };

      let response;
      let fileName;

      if (dateExportType === "joining") {
        response = await managerAPI.exportUsersByJoiningDate(params);
        fileName = "joining_date_users.csv";
      } else {
        response = await managerAPI.exportUsersByRetirementDate(params);
        fileName = "retirement_date_users.csv";
      }

      downloadBlobFile(response.data, fileName);

      showSnackbar("Date related export downloaded successfully!", "success");
      setDateExportDialogOpen(false);
    } catch (error) {
      console.error("Manager date export error:", error);
      showSnackbar(
        error?.response?.data?.message || "Date related export failed!",
        "error",
      );
    } finally {
      setExportLoading(false);
    }
  };
  const filterHierarchyByManagerScope = (hierarchy, scope) => {
    if (!Array.isArray(hierarchy)) return [];

    if (isAdmin || isSuperAdmin) {
      return hierarchy;
    }

    const locations = scope?.managedLocations || [];

    const allowedSambhagIds = locations
      .filter((x) => x.locationType === "SAMBHAG")
      .map((x) => String(x.locationId));

    const allowedDistrictIds = locations
      .filter((x) => x.locationType === "DISTRICT")
      .map((x) => String(x.locationId));

    const allowedBlockIds = locations
      .filter((x) => x.locationType === "BLOCK")
      .map((x) => String(x.locationId));

    return hierarchy
      .map((sambhag) => {
        const sambhagAllowed = allowedSambhagIds.includes(String(sambhag.id));

        const districts = (sambhag.districts || [])
          .map((district) => {
            const districtAllowed =
              sambhagAllowed ||
              allowedDistrictIds.includes(String(district.id));

            const blocks = (district.blocks || []).filter((block) => {
              return (
                districtAllowed || allowedBlockIds.includes(String(block.id))
              );
            });

            if (districtAllowed || blocks.length > 0) {
              return {
                ...district,
                blocks,
              };
            }

            return null;
          })
          .filter(Boolean);

        if (sambhagAllowed || districts.length > 0) {
          return {
            ...sambhag,
            districts,
          };
        }

        return null;
      })
      .filter(Boolean);
  };
const getLocationCountKey = (location) => {
  return `${location.locationType}_${location.locationId}`;
};

const getLocationCountParams = (location) => {
  const params = {
    page: 0,
    size: 1,
    role: "ROLE_USER",
    status: "ACTIVE",
  };

  if (location.locationType === "SAMBHAG") {
    params.sambhagId = location.locationId;
  }

  if (location.locationType === "DISTRICT") {
    params.districtId = location.locationId;
  }

  if (location.locationType === "BLOCK") {
    params.blockId = location.locationId;
  }

  return params;
};

const fetchManagedLocationCounts = async (scope) => {
  try {
    const locations = scope?.managedLocations || [];

    if (!locations.length) {
      setManagedLocationCounts({});
      return;
    }

    const countEntries = await Promise.all(
      locations.map(async (location) => {
        try {
          const response = await managerAPI.getAccessibleUsers(
            getLocationCountParams(location)
          );

          return [
            getLocationCountKey(location),
            response.data?.totalElements || 0,
          ];
        } catch (error) {
          console.error("Error fetching location count:", location, error);
          return [getLocationCountKey(location), 0];
        }
      })
    );

    setManagedLocationCounts(Object.fromEntries(countEntries));
  } catch (error) {
    console.error("Error fetching managed location counts:", error);
    setManagedLocationCounts({});
  }
};

  const loadManagerScopeAndLocations = async () => {
    try {
      const [scopeResponse, hierarchyResponse] = await Promise.all([
        managerAPI.getManagerScope(),
        api.get("/locations/hierarchy"),
      ]);

      const scope = scopeResponse.data;
      const hierarchy = normalizeHierarchy(hierarchyResponse.data);

      console.log("Manager Scope:", scope);
      console.log("Normalized Hierarchy:", hierarchy);

      const filteredHierarchy = buildAssignedHierarchyFromScope(
        hierarchy,
        scope,
      );
      console.log("Filtered Hierarchy:", filteredHierarchy);

      setManagerScope(scope);
      fetchManagedLocationCounts(scope);
      setLocationHierarchy(filteredHierarchy);
      setSambhagOptions(filteredHierarchy);

      const firstSambhag = filteredHierarchy[0] || null;
      const firstDistrict = firstSambhag?.districts?.[0] || null;
      const firstBlock = firstDistrict?.blocks?.[0] || null;

      setUserDistrictOptions(firstSambhag?.districts || []);
      setUserBlockOptions(firstDistrict?.blocks || []);

      setExportDistrictOptions(firstSambhag?.districts || []);
      setExportBlockOptions(firstDistrict?.blocks || []);

      if (user?.role === "ROLE_DISTRICT_MANAGER") {
        const districtFilters = {
          sambhagId: firstSambhag?.id || "",
          districtId: firstDistrict?.id || "",
          blockId: "",
        };

        setUserFilters((prev) => ({
          ...prev,
          ...districtFilters,
        }));

        setExportLocationFilters(districtFilters);
      }

      if (user?.role === "ROLE_BLOCK_MANAGER") {
        const blockFilters = {
          sambhagId: firstSambhag?.id || "",
          districtId: firstDistrict?.id || "",
          blockId: firstBlock?.id || "",
        };

        setUserFilters((prev) => ({
          ...prev,
          ...blockFilters,
        }));

        setExportLocationFilters(blockFilters);
      }
    } catch (error) {
      console.error("Error loading manager scope/location hierarchy:", error);
      showSnackbar("Error loading area filters!", "error");
    }
  };

  const getCurrentExportAreaParams = () => {
    const params = {};

    if (exportLocationFilters.sambhagId) {
      params.sambhagId = exportLocationFilters.sambhagId;
    }

    if (exportLocationFilters.districtId) {
      params.districtId = exportLocationFilters.districtId;
    }

    if (exportLocationFilters.blockId) {
      params.blockId = exportLocationFilters.blockId;
    }

    return params;
  };
  const fetchOverviewManagedUsersCount = async () => {
    try {
     const response = await managerAPI.getAccessibleUsers({
  page: 0,
  size: 1,
  role: "ROLE_USER",
  status: "ACTIVE",
});

      setOverviewManagedUsers(response.data?.totalElements || 0);
    } catch (error) {
      console.error("Error fetching managed users count:", error);
      setOverviewManagedUsers(0);
    }
  };
  // API Functions
  const fetchDashboardOverview = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getDashboardOverview();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      showSnackbar("Error loading dashboard!", "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchDeathCases = async () => {
    try {
      const response = await adminAPI.getDeathCases();
      setDeathCases(response.data || []);
    } catch (error) {
      console.error("Error fetching death cases:", error);
      setDeathCases([]);
    }
  };
  const fetchAccessibleUsers = async () => {
    try {
      const params = {
        page: usersPage,
        size: rowsPerPage,
        status: userFilters.status,
        role: userFilters.role,
        name: userFilters.search || "",
        sambhagId: userFilters.sambhagId,
        districtId: userFilters.districtId,
        blockId: userFilters.blockId,
      };

      const response = await managerAPI.getAccessibleUsers(params);
      setUsers(response.data.content || []);
      setTotalUsers(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Error loading users!", "error");
    }
  };
  const handleUserSambhagChange = (event) => {
    const sambhagId = event.target.value;

    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(sambhagId),
    );

    setUserFilters((prev) => ({
      ...prev,
      sambhagId,
      districtId: "",
      blockId: "",
    }));

    setUserDistrictOptions(selectedSambhag?.districts || []);
    setUserBlockOptions([]);
    setUsersPage(0);
  };

  const handleUserDistrictChange = (event) => {
    const districtId = event.target.value;

    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(userFilters.sambhagId),
    );

    const selectedDistrict = selectedSambhag?.districts?.find(
      (item) => String(item.id) === String(districtId),
    );

    setUserFilters((prev) => ({
      ...prev,
      districtId,
      blockId: "",
    }));

    setUserBlockOptions(selectedDistrict?.blocks || []);
    setUsersPage(0);
  };

  const handleUserBlockChange = (event) => {
    const blockId = event.target.value;

    setUserFilters((prev) => ({
      ...prev,
      blockId,
    }));

    setUsersPage(0);
  };

  const handleExportSambhagChange = (event) => {
    const sambhagId = event.target.value;

    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(sambhagId),
    );

    setExportLocationFilters({
      sambhagId,
      districtId: "",
      blockId: "",
    });

    setExportDistrictOptions(selectedSambhag?.districts || []);
    setExportBlockOptions([]);
  };

  const handleExportDistrictChange = (event) => {
    const districtId = event.target.value;

    const selectedSambhag = locationHierarchy.find(
      (item) => String(item.id) === String(exportLocationFilters.sambhagId),
    );

    const selectedDistrict = selectedSambhag?.districts?.find(
      (item) => String(item.id) === String(districtId),
    );

    setExportLocationFilters((prev) => ({
      ...prev,
      districtId,
      blockId: "",
    }));

    setExportBlockOptions(selectedDistrict?.blocks || []);
  };

  const handleExportBlockChange = (event) => {
    setExportLocationFilters((prev) => ({
      ...prev,
      blockId: event.target.value,
    }));
  };
  const fetchMyDeleteRequests = async () => {
    if (!deleteRequestsOpen) return;

    try {
      setDeleteRequestsLoading(true);
      const response = await managerAPI.getMyDeleteRequests();
      setDeleteRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching my delete requests:", error);
      showSnackbar("Error loading delete requests!", "error");
      setDeleteRequests([]);
    } finally {
      setDeleteRequestsLoading(false);
    }
  };
  useEffect(() => {
    fetchMyDeleteRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRequestsOpen]);

  const downloadBlobFile = (
    data,
    filename,
    type = "text/csv;charset=utf-8",
  ) => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  const openExportDialog = async (type) => {
    setExportType(type);

    const defaultMode =
      type === "pending-profiles" ||
      type === "users" ||
      type === "zero-utr" ||
      type === "no-login-3-months" ||
      type === "no-sahyog-2-months"
        ? "all"
        : "beneficiary";

    setExportMode(defaultMode);
    setExportBeneficiary("");
    setExportMonth(new Date().getMonth() + 1);
    setExportYear(new Date().getFullYear());
    if (isBlockManager) {
      const firstSambhag = locationHierarchy[0];
      const firstDistrict = firstSambhag?.districts?.[0];
      const firstBlock = firstDistrict?.blocks?.[0];

      setExportLocationFilters({
        sambhagId: firstSambhag?.id || "",
        districtId: firstDistrict?.id || "",
        blockId: firstBlock?.id || "",
      });

      setExportDistrictOptions(firstSambhag?.districts || []);
      setExportBlockOptions(firstDistrict?.blocks || []);
    } else {
      setExportLocationFilters({
        sambhagId: "",
        districtId: "",
        blockId: "",
      });

      setExportDistrictOptions([]);
      setExportBlockOptions([]);
    }

    if ((type === "sahyog" || type === "asahyog") && deathCases.length === 0) {
      await fetchDeathCases();
    }

    setExportDialogOpen(true);
  };
  const handleDeleteUser = async (targetUser) => {
    const userId = typeof targetUser === "string" ? targetUser : targetUser?.id;
    if (!userId) return;

    if (!canDeleteUsers) {
      showSnackbar("You do not have permission to delete users!", "error");
      return;
    }

    if (
      targetUser?.role === "ROLE_ADMIN" ||
      targetUser?.role === "ROLE_SUPERADMIN"
    ) {
      showSnackbar(
        "Admin/Super Admin cannot be deleted from this dashboard!",
        "error",
      );
      return;
    }

    const reason = window.prompt(
      "Enter delete reason (optional):",
      "Manager requested delete",
    );
    if (reason === null) return;

    try {
      await managerAPI.softDeleteUserWithApproval(userId, {
        reason: reason || "Manager requested delete",
        requestedFromDashboard: "MANAGER_DASHBOARD",
      });

      showSnackbar("Delete request sent to admin successfully!", "success");
      fetchAccessibleUsers();
      fetchMyDeleteRequests();
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar(
        error?.response?.data?.message || "Error deleting user!",
        "error",
      );
    }
  };
  const handleManagerExport = async () => {
    try {
      setExportLoading(true);

      let response;
      const areaParams = getCurrentExportAreaParams();

      if (exportType === "users") {
        response = await managerAPI.exportUsers(areaParams);
        downloadBlobFile(response.data, "our_member_list.csv");
      }
      if (exportType === "no-login-3-months") {
        response = await managerAPI.exportNoLoginThreeMonths(areaParams);
        downloadBlobFile(response.data, "no_login_3_months_users.csv");
      }

      if (exportType === "no-sahyog-2-months") {
        response = await managerAPI.exportNoSahyogTwoMonths(areaParams);
        downloadBlobFile(response.data, "no_sahyog_2_months_users.csv");
      }
      if (exportType === "pending-profiles") {
        response = await managerAPI.exportPendingProfiles(areaParams);
        downloadBlobFile(response.data, "not_profile_updated_list.csv");
      }

      if (exportType === "zero-utr") {
        response = await managerAPI.exportZeroUtrMembers(areaParams);
        downloadBlobFile(response.data, "zero_utr_members_list.csv");
      }

      if (exportType === "sahyog") {
        if (exportMode === "beneficiary") {
          response = await managerAPI.exportSahyogByBeneficiary({
            beneficiaryId: exportBeneficiary || null,
            ...areaParams,
          });
          downloadBlobFile(response.data, "sahyog_by_beneficiary.csv");
        } else if (exportMode === "month") {
          response = await managerAPI.exportSahyog({
            month: exportMonth,
            year: exportYear,
            ...areaParams,
          });
          downloadBlobFile(
            response.data,
            `sahyog_${exportMonth}_${exportYear}.csv`,
          );
        } else {
          response = await managerAPI.exportAllSahyog(areaParams);
          downloadBlobFile(response.data, "sahyog_all.csv");
        }
      }

      if (exportType === "asahyog") {
        if (exportMode === "beneficiary") {
          response = await managerAPI.exportAsahyogByBeneficiary({
            beneficiaryId: exportBeneficiary || null,
            ...areaParams,
          });
          downloadBlobFile(response.data, "asahyog_by_beneficiary.csv");
        } else if (exportMode === "month") {
          response = await managerAPI.exportAsahyog({
            month: exportMonth,
            year: exportYear,
            ...areaParams,
          });
          downloadBlobFile(
            response.data,
            `asahyog_${exportMonth}_${exportYear}.csv`,
          );
        } else {
          response = await managerAPI.exportAllAsahyog(areaParams);
          downloadBlobFile(response.data, "asahyog_all.csv");
        }
      }

      setExportDialogOpen(false);
      showSnackbar("Export completed successfully!", "success");
    } catch (error) {
      console.error("Error exporting:", error);
      showSnackbar(
        error?.response?.data?.message || "Error exporting file!",
        "error",
      );
    } finally {
      setExportLoading(false);
    }
  };
  const handleOpenSettings = async () => {
    try {
      setSettingsDialogOpen(true);
      setSettingsLoading(true);

      const [districtManagerMobileResponse, blockManagerMobileResponse] =
        await Promise.all([
          adminAPI.getDistrictManagerExportMobileSetting(),
          adminAPI.getBlockManagerExportMobileSetting(),
        ]);

      setDistrictManagerExportMobileEnabled(
        districtManagerMobileResponse.data
          ?.districtManagerExportMobileEnabled === true,
      );

      setBlockManagerExportMobileEnabled(
        blockManagerMobileResponse.data?.blockManagerExportMobileEnabled ===
          true,
      );
    } catch (error) {
      console.error("Error loading settings:", error);
      showSnackbar("Failed to load settings!", "error");
      setSettingsDialogOpen(false);
    } finally {
      setSettingsLoading(false);
    }
  };
  const handleSaveSettings = async () => {
    try {
      setSettingsSaving(true);

      await Promise.all([
        adminAPI.updateDistrictManagerExportMobileSetting(
          districtManagerExportMobileEnabled,
        ),
        adminAPI.updateBlockManagerExportMobileSetting(
          blockManagerExportMobileEnabled,
        ),
      ]);

      showSnackbar("Settings updated successfully!", "success");
      setSettingsDialogOpen(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to save settings!",
        "error",
      );
    } finally {
      setSettingsSaving(false);
    }
  };
  const fetchQueries = async () => {
    try {
      const params = {
        page: queriesPage,
        size: rowsPerPage,
        ...queryFilters,
      };
      const response = await managerAPI.getQueries(params);
      setQueries(response.data.content || []);
      setTotalQueries(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching queries:", error);
      showSnackbar("Error loading queries!", "error");
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await managerAPI.getAssignments();
      setAssignments(response.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      showSnackbar("Error loading assignments!", "error");
    }
  };
  const openPasswordReset = (targetUser) => {
    setPasswordResetUser(targetUser);
    setPasswordResetOpen(true);
  };

  const closePasswordReset = () => {
    setPasswordResetOpen(false);
    setPasswordResetUser(null);
  };

  const submitPasswordReset = async () => {
    if (!passwordResetUser?.id) return;

    try {
      setPasswordResetLoading(true);
      await managerAPI.resetUserPassword(passwordResetUser.id);
      showSnackbar("Password reset successfully!", "success");
      closePasswordReset();
    } catch (error) {
      console.error("Error resetting password:", error);
      showSnackbar(
        error?.response?.data?.message || "Failed to reset password!",
        "error",
      );
    } finally {
      setPasswordResetLoading(false);
    }
  };

  // Action Handlers
  const handleBlockUser = async (userId, reason = "Administrative action") => {
    try {
      const targetUser = users.find((u) => u.id === userId);

      if (targetUser?.role === "ROLE_ADMIN") {
        showSnackbar(
          "Admin user cannot be blocked from this dashboard!",
          "error",
        );
        return;
      }
      await managerAPI.blockUser(userId, reason);
      showSnackbar("User blocked successfully!", "success");
      fetchAccessibleUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      showSnackbar("Error blocking user!", "error");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const targetUser = users.find((u) => u.id === userId);

      if (targetUser?.role === "ROLE_ADMIN") {
        showSnackbar(
          "Admin user cannot be modified from this dashboard!",
          "error",
        );
        return;
      }

      await managerAPI.unblockUser(userId);
      showSnackbar("User unblocked successfully!", "success");
      fetchAccessibleUsers();
    } catch (error) {
      console.error("Error unblocking user:", error);
      showSnackbar("Error unblocking user!", "error");
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await managerAPI.updateUserRole(userId, newRole);
      showSnackbar("User role updated successfully!", "success");
      fetchAccessibleUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      showSnackbar("Error updating role!", "error");
    }
  };

  const handleAssignQuery = async (queryId, managerId) => {
    try {
      await managerAPI.assignQuery(queryId, managerId);
      showSnackbar("Query assigned successfully!", "success");
      fetchQueries();
    } catch (error) {
      console.error("Error assigning query:", error);
      showSnackbar("Error assigning query!", "error");
    }
  };

  const handleResolveQuery = async (queryId, resolution) => {
    try {
      await managerAPI.resolveQuery(queryId, resolution);
      showSnackbar("Query resolved successfully!", "success");
      fetchQueries();
    } catch (error) {
      console.error("Error resolving query:", error);
      showSnackbar("Error resolving query!", "error");
    }
  };

  const handleEscalateQuery = async (queryId) => {
    try {
      await managerAPI.escalateQuery(queryId);
      showSnackbar("Query escalated successfully!", "success");
      fetchQueries();
    } catch (error) {
      console.error("Error escalating query:", error);
      showSnackbar("Error escalating query!", "error");
    }
  };

  // Utility Functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#4caf50";
      case "blocked":
        return "#f44336";
      case "deleted":
        return "#9e9e9e";
      case "pending":
        return "#ff9800";
      case "need_clarification":
        return "#2196f3";
      case "resolved":
        return "#4caf50";
      case "cancel":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "#d32f2f";
      case "high":
        return "#ff5722";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#757575";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Admin";
      case "ROLE_SAMBHAG_MANAGER":
        return "Division Manager";
      case "ROLE_DISTRICT_MANAGER":
        return "District Manager";
      case "ROLE_BLOCK_MANAGER":
        return "Block Manager";
      case "ROLE_USER":
        return "User";
      default:
        return role;
    }
  };

  // Effects
  useEffect(() => {
    fetchDashboardOverview();
    fetchAssignments();
    loadManagerScopeAndLocations();
    fetchOverviewManagedUsersCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchAccessibleUsers();
    }
  }, [activeTab, usersPage, rowsPerPage, userFilters]);

  useEffect(() => {
    if (activeTab === 2) {
      fetchQueries();
    }
  }, [activeTab, queriesPage, rowsPerPage, queryFilters]);

  // Dashboard Stats Cards
const renderDashboardStats = () => {
  if (!dashboardData) return null;

  const userStats = dashboardData.userStats || {};
  const queryStats = dashboardData.queryStats || {};
  const scope = managerScope || dashboardData.scope || {};

const totalUsers =
  Number(
    userStats.totalUsers ??
    dashboardData.summary?.totalUsers ??
    dashboardData.scope?.totalUsers ??
    0
  );

const activeUsers =
  Number(userStats.activeUsers ?? overviewManagedUsers ?? 0);

  const blockedUsers =
    userStats.blockedUsers ??
    0;

const pendingTickets = Number(queryStats.pendingCount ?? 0);
const clarificationTickets = Number(queryStats.needClarificationCount ?? 0);
const resolvedTickets = Number(queryStats.resolvedCount ?? 0);
const cancelTickets = Number(queryStats.cancelCount ?? 0);
const overdueTickets = Number(queryStats.overdueCount ?? 0);

const totalTickets =
  Number(queryStats.totalAssigned ?? 0) ||
  pendingTickets + clarificationTickets + resolvedTickets + cancelTickets;

  const managedAreas =
    scope.managedLocations?.length ||
    scope.totalLocations ||
    0;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <People sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      softBg: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      subtitle: `${activeUsers} Active • ${blockedUsers} Blocked`,
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: <CheckCircle sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      softBg: "rgba(5, 150, 105, 0.10)",
      color: "#047857",
      subtitle: "Currently active members",
    },
    {
      title: "Pending Tickets",
      value: pendingTickets,
      icon: <Assignment sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      softBg: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      subtitle: "Waiting for action",
    },
    {
      title: "Need Clarification",
      value: clarificationTickets,
      icon: <Info sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
      softBg: "rgba(14, 165, 233, 0.10)",
      color: "#0369a1",
      subtitle: "User input required",
    },
    {
      title: "Resolved Tickets",
      value: resolvedTickets,
      icon: <CheckCircle sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      softBg: "rgba(22, 163, 74, 0.10)",
      color: "#15803d",
      subtitle: `${totalTickets} total assigned tickets`,
    },
    {
      title: "Overdue Tickets",
      value: overdueTickets,
      icon: <Warning sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
      softBg: "rgba(239, 68, 68, 0.10)",
      color: "#b91c1c",
      subtitle: "Needs urgent attention",
    },
    {
      title: "Managed Areas",
      value: managedAreas,
      icon: <LocationOn sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
      softBg: "rgba(124, 58, 237, 0.10)",
      color: "#5b21b6",
      subtitle: `${scope.totalSambhags || 0} Divisions • ${scope.totalDistricts || 0} Districts • ${scope.totalBlocks || 0} Blocks`,
    },
    {
      title: "Ticket Load",
      value: totalTickets,
      icon: <QueryStats sx={{ fontSize: 30 }} />,
      gradient: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
      softBg: "rgba(15, 118, 110, 0.10)",
      color: "#0f766e",
      subtitle: "Assigned ticket workload",
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(148, 163, 184, 0.20)",
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)",
              transition: "all 0.25s ease",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                right: -38,
                top: -38,
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: stat.softBg,
              },
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 24px 60px rgba(15, 23, 42, 0.13)",
              },
            }}
          >
            <CardContent sx={{ p: 2.4, position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "18px",
                    background: stat.gradient,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 14px 28px ${stat.color}33`,
                  }}
                >
                  {stat.icon}
                </Box>

                {stat.value > 0 && (
                  <Chip
                    size="small"
                    label="Live"
                    sx={{
                      height: 22,
                      fontWeight: 800,
                      color: stat.color,
                      bgcolor: stat.softBg,
                      border: `1px solid ${stat.color}22`,
                    }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  fontWeight: 950,
                  color: "#0f172a",
                  fontSize: "2rem",
                  lineHeight: 1,
                  mb: 0.8,
                }}
              >
                {stat.value}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900,
                  color: stat.color,
                  fontSize: "0.98rem",
                  mb: 0.4,
                }}
              >
                {stat.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontWeight: 650,
                  lineHeight: 1.35,
                }}
              >
                {stat.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

  // Users Management Tab
 // Users Management Tab
const renderUsersTab = () => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: '28px',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(18px)',
      border: '1px solid rgba(148, 163, 184, 0.22)',
      boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)',
    }}
  >
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(239,246,255,0.94) 55%, rgba(250,245,255,0.94) 100%)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: '#172554',
              letterSpacing: '-0.02em',
            }}
          >
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.3 }}>
            View and manage users available under your assigned area.
          </Typography>
        </Box>

        <Chip
          label={`${totalUsers} Users`}
          sx={{
            fontWeight: 900,
            color: '#2563eb',
            bgcolor: 'rgba(37, 99, 235, 0.10)',
            border: '1px solid rgba(37, 99, 235, 0.18)',
            px: 0.8,
          }}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: '22px',
          bgcolor: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.04)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1.3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Search user..."
            value={userFilters.search}
            onChange={(e) => {
              setUsersPage(0);
              setUserFilters((prev) => ({ ...prev, search: e.target.value }));
            }}
            sx={{
              minWidth: { xs: '100%', sm: 220 },
              ...premiumFieldSx,
            }}
          />

          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 }, ...premiumFieldSx }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={userFilters.status}
              label="Status"
              onChange={(e) => {
                setUsersPage(0);
                setUserFilters((prev) => ({ ...prev, status: e.target.value }));
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="BLOCKED">Blocked</MenuItem>
            </Select>
          </FormControl>

          {!isBlockManager && (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 170 }, ...premiumFieldSx }}>
              <InputLabel>Sambhag</InputLabel>
              <Select
                value={userFilters.sambhagId}
                label="Sambhag"
                onChange={handleUserSambhagChange}
              >
                <MenuItem value="">All Assigned Sambhag</MenuItem>
                {sambhagOptions.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {!isBlockManager && (
            <FormControl
              size="small"
              sx={{ minWidth: { xs: '100%', sm: 170 }, ...premiumFieldSx }}
              disabled={!userFilters.sambhagId}
            >
              <InputLabel>District</InputLabel>
              <Select
                value={userFilters.districtId}
                label="District"
                onChange={handleUserDistrictChange}
              >
                <MenuItem value="">All District</MenuItem>
                {userDistrictOptions.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl
            size="small"
            sx={{ minWidth: { xs: '100%', sm: 170 }, ...premiumFieldSx }}
            disabled={!userFilters.districtId || isBlockManager}
          >
            <InputLabel>Block</InputLabel>
            <Select
              value={userFilters.blockId}
              label="Block"
              onChange={handleUserBlockChange}
            >
              <MenuItem value="">All Block</MenuItem>
              {userBlockOptions.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>

    <TableContainer
      sx={{
        bgcolor: '#fff',
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(148, 163, 184, 0.55)',
          borderRadius: 8,
        },
      }}
    >
      <Table sx={{ minWidth: 980 }}>
        <TableHead>
          <TableRow
            sx={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
              '& th': {
                borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
                py: 1.7,
              },
            }}
          >
            <TableCell sx={{ fontWeight: 900, color: '#172554' }}>User</TableCell>
            <TableCell sx={{ fontWeight: 900, color: '#172554' }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 900, color: '#172554' }}>Location</TableCell>
            <TableCell sx={{ fontWeight: 900, color: '#172554' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 900, color: '#172554' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{
                transition: 'all 0.2s ease',
                '& td': {
                  borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
                  py: 1.7,
                },
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      boxShadow: '0 10px 22px rgba(37, 99, 235, 0.22)',
                      fontWeight: 900,
                    }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        lineHeight: 1.25,
                      }}
                    >
                      {user.name || '-'}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748b',
                        display: 'block',
                        mt: 0.2,
                      }}
                    >
                      {user.email || '-'}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748b',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.3,
                        mt: 0.2,
                        px: 0.8,
                        py: 0.2,
                        borderRadius: '999px',
                        bgcolor: 'rgba(37, 99, 235, 0.07)',
                      }}
                    >
                      📱 {user.mobileNumber || '-'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  label={getRoleLabel(user.role)}
                  size="small"
                  sx={{
                    fontWeight: 900,
                    color: user.role === 'ROLE_ADMIN' ? '#991b1b' : '#1e3a8a',
                    bgcolor:
                      user.role === 'ROLE_ADMIN'
                        ? 'rgba(239, 68, 68, 0.10)'
                        : 'rgba(37, 99, 235, 0.10)',
                    border:
                      user.role === 'ROLE_ADMIN'
                        ? '1px solid rgba(239, 68, 68, 0.20)'
                        : '1px solid rgba(37, 99, 235, 0.18)',
                  }}
                />
              </TableCell>

              <TableCell>
                <Box
                  sx={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: 0.4,
                    px: 1.2,
                    py: 0.8,
                    borderRadius: '14px',
                    bgcolor: '#f8fafc',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#334155',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <LocationOn sx={{ fontSize: 14, mr: 0.5, color: '#2563eb' }} />
                    {user.departmentSambhag || 'N/A'} / {user.departmentDistrict || 'N/A'}
                  </Typography>

                  {user.departmentBlock && (
                    <Typography variant="caption" sx={{ color: '#64748b', pl: 2.3 }}>
                      Block: {user.departmentBlock}
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  label={
                    user.status === 'ACTIVE'
                      ? 'Active'
                      : user.status === 'BLOCKED'
                        ? 'Blocked'
                        : user.status
                  }
                  size="small"
                  sx={{
                    fontWeight: 900,
                    color: user.status === 'ACTIVE' ? '#047857' : '#b91c1c',
                    bgcolor:
                      user.status === 'ACTIVE'
                        ? 'rgba(16, 185, 129, 0.10)'
                        : 'rgba(239, 68, 68, 0.10)',
                    border:
                      user.status === 'ACTIVE'
                        ? '1px solid rgba(16, 185, 129, 0.20)'
                        : '1px solid rgba(239, 68, 68, 0.20)',
                  }}
                />
              </TableCell>

              <TableCell>
                {user.role === 'ROLE_ADMIN' ? (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      fontWeight: 700,
                    }}
                  >
                    No actions
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        user.status === 'BLOCKED'
                          ? handleUnblockUser(user.id)
                          : handleBlockUser(user.id)
                      }
                      title={user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '12px',
                        color: user.status === 'BLOCKED' ? '#047857' : '#dc2626',
                        bgcolor:
                          user.status === 'BLOCKED'
                            ? 'rgba(16, 185, 129, 0.10)'
                            : 'rgba(239, 68, 68, 0.10)',
                        border:
                          user.status === 'BLOCKED'
                            ? '1px solid rgba(16, 185, 129, 0.18)'
                            : '1px solid rgba(239, 68, 68, 0.18)',
                        '&:hover': {
                          bgcolor:
                            user.status === 'BLOCKED'
                              ? 'rgba(16, 185, 129, 0.18)'
                              : 'rgba(239, 68, 68, 0.18)',
                        },
                      }}
                    >
                      {user.status === 'BLOCKED' ? (
                        <LockOpen fontSize="small" />
                      ) : (
                        <Block fontSize="small" />
                      )}
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => openPasswordReset(user)}
                      title="Reset Password"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '12px',
                        color: '#7c3aed',
                        bgcolor: 'rgba(124, 58, 237, 0.10)',
                        border: '1px solid rgba(124, 58, 237, 0.18)',
                        '&:hover': {
                          bgcolor: 'rgba(124, 58, 237, 0.18)',
                        },
                      }}
                    >
                      <LockReset fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedItem(user);
                        setCreateQueryOpen(true);
                      }}
                      title="Create Ticket for this User"
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '12px',
                        color: '#2563eb',
                        bgcolor: 'rgba(37, 99, 235, 0.10)',
                        border: '1px solid rgba(37, 99, 235, 0.18)',
                        '&:hover': {
                          bgcolor: 'rgba(37, 99, 235, 0.18)',
                        },
                      }}
                    >
                      <Support fontSize="small" />
                    </IconButton>

                    {canDeleteUsers && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '12px',
                          color: '#be123c',
                          bgcolor: 'rgba(244, 63, 94, 0.10)',
                          border: '1px solid rgba(244, 63, 94, 0.18)',
                          '&:hover': {
                            bgcolor: 'rgba(244, 63, 94, 0.18)',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Box
      sx={{
        bgcolor: '#fff',
        borderTop: '1px solid rgba(148, 163, 184, 0.16)',
        '& .MuiTablePagination-toolbar': {
          px: 2,
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          color: '#64748b',
          fontWeight: 700,
        },
      }}
    >
      <TablePagination
        component="div"
        count={totalUsers}
        page={usersPage}
        onPageChange={(e, newPage) => setUsersPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setUsersPage(0);
        }}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        labelRowsPerPage="Rows per page:"
      />
    </Box>
  </Paper>
);
  // Queries Management Tab
  const renderQueriesTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box
        sx={{
          p: 3,
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Query Management ({totalQueries})
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateQueryOpen(true)}
            sx={{
              bgcolor: "#1565c0",
              "&:hover": { bgcolor: "#0d47a1" },
              borderRadius: 2,
            }}
          >
            New Query
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#e3f2fd" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                Query
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                Priority
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                Created
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#1a237e" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow
                key={query.id}
                hover
                sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {query.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {query.description?.substring(0, 100)}...
                    </Typography>
                    {query.locationContext && (
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 0.5, color: "#666" }}
                      >
                        📍 {query.locationContext}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={query.priorityDisplay || query.priority}
                    size="small"
                    sx={{
                      bgcolor: getPriorityColor(query.priority),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={query.statusDisplay || query.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(query.status),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(query.createdAt).toLocaleDateString("en-IN")}
                  </Typography>
                  <Typography variant="caption" display="block">
                    By: {query.createdByName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedItem(query)}
                      title="View"
                      sx={{
                        bgcolor: "#e3f2fd20",
                        "&:hover": { bgcolor: "#e3f2fd" },
                      }}
                    >
                      <Visibility fontSize="small" sx={{ color: "#1565c0" }} />
                    </IconButton>
                    {query.status === "PENDING" && canEscalateQueries && (
                      <IconButton
                        size="small"
                        onClick={() => handleEscalateQuery(query.id)}
                        title="Escalate"
                        sx={{
                          bgcolor: "#fff8e120",
                          "&:hover": { bgcolor: "#fff8e1" },
                        }}
                      >
                        <Escalator fontSize="small" sx={{ color: "#f57c00" }} />
                      </IconButton>
                    )}
                    {(query.status === "PENDING" ||
                      query.status === "IN_PROGRESS") && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedItem(query);
                          setResolveQueryOpen(true);
                        }}
                        title="Resolve"
                        sx={{
                          bgcolor: "#e8f5e920",
                          "&:hover": { bgcolor: "#e8f5e9" },
                        }}
                      >
                        <CheckCircle
                          fontSize="small"
                          sx={{ color: "#2e7d32" }}
                        />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalQueries}
        page={queriesPage}
        onPageChange={(e, newPage) => setQueriesPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setQueriesPage(0);
        }}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
  const premiumDialogPaperSx = {
    borderRadius: "28px",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 28px 80px rgba(15, 23, 42, 0.28)",
  };

  const premiumDialogTitleSx = {
    p: 0,
    background:
      "linear-gradient(135deg, #172554 0%, #2563eb 48%, #7c3aed 100%)",
    color: "#fff",
  };

  const premiumDialogContentSx = {
    p: 3,
    background:
      "linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(239,246,255,0.98) 100%)",
  };

  const premiumDialogActionsSx = {
    p: 2.5,
    background: "#ffffff",
    borderTop: "1px solid rgba(148, 163, 184, 0.18)",
  };

  const premiumFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      bgcolor: "#fff",
      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
      "& fieldset": {
        borderColor: "rgba(148, 163, 184, 0.35)",
      },
      "&:hover fieldset": {
        borderColor: "#2563eb",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563eb",
        borderWidth: "1px",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2563eb",
    },
  };

  const dialogCancelButtonSx = {
    borderRadius: "14px",
    px: 2.5,
    py: 1,
    textTransform: "none",
    fontWeight: 800,
    color: "#475569",
    borderColor: "rgba(148, 163, 184, 0.45)",
    "&:hover": {
      borderColor: "#94a3b8",
      bgcolor: "#f8fafc",
    },
  };

  const dialogPrimaryButtonSx = {
    borderRadius: "14px",
    px: 3,
    py: 1,
    textTransform: "none",
    fontWeight: 900,
    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    boxShadow: "0 14px 28px rgba(37, 99, 235, 0.28)",
    "&:hover": {
      background: "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
      boxShadow: "0 18px 34px rgba(37, 99, 235, 0.34)",
    },
  };

  const dialogDangerButtonSx = {
    borderRadius: "14px",
    px: 3,
    py: 1,
    textTransform: "none",
    fontWeight: 900,
    background: "linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)",
    boxShadow: "0 14px 28px rgba(147, 51, 234, 0.28)",
    "&:hover": {
      background: "linear-gradient(135deg, #7e22ce 0%, #581c87 100%)",
      boxShadow: "0 18px 34px rgba(147, 51, 234, 0.34)",
    },
  };
  const quickActionButtonSx = (gradient, shadowColor) => ({
    minHeight: 58,
    py: 1.6,
    px: 2,
    borderRadius: "18px",
    justifyContent: "flex-start",
    textTransform: "none",
    fontWeight: 800,
    fontSize: "0.92rem",
    color: "#fff",
    background: gradient,
    boxShadow: `0 14px 28px ${shadowColor}`,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.25s ease",
    "& .MuiButton-startIcon": {
      mr: 1.2,
      background: "rgba(255,255,255,0.18)",
      borderRadius: "12px",
      width: 34,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-80%",
      width: "60%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
      transform: "skewX(-18deg)",
      transition: "all 0.55s ease",
    },
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: `0 18px 36px ${shadowColor}`,
      filter: "brightness(1.04)",
    },
    "&:hover::after": {
      left: "120%",
    },
  });

  if (!managerUnlocked) {
    return (
      <Layout>
        <ManagerSecurityLock
          open={securityDialogOpen}
          onSuccess={() => {
            setManagerUnlocked(true);
            setSecurityDialogOpen(false);
          }}
          onCancel={() => {
            setSecurityDialogOpen(false);
            window.history.back();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          background: `
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16) 0%, transparent 34%),
    radial-gradient(circle at top right, rgba(124, 58, 237, 0.18) 0%, transparent 32%),
    linear-gradient(135deg, #f8fafc 0%, #eef4ff 45%, #f7f1ff 100%)
  `,
          py: 4,
          position: "relative",
          overflow: "hidden",
          fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif',
          "& *": {
            fontFamily:
              '"Noto Sans Devanagari", "Inter", sans-serif !important',
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(37, 99, 235, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.04) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
  {/* Header */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: "30px",
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.86)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
    position: "relative",
  }}
>
  <Box
    sx={{
      p: { xs: 2.8, md: 4 },
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(239,246,255,0.94) 48%, rgba(250,245,255,0.94) 100%)",
      position: "relative",
      overflow: "hidden",
      "&::after": {
        content: '""',
        position: "absolute",
        right: -80,
        top: -90,
        width: 240,
        height: 240,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)",
      },
    }}
  >
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: { xs: 58, md: 68 },
            height: { xs: 58, md: 68 },
            borderRadius: "22px",
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 18px 38px rgba(37, 99, 235, 0.30)",
          }}
        >
          <Dashboard sx={{ fontSize: { xs: 30, md: 36 } }} />
        </Box>

        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 950,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #172554 0%, #2563eb 45%, #7c3aed 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.4,
              fontSize: { xs: "1.7rem", md: "2.25rem" },
            }}
          >
            Manager Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#475569",
              fontWeight: 700,
            }}
          >
            Welcome, {user?.name}! — {getRoleLabel(user?.role)}
          </Typography>

          {(managerScope || dashboardData?.scope) && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.2 }}>
              <Chip
                size="small"
                label={`${managerScope?.totalSambhags ?? dashboardData?.scope?.totalSambhags ?? 0} Divisions`}
                sx={{
                  fontWeight: 800,
                  color: "#1e3a8a",
                  bgcolor: "rgba(37, 99, 235, 0.09)",
                  border: "1px solid rgba(37, 99, 235, 0.16)",
                }}
              />
              <Chip
                size="small"
                label={`${managerScope?.totalDistricts ?? dashboardData?.scope?.totalDistricts ?? 0} Districts`}
                sx={{
                  fontWeight: 800,
                  color: "#5b21b6",
                  bgcolor: "rgba(124, 58, 237, 0.09)",
                  border: "1px solid rgba(124, 58, 237, 0.16)",
                }}
              />
              <Chip
                size="small"
                label={`${managerScope?.totalBlocks ?? dashboardData?.scope?.totalBlocks ?? 0} Blocks`}
                sx={{
                  fontWeight: 800,
                  color: "#047857",
                  bgcolor: "rgba(16, 185, 129, 0.09)",
                  border: "1px solid rgba(16, 185, 129, 0.16)",
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Chip
        label={getRoleLabel(user?.role)}
        sx={{
          fontWeight: 900,
          fontSize: "0.92rem",
          py: 2.4,
          px: 1.2,
          color: "#fff",
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          boxShadow: "0 14px 30px rgba(37, 99, 235, 0.28)",
          border: "1px solid rgba(255,255,255,0.35)",
        }}
      />
    </Box>
  </Box>
</Paper>

          {/* Dashboard Stats */}
          {renderDashboardStats()}

          {/* Alerts Section */}
          {dashboardData?.alerts &&
            Object.keys(dashboardData.alerts).length > 0 && (
              <Box sx={{ mb: 4 }}>
                {Object.entries(dashboardData.alerts).map(([key, alert]) => (
                  <Alert
                    key={key}
                    severity={alert.severity}
                    sx={{ mb: 1, borderRadius: 2 }}
                    action={
                      <Button color="inherit" size="small">
                        View
                      </Button>
                    }
                  >
                    {alert.message}
                  </Alert>
                ))}
              </Box>
            )}

          {/* Quick Actions Panel */}
          {/* Quick Actions Panel */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "28px",
              mb: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
            }}
          >
            <Box
              sx={{
                p: { xs: 2.5, md: 3 },
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(239,246,255,0.92) 50%, rgba(250,245,255,0.92) 100%)",
              }}
            >
              <Box
                sx={{
                  mb: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: "#172554",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Quick Actions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", mt: 0.3 }}
                  >
                    Export reports and manage dashboard permissions quickly.
                  </Typography>
                </Box>

                <Chip
                  label="Manager Tools"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    color: "#4338ca",
                    bgcolor: "rgba(99, 102, 241, 0.10)",
                    border: "1px solid rgba(99, 102, 241, 0.18)",
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                {isSambhagManager && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Settings />}
                      onClick={handleOpenSettings}
                      sx={quickActionButtonSx(
                        "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                        "rgba(234, 88, 12, 0.28)",
                      )}
                    >
                      Settings
                    </Button>
                  </Grid>
                )}

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("users")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      "rgba(37, 99, 235, 0.28)",
                    )}
                  >
                    Export Members
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("sahyog")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      "rgba(5, 150, 105, 0.28)",
                    )}
                  >
                    Export Sahyog
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("asahyog")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                      "rgba(124, 58, 237, 0.28)",
                    )}
                  >
                    Export Asahyog
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("pending-profiles")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
                      "rgba(249, 115, 22, 0.28)",
                    )}
                  >
                    Pending Profiles
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("zero-utr")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #db2777 0%, #9d174d 100%)",
                      "rgba(219, 39, 119, 0.28)",
                    )}
                  >
                    Zero UTR
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("no-login-3-months")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                      "rgba(239, 68, 68, 0.28)",
                    )}
                  >
                    3 महीने से Login नहीं
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openExportDialog("no-sahyog-2-months")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      "rgba(220, 38, 38, 0.28)",
                    )}
                  >
                    2 महीने से Sahyog नहीं
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openDateExportDialog("joining")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #4f46e5 0%, #312e81 100%)",
                      "rgba(79, 70, 229, 0.28)",
                    )}
                  >
                    नियुक्ति तिथि Export
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => openDateExportDialog("retirement")}
                    sx={quickActionButtonSx(
                      "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
                      "rgba(15, 118, 110, 0.28)",
                    )}
                  >
                    सेवानिवृत्ति तिथि Export
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Main Tabs */}
         {/* Main Tabs */}
<Paper
  elevation={0}
  sx={{
    borderRadius: '28px',
    overflow: 'hidden',
    background: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)',
  }}
>
  <Box
    sx={{
      p: 1.5,
      background:
        'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(239,246,255,0.94) 55%, rgba(250,245,255,0.94) 100%)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
    }}
  >
    <Tabs
      value={activeTab}
      onChange={(e, newValue) => setActiveTab(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      TabIndicatorProps={{ sx: { display: 'none' } }}
      sx={{
        minHeight: 58,
        '& .MuiTabs-flexContainer': {
          gap: 1,
        },
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 900,
          fontSize: '0.95rem',
          minHeight: 52,
          borderRadius: '16px',
          px: 2,
          color: '#64748b',
          transition: 'all 0.25s ease',
          border: '1px solid transparent',
          '& .MuiSvgIcon-root': {
            fontSize: 21,
          },
          '&:hover': {
            bgcolor: 'rgba(37, 99, 235, 0.07)',
            color: '#2563eb',
          },
        },
        '& .Mui-selected': {
          color: '#fff !important',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          boxShadow: '0 12px 28px rgba(37, 99, 235, 0.28)',
          border: '1px solid rgba(255,255,255,0.35)',
        },
      }}
    >
      <Tab icon={<Dashboard />} label="Overview" iconPosition="start" />
      <Tab icon={<People />} label="User Management" iconPosition="start" />
      <Tab icon={<Chat />} label="Ticket System" iconPosition="start" />
      <Tab icon={<AssignmentInd />} label="Assignments" iconPosition="start" />
    </Tabs>
  </Box>

  <Box
    sx={{
      p: { xs: 2.2, md: 3 },
      background: '#fff',
    }}
  >
    {activeTab === 0 && (
  <Box>
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            color: "#172554",
            letterSpacing: "-0.02em",
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.3 }}>
          Area access, ticket workload, and user status summary.
        </Typography>
      </Box>

      <Chip
        label={getRoleLabel(user?.role)}
        size="small"
        sx={{
          fontWeight: 900,
          color: "#4338ca",
          bgcolor: "rgba(99, 102, 241, 0.10)",
          border: "1px solid rgba(99, 102, 241, 0.18)",
        }}
      />
    </Box>

    {dashboardData && (
      <Grid container spacing={2.5} alignItems="stretch">
   {/* My Area */}
<Grid item xs={12} lg={6}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(239,246,255,0.96) 0%, rgba(245,243,255,0.96) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.20)",
              boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#172554" }}
                  >
                    My Area
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b", mt: 0.2 }}>
                    Assigned locations and user counts
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 26px rgba(37, 99, 235, 0.26)",
                    flexShrink: 0,
                  }}
                >
                  <LocationOn />
                </Box>
              </Box>

              <List
                dense
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
  xs: "1fr",
  sm: "1fr 1fr",
  lg: "1fr 1fr",
},
                  gap: 1.2,
                  p: 0,
                  maxHeight: { xs: "none", lg: 360 },
overflowY: { xs: "visible", lg: "auto" },
                  pr: { xs: 0, lg: 0.5 },
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": {
                    bgcolor: "rgba(148, 163, 184, 0.55)",
                    borderRadius: 8,
                  },
                }}
              >
                {(managerScope?.managedLocations ||
                  dashboardData.scope?.managedLocations ||
                  []
                ).length > 0 ? (
                  (
                    managerScope?.managedLocations ||
                    dashboardData.scope?.managedLocations ||
                    []
                  ).map((location, index) => (
                    <ListItem
                     key={getLocationCountKey(location) || index}
                      sx={{
                        p: 1.4,
                        borderRadius: "18px",
                        bgcolor: "rgba(255,255,255,0.88)",
                        border: "1px solid rgba(148, 163, 184, 0.16)",
                        boxShadow: "0 10px 22px rgba(15, 23, 42, 0.04)",
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 42 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "12px",
                            bgcolor: "rgba(37, 99, 235, 0.10)",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <LocationOn fontSize="small" />
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          typeof location.fullPath === "string"
                            ? location.fullPath
                            : location.locationName || "Location name not available"
                        }
secondary={`${
  managedLocationCounts[getLocationCountKey(location)] ??
  location.userCount ??
  0
} Users`}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: 900,
                            color: "#0f172a",
                            fontSize: "0.9rem",
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            color: "#64748b",
                            fontWeight: 800,
                            mt: 0.2,
                          },
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      bgcolor: "#fff",
                      border: "1px dashed rgba(148, 163, 184, 0.35)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      No assigned area found.
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Dashboard Cards */}
      
<Grid item xs={12}>
          <Grid container spacing={2.5} alignItems="stretch">
            {/* Ticket Summary */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(255,247,237,0.96) 0%, rgba(255,251,235,0.96) 100%)",
                  border: "1px solid rgba(245, 158, 11, 0.22)",
                  boxShadow: "0 18px 44px rgba(15, 23, 42, 0.07)",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: "#172554" }}>
                        Ticket Summary
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mt: 0.2 }}>
                        Current ticket workload
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "15px",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Chat />
                    </Box>
                  </Box>

                  {[
  {
    label: "Pending",
    value: dashboardData.queryStats?.pendingCount || 0,
    color: "#d97706",
    bg: "rgba(245, 158, 11, 0.12)",
  },
  {
    label: "Need Clarification",
    value: dashboardData.queryStats?.needClarificationCount || 0,
    color: "#0369a1",
    bg: "rgba(14, 165, 233, 0.12)",
  },
  {
    label: "Overdue",
    value: dashboardData.queryStats?.overdueCount || 0,
    color: "#b91c1c",
    bg: "rgba(239, 68, 68, 0.12)",
  },
  {
    label: "Resolved",
    value: dashboardData.queryStats?.resolvedCount || 0,
    color: "#15803d",
    bg: "rgba(22, 163, 74, 0.12)",
  },
  {
    label: "Cancelled",
    value: dashboardData.queryStats?.cancelCount || 0,
    color: "#475569",
    bg: "rgba(100, 116, 139, 0.12)",
  },
].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#475569", fontWeight: 800 }}
                      >
                        {item.label}
                      </Typography>
                      <Chip
                        label={item.value}
                        size="small"
                        sx={{
                          minWidth: 44,
                          fontWeight: 900,
                          color: item.color,
                          bgcolor: item.bg,
                          border: `1px solid ${item.color}22`,
                        }}
                      />
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Chat />}
                    onClick={() => setActiveTab(2)}
                    sx={{
                      mt: 2,
                      borderRadius: "14px",
                      py: 1,
                      textTransform: "none",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      boxShadow: "0 12px 24px rgba(245, 158, 11, 0.24)",
                    }}
                  >
                    Open Ticket System
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* User Health */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(240,253,250,0.96) 0%, rgba(240,249,255,0.96) 100%)",
                  border: "1px solid rgba(20, 184, 166, 0.20)",
                  boxShadow: "0 18px 44px rgba(15, 23, 42, 0.07)",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: "#172554" }}>
                        User Health
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b", mt: 0.2 }}>
                        User status in your scope
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "15px",
                        background: "linear-gradient(135deg, #059669 0%, #0f766e 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <People />
                    </Box>
                  </Box>

                  {[
                    {
                      label: "Total Users",
                      value: dashboardData.userStats?.totalUsers || 0,
                      color: "#1d4ed8",
                      bg: "rgba(37, 99, 235, 0.10)",
                    },
                    {
                      label: "Active Users",
                      value:
                        dashboardData.userStats?.activeUsers ??
                        overviewManagedUsers ??
                        0,
                      color: "#047857",
                      bg: "rgba(16, 185, 129, 0.10)",
                    },
                    {
                      label: "Blocked Users",
                      value: dashboardData.userStats?.blockedUsers || 0,
                      color: "#b91c1c",
                      bg: "rgba(239, 68, 68, 0.10)",
                    },
                    {
                      label: "Deleted Users",
                      value: dashboardData.userStats?.deletedUsers || 0,
                      color: "#64748b",
                      bg: "rgba(100, 116, 139, 0.10)",
                    },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#475569", fontWeight: 800 }}
                      >
                        {item.label}
                      </Typography>
                      <Chip
                        label={item.value}
                        size="small"
                        sx={{
                          minWidth: 44,
                          fontWeight: 900,
                          color: item.color,
                          bgcolor: item.bg,
                          border: `1px solid ${item.color}22`,
                        }}
                      />
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<People />}
                    onClick={() => setActiveTab(1)}
                    sx={{
                      mt: 2,
                      borderRadius: "14px",
                      py: 1,
                      textTransform: "none",
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #059669 0%, #0f766e 100%)",
                      boxShadow: "0 12px 24px rgba(5, 150, 105, 0.24)",
                    }}
                  >
                    View Users
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            
          </Grid>
        </Grid>
      </Grid>
    )}
  </Box>
)}

    {activeTab === 1 && renderUsersTab()}

    {activeTab === 2 && (
      <TicketSystemTab mode="manager" currentUser={user} />
    )}

    {activeTab === 3 && (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: '#172554',
              letterSpacing: '-0.02em',
            }}
          >
            Assignment Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.3 }}>
            Manage assignment workflows from this section.
          </Typography>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '26px',
            background:
              'linear-gradient(135deg, rgba(239,246,255,0.95) 0%, rgba(245,243,255,0.95) 100%)',
            border: '1px solid rgba(148, 163, 184, 0.20)',
            boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 68,
              height: 68,
              mx: 'auto',
              mb: 2,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 16px 34px rgba(37, 99, 235, 0.26)',
            }}
          >
            <AssignmentInd sx={{ fontSize: 34 }} />
          </Box>

          <Typography sx={{ fontWeight: 900, color: '#172554', fontSize: '1.15rem', mb: 0.6 }}>
            Assignment feature coming soon
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 520, mx: 'auto' }}>
            This section is reserved for future assignment management and workflow controls.
          </Typography>
        </Box>
      </Box>
    )}
  </Box>
</Paper>

          {/* Query Dialogs */}
          <CreateQueryDialog
            open={createQueryOpen}
            onClose={() => {
              setCreateQueryOpen(false);
              setSelectedItem(null);
            }}
            relatedUser={selectedItem}
            onSuccess={() => {
              showSnackbar(
                "Ticket admin को successfully भेज दी गई है!",
                "success",
              );
              fetchQueries();
              setCreateQueryOpen(false);
              setSelectedItem(null);
            }}
          />

          <ResolveQueryDialog
            open={resolveQueryOpen}
            onClose={() => {
              setResolveQueryOpen(false);
              setSelectedItem(null);
            }}
            query={selectedItem}
            onSuccess={() => {
              showSnackbar("Query resolved successfully!", "success");
              fetchQueries();
              setSelectedItem(null);
            }}
          />

          {/* Date Export Dialog */}
          {/* Date Export Dialog */}
          <Dialog
            open={dateExportDialogOpen}
            onClose={() => setDateExportDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: premiumDialogPaperSx }}
          >
            <DialogTitle sx={premiumDialogTitleSx}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    <Schedule sx={{ fontSize: 26 }} />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, lineHeight: 1.2 }}
                    >
                      {dateExportType === "joining"
                        ? "नियुक्ति तिथि Export"
                        : "सेवानिवृत्ति तिथि Export"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.86, mt: 0.4 }}>
                      Select date range to download assigned-area records.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={premiumDialogContentSx}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "20px",
                    bgcolor: "#fff",
                    border: "1px solid rgba(148, 163, 184, 0.20)",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 900,
                      color: "#172554",
                      mb: 1.5,
                    }}
                  >
                    Date Range
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="From Date"
                        InputLabelProps={{ shrink: true }}
                        value={dateExportFromDate}
                        onChange={(e) => setDateExportFromDate(e.target.value)}
                        sx={premiumFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="To Date"
                        InputLabelProps={{ shrink: true }}
                        value={dateExportToDate}
                        onChange={(e) => setDateExportToDate(e.target.value)}
                        sx={premiumFieldSx}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Alert
                  severity="info"
                  sx={{
                    borderRadius: "18px",
                    bgcolor: "rgba(37, 99, 235, 0.08)",
                    border: "1px solid rgba(37, 99, 235, 0.16)",
                    color: "#1e3a8a",
                    "& .MuiAlert-icon": {
                      color: "#2563eb",
                    },
                  }}
                >
                  Date blank रखने पर आपके assigned area के सभी records export
                  होंगे.
                </Alert>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: "20px",
                    bgcolor: "#fff",
                    border: "1px solid rgba(148, 163, 184, 0.20)",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 900, color: "#172554", mb: 0.7 }}
                  >
                    Export Scope
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    This report will follow your manager role permissions and
                    assigned location access.
                  </Typography>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={premiumDialogActionsSx}>
              <Button
                variant="outlined"
                onClick={() => setDateExportDialogOpen(false)}
                disabled={exportLoading}
                sx={dialogCancelButtonSx}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleManagerDateRelatedExport}
                disabled={exportLoading}
                startIcon={
                  exportLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <Download />
                  )
                }
                sx={dialogPrimaryButtonSx}
              >
                {exportLoading ? "Exporting..." : "Export Now"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Settings Dialog */}
          {/* Settings Dialog */}
          <Dialog
            open={settingsDialogOpen}
            onClose={() => setSettingsDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: premiumDialogPaperSx }}
          >
            <DialogTitle sx={premiumDialogTitleSx}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    <Settings sx={{ fontSize: 26 }} />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, lineHeight: 1.2 }}
                    >
                      Mobile Export Settings
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.86, mt: 0.4 }}>
                      Control mobile number visibility in manager exports.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={premiumDialogContentSx}>
              {settingsLoading ? (
                <Box
                  sx={{
                    minHeight: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <CircularProgress />
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", fontWeight: 700 }}
                  >
                    Loading settings...
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <Alert
                    severity="info"
                    sx={{
                      borderRadius: "18px",
                      bgcolor: "rgba(37, 99, 235, 0.08)",
                      border: "1px solid rgba(37, 99, 235, 0.16)",
                      color: "#1e3a8a",
                      "& .MuiAlert-icon": {
                        color: "#2563eb",
                      },
                    }}
                  >
                    Control whether District Manager and Block Manager exports
                    can include mobile numbers.
                  </Alert>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "22px",
                      bgcolor: "#fff",
                      border: "1px solid rgba(148, 163, 184, 0.20)",
                      boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        p: 1.5,
                        borderRadius: "18px",
                        bgcolor: districtManagerExportMobileEnabled
                          ? "rgba(37, 99, 235, 0.08)"
                          : "#f8fafc",
                        border: districtManagerExportMobileEnabled
                          ? "1px solid rgba(37, 99, 235, 0.18)"
                          : "1px solid rgba(148, 163, 184, 0.18)",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 900, color: "#172554" }}>
                          District Manager
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", mt: 0.3 }}
                        >
                          Allow District Manager to export mobile numbers.
                        </Typography>
                      </Box>

                      <Switch
                        checked={districtManagerExportMobileEnabled}
                        onChange={(e) =>
                          setDistrictManagerExportMobileEnabled(
                            e.target.checked,
                          )
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#2563eb",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              bgcolor: "#2563eb",
                            },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        p: 1.5,
                        mt: 1.5,
                        borderRadius: "18px",
                        bgcolor: blockManagerExportMobileEnabled
                          ? "rgba(124, 58, 237, 0.08)"
                          : "#f8fafc",
                        border: blockManagerExportMobileEnabled
                          ? "1px solid rgba(124, 58, 237, 0.18)"
                          : "1px solid rgba(148, 163, 184, 0.18)",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 900, color: "#172554" }}>
                          Block Manager
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", mt: 0.3 }}
                        >
                          Allow Block Manager to export mobile numbers.
                        </Typography>
                      </Box>

                      <Switch
                        checked={blockManagerExportMobileEnabled}
                        onChange={(e) =>
                          setBlockManagerExportMobileEnabled(e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#7c3aed",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              bgcolor: "#7c3aed",
                            },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "20px",
                      bgcolor: "rgba(245, 158, 11, 0.08)",
                      border: "1px solid rgba(245, 158, 11, 0.18)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#92400e", fontWeight: 700 }}
                    >
                      Note: These settings only control mobile number visibility
                      in exported reports.
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={premiumDialogActionsSx}>
              <Button
                variant="outlined"
                onClick={() => setSettingsDialogOpen(false)}
                disabled={settingsSaving}
                sx={dialogCancelButtonSx}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={settingsSaving || settingsLoading}
                startIcon={
                  settingsSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Settings />
                  )
                }
                sx={{
                  borderRadius: "14px",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 900,
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                  boxShadow: "0 14px 28px rgba(234, 88, 12, 0.28)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                    boxShadow: "0 18px 34px rgba(234, 88, 12, 0.34)",
                  },
                }}
              >
                {settingsSaving ? "Saving..." : "Save Settings"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Export Dialog */}

          <Dialog
            open={exportDialogOpen}
            onClose={() => setExportDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: premiumDialogPaperSx }}
          >
            <DialogTitle sx={premiumDialogTitleSx}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    <Download sx={{ fontSize: 26 }} />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, lineHeight: 1.2 }}
                    >
                      Export Data
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.86, mt: 0.4 }}>
                      Download filtered reports based on your assigned access.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={premiumDialogContentSx}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {(exportType === "sahyog" || exportType === "asahyog") && (
                  <>
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: "16px",
                        bgcolor: "rgba(37, 99, 235, 0.08)",
                        border: "1px solid rgba(37, 99, 235, 0.16)",
                        color: "#1e3a8a",
                        "& .MuiAlert-icon": {
                          color: "#2563eb",
                        },
                      }}
                    >
                      Export will be restricted to your assigned area only.
                    </Alert>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "20px",
                        bgcolor: "#fff",
                        border: "1px solid rgba(148, 163, 184, 0.20)",
                        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 900,
                          color: "#172554",
                          mb: 1.5,
                        }}
                      >
                        Area Filters
                      </Typography>

                      <Grid container spacing={2}>
                        {!isBlockManager && (
                          <Grid item xs={12} sm={4}>
                            <FormControl
                              fullWidth
                              size="small"
                              sx={premiumFieldSx}
                            >
                              <InputLabel>Sambhag</InputLabel>
                              <Select
                                value={exportLocationFilters.sambhagId}
                                label="Sambhag"
                                onChange={handleExportSambhagChange}
                              >
                                <MenuItem value="">
                                  All Assigned Sambhag
                                </MenuItem>
                                {sambhagOptions.map((item) => (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}

                        {!isBlockManager && (
                          <Grid item xs={12} sm={4}>
                            <FormControl
                              fullWidth
                              size="small"
                              disabled={!exportLocationFilters.sambhagId}
                              sx={premiumFieldSx}
                            >
                              <InputLabel>District</InputLabel>
                              <Select
                                value={exportLocationFilters.districtId}
                                label="District"
                                onChange={handleExportDistrictChange}
                              >
                                <MenuItem value="">
                                  All Assigned District
                                </MenuItem>
                                {exportDistrictOptions.map((item) => (
                                  <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}

                        <Grid item xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            size="small"
                            disabled={
                              !exportLocationFilters.districtId ||
                              isBlockManager
                            }
                            sx={premiumFieldSx}
                          >
                            <InputLabel>Block</InputLabel>
                            <Select
                              value={exportLocationFilters.blockId}
                              label="Block"
                              onChange={handleExportBlockChange}
                            >
                              <MenuItem value="">All Assigned Block</MenuItem>
                              {exportBlockOptions.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>

                      {isBlockManager && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1.5,
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          Block Manager export is fixed to your assigned block
                          only.
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "20px",
                        bgcolor: "#fff",
                        border: "1px solid rgba(148, 163, 184, 0.20)",
                        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 900,
                          color: "#172554",
                          mb: 1.5,
                        }}
                      >
                        Select Export Type
                      </Typography>

                      <Grid container spacing={1.5}>
                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant={
                              exportMode === "beneficiary"
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => setExportMode("beneficiary")}
                            sx={{
                              borderRadius: "14px",
                              py: 1.1,
                              textTransform: "none",
                              fontWeight: 800,
                              ...(exportMode === "beneficiary"
                                ? {
                                    background:
                                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                    boxShadow:
                                      "0 10px 20px rgba(37, 99, 235, 0.24)",
                                  }
                                : {
                                    color: "#2563eb",
                                    borderColor: "rgba(37, 99, 235, 0.35)",
                                    bgcolor: "#fff",
                                  }),
                            }}
                          >
                            Death Case Wise
                          </Button>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant={
                              exportMode === "month" ? "contained" : "outlined"
                            }
                            onClick={() => setExportMode("month")}
                            sx={{
                              borderRadius: "14px",
                              py: 1.1,
                              textTransform: "none",
                              fontWeight: 800,
                              ...(exportMode === "month"
                                ? {
                                    background:
                                      "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                                    boxShadow:
                                      "0 10px 20px rgba(124, 58, 237, 0.24)",
                                  }
                                : {
                                    color: "#7c3aed",
                                    borderColor: "rgba(124, 58, 237, 0.35)",
                                    bgcolor: "#fff",
                                  }),
                            }}
                          >
                            Month Wise
                          </Button>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Button
                            fullWidth
                            variant={
                              exportMode === "all" ? "contained" : "outlined"
                            }
                            onClick={() => setExportMode("all")}
                            sx={{
                              borderRadius: "14px",
                              py: 1.1,
                              textTransform: "none",
                              fontWeight: 800,
                              ...(exportMode === "all"
                                ? {
                                    background:
                                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                    boxShadow:
                                      "0 10px 20px rgba(5, 150, 105, 0.24)",
                                  }
                                : {
                                    color: "#059669",
                                    borderColor: "rgba(5, 150, 105, 0.35)",
                                    bgcolor: "#fff",
                                  }),
                            }}
                          >
                            All
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}

                {(exportType === "sahyog" || exportType === "asahyog") &&
                  exportMode === "beneficiary" && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "20px",
                        bgcolor: "#fff",
                        border: "1px solid rgba(148, 163, 184, 0.20)",
                        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                      }}
                    >
                      <FormControl fullWidth required sx={premiumFieldSx}>
                        <InputLabel>Select Death Case</InputLabel>
                        <Select
                          value={exportBeneficiary}
                          label="Select Death Case"
                          onChange={(e) => setExportBeneficiary(e.target.value)}
                        >
                          <MenuItem value="">All Death Cases</MenuItem>
                          {deathCases.map((dc) => (
                            <MenuItem key={dc.id} value={dc.id}>
                              {dc.deceasedName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                {(exportType === "sahyog" || exportType === "asahyog") &&
                  exportMode === "month" && (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "20px",
                        bgcolor: "#fff",
                        border: "1px solid rgba(148, 163, 184, 0.20)",
                        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required sx={premiumFieldSx}>
                            <InputLabel>Month</InputLabel>
                            <Select
                              value={exportMonth}
                              label="Month"
                              onChange={(e) => setExportMonth(e.target.value)}
                            >
                              {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                              ].map((m, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                  {m}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Year"
                            type="number"
                            value={exportYear}
                            onChange={(e) =>
                              setExportYear(parseInt(e.target.value, 10))
                            }
                            sx={premiumFieldSx}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                {(exportType === "users" ||
                  exportType === "pending-profiles" ||
                  exportType === "zero-utr" ||
                  exportType === "no-login-3-months" ||
                  exportType === "no-sahyog-2-months") && (
                  <Box
                    sx={{
                      p: 2.2,
                      borderRadius: "20px",
                      bgcolor: "#fff",
                      border: "1px solid rgba(148, 163, 184, 0.20)",
                      boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 900, color: "#172554", mb: 0.6 }}
                    >
                      Ready to Export
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      This export will download the full list based on your
                      current role access.
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={premiumDialogActionsSx}>
              <Button
                variant="outlined"
                onClick={() => setExportDialogOpen(false)}
                disabled={exportLoading}
                sx={dialogCancelButtonSx}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleManagerExport}
                disabled={exportLoading}
                startIcon={
                  exportLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <Download />
                  )
                }
                sx={dialogPrimaryButtonSx}
              >
                {exportLoading ? "Exporting..." : "Export Now"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Password Reset Dialog */}
          <Dialog
            open={passwordResetOpen}
            onClose={closePasswordReset}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: premiumDialogPaperSx }}
          >
            <DialogTitle sx={premiumDialogTitleSx}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.16)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  >
                    <LockReset sx={{ fontSize: 26 }} />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, lineHeight: 1.2 }}
                    >
                      Reset Password
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.86, mt: 0.4 }}>
                      Reset user password securely using Date of Birth format.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent dividers sx={premiumDialogContentSx}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "20px",
                    bgcolor: "#fff",
                    border: "1px solid rgba(148, 163, 184, 0.20)",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 900, color: "#172554", mb: 0.8 }}
                  >
                    Selected User
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: "16px",
                      bgcolor: "#f8fafc",
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: "#7c3aed",
                        fontWeight: 900,
                      }}
                    >
                      {passwordResetUser?.name?.charAt(0) || "U"}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                        {passwordResetUser?.name || "Selected User"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block" }}
                      >
                        {passwordResetUser?.email || "No email available"}
                      </Typography>
                      {passwordResetUser?.id && (
                        <Typography
                          variant="caption"
                          sx={{ color: "#94a3b8", display: "block" }}
                        >
                          User ID: {passwordResetUser.id}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: "18px",
                    bgcolor: "rgba(245, 158, 11, 0.10)",
                    border: "1px solid rgba(245, 158, 11, 0.22)",
                    color: "#92400e",
                    "& .MuiAlert-icon": {
                      color: "#f59e0b",
                    },
                  }}
                >
                  This will reset the user's password to their Date of Birth.
                </Alert>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: "20px",
                    bgcolor: "#fff",
                    border: "1px solid rgba(148, 163, 184, 0.20)",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 900, color: "#172554", mb: 1 }}
                  >
                    Password Format
                  </Typography>

                  <Box
                    sx={{
                      p: 1.6,
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
                      border: "1px dashed rgba(37, 99, 235, 0.30)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#475569", mb: 0.7 }}
                    >
                      New password format will be:
                    </Typography>

                    <Typography
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        px: 1.4,
                        py: 0.6,
                        borderRadius: "12px",
                        bgcolor: "#172554",
                        color: "#fff",
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                      }}
                    >
                      DDMMYYYY
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", mt: 1.2 }}
                    >
                      Example: if DOB is <strong>17 April 2002</strong>,
                      password will be <strong>17042002</strong>.
                    </Typography>
                  </Box>

                  {passwordResetUser?.dateOfBirth && (
                    <Box
                      sx={{
                        mt: 1.5,
                        p: 1.4,
                        borderRadius: "14px",
                        bgcolor: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.18)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 800, color: "#047857" }}
                      >
                        User DOB: {passwordResetUser.dateOfBirth}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={premiumDialogActionsSx}>
              <Button
                variant="outlined"
                onClick={closePasswordReset}
                disabled={passwordResetLoading}
                sx={dialogCancelButtonSx}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={submitPasswordReset}
                disabled={passwordResetLoading}
                startIcon={
                  passwordResetLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <LockReset />
                  )
                }
                sx={dialogDangerButtonSx}
              >
                {passwordResetLoading ? "Resetting..." : "Confirm Reset"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbar.severity}
              sx={{ borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Layout>
  );
};

export default ManagerDashboard;
