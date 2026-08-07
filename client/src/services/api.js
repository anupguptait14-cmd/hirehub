import axios from 'axios';

const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL || '/api';
  envUrl = envUrl.trim().replace(/\/+$/, '');
  
  if (envUrl.startsWith('http') && !envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  
  return envUrl;
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Request Interceptor: Always attach Bearer token if present in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors cleanly
API.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';

    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else if (error.message === 'Network Error') {
      message = 'Network Error: Cannot connect to HireHub backend API server. Please ensure the backend server is running on port 5000.';
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
