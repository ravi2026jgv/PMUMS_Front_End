import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token with backend
          const user = await authService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Step 1: Login and get token + user data
      const loginResponse = await authService.login(credentials);
      console.log('🔐 Login API response:', loginResponse);
      
      // Extract token and user data from response
      const token = loginResponse.token || loginResponse.data?.token || loginResponse.accessToken;
      const userData = loginResponse.user || loginResponse.data?.user;
      
      console.log('🔑 Extracted token:', token);
      console.log('👤 Extracted user data:', userData);
      console.log('🆔 User ID from login:', userData?.id);
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      if (!userData) {
        throw new Error('No user data received');
      }
      
      // Step 2: Clear old data first
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      console.log('🧹 Cleared old localStorage data');
      
      // Step 3: Store new token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 Stored new user data:', userData);
      console.log('💾 Stored user ID:', userData.id);
      
      // Step 4: Update AuthContext with user data
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      console.log('🔄 Updated AuthContext with user:', userData);
      
      // Step 5: Show success message
      const userName = userData.name || userData.username || 'उपयोगकर्ता';
      toast.success(`स्वागत है, ${userName}!`);
      
      return loginResponse;
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      // Clean up on failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authService.register(userData);
      toast.success('रजिस्ट्रेशन सफल! कृपया लॉगिन करें।');
      dispatch({ type: 'SET_LOADING', payload: false });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('आपका लॉगआउट सफल हुआ');
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Hard refresh user data function
  const refreshUser = async () => {
    try {
      console.log('🔄 Force refreshing user data...');
      const freshUser = await authService.getCurrentUser();
      dispatch({ type: 'LOGIN_SUCCESS', payload: freshUser });
      console.log('✅ User data refreshed:', freshUser);
      return freshUser;
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshUser, // Add refresh function to context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};