import api, { publicApi } from './api';

const formatDobAsPassword = (dobValue) => {
  if (!dobValue) return '';

  const [year, month, day] = String(dobValue).split('-');
  if (!year || !month || !day) return '';

  return `${day}${month}${year}`;
};

export const authService = {
  // Clear all cached authentication data
  clearAllAuthData: () => {
    console.log('🧹 Clearing all authentication data...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear any additional cache that might exist
    Object.keys(localStorage).forEach(key => {
      if (key.includes('auth') || key.includes('user') || key.includes('token')) {
        console.log('🗑️ Removing cached item:', key);
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    console.log('✅ All authentication data cleared');
  },

  // Login user (public endpoint)
  login: async (credentials) => {
    const response = await publicApi.post('/auth/login', credentials);
    return response.data;
  },

  
  // Register new user (public endpoint)
  register: async (userData) => {
    // Let backend auto-generate the ID using IdGeneratorService

    // Try with full payload first, if it fails, try with basic fields only
    const fullPayload = {
      // Remove ID field - let backend generate PMUMS2025XXXXX format
      name: userData.name || '',
      surname: userData.surname || '',
      fatherName: userData.fatherName || '', // Added father name field
      countryCode: userData.countryCode || '+91',
      mobileNumber: userData.mobileNumber || '',
      email: userData.email,
      pincode: userData.pincode ? parseInt(userData.pincode, 10) : null,
      gender: userData.gender || '',
      maritalStatus: userData.maritalStatus || '',
      password: formatDobAsPassword(userData.dateOfBirth) || userData.password,
      homeAddress: userData.homeAddress || '',
      dateOfBirth: userData.dateOfBirth || null,
      joiningDate: userData.joiningDate || null, // Professional detail
      retirementDate: userData.retirementDate || null, // Professional detail
      schoolOfficeName: userData.schoolOfficeName || '',
      sankulName: userData.sankulName || '', // संकుل का नाम
      department: userData.department || '',
      departmentUniqueId: userData.departmentUniqueId || `DEPT_${userData.email.replace('@', '_').replace('.', '_')}_${Date.now()}`,
      // ✅ ADD LOCATION FIELDS - CRITICAL!
      departmentState: userData.departmentState || '',
      departmentSambhag: userData.departmentSambhag || '',
      departmentDistrict: userData.departmentDistrict || '',
      departmentBlock: userData.departmentBlock || '',
      nominee1Name: userData.nominee1Name || '',
      nominee1Relation: userData.nominee1Relation || '',
      nominee2Name: userData.nominee2Name || '',
      nominee2Relation: userData.nominee2Relation || '',
      acceptedTerms: true
    };

    // Basic payload as fallback
    const basicPayload = {
      // Remove ID field - let backend generate PMUMS2025XXXXX format
      name: userData.name || '',
      surname: userData.surname || '',
      fatherName: userData.fatherName || '',
      email: userData.email,
      password: formatDobAsPassword(userData.dateOfBirth) || userData.password,
      mobileNumber: userData.mobileNumber || '',
      pincode: userData.pincode ? parseInt(userData.pincode, 10) : null,
      countryCode: userData.countryCode || '+91',
      acceptedTerms: true
    };
    
    console.log('Trying registration with full payload:', fullPayload);
    
    try {
      const response = await publicApi.post('/users/register', fullPayload);
      console.log('Registration successful with full payload:', response.data);
      return response.data;
    } catch (error) {
      console.warn('Full payload failed, trying with basic fields:', error.message);
      console.log('Trying registration with basic payload:', basicPayload);
      
      try {
        const response = await publicApi.post('/users/register', basicPayload);
        console.log('Registration successful with basic payload:', response.data);
        return response.data;
      } catch (basicError) {
  console.error('Both registration attempts failed');
  console.error('Full payload error:', error.response?.data);
  console.error('Basic payload error:', basicError.response?.data);

  const fullPayloadMessage =
    typeof error.response?.data === "string"
      ? error.response.data
      : error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

  const basicPayloadMessage =
    typeof basicError.response?.data === "string"
      ? basicError.response.data
      : basicError.response?.data?.message ||
        basicError.response?.data?.error ||
        basicError.message;

  const finalMessage =
    fullPayloadMessage ||
    basicPayloadMessage ||
    "Registration failed. Please try again.";

  basicError.apiMessage = finalMessage;

  throw basicError;
}
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    // Since login now provides complete user data, first check localStorage
    const savedUser = localStorage.getItem('user');
    console.log('🔍 Checking localStorage for user:', savedUser);
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      console.log('🔍 Parsed user data from localStorage:', userData);
      console.log('🆔 Current user ID in localStorage:', userData.id);
      
      // If we have complete user data with ID, use it to fetch fresh data
      if (userData.id) {
        // Skip API call and use cached user data
        console.log('📋 Using cached user data, skipping API refresh');
        return userData;
        
        /*
        // Disabled automatic user data refresh
        try {
          console.log('🌐 Fetching fresh user data from API for ID:', userData.id);
          const response = await api.get(`/admin/users/${userData.id}`);
          console.log('✅ Fresh user data from API:', response.data);
          console.log('🆔 Fresh user ID from API:', response.data.id);
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(response.data));
          return response.data;
        } catch (error) {
          console.error('❌ Failed to fetch user by ID:', error);
          console.log('⚠️ Using cached user data as fallback');
          // Return saved user data as fallback if it's complete
          return userData;
        }
        */
      }
    }
    
    throw new Error('No user data found. Please login again.');
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Use comprehensive clear function
      authService.clearAllAuthData();
    }
  },

  // Forgot password (public endpoint)
  forgotPassword: async (email) => {
    const response = await publicApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password (public endpoint)
  resetPassword: async (token, newPassword) => {
    const response = await publicApi.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  },

  // Send email OTP for verification (public endpoint)
  sendEmailOtp: async (email) => {
    const response = await publicApi.post('/auth/email-otp/send', { email });
    return response.data;
  },

  // Verify email OTP (public endpoint)
  verifyEmailOtp: async (email, otp) => {
    const response = await publicApi.post('/auth/email-otp/verify', { email, otp });
    return response.data;
  },
};