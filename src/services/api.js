import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL - direct connection to backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backend.pmums.com/api';

// Create axios instance for authenticated requests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create completely separate axios instance for public requests - no shared defaults
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Explicitly prevent any default authorization headers
  transformRequest: [
    (data, headers) => {
      // Remove any authorization headers before request
      delete headers.Authorization;
      delete headers.authorization;
      delete headers['Authorization'];
      delete headers['authorization'];
      
      if (headers.common) {
        delete headers.common.Authorization;
        delete headers.common.authorization;
      }
      
      return typeof data === 'object' ? JSON.stringify(data) : data;
    }
  ]
});

// Request interceptor to add auth token (only for main api instance)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for publicApi to ensure NO auth headers are ever sent
publicApi.interceptors.request.use(
  (config) => {
    // Completely rebuild headers to ensure no authorization
    const cleanHeaders = {
      'Content-Type': 'application/json'
    };
    
    // Copy over any custom headers that are NOT authorization-related
    if (config.headers) {
      Object.keys(config.headers).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (!lowerKey.includes('authorization') && 
            !lowerKey.includes('bearer') &&
            !lowerKey.includes('access-control') &&
            lowerKey !== 'content-type') {
          cleanHeaders[key] = config.headers[key];
        }
      });
    }
    
    // Replace headers completely
    config.headers = cleanHeaders;
    
    console.log('PublicAPI Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      hasAuthHeader: !!(config.headers.Authorization || config.headers.authorization)
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// DO NOT add any request interceptors to publicApi to keep it completely clean

// Response interceptor for error handling (apply to both instances)
const authErrorHandler = (error) => {
  const message = error.response?.data?.message || 'कुछ गलत हुआ है';
  
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.error('कृपया पुनः लॉगिन करें');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    toast.error('आपको इस कार्य की अनुमति नहीं है');
  } else if (error.response?.status >= 500) {
    toast.error('सर्वर में समस्या है। कृपया बाद में प्रयास करें।');
  } else {
    toast.error(message);
  }
  
  return Promise.reject(error);
};

const publicErrorHandler = (error) => {
  const message = error.response?.data?.message || 'कुछ गलत हुआ है';
  
  console.error('Public API Error:', {
    status: error.response?.status,
    url: error.config?.url,
    headers: error.config?.headers,
    message: message
  });
  
  // Only show user-friendly errors for public APIs, don't show auth errors
  if (error.response?.status >= 500) {
    toast.error('सर्वर में समस्या है। कृपया बाद में प्रयास करें।');
  } else if (error.response?.status === 403) {
    toast.error('यह सुविधा अभी उपलब्ध नहीं है। कृपया बाद में प्रयास करें।');
  } else if (error.response?.status !== 401) { // Don't show 401 errors for public APIs
    toast.error(message);
  }
  
  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  authErrorHandler
);

publicApi.interceptors.response.use(
  (response) => response,
  publicErrorHandler
);

export default api;
export { publicApi };