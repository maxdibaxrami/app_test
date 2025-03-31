import axios from 'axios';
//import { retrieveLaunchParams } from '@telegram-apps/sdk';

// Retrieve initDataRaw from Telegram's launch parameters
//const { initDataRaw } = retrieveLaunchParams();

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://copychic.ru/api', // Replace with your API base URL
  timeout: 40000, // Set a timeout for requests
});

/*
  / Add a request interceptor to include initDataRaw in the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    if (initDataRaw) {
      config.headers['Authorization'] = `tma ${initDataRaw}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

export default axiosInstance;
