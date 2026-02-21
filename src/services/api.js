import axios from 'axios';

// API base URL - direct connection to backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
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
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  // Removed 403 and other error toasts to prevent unwanted popups
  
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
  
  // Removed all toast error messages to prevent unwanted popups
  
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

// Admin API functions
const adminAPI = {
  // Get all users with pagination and filters
  getUsers: (page = 0, size = 20, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters
    });
    return api.get(`/admin/users?${params}`);
  },

  // Get specific user by ID
  getUser: (id) => {
    return api.get(`/admin/users/${id}`);
  },

  // Block user
  blockUser: (id) => {
    return api.put(`/admin/users/${id}/block`);
  },

  // Unblock user
  unblockUser: (id) => {
    return api.put(`/admin/users/${id}/unblock`);
  },

  // Soft delete user
  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`);
  },

  // Update user role
  updateUserRole: (id, role) => {
    return api.put(`/admin/users/${id}/role`, { role });
  },

  // Export users as CSV
  exportUsers: (month, year) => {
    return api.get('/admin/users/export', { 
      params: { month, year },
      responseType: 'text' // Since it returns CSV as string
    });
  },

  // Get all death cases
  getDeathCases: () => {
    return api.get('/death-cases');
  },

  // Create death case
  createDeathCase: (formData) => {
    return api.post('/death-cases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Open death case
  openDeathCase: (id) => {
    return api.put(`/death-cases/${id}/show`);
  },

  // Close death case
  closeDeathCase: (id) => {
    return api.put(`/death-cases/${id}/hide`);
  },

  // Activate death case (kept for backward compatibility)
  activateDeathCase: (id) => {
    return api.put(`/death-cases/${id}/activate`);
  },

  // Deactivate death case (kept for backward compatibility)
  deactivateDeathCase: (id) => {
    return api.put(`/death-cases/${id}/deactivate`);
  },

  // Hide death case (Admin only)
  hideDeathCase: (id) => {
    return api.patch(`/death-cases/${id}/hide`);
  },

  // Show/Unhide death case (Admin only)
  showDeathCase: (id) => {
    return api.patch(`/death-cases/${id}/show`);
  },

  // Get dashboard stats (if you have this endpoint)
  getDashboardStats: () => {
    return api.get('/admin/dashboard/stats');
  },

  // Export death cases to Excel
  exportDeathCases: () => {
    return api.get('/death-cases/export', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  },

  // Get all receipts
  getReceipts: (params = {}) => {
    return api.get('/receipts', { params });
  },

  // Get manager assignments
  getManagerAssignments: (params = {}) => {
    return api.get('/manager/assignments', { params });
  },

  // Create manager assignment
  createManagerAssignment: (assignmentData) => {
    return api.post('/manager/assignments', assignmentData);
  },

  // Remove manager assignment
  removeManagerAssignment: (assignmentId) => {
    return api.delete(`/manager/assignments/${assignmentId}`);
  },

  // Remove ALL manager assignments for a user
  removeAllManagerAccess: (userId) => {
    return api.delete(`/manager/assignments/user/${userId}`);
  },

  // Get manager scope for a specific user
  getManagerScope: (managerId) => {
    return api.get('/manager/scope', { params: { managerId } });
  },

  // Location APIs - Using same pattern as registration
  getLocationHierarchy: () => {
    return api.get('/locations/hierarchy');
  }
};

// Manager API endpoints
const managerAPI = {
  // Manager Assignment APIs
  createAssignment: (assignmentData) => api.post('/manager/assignments', assignmentData),
  getAssignments: (params = {}) => api.get('/manager/assignments', { params }),
  getAssignmentsByLocation: (params = {}) => api.get('/manager/assignments/location', { params }),
  removeAssignment: (assignmentId) => api.delete(`/manager/assignments/${assignmentId}`),

  // Manager User Management APIs
  getAccessibleUsers: (params = {}) => api.get('/manager/users', { params }),
  getUsersByLocation: (params = {}) => api.get('/manager/users/location', { params }),
  getUserStats: () => api.get('/manager/users/stats'),
  blockUser: (userId, reason) => api.put(`/manager/users/${userId}/block`, { reason }),
  unblockUser: (userId) => api.put(`/manager/users/${userId}/unblock`),
  updateUserRole: (userId, role) => api.put(`/manager/users/${userId}/role`, { role }),

  // Manager Query System APIs
  createQuery: (queryData) => api.post('/manager/queries', queryData),
  getQueries: (params = {}) => api.get('/manager/queries', { params }),
  getQueryStats: () => api.get('/manager/queries/stats'),
  assignQuery: (queryId, managerId) => api.put(`/manager/queries/${queryId}/assign`, { managerId }),
  updateQueryStatus: (queryId, status) => api.put(`/manager/queries/${queryId}/status`, { status }),
  resolveQuery: (queryId, resolution) => api.put(`/manager/queries/${queryId}/resolve`, { resolution }),
  escalateQuery: (queryId) => api.put(`/manager/queries/${queryId}/escalate`),
  getPendingQueries: (params = {}) => api.get('/manager/queries/pending', { params }),
  getUrgentQueries: (params = {}) => api.get('/manager/queries/urgent', { params }),
  getMyQueries: (params = {}) => api.get('/manager/queries/my-queries', { params }),

  // Manager Dashboard APIs
  getDashboardOverview: () => api.get('/manager/dashboard/overview'),
  getManagerScope: (params = {}) => api.get('/manager/scope', { params }),
  getQuickStats: () => api.get('/manager/dashboard/stats'),
  getAlerts: () => api.get('/manager/dashboard/alerts'),
  getPermissions: () => api.get('/manager/dashboard/permissions')
};

// Export all APIs
export { adminAPI, managerAPI };