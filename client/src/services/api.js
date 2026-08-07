import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    return Promise.reject(new Error(message));
  }
);

export default API;
