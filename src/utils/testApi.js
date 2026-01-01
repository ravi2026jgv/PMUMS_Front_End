// Simple test utility to check API without any authentication
import axios from 'axios';

export const testPublicEndpoint = async () => {
  try {
    console.log('Testing public API endpoint...');
    
    // Create a completely fresh axios instance with no defaults
    const testApi = axios.create({
      baseURL: 'https://backend.pmums.com/api',
      headers: {
        'Content-Type': 'application/json'
      },
      // Ensure no auth headers
      validateStatus: function (status) {
        return status < 500; // Accept any status code less than 500
      }
    });

    // Test districts endpoint
    const response = await testApi.get('/locations/districts');
    console.log('Districts response:', response.status, response.data);
    
    return response;
  } catch (error) {
    console.error('API test error:', error);
    throw error;
  }
};

export const testRegistration = async (userData) => {
  try {
    console.log('Testing registration endpoint...');
    
    const testApi = axios.create({
      baseURL: 'https://backend.pmums.com/api',
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return status < 500;
      }
    });

    const response = await testApi.post('/api/auth/otp/verify', userData);
    console.log('Registration response:', response.status, response.data);
    
    return response;
  } catch (error) {
    console.error('Registration test error:', error);
    throw error;
  }
};