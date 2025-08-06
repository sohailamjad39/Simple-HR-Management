// client/src/services/api.js
import axios from 'axios';

// Use VITE for environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle global errors (like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized (e.g., token expired, account deleted)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Prevent infinite loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Optional: Handle 403 - Forbidden
    if (error.response?.status === 403) {
      window.location.href = '/logout';
    }

    return Promise.reject(error);
  }
);

export default api;