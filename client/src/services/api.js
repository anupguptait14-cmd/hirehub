import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';

    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    } else if (error.message === 'Network Error') {
      message = 'Network Error: Cannot connect to HireHub backend API server. Please ensure the backend server is running on port 5000 and MongoDB is active.';
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
