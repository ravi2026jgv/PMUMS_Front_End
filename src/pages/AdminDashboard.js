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
} from '@mui/icons-material';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';

import { adminAPI, managerAPI, FILE_BASE_URL } from '../services/api';

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
const [selfDonationQrUrl, setSelfDonationQrUrl] = useState('');
const [selfDonationQrFile, setSelfDonationQrFile] = useState(null);
const [selfDonationQrUploading, setSelfDonationQrUploading] = useState(false);
  // Admin User Management - Details/Edit + Password Reset dialogs
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [userDetailsSaving, setUserDetailsSaving] = useState(false);
  const [userDetailsUser, setUserDetailsUser] = useState(null);
  const [userDetailsForm, setUserDetailsForm] = useState({
    name: '',
    surname: '',
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
  const [passwordResetForm, setPasswordResetForm] = useState({ newPassword: '', confirmPassword: '' });

  // Admin User Management - Trash (Deleted Users)
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
  
  // Role Assignment Dialog States
  const [roleAssignmentDialog, setRoleAssignmentDialog] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [roleAssignmentData, setRoleAssignmentData] = useState({
    role: '',
    sambhagIds: [],
  districtIds: [],
  blockIds: []
  });
  
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
const openSettingsDialog = async () => {
  try {
    setSettingsDialogOpen(true);
    setSettingsLoading(true);

    const [
      mobileOtpResponse,
      exportMobileResponse,
      selfDonationVisibleResponse,
      selfDonationQrResponse,
    ] = await Promise.all([
      adminAPI.getMobileOtpSetting(),
      adminAPI.getExportMobileNumberSetting(),
      adminAPI.getSelfDonationVisibleSetting(),
      adminAPI.getSelfDonationQr(),
    ]);

    setMobileOtpEnabled(mobileOtpResponse.data?.mobileOtpEnabled === true);
    setExportMobileNumberEnabled(
      exportMobileResponse.data?.exportMobileNumberEnabled === true
    );
    setSelfDonationVisible(
      selfDonationVisibleResponse.data?.selfDonationVisible === true
    );
    setSelfDonationQrUrl(selfDonationQrResponse.data?.qrUrl || '');
    setSelfDonationQrFile(null);
  } catch (error) {
    console.error('Error loading settings:', error);
    showSnackbar('Failed to load settings!', 'error');
  } finally {
    setSettingsLoading(false);
  }
};

const handleSaveSettings = async () => {
  try {
    setSettingsSaving(true);

    await Promise.all([
      adminAPI.updateMobileOtpSetting(mobileOtpEnabled),
      adminAPI.updateExportMobileNumberSetting(exportMobileNumberEnabled),
      adminAPI.updateSelfDonationVisibleSetting(selfDonationVisible),
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
      // IMPORTANT: backend filter uses status=DELETED
      const response = await adminAPI.getUsers(trashPage, trashRowsPerPage, { status: 'DELETED' });

      if (response.data && response.data.users) {
        setTrashUsers(response.data.users || []);
        setTrashTotalUsers(response.data.totalElements || 0);
      } else {
        setTrashUsers(response.data || []);
        setTrashTotalUsers((response.data || []).length);
      }
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
      await adminAPI.restoreUser(userId);
      showSnackbar('User restored successfully!', 'success');
      fetchUsers();
      fetchTrashUsers();
    } catch (error) {
      console.error('Error restoring user:', error);
      showSnackbar('Error restoring user!', 'error');
    }
  };

  const handlePermanentDeleteFromTrash = async (userId) => {
    const ok = window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.');
    if (!ok) return;

    try {
      await adminAPI.permanentDeleteUser(userId);
      showSnackbar('User permanently deleted successfully!', 'success');
      fetchUsers();
      fetchTrashUsers();
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      showSnackbar('Error permanently deleting user!', 'error');
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
      name: user?.name || '',
      surname: user?.surname || '',
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

      // Build payload (UpdateUserRequest shape)
      const payload = {
        ...userDetailsForm,
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
    setPasswordResetForm({ newPassword: '', confirmPassword: '' });
    setPasswordResetOpen(true);
  };

  const closePasswordReset = () => {
    setPasswordResetOpen(false);
    setPasswordResetUser(null);
    setPasswordResetForm({ newPassword: '', confirmPassword: '' });
  };

  const submitPasswordReset = async () => {
    if (!passwordResetUser?.id) return;

    if (!passwordResetForm.newPassword || !passwordResetForm.confirmPassword) {
      showSnackbar('Please enter new password and confirm password', 'error');
      return;
    }

    if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
      showSnackbar('New password and confirm password do not match', 'error');
      return;
    }

    try {
      setPasswordResetLoading(true);
      await adminAPI.resetUserPassword(passwordResetUser.id, passwordResetForm);
      showSnackbar('Password reset successfully!', 'success');
      closePasswordReset();
    } catch (error) {
      console.error('Error resetting password:', error);
      showSnackbar('Failed to reset password!', 'error');
    } finally {
      setPasswordResetLoading(false);
    }
  };


  const handleDeleteUser = async (user) => {
    const userId = typeof user === 'string' ? user : user?.id;
    const status = typeof user === 'string' ? null : (user?.status || '');
    const isSoftDeleted = (status || '').toLowerCase() === 'deleted';

    const message = isSoftDeleted
      ? 'This user is already soft-deleted. Do you want to PERMANENTLY delete this user? This cannot be undone.'
      : 'Are you sure you want to delete this user? (Soft delete)';

    if (!window.confirm(message)) return;

    try {
      if (isSoftDeleted) {
        // Permanent delete (hard delete)
        await adminAPI.permanentDeleteUser(userId);
        showSnackbar('User permanently deleted successfully!', 'success');
      } else {
        // Soft delete
        await adminAPI.deleteUser(userId);
        showSnackbar('User deleted successfully!', 'success');
      }
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar(isSoftDeleted ? 'Error permanently deleting user!' : 'Error deleting user!', 'error');
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
    await Promise.all(selectedUserIds.map((id) => adminAPI.deleteUser(id)));
    showSnackbar('Selected users deleted successfully!', 'success');
    setSelectedUserIds([]);
    fetchUsers();
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

    const params = {
      month: dashboardExportMonth,
      year: dashboardExportYear,
    };

    if (dashboardExportBeneficiary) {
      params.beneficiary = dashboardExportBeneficiary;
    }

    const response = await adminAPI.exportSahyog(params);

    downloadBlobFile(
      response.data,
      `sahyog_${dashboardExportMonth}_${dashboardExportYear}.csv`
    );

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

    const params = {
      month: dashboardExportMonth,
      year: dashboardExportYear,
    };

    if (dashboardExportBeneficiary) {
      params.beneficiary = dashboardExportBeneficiary;
    }

    const response = await adminAPI.exportAsahyog(params);

    downloadBlobFile(
      response.data,
      `asahyog_${dashboardExportMonth}_${dashboardExportYear}.csv`
    );

    setDashboardExportDialog(false);
    showSnackbar('Asahyog exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting asahyog:', error);
    showSnackbar('Error exporting asahyog!', 'error');
  } finally {
    setExportLoading(false);
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
  setDashboardExportBeneficiary('');
  setDashboardExportMonth(new Date().getMonth() + 1);
  setDashboardExportYear(new Date().getFullYear());

  if ((type === 'sahyog' || type === 'asahyog') && deathCases.length === 0) {
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
    alert('Export button clicked!'); // Test if function is called
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
      
      // For testing, let's add some mock data if API fails
      const mockData = [
        {
          id: 1,
          deceasedName: 'Ram Sharma',
          employeeCode: 'EMP001',
          department: 'Education Department',
          district: 'Bhopal',
          nominee1Name: 'Sita Sharma',
          nominee2Name: null,
          status: 'OPEN',
          caseDate: new Date().toISOString()
        },
        {
          id: 2,
          deceasedName: 'Shyam Verma',
          employeeCode: 'EMP002', 
          department: 'Health Department',
          district: 'Indore',
          nominee1Name: 'Geeta Verma',
          nominee2Name: 'Raj Verma',
          status: 'CLOSED',
          caseDate: new Date().toISOString()
        }
      ];
      console.log('Using mock data for testing:', mockData);
      setDeathCases(mockData);
      showSnackbar('Could not load data from API, showing test data!', 'warning');
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

  const handleExportData = (type) => {
    // Implementation for Excel export
    showSnackbar(`${type} Data exported`, 'success');
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
    (c) => (c.caseStatus || c.status) === "OPEN"
  );

  const handleRebalance = async () => {
    try {
      setExportLoading(true); // reusing existing loading state (minimal)
      await adminAPI.rebalancePools(true); // we’ll add this in services/api.js
      showSnackbar("Rebalance completed successfully!", "success");

      // refresh list after rebalance
      await fetchDeathCases();
    } catch (e) {
      console.error(e);
      showSnackbar(e.response?.data?.message || "Rebalance failed!", "error");
    } finally {
      setExportLoading(false);
    }
  };

  return (
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
          Active Pool List ({activePools.length})
        </Typography>

        <Button
          variant="contained"
          onClick={handleRebalance}
          disabled={exportLoading}
          sx={{ bgcolor: "#1565c0" }}
        >
          {exportLoading ? "Rebalancing..." : "Rebalance"}
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#E3F2FD" }}>
              <TableCell><strong>Deceased Name</strong></TableCell>
              <TableCell><strong>Employee Code</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>District</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {deathCasesLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading pools...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : activePools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No Active Pool found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              activePools.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.deceasedName}</TableCell>
                  <TableCell>{p.employeeCode}</TableCell>
                  <TableCell>{p.department}</TableCell>
                  <TableCell>{p.district}</TableCell>
                  <TableCell>{p.caseStatus || p.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
  // Check if any filter is active
  const hasActiveFilters = filters.userId || filters.name || filters.mobileNumber || filters.email;
const selectableUsers = users.filter((u) => u.role !== 'ROLE_ADMIN');
  // Render functions for different tabs
  const renderUsersTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          User Management ({usersLoading ? 'Loading...' : `${totalUsers} of ${users.length} shown`})
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
  variant="contained"
  color="error"
  size="small"
  onClick={handleBulkSoftDelete}
  disabled={selectedUserIds.length === 0}
  startIcon={<Delete />}
  sx={{ borderRadius: 2 }}
>
  Bulk Delete ({selectedUserIds.length})
</Button>
          <Button
            variant="outlined"
            size="small"
            onClick={openTrash}
            startIcon={<DeleteSweep />}
            sx={{ borderRadius: 2 }}
          >
            Trash
          </Button>
        </Box>
      </Box>
      
      {/* Search Filters */}
      <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by User ID"
              value={filters.userId || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#1565c0' },
                  '&.Mui-focused': { borderColor: '#1976d2' }
                }
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
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#1565c0' },
                  '&.Mui-focused': { borderColor: '#1976d2' }
                }
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
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  '&:hover': { borderColor: '#1565c0' },
                  '&.Mui-focused': { borderColor: '#1976d2' }
                }
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
              color="error"
              startIcon={<Clear />}
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              sx={{ height: '40px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#e3f2fd' }}>
               <TableCell padding="checkbox">
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
/>
  </TableCell>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email/Phone</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Location</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Last Login</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Loading user data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No User found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : users.map((user) => (
              <TableRow key={user.id} hover>
                  <TableCell padding="checkbox">
     {user.role !== 'ROLE_ADMIN' ? (
    <Checkbox
      checked={selectedUserIds.includes(user.id)}
      onChange={() => handleSelectUser(user.id)}
    />
  ) : null}
  </TableCell>
                <TableCell>
  <Typography variant="body2" sx={{ fontWeight: 500 }}>
    {user.id || '-'}
  </Typography>
</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    <Phone sx={{ fontSize: 12, mr: 0.5 }} />
                    {user.mobileNumber || user.phone || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getRoleLabel(user.role)} 
                    size="small"
                    sx={{ 
                      bgcolor: user.role === 'ROLE_ADMIN' ? '#f44336' : 
                              (user.role && user.role.includes('MANAGER')) ? '#ff9800' : '#2196f3',
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                    {(user.departmentSambhag || user.sambhag || 'N/A')}/{(user.departmentDistrict || user.district || 'N/A')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(user.status)}
                    size="small"
                    sx={{ 
                      bgcolor: getStatusColor(user.status),
                      color: 'white'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('hi-IN') : 
                     user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('hi-IN') : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
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
                      sx={{
                        bgcolor: '#1976d220',
                        '&:hover': {
                          bgcolor: '#1976d240'
                        }
                      }}
                    >
                      <ManageAccounts fontSize="small" sx={{ color: '#1976d2' }} />
                    </IconButton>
                    {/* Remove Manager Access button - only show for manager roles */}
                    {user.role && (user.role.includes('MANAGER') || user.role.includes('manager')) && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveAllManagerAccess(user)}
                        title="Remove Manager Access"
                        sx={{
                          bgcolor: '#ff980020',
                          '&:hover': {
                            bgcolor: '#ff980040'
                          }
                        }}
                      >
                        <RemoveCircleOutline fontSize="small" sx={{ color: '#ff9800' }} />
                      </IconButton>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleUpdateUserStatus(user.id, user.status?.toLowerCase() === 'blocked' ? 'active' : 'blocked')}
                      title={user.status?.toLowerCase() === 'blocked' ? 'Unblock' : 'Block'}
                      color={user.status?.toLowerCase() === 'blocked' ? 'success' : 'error'}
                      sx={{
                        bgcolor: user.status?.toLowerCase() === 'blocked' ? '#4caf5020' : '#f4433620',
                        '&:hover': {
                          bgcolor: user.status?.toLowerCase() === 'blocked' ? '#4caf5040' : '#f4433640'
                        }
                      }}
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
                      sx={{
                        bgcolor: '#2196f320',
                        '&:hover': { bgcolor: '#2196f340' },
                      }}
                    >
                      <InfoOutlined fontSize="small" sx={{ color: '#2196f3' }} />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => openPasswordReset(user)}
                      title="Reset Password"
                      sx={{
                        bgcolor: '#9c27b020',
                        '&:hover': { bgcolor: '#9c27b040' },
                      }}
                    >
                      <LockReset fontSize="small" sx={{ color: '#9c27b0' }} />
                    </IconButton>

                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteUser(user)}
                      title={(user.status || '').toLowerCase() === 'deleted' ? 'Permanent Delete' : 'Soft Delete'}
                      sx={{
                        bgcolor: (user.status || '').toLowerCase() === 'deleted' ? '#d32f2f20' : '#f4433620',
                        '&:hover': {
                          bgcolor: (user.status || '').toLowerCase() === 'deleted' ? '#d32f2f40' : '#f4433640'
                        }
                      }}
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
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Death Assistance Cases ({deathCases.length})
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => setDeathCasesListExpanded(!deathCasesListExpanded)}
            sx={{ color: '#d32f2f' }}
          >
            {deathCasesListExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setCreateDeathCaseDialog(true)}
            sx={{ bgcolor: '#d32f2f' }}
          >
            New Case
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Download />}
            onClick={async () => {
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
            }}
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export'}
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#ffebee' }}>
              <TableCell><strong>Deceased Name</strong></TableCell>
              <TableCell><strong>Employee Code</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>District</strong></TableCell>
              <TableCell><strong>Nominee</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deathCasesLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading death cases...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : deathCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No Death Case found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : deathCases.map((deathCase) => (
              <TableRow key={deathCase.id || deathCase.caseId || deathCase.deathCaseId || Math.random()} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {deathCase.deceasedName}
                  </Typography>
                  {deathCase.caseDate && (
                    <Typography variant="caption" color="textSecondary">
                      {new Date(deathCase.caseDate).toLocaleDateString('hi-IN')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {deathCase.employeeCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {deathCase.department}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {deathCase.district}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    {deathCase.nominee1Name && (
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {deathCase.nominee1Name}
                      </Typography>
                    )}
                    {deathCase.nominee2Name && (
                      <Typography variant="caption" color="textSecondary">
                        + {deathCase.nominee2Name}
                      </Typography>
                    )}
                    {!deathCase.nominee1Name && !deathCase.nominee2Name && (
                      <Typography variant="caption" color="textSecondary">
                        No Nominee
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip 
                      label={deathCase.status === 'OPEN' ? 'Open' : 'Closed'}
                      size="small"
                      sx={{ 
                        bgcolor: deathCase.status === 'OPEN' ? '#4caf50' : '#f44336',
                        color: 'white'
                      }}
                    />
                    {(deathCase.isHidden === true) && (
                      <Chip
                        label="Hidden"
                        size="small"
                        icon={<Lock fontSize="small" />}
                        sx={{
                          bgcolor: '#f44336',
                          color: 'white',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        console.log('Selected death case for view:', deathCase);
                        setSelectedDeathCase(deathCase);
                        setDeathCaseDialog(true);
                      }}
                      title="View Details"
                      color="primary"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                                        <IconButton
                      size="small"
                      onClick={() => handleEditDeathCase(deathCase)}
                      title="Edit"
                      color="warning"
                      sx={{
                        bgcolor: '#ff980020',
                        '&:hover': {
                          bgcolor: '#ff980040'
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        console.log('Death case object:', deathCase);
                        const id = deathCase.id || deathCase.caseId || deathCase.deathCaseId;
                        console.log('Extracted ID:', id);
                        handleUpdateDeathCaseStatus(id, deathCase.status === 'OPEN' ? 'close' : 'open');
                      }}
                      title={deathCase.status === 'OPEN' ? 'Close' : 'Open'}
                      sx={{
                        color: deathCase.status === 'OPEN' ? '#4caf50' : '#f44336',
                        bgcolor: deathCase.status === 'OPEN' ? '#4caf5020' : '#f4433620',
                        '&:hover': {
                          bgcolor: deathCase.status === 'OPEN' ? '#4caf5040' : '#f4433640'
                        }
                      }}
                    >
                      <Lock fontSize="small" />
                    </IconButton>
                    {deathCase.nominee1QrCode && (
                      <IconButton 
                        size="small" 
                        onClick={() => window.open(deathCase.nominee1QrCode, '_blank')}
                        title="Nominee 1 QR Code"
                        color="success"
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    )}
                    {deathCase.nominee2QrCode && (
                      <IconButton 
                        size="small" 
                        onClick={() => window.open(deathCase.nominee2QrCode, '_blank')}
                        title="Nominee 2 QR Code"
                        color="success"
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderPaymentsTab = () => (
    <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 3, bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
  Receipts Management ({totalReceipts})
</Typography>

<Button
  variant="outlined"
  startIcon={<Download />}
  onClick={() => handleExportData('receipts')}
>
  Export
</Button>
      </Box>
       {receiptsLoading ? (
             <Box sx={{ p: 3 }}>
               <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
               <Typography sx={{ mt: 2, textAlign: 'center', color: '#666' }}>
                 Receipts लोड हो रहे हैं...
               </Typography>
             </Box>
           ) : receipts.length === 0 ? (
             <Box sx={{ p: 4, textAlign: 'center' }}>
               <Payment sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
               <Typography variant="h6" sx={{ color: '#666' }}>
                 कोई receipt उपलब्ध नहीं है
               </Typography>
               <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                 जैसे ही users payment proof submit करेंगे, यहाँ list दिखाई देगी।
               </Typography>
             </Box>
           ) : (
             <TableContainer>
              <Table>
  <TableHead>
    <TableRow sx={{ bgcolor: '#1976d2' }}>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reg No</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sambhag</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>District</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Block</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Payment Date</TableCell>
      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {receipts.map((r, index) => (
      <TableRow
        key={`${r.regNo || 'row'}-${index}`}
        sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}
      >
        <TableCell>{r.regNo ?? '-'}</TableCell>
        <TableCell>{r.name ?? '-'}</TableCell>
        <TableCell>{r.sambhag ?? '-'}</TableCell>
        <TableCell>{r.district ?? '-'}</TableCell>
        <TableCell>{r.block ?? '-'}</TableCell>
        <TableCell>{r.department ?? '-'}</TableCell>
        <TableCell>{formatDate(r.paymentDate)}</TableCell>
        <TableCell>₹{r.amount ?? '-'}</TableCell>
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

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #d32f2f 50%, #f57c00 100%)',
        py: 4,
        fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif',
        '& *': {
          fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif !important',
        }
      }}>
        <Container maxWidth="xl">
          {/* Admin Header */}
          <Paper 
            elevation={24} 
            sx={{ 
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Box sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AdminPanelSettings sx={{ 
                    fontSize: 48,
                    color: '#d32f2f'
                  }} />
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}>
                      Admin Dashboard
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      Complete Management Control Center
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={`Welcome, ${currentUser?.name || 'Admin'}`}
                  color="error"
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 2.5,
                    px: 1
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Stats Cards */}
          {/* <Grid container spacing={3} sx={{ mb: 4 }}>
            {adminStats.map((stat, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  elevation={12}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(26, 35, 126, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                          color: 'white',
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.growth.startsWith('+') ? '#4caf50' : '#f44336',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                        }}
                      >
                        {stat.growth}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> */}

          {/* Quick Action Panel */}
          <Paper elevation={12} sx={{ borderRadius: 4, mb: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => setExportDialog(true)}
                    sx={{ 
                      bgcolor: '#2196f3',
                      py: 2,
                      '&:hover': { bgcolor: '#1976d2' }
                    }}
                  >
                    User Export
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Assignment />}
                    onClick={() => setActiveTab(1)}
                    sx={{ 
                      bgcolor: '#4caf50',
                      py: 2,
                      '&:hover': { bgcolor: '#388e3c' }
                    }}
                  >
                    Death Cases
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
  <Button
    fullWidth
    variant="contained"
    startIcon={<Settings />}
    onClick={openSettingsDialog}
    sx={{
      bgcolor: '#ff9800',
      py: 2,
      '&:hover': { bgcolor: '#f57c00' }
    }}
  >
    Settings
  </Button>
</Grid>
<Grid item xs={12} sm={6} md={3}>
  <Button
    fullWidth
    variant="contained"
    startIcon={<Download />}
    onClick={() => openDashboardExportDialog('sahyog')}
    sx={{
      bgcolor: '#00695c',
      py: 2,
      '&:hover': { bgcolor: '#004d40' }
    }}
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
    sx={{
      bgcolor: '#6a1b9a',
      py: 2,
      '&:hover': { bgcolor: '#4a148c' }
    }}
  >
    Export Asahyog
  </Button>
</Grid>
<Grid item xs={12} sm={6} md={3}>
  <Button
    fullWidth
    variant="contained"
    startIcon={<Download />}
    onClick={() => openDashboardExportDialog('pending-profiles')}
    sx={{
      bgcolor: '#ef6c00',
      py: 2,
      '&:hover': { bgcolor: '#e65100' }
    }}
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
    sx={{
      bgcolor: '#8e24aa',
      py: 2,
      '&:hover': { bgcolor: '#6a1b9a' }
    }}
  >
    {exportLoading ? 'Sending...' : 'Mail Insurance Excel'}
  </Button>
</Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Main Management Tabs */}
          <Paper elevation={12} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: '#f5f5f5',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  minHeight: 60,
                },
              }}
            >
              <Tab 
                icon={<People />} 
                label="User Management" 
                iconPosition="start"
              />
              <Tab 
                icon={<Assignment />} 
                label="Death Assistance Cases" 
                iconPosition="start"
              />
                <Tab label="Pool"iconPosition="start"  icon={<Assignment />} />
            <Tab icon={<Payment />} iconPosition="start" label="Receipts" />
          
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && renderUsersTab()}
              {activeTab === 1 && renderDeathCasesTab()}
               {activeTab === 2 && renderPoolTab()}
              {activeTab === 3 && renderPaymentsTab()}
             
              {/* {activeTab === 3 && renderQueriesTab()} */}
              {activeTab === 4 && renderAssignmentsTab()}
              {activeTab === 5 && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>Role Management</Typography>
                  <Typography>
                    Here you can manage various roles: Admin, Division Manager, District Manager, Block Manager.
                    Each role has its own rights and responsibilities.
                  </Typography>
                </Alert>
              )}
            </Box>
          </Paper>
        </Container>

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
        <Dialog 
          open={roleAssignmentDialog} 
          onClose={() => setRoleAssignmentDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
            Role Assignment
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            {selectedUserForRole && (
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Selected User: {selectedUserForRole.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedUserForRole.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current Role: {selectedUserForRole.role === 'ROLE_USER' ? 'User' : 
                                  selectedUserForRole.role === 'ROLE_SAMBHAG_MANAGER' ? 'Division Manager' :
                                  selectedUserForRole.role === 'ROLE_DISTRICT_MANAGER' ? 'District Manager' :
                                  selectedUserForRole.role === 'ROLE_BLOCK_MANAGER' ? 'Block Manager' : selectedUserForRole.role}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Role Selection */}
              <FormControl fullWidth required>
                <InputLabel>Select New Role</InputLabel>
                <Select
                  value={roleAssignmentData.role}
                  label="Select New Role"
                  onChange={(e) => handleRoleAssignmentChange('role', e.target.value)}
                >
                  {currentUser?.role === 'ROLE_SUPERADMIN' && (
  <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
)}
                  <MenuItem value="ROLE_SAMBHAG_MANAGER">Division Manager</MenuItem>
                  <MenuItem value="ROLE_DISTRICT_MANAGER">District Manager</MenuItem>
                  <MenuItem value="ROLE_BLOCK_MANAGER">Block Manager</MenuItem>
                  <MenuItem value="ROLE_USER">Regular User</MenuItem>
                </Select>
              </FormControl>

              {/* Location Dropdowns - Show based on selected role */}
              {(roleAssignmentData.role === 'ROLE_SAMBHAG_MANAGER' || 
                roleAssignmentData.role === 'ROLE_DISTRICT_MANAGER' || 
                roleAssignmentData.role === 'ROLE_BLOCK_MANAGER') && (
                <FormControl fullWidth required>
                  <InputLabel>Select Division</InputLabel>
                  <Select
  multiple
  value={roleAssignmentData.sambhagIds}
  label="Select Division"
  onChange={(e) => handleRoleAssignmentChange('sambhagIds', e.target.value)}
  disabled={loadingLocations}
 renderValue={(selected) =>
  (availableSambhags || [])
    .filter((s) => (selected || []).includes(s.id))
    .map((s) => s.name)
    .join(', ')
}
>
                   {availableSambhags.map((sambhag) => (
  <MenuItem key={sambhag.id} value={sambhag.id}>
    <Checkbox checked={(roleAssignmentData.sambhagIds || []).includes(sambhag.id)} />
    {sambhag.name}
  </MenuItem>
))}
                    {availableSambhags.length === 0 && !loadingLocations && (
                      <MenuItem disabled>
                        No Division available
                      </MenuItem>
                    )}
                  </Select>
                  {loadingLocations && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                      Loading Divisions...
                    </Typography>
                  )}
                </FormControl>
              )}

              {(roleAssignmentData.role === 'ROLE_DISTRICT_MANAGER' || 
                roleAssignmentData.role === 'ROLE_BLOCK_MANAGER') && roleAssignmentData.sambhagIds.length > 0 && (
                <FormControl fullWidth required>
                  <InputLabel>Select District</InputLabel>
                  <Select
  multiple
  value={roleAssignmentData.districtIds}
  label="Select District"
  onChange={(e) => handleRoleAssignmentChange('districtIds', e.target.value)}
  disabled={loadingLocations}
 renderValue={(selected) =>
  (availableDistricts || [])
    .filter((d) => (selected || []).includes(d.id))
    .map((d) => d.name)
    .join(', ')
}
>
                   {availableDistricts.map((district) => (
  <MenuItem key={district.id} value={district.id}>
   <Checkbox checked={(roleAssignmentData.districtIds || []).includes(district.id)} />
    {district.name}
  </MenuItem>
))}
                    {availableDistricts.length === 0 && !loadingLocations && (
                      <MenuItem disabled>
                        No District available
                      </MenuItem>
                    )}
                  </Select>
                  {loadingLocations && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                      Loading Districts...
                    </Typography>
                  )}
                </FormControl>
              )}

              {roleAssignmentData.role === 'ROLE_BLOCK_MANAGER' && roleAssignmentData.districtIds.length > 0 && (
                <FormControl fullWidth required>
                  <InputLabel>Select Block</InputLabel>
                  <Select
  multiple
  value={roleAssignmentData.blockIds}
  label="Select Block"
  onChange={(e) => handleRoleAssignmentChange('blockIds', e.target.value)}
  disabled={loadingLocations}
 renderValue={(selected) =>
  (availableBlocks || [])
    .filter((b) => (selected || []).includes(b.id))
    .map((b) => b.name)
    .join(', ')
}
>
                   {availableBlocks.map((block) => (
  <MenuItem key={block.id} value={block.id}>
    <Checkbox checked={(roleAssignmentData.blockIds || []).includes(block.id)} />
    {block.name}
  </MenuItem>
))}
                    {availableBlocks.length === 0 && !loadingLocations && (
                      <MenuItem disabled>
                        No Block available
                      </MenuItem>
                    )}
                  </Select>
                  {loadingLocations && (
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                      Loading Blocks...
                    </Typography>
                  )}
                </FormControl>
              )}
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                💡 The user will get appropriate rights and responsibilities according to the selected role.
              </Typography>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setRoleAssignmentDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRoleAssignmentSubmit}
              variant="contained"
              disabled={!roleAssignmentData.role}
              sx={{ bgcolor: '#1976d2' }}
            >
              Assign Role
            </Button>
          </DialogActions>
        </Dialog>
{/* Dashboard Export Dialog */}
<Dialog
  open={dashboardExportDialog}
  onClose={() => setDashboardExportDialog(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: { borderRadius: 3 }
  }}
>
  <DialogTitle sx={{ bgcolor: '#00695c', color: 'white', fontWeight: 'bold' }}>
    {dashboardExportType === 'sahyog'
      ? 'Export Sahyog'
      : dashboardExportType === 'asahyog'
      ? 'Export Asahyog'
      : 'Export Pending Profiles'}
  </DialogTitle>

  <DialogContent sx={{ pt: 3 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
      {(dashboardExportType === 'sahyog' || dashboardExportType === 'asahyog') && (
        <>
          <FormControl fullWidth required>
            <InputLabel>Month</InputLabel>
            <Select
              value={dashboardExportMonth}
              label="Month"
              onChange={(e) => setDashboardExportMonth(e.target.value)}
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
            value={dashboardExportYear}
            onChange={(e) => setDashboardExportYear(parseInt(e.target.value, 10))}
            inputProps={{
              min: 2020,
              max: new Date().getFullYear() + 5
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Select Death Case</InputLabel>
            <Select
              value={dashboardExportBeneficiary}
              label="Select Death Case"
              onChange={(e) => setDashboardExportBeneficiary(e.target.value)}
            >
              <MenuItem value="">All Death Cases</MenuItem>
              {deathCases.map((dc) => (
                <MenuItem key={dc.id} value={dc.deceasedName}>
                  {dc.deceasedName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {dashboardExportType === 'pending-profiles' && (
        <Typography variant="body2" color="textSecondary">
          Pending profiles export will download all pending profile users with current backend filters.
        </Typography>
      )}
    </Box>
  </DialogContent>

  <DialogActions sx={{ p: 3, pt: 1 }}>
    <Button onClick={() => setDashboardExportDialog(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      disabled={
        exportLoading ||
        ((dashboardExportType === 'sahyog' || dashboardExportType === 'asahyog') &&
          (!dashboardExportMonth || !dashboardExportYear))
      }
      startIcon={exportLoading ? <CircularProgress size={18} color="inherit" /> : <Download />}
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
        bgcolor:
          dashboardExportType === 'sahyog'
            ? '#00695c'
            : dashboardExportType === 'asahyog'
            ? '#6a1b9a'
            : '#ef6c00'
      }}
    >
      {exportLoading ? 'Exporting...' : 'Export'}
    </Button>
  </DialogActions>
</Dialog>

        {/* Export Users Dialog */}
        <Dialog 
          open={exportDialog} 
          onClose={() => setExportDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#2196f3', color: 'white', fontWeight: 'bold' }}>
            Export User Data
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Please select Month and Year for export
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Month Selection */}
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

              {/* Year Selection */}
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={exportYear}
                onChange={(e) => setExportYear(parseInt(e.target.value))}
                inputProps={{
                  min: 2020,
                  max: new Date().getFullYear() + 5
                }}
                required
              />
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                💡 User data will be downloaded in CSV format according to selected month and year.
              </Typography>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
  <Button onClick={() => setExportDialog(false)}>
    Cancel
  </Button>

  <Button
    onClick={handleExportAllUsers}
    variant="outlined"
    disabled={exportLoading}
    startIcon={exportLoading ? <CircularProgress size={18} /> : <Download />}
  >
    {exportLoading ? 'Exporting...' : 'Export All'}
  </Button>

  <Button 
    onClick={handleExportUsers}
    variant="contained"
    disabled={exportLoading || !exportMonth || !exportYear}
    startIcon={exportLoading ? <CircularProgress size={18} /> : <Download />}
    sx={{ bgcolor: '#2196f3' }}
  >
    {exportLoading ? 'Exporting...' : 'Export'}
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
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white', fontWeight: 'bold' }}>
            Death Assistance Case Details
          </DialogTitle>
          
          {selectedDeathCase && (
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                      Deceased Information
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {selectedDeathCase.userImage && (
                        <img 
                          src={selectedDeathCase.userImage} 
                          alt="Deceased Photo"
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            marginRight: 16,
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {selectedDeathCase.deceasedName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Code: {selectedDeathCase.employeeCode}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Department:</strong> {selectedDeathCase.department}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>District:</strong> {selectedDeathCase.district}
                    </Typography>
                    {selectedDeathCase.caseDate && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Case Date:</strong> {new Date(selectedDeathCase.caseDate).toLocaleDateString('hi-IN')}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <strong>Status:</strong>{' '}
                      <Chip
                        label={
                          selectedDeathCase.status === 'OPEN' ? 'Open' : 
                          selectedDeathCase.status === 'CLOSED' ? 'Closed' : 
                          selectedDeathCase.status === 'ACTIVE' ? 'Active' :
                          selectedDeathCase.status === 'INACTIVE' ? 'Inactive' :
                          selectedDeathCase.status
                        }
                        size="small"
                        sx={{
                          bgcolor: 
                            selectedDeathCase.status === 'OPEN' ? '#ff9800' : 
                            selectedDeathCase.status === 'CLOSED' ? '#4caf50' : 
                            selectedDeathCase.status === 'ACTIVE' ? '#4caf50' :
                            selectedDeathCase.status === 'INACTIVE' ? '#f44336' :
                            '#f44336',
                          color: 'white',
                          ml: 1
                        }}
                      />
                    </Typography>
                  </Paper>
                </Grid>

                {/* Description */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
                      Details
                    </Typography>
                    <Typography variant="body2">
                      {selectedDeathCase.description || 'No details available'}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Nominee 1 Information */}
                {selectedDeathCase.nominee1Name && (
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: '#e8f5e8' }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
                        First Nominee
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Name:</strong> {selectedDeathCase.nominee1Name}
                      </Typography>
                      {selectedDeathCase.nominee1QrCode && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Download />}
                          onClick={() => window.open(selectedDeathCase.nominee1QrCode, '_blank')}
                          sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}
                        >
                          QR Code Download
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                )}

                {/* Nominee 2 Information */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: selectedDeathCase.nominee2Name ? '#e3f2fd' : '#fafafa' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: selectedDeathCase.nominee2Name ? '#1976d2' : '#757575' }}>
                      Second Nominee
                    </Typography>
                    {selectedDeathCase.nominee2Name ? (
                      <>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <strong>Name:</strong> {selectedDeathCase.nominee2Name}
                        </Typography>
                        {selectedDeathCase.nominee2QrCode && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Download />}
                            onClick={() => window.open(selectedDeathCase.nominee2QrCode, '_blank')}
                            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
                          >
                            QR Code Download
                          </Button>
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No Second Nominee 
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Bank Accounts */}
                {(selectedDeathCase.account1 || selectedDeathCase.account2 || selectedDeathCase.account3) && (
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff3e0' }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#f57c00' }}>
                        Bank Account Information
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedDeathCase.account1 && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Account 1
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Bank:</strong> {selectedDeathCase.account1.bankName}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Account Number:</strong> {selectedDeathCase.account1.accountNumber}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>IFSC:</strong> {selectedDeathCase.account1.ifscCode}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Account Holder:</strong> {selectedDeathCase.account1.accountHolderName}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {selectedDeathCase.account2 && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Account 2
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Bank:</strong> {selectedDeathCase.account2.bankName}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Account Number:</strong> {selectedDeathCase.account2.accountNumber}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>IFSC:</strong> {selectedDeathCase.account2.ifscCode}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Account Holder:</strong> {selectedDeathCase.account2.accountHolderName}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {selectedDeathCase.account3 && (
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Account 3
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Bank:</strong> {selectedDeathCase.account3.bankName}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Account Number:</strong> {selectedDeathCase.account3.accountNumber}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>IFSC:</strong> {selectedDeathCase.account3.ifscCode}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Account Holder:</strong> {selectedDeathCase.account3.accountHolderName}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
          )}
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => {
                setDeathCaseDialog(false);
                setSelectedDeathCase(null);
              }}
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
            sx: { borderRadius: 3 }
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
        >
          <DialogTitle>
            {selectedManagerInfo ? `${selectedManagerInfo.managerName} 's Users` : 'Manager Usersss'}
            <Typography variant="subtitle2" color="textSecondary">
              {selectedManagerInfo && (
                `${selectedManagerInfo.managerLevel === 'SAMBHAG' ? 'Division' : 
                   selectedManagerInfo.managerLevel === 'DISTRICT' ? 'District' : 
                   selectedManagerInfo.managerLevel === 'BLOCK' ? 'Block' : selectedManagerInfo.managerLevel} Manager`
              )}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            {managerUsers.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                No User found
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Mobile</strong></TableCell>
                      <TableCell><strong>Department</strong></TableCell>
                      <TableCell><strong>Location</strong></TableCell>
                      <TableCell><strong>Role</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {managerUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.name} {user.surname}
                          </Typography>
                          {user.fatherName && (
                            <Typography variant="caption" color="textSecondary">
                              {user.fatherName}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobileNumber}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.department}</Typography>
                          {user.schoolOfficeName && (
                            <Typography variant="caption" display="block" color="textSecondary">
                              {user.schoolOfficeName}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {user.departmentBlock && `${user.departmentBlock}, `}
                            {user.departmentDistrict && `${user.departmentDistrict}, `}
                            {user.departmentSambhag}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role === 'ROLE_ADMIN' ? 'Admin' :
                                   user.role === 'ROLE_SAMBHAG_MANAGER' ? 'Division Manager' :
                                   user.role === 'ROLE_DISTRICT_MANAGER' ? 'District Manager' :
                                   user.role === 'ROLE_BLOCK_MANAGER' ? 'Block Manager' : 
                                   'User'}
                            size="small"
                            color={user.role === 'ROLE_ADMIN' ? 'error' : 
                                   user.role.includes('MANAGER') ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status === 'ACTIVE' ? 'Active' : 
                                   user.status === 'BLOCKED' ? 'Blocked' : 'Inactive'}
                            size="small"
                            color={user.status === 'ACTIVE' ? 'success' : 
                                   user.status === 'BLOCKED' ? 'error' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setManagerUsersDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Admin - View/Edit User Details Dialog */}
        <Dialog
          open={userDetailsOpen}
          onClose={closeUserDetails}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User Details</Typography>
              <Typography variant="caption" color="text.secondary">
                {userDetailsUser?.id ? `User ID: ${userDetailsUser.id}` : ''}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={(userDetailsUser?.status || 'ACTIVE').toString()}
              sx={{
                bgcolor: getStatusColor(userDetailsUser?.status),
                color: 'white'
              }}
            />
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Basic Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={userDetailsForm.name}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Surname"
                  value={userDetailsForm.surname}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, surname: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Father Name"
                  value={userDetailsForm.fatherName}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, fatherName: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userDetailsForm.email}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, email: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Country Code"
                  value={userDetailsForm.countryCode}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, countryCode: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={userDetailsForm.mobileNumber}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, mobileNumber: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Gender"
                  value={userDetailsForm.gender}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, gender: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Marital Status"
                  value={userDetailsForm.maritalStatus}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, maritalStatus: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  type="number"
                  value={userDetailsForm.pincode}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, pincode: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Home Address"
                  value={userDetailsForm.homeAddress}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, homeAddress: e.target.value }))}
                />
              </Grid>

              {/* Dates */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 1 }}>
                  Dates
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={userDetailsForm.dateOfBirth}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={userDetailsForm.joiningDate}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, joiningDate: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Retirement Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={userDetailsForm.retirementDate}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, retirementDate: e.target.value }))}
                />
              </Grid>

              {/* Department / Location */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 1 }}>
                  Department / Location
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="School/Office Name"
                  value={userDetailsForm.schoolOfficeName}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, schoolOfficeName: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sankul Name"
                  value={userDetailsForm.sankulName}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, sankulName: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={userDetailsForm.department}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, department: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department Unique ID"
                  value={userDetailsForm.departmentUniqueId}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, departmentUniqueId: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="State"
                  value={userDetailsForm.departmentState}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, departmentState: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Sambhag"
                  value={userDetailsForm.departmentSambhag}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, departmentSambhag: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="District"
                  value={userDetailsForm.departmentDistrict}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, departmentDistrict: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Block"
                  value={userDetailsForm.departmentBlock}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, departmentBlock: e.target.value }))}
                />
              </Grid>

              {/* Nominees */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, mt: 1 }}>
                  Nominees
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nominee 1 Name"
                  value={userDetailsForm.nominee1Name}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, nominee1Name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nominee 1 Relation"
                  value={userDetailsForm.nominee1Relation}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, nominee1Relation: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nominee 2 Name"
                  value={userDetailsForm.nominee2Name}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, nominee2Name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nominee 2 Relation"
                  value={userDetailsForm.nominee2Relation}
                  onChange={(e) => setUserDetailsForm((p) => ({ ...p, nominee2Relation: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeUserDetails} disabled={userDetailsSaving}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={saveUserDetails}
              disabled={userDetailsSaving}
              startIcon={userDetailsSaving ? <CircularProgress size={16} /> : <Save />}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
<Dialog
  open={settingsDialogOpen}
  onClose={() => setSettingsDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 'bold' }}>
    Forgot Password Settings
  </DialogTitle>

  <DialogContent sx={{ pt: 3 }}>
    {settingsLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
  <Box>
    <FormControlLabel
      control={
        <Switch
          checked={mobileOtpEnabled}
          onChange={(e) => setMobileOtpEnabled(e.target.checked)}
          color="warning"
        />
      }
      label="Enable Mobile OTP for Forgot Password"
    />

    <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
      {mobileOtpEnabled
        ? 'Users will reset password using mobile number and OTP.'
        : 'Users will reset password using email and OTP.'}
    </Typography>
  </Box>

  <Box>
    <FormControlLabel
      control={
        <Switch
          checked={exportMobileNumberEnabled}
          onChange={(e) => setExportMobileNumberEnabled(e.target.checked)}
          color="warning"
        />
      }
      label="Enable Mobile Number in Export Reports"
    />

    <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
      {exportMobileNumberEnabled
        ? 'Mobile numbers will be included in exported reports.'
        : 'Mobile numbers will be hidden in exported reports.'}
    </Typography>
  </Box>
  <Box>
  <FormControlLabel
    control={
      <Switch
        checked={selfDonationVisible}
        onChange={(e) => setSelfDonationVisible(e.target.checked)}
        color="warning"
      />
    }
    label="Show Sanstha Sahyog Section"
  />

  <Typography variant="body2" sx={{ mt: 1, color: '#666', mb: 2 }}>
    {selfDonationVisible
      ? 'Sanstha Sahyog section will be visible on website.'
      : 'Sanstha Sahyog section will be hidden from website.'}
  </Typography>

  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
      Upload / Change QR Code
    </Typography>

    {selfDonationQrUrl && (
      <Box sx={{ mb: 2 }}>
        <img
       src={
  selfDonationQrUrl?.startsWith('http')
    ? selfDonationQrUrl
    : `${FILE_BASE_URL}${selfDonationQrUrl}`
}
          alt="Current QR"
          style={{
            width: 180,
            height: 180,
            objectFit: 'contain',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
            background: '#fff'
          }}
        />
      </Box>
    )}

    <Button
      variant="outlined"
      component="label"
      sx={{ borderRadius: 2 }}
      disabled={settingsSaving}
    >
      {selfDonationQrFile ? selfDonationQrFile.name : 'Choose QR Code Image'}
      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => setSelfDonationQrFile(e.target.files?.[0] || null)}
      />
    </Button>

    <Typography variant="caption" display="block" sx={{ mt: 1, color: '#777' }}>
      Upload a single image file for the Sanstha Sahyog QR code.
    </Typography>
  </Box>
</Box>
</Box>
    )}
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => setSettingsDialogOpen(false)} disabled={settingsSaving}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleSaveSettings}
      disabled={settingsSaving || settingsLoading}
      sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}
    >
      {settingsSaving ? 'Saving...' : 'Save'}
    </Button>
  </DialogActions>
</Dialog>
        {/* Admin - Reset Password Dialog */}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  This will reset the user's password without requiring the current password.
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwordResetForm.newPassword}
                  onChange={(e) => setPasswordResetForm((p) => ({ ...p, newPassword: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  value={passwordResetForm.confirmPassword}
                  onChange={(e) => setPasswordResetForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                />
              </Grid>
            </Grid>
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
            >
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>


        {/* Admin - Trash (Deleted Users) Dialog */}
        <Dialog
          open={trashOpen}
          onClose={closeTrash}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Trash</Typography>
              <Typography variant="caption" color="text.secondary">
                Deleted users (soft-deleted). You can restore or permanently delete.
              </Typography>
            </Box>
            {/* <Button onClick={closeTrash} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
              Close
            </Button> */}
          </DialogTitle>

          <DialogContent dividers>
            {trashLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : trashUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No deleted users found.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell><b>User</b></TableCell>
                      <TableCell><b>Email</b></TableCell>
                      <TableCell><b>Mobile</b></TableCell>
                      <TableCell><b>Role</b></TableCell>
                      <TableCell><b>Deleted At</b></TableCell>
                      <TableCell align="right"><b>Actions</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trashUsers.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {u.name} {u.surname}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {u.id}
                          </Typography>
                        </TableCell>
                        <TableCell>{u.email || '-'}</TableCell>
                        <TableCell>{u.mobileNumber || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={u.role === 'ROLE_ADMIN' ? 'Admin' :
                                   u.role === 'ROLE_SAMBHAG_MANAGER' ? 'Division Manager' :
                                   u.role === 'ROLE_DISTRICT_MANAGER' ? 'District Manager' :
                                   u.role === 'ROLE_BLOCK_MANAGER' ? 'Block Manager' : 
                                   'User'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(u.updatedAt) || '-'}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleRestoreUser(u.id)}
                              startIcon={<RestoreFromTrash />}
                              sx={{ borderRadius: 2 }}
                            >
                              Restore
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handlePermanentDeleteFromTrash(u.id)}
                              startIcon={<DeleteForever />}
                              sx={{ borderRadius: 2 }}
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
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={closeTrash}>Close</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Layout>
  );
};

export default AdminDashboard;