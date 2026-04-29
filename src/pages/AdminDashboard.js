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
  CircularProgress,
  Collapse,
  InputAdornment,
  Checkbox,
  FormControlLabel,
Switch,
Toolbar,
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  Edit,
  Delete,
  Lock,
  PersonAdd,
  Download,
  Add,
  Visibility,
  Assignment,
  Payment,
  ManageAccounts,
  Support,
  LocationOn,
  Phone,
  BusinessCenter,
  Save,
  ExpandMore,
  ExpandLess,
  Search,
  Clear,
  RemoveCircleOutline,
  LockReset,
  InfoOutlined,
  DeleteSweep,
  RestoreFromTrash,
  DeleteForever,
  Settings,
  Close,
   Article,
   Badge,
   Chat,
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import MembershipCardPopup from '../components/MembershipCardPopup';
import { adminAPI, managerAPI, FILE_BASE_URL } from '../services/api';
import TicketSystemTab from '../components/TicketSystemTab';

const AdminDashboard = () => {
 const { user: currentUser } = useAuth();
  
  // State Management - All hooks must be called first
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [deathCases, setDeathCases] = useState([]);
  const [payments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [totalReceipts, setTotalReceipts] = useState(0);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [queries, setQueries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [managerAssignments, setManagerAssignments] = useState([]);
  const [managerUsersDialog, setManagerUsersDialog] = useState(false);
  const [managerUsers, setManagerUsers] = useState([]);
  const [selectedManagerInfo, setSelectedManagerInfo] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [exportMobileNumberEnabled, setExportMobileNumberEnabled] = useState(false);
const [mobileOtpEnabled, setMobileOtpEnabled] = useState(false);
const [settingsLoading, setSettingsLoading] = useState(false);
const [settingsSaving, setSettingsSaving] = useState(false);
const [selfDonationVisible, setSelfDonationVisible] = useState(false);
const [contentDialogOpen, setContentDialogOpen] = useState(false);
const [contentLoading, setContentLoading] = useState(false);
const [contentSaving, setContentSaving] = useState(false);
const [homeDisplayContent, setHomeDisplayContent] = useState({
  homeNoticeHtml: '',
  statisticsContentHtml: '',
});

const [profileFieldLocks, setProfileFieldLocks] = useState({
  fullName: false,
  dateOfBirth: false,
  mobileNumber: false,
  email: false,
  departmentUniqueId: false,
});
const [selfDonationQrUrl, setSelfDonationQrUrl] = useState('');
const [selfDonationQrFile, setSelfDonationQrFile] = useState(null);
const [selfDonationQrUploading, setSelfDonationQrUploading] = useState(false);
const [districtManagerExportMobileEnabled, setDistrictManagerExportMobileEnabled] = useState(false);
const [blockManagerExportMobileEnabled, setBlockManagerExportMobileEnabled] = useState(false);  
// Admin User Management - Details/Edit + Password Reset dialogs
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [userDetailsSaving, setUserDetailsSaving] = useState(false);
  const [userDetailsUser, setUserDetailsUser] = useState(null);
  const [userDetailsForm, setUserDetailsForm] = useState({
   fullName: '',
    fatherName: '',
    email: '',
    countryCode: '',
    mobileNumber: '',
    gender: '',
    maritalStatus: '',
    homeAddress: '',
    pincode: '',
    dateOfBirth: '',
    joiningDate: '',
    retirementDate: '',
    schoolOfficeName: '',
    sankulName: '',
    department: '',
    departmentUniqueId: '',
    departmentState: '',
    departmentSambhag: '',
    departmentDistrict: '',
    departmentBlock: '',
    nominee1Name: '',
    nominee1Relation: '',
    nominee2Name: '',
    nominee2Relation: '',
  });

  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
const [showManualCreateSuccessPopup, setShowManualCreateSuccessPopup] = useState(false);
const [manualCreateSuccessData, setManualCreateSuccessData] = useState(null);
  // Admin User Management - Trash (Deleted Users)
  const [userMembershipCardOpen, setUserMembershipCardOpen] = useState(false);
const [userMembershipCardData, setUserMembershipCardData] = useState(null);
  const [manualMembershipCardOpen, setManualMembershipCardOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [trashUsers, setTrashUsers] = useState([]);
  const [trashTotalUsers, setTrashTotalUsers] = useState(0);
  const [trashLoading, setTrashLoading] = useState(false);
  const [trashPage, setTrashPage] = useState(0);
  const [trashRowsPerPage, setTrashRowsPerPage] = useState(10);

  const [selectedDeathCase, setSelectedDeathCase] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [usersLoading, setUsersLoading] = useState(false);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [dateExportDialogOpen, setDateExportDialogOpen] = useState(false);
const [dateExportType, setDateExportType] = useState('');
const [dateExportFromDate, setDateExportFromDate] = useState('');
const [dateExportToDate, setDateExportToDate] = useState('');
  // Death Cases specific state
    const [isDeathCaseEditMode, setIsDeathCaseEditMode] = useState(false);
  const [editingDeathCaseId, setEditingDeathCaseId] = useState(null);
  const [deathCasesLoading, setDeathCasesLoading] = useState(false);
  const [deathCaseDialog, setDeathCaseDialog] = useState(false);
  const [createDeathCaseDialog, setCreateDeathCaseDialog] = useState(false);
  const [deathCaseFormData, setDeathCaseFormData] = useState({
    deceasedName: '',
    employeeCode: '',
    department: '',
    sambhag: '',
    district: '',
    block: '',
    caseDate: new Date().toISOString().split('T')[0],
    description: '',
    nominee1Name: '',
    nominee2Name: '',
    nominee1UpiLink: '',
nominee2UpiLink: '',
    account1: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    },
    account2: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    },
    account3: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    },
    status: 'OPEN'
  });
  const [deathCaseFormLoading, setDeathCaseFormLoading] = useState(false);
  const [deathCaseFiles, setDeathCaseFiles] = useState({
    userImage: null,
    nominee1QrCode: null,
    nominee2QrCode: null,
    certificate1: null
  });
  
  // Section collapse/expand state for death case form
  const [sectionExpanded, setSectionExpanded] = useState({
    basicInfo: true,
    locationInfo: true,
    nomineeInfo: true,
    account1: true,
    account2: false,
    account3: false
  });
  
  // Death cases list collapse state
  const [deathCasesListExpanded, setDeathCasesListExpanded] = useState(true);

  // Location hierarchy state for death case form
  const [locationHierarchy, setLocationHierarchy] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedSambhag, setSelectedSambhag] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [availableSambhags, setAvailableSambhags] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
    const [deleteRequestsOpen, setDeleteRequestsOpen] = useState(false);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [deleteRequestsLoading, setDeleteRequestsLoading] = useState(false);
  // Role Assignment Dialog States
  const [roleAssignmentDialog, setRoleAssignmentDialog] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [roleAssignmentData, setRoleAssignmentData] = useState({
    role: '',
    sambhagIds: [],
  districtIds: [],
  blockIds: []
  });
  const [logs, setLogs] = useState([]);
const [logsLoading, setLogsLoading] = useState(false);
const [logsTotal, setLogsTotal] = useState(0);
const [logsPage, setLogsPage] = useState(0);
const [logsRowsPerPage, setLogsRowsPerPage] = useState(20);
  // Export functionality
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
  const [exportYear, setExportYear] = useState(new Date().getFullYear());
const [dashboardExportDialog, setDashboardExportDialog] = useState(false);
const [dashboardExportType, setDashboardExportType] = useState('');
const [dashboardExportMonth, setDashboardExportMonth] = useState(new Date().getMonth() + 1);
const [dashboardExportYear, setDashboardExportYear] = useState(new Date().getFullYear());
const [dashboardExportBeneficiary, setDashboardExportBeneficiary] = useState('');
const [dashboardExportMode, setDashboardExportMode] = useState('');
const [manualSahyogMoveOpen, setManualSahyogMoveOpen] = useState(false);
const [manualSahyogMoveLoading, setManualSahyogMoveLoading] = useState(false);

const [manualSahyogMoveForm, setManualSahyogMoveForm] = useState({
  userId: '',
  deathCaseId: '',
  amount: '',
  paymentDate: new Date().toISOString().split('T')[0],
  referenceName: '',
  utrNumber: '',
  remarks: '',
});
const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    userId: '',
    name: '',
    email: '',
    mobileNumber: '',
    role: '',
    status: '',
    sambhagId: '',
    districtId: '',
    blockId: ''
  });

  // Role hierarchy - updated to match your backend
  const roles = ['ROLE_ADMIN', 'ROLE_SAMBHAG_MANAGER', 'ROLE_DISTRICT_MANAGER', 'ROLE_BLOCK_MANAGER', 'ROLE_USER'];
  const userStatuses = ['ACTIVE', 'BLOCKED', 'DELETED'];

  // API Integration Functions
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value && value.trim() !== '')
      );
      
      const response = await adminAPI.getUsers(page, rowsPerPage, cleanFilters);
      
    
      // Handle the actual paginated response structure from your backend
if (response.data && response.data.users) {
  const visibleUsers = (response.data.users || []).filter(
    (u) => String(u?.status || '').toUpperCase() !== 'DELETED'
  );

  setUsers(visibleUsers);
  setTotalUsers(response.data.totalElements || 0);
} else {
  const visibleUsers = (response.data || []).filter(
    (u) => String(u?.status || '').toUpperCase() !== 'DELETED'
  );

  setUsers(visibleUsers);
  setTotalUsers(visibleUsers.length);
}
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Error loading user data!', 'error');
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setUsersLoading(false);
    }
  };
  const [manualCreateOpen, setManualCreateOpen] = useState(false);
const [manualCreateLoading, setManualCreateLoading] = useState(false);
const [manualCheckLoading, setManualCheckLoading] = useState(false);
const [manualCreateMatch, setManualCreateMatch] = useState(null);

const [manualCreateForm, setManualCreateForm] = useState({
fullName: '',
  fatherName: '',
  email: '',
  confirmEmail: '',
  countryCode: '+91',
  mobileNumber: '',
  confirmMobileNumber: '',
  pincode: '',
  gender: '',
  maritalStatus: '',
  homeAddress: '',
  dateOfBirth: '',
  joiningDate: '',
  retirementDate: '',
  schoolOfficeName: '',
  sankulName: '',
  department: '',
  departmentUniqueId: '',
  departmentState: '',
  departmentSambhag: '',
  departmentDistrict: '',
  departmentBlock: '',
  nominee1Name: '',
  nominee1Relation: '',
  nominee2Name: '',
  nominee2Relation: '',
  password: '',
  registrationDateOverride: '',
  createIfMatchFound: false,
  matchedExistingUserId: '',
  supportEntryReference: '',
});
const [manualSelectedState, setManualSelectedState] = useState('');
const [manualSelectedSambhag, setManualSelectedSambhag] = useState('');
const [manualSelectedDistrict, setManualSelectedDistrict] = useState('');
const [manualSelectedBlock, setManualSelectedBlock] = useState('');
const [manualAvailableSambhags, setManualAvailableSambhags] = useState([]);
const [manualAvailableDistricts, setManualAvailableDistricts] = useState([]);
const [manualAvailableBlocks, setManualAvailableBlocks] = useState([]);
    const resetDeathCaseForm = () => {
    setDeathCaseFormData({
      deceasedName: '',
      employeeCode: '',
      department: '',
      sambhag: '',
      district: '',
      block: '',
      caseDate: new Date().toISOString().split('T')[0],
      description: '',
      nominee1Name: '',
      nominee2Name: '',
      nominee1UpiLink: '',
nominee2UpiLink: '',
      account1: {
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      },
      account2: {
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      },
      account3: {
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      },
      status: 'OPEN'
    });

    setDeathCaseFiles({
      userImage: null,
      nominee1QrCode: null,
      nominee2QrCode: null,
      certificate1: null
    });

    setSelectedSambhag('');
    setSelectedDistrict('');
    setSelectedBlock('');
    setAvailableDistricts([]);
    setAvailableBlocks([]);

    setSectionExpanded({
      basicInfo: true,
      locationInfo: true,
      nomineeInfo: true,
      account1: true,
      account2: false,
      account3: false
    });

    setIsDeathCaseEditMode(false);
    setEditingDeathCaseId(null);
  };
  const resetManualCreateForm = () => {
  setManualCreateForm({
    name: '',
    surname: '',
    fatherName: '',
    email: '',
    confirmEmail: '',
    countryCode: '+91',
    mobileNumber: '',
    confirmMobileNumber: '',
    pincode: '',
    gender: '',
    maritalStatus: '',
    homeAddress: '',
    dateOfBirth: '',
    joiningDate: '',
    retirementDate: '',
    schoolOfficeName: '',
    sankulName: '',
    department: '',
    departmentUniqueId: '',
    departmentState: locationHierarchy?.states?.[0]?.name || '',
    departmentSambhag: '',
    departmentDistrict: '',
    departmentBlock: '',
    nominee1Name: '',
    nominee1Relation: '',
    nominee2Name: '',
    nominee2Relation: '',
    password: '',
    registrationDateOverride: '',
    createIfMatchFound: false,
    matchedExistingUserId: '',
    supportEntryReference: '',
  });

  setManualCreateMatch(null);
  setManualSelectedState(locationHierarchy?.states?.[0]?.id || '');
  setManualSelectedSambhag('');
  setManualSelectedDistrict('');
  setManualSelectedBlock('');
  setManualAvailableSambhags(locationHierarchy?.states?.[0]?.sambhags || []);
  setManualAvailableDistricts([]);
  setManualAvailableBlocks([]);
};
const formatDobAsPassword = (dobValue) => {
  if (!dobValue) return '';
  const [year, month, day] = String(dobValue).split('-');
  if (!year || !month || !day) return '';
  return `${day}${month}${year}`;
};

useEffect(() => {
  const autoPassword = formatDobAsPassword(manualCreateForm.dateOfBirth);
  const autoRetirementDate = formatRetirementDateFromDob(manualCreateForm.dateOfBirth);

  setManualCreateForm((prev) => {
    if (
      prev.password === autoPassword &&
      prev.retirementDate === autoRetirementDate
    ) {
      return prev;
    }

    return {
      ...prev,
      password: autoPassword,
      retirementDate: autoRetirementDate,
    };
  });
}, [manualCreateForm.dateOfBirth]);

const openDateExportDialog = (type) => {
  setDateExportType(type);
  setDateExportFromDate('');
  setDateExportToDate('');
  setDateExportDialogOpen(true);
};
const handleDateRelatedExport = async () => {
  try {
    setExportLoading(true);

    const params = {
      fromDate: dateExportFromDate || null,
      toDate: dateExportToDate || null,
    };

    let response;
    let fileName;

    if (dateExportType === 'joining') {
      response = await adminAPI.exportUsersByJoiningDate(params);
      fileName = 'joining_date_users.csv';
    } else {
      response = await adminAPI.exportUsersByRetirementDate(params);
      fileName = 'retirement_date_users.csv';
    }

    downloadBlobFile(response.data, fileName);

    showSnackbar('Date related export downloaded successfully!', 'success');
    setDateExportDialogOpen(false);
  } catch (error) {
    console.error('Date export error:', error);
    showSnackbar(
      error?.response?.data?.message || 'Date related export failed!',
      'error'
    );
  } finally {
    setExportLoading(false);
  }
};
const handleExportNoLoginThreeMonths = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.exportNoLoginThreeMonths();

    downloadBlobFile(
      response.data,
      'no_login_3_months_users.csv'
    );

    showSnackbar('No-login users exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting no-login users:', error);
    showSnackbar('Error exporting no-login users!', 'error');
  } finally {
    setExportLoading(false);
  }
};

const handleExportNoSahyogTwoMonths = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.exportNoSahyogTwoMonths();

    downloadBlobFile(
      response.data,
      'no_sahyog_2_months_users.csv'
    );

    showSnackbar('No-sahyog users exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting no-sahyog users:', error);
    showSnackbar('Error exporting no-sahyog users!', 'error');
  } finally {
    setExportLoading(false);
  }
};
const formatRetirementDateFromDob = (dobValue) => {
  if (!dobValue) return '';

  const date = new Date(`${dobValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';

  date.setFullYear(date.getFullYear() + 62);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
const openManualCreateDialog = () => {
  resetManualCreateForm();
  setManualCreateOpen(true);
};

const closeManualCreateDialog = () => {
  setManualCreateOpen(false);
  resetManualCreateForm();
};
const openManualSahyogMoveDialog = async () => {
  setManualSahyogMoveForm({
    userId: '',
    deathCaseId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceName: '',
    utrNumber: '',
    remarks: '',
  });

  if (!deathCases || deathCases.length === 0) {
    await fetchDeathCases();
  }

  setManualSahyogMoveOpen(true);
};
const handleManualSahyogMove = async () => {
  try {
    if (!manualSahyogMoveForm.userId.trim()) {
      showSnackbar('User ID is required!', 'error');
      return;
    }

    if (!manualSahyogMoveForm.deathCaseId) {
      showSnackbar('Please select death case!', 'error');
      return;
    }

    if (!manualSahyogMoveForm.amount || Number(manualSahyogMoveForm.amount) <= 0) {
      showSnackbar('Valid amount is required!', 'error');
      return;
    }

    if (!manualSahyogMoveForm.paymentDate) {
      showSnackbar('Payment date is required!', 'error');
      return;
    }

    setManualSahyogMoveLoading(true);

    const payload = {
      userId: manualSahyogMoveForm.userId.trim(),
      deathCaseId: Number(manualSahyogMoveForm.deathCaseId),
      amount: Number(manualSahyogMoveForm.amount),
      paymentDate: manualSahyogMoveForm.paymentDate,
      referenceName: manualSahyogMoveForm.referenceName || 'Manual Admin Entry',
      utrNumber: manualSahyogMoveForm.utrNumber || '',
      remarks: manualSahyogMoveForm.remarks || 'Manual move from Asahyog to Sahyog',
    };

    await adminAPI.manualMoveAsahyogToSahyog(payload);

    showSnackbar('User manually moved from Asahyog to Sahyog successfully!', 'success');
    setManualSahyogMoveOpen(false);
    fetchReceipts();
  } catch (error) {
    console.error('Manual Sahyog move error:', error);
    showSnackbar(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to manually move user to Sahyog!',
      'error'
    );
  } finally {
    setManualSahyogMoveLoading(false);
  }
};
const handleFillMatchedUserData = async () => {
  try {
    const existingUserId =
      manualCreateMatch?.existingUserId || manualCreateForm.matchedExistingUserId;

    if (!existingUserId) {
      showSnackbar('Existing user ID not found!', 'error');
      return;
    }

    const response = await adminAPI.getUser(existingUserId);
    const u = response.data;

    const stateName = u?.departmentState || locationHierarchy?.states?.[0]?.name || '';
    const sambhagName = u?.departmentSambhag || '';
    const districtName = u?.departmentDistrict || '';
    const blockName = u?.departmentBlock || '';

    const stateObj =
      locationHierarchy?.states?.find((s) => s.name === stateName) ||
      locationHierarchy?.states?.[0] ||
      null;

    const sambhags = stateObj?.sambhags || [];
    const sambhagObj = sambhags.find((s) => s.name === sambhagName) || null;
    const districts = sambhagObj?.districts || [];
    const districtObj = districts.find((d) => d.name === districtName) || null;
    const blocks = districtObj?.blocks || [];
    const blockObj = blocks.find((b) => b.name === blockName) || null;

    const dobValue = u?.dateOfBirth ? String(u.dateOfBirth).substring(0, 10) : '';
    const autoPassword = formatDobAsPassword(dobValue);

    setManualSelectedState(stateObj?.id || '');
    setManualAvailableSambhags(sambhags);
    setManualSelectedSambhag(sambhagObj?.id || '');
    setManualAvailableDistricts(districts);
    setManualSelectedDistrict(districtObj?.id || '');
    setManualAvailableBlocks(blocks);
    setManualSelectedBlock(blockObj?.id || '');

    setManualCreateForm((prev) => ({
      ...prev,
      fullName: combineFullName(u?.name, u?.surname),
      fatherName: u?.fatherName || '',
      email: u?.email || '',
      confirmEmail: u?.email || '',
      countryCode: u?.countryCode || '+91',
      mobileNumber: u?.mobileNumber || '',
      confirmMobileNumber: u?.mobileNumber || '',
      pincode: u?.pincode ?? '',
      gender: u?.gender ? String(u.gender).toLowerCase() : '',
      maritalStatus:
        u?.maritalStatus === 'UNMARRIED' ? 'single' :
        u?.maritalStatus === 'MARRIED' ? 'married' :
        u?.maritalStatus === 'DIVORCED' ? 'divorced' :
        u?.maritalStatus === 'WIDOWED' ? 'widowed' : '',
      homeAddress: u?.homeAddress || '',
      dateOfBirth: dobValue,
      joiningDate: u?.joiningDate ? String(u.joiningDate).substring(0, 10) : '',
      retirementDate: u?.retirementDate ? String(u.retirementDate).substring(0, 10) : '',
      schoolOfficeName: u?.schoolOfficeName || '',
      sankulName: u?.sankulName || '',
      department: u?.department || '',
      departmentUniqueId: u?.departmentUniqueId || '',
      departmentState: stateName,
      departmentSambhag: sambhagName,
      departmentDistrict: districtName,
      departmentBlock: blockName,
      nominee1Name: u?.nominee1Name || '',
      nominee1Relation: u?.nominee1Relation || '',
      nominee2Name: u?.nominee2Name || '',
      nominee2Relation: u?.nominee2Relation || '',
      password: autoPassword,
      matchedExistingUserId: existingUserId,
    }));

    showSnackbar('Existing user data filled into form successfully!', 'success');
  } catch (error) {
    console.error('Error filling matched user data:', error);
    showSnackbar(
      error?.response?.data?.message || 'Failed to load existing user data!',
      'error'
    );
  }
};
const handleManualSambhagChange = (event) => {
  const sambhagId = event.target.value;
  setManualSelectedSambhag(sambhagId);
  setManualSelectedDistrict('');
  setManualSelectedBlock('');

  const sambhag = manualAvailableSambhags.find((s) => s.id === sambhagId);
  const districts = sambhag?.districts || [];

  setManualAvailableDistricts(districts);
  setManualAvailableBlocks([]);

  setManualCreateForm((prev) => ({
    ...prev,
    departmentSambhag: sambhag?.name || '',
    departmentDistrict: '',
    departmentBlock: '',
  }));
};

const handleManualDistrictChange = (event) => {
  const districtId = event.target.value;
  setManualSelectedDistrict(districtId);
  setManualSelectedBlock('');

  const district = manualAvailableDistricts.find((d) => d.id === districtId);
  const blocks = district?.blocks || [];

  setManualAvailableBlocks(blocks);

  setManualCreateForm((prev) => ({
    ...prev,
    departmentDistrict: district?.name || '',
    departmentBlock: '',
  }));
};

const handleManualBlockChange = (event) => {
  const blockId = event.target.value;
  setManualSelectedBlock(blockId);

  const block = manualAvailableBlocks.find((b) => b.id === blockId);

  setManualCreateForm((prev) => ({
    ...prev,
    departmentBlock: block?.name || '',
  }));
};
const handleCheckManualCreateMatch = async () => {
  try {
    setManualCheckLoading(true);
    setManualCreateMatch(null);

    const payload = {
      departmentUniqueId: manualCreateForm.departmentUniqueId,
      mobileNumber: manualCreateForm.mobileNumber,
      email: manualCreateForm.email,
    };

    const response = await adminAPI.checkManualCreateUserMatch(payload);
    setManualCreateMatch(response.data);

    if (response.data?.matchFound) {
      setManualCreateForm((prev) => ({
        ...prev,
        matchedExistingUserId: response.data.existingUserId || '',
      }));
      showSnackbar(response.data.message || 'Existing user match found.', 'warning');
    } else {
      showSnackbar('No existing user match found.', 'success');
    }
  } catch (error) {
    console.error('Error checking existing user match:', error);
    showSnackbar(
      error?.response?.data?.message || 'Failed to check old entry!',
      'error'
    );
  } finally {
    setManualCheckLoading(false);
  }
};
  const handleEditDeathCase = async (deathCaseRow) => {
    try {
      const id = deathCaseRow.id || deathCaseRow.caseId || deathCaseRow.deathCaseId;
      if (!id) {
        showSnackbar('Death case ID not found!', 'error');
        return;
      }

      setDeathCaseFormLoading(true);

      const response = await adminAPI.getDeathCaseById(id);
      const deathCase = response.data;

      setIsDeathCaseEditMode(true);
      setEditingDeathCaseId(id);

      setDeathCaseFormData({
        deceasedName: deathCase.deceasedName || '',
        employeeCode: deathCase.employeeCode || '',
        department: deathCase.department || '',
        sambhag: deathCase.sambhag || '',
        district: deathCase.district || '',
        block: deathCase.block || '',
        caseDate: deathCase.caseDate ? String(deathCase.caseDate).substring(0, 10) : new Date().toISOString().split('T')[0],
        description: deathCase.description || '',
        nominee1Name: deathCase.nominee1Name || '',
        nominee2Name: deathCase.nominee2Name || '',
        nominee1UpiLink: deathCase.nominee1UpiLink || '',
nominee2UpiLink: deathCase.nominee2UpiLink || '',
        account1: deathCase.account1 || {
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          accountHolderName: ''
        },
        account2: deathCase.account2 || {
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          accountHolderName: ''
        },
        account3: deathCase.account3 || {
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          accountHolderName: ''
        },
        status: deathCase.status || 'OPEN'
      });

      setDeathCaseFiles({
        userImage: null,
        nominee1QrCode: null,
        nominee2QrCode: null,
        certificate1: null
      });

      if (locationHierarchy?.states?.length) {
        const allSambhags = locationHierarchy.states.flatMap((state) => state.sambhags || []);
        const matchedSambhag = allSambhags.find(
          (s) => s.name === deathCase.sambhag
        );

        if (matchedSambhag) {
          setSelectedSambhag(matchedSambhag.id);
          setAvailableDistricts(matchedSambhag.districts || []);

          const matchedDistrict = (matchedSambhag.districts || []).find(
            (d) => d.name === deathCase.district
          );

          if (matchedDistrict) {
            setSelectedDistrict(matchedDistrict.id);
            setAvailableBlocks(matchedDistrict.blocks || []);

            const matchedBlock = (matchedDistrict.blocks || []).find(
              (b) => b.name === deathCase.block
            );

            if (matchedBlock) {
              setSelectedBlock(matchedBlock.id);
            } else {
              setSelectedBlock('');
            }
          } else {
            setSelectedDistrict('');
            setAvailableBlocks([]);
            setSelectedBlock('');
          }
        } else {
          setSelectedSambhag('');
          setSelectedDistrict('');
          setSelectedBlock('');
          setAvailableDistricts([]);
          setAvailableBlocks([]);
        }
      }

      setCreateDeathCaseDialog(true);
    } catch (error) {
      console.error('Error loading death case for edit:', error);
      showSnackbar('Error loading death case details!', 'error');
    } finally {
      setDeathCaseFormLoading(false);
    }
  };
const handleManualCreateUser = async () => {
  try {
    setManualCreateLoading(true);

  if (!manualCreateForm.fullName.trim()) {
  showSnackbar('Full name is required!', 'error');
  return;
}
    if (!manualCreateForm.fatherName.trim()) {
      showSnackbar('Father name is required!', 'error');
      return;
    }
    if (!manualCreateForm.gender) {
      showSnackbar('Gender is required!', 'error');
      return;
    }
    if (!manualCreateForm.maritalStatus) {
      showSnackbar('Marital status is required!', 'error');
      return;
    }
    if (!manualCreateForm.dateOfBirth) {
      showSnackbar('Date of birth is required!', 'error');
      return;
    }
    if (!manualCreateForm.mobileNumber.trim()) {
      showSnackbar('Mobile number is required!', 'error');
      return;
    }
    if (!/^\d{10}$/.test(manualCreateForm.mobileNumber.trim())) {
      showSnackbar('Mobile number must be exactly 10 digits!', 'error');
      return;
    }
    if (manualCreateForm.mobileNumber !== manualCreateForm.confirmMobileNumber) {
      showSnackbar('Mobile numbers do not match!', 'error');
      return;
    }
    if (!manualCreateForm.email.trim()) {
      showSnackbar('Email is required!', 'error');
      return;
    }
    if (manualCreateForm.email !== manualCreateForm.confirmEmail) {
      showSnackbar('Emails do not match!', 'error');
      return;
    }
    if (!manualCreateForm.homeAddress.trim()) {
      showSnackbar('Home address is required!', 'error');
      return;
    }
    if (!manualCreateForm.pincode || !/^\d{6}$/.test(String(manualCreateForm.pincode))) {
      showSnackbar('Pincode must be exactly 6 digits!', 'error');
      return;
    }
    if (!manualCreateForm.department.trim()) {
      showSnackbar('Department is required!', 'error');
      return;
    }
    if (!manualCreateForm.schoolOfficeName.trim()) {
      showSnackbar('School/Office name is required!', 'error');
      return;
    }
    if (!manualCreateForm.departmentUniqueId.trim()) {
      showSnackbar('Department Unique ID is required!', 'error');
      return;
    }
    if (!manualCreateForm.sankulName.trim()) {
      showSnackbar('Sankul name is required!', 'error');
      return;
    }
    if (!manualCreateForm.joiningDate) {
      showSnackbar('Joining date is required!', 'error');
      return;
    }
    if (!manualCreateForm.retirementDate) {
      showSnackbar('Retirement date is required!', 'error');
      return;
    }
    if (!manualCreateForm.nominee1Name.trim()) {
      showSnackbar('First nominee name is required!', 'error');
      return;
    }
    if (!manualCreateForm.nominee1Relation.trim()) {
      showSnackbar('First nominee relation is required!', 'error');
      return;
    }
    if (!manualCreateForm.nominee2Name.trim()) {
      showSnackbar('Second nominee name is required!', 'error');
      return;
    }
    if (!manualCreateForm.nominee2Relation.trim()) {
      showSnackbar('Second nominee relation is required!', 'error');
      return;
    }
    if (!manualCreateForm.password.trim()) {
      showSnackbar('Password is required!', 'error');
      return;
    }
    if (!manualCreateForm.departmentSambhag || !manualCreateForm.departmentDistrict || !manualCreateForm.departmentBlock) {
      showSnackbar('Please select Sambhag, District and Block!', 'error');
      return;
    }

    const genderMap = {
      male: 'MALE',
      female: 'FEMALE',
      other: 'OTHER',
    };

    const maritalStatusMap = {
      single: 'UNMARRIED',
      married: 'MARRIED',
      divorced: 'DIVORCED',
      widowed: 'WIDOWED',
    };
const { name, surname } = splitFullName(manualCreateForm.fullName);
    const payload = {
      name: name,
      surname: surname,
      fatherName: manualCreateForm.fatherName,
      email: manualCreateForm.email,
      countryCode: manualCreateForm.countryCode || '+91',
      mobileNumber: manualCreateForm.mobileNumber,
      pincode: manualCreateForm.pincode ? parseInt(manualCreateForm.pincode, 10) : null,
      gender: genderMap[manualCreateForm.gender] || manualCreateForm.gender,
      maritalStatus: maritalStatusMap[manualCreateForm.maritalStatus] || manualCreateForm.maritalStatus,
      homeAddress: manualCreateForm.homeAddress,
      dateOfBirth: manualCreateForm.dateOfBirth,
      joiningDate: manualCreateForm.joiningDate || null,
      retirementDate: manualCreateForm.retirementDate || null,
      schoolOfficeName: manualCreateForm.schoolOfficeName,
      sankulName: manualCreateForm.sankulName,
      department: manualCreateForm.department,
      departmentUniqueId: manualCreateForm.departmentUniqueId,
      departmentState: manualCreateForm.departmentState || locationHierarchy?.states?.[0]?.name || 'मध्य प्रदेश',
      departmentSambhag: manualCreateForm.departmentSambhag,
      departmentDistrict: manualCreateForm.departmentDistrict,
      departmentBlock: manualCreateForm.departmentBlock,
      nominee1Name: manualCreateForm.nominee1Name,
      nominee1Relation: manualCreateForm.nominee1Relation,
      nominee2Name: manualCreateForm.nominee2Name,
      nominee2Relation: manualCreateForm.nominee2Relation,
      password: manualCreateForm.password,
      registrationDateOverride: manualCreateForm.registrationDateOverride || null,
      createIfMatchFound: Boolean(manualCreateForm.createIfMatchFound),
      matchedExistingUserId: manualCreateForm.matchedExistingUserId || '',
      supportEntryReference: manualCreateForm.supportEntryReference || '',
    };

    const response = await adminAPI.manualCreateUser(payload);

const createdUser = response?.data || {};
const registrationNumber =
  createdUser?.id ||
  createdUser?.registrationNumber ||
  createdUser?.employeeId ||
  'PMUMS' + Date.now();

setManualCreateSuccessData({
  fullName: manualCreateForm.fullName || combineFullName(createdUser?.name, createdUser?.surname) || 'शिक्षक',
  name: manualCreateForm.fullName || combineFullName(createdUser?.name, createdUser?.surname) || 'शिक्षक',
  registrationNumber,
  id: registrationNumber,
  mobileNumber: manualCreateForm.mobileNumber || createdUser?.mobileNumber || '-',
  email: manualCreateForm.email || createdUser?.email || '-',
  dateOfBirth: manualCreateForm.dateOfBirth,
  department: manualCreateForm.department || createdUser?.department || '-',
  schoolOfficeName: manualCreateForm.schoolOfficeName || '-',
  registrationDate:
    manualCreateForm.registrationDateOverride ||
    createdUser?.createdAt ||
    createdUser?.registrationDate ||
    new Date().toISOString(),
});

closeManualCreateDialog();
setShowManualCreateSuccessPopup(true);
fetchUsers();
  } catch (error) {
    console.error('Error creating user manually:', error);
    showSnackbar(
      error?.response?.data?.message || error?.message || 'Failed to create user!',
      'error'
    );
  } finally {
    setManualCreateLoading(false);
  }
};
    const handleUpdateDeathCase = async () => {
    try {
      if (!editingDeathCaseId) {
        showSnackbar('Editing death case ID not found!', 'error');
        return;
      }

      setDeathCaseFormLoading(true);

      if (!deathCaseFormData.deceasedName.trim()) {
        showSnackbar('Please enter Deceased Name!', 'error');
        return;
      }

      if (!deathCaseFormData.employeeCode.trim()) {
        showSnackbar('Please enter Employee Code!', 'error');
        return;
      }

      if (!deathCaseFormData.department) {
        showSnackbar('Please select Department!', 'error');
        return;
      }

      if (!selectedSambhag) {
        showSnackbar('Please select division!', 'error');
        return;
      }

      if (!selectedDistrict) {
        showSnackbar('Please select district!', 'error');
        return;
      }

      if (!deathCaseFormData.nominee1Name.trim()) {
        showSnackbar('Please enter First Nominee Name!', 'error');
        return;
      }

      const formData = new FormData();

      const requestData = {
        deceasedName: deathCaseFormData.deceasedName,
        employeeCode: deathCaseFormData.employeeCode,
        department: deathCaseFormData.department,
        district: deathCaseFormData.district,
        description: deathCaseFormData.description,
        nominee1Name: deathCaseFormData.nominee1Name,
        nominee2Name: deathCaseFormData.nominee2Name || null,
nominee1UpiLink: (deathCaseFormData.nominee1UpiLink || '').trim() || null,
nominee2UpiLink: (deathCaseFormData.nominee2UpiLink || '').trim() || null,        account1: deathCaseFormData.account1,
        account2: deathCaseFormData.account2,
        account3: deathCaseFormData.account3,
        caseDate: deathCaseFormData.caseDate,
        status: deathCaseFormData.status
      };

      formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));

      if (deathCaseFiles.userImage) {
        formData.append('userImage', deathCaseFiles.userImage);
      }
      if (deathCaseFiles.nominee1QrCode) {
        formData.append('nominee1QrCode', deathCaseFiles.nominee1QrCode);
      }
      if (deathCaseFiles.nominee2QrCode) {
        formData.append('nominee2QrCode', deathCaseFiles.nominee2QrCode);
      }
      if (deathCaseFiles.certificate1) {
        formData.append('certificate1', deathCaseFiles.certificate1);
      }

      await adminAPI.updateDeathCase(editingDeathCaseId, formData);

      showSnackbar('Death assistance case updated successfully!', 'success');
      setCreateDeathCaseDialog(false);
      resetDeathCaseForm();
      fetchDeathCases();
    } catch (error) {
      console.error('Error updating death case:', error);
      showSnackbar('Error updating death assistance case!', 'error');
    } finally {
      setDeathCaseFormLoading(false);
    }
  };
   const handlePermanentDeleteFromTrash = async (userId) => {
  const ok = window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.');
  if (!ok) return;

  try {
    await adminAPI.permanentlyDeleteUserFromTrash(userId);
    showSnackbar('User permanently deleted successfully!', 'success');
    fetchUsers();
    fetchTrashUsers();
    fetchPendingDeleteRequests();
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    showSnackbar(
      error?.response?.data?.message || 'Error permanently deleting user!',
      'error'
    );
  }
};
const fetchAuditLogs = async () => {
  try {
    setLogsLoading(true);

    const response = await adminAPI.getAuditLogs(logsPage, logsRowsPerPage);

    if (response?.data?.content) {
      setLogs(response.data.content || []);
      setLogsTotal(response.data.totalElements || 0);
    } else if (Array.isArray(response?.data)) {
      setLogs(response.data);
      setLogsTotal(response.data.length);
    } else {
      setLogs([]);
      setLogsTotal(0);
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    showSnackbar('Error loading audit logs!', 'error');
    setLogs([]);
    setLogsTotal(0);
  } finally {
    setLogsLoading(false);
  }
};
useEffect(() => {
  if (activeTab === 4) {
    fetchAuditLogs();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeTab, logsPage, logsRowsPerPage]);
const handleClearTrash = async () => {
  const ok = window.confirm('Are you sure you want to permanently delete all users from trash? This cannot be undone.');
  if (!ok) return;

  try {
    await adminAPI.clearAllTrashUsers();
    showSnackbar('Trash cleared successfully!', 'success');
    fetchUsers();
    fetchTrashUsers();
    fetchPendingDeleteRequests();
  } catch (error) {
    console.error('Error clearing trash:', error);
    showSnackbar(
      error?.response?.data?.message || 'Error clearing trash!',
      'error'
    );
  }
};
const handleProfileFieldLockChange = (field, checked) => {
  setProfileFieldLocks((prev) => ({
    ...prev,
    [field]: checked,
  }));
};
const openContentDialog = async () => {
  try {
    setContentDialogOpen(true);
    setContentLoading(true);

    const response = await adminAPI.getHomeDisplayContentSettings();

    setHomeDisplayContent({
      homeNoticeHtml: response?.data?.homeNoticeHtml || '',
      statisticsContentHtml: response?.data?.statisticsContentHtml || '',
    });
  } catch (error) {
    console.error('Error loading content settings:', error);
    showSnackbar('Failed to load content settings!', 'error');
  } finally {
    setContentLoading(false);
  }
};
const handleSaveContentSettings = async () => {
  try {
    setContentSaving(true);

    await adminAPI.updateHomeDisplayContentSettings(homeDisplayContent);

    showSnackbar('Content updated successfully!', 'success');
    setContentDialogOpen(false);
  } catch (error) {
    console.error('Error saving content settings:', error);
    showSnackbar(
      error?.response?.data?.message || 'Failed to save content settings!',
      'error'
    );
  } finally {
    setContentSaving(false);
  }
};
const handleContentFieldChange = (field, value) => {
  setHomeDisplayContent((prev) => ({
    ...prev,
    [field]: value,
  }));
};
const openSettingsDialog = async () => {
  try {
    setSettingsDialogOpen(true);
    setSettingsLoading(true);

   const [
  mobileOtpResponse,
  exportMobileResponse,
  selfDonationVisibleResponse,
  selfDonationQrResponse,
  districtManagerMobileResponse,
  blockManagerMobileResponse,
  profileFieldLocksResponse,
] = await Promise.all([
  adminAPI.getMobileOtpSetting(),
  adminAPI.getExportMobileNumberSetting(),
  adminAPI.getSelfDonationVisibleSetting(),
  adminAPI.getSelfDonationQr(),
  adminAPI.getDistrictManagerExportMobileSetting(),
  adminAPI.getBlockManagerExportMobileSetting(),
  adminAPI.getProfileFieldLocks(),
]);

    setMobileOtpEnabled(mobileOtpResponse.data?.mobileOtpEnabled === true);
    setExportMobileNumberEnabled(
      exportMobileResponse.data?.exportMobileNumberEnabled === true
    );
    setDistrictManagerExportMobileEnabled(
  districtManagerMobileResponse.data?.districtManagerExportMobileEnabled === true
);

setBlockManagerExportMobileEnabled(
  blockManagerMobileResponse.data?.blockManagerExportMobileEnabled === true
);
    setSelfDonationVisible(
      selfDonationVisibleResponse.data?.selfDonationVisible === true
    );
    setSelfDonationQrUrl(selfDonationQrResponse.data?.qrUrl || '');
    setSelfDonationQrFile(null);
    setProfileFieldLocks({
  fullName: !!profileFieldLocksResponse.data?.fullName,
  dateOfBirth: !!profileFieldLocksResponse.data?.dateOfBirth,
  mobileNumber: !!profileFieldLocksResponse.data?.mobileNumber,
  email: !!profileFieldLocksResponse.data?.email,
  departmentUniqueId: !!profileFieldLocksResponse.data?.departmentUniqueId,
});
  } catch (error) {
    console.error('Error loading settings:', error);
    showSnackbar('Failed to load settings!', 'error');
  } finally {
    setSettingsLoading(false);
  }
};
  const fetchPendingDeleteRequests = async () => {
    if (!deleteRequestsOpen) return;

    try {
      setDeleteRequestsLoading(true);
      const response = await adminAPI.getPendingDeleteRequests();
      setDeleteRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching delete requests:', error);
      showSnackbar('Error loading delete requests!', 'error');
      setDeleteRequests([]);
    } finally {
      setDeleteRequestsLoading(false);
    }
  };

    useEffect(() => {
    fetchPendingDeleteRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteRequestsOpen]);
const handleSaveSettings = async () => {
  try {
    setSettingsSaving(true);

   await Promise.all([
  adminAPI.updateMobileOtpSetting(mobileOtpEnabled),
  adminAPI.updateExportMobileNumberSetting(exportMobileNumberEnabled),
  adminAPI.updateSelfDonationVisibleSetting(selfDonationVisible),
  adminAPI.updateDistrictManagerExportMobileSetting(districtManagerExportMobileEnabled),
  adminAPI.updateBlockManagerExportMobileSetting(blockManagerExportMobileEnabled),
  adminAPI.updateProfileFieldLocks(profileFieldLocks),
]);

    if (selfDonationQrFile) {
      setSelfDonationQrUploading(true);
      const uploadResponse = await adminAPI.uploadSelfDonationQr(selfDonationQrFile);
      setSelfDonationQrUrl(uploadResponse.data?.qrUrl || '');
    }

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
    setSelfDonationQrUploading(false);
  }
};
  // Fetch deleted users for Trash (admin)
 const fetchTrashUsers = async () => {
  if (!trashOpen) return;

  setTrashLoading(true);
  try {
    const response = await adminAPI.getDeletedUsersFromApprovalFlow();

    let data = [];

    if (Array.isArray(response?.data)) {
      data = response.data;
    } else if (Array.isArray(response?.data?.content)) {
      data = response.data.content;
    } else if (Array.isArray(response?.data?.users)) {
      data = response.data.users;
    } else if (Array.isArray(response?.data?.data)) {
      data = response.data.data;
    }

    setTrashUsers(data);
    setTrashTotalUsers(data.length);
  } catch (error) {
    console.error('Error fetching trash users:', error);
    showSnackbar('Error loading deleted users!', 'error');
    setTrashUsers([]);
    setTrashTotalUsers(0);
  } finally {
    setTrashLoading(false);
  }
};

  // Trash open/close
  const openTrash = () => {
    setTrashOpen(true);
    setTrashPage(0);
  };
  const closeTrash = () => {
    setTrashOpen(false);
  };

   const handleRestoreUser = async (userId) => {
    try {
      await adminAPI.restoreDeletedUser(userId);
      showSnackbar('User restored successfully!', 'success');
      fetchUsers();
      fetchTrashUsers();
      fetchPendingDeleteRequests();
    } catch (error) {
      console.error('Error restoring user:', error);
      showSnackbar(
        error?.response?.data?.message || 'Error restoring user!',
        'error'
      );
    }
  };
  const handleRejectDeleteRequest = async (requestId) => {
    const rejectionReason = window.prompt('Enter rejection reason (optional):', 'Delete request rejected');
    if (rejectionReason === null) return;

    try {
      await adminAPI.rejectDeleteRequest(requestId, {
        rejectionReason: rejectionReason || 'Delete request rejected'
      });

      showSnackbar('Delete request rejected successfully!', 'success');
      fetchPendingDeleteRequests();
    } catch (error) {
      console.error('Error rejecting delete request:', error);
      showSnackbar(
        error?.response?.data?.message || 'Error rejecting delete request!',
        'error'
      );
    }
  };
  const splitFullName = (fullName) => {
  const cleaned = (fullName || '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return { name: '', surname: '' };

  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    return { name: parts[0], surname: '' };
  }

  return {
    name: parts[0],
    surname: parts.slice(1).join(' '),
  };
};

const combineFullName = (name, surname) =>
  [name, surname].filter(Boolean).join(' ').trim();

  const handleApproveDeleteRequest = async (requestId) => {
    const ok = window.confirm('Are you sure you want to approve and permanently delete this user? This cannot be undone.');
    if (!ok) return;

    try {
      await adminAPI.approveDeleteRequest(requestId);
showSnackbar('Delete request approved successfully. User is now available in trash for permanent delete or restore.', 'success');      fetchUsers();
      fetchTrashUsers();
      fetchPendingDeleteRequests();
    } catch (error) {
      console.error('Error approving delete request:', error);
      showSnackbar(
        error?.response?.data?.message || 'Error approving delete request!',
        'error'
      );
    }
  };

  // Auto-load trash users when dialog is open / pagination changes
  useEffect(() => {
    fetchTrashUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trashOpen, trashPage, trashRowsPerPage]);

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  const toDateInputValue = (value) => {
    if (!value) return '';
    // LocalDate from backend usually comes as 'YYYY-MM-DD'
    if (typeof value === 'string') return value.substring(0, 10);
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().substring(0, 10);
  };

const buildUpiLink = (upiId, nomineeName) => {
  const trimmedUpiId = (upiId || '').trim();
  if (!trimmedUpiId) return null;

  const cleanName = (nomineeName || '').trim();

  let link = `upi://pay?pa=${trimmedUpiId}&cu=INR`;

  if (cleanName) {
    link += `&pn=${encodeURIComponent(cleanName)}`;
  }

  return link;
};

  const openUserDetails = (user) => {
    setUserDetailsUser(user);
    setUserDetailsForm({
      fullName: combineFullName(user?.name, user?.surname),
      fatherName: user?.fatherName || '',
      email: user?.email || '',
      countryCode: user?.countryCode || '+91',
      mobileNumber: user?.mobileNumber || '',
      gender: user?.gender || '',
      maritalStatus: user?.maritalStatus || '',
      homeAddress: user?.homeAddress || '',
      pincode: user?.pincode ?? '',
      dateOfBirth: toDateInputValue(user?.dateOfBirth),
      joiningDate: toDateInputValue(user?.joiningDate),
      retirementDate: toDateInputValue(user?.retirementDate),
      schoolOfficeName: user?.schoolOfficeName || '',
      sankulName: user?.sankulName || '',
      department: user?.department || '',
      departmentUniqueId: user?.departmentUniqueId || '',
      departmentState: user?.departmentState || user?.state || '',
      departmentSambhag: user?.departmentSambhag || user?.sambhag || '',
      departmentDistrict: user?.departmentDistrict || user?.district || '',
      departmentBlock: user?.departmentBlock || user?.block || '',
      nominee1Name: user?.nominee1Name || '',
      nominee1Relation: user?.nominee1Relation || '',
      nominee2Name: user?.nominee2Name || '',
      nominee2Relation: user?.nominee2Relation || '',
    });
    setUserDetailsOpen(true);
  };

  const closeUserDetails = () => {
    setUserDetailsOpen(false);
    setUserDetailsUser(null);
  };

  const saveUserDetails = async () => {
    if (!userDetailsUser?.id) return;

    try {
      setUserDetailsSaving(true);
const { name, surname } = splitFullName(userDetailsForm.fullName);
      // Build payload (UpdateUserRequest shape)
      const payload = {
        ...userDetailsForm,
        name,
  surname,
        // Ensure numeric fields
        pincode: userDetailsForm.pincode === '' ? null : Number(userDetailsForm.pincode),
      };

      await adminAPI.updateUser(userDetailsUser.id, payload);

      showSnackbar('User updated successfully!', 'success');
      setUserDetailsOpen(false);
      setUserDetailsUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Failed to update user!', 'error');
    } finally {
      setUserDetailsSaving(false);
    }
  };

 const openPasswordReset = (user) => {
  setPasswordResetUser(user);
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
    await adminAPI.resetUserPassword(passwordResetUser.id);
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

   const handleDeleteUser = async (user) => {
    const userId = typeof user === 'string' ? user : user?.id;
    if (!userId) return;

    const reason = window.prompt('Enter delete reason (optional):', 'Administrative delete');

    if (reason === null) return;

    try {
      await adminAPI.softDeleteUserWithApproval(userId, {
        reason: reason || 'Administrative delete',
        requestedFromDashboard: 'ADMIN_DASHBOARD'
      });

      showSnackbar('User moved to trash and delete request created successfully!', 'success');
      fetchUsers();
      fetchTrashUsers();
      fetchPendingDeleteRequests();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar(
        error?.response?.data?.message || 'Error deleting user!',
        'error'
      );
    }
  };

const handleSelectAllUsers = (event) => {
  if (event.target.checked) {
    const selectableUserIds = users
      .filter((u) => u.role !== 'ROLE_ADMIN')
      .map((u) => u.id);

    setSelectedUserIds(selectableUserIds);
  } else {
    setSelectedUserIds([]);
  }
};

const handleSelectUser = (userId) => {
  const targetUser = users.find((u) => u.id === userId);
  if (targetUser?.role === 'ROLE_ADMIN') return;

  setSelectedUserIds((prev) =>
    prev.includes(userId)
      ? prev.filter((id) => id !== userId)
      : [...prev, userId]
  );
};

const handleBulkSoftDelete = async () => {
  if (selectedUserIds.length === 0) {
    showSnackbar('Please select at least one user!', 'error');
    return;
  }

  const ok = window.confirm(
    `Are you sure you want to soft delete ${selectedUserIds.length} selected user(s)?`
  );
  if (!ok) return;

  try {
    await Promise.all(
      selectedUserIds.map((id) =>
        adminAPI.softDeleteUserWithApproval(id, {
          reason: 'Bulk delete from admin dashboard',
          requestedFromDashboard: 'ADMIN_DASHBOARD'
        })
      )
    );

    showSnackbar('Selected users moved to trash successfully!', 'success');
    setSelectedUserIds([]);
    fetchUsers();
    fetchTrashUsers();
    fetchPendingDeleteRequests();
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    showSnackbar('Error deleting selected users!', 'error');
  }
};

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
         const targetUser = users.find((u) => u.id === userId);

    if (targetUser?.role === 'ROLE_ADMIN'&& currentUser?.role !== 'ROLE_SUPERADMIN') {
      showSnackbar('Admin role cannot be modified!', 'error');
      return;
    }

    if (newRole === 'ROLE_ADMIN'&& currentUser?.role !== 'ROLE_SUPERADMIN') {
      showSnackbar('Admin role assignment is not allowed from this screen!', 'error');
      return;
    }

      await adminAPI.updateUserRole(userId, newRole);
      showSnackbar('User Role updated successfully!', 'success');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error updating user role:', error);
      showSnackbar('Error updating Role!', 'error');
    }
  };

  // Handle role assignment form submission
  const handleRoleAssignmentSubmit = async () => {
    if (!roleAssignmentData.role) {
      showSnackbar('Please select a Role!', 'error');
      return;
    }
 if (selectedUserForRole?.role === 'ROLE_ADMIN'&& currentUser?.role !== 'ROLE_SUPERADMIN') {
    showSnackbar('Admin role cannot be modified!', 'error');
    return;
  }

  if (roleAssignmentData.role === 'ROLE_ADMIN' && currentUser?.role !== 'ROLE_SUPERADMIN') {
    showSnackbar('Admin role can only be assigned from backend or a dedicated secure admin flow!', 'error');
    return;
  }
    // Validate location selection based on role
 if (
  roleAssignmentData.role === 'ROLE_SAMBHAG_MANAGER' &&
  roleAssignmentData.sambhagIds.length === 0
) {
  showSnackbar('Please select at least one Division!', 'error');
  return;
}

if (
  roleAssignmentData.role === 'ROLE_DISTRICT_MANAGER' &&
  (roleAssignmentData.sambhagIds.length === 0 || roleAssignmentData.districtIds.length === 0)
) {
  showSnackbar('Please select at least one Division and one District!', 'error');
  return;
}

if (
  roleAssignmentData.role === 'ROLE_BLOCK_MANAGER' &&
  (
    roleAssignmentData.sambhagIds.length === 0 ||
    roleAssignmentData.districtIds.length === 0 ||
    roleAssignmentData.blockIds.length === 0
  )
) {
  showSnackbar('Please select at least one Division, District and Block!', 'error');
  return;
}

//     try {
//       // First update the user role
//       await handleUpdateUserRole(selectedUserForRole.id, roleAssignmentData.role);
      
//       // If assigning a manager role, create manager assignment
//       if (roleAssignmentData.role !== 'ROLE_USER') {
//         await createManagerAssignment();
//       }
      
//       setRoleAssignmentDialog(false);
//       setSelectedUserForRole(null);
// setRoleAssignmentData({ role: '', sambhagIds: [], districtIds: [], blockIds: [] });      showSnackbar('Role assigned successfully!', 'success');
//   } catch (error) {
//   console.error('Error in role assignment:', error);
//   const msg =
//     error?.response?.data?.error ||
//     error?.message ||
//     'Error assigning role!';
//   showSnackbar(msg, 'error');
// }
try {
  const previousRole = selectedUserForRole?.role;

  await handleUpdateUserRole(selectedUserForRole.id, roleAssignmentData.role);

  if (roleAssignmentData.role !== 'ROLE_USER') {
    await createManagerAssignment();
  }

  setRoleAssignmentDialog(false);
  setSelectedUserForRole(null);
  setRoleAssignmentData({
    role: '',
    sambhagIds: [],
    districtIds: [],
    blockIds: []
  });

  showSnackbar('Role assigned successfully!', 'success');
} catch (error) {
  console.error('Error in role assignment:', error);

  const backendMessage =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    '';

  if (backendMessage.toLowerCase().includes('already assigned')) {
    setRoleAssignmentDialog(false);
    setSelectedUserForRole(null);
    setRoleAssignmentData({
      role: '',
      sambhagIds: [],
      districtIds: [],
      blockIds: []
    });

    showSnackbar(
      'Role updated successfully. Manager was already assigned to the selected location.',
      'success'
    );
    fetchUsers();
    fetchManagerAssignments();
    return;
  }

  showSnackbar(backendMessage || 'Error assigning role!', 'error');
}
  };

  // Create manager assignment based on role and location
  const createManagerAssignment = async () => {
    const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
  try {
    const managerLevelMap = {
      ROLE_SAMBHAG_MANAGER: 'SAMBHAG',
      ROLE_DISTRICT_MANAGER: 'DISTRICT',
      ROLE_BLOCK_MANAGER: 'BLOCK'
    };

    const managerLevel = managerLevelMap[roleAssignmentData.role];
    if (!managerLevel) return;

    let payloads = [];

    if (roleAssignmentData.role === 'ROLE_SAMBHAG_MANAGER') {
      payloads = roleAssignmentData.sambhagIds.map((sambhagId) => ({
        managerId: selectedUserForRole.id,
        managerLevel,
        sambhagId,
        districtId: null,
        blockId: null,
        notes: `${selectedUserForRole.name} assigned as Division Manager`
      }));
    }

    if (roleAssignmentData.role === 'ROLE_DISTRICT_MANAGER') {
      payloads = roleAssignmentData.districtIds.map((districtId) => {
        const district = availableDistricts.find((d) => d.id === districtId);
        return {
          managerId: selectedUserForRole.id,
          managerLevel,
          sambhagId: null,
          districtId,
          blockId: null,
          notes: `${selectedUserForRole.name} assigned as District Manager for ${district?.name || districtId}`
        };
      });
    }

    if (roleAssignmentData.role === 'ROLE_BLOCK_MANAGER') {
      payloads = roleAssignmentData.blockIds.map((blockId) => {
        const block = availableBlocks.find((b) => b.id === blockId);
        return {
          managerId: selectedUserForRole.id,
          managerLevel,
          sambhagId: null,
          districtId: null,
          blockId,
          notes: `${selectedUserForRole.name} assigned as Block Manager for ${block?.name || blockId}`
        };
      });
    }
const allIdsValid = payloads.every((p) =>
  (!p.sambhagId || isUuid(p.sambhagId)) &&
  (!p.districtId || isUuid(p.districtId)) &&
  (!p.blockId || isUuid(p.blockId))
);

if (!allIdsValid) {
  throw new Error('Invalid location IDs. Please load real location hierarchy from backend.');
}
    await Promise.all(payloads.map((payload) => adminAPI.createManagerAssignment(payload)));

    if (activeTab === 1) {
      fetchManagerAssignments();
    }
  } catch (error) {
    console.error('Error creating manager assignments:', error);
    const errorMessage = error.response?.data?.error || 'Error creating manager assignments';
    showSnackbar(errorMessage, 'error');
    throw error;
  }
};

const handleExportAllUsers = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.exportAllUsers();

    const blob = new Blob(
      [response.data],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all_users_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    showSnackbar('All users exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting all users:', error);
    showSnackbar('Error exporting all users!', 'error');
  } finally {
    setExportLoading(false);
  }
};
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

const handleExportSahyog = async () => {
  try {
    setExportLoading(true);

    let response;

    if (dashboardExportMode === 'beneficiary') {
      response = await adminAPI.exportSahyogByBeneficiary({
        beneficiaryId: dashboardExportBeneficiary || null
      });

      downloadBlobFile(
        response.data,
        `sahyog_by_beneficiary.csv`
      );
    } else if (dashboardExportMode === 'month') {
      response = await adminAPI.exportSahyog({
        month: dashboardExportMonth,
        year: dashboardExportYear
      });

      downloadBlobFile(
        response.data,
        `sahyog_${dashboardExportMonth}_${dashboardExportYear}.csv`
      );
    } else if (dashboardExportMode === 'all') {
      response = await adminAPI.exportAllSahyog();

      downloadBlobFile(
        response.data,
        `sahyog_all.csv`
      );
    }

    setDashboardExportDialog(false);
    showSnackbar('Sahyog exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting sahyog:', error);
    showSnackbar('Error exporting sahyog!', 'error');
  } finally {
    setExportLoading(false);
  }
};

const handleExportAsahyog = async () => {
  try {
    setExportLoading(true);

    let response;

    if (dashboardExportMode === 'beneficiary') {
      response = await adminAPI.exportAsahyogByBeneficiary({
        beneficiaryId: dashboardExportBeneficiary || null
      });

      downloadBlobFile(
        response.data,
        `asahyog_by_beneficiary.csv`
      );
    } else if (dashboardExportMode === 'month') {
      response = await adminAPI.exportAsahyog({
        month: dashboardExportMonth,
        year: dashboardExportYear
      });

      downloadBlobFile(
        response.data,
        `asahyog_${dashboardExportMonth}_${dashboardExportYear}.csv`
      );
    } else if (dashboardExportMode === 'all') {
      response = await adminAPI.exportAllAsahyog();

      downloadBlobFile(
        response.data,
        `asahyog_all.csv`
      );
    }

    setDashboardExportDialog(false);
    showSnackbar('Asahyog exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting asahyog:', error);
    showSnackbar('Error exporting asahyog!', 'error');
  } finally {
    setExportLoading(false);
  }
};

const handleRestoreAllTrash = async () => {
  const ok = window.confirm('Are you sure you want to restore all users from trash?');
  if (!ok) return;

  try {
    await adminAPI.restoreAllDeletedUsers();
    showSnackbar('All deleted users restored successfully!', 'success');
    fetchUsers();
    fetchTrashUsers();
    fetchPendingDeleteRequests();
  } catch (error) {
    console.error('Error restoring all users:', error);
    showSnackbar(
      error?.response?.data?.message || 'Error restoring all users!',
      'error'
    );
  }
};
const handleExportPendingProfiles = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.exportPendingProfiles();

    downloadBlobFile(
      response.data,
      'pending_profiles.csv'
    );

    setDashboardExportDialog(false);
    showSnackbar('Pending profiles exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting pending profiles:', error);
    showSnackbar('Error exporting pending profiles!', 'error');
  } finally {
    setExportLoading(false);
  }
};
const openDashboardExportDialog = async (type) => {
  setDashboardExportType(type);

  // default mode
  const defaultMode = type === 'pending-profiles' ? 'all' : 'beneficiary';
  setDashboardExportMode(defaultMode);

  setDashboardExportBeneficiary('');
  setDashboardExportMonth(new Date().getMonth() + 1);
  setDashboardExportYear(new Date().getFullYear());

  if (type !== 'pending-profiles' && deathCases.length === 0) {
    await fetchDeathCases();
  }

  setDashboardExportDialog(true);
};
// Export users functionality
const handleExportUsers = async () => {
  try {
    setExportLoading(true);
    const response = await adminAPI.exportUsers(exportMonth, exportYear);

    const blob = new Blob(
      [response.data],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_export_${exportMonth}_${exportYear}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setExportDialog(false);
    showSnackbar('User data exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting users:', error);
    showSnackbar('Error exporting!', 'error');
  } finally {
    setExportLoading(false);
  }
};

const handleSendInsuranceInquiryEmail = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.sendInsuranceInquiriesExportEmail();

    showSnackbar(
      response?.data?.message || 'Insurance inquiries exported and emailed successfully!',
      'success'
    );
  } catch (error) {
    console.error('Error sending insurance inquiries export email:', error);

    showSnackbar(
      error?.response?.data?.message || 'Failed to export and send insurance inquiries email!',
      'error'
    );
  } finally {
    setExportLoading(false);
  }
};
  // Export death cases to Excel
  const handleExportDeathCases = async () => {
    console.log('Export button clicked - starting death cases export...');
    try {
      setExportLoading(true);
      console.log('Making API call to export death cases...');
      
      const response = await adminAPI.exportDeathCases();
      console.log('Export response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data size:', response.data?.size || 'unknown');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Create and download Excel file
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      console.log('Blob created, size:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current timestamp
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
      const filename = `death_cases_${timestamp}.xlsx`;
      link.setAttribute('download', filename);
      
      console.log('Downloading file:', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSnackbar('Death cases exported successfully!', 'success');
      console.log('Export completed successfully');
    } catch (error) {
      console.error('Death cases export error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      let errorMessage = 'Error exporting death cases!';
      if (error.response?.status === 404) {
        errorMessage = 'Export API not available!';
      } else if (error.response?.status === 403) {
        errorMessage = 'No permission to export!';
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setExportLoading(false);
      console.log('Export loading state reset');
    }
  };

  // Fetch death cases
  const fetchDeathCases = async () => {
    try {
      console.log('Fetching death cases...');
      setDeathCasesLoading(true);
      const response = await adminAPI.getDeathCases();
      console.log('Death cases response:', response);
      console.log('Death cases data:', response.data);
      
      // Check if response has the expected structure
      if (response && response.data) {
        setDeathCases(response.data);
      } else if (response && Array.isArray(response)) {
        // If the API returns data directly without wrapping
        setDeathCases(response);
      } else {
        console.warn('Unexpected response structure:', response);
        setDeathCases([]);
      }
    } catch (error) {
  console.error('Error fetching death cases:', error);
  console.error('Error details:', error.response?.data);

  setDeathCases([]);
  showSnackbar(
    error?.response?.data?.message || 'Error loading death cases!',
    'error'
  );
} finally {
  setDeathCasesLoading(false);
}
  };

  // Fetch receipts
  const fetchReceipts = async (page = 0, size = 20) => {
    try {
      console.log('Fetching receipts...');
      setReceiptsLoading(true);
      const response = await adminAPI.getReceipts({ page, size });
      console.log('Receipts response:', response);
      
      if (response && response.data) {
        const { content, totalElements } = response.data;
        setReceipts(content || []);
        setTotalReceipts(totalElements || 0);
        console.log(`Loaded ${content?.length || 0} receipts out of ${totalElements || 0} total`);
      } else {
        console.warn('Unexpected receipts response structure:', response);
        setReceipts([]);
        setTotalReceipts(0);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
      showSnackbar('Error loading Receipts!', 'error');
      setReceipts([]);
      setTotalReceipts(0);
    } finally {
      setReceiptsLoading(false);
    }
  };

  // Load death cases when death cases tab is selected
  useEffect(() => {
    if (activeTab === 1||activeTab === 2) { // Death cases tab
      fetchDeathCases();
    }
  }, [activeTab]);
    useEffect(() => {
      if (activeTab === 3) {
        fetchReceipts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

  // Fetch location hierarchy for death case form
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setLoadingLocations(true);
        const response = await adminAPI.getLocationHierarchy();
        setLocationHierarchy(response.data);
        
        // Auto-select Madhya Pradesh if it's the only state
        if (response.data.states && response.data.states.length === 1) {
          const mpState = response.data.states[0];
          setSelectedState(mpState.id);
          setAvailableSambhags(mpState.sambhags || []);
        }
      } catch (apiErr) {
  console.error('Location API failed:', apiErr);
  setLocationHierarchy(null);
  setAvailableSambhags([]);
  setAvailableDistricts([]);
  setAvailableBlocks([]);
  showSnackbar('Failed to load real location data. Manager assignment cannot continue.', 'error');
  return;
} finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

  // Handle location changes for death case form
  const handleSambhagChange = (event) => {
    const sambhagId = event.target.value;
    setSelectedSambhag(sambhagId);
    setSelectedDistrict('');
    setSelectedBlock('');
    
    const sambhag = availableSambhags.find(s => s.id === sambhagId);
    setAvailableDistricts(sambhag?.districts || []);
    setAvailableBlocks([]);
    
    // Update form data
    handleDeathCaseFormChange('sambhag', sambhag?.name || '');
    handleDeathCaseFormChange('district', '');
    handleDeathCaseFormChange('block', '');
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setSelectedBlock('');
    
    const district = availableDistricts.find(d => d.id === districtId);
    setAvailableBlocks(district?.blocks || []);
    
    // Update form data
    handleDeathCaseFormChange('district', district?.name || '');
    handleDeathCaseFormChange('block', '');
  };

  const handleBlockChange = (event) => {
    const blockId = event.target.value;
    setSelectedBlock(blockId);
    
    const block = availableBlocks.find(b => b.id === blockId);
    handleDeathCaseFormChange('block', block?.name || '');
  };

  // Handle death case form submission
  const handleCreateDeathCase = async () => {
    try {
      setDeathCaseFormLoading(true);
      
      // Validate required fields
      if (!deathCaseFormData.deceasedName.trim()) {
        showSnackbar('Please enter Deceased Name!', 'error');
        return;
      }
      
      if (!deathCaseFormData.employeeCode.trim()) {
        showSnackbar('Please enter Employee Code!', 'error');
        return;
      }
      
      if (!deathCaseFormData.department) {
        showSnackbar('Please select Department!', 'error');
        return;
      }
      
      if (!selectedSambhag) {
        showSnackbar('Please select division!', 'error');
        return;
      }
      
      if (!selectedDistrict) {
        showSnackbar('Please select district!', 'error');
        return;
      }
      
      if (!deathCaseFormData.nominee1Name.trim()) {
        showSnackbar('Please enter First Nominee Name!', 'error');
        return;
      }
      
      if (!deathCaseFormData.account1.bankName.trim() || !deathCaseFormData.account1.accountNumber.trim() || !deathCaseFormData.account1.ifscCode.trim() || !deathCaseFormData.account1.accountHolderName.trim()) {
        showSnackbar('Please enter complete first account details!', 'error');
        return;
      }
      
      if (!deathCaseFormData.account2.bankName.trim() || !deathCaseFormData.account2.accountNumber.trim() || !deathCaseFormData.account2.ifscCode.trim() || !deathCaseFormData.account2.accountHolderName.trim()) {
        showSnackbar('Please enter complete second account details!', 'error');
        return;
      }
      
      if (!deathCaseFormData.account3.bankName.trim() || !deathCaseFormData.account3.accountNumber.trim() || !deathCaseFormData.account3.ifscCode.trim() || !deathCaseFormData.account3.accountHolderName.trim()) {
        showSnackbar('Please enter complete third account details!', 'error');
        return;
      }

      console.log('Creating death case:', deathCaseFormData);
      
      // Create FormData for multipart request
      const formData = new FormData();
      
      // Add JSON data part
           const requestData = {
        deceasedName: deathCaseFormData.deceasedName,
        employeeCode: deathCaseFormData.employeeCode,
        department: deathCaseFormData.department,
        district: deathCaseFormData.district,
        description: deathCaseFormData.description,
        nominee1Name: deathCaseFormData.nominee1Name,
        nominee2Name: deathCaseFormData.nominee2Name || null,
nominee1UpiLink: (deathCaseFormData.nominee1UpiLink || '').trim() || null,
nominee2UpiLink: (deathCaseFormData.nominee2UpiLink || '').trim() || null,        account1: deathCaseFormData.account1,
        account2: deathCaseFormData.account2,
        account3: deathCaseFormData.account3,
        caseDate: deathCaseFormData.caseDate,
        status: deathCaseFormData.status
      };
      
      formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }));
      
      // Add file uploads if present
      if (deathCaseFiles.userImage) {
        formData.append('userImage', deathCaseFiles.userImage);
      }
      if (deathCaseFiles.nominee1QrCode) {
        formData.append('nominee1QrCode', deathCaseFiles.nominee1QrCode);
      }
      if (deathCaseFiles.nominee2QrCode) {
        formData.append('nominee2QrCode', deathCaseFiles.nominee2QrCode);
      }
      if (deathCaseFiles.certificate1) {
        formData.append('certificate1', deathCaseFiles.certificate1);
      }
      
      const response = await adminAPI.createDeathCase(formData);
      console.log('Death case created:', response);
      
      showSnackbar('Death assistance case added successfully!', 'success');
      
      // Reset form and close dialog
      setDeathCaseFormData({
        deceasedName: '',
        employeeCode: '',
        department: '',
        sambhag: '',
        district: '',
        block: '',
        caseDate: new Date().toISOString().split('T')[0],
        description: '',
        nominee1Name: '',
        nominee2Name: '',
        nominee1UpiLink: '',
nominee2UpiLink: '',
        account1: { bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '' },
        account2: { bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '' },
        account3: { bankName: '', accountNumber: '', ifscCode: '', accountHolderName: '' },
        status: 'OPEN'
      });
      setDeathCaseFiles({ userImage: null, nominee1QrCode: null, nominee2QrCode: null, certificate1: null });
      setSelectedSambhag('');
      setSelectedDistrict('');
      setSelectedBlock('');
      setAvailableDistricts([]);
      setAvailableBlocks([]);
      setSectionExpanded({
        basicInfo: true,
        locationInfo: true,
        nomineeInfo: true,
        account1: true,
        account2: false,
        account3: false
      });
      setCreateDeathCaseDialog(false);
      
      // Refresh death cases list
      fetchDeathCases();
      
    } catch (error) {
      console.error('Error creating death case:', error);
      showSnackbar('Error adding death assistance case!', 'error');
    } finally {
      setDeathCaseFormLoading(false);
    }
  };

  // Handle death case form changes
  const handleDeathCaseFormChange = (field, value) => {
    if (field.startsWith('account')) {
      const [accountField, subField] = field.split('.');
      setDeathCaseFormData(prev => ({
        ...prev,
        [accountField]: {
          ...prev[accountField],
          [subField]: value
        }
      }));
    } else {
      setDeathCaseFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (fieldName, file) => {
    setDeathCaseFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };
  
  // Handle section expand/collapse
  const handleSectionToggle = (section) => {
    setSectionExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle role assignment form changes
const handleRoleAssignmentChange = (field, value) => {
  setRoleAssignmentData((prev) => {
    const newData = { ...prev, [field]: value };

    if (field === 'role') {
      newData.sambhagIds = [];
      newData.districtIds = [];
      newData.blockIds = [];
      setAvailableDistricts([]);
      setAvailableBlocks([]);
    }

    if (field === 'sambhagIds') {
      newData.districtIds = [];
      newData.blockIds = [];

      const selectedSambhags = availableSambhags.filter((s) =>
        (value || []).includes(s.id)
      );

      const mergedDistricts = selectedSambhags.flatMap((s) => s.districts || []);
      const uniqueDistricts = Array.from(
        new Map(mergedDistricts.map((d) => [d.id, d])).values()
      );

      setAvailableDistricts(uniqueDistricts);
      setAvailableBlocks([]);
    }

    if (field === 'districtIds') {
      newData.blockIds = [];

      const selectedDistricts = availableDistricts.filter((d) =>
        (value || []).includes(d.id)
      );

      const mergedBlocks = selectedDistricts.flatMap((d) => d.blocks || []);
      const uniqueBlocks = Array.from(
        new Map(mergedBlocks.map((b) => [b.id, b])).values()
      );

      setAvailableBlocks(uniqueBlocks);
    }

    return newData;
  });
};

  // Fetch location hierarchy - using same API as registration
  const fetchLocationHierarchy = async () => {
    try {
      setLoadingLocations(true);
      
      // Try to fetch from API first
      let locationData;
      try {
        const response = await adminAPI.getLocationHierarchy();
        locationData = response.data;
      } catch (apiErr) {
        console.warn('Location API failed, using fallback data:', apiErr);
        
        // Fallback MP data structure - same as registration but with numeric IDs
        locationData = {
          states: [{
            id: 'MP',
            name: 'Madhya Pradesh',
            sambhags: [
              {
                id: 1,
                name: 'Bhopal Division',
                districts: [
                  {
                    id: 1,
                    name: 'Bhopal',
                    blocks: [
                      { id: 1, name: 'Bhopal' },
                      { id: 2, name: 'Huzur' },
                      { id: 3, name: 'Berasia' }
                    ]
                  },
                  {
                    id: 2,
                    name: 'Raisen',
                    blocks: [
                      { id: 4, name: 'Begumganj' },
                      { id: 5, name: 'Gairatganj' },
                      { id: 6, name: 'Bareli' }
                    ]
                  }
                ]
              },
              {
                id: 2,
                name: 'Indore Division',
                districts: [
                  {
                    id: 3,
                    name: 'Indore',
                    blocks: [
                      { id: 7, name: 'Indore' },
                      { id: 8, name: 'Mhow' },
                      { id: 9, name: 'Sanwer' }
                    ]
                  },
                  {
                    id: 4,
                    name: 'Dewas',
                    blocks: [
                      { id: 10, name: 'Dewas' },
                      { id: 11, name: 'Bagli' },
                      { id: 12, name: 'Khategaon' }
                    ]
                  }
                ]
              },
              {
                id: 3,
                name: 'Ujjain Division',
                districts: [
                  {
                    id: 5,
                    name: 'Ujjain',
                    blocks: [
                      { id: 13, name: 'Ujjain' },
                      { id: 14, name: 'Ghatiya' },
                      { id: 15, name: 'Khachrod' }
                    ]
                  }
                ]
              }
            ]
          }]
        };
      }
      
      setLocationHierarchy(locationData);
      
      // Auto-select Madhya Pradesh and set available sambhags
      if (locationData.states && locationData.states.length === 1) {
        const mpState = locationData.states[0];
        setAvailableSambhags(mpState.sambhags || []);
      }
      
    } catch (err) {
      console.error('Error setting up location hierarchy:', err);
      showSnackbar('Error loading location data. Please try again.', 'error');
    } finally {
      setLoadingLocations(false);
    }
  };

  // Fetch manager assignments using new endpoint
  const fetchManagerAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      console.log('Fetching manager assignments...');
      // Use adminAPI for admin dashboard to get all manager assignments
      const response = await adminAPI.getManagerAssignments();
      console.log('Manager assignments response:', response);
      console.log('Assignment data structure:', response.data?.[0]); // Log first assignment
      setManagerAssignments(response.data || []);
      // Also keep the old assignments for backward compatibility
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Error fetching manager assignments:', error);
      showSnackbar('Error loading manager assignment!', 'error');
      // Set empty arrays to prevent undefined errors
      setManagerAssignments([]);
      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  // Remove manager assignment - DELETE /api/manager/assignments/{assignmentId}
  const handleRemoveAssignment = async (assignmentId, managerName) => {
    if (!window.confirm(`Are you sure you want to remove manager access for ${managerName || 'this user'}?`)) {
      return;
    }
    
    try {
      await adminAPI.removeManagerAssignment(assignmentId);
      showSnackbar('Manager access removed successfully!', 'success');
      fetchManagerAssignments(); // Refresh the assignments list
    } catch (error) {
      console.error('Error removing assignment:', error);
      showSnackbar('Error removing manager access!', 'error');
    }
  };

  // Remove ALL manager access from a user (used in Users tab)
  const handleRemoveAllManagerAccess = async (user) => {
    const userName = user.name || 'this user';
    if (!window.confirm(`Are you sure you want to remove ALL manager access from ${userName}? This will:\n\n1. Remove all location assignments\n2. Change role back to USER`)) {
      return;
    }
    
    try {
      // Use single API call to remove all assignments
      const response = await adminAPI.removeAllManagerAccess(user.id);
      console.log('Remove all access response:', response.data);
      
      // Then change the role back to USER
      await handleUpdateUserRole(user.id, 'ROLE_USER');
      
      const removedCount = response.data?.assignmentsRemoved || 0;
      showSnackbar(`All manager access removed from ${userName}! (${removedCount} assignments removed)`, 'success');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error removing all manager access:', error);
      showSnackbar('Error removing manager access!', 'error');
    }
  };

  // Get manager scope/access for a specific user - GET /api/manager/scope?managerId={userId}
  const fetchManagerScope = async (managerId) => {
    try {
      const response = await adminAPI.getManagerScope(managerId);
      console.log('Manager scope:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching manager scope:', error);
      showSnackbar('Error loading manager scope!', 'error');
      return null;
    }
  };

  // Get all assignments for a specific user - GET /api/manager/assignments?managerId={userId}
  const fetchUserAssignments = async (managerId) => {
    try {
      const response = await adminAPI.getManagerAssignments({ managerId });
      console.log('User assignments:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user assignments:', error);
      showSnackbar('Error loading user assignments!', 'error');
      return [];
    }
  };

  // Fetch accessible users for current manager by location
  const fetchManagerUsers = async (locationType = null, locationId = null) => {
    try {
      console.log('=== DEBUG: fetchManagerUsers called ===');
      console.log('locationType parameter:', locationType);
      console.log('locationId parameter:', locationId);
      
      if (!locationType || !locationId) {
        console.log('Missing required parameters, fetching all accessible users');
        // Fallback to general users endpoint if location params not provided
        const response = await managerAPI.getAccessibleUsers();
        console.log('Fallback API response received:', response);
        return response.data || [];
      }
      
      // Use location-based endpoint with required parameters
      const params = { 
        locationType: locationType,
        locationId: locationId,
        page: 0,
        size: 20
      };
      console.log('API params being sent:', params);
      console.log('About to call managerAPI.getUsersByLocation...');
      
      const response = await managerAPI.getUsersByLocation(params);
      console.log('Location-based API response received:', response);
      console.log('Response data:', response.data);
      
      // Handle paginated response
      if (response.data && response.data.content) {
        console.log('Paginated response content:', response.data.content);
        return response.data.content;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error in fetchManagerUsers:', error);
      console.error('Error details:', error.response?.data || error.message);
      showSnackbar('Error loading user data!', 'error');
      return [];
    }
  };
const handleExportZeroUtr = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.exportZeroUtrMembers();

    downloadBlobFile(
      response.data,
      'zero_utr_members.csv'
    );

    showSnackbar('Zero UTR members exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting zero UTR members:', error);
    showSnackbar('Error exporting zero UTR members!', 'error');
  } finally {
    setExportLoading(false);
  }
};
  // Handle viewing manager's users
  const handleViewManagerUsers = async (assignment) => {
    try {
      console.log('=== DEBUG: handleViewManagerUsers called ===');
      console.log('Assignment object:', assignment);
      console.log('Assignment keys:', Object.keys(assignment || {}));
      
      // Extract location information from assignment
      let locationType = null;
      let locationId = null;
      
      // Determine location type and ID based on manager level
      if (assignment.managerLevel === 'SAMBHAG' && assignment.sambhagId) {
        locationType = 'SAMBHAG';
        locationId = assignment.sambhagId;
      } else if (assignment.managerLevel === 'DISTRICT' && assignment.districtId) {
        locationType = 'DISTRICT';
        locationId = assignment.districtId;
      } else if (assignment.managerLevel === 'BLOCK' && assignment.blockId) {
        locationType = 'BLOCK';
        locationId = assignment.blockId;
      }
      
      console.log('Extracted location info:', { locationType, locationId });
      
      if (!locationType || !locationId) {
        showSnackbar('Location information not found!', 'error');
        console.log('Missing location info, trying fallback...');
        // Try fallback without location parameters
        const users = await fetchManagerUsers();
        console.log('Fallback users:', users);
        setManagerUsers(users);
        setSelectedManagerInfo(assignment);
        setManagerUsersDialog(true);
        return;
      }
      
      console.log('About to call fetchManagerUsers with location params');
      const users = await fetchManagerUsers(locationType, locationId);
      console.log('Manager Userssss received:', users);
      
      // Set the users data and open dialog
      setManagerUsers(users);
      setSelectedManagerInfo(assignment);
      setManagerUsersDialog(true);
      showSnackbar(`${assignment.managerName || 'Manager'} 's ${users.length} Users found`, 'success');
      
      console.log('Sample user data structure:', users[0]);
    } catch (error) {
      console.error('Error in handleViewManagerUsers:', error);
      showSnackbar('Error loading user data!', 'error');
    }
  };

  // Load data on component mount and when page/rowsPerPage changes
  useEffect(() => {
  fetchUsers();
  fetchReceipts(page, rowsPerPage);
  fetchManagerAssignments();
}, [page, rowsPerPage]);
  // Debounced search - triggers when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(0); // Reset to first page when filters change
      fetchUsers();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.mobileNumber, filters.email, filters.userId]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(0); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const manualCreateSectionHeader = (number, title, icon = <PersonAdd fontSize="small" />, gradient = 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)') => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      mb: 2.5,
      borderRadius: 3,
      background: gradient,
      color: '#fff',
      boxShadow: '0 12px 28px rgba(15, 23, 42, 0.14)',
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: '50%',
        right: -50,
        top: -70,
        background: 'rgba(255,255,255,0.16)',
      },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, position: 'relative', zIndex: 1 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '12px',
          bgcolor: 'rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="caption" sx={{ opacity: 0.88, fontWeight: 800 }}>
          Section {number}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);
const premiumDialogPaperSx = {
  borderRadius: 4,
  overflow: 'hidden',
  background: 'rgba(255,255,255,0.98)',
  boxShadow: '0 28px 80px rgba(15, 23, 42, 0.22)',
};
const settingsCardSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 3,
  bgcolor: '#fff',
  border: '1px solid rgba(226, 232, 240, 0.95)',
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
};

const settingsSwitchRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  p: 1.5,
  borderRadius: 3,
  bgcolor: '#f8fafc',
  border: '1px solid rgba(226, 232, 240, 0.85)',
};

const premiumDialogTitleSx = {
  px: 3,
  py: 2.25,
  fontWeight: 900,
  color: '#fff',
  background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const premiumDialogContentSx = {
  p: 3,
  background:
    'linear-gradient(135deg, rgba(248,250,252,0.96) 0%, rgba(255,247,237,0.75) 100%)',
};

const premiumDialogActionsSx = {
  px: 3,
  py: 2,
  bgcolor: '#fff',
  borderTop: '1px solid rgba(226, 232, 240, 0.95)',
};

const premiumTextFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#fff',
    '& fieldset': {
      borderColor: '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: '#f97316',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dc2626',
      borderWidth: 2,
    },
  },
};

const premiumSelectSx = {
  borderRadius: 3,
  bgcolor: '#fff',
  '& fieldset': {
    borderColor: '#cbd5e1',
  },
  '&:hover fieldset': {
    borderColor: '#f97316',
  },
  '&.Mui-focused fieldset': {
    borderColor: '#dc2626',
    borderWidth: 2,
  },
};

const premiumCancelButtonSx = {
  borderRadius: 3,
  px: 2.5,
  py: 1,
  fontWeight: 800,
  textTransform: 'none',
  color: '#475569',
  borderColor: '#cbd5e1',
  '&:hover': {
    borderColor: '#94a3b8',
    bgcolor: '#f8fafc',
  },
};

const premiumPrimaryButtonSx = {
  borderRadius: 3,
  px: 2.5,
  py: 1,
  fontWeight: 800,
  textTransform: 'none',
  background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
  boxShadow: '0 10px 22px rgba(220, 38, 38, 0.24)',
  '&:hover': {
    background: 'linear-gradient(135deg, #b91c1c 0%, #ea580c 100%)',
    transform: 'translateY(-1px)',
  },
};
  // Role-based access control - Dashboard should be visible for managers and admin only
const allowedRoles = ['ROLE_SUPERADMIN', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_SAMBHAG_MANAGER', 'ROLE_DISTRICT_MANAGER', 'ROLE_BLOCK_MANAGER'];
  const hasAccess = currentUser && allowedRoles.includes(currentUser.role);

  // Debug logging
  console.log('Current user:', currentUser);
  console.log('User role:', currentUser?.role);
  console.log('Has access:', hasAccess);
  console.log('Allowed roles:', allowedRoles);

  // Temporarily disable access control for debugging
  // if (!hasAccess) {
  if (false) { // Always allow access for debugging
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1">
              You do not have permission to access this Dashboard. Only Admin and Managers can view it.
            </Typography>
          </Alert>
        </Container>
      </Layout>
    );
  }

  // Dynamic admin stats based on real data
  const adminStats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#1a237e',
      growth: '+18%',
      subtitle: 'All Registered Members'
    },
    {
      title: 'Current Page',
      value: `${page + 1}/${Math.ceil(totalUsers / rowsPerPage) || 1}`,
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      growth: `${users.length} Members`,
      subtitle: 'Page Information'
    },
    {
      title: 'Blocked Users',
      value: users.filter(u => u.status === 'BLOCKED').length.toString(),
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      growth: '-5%',
      subtitle: 'Blocked Members'
    },
    {
      title: 'Admins',
      value: users.filter(u => u.role === 'ROLE_ADMIN').length.toString(),
      icon: <ManageAccounts sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      growth: '+2%',
      subtitle: 'System Admin'
    },
  ];

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: '#4caf50',
      INACTIVE: '#ff9800',
      BLOCKED: '#f44336',
      PENDING: '#2196f3',
      approved: '#4caf50',
      rejected: '#f44336',
      completed: '#4caf50',
    };
    return colors[status] || '#757575';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      blocked: 'Blocked',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
    };
    return labels[status] || status;
  };

 const getRoleLabel = (role) => {
  const labels = {
    ROLE_ADMIN: 'Admin',
    ROLE_SAMBHAG_MANAGER: 'Division Manager',
    ROLE_DISTRICT_MANAGER: 'District Manager',
    ROLE_BLOCK_MANAGER: 'Block Manager',
    ROLE_USER: 'User',
  };
  return labels[role] || role;
};

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedUser(item);
    setSelectedDeathCase(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setSelectedDeathCase(null);
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      // If it's a role change, use updateUserRole API
      if (['ROLE_USER', 'ROLE_SAMBHAG_MANAGER', 'ROLE_DISTRICT_MANAGER', 'ROLE_BLOCK_MANAGER'].includes(newStatus)) {
        await adminAPI.updateUserRole(userId, newStatus);
        showSnackbar('User Role updated successfully!', 'success');
      } 
      // If it's a status change (block/unblock)
      else if (newStatus === 'blocked') {
        await adminAPI.blockUser(userId);
        showSnackbar('User blocked successfully!', 'success');
      } 
      else if (newStatus === 'active') {
        await adminAPI.unblockUser(userId);
        showSnackbar('User unblocked successfully!', 'success');
      }
      
      // Refresh the users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      showSnackbar('Error updating user status!', 'error');
    }
  };
  
  // Handle death case status update (OPEN/CLOSED)
  const handleUpdateDeathCaseStatus = async (deathCaseId, newStatus) => {
    try {
      console.log('Updating death case status:', { deathCaseId, newStatus });
      
      if (newStatus === 'close' || newStatus === 'CLOSED') {
        await adminAPI.closeDeathCase(deathCaseId);
        showSnackbar('Death assistance case closed!', 'success');
      } else if (newStatus === 'open' || newStatus === 'OPEN') {
        await adminAPI.openDeathCase(deathCaseId);
        showSnackbar('Death assistance case opened!', 'success');
      }
      
      // Refresh the death cases list
      fetchDeathCases();
    } catch (error) {
      console.error('Error updating death case status:', error);
      showSnackbar('Error updating case status!', 'error');
    }
  };

  const handleUpdateQueryStatus = (queryId, newStatus) => {
    setQueries(prev => prev.map(query => 
      query.id === queryId ? { ...query, status: newStatus } : query
    ));
    showSnackbar(`Query status updated: ${getStatusLabel(newStatus)}`, 'success');
  };

const handleExportData = async (type) => {
  try {
    setExportLoading(true);

    if (type === 'receipts') {
      const response = await adminAPI.exportReceipts();

      downloadBlobFile(
        response.data,
        `receipts_${new Date().toISOString().slice(0, 10)}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      showSnackbar('Receipts exported successfully!', 'success');
      return;
    }

    showSnackbar(`${type} export is not configured yet.`, 'warning');
  } catch (error) {
    console.error(`${type} export error:`, error);

    showSnackbar(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        `Error exporting ${type}!`,
      'error'
    );
  } finally {
    setExportLoading(false);
  }
};

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      userId: '',
      name: '',
      email: '',
      mobileNumber: '',
      role: '',
      status: '',
      sambhagId: '',
      districtId: '',
      blockId: ''
    });
  };

const renderPoolTab = () => {
  const activePools = (deathCases || []).filter(
    (c) => String(c.caseStatus || c.status || '').toUpperCase() === 'OPEN'
  );
const totalAssignedUsersInOpenPools = activePools.reduce(
  (sum, pool) => sum + Number(pool.assignedUserCount || 0),
  0
);
const handleRebalance = async () => {
  try {
    setExportLoading(true);

    const response = await adminAPI.rebalancePools(true);

    showSnackbar(
      response?.data || 'Rebalance completed successfully!',
      'success'
    );

    await fetchDeathCases();
  } catch (error) {
    console.error('Pool rebalance error:', error);

    showSnackbar(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data ||
        'Rebalance failed!',
      'error'
    );
  } finally {
    setExportLoading(false);
  }
};

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.96)',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          background:
            'linear-gradient(135deg, rgba(239,246,255,0.96) 0%, rgba(240,253,244,0.92) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
              color: '#fff',
              boxShadow: '0 12px 24px rgba(37, 99, 235, 0.22)',
            }}
          >
            <Assignment sx={{ fontSize: 26 }} />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Active Pool List
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {deathCasesLoading
  ? 'Loading active pools...'
  : `${activePools.length} active open pools • ${totalAssignedUsersInOpenPools} users assigned`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label="Open Cases Only"
            size="small"
            variant="outlined"
            sx={{
              bgcolor: 'rgba(22, 163, 74, 0.12)',
              color: '#15803d',
              border: '1px solid rgba(22, 163, 74, 0.20)',
              fontWeight: 900,
              borderRadius: '10px',
            }}
          />

          <Button
            variant="contained"
            onClick={handleRebalance}
            disabled={exportLoading || deathCasesLoading}
            startIcon={
              exportLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Assignment />
              )
            }
            sx={{
              borderRadius: 3,
              px: 2,
              py: 1,
              fontWeight: 800,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
              boxShadow: '0 10px 22px rgba(37, 99, 235, 0.22)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #15803d 100%)',
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255,255,255,0.75)',
                opacity: 0.75,
              },
            }}
          >
            {exportLoading ? 'Rebalancing...' : 'Rebalance'}
          </Button>
        </Box>
      </Box>

      <TableContainer
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          bgcolor: '#fff',
        }}
      >
        <Table
          sx={{
            minWidth: 950,
            '& .MuiTableCell-root': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellSx}>Deceased Name</TableCell>
              <TableCell sx={tableHeaderCellSx}>Employee Code</TableCell>
              <TableCell sx={tableHeaderCellSx}>Department</TableCell>
              <TableCell sx={tableHeaderCellSx}>District</TableCell>
              <TableCell sx={tableHeaderCellSx}>Nominee</TableCell>
              <TableCell sx={tableHeaderCellSx}>Assigned Users</TableCell>
              <TableCell sx={tableHeaderCellSx}>Status</TableCell>
              <TableCell sx={tableHeaderCellSx}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {deathCasesLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={24} sx={{ color: '#2563eb' }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                      Loading pools...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : activePools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
                    <Typography variant="body1" sx={{ color: '#475569', fontWeight: 800 }}>
                      No Active Pool found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                      Open death assistance cases will appear here for pool tracking.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              activePools.map((pool) => {
                const poolId = pool.id || pool.caseId || pool.deathCaseId;
                const status = pool.caseStatus || pool.status || 'OPEN';

                return (
                  <TableRow
                    key={poolId || `${pool.employeeCode}-${pool.deceasedName}`}
                    hover
                    sx={{
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        bgcolor: 'rgba(239, 246, 255, 0.72)',
                      },
                    }}
                  >
                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        {pool.deceasedName || '-'}
                      </Typography>

                      {pool.caseDate && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          {new Date(pool.caseDate).toLocaleDateString('hi-IN')}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155' }}>
                        {pool.employeeCode || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <BusinessCenter sx={{ fontSize: 16, color: '#64748b' }} />
                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                          {pool.department || '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#2563eb' }} />
                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                          {pool.district || '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box>
                        {pool.nominee1Name ? (
                          <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                            {pool.nominee1Name}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                            No Nominee
                          </Typography>
                        )}

                        {pool.nominee2Name && (
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                            + {pool.nominee2Name}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
<TableCell sx={tableBodyCellSx}>
  <Chip
    label={`${Number(pool.assignedUserCount || 0)} Users`}
    size="small"
    variant="outlined"
    sx={{
      bgcolor: 'rgba(37, 99, 235, 0.10)',
      color: '#1d4ed8',
      border: '1px solid rgba(37, 99, 235, 0.18)',
      fontWeight: 900,
      borderRadius: '10px',
    }}
  />
</TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <Chip
                        label={String(status).toUpperCase() === 'OPEN' ? 'Open' : status}
                        size="small"
                        variant="outlined"
                        sx={{
                          ...getDeathCaseStatusChipSx(status),
                          fontWeight: 900,
                          borderRadius: '10px',
                        }}
                      />
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedDeathCase(pool);
                            setDeathCaseDialog(true);
                          }}
                          title="View Details"
                          sx={actionIconSx('#0284c7', 'rgba(2, 132, 199, 0.12)')}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleEditDeathCase(pool)}
                          title="Edit"
                          sx={actionIconSx('#f97316', 'rgba(249, 115, 22, 0.14)')}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        {pool.nominee1QrCode && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(pool.nominee1QrCode, '_blank')}
                            title="Nominee 1 QR Code"
                            sx={actionIconSx('#16a34a', 'rgba(22, 163, 74, 0.14)')}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        )}

                        {pool.nominee2QrCode && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(pool.nominee2QrCode, '_blank')}
                            title="Nominee 2 QR Code"
                            sx={actionIconSx('#15803d', 'rgba(21, 128, 61, 0.14)')}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const getAuditActionChipSx = (actionType) => {
  const action = String(actionType || '').toUpperCase();

  if (action.includes('CREATE')) {
    return {
      bgcolor: 'rgba(22, 163, 74, 0.12)',
      color: '#15803d',
      border: '1px solid rgba(22, 163, 74, 0.20)',
    };
  }

  if (action.includes('DELETE') || action.includes('REJECT')) {
    return {
      bgcolor: 'rgba(220, 38, 38, 0.10)',
      color: '#b91c1c',
      border: '1px solid rgba(220, 38, 38, 0.20)',
    };
  }

  if (action.includes('UPDATE') || action.includes('EDIT')) {
    return {
      bgcolor: 'rgba(249, 115, 22, 0.12)',
      color: '#c2410c',
      border: '1px solid rgba(249, 115, 22, 0.20)',
    };
  }

  if (action.includes('RESTORE') || action.includes('APPROVE')) {
    return {
      bgcolor: 'rgba(37, 99, 235, 0.10)',
      color: '#1d4ed8',
      border: '1px solid rgba(37, 99, 235, 0.18)',
    };
  }

  return {
    bgcolor: 'rgba(100, 116, 139, 0.10)',
    color: '#475569',
    border: '1px solid rgba(100, 116, 139, 0.20)',
  };
};

const renderLogsTab = () => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.96)',
      border: '1px solid rgba(226, 232, 240, 0.95)',
      boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
    }}
  >
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        background:
          'linear-gradient(135deg, rgba(245,243,255,0.96) 0%, rgba(239,246,255,0.92) 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            color: '#fff',
            boxShadow: '0 12px 24px rgba(124, 58, 237, 0.22)',
          }}
        >
          <Assignment sx={{ fontSize: 26 }} />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Audit Logs
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {logsLoading
              ? 'Loading audit activity...'
              : `${logsTotal} audit records available`}
          </Typography>
        </Box>
      </Box>

      <Chip
        label={`${logs.length} visible`}
        size="small"
        variant="outlined"
        sx={{
          bgcolor: 'rgba(124, 58, 237, 0.10)',
          color: '#6d28d9',
          border: '1px solid rgba(124, 58, 237, 0.20)',
          fontWeight: 900,
          borderRadius: '10px',
        }}
      />
    </Box>

    {logsLoading ? (
      <Box
        sx={{
          py: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          bgcolor: '#fff',
        }}
      >
        <CircularProgress size={24} sx={{ color: '#7c3aed' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
          Loading audit logs...
        </Typography>
      </Box>
    ) : logs.length === 0 ? (
      <Box
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: '#fff',
        }}
      >
        <Assignment sx={{ fontSize: 52, color: '#cbd5e1', mb: 1 }} />

        <Typography variant="h6" sx={{ color: '#475569', fontWeight: 900 }}>
          No audit logs found
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.75, fontWeight: 600 }}>
          User actions, delete requests, updates and admin activities will appear here.
        </Typography>
      </Box>
    ) : (
      <>
        <TableContainer
          sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            bgcolor: '#fff',
          }}
        >
          <Table
            sx={{
              minWidth: 1150,
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderCellSx}>ID</TableCell>
                <TableCell sx={tableHeaderCellSx}>Action</TableCell>
                <TableCell sx={tableHeaderCellSx}>Entity Type</TableCell>
                <TableCell sx={tableHeaderCellSx}>Entity ID</TableCell>
                <TableCell sx={tableHeaderCellSx}>Performed By</TableCell>
                <TableCell sx={tableHeaderCellSx}>Role</TableCell>
                <TableCell sx={tableHeaderCellSx}>Remarks</TableCell>
                <TableCell sx={tableHeaderCellSx}>Time</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  hover
                  sx={{
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: 'rgba(245, 243, 255, 0.72)',
                    },
                  }}
                >
                  <TableCell sx={tableBodyCellSx}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 900,
                        color: '#0f172a',
                        fontSize: '0.82rem',
                      }}
                    >
                      {log.id || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Chip
                      label={log.actionType || '-'}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getAuditActionChipSx(log.actionType),
                        fontWeight: 900,
                        borderRadius: '10px',
                      }}
                    />
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 800 }}>
                      {log.entityType || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                      {log.entityId || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    {log.performedByName ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                          {log.performedByName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          {log.performedById || '-'}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                        {log.performedById || '-'}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Chip
                      label={getRoleLabel(log.performedByRole) || log.performedByRole || '-'}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getRoleChipSx(log.performedByRole),
                        fontWeight: 900,
                        borderRadius: '10px',
                      }}
                    />
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#475569',
                        fontWeight: 700,
                        maxWidth: 280,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={log.remarks || '-'}
                    >
                      {log.remarks || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 800 }}>
                      {log.performedAt
                        ? new Date(log.performedAt).toLocaleString('en-IN')
                        : '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={logsTotal}
          page={logsPage}
          onPageChange={(_, newPage) => setLogsPage(newPage)}
          rowsPerPage={logsRowsPerPage}
          onRowsPerPageChange={(e) => {
            setLogsRowsPerPage(parseInt(e.target.value, 10));
            setLogsPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from + 1}-${Math.min(to + 1, count)} of ${count}`
          }
          labelRowsPerPage="Rows per page:"
          sx={{
            borderTop: '1px solid rgba(226, 232, 240, 0.95)',
            bgcolor: '#f8fafc',
            color: '#475569',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 800,
              color: '#64748b',
            },
          }}
        />
      </>
    )}
  </Paper>
);
  // Check if any filter is active
  const hasActiveFilters = filters.userId || filters.name || filters.mobileNumber || filters.email;
const selectableUsers = users.filter((u) => u.role !== 'ROLE_ADMIN');
  // Render functions for different tabs
  const openUserMembershipCard = (targetUser) => {
  if (!targetUser) return;

  setUserMembershipCardData({
    id: targetUser.id,
    registrationNumber: targetUser.id,

    fullName: combineFullName(targetUser.name, targetUser.surname) || targetUser.name || 'शिक्षक',
    name: combineFullName(targetUser.name, targetUser.surname) || targetUser.name || 'शिक्षक',

    fatherName: targetUser.fatherName || '-',
    mobileNumber: targetUser.mobileNumber || targetUser.phone || '-',
    email: targetUser.email || '-',
    dateOfBirth: targetUser.dateOfBirth || '-',

    department: targetUser.department || '-',
    schoolOfficeName: targetUser.schoolOfficeName || '-',
    departmentUniqueId: targetUser.departmentUniqueId || '-',

    departmentState: targetUser.departmentState || targetUser.state || 'मध्य प्रदेश',
    departmentSambhag: targetUser.departmentSambhag || targetUser.sambhag || '-',
    departmentDistrict: targetUser.departmentDistrict || targetUser.district || '-',
    departmentBlock: targetUser.departmentBlock || targetUser.block || '-',

    registrationDate:
      targetUser.registrationDate ||
      targetUser.createdAt ||
      targetUser.joiningDate ||
      new Date().toISOString(),

    photoUrl:
      targetUser.profileImageUrl ||
      targetUser.profilePhotoUrl ||
      targetUser.photoUrl ||
      targetUser.imageUrl ||
      '',
  });

  setUserMembershipCardOpen(true);
};
 const renderUsersTab = () => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.96)',
      border: '1px solid rgba(226, 232, 240, 0.95)',
      boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
    }}
  >
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        background:
          'linear-gradient(135deg, rgba(248,250,252,0.96) 0%, rgba(255,247,237,0.92) 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          User Management
        </Typography>

        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          {usersLoading
            ? 'Loading user records...'
            : `${totalUsers} total records • ${users.length} visible on current page`}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<PersonAdd />}
          onClick={openManualCreateDialog}
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1,
            fontWeight: 800,
            textTransform: 'none',
            bgcolor: '#16a34a',
            boxShadow: '0 10px 20px rgba(22, 163, 74, 0.22)',
            '&:hover': {
              bgcolor: '#15803d',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Add User
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleBulkSoftDelete}
          disabled={selectedUserIds.length === 0}
          startIcon={<Delete />}
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1,
            fontWeight: 800,
            textTransform: 'none',
            bgcolor: '#dc2626',
            boxShadow: selectedUserIds.length > 0 ? '0 10px 20px rgba(220, 38, 38, 0.22)' : 'none',
            '&:hover': {
              bgcolor: '#b91c1c',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Bulk Delete ({selectedUserIds.length})
        </Button>

        <Button
          variant="outlined"
          size="small"
          onClick={openTrash}
          startIcon={<DeleteSweep />}
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1,
            fontWeight: 800,
            textTransform: 'none',
            borderColor: '#cbd5e1',
            color: '#334155',
            bgcolor: '#fff',
            '&:hover': {
              borderColor: '#dc2626',
              bgcolor: 'rgba(220, 38, 38, 0.06)',
              color: '#b91c1c',
            },
          }}
        >
          Trash
        </Button>
      </Box>
    </Box>
      
      {/* Search Filters */}
{/* Search Filters */}
<Box
  sx={{
    p: { xs: 2.5, md: 3 },
    bgcolor: '#fff',
    borderBottom: '1px solid rgba(226, 232, 240, 0.95)',
  }}
>        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by User ID"
              value={filters.userId || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
             sx={{
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#f8fafc',
    '& fieldset': {
      borderColor: '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: '#f97316',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dc2626',
      borderWidth: 2,
    },
  },
}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Name"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
             sx={{
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#f8fafc',
    '& fieldset': {
      borderColor: '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: '#f97316',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dc2626',
      borderWidth: 2,
    },
  },
}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Mobile"
              value={filters.mobileNumber}
              onChange={(e) => setFilters(prev => ({ ...prev, mobileNumber: e.target.value }))}
             sx={{
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#f8fafc',
    '& fieldset': {
      borderColor: '#cbd5e1',
    },
    '&:hover fieldset': {
      borderColor: '#f97316',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#dc2626',
      borderWidth: 2,
    },
  },
}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <Button
  fullWidth
  variant="outlined"
  startIcon={<Clear />}
  onClick={clearFilters}
  disabled={!hasActiveFilters}
  sx={{
    height: 40,
    borderRadius: 3,
    fontWeight: 800,
    textTransform: 'none',
    borderColor: '#fecaca',
    color: '#b91c1c',
    bgcolor: hasActiveFilters ? 'rgba(254, 242, 242, 0.75)' : '#f8fafc',
    '&:hover': {
      borderColor: '#dc2626',
      bgcolor: 'rgba(254, 226, 226, 0.9)',
    },
  }}
>
  Clear Filters
</Button>
          </Grid>
        </Grid>
      </Box>
      
    <TableContainer
  sx={{
    maxWidth: '100%',
    overflowX: 'auto',
    bgcolor: '#fff',
  }}
>
  <Table
    sx={{
      minWidth: 1100,
      '& .MuiTableCell-root': {
        whiteSpace: 'nowrap',
      },
    }}
  >
         <TableHead>
  <TableRow>
    <TableCell padding="checkbox" sx={tableHeaderCellSx}>
      <Checkbox
        checked={
          selectableUsers.length > 0 &&
          selectedUserIds.length === selectableUsers.length
        }
        indeterminate={
          selectedUserIds.length > 0 &&
          selectedUserIds.length < selectableUsers.length
        }
        onChange={handleSelectAllUsers}
        sx={{
          color: '#94a3b8',
          '&.Mui-checked': {
            color: '#dc2626',
          },
          '&.MuiCheckbox-indeterminate': {
            color: '#f97316',
          },
        }}
      />
    </TableCell>

    <TableCell sx={tableHeaderCellSx}>User ID</TableCell>
    <TableCell sx={tableHeaderCellSx}>Name</TableCell>
    <TableCell sx={tableHeaderCellSx}>Email / Phone</TableCell>
    <TableCell sx={tableHeaderCellSx}>Role</TableCell>
    <TableCell sx={tableHeaderCellSx}>Location</TableCell>
    <TableCell sx={tableHeaderCellSx}>Status</TableCell>
    <TableCell sx={tableHeaderCellSx}>Last Login</TableCell>
    <TableCell sx={tableHeaderCellSx}>Actions</TableCell>
  </TableRow>
</TableHead>
          <TableBody>
            {usersLoading ? (
              <TableRow>
<TableCell colSpan={9} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
  <CircularProgress size={24} sx={{ color: '#dc2626' }} />
  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
    Loading user data...
  </Typography>
</Box>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                 <Box sx={{ textAlign: 'center' }}>
  <People sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
  <Typography variant="body1" sx={{ color: '#475569', fontWeight: 800 }}>
    No User found
  </Typography>
  <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
    Try clearing filters or adding a new user.
  </Typography>
</Box>
                </TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow
  key={user.id}
  hover
  sx={{
    transition: 'all 0.18s ease',
    '&:hover': {
      bgcolor: 'rgba(255, 247, 237, 0.78)',
    },
  }}
>
                  <TableCell sx={tableBodyCellSx} padding="checkbox">
     {user.role !== 'ROLE_ADMIN' ? (
    <Checkbox
  checked={selectedUserIds.includes(user.id)}
  onChange={() => handleSelectUser(user.id)}
  sx={{
    color: '#94a3b8',
    '&.Mui-checked': {
      color: '#dc2626',
    },
  }}
/>
  ) : null}
  </TableCell>
                <TableCell sx={tableBodyCellSx}>
 <Typography
  variant="body2"
  sx={{
    fontWeight: 900,
    color: '#0f172a',
    fontSize: '0.82rem',
  }}
>
  {user.id || '-'}
</Typography>
</TableCell>
                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
  {combineFullName(user.name, user.surname) || user.name || '-'}
</Typography>
<Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
  {user.departmentUniqueId || 'No Department ID'}
</Typography>
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                 <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
  {user.email || '-'}
</Typography>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.35 }}>
  <Phone sx={{ fontSize: 13, color: '#64748b' }} />
  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
    {user.mobileNumber || user.phone || 'N/A'}
  </Typography>
</Box>
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                 <Chip
  label={getRoleLabel(user.role)}
  size="small"
  variant="outlined"
  sx={{
    ...getRoleChipSx(user.role),
    fontWeight: 900,
    borderRadius: '10px',
  }}
/>
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
  <LocationOn sx={{ fontSize: 16, color: '#f97316', mt: 0.15 }} />
  <Box>
    <Typography variant="caption" sx={{ display: 'block', color: '#334155', fontWeight: 800 }}>
      {user.departmentSambhag || user.sambhag || 'N/A'}
    </Typography>
    <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>
      {user.departmentDistrict || user.district || 'N/A'}
    </Typography>
  </Box>
</Box>
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                 <Chip
  label={getStatusLabel(user.status)}
  size="small"
  variant="outlined"
  sx={{
    ...getStatusChipSx(user.status),
    fontWeight: 900,
    borderRadius: '10px',
  }}
/>
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="caption">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('hi-IN') : 
                     user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('hi-IN') : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell sx={tableBodyCellSx}>
                    {user.role === 'ROLE_ADMIN' && currentUser?.role !== 'ROLE_SUPERADMIN'  ? (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <IconButton
        size="small"
        onClick={() => openUserDetails(user)}
        title="View Details"
        sx={{
          bgcolor: '#2196f320',
          '&:hover': { bgcolor: '#2196f340' },
        }}
      >
        <InfoOutlined fontSize="small" sx={{ color: '#2196f3' }} />
      </IconButton>
    </Box>
  ) : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                   
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setSelectedUserForRole(user);
                        setRoleAssignmentDialog(true);
                       setRoleAssignmentData({
  role: '',
  sambhagIds: [],
  districtIds: [],
  blockIds: []
});
                        // Reset location data
                        setAvailableDistricts([]);
                        setAvailableBlocks([]);
                        // Fetch location hierarchy when dialog opens
                        if (!locationHierarchy) {
                          fetchLocationHierarchy();
                        }
                      }}
                      title="Assign Role"
                      color="primary"
                     sx={actionIconSx('#1976d2', 'rgba(25, 118, 210, 0.12)')}
                    >
                      <ManageAccounts fontSize="small" sx={{ color: '#1976d2' }} />
                    </IconButton>
                    {/* Remove Manager Access button - only show for manager roles */}
                    {user.role && (user.role.includes('MANAGER') || user.role.includes('manager')) && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveAllManagerAccess(user)}
                        title="Remove Manager Access"
                       sx={actionIconSx('#f97316', 'rgba(249, 115, 22, 0.14)')}
                      >
                        <RemoveCircleOutline fontSize="small" sx={{ color: '#ff9800' }} />
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleUpdateUserStatus(user.id, user.status?.toLowerCase() === 'blocked' ? 'active' : 'blocked')}
                      title={user.status?.toLowerCase() === 'blocked' ? 'Unblock' : 'Block'}
                      color={user.status?.toLowerCase() === 'blocked' ? 'success' : 'error'}
                     sx={actionIconSx(
  user.status?.toLowerCase() === 'blocked' ? '#16a34a' : '#dc2626',
  user.status?.toLowerCase() === 'blocked'
    ? 'rgba(22, 163, 74, 0.14)'
    : 'rgba(220, 38, 38, 0.12)'
)}
                    >
                      {user.status?.toLowerCase() === 'blocked' ? 
                        <Lock fontSize="small" sx={{ color: '#4caf50' }} /> : 
                        <Lock fontSize="small" sx={{ color: '#f44336' }} />
                      }
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openUserDetails(user)}
                      title="View / Edit Details"
                      sx={actionIconSx('#0284c7', 'rgba(2, 132, 199, 0.12)')}
                    >
                      <InfoOutlined fontSize="small" sx={{ color: '#2196f3' }} />
                    </IconButton>
<IconButton
  size="small"
  onClick={() => openUserMembershipCard(user)}
  title="View / Download ID Card"
 sx={actionIconSx('#1e3a8a', 'rgba(30, 58, 138, 0.12)')}
>
  <Badge fontSize="small" sx={{ color: '#1E3A8A' }} />
</IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openPasswordReset(user)}
                      title="Reset Password"
                     sx={actionIconSx('#9333ea', 'rgba(147, 51, 234, 0.12)')}
                    >
                      <LockReset fontSize="small" sx={{ color: '#9c27b0' }} />
                    </IconButton>

                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteUser(user)}
                      title={(user.status || '').toLowerCase() === 'deleted' ? 'Permanent Delete' : 'Soft Delete'}
                     sx={actionIconSx('#dc2626', 'rgba(220, 38, 38, 0.12)')}
                    >
                      <Delete fontSize="small" sx={{ color: (user.status || '').toLowerCase() === 'deleted' ? '#d32f2f' : '#f44336' }} />
                    </IconButton>
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
  page={page}
  onPageChange={handlePageChange}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleRowsPerPageChange}
  labelDisplayedRows={({ from, to, count }) => `${from + 1}-${Math.min(to + 1, count)} of ${count}`}
  labelRowsPerPage="Rows per page:"
  sx={{
    borderTop: '1px solid rgba(226, 232, 240, 0.95)',
    bgcolor: '#f8fafc',
    color: '#475569',
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      fontWeight: 800,
      color: '#64748b',
    },
  }}
/>
    </Paper>
  );

  const renderAssignmentsTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Manager Assignment ({managerAssignments.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: '#1976d2' }}
          >
            New Assignment
          </Button>
        </Box>
      </Box>
      {assignmentsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                <TableCell><strong>Manager</strong></TableCell>
                <TableCell><strong>Level</strong></TableCell>
                <TableCell><strong>Assigned Area</strong></TableCell>
                <TableCell><strong>Assignment Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {managerAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                      No Manager Assignment found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                managerAssignments.map((assignment) => (
              <TableRow key={assignment.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {assignment.managerName || 'Name unavailable'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {assignment.managerEmail || 'Email unavailable'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={assignment.managerLevel === 'SAMBHAG' ? 'Division' : 
                           assignment.managerLevel === 'DISTRICT' ? 'District' : 
                           assignment.managerLevel === 'BLOCK' ? 'Block' : (assignment.managerLevel || 'Unknown')}
                    size="small"
                    sx={{
                      bgcolor: assignment.managerLevel === 'SAMBHAG' ? '#9c27b0' : 
                               assignment.managerLevel === 'DISTRICT' ? '#4caf50' : 
                               assignment.managerLevel === 'BLOCK' ? '#ff9800' : '#757575',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {typeof assignment.locationDisplay === 'string' ? assignment.locationDisplay : 
                     typeof assignment.fullLocationPath === 'string' ? assignment.fullLocationPath : 
                     'Location information not available'}
                  </Typography>
                  {assignment.notes && (
                    <Typography variant="caption" color="textSecondary" display="block">
                      {assignment.notes}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString('en-IN') : 'Date unavailable'}
                  </Typography>
                  <Typography variant="caption" display="block" color="textSecondary">
                    By: {assignment.assignedByName || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={assignment.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: assignment.isActive ? '#4caf50' : '#f44336',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      title="View Users"
                      onClick={() => handleViewManagerUsers(assignment)}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Edit"
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Remove Access"
                      color="error"
                      onClick={() => handleRemoveAssignment(assignment.id, assignment.managerName)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Paper>
  );

 const renderDeathCasesTab = () => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.96)',
      border: '1px solid rgba(226, 232, 240, 0.95)',
      boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
    }}
  >
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        background:
          'linear-gradient(135deg, rgba(254,242,242,0.96) 0%, rgba(255,247,237,0.92) 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
            color: '#fff',
            boxShadow: '0 12px 24px rgba(220, 38, 38, 0.24)',
          }}
        >
          <Assignment sx={{ fontSize: 26 }} />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Death Assistance Cases
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {deathCasesLoading
              ? 'Loading assistance cases...'
              : `${deathCases.length} cases available`}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={() => setDeathCasesListExpanded(!deathCasesListExpanded)}
          sx={actionIconSx('#dc2626', 'rgba(220, 38, 38, 0.12)')}
          title={deathCasesListExpanded ? 'Collapse List' : 'Expand List'}
        >
          {deathCasesListExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDeathCaseDialog(true)}
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1,
            fontWeight: 800,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
            boxShadow: '0 10px 22px rgba(220, 38, 38, 0.24)',
            '&:hover': {
              background: 'linear-gradient(135deg, #b91c1c 0%, #ea580c 100%)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          New Case
        </Button>

        <Button
          variant="outlined"
          startIcon={exportLoading ? <CircularProgress size={18} /> : <Download />}
          onClick={async () => {
            try {
              setExportLoading(true);

              const response = await adminAPI.exportDeathCases();

              if (!response.data) {
                throw new Error('No data received from server');
              }

              const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });

              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;

              const now = new Date();
              const timestamp = now
                .toISOString()
                .slice(0, 19)
                .replace(/[-:]/g, '')
                .replace('T', '_');

              link.setAttribute('download', `death_cases_${timestamp}.xlsx`);

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);

              showSnackbar('Death cases exported successfully!', 'success');
            } catch (error) {
              console.error('Death cases export error:', error);

              let errorMessage = 'Error exporting death cases!';
              if (error.response?.status === 404) {
                errorMessage = 'Export API not available!';
              } else if (error.response?.status === 403) {
                errorMessage = 'No permission to export!';
              }

              showSnackbar(errorMessage, 'error');
            } finally {
              setExportLoading(false);
            }
          }}
          disabled={exportLoading}
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1,
            fontWeight: 800,
            textTransform: 'none',
            borderColor: '#fed7aa',
            color: '#c2410c',
            bgcolor: '#fff',
            '&:hover': {
              borderColor: '#f97316',
              bgcolor: 'rgba(255, 247, 237, 0.9)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {exportLoading ? 'Exporting...' : 'Export'}
        </Button>
      </Box>
    </Box>

    <Collapse in={deathCasesListExpanded} timeout="auto" unmountOnExit>
      <TableContainer
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          bgcolor: '#fff',
        }}
      >
        <Table
          sx={{
            minWidth: 1050,
            '& .MuiTableCell-root': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellSx}>Deceased Name</TableCell>
              <TableCell sx={tableHeaderCellSx}>Employee Code</TableCell>
              <TableCell sx={tableHeaderCellSx}>Department</TableCell>
              <TableCell sx={tableHeaderCellSx}>District</TableCell>
              <TableCell sx={tableHeaderCellSx}>Nominee</TableCell>
              <TableCell sx={tableHeaderCellSx}>Status</TableCell>
              <TableCell sx={tableHeaderCellSx}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {deathCasesLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <CircularProgress size={24} sx={{ color: '#dc2626' }} />
                    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                      Loading death cases...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : deathCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
                    <Typography variant="body1" sx={{ color: '#475569', fontWeight: 800 }}>
                      No Death Case found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                      Create a new assistance case to start tracking nominee and case details.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              deathCases.map((deathCase) => {
                const deathCaseId =
                  deathCase.id || deathCase.caseId || deathCase.deathCaseId;

                const status = deathCase.caseStatus || deathCase.status || 'OPEN';
                const isOpen = String(status).toUpperCase() === 'OPEN';

                return (
                  <TableRow
                    key={deathCaseId || `${deathCase.employeeCode}-${deathCase.deceasedName}`}
                    hover
                    sx={{
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255, 247, 237, 0.78)',
                      },
                    }}
                  >
                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        {deathCase.deceasedName || '-'}
                      </Typography>

                      {deathCase.caseDate && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          {new Date(deathCase.caseDate).toLocaleDateString('hi-IN')}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155' }}>
                        {deathCase.employeeCode || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <BusinessCenter sx={{ fontSize: 16, color: '#64748b' }} />
                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                          {deathCase.department || '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#f97316' }} />
                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                          {deathCase.district || '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box>
                        {deathCase.nominee1Name ? (
                          <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                            {deathCase.nominee1Name}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                            No Nominee
                          </Typography>
                        )}

                        {deathCase.nominee2Name && (
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                            + {deathCase.nominee2Name}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Chip
                          label={isOpen ? 'Open' : 'Closed'}
                          size="small"
                          variant="outlined"
                          sx={{
                            ...getDeathCaseStatusChipSx(status),
                            fontWeight: 900,
                            borderRadius: '10px',
                          }}
                        />

                        {deathCase.isHidden === true && (
                          <Chip
                            label="Hidden"
                            size="small"
                            icon={<Lock fontSize="small" />}
                            variant="outlined"
                            sx={{
                              bgcolor: 'rgba(220, 38, 38, 0.10)',
                              color: '#b91c1c',
                              border: '1px solid rgba(220, 38, 38, 0.20)',
                              fontWeight: 900,
                              borderRadius: '10px',
                              '& .MuiChip-icon': {
                                color: '#b91c1c',
                              },
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedDeathCase(deathCase);
                            setDeathCaseDialog(true);
                          }}
                          title="View Details"
                          sx={actionIconSx('#0284c7', 'rgba(2, 132, 199, 0.12)')}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleEditDeathCase(deathCase)}
                          title="Edit"
                          sx={actionIconSx('#f97316', 'rgba(249, 115, 22, 0.14)')}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => {
                            if (!deathCaseId) {
                              showSnackbar('Death case ID not found!', 'error');
                              return;
                            }

                            handleUpdateDeathCaseStatus(
                              deathCaseId,
                              isOpen ? 'close' : 'open'
                            );
                          }}
                          title={isOpen ? 'Close Case' : 'Open Case'}
                          sx={actionIconSx(
                            isOpen ? '#dc2626' : '#16a34a',
                            isOpen
                              ? 'rgba(220, 38, 38, 0.12)'
                              : 'rgba(22, 163, 74, 0.14)'
                          )}
                        >
                          <Lock fontSize="small" />
                        </IconButton>

                        {deathCase.nominee1QrCode && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(deathCase.nominee1QrCode, '_blank')}
                            title="Nominee 1 QR Code"
                            sx={actionIconSx('#16a34a', 'rgba(22, 163, 74, 0.14)')}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        )}

                        {deathCase.nominee2QrCode && (
                          <IconButton
                            size="small"
                            onClick={() => window.open(deathCase.nominee2QrCode, '_blank')}
                            title="Nominee 2 QR Code"
                            sx={actionIconSx('#15803d', 'rgba(21, 128, 61, 0.14)')}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Collapse>
  </Paper>
);

 const renderPaymentsTab = () => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.96)',
      border: '1px solid rgba(226, 232, 240, 0.95)',
      boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
    }}
  >
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        background:
          'linear-gradient(135deg, rgba(239,246,255,0.96) 0%, rgba(240,253,244,0.92) 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
            color: '#fff',
            boxShadow: '0 12px 24px rgba(37, 99, 235, 0.22)',
          }}
        >
          <Payment sx={{ fontSize: 26 }} />
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Receipts Management
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {receiptsLoading
              ? 'Loading receipt records...'
              : `${totalReceipts} receipt records available`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip
          label={`${receipts.length} visible`}
          size="small"
          variant="outlined"
          sx={{
            bgcolor: 'rgba(37, 99, 235, 0.10)',
            color: '#1d4ed8',
            border: '1px solid rgba(37, 99, 235, 0.18)',
            fontWeight: 900,
            borderRadius: '10px',
          }}
        />

       <Button
  variant="outlined"
  startIcon={exportLoading ? <CircularProgress size={18} /> : <Download />}
  onClick={() => handleExportData('receipts')}
  disabled={exportLoading}
  sx={{
    borderRadius: 3,
    px: 2,
    py: 1,
    fontWeight: 800,
    textTransform: 'none',
    borderColor: '#bfdbfe',
    color: '#1d4ed8',
    bgcolor: '#fff',
    '&:hover': {
      borderColor: '#2563eb',
      bgcolor: 'rgba(239, 246, 255, 0.9)',
      transform: 'translateY(-1px)',
    },
  }}
>
  {exportLoading ? 'Exporting...' : 'Export'}
</Button>
 </Box>
    </Box>

    {receiptsLoading ? (
      <Box
        sx={{
          py: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          bgcolor: '#fff',
        }}
      >
        <CircularProgress size={24} sx={{ color: '#2563eb' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
          Receipts लोड हो रहे हैं...
        </Typography>
      </Box>
    ) : receipts.length === 0 ? (
      <Box
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: '#fff',
        }}
      >
        <Payment sx={{ fontSize: 52, color: '#cbd5e1', mb: 1 }} />

        <Typography variant="h6" sx={{ color: '#475569', fontWeight: 900 }}>
          कोई receipt उपलब्ध नहीं है
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.75, fontWeight: 600 }}>
          जैसे ही users payment proof submit करेंगे, यहाँ list दिखाई देगी।
        </Typography>
      </Box>
    ) : (
      <TableContainer
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          bgcolor: '#fff',
        }}
      >
        <Table
          sx={{
            minWidth: 1050,
            '& .MuiTableCell-root': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellSx}>Reg No</TableCell>
              <TableCell sx={tableHeaderCellSx}>Name</TableCell>
              <TableCell sx={tableHeaderCellSx}>Sambhag</TableCell>
              <TableCell sx={tableHeaderCellSx}>District</TableCell>
              <TableCell sx={tableHeaderCellSx}>Block</TableCell>
              <TableCell sx={tableHeaderCellSx}>Department</TableCell>
              <TableCell sx={tableHeaderCellSx}>Payment Date</TableCell>
              <TableCell sx={tableHeaderCellSx}>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {receipts.map((receipt, index) => (
              <TableRow
                key={`${receipt.regNo || 'receipt'}-${index}`}
                hover
                sx={{
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    bgcolor: 'rgba(239, 246, 255, 0.72)',
                  },
                }}
              >
                <TableCell sx={tableBodyCellSx}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,
                      color: '#0f172a',
                      fontSize: '0.82rem',
                    }}
                  >
                    {receipt.regNo ?? '-'}
                  </Typography>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    {receipt.name ?? '-'}
                  </Typography>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#2563eb' }} />
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                      {receipt.sambhag ?? '-'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                    {receipt.district ?? '-'}
                  </Typography>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                    {receipt.block ?? '-'}
                  </Typography>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <BusinessCenter sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                      {receipt.department ?? '-'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 800 }}>
                    {formatDate(receipt.paymentDate)}
                  </Typography>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Chip
                    label={`₹${receipt.amount ?? '-'}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      bgcolor: 'rgba(22, 163, 74, 0.12)',
                      color: '#15803d',
                      border: '1px solid rgba(22, 163, 74, 0.20)',
                      fontWeight: 900,
                      borderRadius: '10px',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Paper>
);
     

  const renderQueriesTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Queries Management ({queries.length})
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Download />}
          onClick={() => handleExportData('queries')}
        >
          Export
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fff3e0' }}>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query.id} hover>
                <TableCell>{query.userName}</TableCell>
                <TableCell>{query.subject}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {query.message}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(query.status)}
                    size="small"
                    sx={{ 
                      bgcolor: getStatusColor(query.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>{new Date(query.createdDate).toLocaleDateString('hi-IN')}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleUpdateQueryStatus(query.id, 'approved')}
                      title="Resolve"
                      color="success"
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleUpdateQueryStatus(query.id, 'rejected')}
                      title="Reject"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleUpdateQueryStatus(query.id, 'pending')}
                      title="Mark Pending"
                      color="warning"
                    >
                      <Assignment fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
const quickActionButtonSx = (gradient, shadowColor) => ({
  py: 1.8,
  px: 2,
  minHeight: 58,
  borderRadius: 3,
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 800,
  fontSize: '0.92rem',
  color: '#fff',
  background: gradient,
  boxShadow: `0 12px 26px ${shadowColor}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  '& .MuiButton-startIcon': {
    mr: 1.2,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-80%',
    width: '55%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
    transform: 'skewX(-20deg)',
    transition: 'all 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 18px 36px ${shadowColor}`,
    filter: 'brightness(1.03)',
  },
  '&:hover::before': {
    left: '130%',
  },
  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.75)',
    opacity: 0.75,
  },
});

const tabItemSx = {
  textTransform: 'none',
  fontWeight: 800,
  fontSize: '0.92rem',
  minHeight: 54,
  borderRadius: '16px',
  px: 2.25,
  mx: 0.4,
  color: '#475569',
  transition: 'all 0.25s ease',
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
  '&.Mui-selected': {
    color: '#fff',
    background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
    boxShadow: '0 12px 24px rgba(220, 38, 38, 0.28)',
  },
};
const tableHeaderCellSx = {
  color: '#334155',
  fontWeight: 900,
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  borderBottom: '1px solid rgba(203, 213, 225, 0.9)',
  py: 1.8,
  bgcolor: 'rgba(248, 250, 252, 0.95)',
};

const tableBodyCellSx = {
  borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
  py: 1.7,
  color: '#334155',
};

const actionIconSx = (color, bg) => ({
  width: 34,
  height: 34,
  borderRadius: '12px',
  bgcolor: bg,
  color,
  border: `1px solid ${bg}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    bgcolor: bg,
    color,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 18px ${bg}`,
  },
});

const getRoleChipSx = (role) => {
  if (role === 'ROLE_ADMIN') {
    return {
      bgcolor: 'rgba(220, 38, 38, 0.10)',
      color: '#b91c1c',
      border: '1px solid rgba(220, 38, 38, 0.18)',
    };
  }

  if (role && role.includes('MANAGER')) {
    return {
      bgcolor: 'rgba(249, 115, 22, 0.12)',
      color: '#c2410c',
      border: '1px solid rgba(249, 115, 22, 0.20)',
    };
  }

  return {
    bgcolor: 'rgba(37, 99, 235, 0.10)',
    color: '#1d4ed8',
    border: '1px solid rgba(37, 99, 235, 0.18)',
  };
};

const getStatusChipSx = (status) => {
  const normalized = String(status || '').toUpperCase();

  if (normalized === 'ACTIVE') {
    return {
      bgcolor: 'rgba(22, 163, 74, 0.12)',
      color: '#15803d',
      border: '1px solid rgba(22, 163, 74, 0.20)',
    };
  }

  if (normalized === 'BLOCKED') {
    return {
      bgcolor: 'rgba(220, 38, 38, 0.10)',
      color: '#b91c1c',
      border: '1px solid rgba(220, 38, 38, 0.20)',
    };
  }

  return {
    bgcolor: 'rgba(100, 116, 139, 0.10)',
    color: '#475569',
    border: '1px solid rgba(100, 116, 139, 0.20)',
  };
};

const getDeathCaseStatusChipSx = (status) => {
  const normalized = String(status || '').toUpperCase();

  if (normalized === 'OPEN') {
    return {
      bgcolor: 'rgba(22, 163, 74, 0.12)',
      color: '#15803d',
      border: '1px solid rgba(22, 163, 74, 0.20)',
    };
  }

  if (normalized === 'CLOSED') {
    return {
      bgcolor: 'rgba(220, 38, 38, 0.10)',
      color: '#b91c1c',
      border: '1px solid rgba(220, 38, 38, 0.20)',
    };
  }

  return {
    bgcolor: 'rgba(100, 116, 139, 0.10)',
    color: '#475569',
    border: '1px solid rgba(100, 116, 139, 0.20)',
  };
};
  return (
    <Layout>
      <Box
  sx={{
    minHeight: '100vh',
    background: `
      radial-gradient(circle at 8% 8%, rgba(220, 38, 38, 0.16) 0%, transparent 30%),
      radial-gradient(circle at 92% 12%, rgba(249, 115, 22, 0.18) 0%, transparent 32%),
      radial-gradient(circle at 50% 95%, rgba(30, 58, 138, 0.10) 0%, transparent 34%),
      linear-gradient(135deg, #fff7ed 0%, #fef2f2 42%, #f8fafc 100%)
    `,
    py: { xs: 2.5, md: 4 },
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
      backgroundSize: '42px 42px',
      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent 75%)',
      pointerEvents: 'none',
    },
    '& *': {
      fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif !important',
    },
  }}
>
     <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Admin Header */}
        {/* Admin Header */}
<Paper
  elevation={0}
  sx={{
    mb: 4,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
    background:
      'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,247,237,0.94) 48%, rgba(254,242,242,0.96) 100%)',
    backdropFilter: 'blur(22px)',
    border: '1px solid rgba(255,255,255,0.75)',
    boxShadow: '0 24px 70px rgba(127, 29, 29, 0.14)',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: '50%',
      right: -80,
      top: -120,
      background: 'radial-gradient(circle, rgba(249, 115, 22, 0.24), transparent 68%)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: '50%',
      left: -90,
      bottom: -120,
      background: 'radial-gradient(circle, rgba(220, 38, 38, 0.16), transparent 68%)',
    },
  }}
>
  <Box sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
            color: '#fff',
            boxShadow: '0 18px 34px rgba(220, 38, 38, 0.35)',
          }}
        >
          <AdminPanelSettings sx={{ fontSize: 40 }} />
        </Box>

        <Box>
          <Chip
            label="Administrative Control Center"
            size="small"
            sx={{
              mb: 1,
              fontWeight: 800,
              color: '#b91c1c',
              bgcolor: 'rgba(220, 38, 38, 0.10)',
              border: '1px solid rgba(220, 38, 38, 0.16)',
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 45%, #f97316 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
              mb: 0.75,
            }}
          >
            Admin Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontWeight: 600,
              maxWidth: 650,
            }}
          >
            Manage users, assistance cases, receipts, reports, audit logs and support tickets from one secure dashboard.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1,
          pl: 1.5,
          borderRadius: 4,
          bgcolor: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(148, 163, 184, 0.20)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 900 }}>
            {currentUser?.name || 'Admin'}
          </Typography>
        </Box>

        <Chip
          label={currentUser?.role === 'ROLE_SUPERADMIN' ? 'Super Admin' : 'Admin'}
          sx={{
            fontWeight: 900,
            color: '#fff',
            bgcolor: '#dc2626',
            height: 36,
            px: 0.5,
            boxShadow: '0 10px 20px rgba(220, 38, 38, 0.24)',
          }}
        />
      </Box>
    </Box>
  </Box>
</Paper>


          {/* Quick Action Panel */}
        {/* Quick Action Panel */}
<Paper
  elevation={0}
  sx={{
    borderRadius: 5,
    mb: 4,
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.76)',
    boxShadow: '0 22px 60px rgba(15, 23, 42, 0.10)',
  }}
>
  <Box
    sx={{
      p: { xs: 2.5, md: 3 },
      background:
        'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.88) 100%)',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          Quick Actions
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Common admin exports and controls
        </Typography>
      </Box>

      <Chip
        size="small"
        label="Admin Tools"
        sx={{
          fontWeight: 800,
          color: '#b91c1c',
          bgcolor: 'rgba(220, 38, 38, 0.10)',
          border: '1px solid rgba(220, 38, 38, 0.16)',
        }}
      />
    </Box>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Settings />}
          onClick={openSettingsDialog}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            'rgba(234, 88, 12, 0.24)'
          )}
        >
          Settings
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Article />}
          onClick={openContentDialog}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            'rgba(124, 58, 237, 0.24)'
          )}
        >
          Content
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          onClick={() => setExportDialog(true)}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            'rgba(37, 99, 235, 0.22)'
          )}
        >
          User Export
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          onClick={() => openDashboardExportDialog('sahyog')}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #059669 0%, #047857 100%)',
            'rgba(5, 150, 105, 0.22)'
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
          onClick={() => openDashboardExportDialog('asahyog')}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
            'rgba(147, 51, 234, 0.22)'
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
          onClick={handleExportZeroUtr}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
            'rgba(219, 39, 119, 0.22)'
          )}
        >
          Export Zero UTR
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          onClick={() => openDashboardExportDialog('pending-profiles')}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            'rgba(249, 115, 22, 0.22)'
          )}
        >
          Export Pending Profiles
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={exportLoading ? <CircularProgress size={18} color="inherit" /> : <Download />}
          onClick={handleSendInsuranceInquiryEmail}
          disabled={exportLoading}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
            'rgba(168, 85, 247, 0.22)'
          )}
        >
          {exportLoading ? 'Sending...' : 'Mail Insurance Excel'}
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<DeleteForever />}
          onClick={() => setDeleteRequestsOpen(true)}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            'rgba(220, 38, 38, 0.24)'
          )}
        >
          Delete Requests
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          onClick={() => openDateExportDialog('joining')}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
            'rgba(29, 78, 216, 0.22)'
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
          onClick={() => openDateExportDialog('retirement')}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #795548 0%, #4e342e 100%)',
            'rgba(121, 85, 72, 0.22)'
          )}
        >
          सेवानिवृत्ति तिथि Export
        </Button>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          onClick={handleExportNoLoginThreeMonths}
          disabled={exportLoading}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            'rgba(239, 68, 68, 0.22)'
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
          onClick={handleExportNoSahyogTwoMonths}
          disabled={exportLoading}
          sx={quickActionButtonSx(
            'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
            'rgba(244, 63, 94, 0.22)'
          )}
        >
          2 महीने से Sahyog नहीं
        </Button>
      </Grid>

      {['ROLE_ADMIN', 'ROLE_SUPERADMIN'].includes(currentUser?.role) && (
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Payment />}
            onClick={openManualSahyogMoveDialog}
            sx={quickActionButtonSx(
              'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              'rgba(22, 163, 74, 0.22)'
            )}
          >
            Manual Asahyog → Sahyog
          </Button>
        </Grid>
      )}
    </Grid>
  </Box>
</Paper>

          {/* Main Management Tabs */}
         {/* Main Management Tabs */}
<Paper
  elevation={0}
  sx={{
    borderRadius: 5,
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.90)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.78)',
    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.12)',
  }}
>
  <Box
    sx={{
      p: 1.5,
      bgcolor: 'rgba(248,250,252,0.82)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
    }}
  >
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      variant="scrollable"
      scrollButtons="auto"
      TabIndicatorProps={{ sx: { display: 'none' } }}
      sx={{
        minHeight: 58,
        '& .MuiTabs-flexContainer': {
          gap: 0.5,
          alignItems: 'center',
        },
      }}
    >
      <Tab
        icon={<People />}
        label="User Management"
        iconPosition="start"
        sx={tabItemSx}
      />

      <Tab
        icon={<Assignment />}
        label="Death Assistance Cases"
        iconPosition="start"
        sx={tabItemSx}
      />

      <Tab
        icon={<Assignment />}
        label="Pool"
        iconPosition="start"
        sx={tabItemSx}
      />

      <Tab
        icon={<Payment />}
        iconPosition="start"
        label="Receipts"
        sx={tabItemSx}
      />

      <Tab
        icon={<Assignment />}
        iconPosition="start"
        label="Audit Logs"
        sx={tabItemSx}
      />

      <Tab
        icon={<Chat />}
        iconPosition="start"
        label="Ticket System"
        sx={tabItemSx}
      />
    </Tabs>
  </Box>

  <Box sx={{ p: { xs: 2, md: 3 } }}>
              {activeTab === 0 && renderUsersTab()}
              {activeTab === 1 && renderDeathCasesTab()}
               {activeTab === 2 && renderPoolTab()}
              {activeTab === 3 && renderPaymentsTab()}
             {activeTab === 4 && renderLogsTab()}
             {activeTab === 5 && (
  <TicketSystemTab
    mode="admin"
    currentUser={currentUser}
  />
)}
              {/* {activeTab === 3 && renderQueriesTab()}
              {activeTab === 4 && renderAssignmentsTab()}
              {activeTab === 5 && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>Role Management</Typography>
                  <Typography>
                    Here you can manage various roles: Admin, Division Manager, District Manager, Block Manager.
                    Each role has its own rights and responsibilities.
                  </Typography>
                </Alert>
              )} */}
            </Box>
          </Paper>
        </Container>
       <Dialog
  open={dateExportDialogOpen}
  onClose={() => setDateExportDialogOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Download />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          {dateExportType === 'joining'
            ? 'नियुक्ति तिथि Export'
            : 'सेवानिवृत्ति तिथि Export'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Export users by selected date range
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={() => setDateExportDialogOpen(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={dateExportFromDate}
            onChange={(e) => setDateExportFromDate(e.target.value)}
            sx={premiumTextFieldSx}
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
            sx={premiumTextFieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.14)',
              '& .MuiAlert-icon': {
                color: '#2563eb',
              },
            }}
          >
            Date blank रखने पर सभी records export होंगे. Date range देने पर केवल उसी range के users export होंगे.
          </Alert>
        </Grid>
      </Grid>
    </Paper>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={() => setDateExportDialogOpen(false)}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleDateRelatedExport}
      disabled={exportLoading}
      startIcon={exportLoading ? <CircularProgress size={18} color="inherit" /> : <Download />}
      sx={premiumPrimaryButtonSx}
    >
      {exportLoading ? 'Exporting...' : 'Export'}
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={manualSahyogMoveOpen}
  onClose={() => setManualSahyogMoveOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle
    sx={{
      ...premiumDialogTitleSx,
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Payment />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Manual Move: Asahyog → Sahyog
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Manually add contribution and move member to Sahyog
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={() => setManualSahyogMoveOpen(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="User ID / Registration Number"
            value={manualSahyogMoveForm.userId}
            onChange={(e) =>
              setManualSahyogMoveForm((prev) => ({
                ...prev,
                userId: e.target.value,
              }))
            }
            placeholder="Example: PMUMS203001"
            sx={premiumTextFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Death Case / Beneficiary</InputLabel>
            <Select
              value={manualSahyogMoveForm.deathCaseId}
              label="Death Case / Beneficiary"
              onChange={(e) =>
                setManualSahyogMoveForm((prev) => ({
                  ...prev,
                  deathCaseId: e.target.value,
                }))
              }
              sx={premiumSelectSx}
            >
              {(deathCases || []).map((deathCase) => (
                <MenuItem key={deathCase.id} value={deathCase.id}>
                  {deathCase.deceasedName} - {deathCase.employeeCode || 'N/A'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={manualSahyogMoveForm.amount}
            onChange={(e) =>
              setManualSahyogMoveForm((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            sx={premiumTextFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  ₹
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Payment Date"
            InputLabelProps={{ shrink: true }}
            value={manualSahyogMoveForm.paymentDate}
            onChange={(e) =>
              setManualSahyogMoveForm((prev) => ({
                ...prev,
                paymentDate: e.target.value,
              }))
            }
            sx={premiumTextFieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reference Name"
            value={manualSahyogMoveForm.referenceName}
            onChange={(e) =>
              setManualSahyogMoveForm((prev) => ({
                ...prev,
                referenceName: e.target.value,
              }))
            }
            placeholder="Manual Admin Entry"
            sx={premiumTextFieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="UTR Number"
            value={manualSahyogMoveForm.utrNumber}
            onChange={(e) =>
              setManualSahyogMoveForm((prev) => ({
                ...prev,
                utrNumber: e.target.value,
              }))
            }
            placeholder="Optional. Auto-generated if blank."
            sx={premiumTextFieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Remarks"
            value={manualSahyogMoveForm.remarks}
            onChange={(e) =>
              setManualSahyogMoveForm((prev) => ({
                ...prev,
                remarks: e.target.value,
              }))
            }
            placeholder="Reason for manual migration"
            sx={premiumTextFieldSx}
          />
        </Grid>

        <Grid item xs={12}>
          <Alert
            severity="success"
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.14)',
              '& .MuiAlert-icon': {
                color: '#16a34a',
              },
            }}
          >
            This will create/update the user contribution and move the member from Asahyog to Sahyog for the selected death case.
          </Alert>
        </Grid>
      </Grid>
    </Paper>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={() => setManualSahyogMoveOpen(false)}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleManualSahyogMove}
      disabled={manualSahyogMoveLoading}
      startIcon={manualSahyogMoveLoading ? <CircularProgress size={18} color="inherit" /> : <Payment />}
      sx={{
        ...premiumPrimaryButtonSx,
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        boxShadow: '0 10px 22px rgba(22, 163, 74, 0.24)',
        '&:hover': {
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {manualSahyogMoveLoading ? 'Saving...' : 'Move to Sahyog'}
    </Button>
  </DialogActions>
</Dialog>
        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Dialog
  open={contentDialogOpen}
  onClose={() => setContentDialogOpen(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Article />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Home Content Settings
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Manage notice and statistics HTML content
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={() => setContentDialogOpen(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    {contentLoading ? (
      <Box
        sx={{
          py: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <CircularProgress size={24} sx={{ color: '#dc2626' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
          Loading content settings...
        </Typography>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            bgcolor: '#fff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
                color: '#fff',
                boxShadow: '0 10px 20px rgba(220, 38, 38, 0.18)',
                flexShrink: 0,
              }}
            >
              <Article fontSize="small" />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                }}
              >
                Home / Death Case Notice Content
              </Typography>

              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                This content will be shown on Home page and Death Case page.
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={8}
            label="Home Notice HTML"
            value={homeDisplayContent.homeNoticeHtml}
            onChange={(e) =>
              handleContentFieldChange('homeNoticeHtml', e.target.value)
            }
            placeholder="Enter HTML content for home/death case notice"
            sx={premiumTextFieldSx}
          />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            bgcolor: '#fff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#fff',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)',
                flexShrink: 0,
              }}
            >
              <InfoOutlined fontSize="small" />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                }}
              >
                Statistics Content
              </Typography>

              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                This content will be shown on the left side of the Statistics section.
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={14}
            label="Statistics HTML"
            value={homeDisplayContent.statisticsContentHtml}
            onChange={(e) =>
              handleContentFieldChange('statisticsContentHtml', e.target.value)
            }
            placeholder="Enter HTML content for statistics section"
            sx={premiumTextFieldSx}
          />
        </Paper>

        <Alert
          severity="warning"
          sx={{
            borderRadius: 3,
            bgcolor: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.16)',
            '& .MuiAlert-icon': {
              color: '#f97316',
            },
          }}
        >
          Please enter valid and safe HTML only. This content will be displayed on the public pages.
        </Alert>
      </Box>
    )}
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={() => setContentDialogOpen(false)}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSaveContentSettings}
      disabled={contentSaving || contentLoading}
      startIcon={contentSaving ? <CircularProgress size={18} color="inherit" /> : <Save />}
      sx={premiumPrimaryButtonSx}
    >
      {contentSaving ? 'Saving...' : 'Save Content'}
    </Button>
  </DialogActions>
</Dialog>
        <Dialog
  open={showManualCreateSuccessPopup}
  onClose={() => setShowManualCreateSuccessPopup(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
    },
  }}
>
  <DialogTitle
    sx={{
      bgcolor: '#4caf50',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    }}
  >
    ✅ यूज़र सफलतापूर्वक बनाया गया
    <IconButton
      onClick={() => setShowManualCreateSuccessPopup(false)}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'white',
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{ pt: 3, textAlign: 'center' }}>
    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
      प्रिय {manualCreateSuccessData?.name || 'शिक्षक'} जी,
    </Typography>

    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
      आपका यूज़र अकाउंट सफलतापूर्वक बना दिया गया है।
    </Typography>

    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
      पंजीकरण संख्या:
    </Typography>

    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
      {manualCreateSuccessData?.registrationNumber}
    </Typography>

    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
      आपका पासवर्ड: आपकी जन्मतिथि ही आपका पासवर्ड है।
    </Typography>

    <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
      कृपया लॉगिन करते समय अपनी जन्मतिथि का उपयोग करें।
    </Typography>

    <Box
      sx={{
        mt: 2,
        p: 2,
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        textAlign: 'left',
      }}
    >
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <strong>मोबाइल नंबर:</strong> {manualCreateSuccessData?.mobileNumber || '-'}
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <strong>ईमेल:</strong> {manualCreateSuccessData?.email || '-'}
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <strong>विभाग:</strong> {manualCreateSuccessData?.department || '-'}
      </Typography>
      <Typography variant="body2">
        <strong>स्कूल/ऑफिस:</strong> {manualCreateSuccessData?.schoolOfficeName || '-'}
      </Typography>
    </Box>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
   <Button
  variant="contained"
  startIcon={<Badge />}
  onClick={() => {
    setShowManualCreateSuccessPopup(false);
    setTimeout(() => {
      setManualMembershipCardOpen(true);
    }, 200);
  }}
  sx={{
    bgcolor: '#1E3A8A',
    '&:hover': { bgcolor: '#0d2c6b' },
    minWidth: 220,
    fontWeight: 700,
    borderRadius: 2,
  }}
>
  ID Card देखें / डाउनलोड करें
</Button>
    <Button
      variant="contained"
      onClick={() => setShowManualCreateSuccessPopup(false)}
      sx={{
        bgcolor: '#1976d2',
        '&:hover': { bgcolor: '#1565c0' },
        minWidth: 140,
      }}
    >
      ठीक है
    </Button>
  </DialogActions>
</Dialog>
<MembershipCardPopup
  open={manualMembershipCardOpen}
  onClose={() => setManualMembershipCardOpen(false)}
  memberData={manualCreateSuccessData}
/>
<MembershipCardPopup
  open={userMembershipCardOpen}
  onClose={() => {
    setUserMembershipCardOpen(false);
    setUserMembershipCardData(null);
  }}
  memberData={userMembershipCardData}
/>
        <Dialog
  open={manualCreateOpen}
  onClose={closeManualCreateDialog}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      ...premiumDialogPaperSx,
      maxHeight: '92vh',
    },
  }}
>
  <DialogTitle
  sx={{
    ...premiumDialogTitleSx,
    background: 'linear-gradient(135deg, #16a34a 0%, #2563eb 55%, #7c3aed 100%)',
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
    <PersonAdd />
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
        Manual Create User
      </Typography>

      <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
        Create old/manual member entry with department, nominee and password details
      </Typography>
    </Box>
  </Box>

  <IconButton
    onClick={closeManualCreateDialog}
    disabled={manualCreateLoading}
    sx={{
      color: '#fff',
      bgcolor: 'rgba(255,255,255,0.14)',
      '&:hover': {
        bgcolor: 'rgba(255,255,255,0.22)',
      },
      '&.Mui-disabled': {
        color: 'rgba(255,255,255,0.55)',
      },
    }}
  >
    <Close />
  </IconButton>
</DialogTitle>
<DialogContent
  dividers
  sx={{
    ...premiumDialogContentSx,
    p: { xs: 2, md: 3 },
  }}
>
 <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  }}
>
    {/* 1. Basic Information */}
    {manualCreateSectionHeader(
  1,
  'Personal Information',
  <People fontSize="small" />,
  'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
)}

    <Grid container spacing={2.5} sx={{ mb: 4 }}>
     <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    
    label="पूरा नाम *"
    value={manualCreateForm.fullName}
    onChange={(e) => setManualCreateForm((p) => ({ ...p, fullName: e.target.value }))}
  />
</Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="पिता का नाम *"
          value={manualCreateForm.fatherName}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, fatherName: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
  <FormControl fullWidth size="medium">
    <InputLabel shrink>लिंग *</InputLabel>
    <Select
      value={manualCreateForm.gender || ''}
      label="लिंग *"
      displayEmpty
      onChange={(e) =>
        setManualCreateForm((p) => ({ ...p, gender: e.target.value }))
      }
      sx={{
        minHeight: 56,
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 320,
            minWidth: 260,
          },
        },
      }}
    >
      <MenuItem value="">लिंग चुनें...</MenuItem>
      <MenuItem value="male">पुरुष (Male)</MenuItem>
      <MenuItem value="female">महिला (Female)</MenuItem>
      <MenuItem value="other">अन्य (Other)</MenuItem>
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} md={6}>
  <FormControl fullWidth size="medium">
    <InputLabel shrink>वैवाहिक स्थिति *</InputLabel>
    <Select
      value={manualCreateForm.maritalStatus || ''}
      label="वैवाहिक स्थिति *"
      displayEmpty
      onChange={(e) =>
        setManualCreateForm((p) => ({ ...p, maritalStatus: e.target.value }))
      }
      sx={{
        minHeight: 56,
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 320,
            minWidth: 320,
          },
        },
      }}
    >
      <MenuItem value="">वैवाहिक स्थिति चुनें...</MenuItem>
      <MenuItem value="single">अविवाहित (Single)</MenuItem>
      <MenuItem value="married">विवाहित (Married)</MenuItem>
      <MenuItem value="divorced">तलाकशुदा (Divorced)</MenuItem>
      <MenuItem value="widowed">विधवा/विधुर (Widowed)</MenuItem>
    </Select>
  </FormControl>
</Grid>

      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          type="date"
          label="जन्मतिथि *"
          InputLabelProps={{ shrink: true }}
          value={manualCreateForm.dateOfBirth}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <TextField fullWidth label="Country Code" value="+91" disabled />
      </Grid>

      <Grid item xs={12} md={4}>
  <TextField
    fullWidth
    label="मोबाइल नंबर *"
    value={manualCreateForm.mobileNumber}
    onChange={(e) =>
      setManualCreateForm((p) => ({
        ...p,
        mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
      }))
    }
    error={
      manualCreateForm.mobileNumber.length > 0 &&
      manualCreateForm.mobileNumber.length !== 10
    }
    helperText={
      manualCreateForm.mobileNumber.length > 0 &&
      manualCreateForm.mobileNumber.length !== 10
        ? 'मोबाइल नंबर 10 अंकों का होना चाहिए'
        : ''
    }
    inputProps={{
      maxLength: 10,
      inputMode: 'numeric',
      pattern: '[0-9]*',
    }}
  />
</Grid>

<Grid item xs={12} md={4}>
  <TextField
    fullWidth
    label="मोबाइल नंबर की पुष्टि *"
    value={manualCreateForm.confirmMobileNumber}
    onChange={(e) =>
      setManualCreateForm((p) => ({
        ...p,
        confirmMobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
      }))
    }
    error={
      (manualCreateForm.confirmMobileNumber.length > 0 &&
        manualCreateForm.confirmMobileNumber.length !== 10) ||
      (manualCreateForm.confirmMobileNumber.length === 10 &&
        manualCreateForm.mobileNumber !== manualCreateForm.confirmMobileNumber)
    }
    helperText={
      manualCreateForm.confirmMobileNumber.length > 0 &&
      manualCreateForm.confirmMobileNumber.length !== 10
        ? 'मोबाइल नंबर 10 अंकों का होना चाहिए'
        : manualCreateForm.confirmMobileNumber.length === 10 &&
          manualCreateForm.mobileNumber !== manualCreateForm.confirmMobileNumber
        ? 'मोबाइल नंबर मेल नहीं खाता'
        : ''
    }
    inputProps={{
      maxLength: 10,
      inputMode: 'numeric',
      pattern: '[0-9]*',
    }}
  />
</Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="ईमेल आईडी *"
          value={manualCreateForm.email}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, email: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="ईमेल की पुष्टि करें *"
          value={manualCreateForm.confirmEmail}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, confirmEmail: e.target.value }))}
        />
      </Grid>
    </Grid>

    {/* 2. Address Details */}
   {manualCreateSectionHeader(
  2,
  'Contact & Address Details',
  <Phone fontSize="small" />,
  'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)'
)}

    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="राज्य *"
          value={manualCreateForm.departmentState || locationHierarchy?.states?.[0]?.name || ''}
          disabled
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel shrink>संभाग *</InputLabel>
          <Select value={manualSelectedSambhag} onChange={handleManualSambhagChange} displayEmpty>
            <MenuItem value="">संभाग चुनें...</MenuItem>
            {manualAvailableSambhags.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel shrink>जिला *</InputLabel>
          <Select
            value={manualSelectedDistrict}
            onChange={handleManualDistrictChange}
            displayEmpty
            disabled={!manualSelectedSambhag}
          >
            <MenuItem value="">जिला चुनें...</MenuItem>
            {manualAvailableDistricts.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel shrink>ब्लॉक *</InputLabel>
          <Select
            value={manualSelectedBlock}
            onChange={handleManualBlockChange}
            displayEmpty
            disabled={!manualSelectedDistrict}
          >
            <MenuItem value="">ब्लॉक चुनें...</MenuItem>
            {manualAvailableBlocks.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={5}>
        <TextField
          fullWidth
          label="पूरा पता *"
          value={manualCreateForm.homeAddress}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, homeAddress: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={3}>
  <TextField
    fullWidth
    label="पिन कोड *"
    value={manualCreateForm.pincode}
    onChange={(e) =>
      setManualCreateForm((p) => ({
        ...p,
        pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
      }))
    }
    error={
      manualCreateForm.pincode.length > 0 &&
      manualCreateForm.pincode.length !== 6
    }
    helperText={
      manualCreateForm.pincode.length > 0 &&
      manualCreateForm.pincode.length !== 6
        ? 'पिन कोड 6 अंकों का होना चाहिए'
        : ''
    }
    inputProps={{
      maxLength: 6,
      inputMode: 'numeric',
      pattern: '[0-9]*',
    }}
  />
</Grid>
    </Grid>

    {/* 3. Professional Details */}
  {manualCreateSectionHeader(
  3,
  'Department Information',
  <BusinessCenter fontSize="small" />,
  'linear-gradient(135deg, #f97316 0%, #dc2626 100%)'
)}

    <Grid container spacing={2.5} sx={{ mb: 4 }}>
     <Grid item xs={12} md={6}>
  <FormControl fullWidth size="medium">
    <InputLabel shrink>विभाग का नाम *</InputLabel>
    <Select
      value={manualCreateForm.department || ''}
      label="विभाग का नाम *"
      displayEmpty
      onChange={(e) =>
        setManualCreateForm((p) => ({ ...p, department: e.target.value }))
      }
      sx={{
        minHeight: 56,
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 320,
            minWidth: 320,
          },
        },
      }}
    >
      <MenuItem value="">विभाग चुनें...</MenuItem>
      <MenuItem value="शिक्षा विभाग">शिक्षा विभाग</MenuItem>
      <MenuItem value="आदिम जाति कल्याण विभाग">आदिम जाति कल्याण विभाग</MenuItem>
    </Select>
  </FormControl>
</Grid>

      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          label="पदस्थ स्कूल/कार्यालय का नाम *"
          value={manualCreateForm.schoolOfficeName}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, schoolOfficeName: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="विभाग आईडी (Department Unique ID) *"
          value={manualCreateForm.departmentUniqueId}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, departmentUniqueId: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="संकुल का नाम *"
          value={manualCreateForm.sankulName}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, sankulName: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          type="date"
          label="नियुक्ति वर्ष *"
          InputLabelProps={{ shrink: true }}
          value={manualCreateForm.joiningDate}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, joiningDate: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          type="date"
          label="सेवानिवृत्ति की तिथि *"
          InputLabelProps={{ shrink: true }}
          helperText={ 'जन्मतिथि + 62 वर्ष से स्वतः भरा जाएगा'}
          value={manualCreateForm.retirementDate}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, retirementDate: e.target.value }))}
        />
      </Grid>
    </Grid>

    {/* 4. Nominee Details */}
   {manualCreateSectionHeader(
  4,
  'Location Details',
  <LocationOn fontSize="small" />,
  'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)'
)}

    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a237e' }}>
          पहला नामांकित (First Nominee)
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="नामांकित का नाम *"
          value={manualCreateForm.nominee1Name}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, nominee1Name: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="नामांकित का संबंध *"
          value={manualCreateForm.nominee1Relation}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, nominee1Relation: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} sx={{ pt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a237e' }}>
          दूसरा नामांकित (Second Nominee)
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="नामांकित का नाम *"
          value={manualCreateForm.nominee2Name}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, nominee2Name: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="नामांकित का संबंध *"
          value={manualCreateForm.nominee2Relation}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, nominee2Relation: e.target.value }))}
        />
      </Grid>
    </Grid>

    {/* 5. Manual Entry Details */}
    {manualCreateSectionHeader(
  5,
  'Nominee Information',
  <People fontSize="small" />,
  'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
)}

    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          type="date"
          label="Old Registration Date"
          InputLabelProps={{ shrink: true }}
          value={manualCreateForm.registrationDateOverride}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, registrationDateOverride: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={5}>
        <TextField
          fullWidth
          label="Support Entry Reference"
          value={manualCreateForm.supportEntryReference}
          onChange={(e) => setManualCreateForm((p) => ({ ...p, supportEntryReference: e.target.value }))}
        />
      </Grid>

      <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={manualCreateForm.createIfMatchFound}
              onChange={(e) =>
                setManualCreateForm((p) => ({ ...p, createIfMatchFound: e.target.checked }))
              }
            />
          }
          label="Create anyway"
        />
      </Grid>

      {manualCreateMatch?.matchFound && (
        <Grid item xs={12}>
          <Alert
            severity="warning"
            action={
              <Button
                color="warning"
                variant="contained"
                size="small"
                onClick={handleFillMatchedUserData}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Fill Existing Data
              </Button>
            }
              sx={{
    borderRadius: 3,
    bgcolor: 'rgba(249, 115, 22, 0.08)',
    border: '1px solid rgba(249, 115, 22, 0.16)',
    '& .MuiAlert-icon': {
      color: '#f97316',
    },}}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Existing user match found
            </Typography>
            <Typography variant="body2">{manualCreateMatch.message}</Typography>
            <Typography variant="caption" display="block">
              Existing User ID: {manualCreateMatch.existingUserId}
            </Typography>
            <Typography variant="caption" display="block">
              Matched By: {manualCreateMatch.matchedBy}
            </Typography>
          </Alert>
        </Grid>
      )}
    </Grid>

    {/* 6. Password */}
    {manualCreateSectionHeader(
  6,
  'Password',
  <LockReset fontSize="small" />,
  'linear-gradient(135deg, #334155 0%, #7c3aed 100%)'
)}

    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Password *"
          disabled
          type="password"
          value={manualCreateForm.password}
          InputProps={{ readOnly: true }}
          helperText="आपकी जन्मतिथि ही आपका पासवर्ड है"
        />
      </Grid>
    </Grid>
  </Box>
</DialogContent>

<DialogActions
  sx={{
    ...premiumDialogActionsSx,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 1.5,
  }}
>
  <Button
    variant="outlined"
    onClick={closeManualCreateDialog}
    disabled={manualCreateLoading || manualCheckLoading}
    sx={premiumCancelButtonSx}
  >
    Cancel
  </Button>

  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
    <Button
      variant="outlined"
      onClick={handleCheckManualCreateMatch}
      disabled={manualCheckLoading || manualCreateLoading}
      startIcon={
        manualCheckLoading ? (
          <CircularProgress size={18} />
        ) : (
          <Search />
        )
      }
      sx={{
        borderRadius: 3,
        px: 2.5,
        py: 1,
        fontWeight: 800,
        textTransform: 'none',
        color: '#2563eb',
        borderColor: 'rgba(37, 99, 235, 0.30)',
        bgcolor: '#fff',
        '&:hover': {
          borderColor: '#2563eb',
          bgcolor: 'rgba(239, 246, 255, 0.9)',
        },
      }}
    >
      {manualCheckLoading ? 'Checking...' : 'Check Old Entry'}
    </Button>

    <Button
      variant="contained"
      onClick={handleManualCreateUser}
      disabled={manualCreateLoading || manualCheckLoading}
      startIcon={
        manualCreateLoading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <PersonAdd />
        )
      }
      sx={{
        ...premiumPrimaryButtonSx,
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        boxShadow: '0 10px 22px rgba(22, 163, 74, 0.24)',
        '&:hover': {
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {manualCreateLoading ? 'Creating...' : 'Create User'}
    </Button>
  </Box>
</DialogActions>
</Dialog>
{/* Delete Requests Dialog */}
<Dialog
  open={deleteRequestsOpen}
  onClose={() => setDeleteRequestsOpen(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle
    sx={{
      ...premiumDialogTitleSx,
      background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 55%, #f97316 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <DeleteForever />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Delete Approval Requests
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Review pending user delete requests before moving users to trash
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={() => setDeleteRequestsOpen(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.22)',
        },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          background:
            'linear-gradient(135deg, rgba(254,242,242,0.96) 0%, rgba(255,247,237,0.82) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Pending Requests
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {deleteRequestsLoading
              ? 'Loading delete requests...'
              : `${deleteRequests.length} pending requests`}
          </Typography>
        </Box>

        <Chip
          label="Approval Required"
          size="small"
          variant="outlined"
          sx={{
            bgcolor: 'rgba(220, 38, 38, 0.10)',
            color: '#b91c1c',
            border: '1px solid rgba(220, 38, 38, 0.20)',
            fontWeight: 900,
            borderRadius: '10px',
          }}
        />
      </Box>

      {deleteRequestsLoading ? (
        <Box
          sx={{
            p: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <CircularProgress size={24} sx={{ color: '#dc2626' }} />
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
            Loading delete requests...
          </Typography>
        </Box>
      ) : deleteRequests.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <DeleteForever sx={{ fontSize: 52, color: '#cbd5e1', mb: 1 }} />

          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 900 }}>
            No pending delete requests
          </Typography>

          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.75, fontWeight: 600 }}>
            Delete requests raised by managers/users will appear here.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            bgcolor: '#fff',
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth: 950,
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderCellSx}>User</TableCell>
                <TableCell sx={tableHeaderCellSx}>Requested By</TableCell>
                <TableCell sx={tableHeaderCellSx}>Reason</TableCell>
                <TableCell sx={tableHeaderCellSx}>Requested At</TableCell>
                <TableCell sx={tableHeaderCellSx}>Status</TableCell>
                <TableCell align="right" sx={tableHeaderCellSx}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(Array.isArray(deleteRequests) ? deleteRequests : []).map((request) => {
                const targetUser =
                  request.user ||
                  request.targetUser ||
                  request.deletedUser ||
                  {};

                const requestedBy =
                  request.requestedBy ||
                  request.createdBy ||
                  request.requestedByUser ||
                  {};

                const targetName =
                  request.userName ||
                  request.targetUserName ||
                  combineFullName(targetUser.name, targetUser.surname) ||
                  targetUser.name ||
                  '-';

                const requestedByName =
                  request.requestedByName ||
                  combineFullName(requestedBy.name, requestedBy.surname) ||
                  requestedBy.name ||
                  '-';

                return (
                  <TableRow
                    key={request.id}
                    hover
                    sx={{
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        bgcolor: 'rgba(254, 242, 242, 0.65)',
                      },
                    }}
                  >
                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        {targetName}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                        {request.userId || request.targetUserId || targetUser.id || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155' }}>
                        {requestedByName}
                      </Typography>

                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                        {request.requestedByRole || requestedBy.role || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#475569',
                          fontWeight: 700,
                          maxWidth: 280,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={request.reason || request.deleteReason || '-'}
                      >
                        {request.reason || request.deleteReason || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Typography variant="body2" sx={{ color: '#475569', fontWeight: 800 }}>
                        {formatDate(request.requestedAt || request.createdAt)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={tableBodyCellSx}>
                      <Chip
                        label={request.status || 'PENDING'}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: 'rgba(249, 115, 22, 0.12)',
                          color: '#c2410c',
                          border: '1px solid rgba(249, 115, 22, 0.20)',
                          fontWeight: 900,
                          borderRadius: '10px',
                        }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={tableBodyCellSx}>
                      <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Close />}
                          onClick={() => handleRejectDeleteRequest(request.id)}
                          sx={{
                            borderRadius: 3,
                            fontWeight: 800,
                            textTransform: 'none',
                            color: '#475569',
                            borderColor: '#cbd5e1',
                            '&:hover': {
                              borderColor: '#64748b',
                              bgcolor: '#f8fafc',
                            },
                          }}
                        >
                          Reject
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<DeleteForever />}
                          onClick={() => handleApproveDeleteRequest(request.id)}
                          sx={{
                            borderRadius: 3,
                            fontWeight: 800,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                            boxShadow: '0 8px 18px rgba(220, 38, 38, 0.18)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                            },
                          }}
                        >
                          Approve
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={() => setDeleteRequestsOpen(false)}
      sx={premiumCancelButtonSx}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
        {/* User Management Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogType === 'editUser' ? 'Edit User' : 
             dialogType === 'addUser' ? 'Add New User' :
             dialogType === 'addDeathCase' ? 'Add New Death Case' :
             'View Details'}
          </DialogTitle>
          <DialogContent dividers>
            {(dialogType === 'editUser' || dialogType === 'addUser') && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    defaultValue={selectedUser?.name || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={selectedUser?.email || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue={selectedUser?.phone || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      defaultValue={selectedUser?.role || 'USER'}
                      label="Role"
                    >
                      {roles.map(role => (
                        <MenuItem key={role} value={role}>
                          {getRoleLabel(role)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Division"
                    defaultValue={selectedUser?.sambhag || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="District"
                    defaultValue={selectedUser?.district || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Block"
                    defaultValue={selectedUser?.block || ''}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue={selectedUser?.status || 'active'}
                      label="Status"
                    >
                      {userStatuses.map(status => (
                        <MenuItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            
            {dialogType === 'addDeathCase' && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Applicant Name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Deceased Name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Death Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Assistance Amount"
                    type="number"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comments"
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleCloseDialog} 
              variant="contained"
              sx={{ bgcolor: '#4caf50' }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Role Assignment Dialog */}
      {/* Role Assignment Dialog */}
<Dialog
  open={roleAssignmentDialog}
  onClose={() => setRoleAssignmentDialog(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle
    sx={{
      ...premiumDialogTitleSx,
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <ManageAccounts />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Assign User Role
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Assign admin, manager or user role with location scope
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={() => setRoleAssignmentDialog(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.22)',
        },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          bgcolor: '#fff',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#fff',
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)',
              flexShrink: 0,
            }}
          >
            <People fontSize="small" />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Selected User
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
              {combineFullName(selectedUserForRole?.name, selectedUserForRole?.surname) ||
                selectedUserForRole?.name ||
                '-'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip
                label={selectedUserForRole?.id || 'No User ID'}
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: 'rgba(37, 99, 235, 0.08)',
                  color: '#1d4ed8',
                  border: '1px solid rgba(37, 99, 235, 0.18)',
                  fontWeight: 800,
                  borderRadius: '10px',
                }}
              />

              <Chip
                label={getRoleLabel(selectedUserForRole?.role) || 'Current Role'}
                size="small"
                variant="outlined"
                sx={{
                  ...getRoleChipSx(selectedUserForRole?.role),
                  fontWeight: 900,
                  borderRadius: '10px',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          bgcolor: '#fff',
          border: '1px solid rgba(226, 232, 240, 0.95)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={roleAssignmentData.role}
                label="Select Role"
                onChange={(e) => handleRoleAssignmentChange('role', e.target.value)}
                sx={premiumSelectSx}
              >
                {roles
                  .filter((role) => {
                    if (role === 'ROLE_ADMIN' && currentUser?.role !== 'ROLE_SUPERADMIN') {
                      return false;
                    }
                    return true;
                  })
                  .map((role) => (
                    <MenuItem key={role} value={role}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={getRoleLabel(role)}
                          size="small"
                          variant="outlined"
                          sx={{
                            ...getRoleChipSx(role),
                            fontWeight: 900,
                            borderRadius: '10px',
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          {roleAssignmentData.role &&
            roleAssignmentData.role !== 'ROLE_USER' &&
            roleAssignmentData.role !== 'ROLE_ADMIN' && (
              <Grid item xs={12}>
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 3,
                    bgcolor: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.14)',
                    '& .MuiAlert-icon': {
                      color: '#2563eb',
                    },
                  }}
                >
                  Manager roles require location assignment. Please select the required area according to the selected role.
                </Alert>
              </Grid>
            )}

          {(roleAssignmentData.role === 'ROLE_SAMBHAG_MANAGER' ||
            roleAssignmentData.role === 'ROLE_DISTRICT_MANAGER' ||
            roleAssignmentData.role === 'ROLE_BLOCK_MANAGER') && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Division / Sambhag</InputLabel>
                <Select
                  multiple
                  value={roleAssignmentData.sambhagIds}
                  label="Division / Sambhag"
                  onChange={(e) =>
                    handleRoleAssignmentChange('sambhagIds', e.target.value)
                  }
                  sx={premiumSelectSx}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          availableSambhags.find((s) => s.id === id)?.name || id
                      )
                      .join(', ')
                  }
                >
                  {(availableSambhags || []).map((sambhag) => (
                    <MenuItem key={sambhag.id} value={sambhag.id}>
                      <Checkbox
                        checked={roleAssignmentData.sambhagIds.includes(sambhag.id)}
                        sx={{
                          color: '#94a3b8',
                          '&.Mui-checked': {
                            color: '#2563eb',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {sambhag.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {(roleAssignmentData.role === 'ROLE_DISTRICT_MANAGER' ||
            roleAssignmentData.role === 'ROLE_BLOCK_MANAGER') && (
            <Grid item xs={12}>
              <FormControl fullWidth disabled={availableDistricts.length === 0}>
                <InputLabel>District</InputLabel>
                <Select
                  multiple
                  value={roleAssignmentData.districtIds}
                  label="District"
                  onChange={(e) =>
                    handleRoleAssignmentChange('districtIds', e.target.value)
                  }
                  sx={premiumSelectSx}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          availableDistricts.find((d) => d.id === id)?.name || id
                      )
                      .join(', ')
                  }
                >
                  {(availableDistricts || []).map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      <Checkbox
                        checked={roleAssignmentData.districtIds.includes(district.id)}
                        sx={{
                          color: '#94a3b8',
                          '&.Mui-checked': {
                            color: '#2563eb',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {district.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {roleAssignmentData.role === 'ROLE_BLOCK_MANAGER' && (
            <Grid item xs={12}>
              <FormControl fullWidth disabled={availableBlocks.length === 0}>
                <InputLabel>Block</InputLabel>
                <Select
                  multiple
                  value={roleAssignmentData.blockIds}
                  label="Block"
                  onChange={(e) =>
                    handleRoleAssignmentChange('blockIds', e.target.value)
                  }
                  sx={premiumSelectSx}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          availableBlocks.find((b) => b.id === id)?.name || id
                      )
                      .join(', ')
                  }
                >
                  {(availableBlocks || []).map((block) => (
                    <MenuItem key={block.id} value={block.id}>
                      <Checkbox
                        checked={roleAssignmentData.blockIds.includes(block.id)}
                        sx={{
                          color: '#94a3b8',
                          '&.Mui-checked': {
                            color: '#2563eb',
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {block.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {roleAssignmentData.role === 'ROLE_USER' && (
            <Grid item xs={12}>
              <Alert
                severity="success"
                sx={{
                  borderRadius: 3,
                  bgcolor: 'rgba(22, 163, 74, 0.08)',
                  border: '1px solid rgba(22, 163, 74, 0.14)',
                  '& .MuiAlert-icon': {
                    color: '#16a34a',
                  },
                }}
              >
                This will keep the selected member as a normal user. No manager location assignment is required.
              </Alert>
            </Grid>
          )}

          {roleAssignmentData.role === 'ROLE_ADMIN' && (
            <Grid item xs={12}>
              <Alert
                severity="warning"
                sx={{
                  borderRadius: 3,
                  bgcolor: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.16)',
                  '& .MuiAlert-icon': {
                    color: '#f97316',
                  },
                }}
              >
                Admin role should be assigned carefully. Only Super Admin can assign this role.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={() => {
        setRoleAssignmentDialog(false);
        setSelectedUserForRole(null);
        setRoleAssignmentData({
          role: '',
          sambhagIds: [],
          districtIds: [],
          blockIds: [],
        });
        setAvailableDistricts([]);
        setAvailableBlocks([]);
      }}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleRoleAssignmentSubmit}
      startIcon={<ManageAccounts />}
      sx={{
        ...premiumPrimaryButtonSx,
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        boxShadow: '0 10px 22px rgba(37, 99, 235, 0.24)',
        '&:hover': {
          background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      Assign Role
    </Button>
  </DialogActions>
</Dialog>
{/* Dashboard Export Dialog */}
<Dialog
  open={dashboardExportDialog}
  onClose={() => !exportLoading && setDashboardExportDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '14px',
          bgcolor: 'rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Download fontSize="small" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
          {dashboardExportType === 'pending-profiles'
            ? 'Export Pending Profiles'
            : `Export ${dashboardExportType === 'sahyog' ? 'Sahyog' : 'Asahyog'}`}
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Choose export mode and download records
        </Typography>
      </Box>
    </Box>

    <IconButton
      size="small"
      onClick={() => setDashboardExportDialog(false)}
      disabled={exportLoading}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.24)',
        },
      }}
    >
      <Close fontSize="small" />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        mb: 3,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor:
              dashboardExportType === 'sahyog'
                ? 'rgba(5, 150, 105, 0.12)'
                : dashboardExportType === 'asahyog'
                ? 'rgba(147, 51, 234, 0.12)'
                : 'rgba(249, 115, 22, 0.12)',
            color:
              dashboardExportType === 'sahyog'
                ? '#059669'
                : dashboardExportType === 'asahyog'
                ? '#9333ea'
                : '#f97316',
            flexShrink: 0,
          }}
        >
          <InfoOutlined fontSize="small" />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Export Configuration
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.35 }}>
            {dashboardExportType === 'pending-profiles'
              ? 'Pending profiles export will download all users whose profiles are not completed.'
              : 'Select whether you want to export death-case-wise, month-wise, or complete records.'}
          </Typography>
        </Box>
      </Box>
    </Paper>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {dashboardExportType !== 'pending-profiles' && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              mb: 1.5,
            }}
          >
            Select Export Type
          </Typography>

          <Grid container spacing={1.5}>
            {[
              { key: 'beneficiary', label: 'Death Case Wise' },
              { key: 'month', label: 'Month Wise' },
              { key: 'all', label: 'All' },
            ].map((item) => {
              const selected = dashboardExportMode === item.key;

              return (
                <Grid item xs={12} sm={4} key={item.key}>
                  <Button
                    fullWidth
                    variant={selected ? 'contained' : 'outlined'}
                    onClick={() => setDashboardExportMode(item.key)}
                    sx={{
                      py: 1.35,
                      borderRadius: 3,
                      fontWeight: 900,
                      textTransform: 'none',
                      borderColor: selected ? 'transparent' : '#cbd5e1',
                      color: selected ? '#fff' : '#475569',
                      background: selected
                        ? dashboardExportType === 'sahyog'
                          ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                          : 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
                        : '#fff',
                      boxShadow: selected
                        ? dashboardExportType === 'sahyog'
                          ? '0 10px 22px rgba(5, 150, 105, 0.22)'
                          : '0 10px 22px rgba(147, 51, 234, 0.22)'
                        : 'none',
                      '&:hover': {
                        borderColor:
                          dashboardExportType === 'sahyog' ? '#059669' : '#9333ea',
                        bgcolor: selected ? undefined : '#f8fafc',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {dashboardExportType === 'pending-profiles' && (
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(255, 247, 237, 0.9)',
            border: '1px solid rgba(254, 215, 170, 0.9)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.25,
          }}
        >
          <InfoOutlined sx={{ fontSize: 20, color: '#f97316', mt: 0.15 }} />
          <Typography variant="body2" sx={{ color: '#9a3412', fontWeight: 700 }}>
            This will download all pending profile users in the export file.
          </Typography>
        </Box>
      )}

      {(dashboardExportType === 'sahyog' || dashboardExportType === 'asahyog') &&
        dashboardExportMode === 'beneficiary' && (
          <FormControl fullWidth required>
            <InputLabel>Select Death Case</InputLabel>
            <Select
              value={dashboardExportBeneficiary}
              label="Select Death Case"
              onChange={(e) => setDashboardExportBeneficiary(e.target.value)}
              sx={premiumSelectSx}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 3,
                    mt: 1,
                    boxShadow: '0 18px 44px rgba(15, 23, 42, 0.16)',
                  },
                },
              }}
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

      {(dashboardExportType === 'sahyog' || dashboardExportType === 'asahyog') &&
        dashboardExportMode === 'month' && (
          <Grid container spacing={2.25}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Month</InputLabel>
                <Select
                  value={dashboardExportMonth}
                  label="Month"
                  onChange={(e) => setDashboardExportMonth(e.target.value)}
                  sx={premiumSelectSx}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 3,
                        mt: 1,
                        boxShadow: '0 18px 44px rgba(15, 23, 42, 0.16)',
                      },
                    },
                  }}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={dashboardExportYear}
                onChange={(e) => setDashboardExportYear(parseInt(e.target.value, 10))}
                inputProps={{
                  min: 2020,
                  max: new Date().getFullYear() + 5,
                }}
                sx={premiumTextFieldSx}
              />
            </Grid>
          </Grid>
        )}

      {(dashboardExportType === 'sahyog' || dashboardExportType === 'asahyog') &&
        dashboardExportMode === 'all' && (
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor:
                dashboardExportType === 'sahyog'
                  ? 'rgba(240, 253, 244, 0.92)'
                  : 'rgba(250, 245, 255, 0.92)',
              border:
                dashboardExportType === 'sahyog'
                  ? '1px solid rgba(187, 247, 208, 0.95)'
                  : '1px solid rgba(221, 214, 254, 0.95)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
            }}
          >
            <InfoOutlined
              sx={{
                fontSize: 20,
                color: dashboardExportType === 'sahyog' ? '#059669' : '#9333ea',
                mt: 0.15,
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: dashboardExportType === 'sahyog' ? '#065f46' : '#6b21a8',
                fontWeight: 700,
              }}
            >
              This will export all records for{' '}
              <strong>{dashboardExportType === 'sahyog' ? 'Sahyog' : 'Asahyog'}</strong>.
            </Typography>
          </Box>
        )}
    </Box>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      onClick={() => setDashboardExportDialog(false)}
      disabled={exportLoading}
      variant="outlined"
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      disabled={
        exportLoading ||
        (dashboardExportMode === 'month' &&
          (!dashboardExportMonth || !dashboardExportYear))
      }
      startIcon={
        exportLoading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <Download />
        )
      }
      onClick={() => {
        if (dashboardExportType === 'sahyog') {
          handleExportSahyog();
        } else if (dashboardExportType === 'asahyog') {
          handleExportAsahyog();
        } else if (dashboardExportType === 'pending-profiles') {
          handleExportPendingProfiles();
        }
      }}
      sx={{
        ...premiumPrimaryButtonSx,
        background:
          dashboardExportType === 'sahyog'
            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            : dashboardExportType === 'asahyog'
            ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
            : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        boxShadow:
          dashboardExportType === 'sahyog'
            ? '0 10px 22px rgba(5, 150, 105, 0.22)'
            : dashboardExportType === 'asahyog'
            ? '0 10px 22px rgba(147, 51, 234, 0.22)'
            : '0 10px 22px rgba(249, 115, 22, 0.22)',
        '&:hover': {
          background:
            dashboardExportType === 'sahyog'
              ? 'linear-gradient(135deg, #047857 0%, #065f46 100%)'
              : dashboardExportType === 'asahyog'
              ? 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)'
              : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {exportLoading ? 'Exporting...' : 'Export'}
    </Button>
  </DialogActions>
</Dialog>

        {/* Export Users Dialog */}
    {/* Export Users Dialog */}
<Dialog
  open={exportDialog}
  onClose={() => !exportLoading && setExportDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '14px',
          bgcolor: 'rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Download fontSize="small" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
          Export User Data
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Download user records by selected month and year
        </Typography>
      </Box>
    </Box>

    <IconButton
      size="small"
      onClick={() => setExportDialog(false)}
      disabled={exportLoading}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.24)',
        },
      }}
    >
      <Close fontSize="small" />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        mb: 3,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(37, 99, 235, 0.10)',
            color: '#2563eb',
            flexShrink: 0,
          }}
        >
          <InfoOutlined fontSize="small" />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Select Export Period
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.35 }}>
            Please select month and year to download filtered user data. You can also export all users directly.
          </Typography>
        </Box>
      </Box>
    </Paper>

    <Grid container spacing={2.25}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Month</InputLabel>
          <Select
            value={exportMonth}
            label="Month"
            onChange={(e) => setExportMonth(e.target.value)}
            sx={premiumSelectSx}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  boxShadow: '0 18px 44px rgba(15, 23, 42, 0.16)',
                },
              },
            }}
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
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          required
          label="Year"
          type="number"
          value={exportYear}
          onChange={(e) => setExportYear(parseInt(e.target.value, 10))}
          inputProps={{
            min: 2020,
            max: new Date().getFullYear() + 5,
          }}
          sx={premiumTextFieldSx}
        />
      </Grid>
    </Grid>

    <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 3,
        bgcolor: 'rgba(255, 247, 237, 0.9)',
        border: '1px solid rgba(254, 215, 170, 0.9)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
      }}
    >
      <InfoOutlined sx={{ fontSize: 20, color: '#f97316', mt: 0.15 }} />
      <Typography variant="body2" sx={{ color: '#9a3412', fontWeight: 700 }}>
        User data will be downloaded according to the selected month and year. Use
        <strong> Export All </strong>
        when you need the complete user list.
      </Typography>
    </Box>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      onClick={() => setExportDialog(false)}
      disabled={exportLoading}
      variant="outlined"
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      onClick={handleExportAllUsers}
      variant="outlined"
      disabled={exportLoading}
      startIcon={exportLoading ? <CircularProgress size={18} /> : <Download />}
      sx={{
        borderRadius: 3,
        px: 2.5,
        py: 1,
        fontWeight: 800,
        textTransform: 'none',
        borderColor: '#bfdbfe',
        color: '#1d4ed8',
        bgcolor: '#fff',
        '&:hover': {
          borderColor: '#2563eb',
          bgcolor: 'rgba(239, 246, 255, 0.9)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {exportLoading ? 'Exporting...' : 'Export All'}
    </Button>

    <Button
      onClick={handleExportUsers}
      variant="contained"
      disabled={exportLoading || !exportMonth || !exportYear}
      startIcon={exportLoading ? <CircularProgress size={18} color="inherit" /> : <Download />}
      sx={premiumPrimaryButtonSx}
    >
      {exportLoading ? 'Exporting...' : 'Export Selected'}
    </Button>
  </DialogActions>
</Dialog>

        {/* Death Case Details Dialog */}
     <Dialog
  open={deathCaseDialog}
  onClose={() => {
    setDeathCaseDialog(false);
    setSelectedDeathCase(null);
  }}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '14px',
          bgcolor: 'rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Assignment fontSize="small" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
          Death Assistance Case Details
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Complete nominee, case and bank account information
        </Typography>
      </Box>
    </Box>

    <IconButton
      size="small"
      onClick={() => {
        setDeathCaseDialog(false);
        setSelectedDeathCase(null);
      }}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.24)',
        },
      }}
    >
      <Close fontSize="small" />
    </IconButton>
  </DialogTitle>

  {selectedDeathCase && (
    <DialogContent sx={premiumDialogContentSx}>
      <Grid container spacing={2.5}>
        {/* Deceased Information */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: '100%',
              borderRadius: 3,
              bgcolor: '#fff',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '14px',
                  bgcolor: 'rgba(220, 38, 38, 0.10)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <People fontSize="small" />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                Deceased Information
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.25 }}>
              {selectedDeathCase.userImage ? (
                <Box
                  component="img"
                  src={selectedDeathCase.userImage}
                  alt="Deceased Photo"
                  sx={{
                    width: 66,
                    height: 66,
                    borderRadius: '20px',
                    objectFit: 'cover',
                    border: '3px solid #fff',
                    boxShadow: '0 10px 22px rgba(15, 23, 42, 0.16)',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 66,
                    height: 66,
                    borderRadius: '20px',
                    bgcolor: 'rgba(220, 38, 38, 0.10)',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.35rem',
                  }}
                >
                  {(selectedDeathCase.deceasedName || 'D').charAt(0)}
                </Box>
              )}

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
                  {selectedDeathCase.deceasedName || '-'}
                </Typography>

                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                  Code: {selectedDeathCase.employeeCode || '-'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.15 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessCenter sx={{ fontSize: 18, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                  <strong>Department:</strong> {selectedDeathCase.department || '-'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: '#f97316' }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                  <strong>District:</strong> {selectedDeathCase.district || '-'}
                </Typography>
              </Box>

              {selectedDeathCase.caseDate && (
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                  <strong>Case Date:</strong>{' '}
                  {new Date(selectedDeathCase.caseDate).toLocaleDateString('hi-IN')}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 800 }}>
                  Status:
                </Typography>

                <Chip
                  label={
                    selectedDeathCase.status === 'OPEN'
                      ? 'Open'
                      : selectedDeathCase.status === 'CLOSED'
                      ? 'Closed'
                      : selectedDeathCase.status === 'ACTIVE'
                      ? 'Active'
                      : selectedDeathCase.status === 'INACTIVE'
                      ? 'Inactive'
                      : selectedDeathCase.status || '-'
                  }
                  size="small"
                  variant="outlined"
                  sx={{
                    ...getDeathCaseStatusChipSx(selectedDeathCase.status),
                    fontWeight: 900,
                    borderRadius: '10px',
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: '100%',
              borderRadius: 3,
              bgcolor: '#fff',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '14px',
                  bgcolor: 'rgba(249, 115, 22, 0.12)',
                  color: '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InfoOutlined fontSize="small" />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                Details
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: selectedDeathCase.description ? '#334155' : '#94a3b8',
                fontWeight: 650,
                lineHeight: 1.75,
                p: 2,
                borderRadius: 3,
                bgcolor: '#f8fafc',
                border: '1px solid rgba(226, 232, 240, 0.85)',
                minHeight: 116,
              }}
            >
              {selectedDeathCase.description || 'No details available'}
            </Typography>
          </Paper>
        </Grid>

        {/* First Nominee */}
        {selectedDeathCase.nominee1Name && (
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                bgcolor: 'rgba(240, 253, 244, 0.9)',
                border: '1px solid rgba(187, 247, 208, 0.95)',
                boxShadow: '0 12px 30px rgba(22, 163, 74, 0.07)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1.5, color: '#15803d', fontWeight: 900 }}>
                First Nominee
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, color: '#334155', fontWeight: 700 }}>
                <strong>Name:</strong> {selectedDeathCase.nominee1Name}
              </Typography>

              {selectedDeathCase.nominee1QrCode && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => window.open(selectedDeathCase.nominee1QrCode, '_blank')}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 800,
                    borderColor: '#86efac',
                    color: '#15803d',
                    bgcolor: '#fff',
                    '&:hover': {
                      borderColor: '#16a34a',
                      bgcolor: 'rgba(240, 253, 244, 0.95)',
                    },
                  }}
                >
                  QR Code Download
                </Button>
              )}
            </Paper>
          </Grid>
        )}

        {/* Second Nominee */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              height: '100%',
              borderRadius: 3,
              bgcolor: selectedDeathCase.nominee2Name
                ? 'rgba(239, 246, 255, 0.92)'
                : '#fff',
              border: selectedDeathCase.nominee2Name
                ? '1px solid rgba(191, 219, 254, 0.95)'
                : '1px solid rgba(226, 232, 240, 0.95)',
              boxShadow: selectedDeathCase.nominee2Name
                ? '0 12px 30px rgba(37, 99, 235, 0.07)'
                : '0 12px 30px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1.5,
                color: selectedDeathCase.nominee2Name ? '#1d4ed8' : '#64748b',
                fontWeight: 900,
              }}
            >
              Second Nominee
            </Typography>

            {selectedDeathCase.nominee2Name ? (
              <>
                <Typography variant="body2" sx={{ mb: 2, color: '#334155', fontWeight: 700 }}>
                  <strong>Name:</strong> {selectedDeathCase.nominee2Name}
                </Typography>

                {selectedDeathCase.nominee2QrCode && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Download />}
                    onClick={() => window.open(selectedDeathCase.nominee2QrCode, '_blank')}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 800,
                      borderColor: '#bfdbfe',
                      color: '#1d4ed8',
                      bgcolor: '#fff',
                      '&:hover': {
                        borderColor: '#2563eb',
                        bgcolor: 'rgba(239, 246, 255, 0.95)',
                      },
                    }}
                  >
                    QR Code Download
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                No Second Nominee
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Bank Accounts */}
        {(selectedDeathCase.account1 ||
          selectedDeathCase.account2 ||
          selectedDeathCase.account3) && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: '#fff',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '14px',
                    bgcolor: 'rgba(249, 115, 22, 0.12)',
                    color: '#f97316',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Payment fontSize="small" />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                  Bank Account Information
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {[selectedDeathCase.account1, selectedDeathCase.account2, selectedDeathCase.account3]
                  .filter(Boolean)
                  .map((account, index) => (
                    <Grid item xs={12} md={4} key={`account-${index + 1}`}>
                      <Box
                        sx={{
                          p: 2,
                          height: '100%',
                          bgcolor: '#f8fafc',
                          borderRadius: 3,
                          border: '1px solid rgba(226, 232, 240, 0.95)',
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 900, mb: 1.25, color: '#0f172a' }}
                        >
                          Account {index + 1}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 0.65, color: '#334155', fontWeight: 700 }}>
                          <strong>Bank:</strong> {account.bankName || '-'}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 0.65, color: '#334155', fontWeight: 700 }}>
                          <strong>Account Number:</strong> {account.accountNumber || '-'}
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 0.65, color: '#334155', fontWeight: 700 }}>
                          <strong>IFSC:</strong> {account.ifscCode || '-'}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                          <strong>Account Holder:</strong> {account.accountHolderName || '-'}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </DialogContent>
  )}

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      onClick={() => {
        setDeathCaseDialog(false);
        setSelectedDeathCase(null);
      }}
      variant="outlined"
      sx={premiumCancelButtonSx}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

        {/* Create Death Case Dialog */}
        <Dialog 
          open={createDeathCaseDialog} 
          onClose={() => {
            setCreateDeathCaseDialog(false);
             resetDeathCaseForm();
            setDeathCaseFormData({
              deceasedName: '',
              employeeCode: '',
              department: '',
              sambhag: '',
              district: '',
              block: '',
              caseDate: new Date().toISOString().split('T')[0],
              description: '',
              nominee1Name: '',
              nominee2Name: '',
              account1: '',
              account2: '',
              account3: '',
              status: 'OPEN'
            });
            setSelectedSambhag('');
            setSelectedDistrict('');
            setSelectedBlock('');
            setAvailableDistricts([]);
            setAvailableBlocks([]);
            setSectionExpanded({
              basicInfo: true,
              locationInfo: true,
              nomineeInfo: true,
              account1: true,
              account2: false,
              account3: false
            });
          }}
          maxWidth="md"
          fullWidth
            PaperProps={{
    sx: {
      ...premiumDialogPaperSx,
      maxHeight: '92vh',
    },
  }}
        >
                    <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white', fontWeight: 'bold' }}>
            {isDeathCaseEditMode ? 'Edit Death Assistance Case' : 'New Death Assistance Case'}
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: 2, border: '2px solid #d32f2f' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#ffebee', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionToggle('basicInfo')}
                  >
                    <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      Deceased Information
                    </Typography>
                    <IconButton size="medium" sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}>
                      {sectionExpanded.basicInfo ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
                    </IconButton>
                  </Box>
                  <Collapse in={sectionExpanded.basicInfo}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                     <Grid item xs={12} md={6} sx={{ mt: 3,}}>
                      <TextField
                        fullWidth
                        label="Deceased Name *"
                        value={deathCaseFormData.deceasedName}
                        onChange={(e) => handleDeathCaseFormChange('deceasedName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6} sx={{ mt: 3,mb: 3 }}>
                      
                      <TextField
                        fullWidth
                        label="Employee Code *"
                        value={deathCaseFormData.employeeCode}
                        onChange={(e) => handleDeathCaseFormChange('employeeCode', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#666' }}>
                        Deceased Photo
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ 
                          height: 56,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          borderStyle: 'dashed'
                        }}
                      >
                        {deathCaseFiles.userImage ? deathCaseFiles.userImage.name : 'Upload Photo'}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileUpload('userImage', e.target.files[0])}
                        />
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#666' }}>
                        Certificate
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ 
                          height: 56,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          borderStyle: 'dashed'
                        }}
                      >
                        {deathCaseFiles.certificate1 ? deathCaseFiles.certificate1.name : 'Upload Certificate'}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileUpload('certificate1', e.target.files[0])}
                        />
                      </Button>
                    </Grid>
                    
                    <Grid item xs={12} md={6} sx={{ mt: 3,mb: 3 }}>
                      <FormControl 
                        fullWidth
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      >
                         <InputLabel shrink>Department *</InputLabel>
                        <Select
                          value={deathCaseFormData.department}
                          onChange={(e) => handleDeathCaseFormChange('department', e.target.value)}
                          label="Department *"
                          displayEmpty
                        >
                          <MenuItem value="">Select Department...</MenuItem>
                          <MenuItem value="Education Department">Education Department</MenuItem>
                          <MenuItem value="Tribal Welfare Department">Tribal Welfare Department</MenuItem>
                          <MenuItem value="Health Department">Health Department</MenuItem>
                          <MenuItem value="Agriculture Department">Agriculture Department</MenuItem>
                          <MenuItem value="Forest Department">Forest Department</MenuItem>
                          <MenuItem value="Police Department">Police Department</MenuItem>
                          <MenuItem value="Revenue Department">Revenue Department</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6} sx={{ mt: 3,mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Case Date"
                        type="date"
                        value={deathCaseFormData.caseDate}
                        onChange={(e) => handleDeathCaseFormChange('caseDate', e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6} sx={{ mt: 3,mb: 3 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ fontWeight: 'bold' }}>Status</InputLabel>
                        <Select
                          value={deathCaseFormData.status}
                          onChange={(e) => handleDeathCaseFormChange('status', e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="OPEN">Open</MenuItem>
                          <MenuItem value="CLOSED">Closed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Details"
                        value={deathCaseFormData.description}
                        onChange={(e) => handleDeathCaseFormChange('description', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>
              
              {/* Location Information Section */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: 2, border: '2px solid #9c27b0' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#f3e5f5', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionToggle('locationInfo')}
                  >
                    <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                      Location Information
                    </Typography>
                    <IconButton size="medium" sx={{ color: '#9c27b0', '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.1)' } }}>
                      {sectionExpanded.locationInfo ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
                    </IconButton>
                  </Box>
                  <Collapse in={sectionExpanded.locationInfo}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl 
                        fullWidth
                        disabled={loadingLocations}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      >
                        <InputLabel shrink>Division *</InputLabel>
                        <Select
                          value={selectedSambhag}
                          onChange={handleSambhagChange}
                          label="Division *"
                          displayEmpty
                        >
                          <MenuItem value="">Select Division...</MenuItem>
                          {availableSambhags && availableSambhags.length > 0 ? (
                            availableSambhags.map((sambhag) => (
                              <MenuItem key={sambhag.id} value={sambhag.id}>
                                {sambhag.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {loadingLocations ? 'Loading...' : 'No Division available'}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControl 
                        fullWidth
                        disabled={!selectedSambhag || loadingLocations}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      >
                        <InputLabel shrink>District *</InputLabel>
                        <Select
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          label="District *"
                          displayEmpty
                        >
                          <MenuItem value="">Select District...</MenuItem>
                          {availableDistricts && availableDistricts.length > 0 ? (
                            availableDistricts.map((district) => (
                              <MenuItem key={district.id} value={district.id}>
                                {district.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {!selectedSambhag ? 'Select Division first' : 'No District available'}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControl 
                        fullWidth
                        disabled={!selectedDistrict || loadingLocations}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      >
                        <InputLabel shrink>Block</InputLabel>
                        <Select
                          value={selectedBlock}
                          onChange={handleBlockChange}
                          label="Block"
                          displayEmpty
                        >
                          <MenuItem value="">Select Block...</MenuItem>
                          {availableBlocks && availableBlocks.length > 0 ? (
                            availableBlocks.map((block) => (
                              <MenuItem key={block.id} value={block.id}>
                                {block.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {!selectedDistrict ? 'Select District first' : 'No Block available'}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>

              {/* Nominee Information Section */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: 2, border: '2px solid #2e7d32' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#e8f5e8', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionToggle('nomineeInfo')}
                  >
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      Nominee Information
                    </Typography>
                    <IconButton size="medium" sx={{ color: '#2e7d32', '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.1)' } }}>
                      {sectionExpanded.nomineeInfo ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
                    </IconButton>
                  </Box>
                  <Collapse in={sectionExpanded.nomineeInfo}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                    <Grid item xs={12} md={6} sx={{ mt: 3,mb: 3 }}>
                      <TextField
                        fullWidth
                        label="First Nominee Name *"
                        value={deathCaseFormData.nominee1Name}
                        onChange={(e) => handleDeathCaseFormChange('nominee1Name', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#666' }}>
                        First Nominee QR Code
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ 
                          height: 56,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          borderStyle: 'dashed'
                        }}
                      >
                        {deathCaseFiles.nominee1QrCode ? deathCaseFiles.nominee1QrCode.name : 'Upload QR Code'}
                        <input
                          type="file"
                          hidden
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload('nominee1QrCode', e.target.files[0])}
                        />
                      </Button>
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Nominee 1 UPI ID"
    placeholder="example@upi"
    value={deathCaseFormData.nominee1UpiLink}
    onChange={(e) => handleDeathCaseFormChange('nominee1UpiLink', e.target.value)}
    variant="outlined"
  />
</Grid> */}
                    
                    <Grid item xs={12} md={6} sx={{ mt: 3,mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Second Nominee Name"
                        value={deathCaseFormData.nominee2Name}
                        onChange={(e) => handleDeathCaseFormChange('nominee2Name', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#666' }}>
                        Second Nominee QR Code
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ 
                          height: 56,
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          borderStyle: 'dashed'
                        }}
                      >
                        {deathCaseFiles.nominee2QrCode ? deathCaseFiles.nominee2QrCode.name : 'Upload QR Code'}
                        <input
                          type="file"
                          hidden
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload('nominee2QrCode', e.target.files[0])}
                        />
                      </Button>
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Nominee 2 UPI ID"
    placeholder="example@upi"
    value={deathCaseFormData.nominee2UpiLink}
    onChange={(e) => handleDeathCaseFormChange('nominee2UpiLink', e.target.value)}
    variant="outlined"
  />
</Grid> */}
                      </Grid>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>

              {/* Bank Account Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#f57c00' }}>
                  Bank Account Information (All 3 accounts required *)
                </Typography>
              </Grid>
              
              {/* Account 1 Section */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: 2, border: '2px solid #f57c00' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#fff3e0', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionToggle('account1')}
                  >
                    <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      Account 1 (Required *)
                    </Typography>
                    <IconButton size="medium" sx={{ color: '#f57c00', '&:hover': { bgcolor: 'rgba(245, 124, 0, 0.1)' } }}>
                      {sectionExpanded.account1 ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
                    </IconButton>
                  </Box>
                  <Collapse in={sectionExpanded.account1}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Bank Name *"
                        value={deathCaseFormData.account1.bankName}
                        onChange={(e) => handleDeathCaseFormChange('account1.bankName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Number *"
                        value={deathCaseFormData.account1.accountNumber}
                        onChange={(e) => handleDeathCaseFormChange('account1.accountNumber', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code *"
                        value={deathCaseFormData.account1.ifscCode}
                        onChange={(e) => handleDeathCaseFormChange('account1.ifscCode', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Holder Name *"
                        value={deathCaseFormData.account1.accountHolderName}
                        onChange={(e) => handleDeathCaseFormChange('account1.accountHolderName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>

              {/* Account 2 Section */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: 2, border: '2px solid #1976d2' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#e3f2fd', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionToggle('account2')}
                  >
                    <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      Account 2 (Required *)
                    </Typography>
                    <IconButton size="medium" sx={{ color: '#1976d2', '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}>
                      {sectionExpanded.account2 ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
                    </IconButton>
                  </Box>
                  <Collapse in={sectionExpanded.account2}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Bank Name *"
                        value={deathCaseFormData.account2.bankName}
                        onChange={(e) => handleDeathCaseFormChange('account2.bankName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Number *"
                        value={deathCaseFormData.account2.accountNumber}
                        onChange={(e) => handleDeathCaseFormChange('account2.accountNumber', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code *"
                        value={deathCaseFormData.account2.ifscCode}
                        onChange={(e) => handleDeathCaseFormChange('account2.ifscCode', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Holder Name *"
                        value={deathCaseFormData.account2.accountHolderName}
                        onChange={(e) => handleDeathCaseFormChange('account2.accountHolderName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>

              {/* Account 3 Section */}
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: 2, border: '2px solid #4caf50' }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#e8f5e8', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSectionToggle('account3')}
                  >
                    <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      Account 3 (Required *)
                    </Typography>
                    <IconButton size="medium" sx={{ color: '#4caf50', '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' } }}>
                      {sectionExpanded.account3 ? <ExpandLess fontSize="large" /> : <ExpandMore fontSize="large" />}
                    </IconButton>
                  </Box>
                  <Collapse in={sectionExpanded.account3}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Bank Name *"
                        value={deathCaseFormData.account3.bankName}
                        onChange={(e) => handleDeathCaseFormChange('account3.bankName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Number *"
                        value={deathCaseFormData.account3.accountNumber}
                        onChange={(e) => handleDeathCaseFormChange('account3.accountNumber', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code *"
                        value={deathCaseFormData.account3.ifscCode}
                        onChange={(e) => handleDeathCaseFormChange('account3.ifscCode', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Account Holder Name *"
                        value={deathCaseFormData.account3.accountHolderName}
                        onChange={(e) => handleDeathCaseFormChange('account3.accountHolderName', e.target.value)}
                        variant="outlined"
                        sx={{ '& .MuiInputLabel-root': { fontWeight: 'bold' } }}
                      />
                    </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => {
                setCreateDeathCaseDialog(false);
                 resetDeathCaseForm();
                setDeathCaseFormData({
                  deceasedName: '',
                  employeeCode: '',
                  department: '',
                  sambhag: '',
                  district: '',
                  block: '',
                  caseDate: new Date().toISOString().split('T')[0],
                  description: '',
                  nominee1Name: '',
                  nominee2Name: '',
                  account1: {
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    accountHolderName: ''
                  },
                  account2: {
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    accountHolderName: ''
                  },
                  account3: {
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    accountHolderName: ''
                  },
                  status: 'OPEN'
                });
                setSelectedSambhag('');
                setSelectedDistrict('');
                setSelectedBlock('');
                setAvailableDistricts([]);
                setAvailableBlocks([]);
                setSectionExpanded({
                  basicInfo: true,
                  locationInfo: true,
                  nomineeInfo: true,
                  account1: true,
                  account2: false,
                  account3: false
                });
              }}
              disabled={deathCaseFormLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
                           onClick={isDeathCaseEditMode ? handleUpdateDeathCase : handleCreateDeathCase}
              disabled={deathCaseFormLoading || 
                !deathCaseFormData.deceasedName.trim() || 
                !deathCaseFormData.employeeCode.trim() || 
                !deathCaseFormData.department || 
                !selectedSambhag || 
                !selectedDistrict ||
                !deathCaseFormData.nominee1Name.trim() ||
                !deathCaseFormData.account1.bankName.trim() ||
                !deathCaseFormData.account1.accountNumber.trim() ||
                !deathCaseFormData.account1.ifscCode.trim() ||
                !deathCaseFormData.account1.accountHolderName.trim() ||
                !deathCaseFormData.account2.bankName.trim() ||
                !deathCaseFormData.account2.accountNumber.trim() ||
                !deathCaseFormData.account2.ifscCode.trim() ||
                !deathCaseFormData.account2.accountHolderName.trim() ||
                !deathCaseFormData.account3.bankName.trim() ||
                !deathCaseFormData.account3.accountNumber.trim() ||
                !deathCaseFormData.account3.ifscCode.trim() ||
                !deathCaseFormData.account3.accountHolderName.trim()
              }
              startIcon={deathCaseFormLoading ? <CircularProgress size={18} /> : <Save />}
              sx={{ bgcolor: '#d32f2f' }}
            >
                           {deathCaseFormLoading ? (isDeathCaseEditMode ? 'Updating...' : 'Saving...') : (isDeathCaseEditMode ? 'Update' : 'Save')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manager Userssss Dialog */}
       <Dialog
  open={managerUsersDialog}
  onClose={() => setManagerUsersDialog(false)}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '14px',
          bgcolor: 'rgba(255,255,255,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <People fontSize="small" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
          {selectedManagerInfo
            ? `${selectedManagerInfo.managerName || 'Manager'}'s Users`
            : 'Manager Users'}
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          {selectedManagerInfo
            ? `${
                selectedManagerInfo.managerLevel === 'SAMBHAG'
                  ? 'Division'
                  : selectedManagerInfo.managerLevel === 'DISTRICT'
                  ? 'District'
                  : selectedManagerInfo.managerLevel === 'BLOCK'
                  ? 'Block'
                  : selectedManagerInfo.managerLevel || ''
              } Manager • ${managerUsers.length} users found`
            : `${managerUsers.length} users found`}
        </Typography>
      </Box>
    </Box>

    <IconButton
      size="small"
      onClick={() => setManagerUsersDialog(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.24)',
        },
      }}
    >
      <Close fontSize="small" />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        mb: 2.5,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(37, 99, 235, 0.10)',
              color: '#2563eb',
              flexShrink: 0,
            }}
          >
            <ManageAccounts fontSize="small" />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Assigned User List
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Users visible under the selected manager’s assigned area.
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${managerUsers.length} Users`}
          size="small"
          variant="outlined"
          sx={{
            bgcolor: 'rgba(37, 99, 235, 0.10)',
            color: '#1d4ed8',
            border: '1px solid rgba(37, 99, 235, 0.18)',
            fontWeight: 900,
            borderRadius: '10px',
          }}
        />
      </Box>
    </Paper>

    {managerUsers.length === 0 ? (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: '#fff',
          border: '1px solid rgba(226, 232, 240, 0.95)',
        }}
      >
        <People sx={{ fontSize: 52, color: '#cbd5e1', mb: 1 }} />

        <Typography variant="h6" sx={{ color: '#475569', fontWeight: 900 }}>
          No User found
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.75, fontWeight: 600 }}>
          No users are currently available under this manager assignment.
        </Typography>
      </Paper>
    ) : (
      <TableContainer
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          bgcolor: '#fff',
          borderRadius: 3,
          border: '1px solid rgba(226, 232, 240, 0.95)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Table
          sx={{
            minWidth: 1050,
            '& .MuiTableCell-root': {
              whiteSpace: 'nowrap',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderCellSx}>Name</TableCell>
              <TableCell sx={tableHeaderCellSx}>Email</TableCell>
              <TableCell sx={tableHeaderCellSx}>Mobile</TableCell>
              <TableCell sx={tableHeaderCellSx}>Department</TableCell>
              <TableCell sx={tableHeaderCellSx}>Location</TableCell>
              <TableCell sx={tableHeaderCellSx}>Role</TableCell>
              <TableCell sx={tableHeaderCellSx}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {managerUsers.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    bgcolor: 'rgba(239, 246, 255, 0.72)',
                  },
                }}
              >
                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    {[user.name, user.surname].filter(Boolean).join(' ') || '-'}
                  </Typography>

                  {user.fatherName && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}
                    >
                      Father: {user.fatherName}
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                    {user.email || '-'}
                  </Typography>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <Phone sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                      {user.mobileNumber || '-'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 800 }}>
                    {user.department || '-'}
                  </Typography>

                  {user.schoolOfficeName && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}
                    >
                      {user.schoolOfficeName}
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#2563eb', mt: 0.15 }} />

                    <Typography
                      variant="caption"
                      sx={{ color: '#475569', fontWeight: 700, lineHeight: 1.5 }}
                    >
                      {[
                        user.departmentBlock,
                        user.departmentDistrict,
                        user.departmentSambhag,
                      ]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Chip
                    label={
                      user.role === 'ROLE_ADMIN'
                        ? 'Admin'
                        : user.role === 'ROLE_SAMBHAG_MANAGER'
                        ? 'Division Manager'
                        : user.role === 'ROLE_DISTRICT_MANAGER'
                        ? 'District Manager'
                        : user.role === 'ROLE_BLOCK_MANAGER'
                        ? 'Block Manager'
                        : 'User'
                    }
                    size="small"
                    variant="outlined"
                    sx={{
                      ...getRoleChipSx(user.role),
                      fontWeight: 900,
                      borderRadius: '10px',
                    }}
                  />
                </TableCell>

                <TableCell sx={tableBodyCellSx}>
                  <Chip
                    label={
                      user.status === 'ACTIVE'
                        ? 'Active'
                        : user.status === 'BLOCKED'
                        ? 'Blocked'
                        : 'Inactive'
                    }
                    size="small"
                    variant="outlined"
                    sx={{
                      ...getStatusChipSx(user.status),
                      fontWeight: 900,
                      borderRadius: '10px',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      onClick={() => setManagerUsersDialog(false)}
      variant="outlined"
      sx={premiumCancelButtonSx}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

        {/* Admin - View/Edit User Details Dialog */}
        {/* User Details / Edit Dialog */}
<Dialog
  open={userDetailsOpen}
  onClose={closeUserDetails}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle
    sx={{
      ...premiumDialogTitleSx,
      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 55%, #7c3aed 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <InfoOutlined />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          User Details
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          {userDetailsUser?.id
            ? `User ID: ${userDetailsUser.id}`
            : 'View and update user profile information'}
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={closeUserDetails}
      disabled={userDetailsSaving}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.22)',
        },
        '&.Mui-disabled': {
          color: 'rgba(255,255,255,0.55)',
        },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper elevation={0} sx={settingsCardSx}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#fff',
              boxShadow: '0 10px 20px rgba(2, 132, 199, 0.18)',
              flexShrink: 0,
            }}
          >
            <People fontSize="small" />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Personal Information
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Basic member profile and contact details.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={userDetailsForm.fullName}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Father Name"
              value={userDetailsForm.fatherName}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, fatherName: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={userDetailsForm.email}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, email: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Code"
              value={userDetailsForm.countryCode}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, countryCode: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={userDetailsForm.mobileNumber}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, mobileNumber: e.target.value }))
              }
              sx={premiumTextFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={userDetailsForm.gender}
                label="Gender"
                onChange={(e) =>
                  setUserDetailsForm((prev) => ({ ...prev, gender: e.target.value }))
                }
                sx={premiumSelectSx}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Marital Status</InputLabel>
              <Select
                value={userDetailsForm.maritalStatus}
                label="Marital Status"
                onChange={(e) =>
                  setUserDetailsForm((prev) => ({ ...prev, maritalStatus: e.target.value }))
                }
                sx={premiumSelectSx}
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="UNMARRIED">Unmarried</MenuItem>
                <MenuItem value="MARRIED">Married</MenuItem>
                <MenuItem value="DIVORCED">Divorced</MenuItem>
                <MenuItem value="WIDOWED">Widowed</MenuItem>
                <MenuItem value="single">Single</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="divorced">Divorced</MenuItem>
                <MenuItem value="widowed">Widowed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              InputLabelProps={{ shrink: true }}
              value={userDetailsForm.dateOfBirth}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pincode"
              value={userDetailsForm.pincode}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, pincode: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Home Address"
              value={userDetailsForm.homeAddress}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, homeAddress: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={settingsCardSx}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
              color: '#fff',
              boxShadow: '0 10px 20px rgba(249, 115, 22, 0.18)',
              flexShrink: 0,
            }}
          >
            <BusinessCenter fontSize="small" />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Department Information
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Employment and department location details.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Joining Date"
              InputLabelProps={{ shrink: true }}
              value={userDetailsForm.joiningDate}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, joiningDate: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Retirement Date"
              InputLabelProps={{ shrink: true }}
              value={userDetailsForm.retirementDate}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, retirementDate: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              value={userDetailsForm.department}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, department: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department Unique ID"
              value={userDetailsForm.departmentUniqueId}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, departmentUniqueId: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="School / Office Name"
              value={userDetailsForm.schoolOfficeName}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, schoolOfficeName: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sankul Name"
              value={userDetailsForm.sankulName}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, sankulName: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              value={userDetailsForm.departmentState}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, departmentState: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sambhag / Division"
              value={userDetailsForm.departmentSambhag}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, departmentSambhag: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="District"
              value={userDetailsForm.departmentDistrict}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, departmentDistrict: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Block"
              value={userDetailsForm.departmentBlock}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, departmentBlock: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={settingsCardSx}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#fff',
              boxShadow: '0 10px 20px rgba(22, 163, 74, 0.18)',
              flexShrink: 0,
            }}
          >
            <People fontSize="small" />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
              Nominee Information
            </Typography>

            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              First and second nominee details.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nominee 1 Name"
              value={userDetailsForm.nominee1Name}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, nominee1Name: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nominee 1 Relation"
              value={userDetailsForm.nominee1Relation}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, nominee1Relation: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nominee 2 Name"
              value={userDetailsForm.nominee2Name}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, nominee2Name: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nominee 2 Relation"
              value={userDetailsForm.nominee2Relation}
              onChange={(e) =>
                setUserDetailsForm((prev) => ({ ...prev, nominee2Relation: e.target.value }))
              }
              sx={premiumTextFieldSx}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={closeUserDetails}
      disabled={userDetailsSaving}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={saveUserDetails}
      disabled={userDetailsSaving}
      startIcon={
        userDetailsSaving ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <Save />
        )
      }
      sx={{
        ...premiumPrimaryButtonSx,
        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 55%, #7c3aed 100%)',
        boxShadow: '0 10px 22px rgba(37, 99, 235, 0.24)',
        '&:hover': {
          background: 'linear-gradient(135deg, #0369a1 0%, #1d4ed8 55%, #6d28d9 100%)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {userDetailsSaving ? 'Saving...' : 'Save Changes'}
    </Button>
  </DialogActions>
</Dialog>
<Dialog
  open={settingsDialogOpen}
  onClose={() => setSettingsDialogOpen(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle sx={premiumDialogTitleSx}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Settings />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Admin Settings
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Control OTP, exports, public visibility and profile field locks
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={() => setSettingsDialogOpen(false)}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    {settingsLoading ? (
      <Box
        sx={{
          py: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <CircularProgress size={24} sx={{ color: '#dc2626' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
          Loading settings...
        </Typography>
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Paper elevation={0} sx={settingsCardSx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
                color: '#fff',
                boxShadow: '0 10px 20px rgba(220, 38, 38, 0.18)',
                flexShrink: 0,
              }}
            >
              <Lock fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                Security & Public Controls
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Manage login verification and public page visibility.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Box sx={settingsSwitchRowSx}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    Mobile OTP Verification
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Enable or disable mobile OTP requirement during login/verification.
                  </Typography>
                </Box>

                <Switch
                  checked={mobileOtpEnabled}
                  onChange={(e) => setMobileOtpEnabled(e.target.checked)}
                  color="success"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={settingsSwitchRowSx}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    Self Donation Visible
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Show or hide self donation section on public pages.
                  </Typography>
                </Box>

                <Switch
                  checked={selfDonationVisible}
                  onChange={(e) => setSelfDonationVisible(e.target.checked)}
                  color="success"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={settingsCardSx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#fff',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)',
                flexShrink: 0,
              }}
            >
              <Download fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                Export Mobile Number Permissions
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Control whether mobile numbers are visible in exports.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Box sx={settingsSwitchRowSx}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    Admin Export Mobile Number
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Allow mobile numbers in admin exports.
                  </Typography>
                </Box>

                <Switch
                  checked={exportMobileNumberEnabled}
                  onChange={(e) => setExportMobileNumberEnabled(e.target.checked)}
                  color="success"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={settingsSwitchRowSx}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    District Manager Export
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Allow district managers to export mobile numbers.
                  </Typography>
                </Box>

                <Switch
                  checked={districtManagerExportMobileEnabled}
                  onChange={(e) => setDistrictManagerExportMobileEnabled(e.target.checked)}
                  color="success"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={settingsSwitchRowSx}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                    Block Manager Export
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Allow block managers to export mobile numbers.
                  </Typography>
                </Box>

                <Switch
                  checked={blockManagerExportMobileEnabled}
                  onChange={(e) => setBlockManagerExportMobileEnabled(e.target.checked)}
                  color="success"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={settingsCardSx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#fff',
                boxShadow: '0 10px 20px rgba(22, 163, 74, 0.18)',
                flexShrink: 0,
              }}
            >
              <LockReset fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                Profile Field Locks
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Lock profile fields so users cannot edit sensitive details.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={1.5}>
            {[
              { key: 'fullName', label: 'Full Name' },
              { key: 'dateOfBirth', label: 'Date of Birth' },
              { key: 'mobileNumber', label: 'Mobile Number' },
              { key: 'email', label: 'Email' },
              { key: 'departmentUniqueId', label: 'Department Unique ID' },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.key}>
                <Box sx={settingsSwitchRowSx}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                      {field.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                      {profileFieldLocks[field.key] ? 'Locked for users' : 'Editable by users'}
                    </Typography>
                  </Box>

                  <Switch
                    checked={!!profileFieldLocks[field.key]}
                    onChange={(e) =>
                      handleProfileFieldLockChange(field.key, e.target.checked)
                    }
                    color="success"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper elevation={0} sx={settingsCardSx}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                color: '#fff',
                boxShadow: '0 10px 20px rgba(245, 158, 11, 0.18)',
                flexShrink: 0,
              }}
            >
              <Payment fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                Self Donation QR
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Upload or replace the QR image used in self donation.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: 150,
                  borderRadius: 3,
                  bgcolor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {selfDonationQrFile ? (
                  <Box
                    component="img"
                    src={URL.createObjectURL(selfDonationQrFile)}
                    alt="Selected QR"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : selfDonationQrUrl ? (
                  <Box
                    component="img"
                    src={
                      selfDonationQrUrl.startsWith('http')
                        ? selfDonationQrUrl
                        : `${FILE_BASE_URL}${selfDonationQrUrl}`
                    }
                    alt="Self Donation QR"
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                    No QR Uploaded
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Download />}
                sx={{
                  ...premiumCancelButtonSx,
                  mb: 1,
                }}
              >
                Select QR Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelfDonationQrFile(file);
                    }
                  }}
                />
              </Button>

              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                Supported formats: PNG, JPG, JPEG. The selected image will upload when you click Save Settings.
              </Typography>

              {selfDonationQrUploading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={18} sx={{ color: '#f97316' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                    Uploading QR...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    )}
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={() => setSettingsDialogOpen(false)}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSaveSettings}
      disabled={settingsSaving || settingsLoading || selfDonationQrUploading}
      startIcon={
        settingsSaving || selfDonationQrUploading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <Save />
        )
      }
      sx={premiumPrimaryButtonSx}
    >
      {settingsSaving || selfDonationQrUploading ? 'Saving...' : 'Save Settings'}
    </Button>
  </DialogActions>
</Dialog>
        {/* Admin - Reset Password Dialog */}
      <Dialog
  open={passwordResetOpen}
  onClose={closePasswordReset}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle
    sx={{
      ...premiumDialogTitleSx,
      background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <LockReset />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Reset User Password
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          {passwordResetUser?.id
            ? `User ID: ${passwordResetUser.id}`
            : 'Reset password to Date of Birth format'}
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={closePasswordReset}
      disabled={passwordResetLoading}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.22)',
        },
        '&.Mui-disabled': {
          color: 'rgba(255,255,255,0.55)',
        },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.16)',
              '& .MuiAlert-icon': {
                color: '#f97316',
              },
            }}
          >
            This will reset the user&apos;s password to their Date of Birth.
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: '#f8fafc',
              border: '1px solid rgba(226, 232, 240, 0.9)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                fontWeight: 700,
                mb: 0.75,
              }}
            >
              New password format
            </Typography>

            <Chip
              label="DDMMYYYY"
              variant="outlined"
              sx={{
                bgcolor: 'rgba(124, 58, 237, 0.10)',
                color: '#6d28d9',
                border: '1px solid rgba(124, 58, 237, 0.20)',
                fontWeight: 900,
                borderRadius: '10px',
                letterSpacing: '0.04em',
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                mt: 1,
              }}
            >
              Password will be generated without slash, dash, or spaces.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'rgba(239, 246, 255, 0.75)',
              border: '1px solid rgba(37, 99, 235, 0.14)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#334155',
                fontWeight: 700,
              }}
            >
              Example
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                mt: 0.5,
              }}
            >
              If DOB is <strong>17 April 2002</strong>, password will be{' '}
              <strong>17042002</strong>.
            </Typography>
          </Box>
        </Grid>

        {passwordResetUser?.dateOfBirth && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#0f172a',
                  fontWeight: 900,
                }}
              >
                User DOB
              </Typography>

              <Chip
                label={passwordResetUser.dateOfBirth}
                size="small"
                variant="outlined"
                sx={{
                  bgcolor: '#fff',
                  color: '#15803d',
                  border: '1px solid rgba(22, 163, 74, 0.22)',
                  fontWeight: 900,
                  borderRadius: '10px',
                }}
              />
            </Box>
          </Grid>
        )}

        {passwordResetUser && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: '#fff7ed',
                border: '1px solid rgba(249, 115, 22, 0.16)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#0f172a',
                  fontWeight: 900,
                  mb: 0.4,
                }}
              >
                Selected User
              </Typography>

              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
                {combineFullName(passwordResetUser.name, passwordResetUser.surname) ||
                  passwordResetUser.name ||
                  '-'}
              </Typography>

              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                {passwordResetUser.email || passwordResetUser.mobileNumber || ''}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={closePasswordReset}
      disabled={passwordResetLoading}
      sx={premiumCancelButtonSx}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={submitPasswordReset}
      disabled={passwordResetLoading}
      startIcon={
        passwordResetLoading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <LockReset />
        )
      }
      sx={{
        ...premiumPrimaryButtonSx,
        background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
        boxShadow: '0 10px 22px rgba(124, 58, 237, 0.24)',
        '&:hover': {
          background: 'linear-gradient(135deg, #6d28d9 0%, #7e22ce 100%)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {passwordResetLoading ? 'Resetting...' : 'Confirm Reset'}
    </Button>
  </DialogActions>
</Dialog>

        {/* Admin - Trash (Deleted Users) Dialog */}
       {/* Admin - Trash (Deleted Users) Dialog */}
<Dialog
  open={trashOpen}
  onClose={closeTrash}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: premiumDialogPaperSx,
  }}
>
  <DialogTitle
    sx={{
      ...premiumDialogTitleSx,
      background: 'linear-gradient(135deg, #334155 0%, #dc2626 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <DeleteSweep />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Trash
        </Typography>

        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
          Deleted users can be restored or permanently removed
        </Typography>
      </Box>
    </Box>

    <IconButton
      onClick={closeTrash}
      sx={{
        color: '#fff',
        bgcolor: 'rgba(255,255,255,0.14)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.22)',
        },
      }}
    >
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={premiumDialogContentSx}>
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          background:
            'linear-gradient(135deg, rgba(248,250,252,0.96) 0%, rgba(254,242,242,0.78) 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Deleted Users
          </Typography>

          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            {trashLoading
              ? 'Loading deleted users...'
              : `${trashUsers.length} deleted users visible`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<RestoreFromTrash sx={{ fontSize: 18 }} />}
            onClick={handleRestoreAllTrash}
            disabled={!Array.isArray(trashUsers) || trashUsers.length === 0}
            sx={{
              borderRadius: 3,
              px: 2,
              py: 0.9,
              fontWeight: 800,
              textTransform: 'none',
              color: '#15803d',
              borderColor: 'rgba(22, 163, 74, 0.30)',
              bgcolor: '#fff',
              '&:hover': {
                borderColor: '#16a34a',
                bgcolor: 'rgba(22, 163, 74, 0.08)',
              },
            }}
          >
            Restore All
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<DeleteSweep sx={{ fontSize: 18 }} />}
            onClick={handleClearTrash}
            disabled={!Array.isArray(trashUsers) || trashUsers.length === 0}
            sx={{
              borderRadius: 3,
              px: 2,
              py: 0.9,
              fontWeight: 800,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              boxShadow: '0 10px 20px rgba(220, 38, 38, 0.20)',
              '&:hover': {
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255,255,255,0.75)',
                opacity: 0.75,
              },
            }}
          >
            Clear Trash
          </Button>
        </Box>
      </Box>

      {trashLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, p: 6 }}>
          <CircularProgress size={24} sx={{ color: '#dc2626' }} />
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700 }}>
            Loading deleted users...
          </Typography>
        </Box>
      ) : trashUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <DeleteSweep sx={{ fontSize: 52, color: '#cbd5e1', mb: 1 }} />

          <Typography variant="h6" sx={{ color: '#475569', fontWeight: 900 }}>
            No deleted users found
          </Typography>

          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.75, fontWeight: 600 }}>
            Soft-deleted users will appear here.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            bgcolor: '#fff',
          }}
        >
          <Table
            size="small"
            sx={{
              minWidth: 900,
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderCellSx}>User</TableCell>
                <TableCell sx={tableHeaderCellSx}>Email</TableCell>
                <TableCell sx={tableHeaderCellSx}>Mobile</TableCell>
                <TableCell sx={tableHeaderCellSx}>Role</TableCell>
                <TableCell sx={tableHeaderCellSx}>Deleted At</TableCell>
                <TableCell align="right" sx={tableHeaderCellSx}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(Array.isArray(trashUsers) ? trashUsers : []).map((u) => (
                <TableRow
                  key={u.id}
                  hover
                  sx={{
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      bgcolor: 'rgba(254, 242, 242, 0.65)',
                    },
                  }}
                >
                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                      {combineFullName(u.name, u.surname) || u.name || '-'}
                    </Typography>

                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                      {u.id}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                      {u.email || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                      {u.mobileNumber || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Chip
                      label={getRoleLabel(u.role)}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getRoleChipSx(u.role),
                        fontWeight: 900,
                        borderRadius: '10px',
                      }}
                    />
                  </TableCell>

                  <TableCell sx={tableBodyCellSx}>
                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 800 }}>
                      {formatDate(u.deletedAt) || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={tableBodyCellSx}>
                    <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRestoreUser(u.id)}
                        startIcon={<RestoreFromTrash />}
                        sx={{
                          borderRadius: 3,
                          fontWeight: 800,
                          textTransform: 'none',
                          color: '#15803d',
                          borderColor: 'rgba(22, 163, 74, 0.30)',
                          '&:hover': {
                            borderColor: '#16a34a',
                            bgcolor: 'rgba(22, 163, 74, 0.08)',
                          },
                        }}
                      >
                        Restore
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePermanentDeleteFromTrash(u.id)}
                        startIcon={<DeleteForever />}
                        sx={{
                          borderRadius: 3,
                          fontWeight: 800,
                          textTransform: 'none',
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: '0 8px 18px rgba(220, 38, 38, 0.18)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={trashTotalUsers}
        page={trashPage}
        onPageChange={(_, newPage) => setTrashPage(newPage)}
        rowsPerPage={trashRowsPerPage}
        onRowsPerPageChange={(e) => {
          setTrashRowsPerPage(parseInt(e.target.value, 10));
          setTrashPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from + 1}-${Math.min(to + 1, count)} of ${count}`
        }
        labelRowsPerPage="Rows per page:"
        sx={{
          borderTop: '1px solid rgba(226, 232, 240, 0.95)',
          bgcolor: '#f8fafc',
          color: '#475569',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 800,
            color: '#64748b',
          },
        }}
      />
    </Paper>
  </DialogContent>

  <DialogActions sx={premiumDialogActionsSx}>
    <Button
      variant="outlined"
      onClick={closeTrash}
      sx={premiumCancelButtonSx}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

      </Box>
    </Layout>
  );
};

export default AdminDashboard;