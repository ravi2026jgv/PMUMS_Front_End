
import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext();

// Helper: decode JWT expiry
const getTokenExpiryTime = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // convert seconds to ms
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};
const getNextMidnightTime = () => {
  const now = new Date();

  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );

  return nextMidnight.getTime();
};

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
  const logoutTimerRef = useRef(null);

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const performAutoLogout = () => {
    clearLogoutTimer();
    authService.clearAllAuthData();
    localStorage.removeItem('loginDate');
    dispatch({ type: 'LOGOUT' });
    toast.error('आपका सत्र समाप्त हो गया है। कृपया दोबारा लॉगिन करें।');

    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

const setupAutoLogout = (token) => {
  clearLogoutTimer();

  const tokenExpiryTime = getTokenExpiryTime(token);
  const nextMidnightTime = getNextMidnightTime();

  if (!tokenExpiryTime) return;

  // Logout should happen at whichever comes first:
  // 1. Date change at 12:00 AM
  // 2. JWT token expiry
  const logoutTime = Math.min(tokenExpiryTime, nextMidnightTime);

  const timeLeft = logoutTime - Date.now();

  if (timeLeft <= 0) {
    performAutoLogout();
    return;
  }

  logoutTimerRef.current = setTimeout(() => {
    performAutoLogout();
  }, timeLeft);
};

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');

if (token) {
        const expiryTime = getTokenExpiryTime(token);

        const loginDate = localStorage.getItem('loginDate');
const todayDate = new Date().toISOString().split('T')[0];

if (!expiryTime || Date.now() >= expiryTime || loginDate !== todayDate) {
  authService.clearAllAuthData();
  dispatch({ type: 'LOGIN_FAILURE' });
  return;
}

        try {
          const user = await authService.getCurrentUser();
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          setupAutoLogout(token);
        } catch (error) {
          authService.clearAllAuthData();
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();

    return () => clearLogoutTimer();
  }, []);
  useEffect(() => {
  const interval = setInterval(async () => {
    const token = localStorage.getItem('authToken');

    if (!token) return;

    try {
      await api.get('/admin/security/session-status');
    } catch (error) {
      if (error.response?.status === 401) {
        clearLogoutTimer();
        authService.clearAllAuthData();
        dispatch({ type: 'LOGOUT' });

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  }, 30000);

  return () => clearInterval(interval);
}, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const loginResponse = await authService.login(credentials);

      const token = loginResponse.token || loginResponse.data?.token || loginResponse.accessToken;
      const userData = loginResponse.user || loginResponse.data?.user;

      if (!token) {
        throw new Error('No authentication token received');
      }

      if (!userData) {
        throw new Error('No user data received');
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

localStorage.setItem('authToken', token);
localStorage.setItem('loginDate', new Date().toISOString().split('T')[0]);

const verifiedUser = await authService.getCurrentUser();

dispatch({ type: 'LOGIN_SUCCESS', payload: verifiedUser });
      setupAutoLogout(token);

      const userName = userData.name || userData.username || 'उपयोगकर्ता';
      toast.success(`स्वागत है, ${userName}!`);

      return loginResponse;
    } catch (error) {
      authService.clearAllAuthData();
      clearLogoutTimer();
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
      clearLogoutTimer();
      await authService.logout();
      localStorage.removeItem('loginDate');
      dispatch({ type: 'LOGOUT' });
      toast.success('आपका लॉगआउट सफल हुआ');

      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
      authService.clearAllAuthData();
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/login';
    }
  };

  // Hard refresh user data function
  const refreshUser = async () => {
    try {
      const freshUser = await authService.getCurrentUser();
      dispatch({ type: 'LOGIN_SUCCESS', payload: freshUser });
      return freshUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
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