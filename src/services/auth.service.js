import api, { publicApi } from './api';
import axios from 'axios';

export const authService = {
  // Login user (public endpoint)
  login: async (credentials) => {
    const response = await publicApi.post('/auth/login', credentials);
    return response.data;
  },

  // Register new user (public endpoint)
  register: async (userData) => {
    // Send data directly matching RegisterRequest DTO structure
    const payload = {
      name: userData.name,
      surname: userData.surname,
      countryCode: userData.countryCode,
      phoneNumber: userData.phoneNumber,
      mobileNumber: userData.mobileNumber,
      email: userData.email,
      gender: userData.gender,
      maritalStatus: userData.maritalStatus,
      username: userData.username,
      password: userData.password,
      homeAddress: userData.homeAddress,
      dateOfBirth: userData.dateOfBirth,
      schoolOfficeName: userData.schoolOfficeName,
      department: userData.department,
      departmentUniqueId: userData.departmentUniqueId,
      departmentState: userData.departmentState,
      departmentSambhag: userData.departmentSambhag,
      departmentDistrict: userData.departmentDistrict,
      departmentBlock: userData.departmentBlock,
      nominee1Name: userData.nominee1Name,
      nominee1Relation: userData.nominee1Relation,
      nominee2Name: userData.nominee2Name,
      nominee2Relation: userData.nominee2Relation,
      acceptedTerms: userData.acceptedTerms
    };
    
    const response = await publicApi.post('/auth/register', payload);
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    // Since login now provides complete user data, first check localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // If we have complete user data with ID, use it to fetch fresh data
      if (userData.id) {
        try {
          const response = await api.get(`/users/${userData.id}`);
          return response.data;
        } catch (error) {
          console.error('Failed to fetch user by ID:', error);
          // Return saved user data as fallback if it's complete
          return userData;
        }
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
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
    const response = await axios.post('https://backend.pmums.com/api/auth/email-otp/send', { email });
    return response.data;
  },

  // Verify email OTP (public endpoint)
  verifyEmailOtp: async (email, otp) => {
    const response = await publicApi.post('/auth/email-otp/verify', { email, otp });
    return response.data;
  },
};