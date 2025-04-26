import axios from 'axios';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

// Retrieve initDataRaw from Telegram launch parameters
const { initDataRaw } = retrieveLaunchParams();

const axiosInstance = axios.create({
  baseURL: 'https://copychic.ru/api',
  timeout: 40000,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (initDataRaw) {
      config.headers['Authorization'] = `tma ${initDataRaw}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
