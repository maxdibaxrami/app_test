import axios from 'axios';

// Retrieve initDataRaw from Telegram's launch parameters

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://copychic.ru/api', // Replace with your API base URL
  timeout: 40000, // Set a timeout for requests
});

// Add interceptor to attach either JWT or Telegram data on each request
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if a JWT token exists in local storage
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
