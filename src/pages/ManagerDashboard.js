import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
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
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { managerAPI, adminAPI, api } from '../services/api';
import Layout from '../components/Layout/Layout';
import { CreateQueryDialog, ResolveQueryDialog } from '../components/QueryDialogs';
import TicketSystemTab from '../components/TicketSystemTab';

const ManagerDashboard = () => {
  const { user } = useAuth();
  
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [createQueryOpen, setCreateQueryOpen] = useState(false);
  const [resolveQueryOpen, setResolveQueryOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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
const [exportType, setExportType] = useState('');
const [exportMode, setExportMode] = useState('all');
const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
const [exportYear, setExportYear] = useState(new Date().getFullYear());
const [exportBeneficiary, setExportBeneficiary] = useState('');
const [deathCases, setDeathCases] = useState([]);
const [managerScope, setManagerScope] = useState(null);
const [locationHierarchy, setLocationHierarchy] = useState([]);
const [sambhagOptions, setSambhagOptions] = useState([]);
const [userDistrictOptions, setUserDistrictOptions] = useState([]);
const [userBlockOptions, setUserBlockOptions] = useState([]);

const [exportDistrictOptions, setExportDistrictOptions] = useState([]);
const [exportBlockOptions, setExportBlockOptions] = useState([]);
const [exportLocationFilters, setExportLocationFilters] = useState({
  sambhagId: '',
  districtId: '',
  blockId: '',
});
const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
const [settingsLoading, setSettingsLoading] = useState(false);
const [settingsSaving, setSettingsSaving] = useState(false);
const [districtManagerExportMobileEnabled, setDistrictManagerExportMobileEnabled] = useState(false);
const [blockManagerExportMobileEnabled, setBlockManagerExportMobileEnabled] = useState(false);
  // Filter states
  const [userFilters, setUserFilters] = useState({
  search: '',
  role: 'ROLE_USER',
  status: 'ACTIVE',
  sambhagId: '',
  districtId: '',
  blockId: '',
});
  const [queryFilters, setQueryFilters] = useState({
    status: '',
    priority: '',
    type: 'assigned'
  });

  // Manager role levels and permissions
const isSuperAdmin = user?.role === 'ROLE_SUPERADMIN';
const isAdmin = user?.role === 'ROLE_ADMIN';
const isSambhagManager = user?.role === 'ROLE_SAMBHAG_MANAGER';
const isDistrictManager = user?.role === 'ROLE_DISTRICT_MANAGER';
const isBlockManager = user?.role === 'ROLE_BLOCK_MANAGER';
const canDeleteUsers = isSambhagManager;
const canManageUsers = isSuperAdmin || isAdmin || isSambhagManager || isDistrictManager;
const canAssignQueries = isSuperAdmin || isAdmin || isSambhagManager || isDistrictManager;
const canEscalateQueries = isSuperAdmin || isSambhagManager || isDistrictManager || isBlockManager;
const canChangeRoles = isSuperAdmin || isAdmin;
const getAny = (obj, keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }
  return undefined;
};

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
      state?.sambhags ||
      state?.sambhagList ||
      state?.divisions ||
      [];

    sambhagList.forEach((sambhag) => {
      const districtsRaw =
        sambhag?.districts ||
        sambhag?.districtList ||
        sambhag?.districtResponses ||
        [];

      sambhags.push({
        id: String(sambhag.id || sambhag.sambhagId || sambhag.locationId || ''),
        name: sambhag.name || sambhag.sambhagName || sambhag.locationName || 'Unnamed Sambhag',
        stateId: String(state.id || ''),
        stateName: state.name || '',
        original: sambhag,

        districts: districtsRaw
          .map((district) => {
            const blocksRaw =
              district?.blocks ||
              district?.blockList ||
              district?.blockResponses ||
              [];

            return {
              id: String(district.id || district.districtId || district.locationId || ''),
              name: district.name || district.districtName || district.locationName || 'Unnamed District',
              sambhagId: String(sambhag.id || ''),
              original: district,

              blocks: blocksRaw
                .map((block) => ({
                  id: String(block.id || block.blockId || block.locationId || ''),
                  name: block.name || block.blockName || block.locationName || 'Unnamed Block',
                  districtId: String(district.id || ''),
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
    .filter((x) => x.locationType === 'SAMBHAG')
    .map((x) => String(x.locationId));

  const assignedDistrictIds = managedLocations
    .filter((x) => x.locationType === 'DISTRICT')
    .map((x) => String(x.locationId));

  const assignedBlockIds = managedLocations
    .filter((x) => x.locationType === 'BLOCK')
    .map((x) => String(x.locationId));

  return fullHierarchy
    .map((sambhag) => {
      const sambhagExplicitlyAssigned = assignedSambhagIds.includes(String(sambhag.id));

      const districts = (sambhag.districts || [])
        .map((district) => {
          const districtExplicitlyAssigned = assignedDistrictIds.includes(String(district.id));

          const blocks = (district.blocks || []).filter((block) =>
            assignedBlockIds.includes(String(block.id))
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
const getAssignedLocationIds = () => {
  const locations = managerScope?.managedLocations || [];

  return {
    sambhagIds: locations
      .filter((x) => x.locationType === 'SAMBHAG')
      .map((x) => String(x.locationId)),

    districtIds: locations
      .filter((x) => x.locationType === 'DISTRICT')
      .map((x) => String(x.locationId)),

    blockIds: locations
      .filter((x) => x.locationType === 'BLOCK')
      .map((x) => String(x.locationId)),
  };
};

const filterHierarchyByManagerScope = (hierarchy, scope) => {
  if (!Array.isArray(hierarchy)) return [];

  if (isAdmin || isSuperAdmin) {
    return hierarchy;
  }

  const locations = scope?.managedLocations || [];

  const allowedSambhagIds = locations
    .filter((x) => x.locationType === 'SAMBHAG')
    .map((x) => String(x.locationId));

  const allowedDistrictIds = locations
    .filter((x) => x.locationType === 'DISTRICT')
    .map((x) => String(x.locationId));

  const allowedBlockIds = locations
    .filter((x) => x.locationType === 'BLOCK')
    .map((x) => String(x.locationId));

  return hierarchy
    .map((sambhag) => {
      const sambhagAllowed = allowedSambhagIds.includes(String(sambhag.id));

      const districts = (sambhag.districts || [])
        .map((district) => {
          const districtAllowed =
            sambhagAllowed || allowedDistrictIds.includes(String(district.id));

          const blocks = (district.blocks || []).filter((block) => {
            return districtAllowed || allowedBlockIds.includes(String(block.id));
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

const loadManagerScopeAndLocations = async () => {
  try {
    const [scopeResponse, hierarchyResponse] = await Promise.all([
      managerAPI.getManagerScope(),
      api.get('/locations/hierarchy'),
    ]);

    const scope = scopeResponse.data;
    const hierarchy = normalizeHierarchy(hierarchyResponse.data);

    console.log('Manager Scope:', scope);
    console.log('Normalized Hierarchy:', hierarchy);

const filteredHierarchy = buildAssignedHierarchyFromScope(hierarchy, scope);
    console.log('Filtered Hierarchy:', filteredHierarchy);

    setManagerScope(scope);
    setLocationHierarchy(filteredHierarchy);
    setSambhagOptions(filteredHierarchy);

    const firstSambhag = filteredHierarchy[0] || null;
    const firstDistrict = firstSambhag?.districts?.[0] || null;
    const firstBlock = firstDistrict?.blocks?.[0] || null;

    setUserDistrictOptions(firstSambhag?.districts || []);
    setUserBlockOptions(firstDistrict?.blocks || []);

    setExportDistrictOptions(firstSambhag?.districts || []);
    setExportBlockOptions(firstDistrict?.blocks || []);

    if (user?.role === 'ROLE_DISTRICT_MANAGER') {
      const districtFilters = {
        sambhagId: firstSambhag?.id || '',
        districtId: firstDistrict?.id || '',
        blockId: '',
      };

      setUserFilters((prev) => ({
        ...prev,
        ...districtFilters,
      }));

      setExportLocationFilters(districtFilters);
    }

    if (user?.role === 'ROLE_BLOCK_MANAGER') {
      const blockFilters = {
        sambhagId: firstSambhag?.id || '',
        districtId: firstDistrict?.id || '',
        blockId: firstBlock?.id || '',
      };

      setUserFilters((prev) => ({
        ...prev,
        ...blockFilters,
      }));

      setExportLocationFilters(blockFilters);
    }
  } catch (error) {
    console.error('Error loading manager scope/location hierarchy:', error);
    showSnackbar('Error loading area filters!', 'error');
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
      status: 'ACTIVE',
    });

    setOverviewManagedUsers(response.data?.totalElements || 0);
  } catch (error) {
    console.error('Error fetching managed users count:', error);
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
      console.error('Error fetching dashboard overview:', error);
      showSnackbar('Error loading dashboard!', 'error');
    } finally {
      setLoading(false);
    }
  };
const fetchDeathCases = async () => {
  try {
    const response = await adminAPI.getDeathCases();
    setDeathCases(response.data || []);
  } catch (error) {
    console.error('Error fetching death cases:', error);
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
      name: userFilters.search || '',
      sambhagId: userFilters.sambhagId,
      districtId: userFilters.districtId,
      blockId: userFilters.blockId,
    };

    const response = await managerAPI.getAccessibleUsers(params);
    setUsers(response.data.content || []);
    setTotalUsers(response.data.totalElements || 0);
  } catch (error) {
    console.error('Error fetching users:', error);
    showSnackbar('Error loading users!', 'error');
  }
};
const handleUserSambhagChange = (event) => {
  const sambhagId = event.target.value;

  const selectedSambhag = locationHierarchy.find(
    (item) => String(item.id) === String(sambhagId)
  );

  setUserFilters((prev) => ({
    ...prev,
    sambhagId,
    districtId: '',
    blockId: '',
  }));

  setUserDistrictOptions(selectedSambhag?.districts || []);
  setUserBlockOptions([]);
  setUsersPage(0);
};

const handleUserDistrictChange = (event) => {
  const districtId = event.target.value;

  const selectedSambhag = locationHierarchy.find(
    (item) => String(item.id) === String(userFilters.sambhagId)
  );

  const selectedDistrict = selectedSambhag?.districts?.find(
    (item) => String(item.id) === String(districtId)
  );

  setUserFilters((prev) => ({
    ...prev,
    districtId,
    blockId: '',
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
    (item) => String(item.id) === String(sambhagId)
  );

  setExportLocationFilters({
    sambhagId,
    districtId: '',
    blockId: '',
  });

  setExportDistrictOptions(selectedSambhag?.districts || []);
  setExportBlockOptions([]);
};

const handleExportDistrictChange = (event) => {
  const districtId = event.target.value;

  const selectedSambhag = locationHierarchy.find(
    (item) => String(item.id) === String(exportLocationFilters.sambhagId)
  );

  const selectedDistrict = selectedSambhag?.districts?.find(
    (item) => String(item.id) === String(districtId)
  );

  setExportLocationFilters((prev) => ({
    ...prev,
    districtId,
    blockId: '',
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
    console.error('Error fetching my delete requests:', error);
    showSnackbar('Error loading delete requests!', 'error');
    setDeleteRequests([]);
  } finally {
    setDeleteRequestsLoading(false);
  }
};
useEffect(() => {
  fetchMyDeleteRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [deleteRequestsOpen]);

const downloadBlobFile = (data, filename, type = 'text/csv;charset=utf-8') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
const openExportDialog = async (type) => {
  setExportType(type);

const defaultMode =
  type === 'pending-profiles' ||
  type === 'users' ||
  type === 'zero-utr' ||
  type === 'no-login-3-months' ||
  type === 'no-sahyog-2-months'
    ? 'all'
    : 'beneficiary';

  setExportMode(defaultMode);
  setExportBeneficiary('');
  setExportMonth(new Date().getMonth() + 1);
  setExportYear(new Date().getFullYear());
  if (isBlockManager) {
  const firstSambhag = locationHierarchy[0];
  const firstDistrict = firstSambhag?.districts?.[0];
  const firstBlock = firstDistrict?.blocks?.[0];

  setExportLocationFilters({
    sambhagId: firstSambhag?.id || '',
    districtId: firstDistrict?.id || '',
    blockId: firstBlock?.id || '',
  });

setExportDistrictOptions(firstSambhag?.districts || []);
setExportBlockOptions(firstDistrict?.blocks || []);
} else {
  setExportLocationFilters({
    sambhagId: '',
    districtId: '',
    blockId: '',
  });

  setExportDistrictOptions([]);
  setExportBlockOptions([]);
}

  if ((type === 'sahyog' || type === 'asahyog') && deathCases.length === 0) {
    await fetchDeathCases();
  }

  setExportDialogOpen(true);
};
const handleDeleteUser = async (targetUser) => {
  const userId = typeof targetUser === 'string' ? targetUser : targetUser?.id;
  if (!userId) return;

  if (!canDeleteUsers) {
    showSnackbar('You do not have permission to delete users!', 'error');
    return;
  }

  if (targetUser?.role === 'ROLE_ADMIN' || targetUser?.role === 'ROLE_SUPERADMIN') {
    showSnackbar('Admin/Super Admin cannot be deleted from this dashboard!', 'error');
    return;
  }

  const reason = window.prompt('Enter delete reason (optional):', 'Manager requested delete');
  if (reason === null) return;

  try {
    await managerAPI.softDeleteUserWithApproval(userId, {
      reason: reason || 'Manager requested delete',
      requestedFromDashboard: 'MANAGER_DASHBOARD'
    });

showSnackbar('Delete request sent to admin successfully!', 'success');    fetchAccessibleUsers();
    fetchMyDeleteRequests();
  } catch (error) {
    console.error('Error deleting user:', error);
    showSnackbar(
      error?.response?.data?.message || 'Error deleting user!',
      'error'
    );
  }
};
const handleManagerExport = async () => {
  try {
    setExportLoading(true);

    let response;
    const areaParams = getCurrentExportAreaParams();

    if (exportType === 'users') {
      response = await managerAPI.exportUsers(areaParams);
      downloadBlobFile(response.data, 'our_member_list.csv');
    }
if (exportType === 'no-login-3-months') {
  response = await managerAPI.exportNoLoginThreeMonths(areaParams);
  downloadBlobFile(response.data, 'no_login_3_months_users.csv');
}

if (exportType === 'no-sahyog-2-months') {
  response = await managerAPI.exportNoSahyogTwoMonths(areaParams);
  downloadBlobFile(response.data, 'no_sahyog_2_months_users.csv');
}
    if (exportType === 'pending-profiles') {
      response = await managerAPI.exportPendingProfiles(areaParams);
      downloadBlobFile(response.data, 'not_profile_updated_list.csv');
    }

    if (exportType === 'zero-utr') {
      response = await managerAPI.exportZeroUtrMembers(areaParams);
      downloadBlobFile(response.data, 'zero_utr_members_list.csv');
    }

    if (exportType === 'sahyog') {
      if (exportMode === 'beneficiary') {
        response = await managerAPI.exportSahyogByBeneficiary({
          beneficiaryId: exportBeneficiary || null,
          ...areaParams,
        });
        downloadBlobFile(response.data, 'sahyog_by_beneficiary.csv');
      } else if (exportMode === 'month') {
        response = await managerAPI.exportSahyog({
          month: exportMonth,
          year: exportYear,
          ...areaParams,
        });
        downloadBlobFile(response.data, `sahyog_${exportMonth}_${exportYear}.csv`);
      } else {
        response = await managerAPI.exportAllSahyog(areaParams);
        downloadBlobFile(response.data, 'sahyog_all.csv');
      }
    }

    if (exportType === 'asahyog') {
      if (exportMode === 'beneficiary') {
        response = await managerAPI.exportAsahyogByBeneficiary({
          beneficiaryId: exportBeneficiary || null,
          ...areaParams,
        });
        downloadBlobFile(response.data, 'asahyog_by_beneficiary.csv');
      } else if (exportMode === 'month') {
        response = await managerAPI.exportAsahyog({
          month: exportMonth,
          year: exportYear,
          ...areaParams,
        });
        downloadBlobFile(response.data, `asahyog_${exportMonth}_${exportYear}.csv`);
      } else {
        response = await managerAPI.exportAllAsahyog(areaParams);
        downloadBlobFile(response.data, 'asahyog_all.csv');
      }
    }

    setExportDialogOpen(false);
    showSnackbar('Export completed successfully!', 'success');
  } catch (error) {
    console.error('Error exporting:', error);
    showSnackbar(
      error?.response?.data?.message || 'Error exporting file!',
      'error'
    );
  } finally {
    setExportLoading(false);
  }
};
const handleOpenSettings = async () => {
  try {
    setSettingsDialogOpen(true);
    setSettingsLoading(true);

    const [
      districtManagerMobileResponse,
      blockManagerMobileResponse,
    ] = await Promise.all([
      adminAPI.getDistrictManagerExportMobileSetting(),
      adminAPI.getBlockManagerExportMobileSetting(),
    ]);

    setDistrictManagerExportMobileEnabled(
      districtManagerMobileResponse.data?.districtManagerExportMobileEnabled === true
    );

    setBlockManagerExportMobileEnabled(
      blockManagerMobileResponse.data?.blockManagerExportMobileEnabled === true
    );
  } catch (error) {
    console.error('Error loading settings:', error);
    showSnackbar('Failed to load settings!', 'error');
    setSettingsDialogOpen(false);
  } finally {
    setSettingsLoading(false);
  }
};
const handleSaveSettings = async () => {
  try {
    setSettingsSaving(true);

    await Promise.all([
      adminAPI.updateDistrictManagerExportMobileSetting(districtManagerExportMobileEnabled),
      adminAPI.updateBlockManagerExportMobileSetting(blockManagerExportMobileEnabled),
    ]);

    showSnackbar('Settings updated successfully!', 'success');
    setSettingsDialogOpen(false);
  } catch (error) {
    console.error('Error saving settings:', error);
    showSnackbar(
      error?.response?.data?.message || 'Failed to save settings!',
      'error'
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
        ...queryFilters
      };
      const response = await managerAPI.getQueries(params);
      setQueries(response.data.content || []);
      setTotalQueries(response.data.totalElements || 0);
    } catch (error) {
      console.error('Error fetching queries:', error);
      showSnackbar('Error loading queries!', 'error');
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await managerAPI.getAssignments();
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      showSnackbar('Error loading assignments!', 'error');
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
    showSnackbar('Password reset successfully!', 'success');
    closePasswordReset();
  } catch (error) {
    console.error('Error resetting password:', error);
    showSnackbar(
      error?.response?.data?.message || 'Failed to reset password!',
      'error'
    );
  } finally {
    setPasswordResetLoading(false);
  }
};

  // Action Handlers
  const handleBlockUser = async (userId, reason = 'Administrative action') => {
    try {
         const targetUser = users.find((u) => u.id === userId);

    if (targetUser?.role === 'ROLE_ADMIN') {
      showSnackbar('Admin user cannot be blocked from this dashboard!', 'error');
      return;
    }
      await managerAPI.blockUser(userId, reason);
      showSnackbar('User blocked successfully!', 'success');
      fetchAccessibleUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      showSnackbar('Error blocking user!', 'error');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
        const targetUser = users.find((u) => u.id === userId);

    if (targetUser?.role === 'ROLE_ADMIN') {
      showSnackbar('Admin user cannot be modified from this dashboard!', 'error');
      return;
    }

      await managerAPI.unblockUser(userId);
      showSnackbar('User unblocked successfully!', 'success');
      fetchAccessibleUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      showSnackbar('Error unblocking user!', 'error');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await managerAPI.updateUserRole(userId, newRole);
      showSnackbar('User role updated successfully!', 'success');
      fetchAccessibleUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      showSnackbar('Error updating role!', 'error');
    }
  };

  const handleAssignQuery = async (queryId, managerId) => {
    try {
      await managerAPI.assignQuery(queryId, managerId);
      showSnackbar('Query assigned successfully!', 'success');
      fetchQueries();
    } catch (error) {
      console.error('Error assigning query:', error);
      showSnackbar('Error assigning query!', 'error');
    }
  };

  const handleResolveQuery = async (queryId, resolution) => {
    try {
      await managerAPI.resolveQuery(queryId, resolution);
      showSnackbar('Query resolved successfully!', 'success');
      fetchQueries();
    } catch (error) {
      console.error('Error resolving query:', error);
      showSnackbar('Error resolving query!', 'error');
    }
  };

  const handleEscalateQuery = async (queryId) => {
    try {
      await managerAPI.escalateQuery(queryId);
      showSnackbar('Query escalated successfully!', 'success');
      fetchQueries();
    } catch (error) {
      console.error('Error escalating query:', error);
      showSnackbar('Error escalating query!', 'error');
    }
  };

  // Utility Functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#4caf50';
      case 'blocked': return '#f44336';
      case 'deleted': return '#9e9e9e';
      case 'pending': return '#ff9800';
     case 'need_clarification': return '#2196f3';
      case 'resolved': return '#4caf50';
     case 'cancel': return '#f44336';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return '#d32f2f';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Admin';
      case 'ROLE_SAMBHAG_MANAGER': return 'Division Manager';
      case 'ROLE_DISTRICT_MANAGER': return 'District Manager';
      case 'ROLE_BLOCK_MANAGER': return 'Block Manager';
      case 'ROLE_USER': return 'User';
      default: return role;
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

    const stats = [
     {
  title: 'Total Users',
  value: overviewManagedUsers || dashboardData.userStats?.totalUsers || dashboardData.scope?.totalUsers || 0,
  icon: <People sx={{ fontSize: 40 }} />,
  color: '#1E3A8A',
  subtitle: 'Managed Users'
},
      {
        title: 'Pending Queries',
        value: dashboardData.queryStats?.pendingCount || 0,
        icon: <Assignment sx={{ fontSize: 40 }} />,
        color: '#ff9800',
        subtitle: 'For Resolution'
      },
      {
        title: 'Resolved Queries',
        value: dashboardData.queryStats?.resolvedCount || 0,
        icon: <CheckCircle sx={{ fontSize: 40 }} />,
        color: '#4caf50',
        subtitle: 'Successfully Resolved'
      },
      {
        title: 'Managed Areas',
value: managerScope?.managedLocations?.length
  || dashboardData.scope?.managedLocations?.length
  || dashboardData.scope?.totalLocations
  || 0,
          icon: <LocationOn sx={{ fontSize: 40 }} />,
        color: '#9c27b0',
        subtitle: 'Assigned Areas'
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={8} 
              sx={{ 
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.8 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
             
            </Card>
           
          </Grid>
        ))}
      </Grid>
    );
  };

  // Users Management Tab
  const renderUsersTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          User Management ({totalUsers})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
         <TextField
  size="small"
  placeholder="Search..."
  value={userFilters.search}
  onChange={(e) => {
    setUsersPage(0);
    setUserFilters(prev => ({ ...prev, search: e.target.value }));
  }}
/>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={userFilters.status}
              label="Status"
onChange={(e) => {
  setUsersPage(0);
  setUserFilters(prev => ({ ...prev, status: e.target.value }));
}}            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="BLOCKED">Blocked</MenuItem>
            </Select>
          </FormControl>
          {!isBlockManager && (
  <FormControl size="small" sx={{ minWidth: 160 }}>
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
  <FormControl size="small" sx={{ minWidth: 160 }} disabled={!userFilters.sambhagId}>
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
  sx={{ minWidth: 160 }}
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
))}  </Select>
</FormControl>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#1E3A8A', mr: 2 }}>
                      {user.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.email}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="textSecondary">
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
                      bgcolor: user.role === 'ROLE_ADMIN' ? '#f44336' : '#2196f3',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
{user.departmentSambhag || 'N/A'} / {user.departmentDistrict || 'N/A'}                  </Typography>
                  {user.departmentBlock && (
  <Typography variant="caption" display="block">
    Block: {user.departmentBlock}
  </Typography>
)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status === 'ACTIVE' ? 'Active' : user.status === 'BLOCKED' ? 'Blocked' : user.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(user.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                    {user.role === 'ROLE_ADMIN' ? (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {/* No actions for admin row */}
       <Typography variant="caption" color="text.secondary">
    No actions
  </Typography>
    </Box>
  ) : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
  {/* {canManageUsers && (
    <IconButton
      size="small"
      onClick={() => handleUpdateUserRole(
        user.id, 
        user.role === 'ROLE_USER' ? 'ROLE_BLOCK_MANAGER' : 'ROLE_USER'
      )}
      title={user.role === 'ROLE_USER' ? 'Make Manager' : 'Make User'}
      color="primary"
    >
      <ManageAccounts fontSize="small" />
    </IconButton>
  )} */}

  <IconButton
    size="small"
    onClick={() => user.status === 'BLOCKED'
      ? handleUnblockUser(user.id)
      : handleBlockUser(user.id)
    }
    title={user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
    color={user.status === 'BLOCKED' ? 'success' : 'error'}
  >
    {user.status === 'BLOCKED'
      ? <LockOpen fontSize="small" />
      : <Block fontSize="small" />}
  </IconButton>

  <IconButton
    size="small"
    onClick={() => openPasswordReset(user)}
    title="Reset Password"
    sx={{
      bgcolor: '#9c27b020',
      '&:hover': {
        bgcolor: '#9c27b040'
      }
    }}
  >
    
    <LockReset fontSize="small" sx={{ color: '#9c27b0' }} />
  </IconButton>
  <IconButton
  size="small"
  onClick={() => {
    setSelectedItem(user);
    setCreateQueryOpen(true);
  }}
  title="Create Ticket for this User"
  sx={{
    bgcolor: '#1E3A8A20',
    '&:hover': {
      bgcolor: '#1E3A8A40'
    }
  }}
>
  <Support fontSize="small" sx={{ color: '#1E3A8A' }} />
</IconButton>
  {canDeleteUsers && (
  <IconButton
    size="small"
    onClick={() => handleDeleteUser(user)}
    title="Delete User"
    sx={{
      bgcolor: '#f4433620',
      '&:hover': {
        bgcolor: '#f4433640'
      }
    }}
  >
    <Delete fontSize="small" sx={{ color: '#f44336' }} />
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
    </Paper>
  );

  // Queries Management Tab
  const renderQueriesTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, #1E3A8A15, #1E3A8A05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Query Management ({totalQueries})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateQueryOpen(true)}
            sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)', color: 'white' }}
          >
            New Query
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)' }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Query</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      {query.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {query.description?.substring(0, 100)}...
                    </Typography>
                    {query.locationContext && (
                      <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#666' }}>
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
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={query.statusDisplay || query.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(query.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {new Date(query.createdAt).toLocaleDateString('en-IN')}
                  </Typography>
                  <Typography variant="caption" display="block">
                    By: {query.createdByName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedItem(query)}
                      title="View"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    {query.status === 'PENDING' && canEscalateQueries && (
                      <IconButton
                        size="small"
                        onClick={() => handleEscalateQuery(query.id)}
                        title="Escalate"
                        color="warning"
                      >
                        <Escalator fontSize="small" />
                      </IconButton>
                    )}
                    {(query.status === 'PENDING' || query.status === 'IN_PROGRESS') && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedItem(query);
                          setResolveQueryOpen(true);
                        }}
                        title="Resolve"
                        color="success"
                      >
                        <CheckCircle fontSize="small" />
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
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A', mb: 1 }}>
          <Dashboard sx={{ mr: 2, verticalAlign: 'middle' }} />
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Welcome, {user?.name}! Your Role: {getRoleLabel(user?.role)}
        </Typography>
       {(managerScope || dashboardData?.scope) && (
  <Typography variant="body2" color="textSecondary">
    Managed Areas: {managerScope?.totalSambhags ?? dashboardData?.scope?.totalSambhags ?? 0} Divisions,{' '}
    {managerScope?.totalDistricts ?? dashboardData?.scope?.totalDistricts ?? 0} Districts,{' '}
    {managerScope?.totalBlocks ?? dashboardData?.scope?.totalBlocks ?? 0} Blocks
  </Typography>
)}
      </Box>

      {/* Dashboard Stats */}
      {renderDashboardStats()}

      {/* Alerts Section */}
      {dashboardData?.alerts && Object.keys(dashboardData.alerts).length > 0 && (
        <Box sx={{ mb: 4 }}>
          {Object.entries(dashboardData.alerts).map(([key, alert]) => (
            <Alert
              key={key}
              severity={alert.severity}
              sx={{ mb: 1 }}
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

      {/* Main Tabs */}
      <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #303f9f 100%)',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem',
              color: 'white',
              '&.Mui-selected': {
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#fff'
            }
          }}
        >
          <Tab 
            icon={<Dashboard />} 
            label="Overview" 
            iconPosition="start"
          />
          <Tab 
            icon={<People />} 
            label="User Management" 
            iconPosition="start"
          />
          <Tab 
  icon={<Chat />} 
  label="Ticket System" 
  iconPosition="start"
/>
          <Tab 
            icon={<AssignmentInd />} 
            label="Assignments" 
            iconPosition="start"
          />
         
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Dashboard Overview
              </Typography>
              {dashboardData && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
  {isSambhagManager && (
  <Button
    variant="contained"
    startIcon={<Settings />}
    onClick={handleOpenSettings}
    sx={{
      bgcolor: '#ff9800',
      '&:hover': { bgcolor: '#f57c00' }
    }}
  >
    Settings
  </Button>
)}
  <Button
    variant="contained"
    startIcon={<Download />}
    onClick={() => openExportDialog('users')}
  >
    Export Members
  </Button>

  <Button
    variant="contained"
    startIcon={<Download />}
    onClick={() => openExportDialog('sahyog')}
  >
    Export Sahyog
  </Button>

  <Button
    variant="contained"
    startIcon={<Download />}
    onClick={() => openExportDialog('asahyog')}
  >
    Export Asahyog
  </Button>

  <Button
    variant="contained"
    startIcon={<Download />}
    onClick={() => openExportDialog('pending-profiles')}
  >
    Export Pending Profiles
  </Button>

  <Button
    variant="contained"
    startIcon={<Download />}
    onClick={() => openExportDialog('zero-utr')}
  >
    Export Zero UTR
  </Button>
  <Button
  variant="contained"
  startIcon={<Download />}
  onClick={() => openExportDialog('no-login-3-months')}
>
  3 महीने से Login नहीं
</Button>

<Button
  variant="contained"
  startIcon={<Download />}
  onClick={() => openExportDialog('no-sahyog-2-months')}
>
  2 महीने से Sahyog नहीं
</Button>
 
</Box>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          My Area
                        </Typography>
                        <List dense>
{(managerScope?.managedLocations || dashboardData.scope?.managedLocations || []).map((location, index) => (                            <ListItem key={location.locationId || index}>
                              <ListItemIcon>
                                <LocationOn color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={typeof location.fullPath === 'string' ? location.fullPath : 
                                        (location.locationName || 'Location name not available')}
                                secondary={`${location.userCount || 0} Users`}
                              />
                            </ListItem>
                          )) || []}
                        </List>
                      </CardContent>

                      
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Recent Activity
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          No new activity so far.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
              
            </Box>
          )}
          {activeTab === 1 && renderUsersTab()}
         {activeTab === 2 && (
  <TicketSystemTab
    mode="manager"
    currentUser={user}
  />
)}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Assignment Management
              </Typography>
              <Alert severity="info">
                Assignment feature coming soon.
              </Alert>
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
    showSnackbar('Ticket admin को successfully भेज दी गई है!', 'success');
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
          showSnackbar('Query resolved successfully!', 'success');
          fetchQueries();
          setSelectedItem(null);
        }}
      />
    
      <Dialog
  open={settingsDialogOpen}
  onClose={() => setSettingsDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    Mobile Export Settings
  </DialogTitle>

  <DialogContent dividers>
    {settingsLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="info">
          Control whether District Manager and Block Manager exports can include mobile numbers.
        </Alert>

        <FormControlLabel
          control={
            <Switch
              checked={districtManagerExportMobileEnabled}
              onChange={(e) => setDistrictManagerExportMobileEnabled(e.target.checked)}
            />
          }
          label="District Manager can export mobile numbers"
        />

        <FormControlLabel
          control={
            <Switch
              checked={blockManagerExportMobileEnabled}
              onChange={(e) => setBlockManagerExportMobileEnabled(e.target.checked)}
            />
          }
          label="Block Manager can export mobile numbers"
        />
      </Box>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setSettingsDialogOpen(false)} disabled={settingsSaving}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSaveSettings}
      disabled={settingsSaving || settingsLoading}
      startIcon={settingsSaving ? <CircularProgress size={16} color="inherit" /> : <Settings />}
    >
      {settingsSaving ? 'Saving...' : 'Save Settings'}
    </Button>
  </DialogActions>
</Dialog>
      <Dialog
  open={exportDialogOpen}
  onClose={() => setExportDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    Export Data
  </DialogTitle>

  <DialogContent dividers>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
      {(exportType === 'sahyog' || exportType === 'asahyog') && (
        <>
        <Alert severity="info">
  Export will be restricted to your assigned area only.
</Alert>

<Grid container spacing={2}>
  {!isBlockManager && (
    <Grid item xs={12} sm={4}>
      <FormControl fullWidth size="small">
        <InputLabel>Sambhag</InputLabel>
        <Select
          value={exportLocationFilters.sambhagId}
          label="Sambhag"
          onChange={handleExportSambhagChange}
        >
          <MenuItem value="">All Assigned Sambhag</MenuItem>
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
      >
        <InputLabel>District</InputLabel>
        <Select
          value={exportLocationFilters.districtId}
          label="District"
          onChange={handleExportDistrictChange}
        >
          <MenuItem value="">All Assigned District</MenuItem>
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
      disabled={!exportLocationFilters.districtId || isBlockManager}
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
  <Typography variant="body2" color="text.secondary">
    Block Manager export is fixed to your assigned block only.
  </Typography>
)}
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Select Export Type
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant={exportMode === 'beneficiary' ? 'contained' : 'outlined'}
                onClick={() => setExportMode('beneficiary')}
              >
                Death Case Wise
              </Button>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant={exportMode === 'month' ? 'contained' : 'outlined'}
                onClick={() => setExportMode('month')}
              >
                Month Wise
              </Button>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant={exportMode === 'all' ? 'contained' : 'outlined'}
                onClick={() => setExportMode('all')}
              >
                All
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {(exportType === 'sahyog' || exportType === 'asahyog') && exportMode === 'beneficiary' && (
        <FormControl fullWidth required>
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
      )}

      {(exportType === 'sahyog' || exportType === 'asahyog') && exportMode === 'month' && (
        <>
          <FormControl fullWidth required>
            <InputLabel>Month</InputLabel>
            <Select
              value={exportMonth}
              label="Month"
              onChange={(e) => setExportMonth(e.target.value)}
            >
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Year"
            type="number"
            value={exportYear}
            onChange={(e) => setExportYear(parseInt(e.target.value, 10))}
          />
        </>
      )}

      {(exportType === 'users' || exportType === 'pending-profiles' || exportType === 'zero-utr') && (
        <Typography variant="body2" color="textSecondary">
          This export will download the full list based on your current role access.
        </Typography>
      )}
    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setExportDialogOpen(false)}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleManagerExport}
      disabled={exportLoading}
      startIcon={exportLoading ? <CircularProgress size={18} color="inherit" /> : <Download />}
    >
      {exportLoading ? 'Exporting...' : 'Export'}
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={passwordResetOpen}
  onClose={closePasswordReset}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    Reset Password
    <Typography variant="caption" display="block" color="text.secondary">
      {passwordResetUser?.id ? `User ID: ${passwordResetUser.id}` : ''}
    </Typography>
  </DialogTitle>

  <DialogContent dividers>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        This will reset the user's password to their Date of Birth.
      </Alert>

      <Typography variant="body2" color="text.secondary">
        New password format will be <strong>DDMMYYYY</strong> without separators.
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Example: if DOB is 17 April 2002, password will be <strong>17042002</strong>.
      </Typography>

      {passwordResetUser?.dateOfBirth && (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          User DOB: {passwordResetUser.dateOfBirth}
        </Typography>
      )}
    </Box>
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button onClick={closePasswordReset} disabled={passwordResetLoading}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={submitPasswordReset}
      disabled={passwordResetLoading}
      startIcon={passwordResetLoading ? <CircularProgress size={16} /> : <LockReset />}
      sx={{ bgcolor: '#9c27b0' }}
    >
      {passwordResetLoading ? 'Resetting...' : 'Confirm Reset'}
    </Button>
  </DialogActions>
</Dialog>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Layout>
  );
};

export default ManagerDashboard;