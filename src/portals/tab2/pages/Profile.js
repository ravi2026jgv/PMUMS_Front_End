import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  Phone,
  Email,
  Home,
  Work,
  LocationOn,
  CalendarToday,
  Security,
  PersonAdd,
  Badge,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import Layout from '../../../components/Layout/Layout';
import ChangePasswordDialog from '../../../components/ChangePasswordDialog';
import api, { publicApi } from '../../../services/api';
import toast from 'react-hot-toast';
import MembershipCardPopup from '../../../components/MembershipCardPopup';
import {
  getPortalLocalStorageItem,
  setPortalLocalStorageItem,
} from '../../../portal/portalStorage';

const EMPLOYEE_CATEGORIES = [
  'नियमित कर्मचारी',
  'संविदा कर्मचारी',
  'आउटसोर्स कर्मचारी',
  'कंप्यूटर ऑपरेटर/आई.टी. कर्मचारी',
  'आंगनवाड़ी कार्यकर्ता',
  'आंगनवाड़ी सहायिका',
  'अन्य अस्थाई कर्मचारी',
  'विभागीय/संस्थागत व्यवस्था के अंतर्गत कार्यरत कर्मचारी',
];

const DEPARTMENTS = [
  'सामान्य प्रशासन विभाग',
  'गृह विभाग',
  'वित्त विभाग',
  'वाणिज्यिक कर विभाग',
  'राजस्व विभाग',
  'स्कूल शिक्षा विभाग',
  'उच्च शिक्षा विभाग',
  'तकनीकी शिक्षा, कौशल विकास एवं रोजगार विभाग',
  'जनजातीय कार्य विभाग',
  'पिछड़ा वर्ग एवं अल्पसंख्यक कल्याण विभाग',
  'सामाजिक न्याय एवं दिव्यांगजन सशक्तिकरण विभाग',
  'महिला एवं बाल विकास विभाग',
  'पंचायत एवं ग्रामीण विकास विभाग',
  'नगरीय विकास एवं आवास विभाग',
  'लोक निर्माण विभाग',
  'लोक स्वास्थ्य यांत्रिकी विभाग',
  'जल संसाधन विभाग',
  'नर्मदा घाटी विकास विभाग',
  'किसान कल्याण एवं कृषि विकास विभाग',
  'उद्यानिकी एवं खाद्य प्रसंस्करण विभाग',
  'पशुपालन एवं डेयरी विभाग',
  'मछुआ कल्याण एवं मत्स्य विकास विभाग',
  'वन विभाग',
  'पर्यावरण विभाग',
  'श्रम विभाग',
  'स्वास्थ्य एवं परिवार कल्याण विभाग',
  'खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग',
  'सहकारिता विभाग',
  'परिवहन विभाग',
  'ऊर्जा विभाग',
  'नवीन एवं नवकरणीय ऊर्जा विभाग',
  'औद्योगिक नीति एवं निवेश प्रोत्साहन विभाग',
  'सूक्ष्म, लघु एवं मध्यम उद्यम विभाग',
  'कुटीर एवं ग्रामोद्योग विभाग',
  'पर्यटन विभाग',
  'संस्कृति विभाग',
  'खेल एवं युवा कल्याण विभाग',
  'जनसंपर्क विभाग',
  'विज्ञान एवं प्रौद्योगिकी विभाग',
  'सूचना प्रौद्योगिकी/ई-गवर्नेंस संबंधी विभाग',
  'विधि एवं विधायी कार्य विभाग',
  'लोक सेवा प्रबंधन विभाग',
  'योजना, आर्थिक एवं सांख्यिकी विभाग',
  'जनजातीय/अनुसूचित जाति संबंधी कल्याण विभाग',
  'धार्मिक न्यास एवं धर्मस्व विभाग',
  'विमुक्त, घुमक्कड़ एवं अर्द्धघुमक्कड़ जनजाति कल्याण संबंधी विभाग',
  'जेल विभाग',
  'निर्वाचन संबंधी कार्यालय',
  'लोकायुक्त संगठन',
  'मध्यप्रदेश लोक सेवा आयोग',
  'मध्यप्रदेश विधानसभा सचिवालय',
  'राज्य सूचना आयोग',
  'मानव अधिकार आयोग',
];

const currentYear = new Date().getFullYear();
const JOINING_YEARS = Array.from(
  { length: currentYear - 1949 },
  (_, index) => currentYear - index
);

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



const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [membershipCardOpen, setMembershipCardOpen] = useState(false);
const [profileData, setProfileData] = useState(null);
const [profileFieldLocks, setProfileFieldLocks] = useState({
  fullName: false,
  dateOfBirth: false,
  mobileNumber: false,
  email: false,
  departmentUniqueId: false,
});
const [showPasswordDialog, setShowPasswordDialog] = useState(false);  // const [emailChanged, setEmailChanged] = useState(false);

  // Location hierarchy state
  const [locationHierarchy, setLocationHierarchy] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedSambhag, setSelectedSambhag] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  // Filtered options for cascading dropdowns
  const [availableSambhags, setAvailableSambhags] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
// const isDepartmentUniqueIdLocked = false;
const combineFullName = (name, surname) =>
  [name, surname].filter(Boolean).join(' ').trim();

const getTab2FormValues = (profile = {}) => {
  const employeeCategory = profile?.employeeCategory || '';
  const department = profile?.department || '';

  return {
    ...profile,
    fullName: combineFullName(profile?.name, profile?.surname),
    employeeCategory:
      employeeCategory && EMPLOYEE_CATEGORIES.includes(employeeCategory)
        ? employeeCategory
        : employeeCategory
          ? 'OTHER'
          : '',
    otherEmployeeCategory:
      employeeCategory && !EMPLOYEE_CATEGORIES.includes(employeeCategory)
        ? employeeCategory
        : '',
    department:
      department && DEPARTMENTS.includes(department)
        ? department
        : department
          ? 'OTHER'
          : '',
    otherDepartmentName:
      department && !DEPARTMENTS.includes(department)
        ? department
        : '',
    joiningYear: profile?.joiningDate
      ? String(profile.joiningDate).slice(0, 4)
      : '',
  };
};

const hasFieldValue = (value) =>
  value !== null &&
  value !== undefined &&
  value.toString().trim() !== '';

const normalizeRole = (role) =>
  role ? role.toString().replace(/^ROLE_/, '') : '';

const isSuperAdmin =
  normalizeRole(user?.role) === 'SUPERADMIN' ||
  normalizeRole(profileData?.role) === 'SUPERADMIN';

/*
 * SuperAdmin should be able to edit profile fields from frontend
 * even when profile field locks are enabled.
 */
const isFullNameLocked = !isSuperAdmin && Boolean(profileFieldLocks?.fullName);
const isDateOfBirthLocked = !isSuperAdmin && Boolean(profileFieldLocks?.dateOfBirth);
const isMobileNumberLocked = !isSuperAdmin && Boolean(profileFieldLocks?.mobileNumber);
const isEmailLocked = !isSuperAdmin && Boolean(profileFieldLocks?.email);
const isNominee1Locked =
  hasFieldValue(profileData?.nominee1Name) ||
  hasFieldValue(profileData?.nominee1Relation);

const isNominee2Locked =
  hasFieldValue(profileData?.nominee2Name) ||
  hasFieldValue(profileData?.nominee2Relation);



const isFullNameValueLocked =
  isFullNameLocked &&
  hasFieldValue(combineFullName(profileData?.name, profileData?.surname));

const isDateOfBirthValueLocked =
  isDateOfBirthLocked &&
  hasFieldValue(profileData?.dateOfBirth);

const isMobileNumberValueLocked =
  isMobileNumberLocked &&
  hasFieldValue(profileData?.mobileNumber);

const isEmailValueLocked =
  isEmailLocked &&
  hasFieldValue(profileData?.email);

const isDepartmentUniqueIdValueLocked =
  !isSuperAdmin &&
  Boolean(profileFieldLocks?.departmentUniqueId) &&
  hasFieldValue(profileData?.departmentUniqueId);
  
  const isDepartmentUniqueIdLocked = isDepartmentUniqueIdValueLocked;
const {
    register,
    handleSubmit,
    reset,
    control,
    watch,   
    setValue,
    formState: { errors },
  } = useForm();

  // Watch email field for changes
  // const watchedEmail = watch('email');

  // Prevent duplicate API calls
  const locationAbortControllerRef = useRef(null);
  const profileAbortControllerRef = useRef(null);

  // Fetch location hierarchy on component mount
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      // Cancel any ongoing request
      if (locationAbortControllerRef.current) {
        locationAbortControllerRef.current.abort();
      }
      
      // Create new AbortController
      locationAbortControllerRef.current = new AbortController();
      
      try {
        setLoadingLocations(true);
        
        let locationData;
        try {
          const response = await publicApi.get('/locations/hierarchy', {
            signal: locationAbortControllerRef.current.signal
          });
          locationData = response.data;
        } catch (apiErr) {
          // Ignore abortion errors
          if (apiErr.name === 'AbortError' || apiErr.code === 'ERR_CANCELED') {
            return;
          }
          console.warn('Location API failed, using fallback data:', apiErr);
          
          // Fallback MP data structure
          locationData = {
            states: [{
              id: 'MP',
              name: 'मध्य प्रदेश',
              sambhags: [
                {
                  id: 'BHOPAL',
                  name: 'भोपाल संभाग',
                  districts: [
                    { id: 'BHOPAL_DIST', name: 'भोपाल', blocks: [{ id: 'BHOPAL_BLOCK', name: 'भोपाल' }, { id: 'HUZUR', name: 'हुजूर' }, { id: 'BERASIA', name: 'बैरसिया' }] },
                    { id: 'RAISEN_DIST', name: 'रायसेन', blocks: [{ id: 'BEGUMGANJ', name: 'बेगमगंज' }, { id: 'GAIRATGANJ', name: 'गैरतगंज' }] },
                    { id: 'VIDISHA_DIST', name: 'विदिशा', blocks: [{ id: 'VIDISHA_BLOCK', name: 'विदिशा' }, { id: 'SIRONJ', name: 'सिरोंज' }] },
                    { id: 'SEHORE_DIST', name: 'सीहोर', blocks: [{ id: 'SEHORE_BLOCK', name: 'सीहोर' }, { id: 'ASHTA', name: 'आष्टा' }] }
                  ]
                },
                {
                  id: 'INDORE',
                  name: 'इंदौर संभाग',
                  districts: [
                    { id: 'INDORE_DIST', name: 'इंदौर', blocks: [{ id: 'INDORE_BLOCK', name: 'इंदौर' }, { id: 'MHOW', name: 'महू' }, { id: 'SANWER', name: 'सांवेर' }] },
                    { id: 'DHAR_DIST', name: 'धार', blocks: [{ id: 'DHAR_BLOCK', name: 'धार' }, { id: 'BADNAWAR', name: 'बदनावर' }] },
                    { id: 'UJJAIN_DIST', name: 'उज्जैन', blocks: [{ id: 'UJJAIN_BLOCK', name: 'उज्जैन' }, { id: 'NAGDA', name: 'नागदा' }] }
                  ]
                },
                {
                  id: 'GWALIOR',
                  name: 'ग्वालियर संभाग',
                  districts: [
                    { id: 'GWALIOR_DIST', name: 'ग्वालियर', blocks: [{ id: 'GWALIOR_BLOCK', name: 'ग्वालियर' }, { id: 'DABRA', name: 'डबरा' }] },
                    { id: 'SHIVPURI_DIST', name: 'शिवपुरी', blocks: [{ id: 'SHIVPURI_BLOCK', name: 'शिवपुरी' }, { id: 'PICHHORE', name: 'पिछोर' }] }
                  ]
                },
                {
                  id: 'JABALPUR',
                  name: 'जबलपुर संभाग',
                  districts: [
                    { id: 'JABALPUR_DIST', name: 'जबलपुर', blocks: [{ id: 'JABALPUR_BLOCK', name: 'जबलपुर' }, { id: 'SIHORA', name: 'सिहोरा' }] },
                    { id: 'KATNI_DIST', name: 'कटनी', blocks: [{ id: 'KATNI_BLOCK', name: 'कटनी' }, { id: 'VIJAYRAGHAVGARH', name: 'विजयराघवगढ़' }] }
                  ]
                },
                {
                  id: 'SAGAR',
                  name: 'सागर संभाग',
                  districts: [
                    { id: 'SAGAR_DIST', name: 'सागर', blocks: [{ id: 'SAGAR_BLOCK', name: 'सागर' }, { id: 'KHURAI', name: 'खुरई' }] },
                    { id: 'TIKAMGARH_DIST', name: 'टीकमगढ़', blocks: [{ id: 'TIKAMGARH_BLOCK', name: 'टीकमगढ़' }, { id: 'JATARA', name: 'जतारा' }] }
                  ]
                }
              ]
            }]
          };
        }
        
        setLocationHierarchy(locationData);
        
        // Auto-select Madhya Pradesh
        if (locationData.states && locationData.states.length >= 1) {
          const mpState = locationData.states[0];
          setSelectedState(mpState.id);
          setAvailableSambhags(mpState.sambhags || []);
          // Set state name in form
          setValue('departmentState', mpState.name);
        } else {
          console.error('No states found in location data:', locationData);
        }
      } catch (err) {
        console.error('Error setting up location hierarchy:', err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocationHierarchy();
    
    // Cleanup function to abort any ongoing requests
    return () => {
      if (locationAbortControllerRef.current) {
        locationAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Initialize location dropdowns when profile data loads
useEffect(() => {
  if (profileData && locationHierarchy) {
    syncLocationSelectionsFromProfile(profileData, locationHierarchy);
  }
}, [profileData, locationHierarchy]);

  const syncLocationSelectionsFromProfile = (profile, hierarchyArg = locationHierarchy) => {
  if (!profile || !hierarchyArg?.states?.length) {
    setSelectedSambhag('');
    setSelectedDistrict('');
    setSelectedBlock('');
    setAvailableSambhags(hierarchyArg?.states?.[0]?.sambhags || []);
    setAvailableDistricts([]);
    setAvailableBlocks([]);
    return;
  }

  const mpState = hierarchyArg.states[0];
  const sambhags = mpState.sambhags || [];
  setSelectedState(mpState.id);
  setAvailableSambhags(sambhags);
  setValue('departmentState', mpState.name);

  const matchedSambhag = sambhags.find(
    (s) => s.name === (profile.departmentSambhag || '')
  );

  if (!matchedSambhag) {
    setSelectedSambhag('');
    setSelectedDistrict('');
    setSelectedBlock('');
    setAvailableDistricts([]);
    setAvailableBlocks([]);
    setValue('departmentSambhag', '');
    setValue('departmentDistrict', '');
    setValue('departmentBlock', '');
    return;
  }

  setSelectedSambhag(matchedSambhag.id);
  setAvailableDistricts(matchedSambhag.districts || []);
  setValue('departmentSambhag', matchedSambhag.name);

  const matchedDistrict = (matchedSambhag.districts || []).find(
    (d) => d.name === (profile.departmentDistrict || '')
  );

  if (!matchedDistrict) {
    setSelectedDistrict('');
    setSelectedBlock('');
    setAvailableBlocks([]);
    setValue('departmentDistrict', '');
    setValue('departmentBlock', '');
    return;
  }

  setSelectedDistrict(matchedDistrict.id);
  setAvailableBlocks(matchedDistrict.blocks || []);
  setValue('departmentDistrict', matchedDistrict.name);

  const matchedBlock = (matchedDistrict.blocks || []).find(
    (b) => b.name === (profile.departmentBlock || '')
  );

  if (!matchedBlock) {
    setSelectedBlock('');
    setValue('departmentBlock', '');
    return;
  }

  setSelectedBlock(matchedBlock.id);
  setValue('departmentBlock', matchedBlock.name);
};
  // Handle Sambhag selection
  const handleSambhagChange = (sambhagId) => {
    setSelectedSambhag(sambhagId);
    setSelectedDistrict('');
    setSelectedBlock('');
    
    const sambhag = availableSambhags.find(s => s.id === sambhagId);
    setAvailableDistricts(sambhag?.districts || []);
    setAvailableBlocks([]);
    
    // Set form value with name
    const sambhagName = sambhag?.name || '';
    setValue('departmentSambhag', sambhagName);
    setValue('departmentDistrict', '');
    setValue('departmentBlock', '');
  };

  // Handle District selection
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedBlock('');
    
    const district = availableDistricts.find(d => d.id === districtId);
    setAvailableBlocks(district?.blocks || []);
    
    // Set form value with name
    setValue('departmentDistrict', district?.name || '');
    setValue('departmentBlock', '');
  };

  // Handle Block selection
  const handleBlockChange = (blockId) => {
    setSelectedBlock(blockId);
    
    const block = availableBlocks.find(b => b.id === blockId);
    setValue('departmentBlock', block?.name || '');
  };

useEffect(() => {
  if (user && user.id && !profileData) {
    setProfileData(user);
    reset(getTab2FormValues(user));
  }

  loadProfileFieldLocks();
  loadProfileData();

  return () => {
    if (profileAbortControllerRef.current) {
      profileAbortControllerRef.current.abort();
    }
  };
}, [user]);

  // Reset the Tab 2 form whenever fresh profile data arrives.
useEffect(() => {
  if (profileData) {
    reset(getTab2FormValues(profileData));
  }
}, [profileData, reset]);

const watchedDateOfBirth = watch('dateOfBirth');
const watchedEmployeeCategory = watch('employeeCategory');
const watchedDepartment = watch('department');

useEffect(() => {
  if (!watchedDateOfBirth) return;

  setValue(
    'retirementDate',
    formatRetirementDateFromDob(watchedDateOfBirth),
    { shouldValidate: true }
  );
}, [watchedDateOfBirth, setValue]);
const loadProfileFieldLocks = async () => {
  try {
    const response = await api.getProfileFieldLocks();
    setProfileFieldLocks({
      fullName: !!response?.data?.fullName,
      dateOfBirth: !!response?.data?.dateOfBirth,
      mobileNumber: !!response?.data?.mobileNumber,
      email: !!response?.data?.email,
      departmentUniqueId: !!response?.data?.departmentUniqueId,
    });
  } catch (error) {
    console.error('Failed to load profile field locks:', error);
    setProfileFieldLocks({
      fullName: false,
      dateOfBirth: false,
      mobileNumber: false,
      email: false,
      departmentUniqueId: false,
    });
  }
};
  const loadProfileData = async () => {
    // Cancel any ongoing request
    if (profileAbortControllerRef.current) {
      profileAbortControllerRef.current.abort();
    }
    
    // Create new AbortController
    profileAbortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      
      // Get user ID from context or localStorage - should always be available now
      const userId = user?.id || JSON.parse(getPortalLocalStorageItem('user') || '{}')?.id;
      
      if (userId) {
        // Fetch latest user data by ID
      const response = await api.getProfileById(userId, {
  signal: profileAbortControllerRef.current.signal
});
setProfileData(response.data);
reset(getTab2FormValues(response.data));
      } else {
        // Should not happen with new login flow, but keep as fallback
        throw new Error('User ID not found. Please login again.');
      }
    } catch (error) {
      // Ignore abortion errors
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Failed to load profile from API:', error);
      // Use user data from context as fallback
      if (user && typeof user === 'object' && user.id) {
        setProfileData(user);
        reset(user);
      } else {
        setError('प्रोफाइल लोड करने में त्रुटि हुई है। कृपया पुनः लॉगिन करें।');
      }
    } finally {
      setLoading(false);
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



const membershipCardData = {
  fullName: combineFullName(profileData?.name, profileData?.surname) || user?.name || 'सदस्य',
  name: combineFullName(profileData?.name, profileData?.surname) || user?.name || 'सदस्य',
  registrationNumber: profileData?.id || user?.id || '-',
  mobileNumber: profileData?.mobileNumber || user?.mobileNumber || '-',
  department: profileData?.department || user?.department || '-',
  registrationDate: profileData?.createdAt || profileData?.registrationDate || user?.createdAt || new Date().toISOString(),
};
const handleEditToggle = () => {
  if (isEditing) {
    reset(getTab2FormValues(profileData));
    syncLocationSelectionsFromProfile(profileData);
  } else {
    if (locationHierarchy?.states?.[0]) {
      setValue('departmentState', locationHierarchy.states[0].name);
    }
    syncLocationSelectionsFromProfile(profileData);
  }

  setIsEditing(!isEditing);
  setError('');
  setSuccess('');
};
const onInvalid = (formErrors) => {
  const firstError = Object.values(formErrors)?.[0];

  if (firstError?.message) {
    toast.error(firstError.message);
  } else {
    toast.error('कृपया सभी आवश्यक फ़ील्ड सही से भरें');
  }
};
  const onSubmit = async (data) => {
  try {
    setLoading(true);
    setError('');

    const validationErrors = [];
    if (!selectedSambhag) validationErrors.push('संभाग चुनना आवश्यक है');
    if (!selectedDistrict) validationErrors.push('जिला चुनना आवश्यक है');
    if (!selectedBlock) validationErrors.push('ब्लॉक चुनना आवश्यक है');

    if (validationErrors.length > 0) {
      const message = validationErrors.join(', ');
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    const userId = user?.id || JSON.parse(getPortalLocalStorageItem('user') || '{}')?.id;

    if (!userId) {
      throw new Error('User ID not found. Please login again.');
    }

    const stateName = locationHierarchy?.states?.[0]?.name || 'मध्य प्रदेश';
    const sambhagName =
      availableSambhags.find((s) => s.id === selectedSambhag)?.name || '';
    const districtName =
      availableDistricts.find((d) => d.id === selectedDistrict)?.name || '';
    const blockName =
      availableBlocks.find((b) => b.id === selectedBlock)?.name || '';
const { name, surname } = splitFullName(data.fullName);

const finalEmployeeCategory =
  data.employeeCategory === 'OTHER'
    ? data.otherEmployeeCategory?.trim()
    : data.employeeCategory;

const finalDepartment =
  data.department === 'OTHER'
    ? data.otherDepartmentName?.trim()
    : data.department;

const updatePayload = {
  name: isFullNameValueLocked ? profileData?.name : name,
  surname: isFullNameValueLocked ? profileData?.surname : surname,
  fatherName: data.fatherName,
  email: isEmailValueLocked ? profileData?.email : data.email,

  // Country code is hidden on Tab 2 but the existing backend contract keeps +91.
  countryCode: '+91',

  mobileNumber: isMobileNumberValueLocked
    ? profileData?.mobileNumber
    : data.mobileNumber,

  gender: data.gender,
  maritalStatus: data.maritalStatus,
  homeAddress: data.homeAddress,
  tehsil: data.tehsil?.trim() || '',
  pincode: data.pincode ? parseInt(data.pincode, 10) : null,

  dateOfBirth: isDateOfBirthValueLocked
    ? profileData?.dateOfBirth || null
    : data.dateOfBirth || null,

  employeeCategory: finalEmployeeCategory || '',
  department: finalDepartment || '',
  schoolOfficeName: data.schoolOfficeName,

  // Tab 2 only collects joining year. Existing backend stores a LocalDate.
  joiningDate: data.joiningYear
    ? `${data.joiningYear}-01-01`
    : null,

  retirementDate: data.retirementDate || null,

  // Sankul is a Tab 1-only field.
  sankulName: '',

  departmentUniqueId: isDepartmentUniqueIdLocked
    ? profileData?.departmentUniqueId
    : data.departmentUniqueId,

  departmentState: stateName,
  departmentSambhag: sambhagName,
  departmentDistrict: districtName,
  departmentBlock: blockName,

  nominee1Name: isNominee1Locked
    ? profileData?.nominee1Name
    : data.nominee1Name,
  nominee1Relation: isNominee1Locked
    ? profileData?.nominee1Relation
    : data.nominee1Relation,
  nominee2Name: isNominee2Locked
    ? profileData?.nominee2Name
    : data.nominee2Name,
  nominee2Relation: isNominee2Locked
    ? profileData?.nominee2Relation
    : data.nominee2Relation,
};

const response = await api.updateProfileById(userId, updatePayload);
    setProfileData(response.data);
    setPortalLocalStorageItem('user', JSON.stringify(response.data));
    reset(getTab2FormValues(response.data));
    syncLocationSelectionsFromProfile(response.data);
    setIsEditing(false);
    setSuccess('प्रोफाइल सफलतापूर्वक अपडेट हो गया');
    toast.success('प्रोफाइल सफलतापूर्वक अपडेट हो गया');
  } catch (error) {
    console.error('Profile update error:', error);
    const errorMessage =
      error.response?.data?.message || 'प्रोफाइल अपडेट करने में त्रुटि हुई है';
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handlePasswordChangeSuccess = (message) => {
    setSuccess(message);
    toast.success(message);
  };

  const fontFamily = 'Noto Sans Devanagari, Poppins, Arial, sans-serif';
const uiTheme = {
  dark: '#221b43',
  main: '#6f5cc2',
  light: '#b9a7ff',
  accent: '#0f766e',
  soft: '#f4f2fb',
  soft2: '#ffffff',
  softAccent: '#eef8f7',
  text: '#221b43',
  muted: '#4b5563',
  green: '#0f766e',
  red: '#b42318',
  border: '#ded8f5',
};


const labelSx = {
  color: uiTheme.dark,
  fontWeight: 700,
  mb: 0.8,
  display: 'block',
  fontSize: '0.94rem',
  fontFamily,
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
  background: '#ffffff',
    transition: 'all 0.25s ease',
    '& fieldset': {
   borderColor: 'rgba(111, 92, 194, 0.18)',
    },
    '&:hover fieldset': {
    borderColor: 'rgba(111, 92, 194, 0.42)',
    },
    '&.Mui-focused fieldset': {
      borderColor: uiTheme.main,
      borderWidth: '2px',
    },
    '&.Mui-disabled': {
background: uiTheme.soft,    },
    '& input::placeholder, & textarea::placeholder': {
      color: '#6b5d80',
      opacity: 1,
    },
  },
  '& .MuiInputBase-input': {
    color: uiTheme.text,
    fontWeight: 600,
    fontFamily,
  },
  '& .MuiFormHelperText-root': {
    fontWeight: 600,
    fontFamily,
  },
};

const selectSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.96)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
   borderColor: 'rgba(111, 92, 194, 0.18)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
   borderColor: 'rgba(111, 92, 194, 0.42)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: uiTheme.main,
    borderWidth: '2px',
  },
  '& .MuiSelect-select': {
    color: uiTheme.text,
    fontWeight: 700,
    fontFamily,
    py: 1.55,
  },
};

const cardSx = {
  mb: 4,
  p: { xs: 2, md: 3 },
  borderRadius: '26px',
border: '1px solid rgba(111, 92, 194, 0.16)',
background: '#ffffff',
boxShadow: '0 18px 48px rgba(34, 27, 67, 0.08)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
background:
  'linear-gradient(135deg, rgba(111,92,194,0.04), transparent 42%, rgba(15,118,110,0.05))',    pointerEvents: 'none',
  },
};

const primaryButtonSx = {
  borderRadius: '16px',
  px: 4,
  py: 1.35,
fontWeight: 700,
background: uiTheme.main,
boxShadow: '0 14px 32px rgba(111, 92, 194, 0.28)',
'&:hover': {
  background: '#5a48ad',
  transform: 'translateY(-2px)',
  boxShadow: '0 18px 42px rgba(111, 92, 194, 0.34)',
},
  textTransform: 'none',
  fontFamily,
  color: '#fff',
  transition: 'all 0.25s ease',
 
  '&:disabled': {
    background: '#c4b5fd',
    color: '#fff',
  },
};

const orangeButtonSx = {
  borderRadius: '16px',
  px: 4,
  py: 1.35,
  fontWeight: 700,
  textTransform: 'none',
  fontFamily,
  color: '#fff',
  background: uiTheme.accent,
  boxShadow: '0 14px 32px rgba(15, 118, 110, 0.28)',
  transition: 'all 0.25s ease',
  '&:hover': {
    background: '#0b5f59',
    transform: 'translateY(-2px)',
    boxShadow: '0 18px 42px rgba(15, 118, 110, 0.36)',
  },
};

const outlineButtonSx = {
  borderRadius: '16px',
  px: 4,
  py: 1.35,
  fontWeight: 700,
borderColor: 'rgba(111, 92, 194, 0.35)',
'&:hover': {
  borderColor: uiTheme.main,
  background: 'rgba(111, 92, 194, 0.08)',
},
  textTransform: 'none',
  fontFamily,
  color: uiTheme.main,
  transition: 'all 0.25s ease',
  
};

const menuProps = {
  PaperProps: {
    sx: {
      maxHeight: 300,
      minWidth: { xs: 260, md: 360 },
      borderRadius: '16px',
     boxShadow: '0 18px 50px rgba(34, 27, 67, 0.16)',
      '& .MuiMenuItem-root': {
        py: 1.2,
        px: 2,
        fontWeight: 700,
        fontFamily,
        whiteSpace: 'normal',
      },
    },
  },
};

const FieldLabel = ({ children }) => (
  <Typography variant="body2" sx={labelSx}>
    {children}
  </Typography>
);

const SectionHeader = ({ icon, number, title, subtitle }) => (
  <Box
    sx={{
      mb: 2.5,
      p: { xs: 2, md: 2.3 },
      borderRadius: '22px',
      color: '#fff',
      background: 'linear-gradient(135deg, #221b43 0%, #30295c 48%, #3b3268 100%)',
boxShadow: '0 16px 34px rgba(34, 27, 67, 0.22)',
      display: 'flex',
      alignItems: { xs: 'flex-start', sm: 'center' },
      gap: 1.7,
      flexDirection: { xs: 'column', sm: 'row' },
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.18)',
        border: '1px solid rgba(255,255,255,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 950,
        fontFamily,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>

    <Box>
      <Typography
        sx={{
          fontWeight: 950,
          fontSize: { xs: '1.05rem', md: '1.22rem' },
          fontFamily,
        }}
      >
        {number}. {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            mt: 0.2,
            opacity: 0.88,
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

  if (loading && !profileData) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 1 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

 return (
  <Layout>
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 6 },
        background: uiTheme.soft,
         position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          top: -170,
          left: -130,
         background: 'rgba(111, 92, 194, 0.10)',
          filter: 'blur(8px)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          right: -140,
          bottom: -150,
          background: 'rgba(250, 204, 21, 0.16)',
          filter: 'blur(10px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Profile Header Card */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 2.5, md: 4 },
            borderRadius: { xs: '28px', md: '36px' },
           background: '#ffffff',
border: '1px solid rgba(111, 92, 194, 0.16)',
boxShadow: '0 30px 90px rgba(34, 27, 67, 0.12)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
background: uiTheme.main,            },
          }}
        >
          <Avatar
            sx={{
              width: 108,
              height: 108,
              margin: '0 auto',
              mb: 2,
              background: `linear-gradient(135deg, ${uiTheme.main}, ${uiTheme.light})`,
              fontSize: '2.7rem',
              fontWeight: 950,
              fontFamily,
              boxShadow: '0 16px 38px rgba(109, 40, 217, 0.30)',
              border: '4px solid rgba(255,255,255,0.85)',
            }}
          >
            {(profileData?.name || user?.name || 'U').charAt(0).toUpperCase()}
          </Avatar>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 950,
              color: uiTheme.dark,
              mb: 1,
              fontFamily,
              fontSize: { xs: '1.75rem', md: '2.35rem' },
              lineHeight: 1.25,
            }}
          >
            {(profileData?.name && profileData?.surname)
              ? `${profileData.name} ${profileData.surname}`
              : profileData?.name || user?.name || user?.username || 'उपयोगकर्ता'}
          </Typography>

          <Typography
            sx={{
              color: uiTheme.muted,
              mb: 2,
              fontWeight: 800,
              fontFamily,
            }}
          >
            {profileData?.department || 'विभाग उपलब्ध नहीं'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Chip
              icon={<Email />}
              label={profileData?.email || 'ईमेल अनुपलब्ध'}
              sx={{
                bgcolor: uiTheme.soft,
                color: uiTheme.dark,
                fontWeight: 850,
                border: '1px solid rgba(124, 58, 237, 0.16)',
                '& .MuiChip-icon': { color: uiTheme.main },
              }}
            />

            {profileData?.mobileNumber && (
              <Chip
                icon={<Phone />}
                label={profileData.mobileNumber}
                sx={{
                  bgcolor: uiTheme.softGold,
                  color: uiTheme.dark,
                  fontWeight: 850,
                  border: '1px solid rgba(250, 204, 21, 0.28)',
                  '& .MuiChip-icon': { color: '#d97706' },
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => setMembershipCardOpen(true)}
              startIcon={<Badge sx={{ fontSize: 22 }} />}
              sx={{
                ...orangeButtonSx,
                minWidth: { xs: '100%', sm: 180 },
              }}
            >
              ID Card देखें
            </Button>

            <Button
              variant={isEditing ? 'outlined' : 'contained'}
              onClick={handleEditToggle}
              startIcon={isEditing ? <Cancel /> : <Edit />}
              sx={{
                ...(isEditing ? outlineButtonSx : primaryButtonSx),
                minWidth: { xs: '100%', sm: 210 },
              }}
            >
              {isEditing ? 'रद्द करें' : 'प्रोफाइल संपादित करें'}
            </Button>
          </Box>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '16px',
              fontWeight: 800,
              fontFamily,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: '16px',
              fontWeight: 800,
              fontFamily,
            }}
          >
            {success}
          </Alert>
        )}

        {/* Profile Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit, onInvalid)}>
          {/* Section 1 */}
          <SectionHeader
            icon={<Person />}
            number="1"
            title="व्यक्तिगत जानकारी (Personal Information)"
            subtitle="नाम, जन्मतिथि, मोबाइल और ईमेल जानकारी"
          />

          <Paper elevation={0} sx={cardSx}>
            <Grid container spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} md={8}>
                <FieldLabel>पूरा नाम</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={combineFullName(profileData?.name, profileData?.surname)}
                  {...register('fullName', { required: 'पूरा नाम आवश्यक है' })}
                  disabled={!isEditing || isFullNameValueLocked}
                  error={!!errors.fullName}
                  helperText={
                    errors.fullName?.message ||
(isFullNameValueLocked ? 'पूरा नाम एडमिन द्वारा लॉक किया गया है' : '')                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FieldLabel>पिता/पति का नाम</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={profileData?.fatherName || ''}
                  {...register('fatherName', { required: 'पिता/पति का नाम आवश्यक है' })}
                  disabled={!isEditing}
                  error={!!errors.fatherName}
                  helperText={errors.fatherName?.message}
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FieldLabel>लिंग</FieldLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue={profileData?.gender || ''}
                  rules={{ required: 'लिंग चुनना आवश्यक है' }}
                  render={({ field }) => (
                    <FormControl fullWidth disabled={!isEditing} error={!!errors.gender} sx={selectSx}>
                      <Select {...field} displayEmpty MenuProps={menuProps}>
                        <MenuItem value="">लिंग चुनें</MenuItem>
                        <MenuItem value="MALE">पुरुष (Male)</MenuItem>
                        <MenuItem value="FEMALE">महिला (Female)</MenuItem>
                        <MenuItem value="OTHER">अन्य (Other)</MenuItem>
                      </Select>
                      {errors.gender && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                          {errors.gender?.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FieldLabel>वैवाहिक स्थिति</FieldLabel>
                <Controller
                  name="maritalStatus"
                  control={control}
                  defaultValue={profileData?.maritalStatus || ''}
                  rules={{ required: 'वैवाहिक स्थिति चुनना आवश्यक है' }}
                  render={({ field }) => (
                    <FormControl fullWidth disabled={!isEditing} error={!!errors.maritalStatus} sx={selectSx}>
                      <Select {...field} displayEmpty MenuProps={menuProps}>
                        <MenuItem value="">वैवाहिक स्थिति चुनें</MenuItem>
                        <MenuItem value="UNMARRIED">अविवाहित (Single)</MenuItem>
                        <MenuItem value="MARRIED">विवाहित (Married)</MenuItem>
                        <MenuItem value="DIVORCED">तलाकशुदा (Divorced)</MenuItem>
                        <MenuItem value="WIDOWED">विधवा/विधुर (Widowed)</MenuItem>
                      </Select>
                      {errors.maritalStatus && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                          {errors.maritalStatus?.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FieldLabel>जन्मतिथि</FieldLabel>
                <TextField
                  fullWidth
                  type="date"
                  defaultValue={profileData?.dateOfBirth || ''}
                  {...register('dateOfBirth', { required: 'जन्मतिथि आवश्यक है' })}
                  disabled={!isEditing || isDateOfBirthValueLocked}
                  error={!!errors.dateOfBirth}
                  helperText={
                    errors.dateOfBirth?.message ||
                    (isDateOfBirthValueLocked  ? 'जन्मतिथि एडमिन द्वारा लॉक की गई है' : '')
                  }
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FieldLabel>मोबाइल नंबर</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={profileData?.mobileNumber || ''}
                  {...register('mobileNumber', {
                    required: 'मोबाइल नंबर आवश्यक है',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'मोबाइल नंबर 10 अंकों का होना चाहिए',
                    },
                    minLength: {
                      value: 10,
                      message: 'मोबाइल नंबर 10 अंकों का होना चाहिए',
                    },
                    maxLength: {
                      value: 10,
                      message: 'मोबाइल नंबर 10 अंकों का होना चाहिए',
                    },
                  })}
                 disabled={!isEditing || isMobileNumberValueLocked}
                  error={!!errors.mobileNumber}
                  helperText={
                    errors.mobileNumber?.message ||
                    (isMobileNumberValueLocked  ? 'मोबाइल नंबर एडमिन द्वारा लॉक किया गया है' : '')
                  }
                  inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  }}
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldLabel>ईमेल</FieldLabel>
                <TextField
                  fullWidth
                  type="email"
                  defaultValue={profileData?.email || ''}
                  {...register('email', {
                    required: 'ईमेल आवश्यक है',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'कृपया सही ईमेल दर्ज करें',
                    },
                  })}
                 disabled={!isEditing || isEmailValueLocked}
                  error={!!errors.email}
                  helperText={
                    errors.email?.message ||
                    (isEmailValueLocked  ? 'ईमेल एडमिन द्वारा लॉक किया गया है' : '')
                  }
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 2 */}
          <SectionHeader
            icon={<LocationOn />}
            number="2"
            title="पता विवरण (Address Details)"
            subtitle="राज्य, संभाग, जिला, ब्लॉक, तहसील और पता"
          />

          <Paper elevation={0} sx={cardSx}>
            <Grid container spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} md={3}>
                <FieldLabel>राज्य</FieldLabel>
                <TextField fullWidth value="मध्य प्रदेश" disabled sx={fieldSx} />
                <input type="hidden" {...register('departmentState')} />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel>संभाग</FieldLabel>
                <FormControl fullWidth disabled={!isEditing || loadingLocations} sx={selectSx}>
                  <Select
                    value={selectedSambhag}
                    displayEmpty
                    onChange={(e) => handleSambhagChange(e.target.value)}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">संभाग चुनें</MenuItem>
                    {availableSambhags.map((sambhag) => (
                      <MenuItem key={sambhag.id} value={sambhag.id}>
                        {sambhag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <input type="hidden" {...register('departmentSambhag')} />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel>जिला</FieldLabel>
                <FormControl fullWidth disabled={!isEditing || !selectedSambhag} sx={selectSx}>
                  <Select
                    value={selectedDistrict}
                    displayEmpty
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">जिला चुनें</MenuItem>
                    {availableDistricts.map((district) => (
                      <MenuItem key={district.id} value={district.id}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <input type="hidden" {...register('departmentDistrict')} />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel>ब्लॉक</FieldLabel>
                <FormControl fullWidth disabled={!isEditing || !selectedDistrict} sx={selectSx}>
                  <Select
                    value={selectedBlock}
                    displayEmpty
                    onChange={(e) => handleBlockChange(e.target.value)}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="">ब्लॉक चुनें</MenuItem>
                    {availableBlocks.map((block) => (
                      <MenuItem key={block.id} value={block.id}>
                        {block.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <input type="hidden" {...register('departmentBlock')} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldLabel>घर या कार्यालय का पूरा पता</FieldLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue={profileData?.homeAddress || ''}
                  {...register('homeAddress', {
                    required: 'घर या कार्यालय का पूरा पता आवश्यक है',
                  })}
                  disabled={!isEditing}
                  error={!!errors.homeAddress}
                  helperText={errors.homeAddress?.message}
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel>तहसील</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={profileData?.tehsil || ''}
                  {...register('tehsil')}
                  disabled={!isEditing}
                  placeholder="तहसील"
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel>पिन कोड</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={profileData?.pincode || ''}
                  {...register('pincode', {
                    required: 'पिन कोड आवश्यक है',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'वैध 6 अंकों का पिन कोड दर्ज करें',
                    },
                  })}
                  disabled={!isEditing}
                  inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  }}
                  placeholder="जैसे: 462001"
                  error={!!errors.pincode}
                  helperText={errors.pincode?.message}
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 3 */}
          <SectionHeader
            icon={<Work />}
            number="3"
            title="व्यावसायिक विवरण (Professional Details)"
            subtitle="कर्मचारी श्रेणी, विभाग, कार्यालय, नियुक्ति और सेवानिवृत्ति विवरण"
          />

          <Paper elevation={0} sx={cardSx}>
            <Grid container spacing={2.5} sx={{ position: 'relative', zIndex: 1 }}>
              <Grid item xs={12} md={6}>
                <FieldLabel>कर्मचारी की श्रेणी</FieldLabel>
                <Controller
                  name="employeeCategory"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'कर्मचारी की श्रेणी चुनना आवश्यक है' }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      disabled={!isEditing}
                      error={!!errors.employeeCategory}
                      sx={selectSx}
                    >
                      <Select {...field} displayEmpty MenuProps={menuProps}>
                        <MenuItem value="">कर्मचारी की श्रेणी चुनें</MenuItem>
                        {EMPLOYEE_CATEGORIES.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                        <MenuItem value="OTHER">अन्य</MenuItem>
                      </Select>
                      {errors.employeeCategory && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                          {errors.employeeCategory?.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {watchedEmployeeCategory === 'OTHER' && (
                <Grid item xs={12} md={6}>
                  <FieldLabel>अन्य कर्मचारी श्रेणी</FieldLabel>
                  <TextField
                    fullWidth
                    {...register('otherEmployeeCategory', {
                      validate: (value) =>
                        watchedEmployeeCategory !== 'OTHER' ||
                        !!value?.trim() ||
                        'कृपया कर्मचारी की श्रेणी दर्ज करें',
                    })}
                    disabled={!isEditing}
                    error={!!errors.otherEmployeeCategory}
                    helperText={errors.otherEmployeeCategory?.message}
                    placeholder="कर्मचारी की श्रेणी दर्ज करें"
                    sx={fieldSx}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <FieldLabel>विभाग का नाम</FieldLabel>
                <Controller
                  name="department"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'विभाग का नाम चुनना आवश्यक है' }}
                  render={({ field }) => (
                    <FormControl fullWidth disabled={!isEditing} error={!!errors.department} sx={selectSx}>
                      <Select {...field} displayEmpty MenuProps={menuProps}>
                        <MenuItem value="">विभाग चुनें</MenuItem>
                        {DEPARTMENTS.map((department) => (
                          <MenuItem key={department} value={department}>
                            {department}
                          </MenuItem>
                        ))}
                        <MenuItem value="OTHER">विभाग सूची में उपलब्ध नहीं है</MenuItem>
                      </Select>
                      {errors.department && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                          {errors.department?.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {watchedDepartment === 'OTHER' && (
                <Grid item xs={12} md={6}>
                  <FieldLabel>विभाग का नाम</FieldLabel>
                  <TextField
                    fullWidth
                    {...register('otherDepartmentName', {
                      validate: (value) =>
                        watchedDepartment !== 'OTHER' ||
                        !!value?.trim() ||
                        'कृपया विभाग का नाम दर्ज करें',
                    })}
                    disabled={!isEditing}
                    error={!!errors.otherDepartmentName}
                    helperText={errors.otherDepartmentName?.message}
                    placeholder="विभाग का नाम दर्ज करें"
                    sx={fieldSx}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <FieldLabel>पदस्थ कार्यालय का नाम</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={profileData?.schoolOfficeName || ''}
                  {...register('schoolOfficeName', {
                    required: 'पदस्थ कार्यालय का नाम आवश्यक है',
                  })}
                  disabled={!isEditing}
                  error={!!errors.schoolOfficeName}
                  helperText={errors.schoolOfficeName?.message}
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldLabel>विभाग आईडी (Department Unique ID)</FieldLabel>
                <TextField
                  fullWidth
                  defaultValue={profileData?.departmentUniqueId || ''}
                  {...register('departmentUniqueId', {
                    required: 'विभाग आईडी आवश्यक है',
                  })}
                  disabled={!isEditing || isDepartmentUniqueIdLocked}
                  error={!!errors.departmentUniqueId}
                  helperText={
                    errors.departmentUniqueId?.message ||
                    (isDepartmentUniqueIdLocked
                      ? 'विभाग आईडी लॉक है, इसे बदला नहीं जा सकता'
                      : '')
                  }
                  sx={fieldSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldLabel>नियुक्ति वर्ष</FieldLabel>
                <Controller
                  name="joiningYear"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'नियुक्ति वर्ष चुनना आवश्यक है' }}
                  render={({ field }) => (
                    <FormControl fullWidth disabled={!isEditing} error={!!errors.joiningYear} sx={selectSx}>
                      <Select {...field} displayEmpty MenuProps={menuProps}>
                        <MenuItem value="">नियुक्ति वर्ष चुनें</MenuItem>
                        {JOINING_YEARS.map((year) => (
                          <MenuItem key={year} value={String(year)}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.joiningYear && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                          {errors.joiningYear?.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldLabel>सेवानिवृत्ति की तिथि</FieldLabel>
                <TextField
                  fullWidth
                  type="date"
                  {...register('retirementDate', {
                    required: 'सेवानिवृत्ति की तिथि आवश्यक है',
                  })}
                  disabled={!isEditing}
                  InputProps={{ readOnly: true }}
                  helperText="जन्मतिथि + 62 वर्ष से स्वतः भरा जाता है"
                  sx={fieldSx}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Section 4 */}
          <SectionHeader
            icon={<PersonAdd />}
            number="4"
            title="नामांकित व्यक्ति का विवरण (Nominee Details)"
            subtitle="पहले और दूसरे नामांकित की जानकारी"
          />

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: 950,
                  color: uiTheme.main,
                  fontFamily,
                  fontSize: '1.05rem',
                }}
              >
                पहला नामांकित (First Nominee)
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <FieldLabel>नामांकित का नाम</FieldLabel>
                 <TextField
  fullWidth
  defaultValue={profileData?.nominee1Name || ''}
  {...register('nominee1Name', { required: 'पहले नामांकित का नाम आवश्यक है' })}
  disabled={!isEditing || isNominee1Locked}
  error={!!errors.nominee1Name}
  helperText={
    errors.nominee1Name?.message ||
    (isNominee1Locked ? 'नामांकित व्यक्ति की जानकारी लॉक है, इसे बदला नहीं जा सकता' : '')
  }
  sx={fieldSx}
/>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FieldLabel>नामांकित का संबंध</FieldLabel>
                  <Controller
                    name="nominee1Relation"
                    control={control}
                    defaultValue={profileData?.nominee1Relation || ''}
                    rules={{ required: 'पहले नामांकित का संबंध आवश्यक है' }}
                    render={({ field }) => (
<FormControl
  fullWidth
  disabled={!isEditing || isNominee1Locked}
  error={!!errors.nominee1Relation}
  sx={selectSx}
>                        <Select {...field} displayEmpty MenuProps={menuProps}>
                          <MenuItem value="">संबंध चुनें</MenuItem>
                          <MenuItem value="पिता">पिता (Father)</MenuItem>
                          <MenuItem value="माता">माता (Mother)</MenuItem>
                          <MenuItem value="भाई">भाई (Brother)</MenuItem>
                          <MenuItem value="बहन">बहन (Sister)</MenuItem>
                          <MenuItem value="पति">पति (Husband)</MenuItem>
                          <MenuItem value="पत्नी">पत्नी (Wife)</MenuItem>
                          <MenuItem value="पुत्र">पुत्र (Son)</MenuItem>
                          <MenuItem value="पुत्री">पुत्री (Daughter)</MenuItem>
                          <MenuItem value="दादा">दादा (Grandfather)</MenuItem>
                          <MenuItem value="दादी">दादी (Grandmother)</MenuItem>
                          <MenuItem value="अन्य">अन्य (Other)</MenuItem>
                        </Select>
                        {errors.nominee1Relation && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                            {errors.nominee1Relation?.message}
                          </Typography>
                        )}
                        {!errors.nominee1Relation && isNominee1Locked && (
  <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 700, color: uiTheme.muted }}>
    नामांकित व्यक्ति की जानकारी लॉक है, इसे बदला नहीं जा सकता
  </Typography>
)}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              <Typography
                sx={{
                  mt: 3.5,
                  mb: 2,
                  fontWeight: 950,
                  color: uiTheme.main,
                  fontFamily,
                  fontSize: '1.05rem',
                }}
              >
                दूसरा नामांकित (Second Nominee)
              </Typography>

              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <FieldLabel>नामांकित का नाम</FieldLabel>
                 <TextField
  fullWidth
  defaultValue={profileData?.nominee2Name || ''}
  {...register('nominee2Name', { required: 'दूसरे नामांकित का नाम आवश्यक है' })}
  disabled={!isEditing || isNominee1Locked}
  error={!!errors.nominee2Name}
  helperText={
    errors.nominee2Name?.message ||
    (isNominee1Locked ? 'नामांकित व्यक्ति की जानकारी लॉक है, इसे बदला नहीं जा सकता' : '')
  }
  sx={fieldSx}
/>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FieldLabel>नामांकित का संबंध</FieldLabel>
                  <Controller
                    name="nominee2Relation"
                    control={control}
                    defaultValue={profileData?.nominee2Relation || ''}
                    rules={{ required: 'दूसरे नामांकित का संबंध आवश्यक है' }}
                    render={({ field }) => (
<FormControl
  fullWidth
  disabled={!isEditing || isNominee1Locked}
  error={!!errors.nominee2Relation}
  sx={selectSx}
>                        <Select {...field} displayEmpty MenuProps={menuProps}>
                          <MenuItem value="">संबंध चुनें</MenuItem>
                          <MenuItem value="पिता">पिता (Father)</MenuItem>
                          <MenuItem value="माता">माता (Mother)</MenuItem>
                          <MenuItem value="भाई">भाई (Brother)</MenuItem>
                          <MenuItem value="बहन">बहन (Sister)</MenuItem>
                          <MenuItem value="पति">पति (Husband)</MenuItem>
                          <MenuItem value="पत्नी">पत्नी (Wife)</MenuItem>
                          <MenuItem value="पुत्र">पुत्र (Son)</MenuItem>
                          <MenuItem value="पुत्री">पुत्री (Daughter)</MenuItem>
                          <MenuItem value="दादा">दादा (Grandfather)</MenuItem>
                          <MenuItem value="दादी">दादी (Grandmother)</MenuItem>
                          <MenuItem value="अन्य">अन्य (Other)</MenuItem>
                        </Select>
                        {errors.nominee2Relation && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, fontWeight: 700 }}>
                            {errors.nominee2Relation?.message}
                          </Typography>
                        )}
                        {!errors.nominee2Relation && isNominee1Locked && (
  <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 700, color: uiTheme.muted }}>
    नामांकित व्यक्ति की जानकारी लॉक है, इसे बदला नहीं जा सकता
  </Typography>
)}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Section 5 */}
          <SectionHeader
            icon={<Security />}
            number="5"
            title="खाता सुरक्षा (Account Security)"
            subtitle="पासवर्ड बदलने और खाते की सुरक्षा"
          />

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Grid container spacing={2.5} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    sx={{
                      color: uiTheme.text,
                      fontWeight: 900,
                      fontFamily,
                      mb: 0.5,
                      fontSize: '1.05rem',
                    }}
                  >
                    पासवर्ड बदलें
                  </Typography>

                  <Typography
                    sx={{
                      color: uiTheme.muted,
                      fontWeight: 700,
                      fontFamily,
                      lineHeight: 1.7,
                    }}
                  >
                    अपना पासवर्ड बदलने के लिए नीचे दिए गए बटन पर क्लिक करें।
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowPasswordDialog(true)}
                      startIcon={<Security />}
                      sx={outlineButtonSx}
                    >
                      पासवर्ड बदलें
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Submit Button */}
          {isEditing && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 3,
                flexWrap: 'wrap',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={!loading && <Save />}
                sx={{
                  ...orangeButtonSx,
                  minWidth: { xs: '100%', sm: 220 },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  'प्रोफाइल सेव करें'
                )}
              </Button>

              <Button
                variant="outlined"
                onClick={handleEditToggle}
                sx={{
                  ...outlineButtonSx,
                  minWidth: { xs: '100%', sm: 160 },
                }}
              >
                रद्द करें
              </Button>
            </Box>
          )}
        </Box>

        {/* Change Password Dialog */}
        <ChangePasswordDialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      </Container>
    </Box>

    <MembershipCardPopup
      open={membershipCardOpen}
      onClose={() => setMembershipCardOpen(false)}
      memberData={membershipCardData}
    />
  </Layout>
);
};

export default Profile;
